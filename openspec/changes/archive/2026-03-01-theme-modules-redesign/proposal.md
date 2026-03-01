# 提案：Theme 按业务域模块化重构 + PostCard 评论数

## 变更类型

**改代码**（目录重构 + 新增评论数功能；不新增博客文章）。

---

## Why

当前 theme 按技术层（layout/post/plugin/effect）分组，业务域边界不清；Comments 在 plugin/ 下但本质是评论域；GISCUS_CONFIG 在顶层 constants 与评论逻辑分离。同时希望为 PostCard 增加 giscus 评论数展示，需要构建时拉取 GitHub Discussions 并写入 JSON、运行时按 pathname 匹配。借此次功能增加，按 Vue 3 工程化指南的 core/shared/modules 三层做一次统一重构，明确模块边界与职责，提升可维护性。

---

## Goals

1. **core/**：纯基础设施层，无业务逻辑  
   - `utils/date.ts`、`utils/path.ts`（normalizePath 从 PostPager 抽出）  
   - `types/index.ts`（Post、PageData 等通用类型）

2. **shared/**：跨模块共享（遵循 Vue 3 指南：跨模块组件在 components/，跨模块逻辑在 composables/）  
   - `constants/index.ts`（BLOG_CONFIG、pageSize 等）  
   - `components/layout/`（Layout、Footer、PageContainer）  
   - `components/effect/`（BackToTop、Counter、MouseEvent）  
   - `composables/useCommentCount.ts`（运行时 fetch JSON、缓存、提供 `getCount(regularPath)`；被 post 模块 PostCard 使用，属跨模块逻辑，放 shared 符合「modules 不能依赖其他 modules」）

3. **modules/comment/**：评论模块（完整域）  
   - 遵循 Vue 3 工程化指南：modules 内为 composables、stores、hooks、utils，无 services；modules 不能依赖其他 modules  
   - `constants/index.ts`（GISCUS_CONFIG 从 shared 迁入）  
   - `components/Comments.vue`（giscus 展示，从 plugin/ 迁入）  
   - `utils/buildCommentCounts.ts`（构建时工具：调 GitHub GraphQL，写 `docs/public/comment-counts.json`）  
   - matchPath 逻辑并入 useCommentCount 内（normalizePath + map 查表）

4. **modules/post/**：文章模块  
   - `utils/posts.ts`  
   - `components/`（PostCard、PostList、PostTitle、PostPager、PostOutline*）  
   - `views/PostsOverview.vue`  
   - PostCard 使用 `shared/composables/useCommentCount().getCount(post.regularPath)` 展示评论数（post 依赖 shared，不依赖 comment 模块）

5. **modules/sponsor/**：赞助模块  
   - `components/`（Sponsor、SponsorStats、SponsorList、ExpenseList）  
   - `data/`（sponsors.json、expenses.json）

6. **modules/home/**：首页模块  
   - `components/`（Hero、Greeting、HomePostList）  
   - `views/Home.vue`

7. **views/**：独立页面（非核心域）  
   - `gallery/Gallery.vue`  
   - `tools/Tools.vue`

8. **评论数功能链路**：  
   - 构建时：`config.ts` 调用 `buildCommentCounts()`，用 GITHUB_TOKEN 拉取 Discussions，写入 `docs/public/comment-counts.json`  
   - 运行时：PostCard 调用 `useCommentCount().getCount(post.regularPath)`，内部 fetch `/comment-counts.json` 一次并缓存  
   - 路径匹配：使用与 PostPager 一致的 normalizePath 逻辑，与 giscus pathname 映射对齐  
   - 架构：构建时逻辑归属 `utils/`（Vue 3 指南中 modules 无 services；构建脚本视为模块工具函数）

---

## Non-goals

1. **不新增博客文章**：本次为纯代码重构与评论数功能。
2. **不改变业务行为**：除 PostCard 增加评论数展示外，页面布局、路由、sidebar、nav 均与现状一致。
3. **不接入评论数动态 API**：评论数来自构建时生成的 JSON，运行时只读；token 仅在 Node 环境使用，不暴露到前端。
4. **不拆 gallery/tools**：保留在顶层 views/，暂不归入 modules。
5. **不引入 core/api**：无 HTTP 客户端层，仅 fetch 静态 JSON。

---

## 涉及文件与目录

### 新增

| 路径 | 说明 |
|------|------|
| `theme/core/utils/date.ts` | 从 `utils/date.ts` 迁入 |
| `theme/core/utils/path.ts` | 新建，normalizePath（从 PostPager 抽出） |
| `theme/core/types/index.ts` | 从 `theme/types/index.ts` 迁入 |
| `theme/shared/constants/index.ts` | 仅 BLOG_CONFIG，从 constants 迁入 |
| `theme/shared/components/layout/` | Layout、Footer、PageContainer 迁入 |
| `theme/shared/components/effect/` | BackToTop、Counter、MouseEvent 迁入 |
| `theme/shared/composables/useCommentCount.ts` | 运行时加载 JSON、getCount（跨模块，post 使用） |
| `theme/modules/comment/constants/index.ts` | GISCUS_CONFIG 迁入 |
| `theme/modules/comment/components/Comments.vue` | 从 plugin/ 迁入 |
| `theme/modules/comment/utils/buildCommentCounts.ts` | 构建时工具：拉取 Discussions，写入 JSON |
| `theme/modules/post/` | 文章相关组件、utils、views 迁入 |
| `theme/modules/sponsor/` | 赞助组件、data 迁入 |
| `theme/modules/home/` | 首页组件、views 迁入 |
| `docs/public/comment-counts.json` | 构建时生成（key: normalized path, value: count） |

### 修改

| 路径 | 说明 |
|------|------|
| `theme/Layout.vue` | 移至 shared/components/layout/，更新 import |
| `theme/index.ts` | 更新各组件 import 路径，注册来自 modules 的组件 |
| `theme/components/post/PostCard.vue` | 增加评论数展示，使用 useCommentCount |
| `theme/components/post/PostPager.vue` | 使用 core/utils/path.normalizePath 替换内联实现 |
| `config.ts` | 在 async config() 开头 await buildCommentCounts() |

### 删除（迁移后）

| 路径 | 说明 |
|------|------|
| `theme/constants/index.ts` | 拆入 shared/constants 与 modules/comment/constants |
| `theme/utils/` | 迁入 core/utils 与 modules/post/utils |
| `theme/types/index.ts` | 迁入 core/types |
| `theme/components/` | 拆入 shared/ 与各 modules/ |
| `theme/sponsor/` | 迁入 modules/sponsor/data |

---

## 目录结构（重构后）

```
theme/
├── core/
│   ├── utils/
│   │   ├── date.ts
│   │   └── path.ts
│   └── types/
│       └── index.ts
├── shared/
│   ├── constants/index.ts
│   ├── composables/
│   │   └── useCommentCount.ts
│   └── components/
│       ├── layout/
│       │   ├── Layout.vue
│       │   ├── Footer.vue
│       │   └── PageContainer.vue
│       └── effect/
│           ├── BackToTop.vue
│           ├── Counter.vue
│           └── MouseEvent.vue
├── modules/
│   ├── comment/
│   │   ├── index.ts
│   │   ├── constants/index.ts
│   │   ├── components/Comments.vue
│   │   └── utils/buildCommentCounts.ts
│   ├── post/
│   │   ├── index.ts
│   │   ├── utils/posts.ts
│   │   ├── components/
│   │   │   ├── PostCard.vue
│   │   │   ├── PostList.vue
│   │   │   ├── PostTitle.vue
│   │   │   ├── PostPager.vue
│   │   │   └── PostOutline*.vue
│   │   └── views/PostsOverview.vue
│   ├── sponsor/
│   │   ├── index.ts
│   │   ├── components/
│   │   └── data/
│   └── home/
│       ├── components/
│       └── views/Home.vue
├── views/
│   ├── gallery/Gallery.vue
│   └── tools/Tools.vue
├── index.ts
└── custom.css
```

---

## 评论数功能说明

### 构建时

- 工具：`modules/comment/utils/buildCommentCounts.ts`（构建时工具函数，归属 utils 遵循 Vue 3 指南）  
- 输入：`GITHUB_TOKEN`（或 GitHub Actions 时自动注入）、`VITE_GISCUS_REPO`、`VITE_GISCUS_CATEGORY_ID`  
- 逻辑：调用 `repository.discussions(first: 100, categoryId)`，分页拉取，构建 `{ [normalizedPath]: totalCount }`  
- 输出：`docs/public/comment-counts.json`  
- 失败：try/catch 吞掉，不中断构建

### 运行时

- composable：`shared/composables/useCommentCount()`  
- 逻辑：`fetch('/comment-counts.json')` 一次，内存缓存；`getCount(regularPath)` 内部用 core/utils/path.normalizePath 后查表  
- 无 token 暴露

### 路径匹配

- 与 PostPager、giscus pathname 映射一致：去掉 `.html`、`/index`，统一 trailing slash；逻辑在 useCommentCount 内（调用 core/utils/path.normalizePath）

---

## 路由、sidebar、主题组件影响面

| 影响项 | 说明 |
|--------|------|
| 路由 | 无变化 |
| sidebar | 无变化，仍由 config 中 generateSidebarFromPosts 生成 |
| 主题组件 | 仅目录与 import 路径变更；PostCard 增加评论数展示 |
| config | 增加 `await buildCommentCounts()` 调用 |
| 构建 | 需配置 `GITHUB_TOKEN`（CI）或本地 `.env` 才能生成 comment-counts.json；无 token 时跳过，PostCard 不展示评论数 |

---

## 迁移策略

1. 按模块顺序迁移：core → shared → modules/comment → modules/post → modules/sponsor → modules/home  
2. 每步更新 index.ts 的 import 路径，确保 `pnpm run docs:dev` 可启动  
3. PostPager 中 normalizePath 抽到 core/utils/path，PostPager 改为 import  
4. 评论数功能在 modules/comment 完成后再接入 PostCard

---

## 验收预期

1. **本地启动**：`pnpm run docs:dev` 启动后，首页、博客列表、文章详情、赞助页、Gallery、Tools 均正常展示，样式与重构前一致。  
2. **PostCard 评论数**：在配置 GITHUB_TOKEN 且完成构建后，PostCard 右侧展示评论数（💬 N）；无 token 或 JSON 缺失时，不展示或显示 0。  
3. **构建**：`pnpm run docs:build` 成功；若设置了 GITHUB_TOKEN，`docs/public/comment-counts.json` 存在且格式正确。  
4. **导入路径**：所有组件、utils、constants 从新路径导入，无 404 或循环依赖。

---

## 风险与回滚

| 风险 | 缓解 | 回滚 |
|------|------|------|
| import 路径错误 | 分步迁移，每步验证 dev 启动 | git revert 到重构前 |
| buildCommentCounts 阻塞构建 | try/catch 包裹，失败仅 warn | 注释 config 中 await buildCommentCounts() 调用 |
| comment-counts.json 体积过大 | 仅存 path → count，无冗余字段；discussions 一般 < 100 | 删除 public/comment-counts.json，PostCard 不展示 |
| normalizePath 与 giscus 不一致 | 与 PostPager 复用 core/utils/path 同一实现，与 giscus pathname 约定对齐 | 调整 useCommentCount 内查表逻辑或 JSON key 格式 |

---

请确认上述 Goals、Non-goals 与目录结构是否符合预期，确认后再进入 design / tasks 阶段。
