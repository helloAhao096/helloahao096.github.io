# 统一内容数据层 + 投资/项目模块与页面 — 技术设计

## Context

- **现状**：博客数据由 `docs/.vitepress/theme/modules/post/utils/posts.ts` 中的 `getPosts()` 独家实现，仅扫描 `docs/posts/`，结果挂到 `themeConfig.posts`；各组件通过 `useData().theme.posts` 消费。导航已有「博客」「项目」「关于」等，「项目」当前对应单页 `docs/projects.md`，无独立模块与数据层。
- **约束**：内容 md 必须保留在 `docs/` 下（文件即路由）；不在 `.vitepress` 内放置内容 md；VitePress 配置在 build 阶段同步执行，数据层为 Node 侧。
- **目标**：统一内容数据口径、新增投资与项目两个内容域及对应模块与页面，并保持博客行为不变。

## Goals / Non-Goals

**Goals:**
- 抽象出唯一的「按目录扫描 md 并解析为统一条目结构」的公用方法，供 posts/invest/projects 复用。
- 提供领域 API：`getPosts()`、`getInvestEntries()`、`getProjectEntries()`，各自只做目录与领域过滤。
- 在 config 中统一注入 `themeConfig.posts`、`themeConfig.invest`、`themeConfig.projects`。
- 新增投资模块与页面：`docs/invest/`、nav「投资」、`/invest/` 列表页，消费 `theme.invest`。
- 新增项目模块与页面：将现有项目页纳入数据层，`docs/projects/` 作为内容目录，项目列表由 `theme.projects` 驱动，保留或演进 `docs/projects.md` 为 `docs/projects/index.md`。
- 各模块（post/invest/projects）仅通过 composable 或 theme 只读数据消费，不直接扫文件。

**Non-Goals:**
- 不改变现有博客 URL、sidebar 结构及文章 frontmatter 约定。
- 不引入 Pinia store 管理内容数据（继续用 themeConfig + composable 只读即可，除非后续有强需求）。
- 不在本变更内迁移「财富自由计划」等已有文章到 `docs/invest/`（可后续按 tasks 或单独 MR 迁移）。

## Decisions

### 1. 公用方法命名与放置

- **决策**：新增 `getMarkdownEntriesByDir(dirName: string, options?: GetEntriesOptions)`，放在共享层（如 `theme/core/content/entries.ts` 或 `theme/shared/content/entries.ts`），与 `Post` 类型兼容的条目结构（`frontMatter`、`regularPath`、`lastUpdated`）作为统一返回元素。
- **理由**：单一实现扫描/解析/时间/路径，避免三处重复；目录名参数化便于扩展。
- **备选**：放在 `modules/post/utils/` 并 export 给其他模块用 — 会导致 post 模块承担全局职责，不利于模块边界，故不采用。

### 2. 各领域 API 与 config 注入

- **决策**：`getPosts()` 留在 post 模块内，内部调用 `getMarkdownEntriesByDir('posts', { excludeIndex: true })`；新增 `getInvestEntries()`、`getProjectEntries()` 可放在同一 content 工具模块或各自模块内，内部均调 `getMarkdownEntriesByDir`。config 中 `posts = await getPosts()`，`invest = await getInvestEntries()`，`projects = await getProjectEntries()`，分别赋给 `themeConfig.posts/invest/projects`。
- **理由**：与 proposal 的「公用方法 + 各自 getXxx」一致；config 只依赖领域 API，不直接调公用方法传字符串。
- **备选**：config 直接 `getMarkdownEntriesByDir('posts')` 等 — 领域语义分散在 config，不利于后续 per-domain 选项（如 excludeIndex），故不采用。

### 3. 投资模块与页面

- **决策**：新增 `docs/invest/` 目录；`docs/invest/index.md` 使用 layout: page，内容区由自定义组件（如 `InvestOverview`）渲染，该组件通过 composable `useInvestList()` 从 `theme.invest` 取数据，按时间倒序展示卡片/列表。导航在「博客」与「项目」之间增加一项：`{ text: "💰 投资", link: "/invest/", activeMatch: "^/invest" }`。sidebar 可选：若需投资子页大纲，可为 `/invest/` 配置 sidebar，否则列表页可 `sidebar: false`。
- **理由**：与博客模块对称，便于用户理解；数据来源唯一（theme.invest）。
- **备选**：投资仅用 tags 过滤 posts 而不单独目录 — 与「按目录划分领域」的 proposal 不一致，且不利于后续投资专属 frontmatter（如进度、金额），故不采用。

### 4. 项目模块与页面

- **决策**：将现有 `docs/projects.md` 迁移为 `docs/projects/index.md`（或保留根级 `projects.md` 由 VitePress 继续解析为 `/projects`）；新增 `docs/projects/` 下可放置若干 `*.md` 作为「项目介绍」条目（可选）。新增 `getProjectEntries()` 扫描 `docs/projects/`，排除 `index.md`，结果挂到 `themeConfig.projects`。项目页（`/projects` 或 `/projects/`）由项目模块的页面组件渲染：顶部保留简短说明文案，下方列表由 `theme.projects` 驱动（卡片/列表）；若无条目则仅展示说明。导航已存在「项目」，仅需确保指向 `/projects` 且 activeMatch 正确。
- **理由**：项目与投资、博客一样成为「可扩展内容域」，便于后续每项目一 md；同时兼容当前无子 md、仅展示 index 文案的情况。
- **备选**：项目不接入数据层，继续纯 md 手写列表 — 与统一数据口径目标不符，且不利于后续用 md 维护项目列表，故不采用。

### 5. 类型与兼容性

- **决策**：公用方法返回类型与现有 `Post` 结构兼容（`frontMatter`、`regularPath`、`lastUpdated`）；可抽一层 `ContentEntry` 类型供三域共用，`Post` 作为其别名或扩展。frontmatter 约定（title、date、tags 等）与现有 posts 一致，invest/projects 可额外使用自定义字段，解析阶段不做裁剪。
- **理由**：最小化对现有 Post 消费方的改动；统一结构便于共用排序、分组工具函数。
- **迁移**：旧文章无需改 frontmatter；若未来在 invest 中使用新字段，仅新文章或迁移后的文章需要填写。

## Risks / Trade-offs

- **[Risk] globby 的 cwd 与路径**：不同运行环境（dev/build）下 `process.cwd()` 可能指向 `docs/` 或仓库根，导致 `dirName` 拼出的路径错误。  
  **Mitigation**：在公用方法内基于 VitePress 约定或 `import.meta`/config 解析出 docs 根路径，再拼 `${docsRoot}/${dirName}/**/*.md`；或在 config 调用时传入绝对路径/明确相对路径约定并写入文档。

- **[Risk] 投资/项目目录为空**：首次上线时 `docs/invest/` 或 `docs/projects/` 下可能无 md（或仅 index），`getXxx` 返回空数组。  
  **Mitigation**：空数组视为合法；列表页展示「暂无」或仅展示 index 文案，不报错；后续迁移或新增 md 即可自动出现。

- **[Trade-off] 项目页双轨**：保留 `docs/projects.md` 则路由为 `/projects`，若改为 `docs/projects/index.md` 则可为 `/projects/`，需统一并做一次重定向或链接检查。  
  **Mitigation**：设计阶段确定采用 `docs/projects/index.md` 作为项目首页，原 `projects.md` 删除或重定向；nav 的 link 使用 `/projects/` 与 cleanUrls 一致。

## Migration Plan

1. **阶段一：数据层**  
   - 新增 content 公用模块与 `getMarkdownEntriesByDir`；重构 `getPosts()` 为调用该公用方法；config 仅通过 `getPosts()` 获取 posts，验证博客列表与 sidebar 无回归。  
2. **阶段二：投资**  
   - 新增 `getInvestEntries()`、`themeConfig.invest`；新增 `modules/invest`（composable + 列表组件）；新增 `docs/invest/index.md` 与 nav；验证 `/invest/` 可访问且列表来自 theme.invest。  
3. **阶段三：项目**  
   - 新增 `getProjectEntries()`、`themeConfig.projects`；新增 `modules/projects`（composable + 列表/卡片组件）；将 `docs/projects.md` 改为 `docs/projects/index.md`，页面改为由组件渲染 + theme.projects 列表；验证 `/projects/` 与导航高亮。  
4. **回滚**：每阶段可独立回滚（还原 config、删除 invest/projects 模块与目录）；数据层回滚需还原 `posts.ts` 与删除 content 公用模块。

## Open Questions

- 投资列表是否需要在 sidebar 显示「按年/按主题」分组（类似博客）？若需要，是否复用 `generateSidebarFromPosts` 的逻辑生成 `generateSidebarFromEntries(entries)` 供 invest 使用？
- 项目条目 frontmatter 是否约定扩展字段（如 `link`、`repo`、`status`）以便卡片展示外链与标签？可在 tasks 中定为可选增强。
