# 任务：Theme 按业务域模块化重构 + PostCard 评论数

## 依赖

- [proposal.md](./proposal.md)
- [design.md](./design.md)

---

## 任务列表

以下任务按可交付物拆分，建议顺序执行；验收通过后在框中勾选 `[ ]`。

---

## 1. core/ 层

- [x] 1.1 新建 `theme/core/utils/date.ts`，从 `theme/utils/date.ts` 迁入内容；新建 `theme/core/utils/path.ts`，从 PostPager.vue 抽出 normalizePath 函数；新建 `theme/core/types/index.ts`，从 `theme/types/index.ts` 迁入 Post、PageData 等类型

  **验收**：`pnpm run docs:dev` 可启动；core 下三个文件存在，无 import 报错。

  **回滚**：删除 theme/core/ 目录。

- [x] 1.2 修改 `theme/components/post/PostPager.vue`，移除内联 normalizePath，改为 `import { normalizePath } from '../../core/utils/path'`（或根据实际路径调整）

  **验收**：PostPager 功能正常；上一页/下一页正确；无 normalizePath 报错。

  **回滚**：恢复 PostPager 内联 normalizePath。

---

## 2. shared/ 层

- [x] 2.1 新建 `theme/shared/constants/index.ts`，仅导出 BLOG_CONFIG（从 theme/constants 拆出 pageSize 等，不含 GISCUS_CONFIG）

  **验收**：shared/constants 存在；可被其他模块导入；GISCUS_CONFIG 仍在 theme/constants 中（待迁入 comment）。

  **回滚**：删除 shared/constants，恢复 theme/constants 原内容。

- [x] 2.2 新建 `theme/shared/components/layout/`，迁入 Layout.vue、Footer.vue、PageContainer.vue；更新各文件内部 import 路径（如 types 从 core/types 导入）

  **验收**：Layout、Footer、PageContainer 在 shared/components/layout 下；index.ts 或入口可导出。

  **回滚**：恢复 theme/components/layout/ 原位置。

- [x] 2.3 新建 `theme/shared/components/effect/`，迁入 BackToTop.vue、Counter.vue、MouseEvent.vue；更新内部 import

  **验收**：三个 effect 组件在 shared/components/effect 下；Layout 或引用处 import 正确。

  **回滚**：恢复 theme/components/effect/ 原位置。

- [x] 2.4 新建 `theme/shared/composables/useCommentCount.ts`，实现 fetch('/comment-counts.json')、内存缓存、getCount(regularPath)（内部调用 core/utils/path.normalizePath）

  **验收**：useCommentCount 可导入；getCount 返回 number；无 JSON 时返回 0；路径匹配逻辑正确。

  **回滚**：删除 shared/composables/useCommentCount.ts。

- [x] 2.5 修改 `theme/Layout.vue` 或主题入口，Layout 从 shared/components/layout/Layout.vue 导入；Footer、BackToTop、MouseEvent 等从 shared 导入；更新 theme/index.ts 的 import 路径

  **验收**：`pnpm run docs:dev` 启动后首页、文章页、布局正常；无 404 或 import 报错。

  **回滚**：恢复 theme/index.ts、Layout.vue 原 import 路径。

---

## 3. modules/comment/

- [x] 3.1 新建 `theme/modules/comment/constants/index.ts`，从 theme/constants 迁入 GISCUS_CONFIG；删除 theme/constants 中的 GISCUS_CONFIG（保留 BLOG_CONFIG 已迁 shared 的情况，若 theme/constants 已空可删除）

  **验收**：modules/comment/constants 可导出 GISCUS_CONFIG；Comments.vue 可从 comment 模块内导入。

  **回滚**：恢复 theme/constants 中 GISCUS_CONFIG。

- [x] 3.2 新建 `theme/modules/comment/components/Comments.vue`，从 theme/components/plugin/Comments.vue 迁入；import GISCUS_CONFIG 改为 `../constants`（comment 模块内）

  **验收**：Comments 组件在 comment 模块内；文章详情页底部评论正常显示；giscus 加载正常。

  **回滚**：恢复 theme/components/plugin/Comments.vue。

- [x] 3.3 新建 `theme/modules/comment/utils/buildCommentCounts.ts`，实现 GitHub GraphQL 调用、分页拉取、normalizePath 标准化 title、写入 docs/public/comment-counts.json；try/catch 失败仅 warn

  **验收**：配置 GITHUB_TOKEN 后运行 `buildCommentCounts()`，docs/public/comment-counts.json 存在且格式正确；无 token 时静默跳过。

  **回滚**：删除 buildCommentCounts.ts；config.ts 中移除 await buildCommentCounts() 调用。

- [x] 3.4 新建 `theme/modules/comment/index.ts`，统一导出 constants、Comments 组件、buildCommentCounts

  **验收**：可从 modules/comment 或 modules/comment/utils 导入 buildCommentCounts。

  **回滚**：删除 modules/comment/index.ts。

---

## 4. modules/post/

- [x] 4.1 新建 `theme/modules/post/utils/posts.ts`，从 theme/utils/posts.ts 迁入；import types 改为 core/types

  **验收**：posts.ts 可被 config 或其他模块导入；getPosts 等函数正常。

  **回滚**：恢复 theme/utils/posts.ts。

- [x] 4.2 新建 `theme/modules/post/components/`，迁入 PostCard、PostList、PostTitle、PostPager、PostOutline、PostOutlineItem；更新内部 import（core/types、core/utils/path、shared/composables/useCommentCount）

  **验收**：PostCard 使用 useCommentCount().getCount(post.regularPath) 展示评论数（💬 N）；PostPager 使用 core/utils/path.normalizePath。

  **回滚**：恢复 theme/components/post/ 原位置。

- [x] 4.3 新建 `theme/modules/post/views/PostsOverview.vue`，从 theme/views/posts/PostsOverview.vue 迁入；更新 import（PostCard 从 ../components、PageContainer 从 shared）

  **验收**：访问 /posts/ 或对应路由可见 PostsOverview；PostCard 列表与评论数正常。

  **回滚**：恢复 theme/views/posts/PostsOverview.vue。

- [x] 4.4 新建 `theme/modules/post/index.ts`，统一导出 posts utils、PostCard、PostList、PostsOverview 等

  **验收**：theme/index.ts、Home、config 等可从 modules/post 导入。

  **回滚**：删除 modules/post/index.ts。

---

## 5. modules/sponsor/

- [x] 5.1 新建 `theme/modules/sponsor/data/`，迁入 sponsors.json、expenses.json（从 docs/.vitepress/sponsor/）；新建 `theme/modules/sponsor/components/`，迁入 Sponsor、SponsorStats、SponsorList、ExpenseList；更新组件内 JSON import 路径为 `../data/sponsors.json` 等

  **验收**：赞助页 /sponsor 正常；统计与列表正确；JSON 加载无报错。

  **回滚**：恢复 theme/components/Sponsor*.vue、ExpenseList.vue 及 docs/.vitepress/sponsor/ 原位置。

- [x] 5.2 新建 `theme/modules/sponsor/index.ts`，导出 Sponsor、SponsorStats、SponsorList、ExpenseList

  **验收**：theme/index.ts 可从 modules/sponsor 导入并注册组件。

  **回滚**：删除 modules/sponsor/index.ts。

---

## 6. modules/home/

- [x] 6.1 新建 `theme/modules/home/components/`，迁入 Hero.vue、Greeting.vue、HomePostList.vue；新建 `theme/modules/home/views/Home.vue`，从 theme/views/home/Home.vue 迁入；更新 import（PostList 从 modules/post、PageContainer 从 shared）

  **验收**：首页正常；Hero、Greeting、HomePostList 展示正确；PostList 分页正常。

  **回滚**：恢复 theme/views/home/、theme/components/home/ 原位置。

- [x] 6.2 新建 `theme/modules/home/index.ts`，导出 Home、Hero、Greeting、HomePostList

  **验收**：theme/index.ts 可从 modules/home 导入 Home。

  **回滚**：删除 modules/home/index.ts。

---

## 7. 顶层 views/ 与 theme/index.ts

- [x] 7.1 新建 `theme/views/gallery/Gallery.vue`、`theme/views/tools/Tools.vue`，从 theme/views/gallery、theme/views/tools 迁入；更新内部 import

  **验收**：访问 /gallery、/tools 正常；页面无报错。

  **回滚**：恢复 theme/views/ 原结构。

- [x] 7.2 更新 `theme/index.ts`：Layout 从 shared/components/layout、Home 从 modules/home、PostsOverview 从 modules/post、Sponsor 等从 modules/sponsor、Gallery、Tools 从 views 导入；注册所有组件；移除对 theme/components、theme/views 旧路径的引用

  **验收**：`pnpm run docs:dev` 启动后，首页、博客列表、文章详情、赞助页、Gallery、Tools 均正常；无 404 或 import 报错。

  **回滚**：恢复 theme/index.ts 原 import 与注册逻辑。

---

## 8. config.ts 与 buildCommentCounts

- [x] 8.1 修改 `docs/.vitepress/config.ts`：在 async config() 开头增加 `try { await (await import('./theme/modules/comment/utils/buildCommentCounts')).buildCommentCounts(); } catch (e) { console.warn('[commentCount] 拉取失败，跳过:', e); }`；config 中 getPosts、generateSidebarFromPosts 的 import 改为从 modules/post/utils 等新路径

  **验收**：`pnpm run docs:build` 成功；配置 GITHUB_TOKEN 时 docs/public/comment-counts.json 存在；无 token 时构建不中断。

  **回滚**：移除 config 中 buildCommentCounts 调用；恢复 getPosts 等 import 路径。

---

## 9. PostCard 评论数展示

- [x] 9.1 在 `theme/modules/post/components/PostCard.vue` 中增加评论数展示：使用 `useCommentCount().getCount(post.regularPath)`，在 post-right 区域展示 `💬 N`（N > 0 时）；样式与 post-meta 一致

  **验收**：PostCard 右侧在日期、标签旁显示评论数（有评论时）；无评论或 JSON 缺失时不展示或显示 0；样式与现有 post-meta 统一。

  **回滚**：移除 PostCard 中 useCommentCount 与评论数展示。

---

## 10. 清理旧目录

- [x] 10.1 删除 theme/constants/（内容已迁 shared、comment）；删除 theme/utils/（已迁 core、post）；删除 theme/types/（已迁 core）；删除 theme/components/（已迁 shared、modules）；删除 theme/sponsor/（已迁 modules/sponsor/data）；删除 theme/views/home、theme/views/posts（已迁 modules）；保留 theme/views/gallery、theme/views/tools

  **验收**：旧目录已删除；`pnpm run docs:dev`、`pnpm run docs:build` 均正常；无遗留空目录或冗余文件。

  **回滚**：git checkout 恢复被删文件。

---

## 执行顺序建议

1. 1.1 → 1.2（core 完成）
2. 2.1 → 2.2 → 2.3 → 2.4 → 2.5（shared 完成）
3. 3.1 → 3.2 → 3.3 → 3.4（comment 完成）
4. 4.1 → 4.2 → 4.3 → 4.4（post 完成；4.2 中 PostCard 可先不接评论数，9.1 单独做）
5. 5.1 → 5.2（sponsor 完成）
6. 6.1 → 6.2（home 完成）
7. 7.1 → 7.2（顶层 views、index 完成）
8. 8.1（config、buildCommentCounts）
9. 9.1（PostCard 评论数）
10. 10.1（清理旧目录）

全部勾选后即可视为本变更实现完成，可进入验证与归档阶段。
