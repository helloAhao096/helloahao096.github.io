---
title: LangGraph 人机环路 interrupt
description: LangGraph 人机环路 interrupt 完整使用指南
date: 2025-10-03
tags:
- LangGraph
---

# LangGraph 人机环路 (Human-in-the-Loop) 使用指南

## 概述

**Human-in-the-Loop (HITL，人机在环)** 是一种设计模式，允许在 AI Agent 工作流的关键节点插入人类决策和审查。

在 LangGraph 中，通过 `interrupt`（中断）机制实现：
- 工作流在指定节点暂停执行
- 等待人类输入或确认
- 通过 `Command` 恢复执行，继续运行

**典型应用场景：**
- 敏感操作前的审批（如调用外部 API、执行删除操作）
- 内容审核和确认
- 需要人工验证的决策点
- 动态参数调整

## 核心概念

| 概念 | 解释 | 作用 | 必要条件 |
| :--- | :--- | :--- | :--- |
| **Human-in-the-Loop (HITL)** | 将**人类的决策和审查**集成到 AI Agent 工作流中的设计模式 | 提高 Agent 的**可靠性、准确性**和**安全性**，特别是在执行敏感或高风险操作时 | **必须**配置 **Checkpointer** |
| **`interrupt` (中断)** | LangGraph 中实现 HITL 的**核心函数**，用于在图执行过程中的**任意节点内部**动态暂停执行 | 立即停止工作流，将当前完整状态保存到持久化层，**等待人类输入** | **必须**配置 **Checkpointer**<br>**必须**在运行配置中提供 **Thread ID** |
| **Checkpointer** (持久化层) | LangGraph 的**状态保存机制**，用于记录图的每一步执行状态 | 确保工作流在被 `interrupt` 暂停后，可以**无限期地保存状态**，并在人类输入后**从中断点精确恢复** | **使用 `interrupt` 的前提** |
| **Command** (恢复命令) | 特殊对象（通常带有 `resume` 或 `update` 字段），用于**恢复**被 `interrupt` 暂停的图的执行 | 将人类的**输入/反馈**注入到工作流中，作为 `interrupt()` 函数的**返回值**，驱动 Agent 继续下一步 | 在 `interrupt` 发生后，用于**恢复**图的执行 |

### 前置条件

要成功使用 LangGraph 的 Human-in-the-Loop (`interrupt`) 功能，**必须满足**以下两个条件：

1. **配置 Checkpointer (持久化层)**：它是保存中断状态的基础
2. **提供 Thread ID**：它是用于标识和加载特定工作流状态的唯一键

## 第一步：配置 Checkpointer

Checkpointer 是使用 `interrupt` 的**前提条件**，它负责保存和恢复工作流状态。

### 基础示例

```python
from langgraph.graph import StateGraph
from langgraph.checkpoint import MemorySaver
from typing import TypedDict, Annotated, List
import operator

# 定义状态结构
class State(TypedDict):
    history: Annotated[List[str], operator.add]
    
# 1. 实例化 Checkpointer
# 注意：MemorySaver 仅用于开发测试，生产环境应使用 SQLiteSaver 或 PostgresSaver
checkpointer = MemorySaver()

def simple_node(state: State) -> State:
    """一个简单的节点，记录执行历史"""
    return {"history": ["Node A executed."]}

# 2. 构建图
builder = StateGraph(State)
builder.add_node("A", simple_node)
builder.set_entry_point("A")
builder.add_edge("A", "A") # 增加一个自循环，方便多次运行

# 3. 编译图，传入 checkpointer
app = builder.compile(checkpointer=checkpointer)

# 4. 定义会话 ID (Thread ID)
# thread_id是langgraph中对于整个图的重要标识，需要是唯一性的，笔者习惯使用uuid来命名thread id，也可以自定义一个唯一的字符串，作为id

THREAD_ID = "my-unique-chat-id-1" 
# 需要完全按照这个 dict的格式来定义langgraph的config
CONFIG = {"configurable": {"thread_id": THREAD_ID}}

# --- 首次调用 (写入 Checkpoint) ---

print("--- 首次调用：写入 Checkpoint ---")
app.invoke({"history": ["Start."]}, config=CONFIG)

# --- 第二次调用 (读取并更新 Checkpoint) ---
print("--- 第二次调用：从 Checkpoint 恢复 ---")
# 传入相同 ID，LangGraph 会加载上次的状态并继续执行
result = app.invoke({"history": ["Continue."]}, config=CONFIG) 

print("\n[最终历史状态]")
# 结果中将包含两次运行累积的历史
print(result['history'])

# --- 验证 Checkpoint ---
print("\n[验证持久化]")
final_checkpoint = checkpointer.get(CONFIG)
print(f"Checkpointer 中保存的最后一步状态: {final_checkpoint['channel_values']['history']}")
```

## interrupt/Command(resume/update)

是LangGraph中对于人机环路的最核心的函数，调用的目的是在关键节点（Node）调用这个方法，打断并且阻塞workflow，从而让用户提供输入，更新到LangGraph中，修改State或者做出一些定制化的操作

对于LangGraph的interrupt，官方文档的描述对于初学者来说真的是云里雾里。

按照我的思考和理解，对于需要人机交互的地方，最好是单独给interrupt提供一个节点，这个节点中做一些获取human输入，修改state的操作。


```python
# 简化的代码片段，只展示了必要的代码段落，不是完整代码
from langgraph.types import interrupt, Command

# 在需要进行interrupt的节点，使用这个函数
def node_A(state: State):
    # 调用 interrupt() 暂停执行。
    # 传递给 interrupt 的字符串是给用户的提示信息。
    human_input = interrupt("请输入 'ok' 或 'stop' 来继续工作流:")
    print(f"[Agent] 📝 已收到输入: '{human_input}'")
    # interrupt 的返回值 (human_input) 用于更新状态
    return {"review_result": [human_input]}


app = builder.compile(checkpointer=checkpointer)
# 注入人类输入
# 假设人类决定继续（这里的人类输入的参数，可以是任意数据）
# 我刚学习的时候，最困惑的，虽然是通过interrupt打断后，让人类输入。但是人类应该怎么输入，如何交互。
HUMAN_RESPONSE = "ok" 

print(f"\n--- 恢复调用：注入输入 '{HUMAN_RESPONSE}' ---")

# 使用 Command(resume=...) 恢复图的执行
# 这个Command是最重要的，是激活和输入interrupt的关键
# 我如果想要在上面的Node中获得 human input，并且继续执行 interrupt函数后面的逻辑。则在需要进行交互的地方，使用invoke，对图继续交互，并且使用Command函数，并且附带resume参数
# 第一种Command参数
final_state = app.invoke(Command(resume=HUMAN_RESPONSE), config=CONFIG)
# final_state，是图运行后的当前的最新的state状态。

# 第二种Command参数
app.invoke(Command(
        # 1. 状态更新 (Dict)
        update={
            "counter": initial_value, 
            "history": ["A: Counter initialized to 10."],
        }))
在command中使用update参数，能在所需的地方单纯的更新langgraph的state，但是不让workflow继续执行下去。


```

## 最佳实践

1. **独立节点设计**：将 `interrupt` 放在独立的节点中，便于管理和维护
2. **清晰的提示信息**：在 `interrupt()` 中提供清晰的提示，指导用户输入
3. **状态验证**：在恢复执行前，验证人类输入的有效性
4. **错误处理**：处理异常情况，如超时、无效输入等
5. **持久化存储**：生产环境使用 `SQLiteSaver` 或 `PostgresSaver` 替代 `MemorySaver`
6. **Thread ID 管理**：使用 UUID 或唯一标识符管理 Thread ID，避免冲突

## 参考文档

- [LangGraph 官方文档 - Human-in-the-Loop](https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/add-human-in-the-loop/#pause-using-interrupt)
