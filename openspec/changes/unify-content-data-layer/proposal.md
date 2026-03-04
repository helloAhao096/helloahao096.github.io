## Why

当前站点的内容数据获取逻辑是围绕 `docs/posts/` 目录定制的：
- `getPosts` 只扫描 `posts/` 目录，并在多个组件中通过 `theme.posts` 使用；
- 未来希望新增类似 `invest/` 等其他内容域（如投资专题、知识库），但复用的仅是「模式」，而非「实现」。

随着内容域增加，如果每个域都各自实现一套扫描 md / 解析 frontmatter / 获取 Git 更新时间的逻辑，将带来：
- 重复代码与行为不一致（排序、日期规范、缺失字段处理等）的问题；
- 新增字段或规则时需要多处修改，容易出现「同一篇文章在不同模块展示不一致」的情况；
- 难以从全局视角理解“站点有哪些内容域、各自的数据从哪里来”。

因此需要对「内容数据层」进行统一建模和抽象，在不改变现有文章位置（仍然放在 `docs/` 下）的前提下：
- 统一数据口径：所有内容域的数据都从一套核心工具函数产出；
- 明确领域边界：不同模块通过路径/域名（如 `posts`、`invest`）区分所消费的数据；
- 为后续新增内容域、重构或迁移提供清晰的扩展点。

## What Changes

- **数据层分层设计：公用方法 + 各自 getXxx**
  - **底层：一个公用方法（统一数据口径）**
    - 提供唯一的「按目录扫描 md 并解析为统一结构」的工具函数，例如：
      - `getMarkdownEntriesByDir(dirName: string, options?: {...})`；
    - 该公用方法统一处理且仅在此处实现：
      - 使用 `globby` 扫描指定目录下的 `.md` 文件；
      - 使用 `gray-matter` 解析 frontmatter 与内容；
      - 通过 Git 提交时间 / 文件修改时间获取 `lastUpdated`；
      - 归一化 `frontmatter.date`，并生成用于排序和分组的时间戳；
      - 生成 `regularPath` 等路由相关字段；
    - 抽象出的工具函数应与现有 `Post` 类型兼容，或定义一层基础类型并让 `Post` 复用；
    - 今后任何「扫描规则、时间规则、字段约定」的变更，只在此公用方法中修改一次。
  - **上层：各领域 getXxx（领域边界清晰）**
    - 每个内容域对外只暴露一个明确的领域 API，内部调用上述公用方法，不重复实现扫描/解析逻辑：
      - `getPosts()`：内部调用 `getMarkdownEntriesByDir('posts', postsOptions)`，负责排除 `posts/index.md` 等博客专属过滤，保持现有行为不变；
      - `getInvestEntries()`：内部调用 `getMarkdownEntriesByDir('invest', investOptions)`，负责投资域专属过滤与约定；
      - `getProjectEntries()`：内部调用 `getMarkdownEntriesByDir('projects', projectOptions)`，负责项目域专属过滤与约定；
    - 领域 API 的职责仅限于：指定扫描目录、传入领域相关 options、做少量领域过滤；不在此层再实现一套「扫文件 + 解析 frontmatter + 取时间」。
  - **不采用**：只抽一个公用方法而到处直接传 `'posts'`/`'invest'` 字符串（领域语义分散）；也不采用各领域完全各自实现 getXxx、不抽公用方法（重复逻辑、难以统一口径）。

- **在 VitePress 配置中统一注入领域数据**
  - 在 `docs/.vitepress/config.ts` 中，仅通过上述领域 API 生成数据，并挂载到 `themeConfig`：
    - `themeConfig.posts`：博客主内容域；
    - `themeConfig.invest`：投资内容域；
    - `themeConfig.projects`：项目内容域（开源应用/网站等）；
  - 任何组件/模块不再自行扫描文件系统获取 md 数据，只能通过 `useData().theme.xxx`（或基于它的 composable/store）访问各自领域的数据。

- **按模块划分消费数据的边界**
  - 保持/强化 `.vitepress/theme/modules` 的分层：
    - `modules/post/*`：仅消费 `theme.posts` 数据；
    - `modules/invest/*`：仅消费 `theme.invest` 数据；
    - `modules/projects/*`：仅消费 `theme.projects` 数据；
  - 每个模块内部，通过 composable 或 store 封装对 `theme.xxx` 的读取与视图层逻辑（分组、过滤、分页），例如：
    - `usePostList()` / `usePostGroupsByYear()`；
    - `useInvestTimeline()` 等；
    - `useProjectList()` 等；
  - UI 组件（列表、卡片、概览）不直接接触文件扫描逻辑，也尽量不直接读 raw `theme.xxx`，而是通过模块内的 composable/store 获取数据。

- **新增投资、项目模块与页面**
  - **投资**：新增 `docs/invest/` 内容目录、`getInvestEntries()` 领域 API、`theme.invest`、`modules/invest` 模块，以及投资列表/专题页（如 `/invest/`）；导航增加「投资」入口。
  - **项目**：将现有「项目」导航与页面纳入统一数据层：新增 `docs/projects/` 内容目录（可与现有 `docs/projects.md` 演进为 `docs/projects/index.md`）、`getProjectEntries()` 领域 API、`theme.projects`、`modules/projects` 模块，项目页从 theme.projects 渲染列表。

- **保持内容文件位置与「文件即路由」模型不变**
  - 所有内容继续放在 `docs/` 下的领域目录中：
    - `docs/posts/**/*.md`：博客文章；
    - `docs/invest/**/*.md`：投资专题与财富自由计划；
    - `docs/projects/**/*.md`：项目介绍（每个项目可对应一篇 md 或仅保留 index 页）；
  - `.vitepress/` 继续只承载：
    - VitePress 配置；
    - 主题组件；
    - 内容数据工具层与领域 API；
  - 不引入「将文章 md 搬入 `.vitepress` 作为内部数据」的模式，以符合 VitePress 的第一性原理和现有项目结构约定。

## Capabilities

### New Capabilities
- `content-data-layer-unification`: 定义一套统一的内容数据获取与建模能力，采用「底层公用方法 + 上层各领域 getXxx」的两层结构，支持按目录划分内容域（如 `posts`、`invest`），并通过领域 API 和 themeConfig 将数据暴露给各模块使用。该能力将约束：
  - 底层公用方法（如 `getMarkdownEntriesByDir`）是唯一实现扫描 md、解析 frontmatter、时间与路径规则的地方；
  - 各领域仅通过各自的 `getXxx` 调用该公用方法，不重复实现上述逻辑；
  - 如何在配置层统一注入不同内容域的数据（仅通过 getXxx 产出 themeConfig）；
  - 模块在消费内容数据时应遵循的访问路径与边界。

### Modified Capabilities
- `<existing-name>`: 暂无现有 specs 需要修改，此变更以新增统一数据层能力为主，不改变既有功能的外部行为（URL 结构、sidebar 行为等）。

## Impact

- **受影响代码/目录**（设计与实现阶段会进一步细化）：
  - `docs/.vitepress/theme/modules/post/utils/posts.ts`
    - 从中抽离/重构通用 md 扫描与数据建模逻辑；
    - 保持 `getPosts` 现有外部行为与返回结构不变。
  - 可能新增的通用内容工具模块，例如：
    - `docs/.vitepress/theme/core/content/**` 或 `docs/.vitepress/theme/shared/content/**`（具体路径在设计阶段确定）；
  - `docs/.vitepress/config.ts`
    - 统一通过新抽象层获取 `posts`、`invest`、`projects` 数据并注入 themeConfig；
  - `.vitepress/theme/modules/*`
    - 博客模块继续只依赖 `theme.posts`；
    - 新增投资模块 `modules/invest/*` 只依赖 `theme.invest`；
    - 新增项目模块 `modules/projects/*` 只依赖 `theme.projects`。
  - 新增内容目录与页面：
    - `docs/invest/`、`docs/invest/index.md`（投资列表页）；
    - `docs/projects/` 与现有项目页的演进（如 `docs/projects/index.md`）。

- **行为预期**：
  - 对现有用户来说，博客的 URL、sidebar 和页面行为应保持不变；
  - 内部实现将更易于扩展新的内容域和模块，并减少数据不一致和重复实现的风险；
  - 为后续在「投资」等领域中构建独立模块（包括导航、列表、专题页）提供统一且可复用的数据基础。
