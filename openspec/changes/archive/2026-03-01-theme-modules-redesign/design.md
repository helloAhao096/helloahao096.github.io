# 设计：Theme 按业务域模块化重构 + PostCard 评论数

## 依赖

- [proposal.md](./proposal.md) 已确认的 Goals / Non-goals 与涉及文件。

---

## Context

当前 theme 按技术层分组（layout/post/plugin/effect），VitePress 配置位于 `docs/.vitepress/config.ts`，主题在 `docs/.vitepress/theme/`。需按 Vue 3 工程化指南进行 core/shared/modules 三层重构，同时为 PostCard 增加 giscus 评论数展示（构建时拉取 Discussions，运行时按 pathname 匹配）。

---

## Goals / Non-Goals

**Goals：**
- core/shared/modules 三层结构，职责清晰
- modules/comment：GISCUS 配置、Comments 组件、buildCommentCounts 构建工具
- shared/composables/useCommentCount：运行时加载 comment-counts.json，供 post 模块使用（post 不依赖 comment）
- modules/post、sponsor、home：按业务域迁移
- PostCard 展示评论数（💬 N）
- config 构建时调用 buildCommentCounts，写入 docs/public/comment-counts.json

**Non-Goals：**
- 不接入动态 API
- 不拆 gallery/tools（保留顶层 views/）
- 不引入 core/api

---

## MVP（最小实现方案）

### 1. core/ 层

- **core/utils/date.ts**：从现有 `theme/utils/date.ts` 迁入，内容不变。
- **core/utils/path.ts**：新建，从 PostPager.vue 抽出 `normalizePath` 函数，签名与行为保持一致：
  ```ts
  export function normalizePath(path: string): string {
    if (!path) return "/";
    let normalized = path;
    if (!normalized.startsWith("/")) normalized = `/${normalized}`;
    normalized = normalized.replace(/(\.md|\.html)$/i, "");
    normalized = normalized.replace(/\/index$/i, "/");
    if (normalized.length > 1 && normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized || "/";
  }
  ```
- **core/types/index.ts**：从 `theme/types/index.ts` 迁入 Post、PageData 等类型。

### 2. shared/ 层

- **shared/constants/index.ts**：仅 BLOG_CONFIG（pageSize 等），从 theme/constants 拆出；GISCUS_CONFIG 迁入 modules/comment。
- **shared/components/layout/**：Layout.vue、Footer.vue、PageContainer.vue 迁入。
- **shared/components/effect/**：BackToTop.vue、Counter.vue、MouseEvent.vue 迁入。
- **shared/composables/useCommentCount.ts**：新建
  - `fetch('/comment-counts.json')` 一次，内存缓存
  - `getCount(regularPath: string): number`：内部用 core/utils/path.normalizePath 后查表
  - 无 token、无 loading 状态（简单 fetch + 缓存）

### 3. modules/comment/

- **constants/index.ts**：GISCUS_CONFIG（repo、repoId、categoryId、mapping 等）从 theme/constants 迁入。
- **components/Comments.vue**：从 theme/components/plugin/Comments.vue 迁入，import 改为 `../../constants`（comment 模块内）。
- **utils/buildCommentCounts.ts**：新建
  - 输入：`process.env.GITHUB_TOKEN`、`VITE_GISCUS_REPO`（或 import.meta.env）、`VITE_GISCUS_CATEGORY_ID`
  - 逻辑：调用 GitHub GraphQL `repository(owner, name) { discussions(first: 100, categoryId) { pageInfo { hasNextPage, endCursor }, nodes { title, comments { totalCount } } } }`，分页拉取；用 core/utils/path.normalizePath 标准化 discussion.title 作为 key，构建 `Record<string, number>`
  - 输出：写入 `docs/public/comment-counts.json`
  - 失败：try/catch，console.warn，不 throw

### 4. modules/post/

- **utils/posts.ts**：从 theme/utils/posts.ts 迁入，import 路径调整（types 从 core/types）。
- **components/**：PostCard、PostList、PostTitle、PostPager、PostOutline、PostOutlineItem 迁入。
  - PostPager 使用 `import { normalizePath } from '@core/utils/path'` 替换内联实现。
  - PostCard 增加 `useCommentCount().getCount(post.regularPath)`，在 post-right 区域展示 `💬 N`（N > 0 时展示）。
- **views/PostsOverview.vue**：迁入，import 路径调整。

### 5. modules/sponsor/

- **components/**：Sponsor.vue、SponsorStats.vue、SponsorList.vue、ExpenseList.vue 迁入。
- **data/**：sponsors.json、expenses.json 从 docs/.vitepress/sponsor/ 迁入；组件 import 路径更新为 `../data/sponsors.json` 等。

### 6. modules/home/

- **components/**：Hero.vue、Greeting.vue、HomePostList.vue 迁入。
- **views/Home.vue**：迁入。
- import 路径：PostList 从 modules/post 导入，PageContainer 从 shared/components/layout 导入。

### 7. 顶层 views/ 与 index.ts

- **views/gallery/Gallery.vue**、**views/tools/Tools.vue**：迁入（路径从 theme/components/views 调整）。
- **theme/index.ts**：更新所有 import 路径，从 shared、modules 导入组件并注册；Layout 从 shared/components/layout/Layout.vue 导入。

### 8. config.ts 修改

- 在 `async function config()` 开头：
  ```ts
  try {
    const { buildCommentCounts } = await import('./theme/modules/comment/utils/buildCommentCounts');
    await buildCommentCounts();
  } catch (e) {
    console.warn('[commentCount] 拉取失败，跳过:', e);
  }
  ```

### 9. 路径别名（可选）

- 若 import 路径过长，可在 vite.config 或 vitepress 配置中增加 `@core`、`@shared`、`@modules` 别名；否则使用相对路径。

### 10. 删除（迁移后）

- theme/constants/index.ts
- theme/utils/
- theme/types/
- theme/components/（全部迁出后）
- theme/sponsor/（数据已迁入 modules/sponsor/data）

---

## 备选方案与不采用理由

### 备选 A：不重构，仅新增评论数

- **做法**：保持现有 theme 结构，只新增 buildCommentCounts、useCommentCount，PostCard 使用。
- **不采用理由**：proposal 明确 Goals 为「按 Vue 3 指南做统一重构」，借此次功能增加完成目录重整。

### 备选 B：useCommentCount 留在 modules/comment

- **做法**：useCommentCount 放在 comment 模块内，PostCard 从 modules/comment 导入。
- **不采用理由**：违反指南「modules 不能依赖其他 modules」；post 会依赖 comment，依赖方向错误。

### 备选 C：buildCommentCounts 放在顶层 scripts/

- **做法**：构建脚本放在项目根 scripts/ 下。
- **不采用理由**：proposal 约定「API 逻辑封装在 theme 中」，buildCommentCounts 与 comment 域强相关，放在 modules/comment/utils 更内聚。

---

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| import 路径错误、循环依赖 | 分步迁移，每步 `pnpm run docs:dev` 验证 |
| buildCommentCounts 阻塞构建 | try/catch 包裹，失败仅 warn |
| GITHUB_TOKEN 未配置 | 脚本内判断 token 缺失时直接 return，不调用 API |
| normalizePath 与 giscus pathname 不一致 | 与 PostPager 复用同一 core/utils/path 实现 |

---

## Migration Plan

- **迁移顺序**：core → shared → modules/comment → modules/post → modules/sponsor → modules/home → views → index.ts → config.ts
- **每步**：创建目录、迁入/新建文件、更新 import、验证 dev 启动
- **回滚**：git revert 到重构前；或按迁移顺序逆向删除新目录、恢复旧结构
