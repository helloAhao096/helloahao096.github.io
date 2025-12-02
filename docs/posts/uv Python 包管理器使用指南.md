---
title: uv Python 包管理器使用指南
description: uv 是由 Astral 开发的极快的 Python 包和项目管理工具，用于替代 pip、pip-tools、pipx、poetry、pyenv、twine、virtualenv 等工具。本文档介绍 uv 的基本概念、安装方法和常用操作。
date: 2025-12-01 15:03:37
tags:
  - Python
  - 工程化
---

> uv 是由 Astral（Ruff 的开发者）开发的极快的 Python 包和项目管理工具，使用 Rust 编写，比 pip 快 10-100 倍。

## 一、什么是 uv

**uv** 是一个用 Rust 编写的 Python 包和项目管理工具，旨在替代 `pip`、`pip-tools`、`pipx`、`poetry`、`pyenv`、`twine`、`virtualenv` 等多个工具。

### 核心特点

- **单一工具替代多个工具**：替代 pip、pip-tools、pipx、poetry、pyenv、twine、virtualenv 等
- **极快的速度**：比 pip 快 10-100 倍
- **全面的项目管理**：支持 lockfile、workspaces 等
- **脚本运行**：支持内联依赖元数据的脚本运行
- **Python 版本管理**：安装和管理 Python 版本
- **工具管理**：运行和安装 Python 包提供的命令行工具
- **pip 兼容接口**：提供 `uv pip` 接口，性能提升的同时保持熟悉的 CLI
- **跨平台**：支持 macOS、Linux 和 Windows

## 二、安装 uv

### 2.1 使用独立安装程序（推荐）

**macOS 和 Linux：**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows：**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

安装完成后，重启终端或运行 `source $HOME/.cargo/env`（Linux/macOS）使命令生效。

### 2.2 使用 pip 安装

```bash
pip install uv
```

### 2.3 使用 Homebrew 安装（macOS）

```bash
brew install uv
```

### 2.4 验证安装

```bash
uv --version
```

## 三、项目结构

使用 `uv init` 创建的项目结构如下：

```
my_project/
├── pyproject.toml      # 项目配置和依赖声明
├── uv.lock            # 锁定的依赖版本（自动生成）
├── .python-version    # Python 版本固定（可选）
└── src/               # 源代码目录（可选）
    └── my_project/
        └── __init__.py
```

### pyproject.toml 示例

```toml
[project]
name = "my-project"
version = "0.1.0"
description = ""
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "requests>=2.31.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
]
```

## 四、核心功能

### 4.1 项目管理

#### 初始化项目

```bash
# 创建新项目
uv init my_project
cd my_project

# 在现有目录中初始化
uv init
```

#### 添加依赖

```bash
# 添加依赖包
uv add requests

# 添加开发依赖
uv add --dev pytest

# 添加特定版本
uv add "fastapi>=0.100.0"

# 同时添加多个包
uv add fastapi uvicorn
```

#### 移除依赖

```bash
# 移除依赖包
uv remove requests

# 移除开发依赖
uv remove --dev pytest
```

#### 更新依赖

```bash
# 更新所有依赖到最新版本
uv lock --upgrade

# 更新特定依赖
uv lock --upgrade-package requests
```

#### 同步依赖

```bash
# 根据 pyproject.toml 和 uv.lock 同步环境
uv sync

# 仅安装依赖，不安装项目本身
uv sync --no-install-project

# 同步并更新 lockfile
uv sync --upgrade
```

#### 锁定依赖

```bash
# 生成或更新 uv.lock 文件
uv lock

# 更新所有依赖到最新版本
uv lock --upgrade
```

#### 查看依赖树

```bash
# 显示依赖树
uv tree

# 显示特定包的依赖
uv tree requests
```

#### 导出依赖

```bash
# 导出为 requirements.txt
uv export --format requirements-txt > requirements.txt

# 导出为 requirements.txt（包含哈希）
uv export --format requirements-txt --no-hashes > requirements.txt
```

#### 运行项目

```bash
# 在项目虚拟环境中运行 Python 脚本
uv run python main.py

# 运行项目中的命令（在 pyproject.toml 中定义的脚本）
uv run my-script
```

### 4.2 虚拟环境管理

#### 创建虚拟环境

```bash
# 使用默认 Python 版本创建虚拟环境
uv venv

# 使用特定 Python 版本
uv venv --python 3.11

# 指定虚拟环境路径
uv venv .venv
```

#### 激活虚拟环境

**Linux/macOS：**
```bash
source .venv/bin/activate
```

**Windows：**
```powershell
.venv\Scripts\activate
```

**注意**：使用 `uv run` 时无需手动激活虚拟环境，uv 会自动使用项目的虚拟环境。

### 4.3 脚本运行

uv 支持为单个脚本管理依赖，无需创建完整的项目。

#### 创建脚本并添加依赖

```bash
# 创建脚本文件
echo 'import requests; print(requests.get("https://astral.sh"))' > example.py

# 为脚本添加依赖（会在脚本中添加内联元数据）
uv add --script example.py requests
```

#### 运行脚本

```bash
# uv 会自动创建隔离的虚拟环境并运行脚本
uv run example.py
```

### 4.4 工具管理

uv 可以运行和安装 Python 包提供的命令行工具，类似 `pipx`。

#### 临时运行工具（不安装）

```bash
# 使用 uvx（uv tool run 的别名）
uvx pycowsay 'hello world!'

# 运行特定版本的工具
uvx ruff@0.1.0 check
```

#### 安装工具

```bash
# 全局安装工具
uv tool install ruff

# 安装后可以直接使用
ruff --version
```

### 4.5 Python 版本管理

uv 可以安装和管理多个 Python 版本。

#### 安装 Python 版本

```bash
# 安装单个版本
uv python install 3.11

# 安装多个版本
uv python install 3.10 3.11 3.12

# 安装特定版本
uv python install 3.12.0
```

#### 使用特定 Python 版本

```bash
# 创建使用特定版本的虚拟环境
uv venv --python 3.12

# 运行命令时指定 Python 版本
uv run --python 3.11 -- python script.py

# 在当前目录固定 Python 版本
uv python pin 3.11
```

#### 列出已安装的 Python 版本

```bash
uv python list
```

## 五、pip 兼容接口

uv 提供了 `uv pip` 接口，作为 pip、pip-tools 和 virtualenv 的替代品，可以在不改变现有工作流的情况下获得性能提升。

### 5.1 基本命令

```bash
# 安装包
uv pip install requests
uv pip install -r requirements.txt

# 列出已安装的包
uv pip list

# 显示包信息
uv pip show requests

# 卸载包
uv pip uninstall requests

# 冻结当前环境
uv pip freeze > requirements.txt
```

### 5.2 编译依赖

```bash
# 使用 uv pip compile（替代 pip-compile）
uv pip compile requirements.in --output-file requirements.txt

# 生成跨平台兼容的 requirements.txt
uv pip compile requirements.in --universal --output-file requirements.txt
```

### 5.3 同步依赖

```bash
# 使用 uv pip sync（替代 pip-sync）
uv pip sync requirements.txt
```

## 六、迁移指南

### 6.1 从 pip 迁移（使用 uv pip）

如果不想改变现有工作流，可以直接使用 `uv pip` 替代 `pip`：

```bash
# 创建虚拟环境
uv venv

# 激活虚拟环境
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate  # Windows

# 使用 uv pip 替代 pip（命令完全相同）
uv pip install -r requirements.txt
```

### 6.2 从 requirements.txt 迁移到 pyproject.toml

#### 方法一：手动迁移

```bash
# 1. 在现有项目目录中初始化
uv init

# 2. 手动编辑 pyproject.toml，添加依赖
# 或使用 uv add 逐个添加
uv add $(cat requirements.txt | grep -v '^#' | cut -d= -f1)

# 3. 同步环境
uv sync
```

#### 方法二：使用工具迁移

```bash
# 1. 从 requirements.txt 安装依赖
uv pip install -r requirements.txt

# 2. 导出为 pyproject.toml 格式（需要手动调整）
uv pip freeze > requirements_frozen.txt

# 3. 创建 pyproject.toml，手动迁移依赖
# 4. 使用 uv add 管理依赖
```

### 6.3 从 poetry/pipenv 迁移

```bash
# 1. 导出依赖
# Poetry: poetry export -f requirements.txt --output requirements.txt
# Pipenv: pipenv requirements > requirements.txt

# 2. 使用 uv 初始化项目
uv init

# 3. 从 requirements.txt 安装依赖
uv pip install -r requirements.txt

# 4. 使用 uv add 管理依赖，逐步迁移到 pyproject.toml
```

## 七、高级功能

### 7.1 工作区（Workspaces）

uv 支持 Cargo 风格的工作区，适用于大型项目：

```toml
# 在根目录的 pyproject.toml 中
[tool.uv.workspace]
members = ["packages/*"]
```

### 7.2 依赖覆盖

```bash
# 覆盖特定依赖的版本
uv add "requests==2.31.0" --override
```

### 7.3 平台特定依赖

```toml
[project]
dependencies = [
    "pywin32; sys_platform == 'win32'",
]
```

### 7.4 私有包索引

#### 命令行配置

```bash
# 配置私有索引
uv pip install --index-url https://pypi.example.com/simple package-name

# 使用额外索引
uv pip install --extra-index-url https://pypi.example.com/simple package-name
```

#### pyproject.toml 配置

```toml
[[tool.uv.index]]
name = "custom"
url = "https://pypi.example.com/simple"
```

### 7.5 缓存配置

```bash
# 查看缓存位置
uv cache dir

# 清理缓存
uv cache clean
```

### 7.6 环境变量配置

```bash
# 设置缓存目录
export UV_CACHE_DIR=/path/to/cache

# 设置索引 URL
export UV_INDEX_URL=https://pypi.example.com/simple
```

## 八、最佳实践

### 8.1 项目开发

1. **使用 `uv init` 创建新项目**：自动生成正确的项目结构
2. **使用 `uv add` 添加依赖**：自动更新 `pyproject.toml` 和 `uv.lock`
3. **提交 `uv.lock` 到版本控制**：确保团队使用相同的依赖版本
4. **使用 `uv sync` 同步环境**：确保环境与 lockfile 一致

### 8.2 团队协作

1. **统一工具**：团队统一使用 uv 管理依赖
2. **锁定文件**：确保 `uv.lock` 文件被提交到版本控制
3. **文档说明**：在 README 中说明使用 uv 的安装和运行步骤

### 8.3 CI/CD 集成

在 CI/CD 中使用 uv 可以显著加速构建：

```yaml
# GitHub Actions 示例
- name: Install uv
  run: curl -LsSf https://astral.sh/uv/install.sh | sh

- name: Install dependencies
  run: uv sync

- name: Run tests
  run: uv run pytest
```

## 九、常见问题

### Q1: uv 和 pip 有什么区别？

**A:** uv 是 pip 的替代品，提供：
- 更快的速度（10-100 倍）
- 更全面的功能（项目管理、Python 版本管理等）
- pip 兼容接口（`uv pip`），可以直接替代 pip

### Q2: 是否需要卸载 pip？

**A:** 不需要。uv 可以独立使用，也可以与 pip 共存。你可以逐步迁移到 uv。

### Q3: uv 支持哪些 Python 版本？

**A:** uv 支持 Python 3.8 及以上版本，可以安装和管理多个 Python 版本。

### Q4: uv.lock 文件应该提交吗？

**A:** 是的，应该提交 `uv.lock` 文件到版本控制，以确保团队使用相同的依赖版本。

### Q5: 如何处理依赖冲突？

**A:** uv 会自动解析依赖冲突。如果遇到问题，可以使用 `uv tree` 查看依赖树，或使用 `uv add --override` 覆盖特定依赖版本。

### Q6: 如何从 requirements.txt 迁移？

**A:** 参见[迁移指南](#六迁移指南)章节。最简单的方式是使用 `uv pip install -r requirements.txt`，然后逐步迁移到 `pyproject.toml`。

### Q7: uv 的缓存在哪里？

**A:** 使用 `uv cache dir` 查看缓存位置。默认情况下，缓存位于用户目录下的 `.cache/uv`。

## 十、参考资源

### 官方文档

- [uv 官方文档](https://docs.astral.sh/uv/)
- [GitHub 仓库](https://github.com/astral-sh/uv)
- [安装指南](https://docs.astral.sh/uv/getting-started/installation/)
- [快速开始](https://docs.astral.sh/uv/getting-started/first-steps/)

### 相关工具

- [Ruff](https://github.com/astral-sh/ruff) - 极快的 Python linter 和代码格式化工具（同样由 Astral 开发）

### 迁移指南

- [从 pip 迁移](https://docs.astral.sh/uv/guides/migration/)
- [pip 兼容性说明](https://docs.astral.sh/uv/pip/compatibility/)

---

**总结：** uv 是一个现代化的 Python 包管理工具，通过极快的速度和全面的功能，可以显著提升 Python 项目的开发效率。无论是新项目还是现有项目，都可以从 uv 中受益。
