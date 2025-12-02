---
title: GitHub Action完整示例详解
description: GitHub Action 完整工作流程详解、配置示例、最佳实践
date: 2025-11-16
tags:
  - GitHub
  - CI/CD
---

# GitHub Action 完整示例详解

## 什么是 GitHub Actions？

GitHub Actions 是 GitHub 提供的持续集成和持续部署 (CI/CD) 平台，允许你自动化软件开发工作流程。你可以直接在 GitHub 仓库中构建、测试和部署代码。

## 核心概念

### 1. Workflow（工作流）
- **定义**：一个可配置的自动化流程，由一个或多个作业组成
- **位置**：`.github/workflows/` 目录下的 YAML 文件
- **命名**：文件名可以任意，但建议使用描述性名称，如 `deploy.yml`、`ci.yml`

### 2. Job（作业）
- **定义**：工作流中的一组步骤，在同一个运行器上执行
- **特点**：默认并行执行，可通过 `needs` 设置依赖关系

### 3. Step（步骤）
- **定义**：作业中的单个任务
- **类型**：
  - `uses`：使用预定义的操作（Action）
  - `run`：执行 shell 命令

### 4. Action（操作）
- **定义**：可重用的工作流单元
- **来源**：GitHub 市场、自定义、第三方仓库

## 完整配置文件示例

以下是一个完整的 VitePress 博客自动部署配置示例：

```yaml
# .github/workflows/deploy-pages.yml
name: Deploy

# 触发条件
on:
  push:
    branches:
      - master
  # 可选：手动触发
  workflow_dispatch:
  # 可选：定时触发（每天 UTC 0 点）
  # schedule:
  #   - cron: '0 0 * * *'

# 作业定义
jobs:
  deploy:
    # 运行环境
    runs-on: ubuntu-latest
    
    # 步骤序列
    steps:
      # 步骤 1: 检出代码
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 获取完整 git 历史，用于生成提交信息
      
      # 步骤 2: 设置 pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.15.3  # 指定 pnpm 版本
      
      # 步骤 3: 设置 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20  # 指定 Node.js 版本
          cache: pnpm  # 启用 pnpm 缓存，加速依赖安装
      
      # 步骤 4: 安装依赖
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        # --frozen-lockfile 确保使用锁定文件，避免版本不一致
      
      # 步骤 5: 构建项目
      - name: Build
        run: pnpm run docs:build
        # 执行构建命令，生成静态文件到 docs/.vitepress/dist
      
      # 步骤 6: 添加 CNAME 文件（自定义域名）
      - name: Add CNAME file
        run: echo "blog.mapin.net" > ./docs/.vitepress/dist/CNAME
        # 创建 CNAME 文件，用于 GitHub Pages 自定义域名
      
      # 步骤 7: 部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          # GitHub 自动生成的 token，用于认证
          github_token: ${{ secrets.GITHUB_TOKEN }}
          
          # 静态资源目录（构建产物所在位置）
          publish_dir: docs/.vitepress/dist
          
          # 发布分支（不能是拉取代码的分支）
          publish_branch: gh-pages
          
          # 使用触发工作流的提交信息
          full_commit_message: ${{ github.event.head_commit.message }}
          
          # 保留现有文件（如 CNAME、.nojekyll 等）
          keep_files: true
```

## 配置详解

### 1. 触发条件 (on)

```yaml
on:
  # 推送到指定分支时触发
  push:
    branches:
      - master
      - main
    # 可选：指定文件路径
    paths:
      - 'docs/**'
      - '.github/workflows/**'
  
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'production'
  
  # 定时触发（UTC 时间）
  schedule:
    - cron: '0 0 * * *'  # 每天 0 点
  
  # Pull Request 触发
  pull_request:
    branches:
      - master
    types: [opened, synchronize, reopened]
```

### 2. 运行环境 (runs-on)

```yaml
runs-on: ubuntu-latest  # 推荐，最新稳定版
# 其他选项：
# runs-on: ubuntu-22.04
# runs-on: windows-latest
# runs-on: macos-latest
# runs-on: self-hosted  # 自托管运行器
```

### 3. 环境变量

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      NODE_ENV: production
      BUILD_TIME: ${{ github.event.head_commit.timestamp }}
    steps:
      - name: Use environment variable
        run: echo $NODE_ENV
```

### 4. 条件执行

```yaml
steps:
  - name: Conditional step
    if: github.ref == 'refs/heads/master'
    run: echo "只在 master 分支执行"
  
  - name: Skip on fork
    if: github.event.repository.fork == false
    run: echo "不在 fork 仓库执行"
```

### 5. 矩阵构建

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

## 常用 Actions 推荐

### 1. 代码检出
```yaml
- uses: actions/checkout@v3
  with:
    fetch-depth: 0  # 完整历史
    ref: main  # 指定分支
    token: ${{ secrets.PERSONAL_TOKEN }}  # 私有仓库需要
```

### 2. Node.js 设置
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'  # 或 'npm', 'yarn'
```

### 3. pnpm 设置
```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9.15.3
```

### 4. 缓存依赖
```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      node_modules
      ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

### 5. 部署到 GitHub Pages
```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    publish_branch: gh-pages
```

## 完整工作流程示例

### 示例 1: 基础 CI/CD 流程

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [master, main]
  pull_request:
    branches: [master, main]

jobs:
  # 代码检查
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
  
  # 运行测试
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test
  
  # 构建和部署
  build-and-deploy:
    needs: [lint, test]  # 依赖其他作业
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v4
        with:
          version: 9.15.3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
```

### 示例 2: 多环境部署

```yaml
name: Multi-Environment Deploy

on:
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Build
        env:
          NODE_ENV: ${{ github.event.inputs.environment }}
        run: pnpm run build
      
      - name: Deploy to Staging
        if: github.event.inputs.environment == 'staging'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages-staging
      
      - name: Deploy to Production
        if: github.event.inputs.environment == 'production'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          publish_branch: gh-pages
```

## 上下文变量和表达式

GitHub Actions 提供了丰富的上下文变量：

```yaml
# 常用上下文变量
${{ github.repository }}          # 仓库名（如：owner/repo）
${{ github.ref }}                 # 分支或标签引用
${{ github.sha }}                 # 提交 SHA
${{ github.actor }}               # 触发工作流的用户名
${{ github.event.head_commit.message }}  # 提交信息
${{ secrets.GITHUB_TOKEN }}       # 自动生成的 token
${{ secrets.CUSTOM_SECRET }}      # 自定义密钥（需在 Settings > Secrets 中配置）

# 条件表达式
${{ github.ref == 'refs/heads/master' }}
${{ github.event_name == 'push' }}
${{ contains(github.event.head_commit.message, 'deploy') }}
```

## 最佳实践

### 1. 使用锁定文件
```yaml
- run: pnpm install --frozen-lockfile
# 或
- run: npm ci  # npm 的等价命令
```

### 2. 启用缓存
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'  # 自动缓存依赖
```

### 3. 设置工作流权限
在仓库 Settings > Actions > General 中：
- 选择 "Read and write permissions"
- 允许 GitHub Actions 创建和更新内容

### 4. 使用环境变量保护敏感信息
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### 5. 添加错误处理
```yaml
- name: Build
  run: pnpm run build
  continue-on-error: false  # 失败时停止工作流
```

## 常见问题排查

### 1. 权限错误 (403)
**错误信息**：
```
Error: Action failed with "The process '/usr/bin/git' failed with exit code 128"
The requested URL returned error: 403
```

**解决方案**：
- 转到仓库 Settings > Actions > General
- 在 "Workflow permissions" 中选择 "Read and write permissions"

### 2. 依赖安装失败
**原因**：缺少锁定文件

**解决方案**：
- 确保提交 `package-lock.json`（npm）
- 或 `pnpm-lock.yaml`（pnpm）
- 或 `yarn.lock`（yarn）

### 3. 构建失败
**检查清单**：
- ✅ 锁定文件已提交
- ✅ Node.js 版本正确
- ✅ 构建命令正确（使用 `run` 关键字）
- ✅ 工作流权限已设置

### 4. 部署后文件丢失
**解决方案**：
```yaml
- uses: peaceiris/actions-gh-pages@v3
  with:
    keep_files: true  # 保留现有文件
```

## 调试技巧

### 1. 查看工作流日志
- 在仓库的 Actions 标签页查看详细日志
- 每个步骤都有展开的日志输出

### 2. 添加调试输出
```yaml
- name: Debug info
  run: |
    echo "Branch: ${{ github.ref }}"
    echo "Commit: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
    pwd
    ls -la
```

### 3. 使用 act 本地测试
```bash
# 安装 act
brew install act

# 运行工作流
act push
```

## 参考资源

- [GitHub Actions 官方文档](https://docs.github.com/zh/actions)
- [GitHub Actions 市场](https://github.com/marketplace?type=actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [阮一峰 GitHub Actions 教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

## 总结

GitHub Actions 是一个强大的自动化工具，通过 YAML 配置文件可以轻松实现：
- ✅ 自动化构建和测试
- ✅ 持续集成和部署
- ✅ 多环境管理
- ✅ 定时任务执行
- ✅ 代码质量检查

掌握这些基础概念和配置方法，你就能构建出适合自己项目的自动化工作流！

