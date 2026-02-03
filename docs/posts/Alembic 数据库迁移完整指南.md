---
title: Alembic 数据库迁移完整指南
description: 基于实际项目经验，提供 Alembic 数据库迁移的完整实战指南。涵盖从零初始化、异步模式配置、开发工作流、生产环境部署到常见坑点解决方案。
date: 2026-02-03 14:00:00
tags:
  - Alembic
  - SQLAlchemy
  - FastAPI
  - Python
  - 数据库迁移
  - 工程化
---

# Alembic 数据库迁移完整指南

> 本指南基于 FastAPI + SQLAlchemy + Asyncpg 的现代化异步后端架构，详细阐述如何引入和规范使用 Alembic 进行数据库版本管理。

## 目录

- [一、核心概念与价值](#一核心概念与价值)
- [二、环境初始化与配置](#二环境初始化与配置)
- [三、开发阶段工作流](#三开发阶段工作流)
- [四、生产环境部署方案](#四生产环境部署方案)
- [五、关键坑点与解决方案](#五关键坑点与解决方案)
- [六、常用命令速查](#六常用命令速查)

---

## 一、核心概念与价值

### 1.1 为什么要用 Alembic？

在项目初期，我们可能会使用 `Base.metadata.create_all(engine)` 来自动建表。但这在生产环境中存在严重问题：
- **无法修改表结构**：一旦表存在，`create_all` 不会检测字段变更（如增加一列）。
- **缺乏版本控制**：数据库的变更没有记录，无法回滚。
- **环境不一致**：开发、测试、生产环境的数据库结构难以保持同步。

Alembic 通过生成迁移脚本（Migration Scripts），将数据库的每一次变更代码化、版本化，实现：
- **可回溯**：每一次变更都有独立的 Python 脚本记录。
- **可重复**：在任何新环境中，执行同样的命令即可还原出完全一致的数据库结构。
- **自动化**：结合 CI/CD 实现零人工干预的数据库升级。

### 1.2 核心术语

| 术语 | 说明 |
|------|------|
| **Revision (版本)** | 每一次数据库变更对应一个 Python 脚本文件（如 `ecf9656b368f_add_user_age.py`）。 |
| **Upgrade (升级)** | 执行迁移，将数据库结构升级到更新的版本。 |
| **Downgrade (降级)** | 回滚迁移，撤销上一次的操作。 |
| **Head (最新)** | 数据库版本链的顶端，即最新状态。 |
| **Base (基准)** | 数据库的初始状态（空库）。 |

---

## 二、环境初始化与配置

### 2.1 安装依赖

推荐使用 `uv` 管理依赖，项目需包含 `alembic` 和异步驱动 `asyncpg`。

```bash
uv add alembic asyncpg
```

### 2.2 初始化项目 (异步模式)

在后端项目根目录（如 `backend/`）执行：

```bash
# -t async 参数至关重要，生成异步配置模板
uv run alembic init -t async alembic
```

### 2.3 关键配置修改

#### 1. 修改 `alembic.ini`
注释掉硬编码的数据库连接，避免敏感信息泄露，也便于动态读取环境变量。

```ini
# alembic.ini
# sqlalchemy.url = driver://user:pass@localhost/dbname  <-- 注释掉这行
```

#### 2. 配置 `alembic/env.py` (核心)
这是 Alembic 的大脑，我们需要让它知道：
1. **连接哪个数据库**（从项目配置读取）。
2. **有哪些数据模型**（导入所有 Model）。
3. **哪些表需要忽略**（过滤掉不需要管理的表）。

```python
# backend/alembic/env.py 核心修改点

# 1. 导入项目配置和模型基类
from core.config import settings
from db.base import Base

# 2. 【关键】导入所有业务模型，否则 autogenerate 无法检测到表！
# 必须显式导入所有包含 Model 定义的模块
from modules.user import models as user_models
from modules.file import models as file_models
# ... 其他模块

# 3. 动态设置数据库连接 (覆盖 alembic.ini)
config.set_main_option("sqlalchemy.url", settings.database_url)

# 4. 配置 Metadata
target_metadata = Base.metadata

# 5. 【进阶】配置 include_object 过滤不需要管理的表
# 例如：忽略 LangGraph 自动生成的 checkpoint 表
def include_object(object, name, type_, reflected, compare_to):
    if type_ == "table" and name.startswith("checkpoint"):
        return False
    return True

# 在 context.configure 中注册 include_object
def run_migrations_offline():
    context.configure(
        # ... 其他配置
        include_object=include_object
    )

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        include_object=include_object  # 记得在 online 模式也加上
    )
```

---

## 三、实战操作手册

本章节分为**“项目初始化”**（首次引入 Alembic）和**“日常开发迭代”**（后续更新）两部分，请根据当前阶段查阅。

### 3.1 阶段一：项目初始化 (首次使用)

这是从零开始让 Alembic 接管数据库的关键步骤。目标是生成第一个基准版本（Baseline）。

#### 1. 前置准备 (至关重要)
由于 `autogenerate` 的原理是 **对比「代码中的 Model」和「数据库中的现有表」**：
*   如果数据库里已经有了表，Alembic 会觉得"不需要创建"，甚至会生成 `DROP TABLE`（因为它觉得已存在的表不在 metadata 里）。
*   **最佳实践**：**让 Alembic 面对一个空的数据库（Schema Public 为空）**。

#### 2. 操作步骤

1.  **清理本地测试数据库**（确保它是空的）：
    *   可以直接在数据库工具中执行：`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
    *   或者删除 Docker Volume 重建 DB 容器。

2.  **生成初始迁移脚本**：
    在 `backend` 目录下执行：
    ```bash
    uv run alembic revision --autogenerate -m "initial_schema"
    ```

3.  **人工修正脚本 (必须检查！)**：
    打开生成的 `backend/alembic/versions/xxxx_initial_schema.py`，必须做以下检查：
    *   **检查 1：是否有 `import pgvector`？**
        *   如果有 `sa.Column('embedding', pgvector.sqlalchemy.vector.VECTOR(1536))`，文件头部**必须**手动添加 `import pgvector`。
    *   **检查 2：开启 Vector 扩展**
        *   在 `upgrade()` 函数的第一行，手动添加：
        ```python
        def upgrade() -> None:
            # 手动添加这一行，防止报错
            op.execute("CREATE EXTENSION IF NOT EXISTS vector") 
            # ... 下面是 create_table ...
        ```
    *   **检查 3：是否有不该有的 Drop？**
        *   确认没有 `op.drop_table('checkpoint_...')`。如果有，说明 `env.py` 里的 `include_object` 配置没生效，或者您没有清空数据库。

4.  **应用迁移**：
    ```bash
    uv run alembic upgrade head
    ```

5.  **验证**：
    查看数据库，表应该都创建好了，且 `alembic_version` 表里有一条记录。

---

### 3.2 阶段二：日常开发迭代 (后续更新)

当您开发新功能（例如给 User 表加个字段，或者新建一个 KnowledgeBase 表）时，遵循此流程。

#### 1. 修改代码 (Python)
在您的 `models.py` 中修改 SQLAlchemy 模型。
*   例如：在 `User` 模型中添加 `age = Column(Integer, default=18)`。

#### 2. 生成迁移脚本
执行命令，让 Alembic 自动检测差异：
```bash
uv run alembic revision --autogenerate -m "add_age_to_user"
```
*   注：`-m` 后面写清楚这次改了什么，方便以后查阅。

#### 3. 审查脚本 (Code Review)
**永远不要盲目信任 autogenerate！** 打开生成的 `versions/xxxx_add_age_to_user.py`：
*   **看 `upgrade()`**：是不是只有一个 `op.add_column`？有没有奇怪的 `op.drop_table`？
*   **看 `downgrade()`**：是不是对应的 `op.drop_column`？
*   **看 Imports**：如果用到了特殊类型（如新加了 Vector 字段），确认文件头有没有 `import pgvector`。

#### 4. 应用变更 (Local)
在本地开发环境应用变更，测试代码是否正常运行：
```bash
uv run alembic upgrade head
```

#### 5. 提交代码 (Git)
将 `models.py` 的修改和 `alembic/versions/xxxx.py` 新生成的脚本**一起提交**到 Git 仓库。
*   **切记**：`versions` 文件夹里的脚本是代码的一部分，必须进版本控制。

---

### 3.3 关键注意事项清单 (Cheat Sheet)

1. **关于 pgvector (向量库)**
   *   **痛点**：Alembic 的 `autogenerate` 经常会漏掉 `import pgvector`。
   *   **对策**：每次生成脚本后，习惯性看一眼头部。如果报错 `NameError: name 'pgvector' is not defined`，就是这个问题。

2. **关于 LangGraph / LangChain 的表**
   *   **痛点**：LangGraph 会自动在库里创建 `checkpoint_` 开头的表，Alembic 每次都想把它们删掉。
   *   **对策**：我们在 `env.py` 里配置了 `include_object` 函数来过滤 `checkpoint` 开头的表。确保不要误删该配置。

3. **只有本地需要 autogenerate**
   *   **开发环境**：运行 `revision --autogenerate` 生成脚本。
   *   **生产/测试环境**：**绝对不要**运行 `revision`。服务器上只运行 `upgrade head` 来消费你在本地生成的脚本。

4. **团队协作冲突**
   *   **场景**：你生成了一个版本 `rev_a`，你同事生成了 `rev_b`，你们的父版本都是 `rev_base`。这叫"分叉 (Branching)"。
   *   **解决**：
       1.  `uv run alembic heads` 会显示有分叉。
       2.  `uv run alembic merge heads -m "merge_branches"` 合并分叉。
       3.  或者，在这个发生前，先拉取同事代码，`upgrade head` 到最新，然后再生成你的迁移脚本。

5.  **如果搞砸了 (Undo)**
    *   如果你执行了 `upgrade` 但发现模型设计错了，想重来：
        1.  执行 `uv run alembic downgrade -1`（回退一步）。
        2.  删除刚才生成的 `versions/xxxx.py` 文件。
        3.  修改 `models.py`。
        4.  重新生成 revision。

---

## 四、生产环境部署方案

在生产环境中，严禁手动修改数据库或手动运行迁移命令。推荐采用 **GitOps + Init Container** 模式。

### 4.1 核心原则
**“代码即真理”**：Docker 镜像中必须包含生成的迁移脚本 (`versions/*.py`)。部署时，使用镜像内的脚本升级数据库。

### 4.2 部署流程

```mermaid
sequenceDiagram
    participant Dev as 开发者
    participant Git as Git仓库
    participant CI as CI构建
    participant Registry as 镜像仓库
    participant K8s as K8s集群
    participant DB as 生产数据库

    Dev->>Git: 提交代码 + 迁移脚本
    Git->>CI: 触发构建
    CI->>CI: docker build (包含 /alembic)
    CI->>Registry: docker push
    
    K8s->>Registry: 拉取新镜像
    
    rect rgb(240, 248, 255)
        note right of K8s: Init Container 阶段
        K8s->>DB: alembic upgrade head
        DB-->>K8s: 数据库结构升级完成
    end
    
    rect rgb(240, 255, 240)
        note right of K8s: Main Container 阶段
        K8s->>DB: uvicorn 启动服务
        K8s->>Dev: 部署成功
    end
```

1. **CI 构建阶段**：
   - 执行 `docker build`。
   - `COPY . /app` 指令将 `alembic/` 目录打入镜像。
   - 产出包含最新代码和最新数据库版本的镜像。

2. **CD 部署阶段 (K8s)**：
   - 使用 **Init Container** 在主服务启动前执行迁移。
   - 如果迁移失败，主服务不会启动，防止数据损坏。

**K8s Deployment 示例：**

```yaml
spec:
  template:
    spec:
      initContainers:
        - name: db-migration
          image: my-repo/backend:latest  # 使用与业务相同的镜像
          # 覆盖启动命令，只执行数据库升级
          command: ["sh", "-c", "uv run alembic upgrade head"]
          envFrom:
            - configMapRef:
                name: backend-config
      containers:
        - name: backend
          image: my-repo/backend:latest
          # 正常启动业务服务
          command: ["uvicorn", "main:app", "--host", "0.0.0.0"]
```

---

## 五、关键坑点与解决方案

### 5.1 初始迁移生成了空脚本？
**现象**：运行 `revision --autogenerate` 后，生成的 `upgrade()` 函数里是 `pass`。
**原因**：本地数据库的结构已经和代码一致了（可能之前自动创建过）。
**解决**：
1. **方案 A (推荐)**：清空本地数据库（`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`），让 Alembic 看到一个空库，它才会生成 `CREATE TABLE` 语句。
2. **方案 B (保留数据)**：手动创建一个临时的空数据库（`CREATE DATABASE temp_db`），连接该库生成脚本。

### 5.2 生成了大量的 `DROP TABLE`？
**现象**：脚本里要把系统表或不需要管理的表删掉。
**原因**：`env.py` 中的 `target_metadata` 无法识别数据库中已存在的某些表（如 Celery 或 LangGraph 自动创建的表）。
**解决**：在 `env.py` 中配置 `include_object` 钩子函数，过滤掉这些表（见 2.3 节代码示例）。

### 5.3 远程数据库连接失败？
**现象**：本地运行 Docker 容器连接远程库进行迁移时超时。
**原因**：网络白名单或 VPN 问题。
**解决**：确保本地 IP 在远程数据库的白名单内，或者直接在能访问数据库的跳板机上运行容器。

### 5.4 必须是 Superuser 吗？
**问题**：执行迁移需要什么权限？
**答案**：
- 普通表变更：只需要 Schema 的 DDL 权限（Create/Alter/Drop Table）。
- **Vector 扩展**：`CREATE EXTENSION vector` 通常需要 Superuser 权限。
- **建议**：联系 DBA 提前在库里执行一次 `CREATE EXTENSION vector;`，后续迁移即使用普通账号也能成功（脚本里的 `IF NOT EXISTS` 会跳过执行）。

### 5.5 NameError: name 'pgvector' is not defined
**现象**：执行迁移时报错，提示找不到 `pgvector`。
**原因**：虽然 `models.py` 里导入了，但 Alembic 自动生成的迁移脚本文件头经常**漏掉**导入语句。
**解决**：手动在 `versions/xxxx.py` 文件头部添加 `import pgvector`。

---

## 六、常用命令速查

所有命令需在 `backend` 目录下执行（或在 Docker 容器内）：

| 场景 | 命令 |
|------|------|
| **生成自动迁移** | `uv run alembic revision --autogenerate -m "描述"` |
| **应用到最新** | `uv run alembic upgrade head` |
| **回滚一步** | `uv run alembic downgrade -1` |
| **回滚到指定版本** | `uv run alembic downgrade <revision_id>` |
| **查看迁移历史** | `uv run alembic history` |
| **查看当前状态** | `uv run alembic current` |
| **标记为最新 (不执行)** | `uv run alembic stamp head` (慎用，仅用于修复版本记录) |

---

## 七、结语

引入 Alembic 是项目走向成熟的标志。虽然初期配置和理解概念需要一定成本，但它带来的**环境一致性**和**部署安全性**是无价的。

**记住黄金法则**：
> **修改模型 -> 生成脚本 -> 检查脚本 -> 本地验证 -> 提交代码**。
> 永远不要手动修改生产数据库。
