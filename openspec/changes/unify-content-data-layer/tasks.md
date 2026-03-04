# Tasks: 统一内容数据层 + 投资/项目模块与页面

## 1. 内容数据层抽象

- [ ] 1.1 新增公用方法 `getMarkdownEntriesByDir(dirName: string, options?: GetEntriesOptions)`：在 `theme/core/content/` 或 `theme/shared/content/` 下新增 `entries.ts`（或等价路径），实现 globby 扫描 `docs/<dirName>/**/*.md`、gray-matter 解析、Git/文件时间 lastUpdated、date 归一化、regularPath 生成及按时间降序排序；返回与 Post 兼容的条目类型（可定义 `ContentEntry` 与 Post 兼容）。  
  **文件**：`docs/.vitepress/theme/core/content/entries.ts`（或 shared/content）；**验收**：单元或手写调用返回预期结构；**回滚**：删除该文件。

- [ ] 1.2 重构 `getPosts()` 为内部调用 `getMarkdownEntriesByDir('posts', { excludeIndex: true })`，保持返回类型与现有 `theme.posts` 消费方兼容；从 `posts.ts` 中抽离可复用逻辑到公用方法，保留 `generateSidebarFromPosts`、`getPostLength` 等对外 API 行为不变。  
  **文件**：`docs/.vitepress/theme/modules/post/utils/posts.ts`、上述 content 模块；**验收**：本地 `pnpm dev`，`/posts/` 列表与 sidebar 与改动前一致；**回滚**：还原 `posts.ts` 与删除 content 模块。

- [ ] 1.3 在 `config.ts` 中通过 `getPosts()` 获取 posts 并赋给 `themeConfig.posts`（若当前已是则保持），确认无直接调用公用方法传 `'posts'` 的写法。  
  **文件**：`docs/.vitepress/config.ts`；**验收**：build 通过，首页与博客列表正常；**回滚**：还原 config 中 posts 相关行。

## 2. 投资领域 API 与 config 注入

- [ ] 2.1 实现 `getInvestEntries()`：内部调用 `getMarkdownEntriesByDir('invest', options)`，返回与 Post 兼容的条目数组；可放在 content 模块或 `theme/modules/invest/utils/`。  
  **文件**：新增 `getInvestEntries` 实现处；**验收**：在 config 中临时 log 或调用一次，确认有返回值（可为空数组）；**回滚**：删除该实现及 config 中的调用。

- [ ] 2.2 在 `config.ts` 中调用 `getInvestEntries()` 并将结果赋给 `themeConfig.invest`。  
  **文件**：`docs/.vitepress/config.ts`；**验收**：`theme.invest` 在运行时可用（如 invest 页组件中 console 或展示）；**回滚**：删除 config 中 invest 赋值。

## 3. 投资模块与页面

- [ ] 3.1 新增投资模块结构：`theme/modules/invest/`，包含 composable（如 `useInvestList()` 从 `useData().theme.invest` 取数据并返回列表）及列表/卡片组件（如 `InvestOverview.vue`）。  
  **文件**：`docs/.vitepress/theme/modules/invest/` 下 composable + 组件；**验收**：在任意测试页中引用 composable 与组件，能读到 theme.invest 并渲染；**回滚**：删除 `modules/invest` 目录。

- [ ] 3.2 新增投资列表页：`docs/invest/index.md`，frontmatter 设置 `layout: page`、`title`、必要时 `sidebar: false`；正文区使用投资模块的列表组件（如 `<InvestOverview />`）。  
  **文件**：`docs/invest/index.md`；**验收**：访问 `/invest/` 可见页面，列表来自 theme.invest（可为空）；**回滚**：删除 `docs/invest/index.md`。

- [ ] 3.3 在 `config.ts` 的 nav 中增加「投资」项：`{ text: "💰 投资", link: "/invest/", activeMatch: "^/invest" }`，位置建议在「博客」与「项目」之间；若 theme 需注册全局组件，在 `theme/index.ts` 中注册投资列表组件。  
  **文件**：`docs/.vitepress/config.ts`、`docs/.vitepress/theme/index.ts`；**验收**：导航出现「投资」，点击进入 `/invest/` 且高亮正确；**回滚**：删除 nav 项与组件注册。

## 4. 项目领域 API 与 config 注入

- [ ] 4.1 实现 `getProjectEntries()`：内部调用 `getMarkdownEntriesByDir('projects', options)`，排除 `projects/index.md`（与 design 一致），返回与 Post 兼容的条目数组。  
  **文件**：新增 `getProjectEntries` 实现处；**验收**：config 中调用并赋给 themeConfig.projects，运行时 theme.projects 可用；**回滚**：删除实现与 config 赋值。

- [ ] 4.2 在 `config.ts` 中调用 `getProjectEntries()` 并将结果赋给 `themeConfig.projects`。  
  **文件**：`docs/.vitepress/config.ts`；**验收**：build 后 theme.projects 存在；**回滚**：删除 config 中 projects 赋值。

## 5. 项目模块与页面

- [ ] 5.1 新增项目模块结构：`theme/modules/projects/`，包含 composable（如 `useProjectList()` 从 `useData().theme.projects` 取数据）及列表/卡片组件，用于在项目页展示 theme.projects 条目。  
  **文件**：`docs/.vitepress/theme/modules/projects/`；**验收**：在测试页或项目页中能渲染 theme.projects 列表；**回滚**：删除 `modules/projects` 目录。

- [ ] 5.2 将现有 `docs/projects.md` 迁移为 `docs/projects/index.md`：保留原有说明文案，内容区改为使用项目模块组件渲染 `theme.projects` 列表；若当前为单文件站则删除 `docs/projects.md` 或保留重定向（按项目约定）。  
  **文件**：`docs/projects.md` → `docs/projects/index.md`，或仅新增 `docs/projects/index.md` 并调整路由；**验收**：访问 `/projects/` 或 `/projects` 可见说明 + 项目列表（空也可）；**回滚**：恢复 `docs/projects.md`，删除 `docs/projects/index.md`。

- [ ] 5.3 确认 nav 中「项目」的 link 与 activeMatch 指向项目页（如 `link: "/projects/"`，`activeMatch: "^/projects"`）；在 `theme/index.ts` 中注册项目页所需全局组件（若需）。  
  **文件**：`docs/.vitepress/config.ts`、`docs/.vitepress/theme/index.ts`；**验收**：点击「项目」进入项目页且导航高亮；**回滚**：还原 nav 与注册。

## 6. 收尾与回归

- [ ] 6.1 全站回归：验证首页、`/posts/`、博客文章详情、`/invest/`、`/projects/` 均正常；确认博客 sidebar 与列表顺序无变化。  
  **验收**：本地 `pnpm dev` 与 `pnpm build` 通过，上述路径无报错且数据来源符合 spec；**回滚**：按上述各任务回滚步骤分步还原。
