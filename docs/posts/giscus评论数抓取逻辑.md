---
title: giscus 评论数抓取逻辑
description: 梳理 giscus 评论数的获取、路径匹配与映射逻辑，供实现或排查参考
date: 2026-03-02
tags:
  - giscus
  - GitHub API
---

> 本文只讲评论数量获取的核心逻辑，不涉及具体前端实现。文末附带实现时需注意的坑与提醒。

## 1. 核心定位

本方案为**纯前端静态实现**：无后端、无本地 JSON 文件维护，评论数由前端实时请求 GitHub GraphQL API 获取。配置一个仅具 **Discussions 读权限** 的 token 供前端使用，既可提高 API 限速，又保证权限最小化。

## 2. 背景与约定

- **giscus 约定**：使用 `mapping: "pathname"` 时，GitHub Discussion 的 `title` 即为页面 pathname
- **站点约定**：文章有 `regularPath`（如 `/posts/xxx.html`）
- **匹配前提**：Discussion title 与 regularPath 经同一套标准化后能一一对应

## 3. 整体逻辑

```
[拉取] 前端请求 GitHub GraphQL API，获取 Discussions
    ↓
[构建映射] 对每个 node.title 做 decodeURIComponent + normalizePath 得到 key，累加 totalCount 到内存中的 path → count 映射
    ↓
[按 path 查找] 对 regularPath 做 normalizePath 得到 key，在映射中取数
```

其中「构建映射」和「按 path 查找」均在前端内存中完成，无需数据库或本地文件。

## 4. 路径标准化

两处必须用同一套规则：**构建映射时**（处理 Discussion title）和**按 path 查找时**（处理 regularPath）。

规则（顺序执行）：

1. 确保以 `/` 开头
2. 去掉 `.md`、`.html` 后缀
3. 将 `/index` 替换为 `/`
4. 去掉末尾的 `/`（根路径 `/` 除外）

示例：

| 输入 | 输出 |
|------|------|
| `posts/千帆财富自由计划.md` | `/posts/千帆财富自由计划` |
| `posts/%E5%8D%83...`（解码后） | `/posts/千帆财富自由计划` |
| `/posts/xxx.html` | `/posts/xxx` |
| `about` | `/about` |

## 5. 数据拉取

- **接口**：`https://api.github.com/graphql`
- **查询**：`repository(owner, name).discussions(first: 100, categoryId, after: cursor)`
- **返回**：`nodes[].title`、`nodes[].comments.totalCount`
- **分页**：若 `hasNextPage` 为 true，用 `endCursor` 继续请求

## 6. 构建映射与按 path 查找

**构建映射**：对每个 Discussion node

1. `decodeURIComponent(node.title)`（GitHub 存的是 URL 编码）
2. `normalizePath(decodedTitle)` 得到 key
3. 将 `node.comments.totalCount` 累加到 `counts[key]`（同一 key 有多条讨论时合并）

映射仅存在于前端内存中，不落盘、不写文件。

**按 path 查找**：对传入的 regularPath

1. `normalizePath(regularPath)` 得到 key
2. 返回 `counts[key] ?? 0`

## 7. 数据流示意

```
GitHub Discussion.title: "posts/%E5%8D%83..."
        ↓ decodeURIComponent
        "posts/千帆财富自由计划"
        ↓ normalizePath
key: "/posts/千帆财富自由计划"  →  counts["/posts/千帆财富自由计划"] = 1

regularPath: "/posts/千帆财富自由计划.html"
        ↓ normalizePath
key: "/posts/千帆财富自由计划"  →  按 path 查找 → 1
```

## 8. 实现时需注意的坑

| 要点 | 说明 |
|------|------|
| **URL 解码** | GitHub Discussion title 多为 `posts/%E5%8D%83...` 形式，构建映射前必须先 `decodeURIComponent`，否则 key 对不上 |
| **配置统一** | repo、categoryId 需与 giscus 评论组件共用同一份配置，否则可能拉不到或拉错讨论 |
| **请求头** | GraphQL 请求需带 `Accept: application/vnd.github+json`、`User-Agent`，否则 GitHub 可能直接拒绝 |
| **Token** | 建议配置 token 提高限速；仅需 Discussions 读权限，权限最小化 |
| **响应式** | 若在 SPA 中展示，需确保数据异步加载完成后能触发 UI 更新（如显式依赖内存中的映射） |
| **路径格式** | giscus 存的是 `posts/xxx`（无前导 `/`），标准化时要统一补 `/`，保证构建映射与按 path 查找的 key 一致 |
