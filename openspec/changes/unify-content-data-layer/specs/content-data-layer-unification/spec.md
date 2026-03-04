# Spec: content-data-layer-unification

## ADDED Requirements

### Requirement: 公用方法按目录扫描并返回统一条目结构

系统 SHALL 提供唯一的公用方法（如 `getMarkdownEntriesByDir(dirName, options?)`），用于扫描指定 `docs` 下子目录中的 Markdown 文件，解析 frontmatter 与内容，获取 Git 或文件修改时间作为 lastUpdated，归一化 date，生成 regularPath，并返回与现有 Post 结构兼容的条目数组。扫描、解析、时间与路径规则仅在此方法内实现，不在各领域 API 中重复实现。

#### Scenario: 扫描指定目录下的 md 文件

- **WHEN** 调用公用方法并传入目录名（如 `posts`、`invest`、`projects`）
- **THEN** 系统仅扫描 `docs/<dirName>/` 下的 `**/*.md` 文件，并返回对应条目数组

#### Scenario: 条目包含 frontMatter、regularPath、lastUpdated

- **WHEN** 公用方法解析到合法 md 文件
- **THEN** 每个条目 SHALL 包含 `frontMatter`（含 date、title 等）、`regularPath`（与 VitePress 路由一致）、以及可选的 `lastUpdated`（毫秒时间戳）

#### Scenario: 按时间倒序排列

- **WHEN** 公用方法返回多条条目
- **THEN** 条目 SHALL 按 lastUpdated 或 frontMatter.date 降序排列

---

### Requirement: 领域 API 仅调用公用方法并做领域过滤

系统 SHALL 为博客、投资、项目三个内容域分别提供领域 API：`getPosts()`、`getInvestEntries()`、`getProjectEntries()`。每个领域 API 内部 MUST 仅调用上述公用方法并传入对应目录名与领域相关 options（如排除 index 文件），不得重复实现扫描、解析 frontmatter 或获取时间的逻辑。

#### Scenario: getPosts 行为与现有博客一致

- **WHEN** 调用 `getPosts()`
- **THEN** 返回的条目仅来自 `docs/posts/`，且排除 `posts/index.md`，结构与现有 theme.posts 消费方兼容

#### Scenario: getInvestEntries 返回投资域条目

- **WHEN** 调用 `getInvestEntries()`
- **THEN** 返回的条目仅来自 `docs/invest/`，排除 index 的约定与实现一致（若存在）

#### Scenario: getProjectEntries 返回项目域条目

- **WHEN** 调用 `getProjectEntries()`
- **THEN** 返回的条目仅来自 `docs/projects/`，排除 `projects/index.md`（或约定不排除，由实现与 design 一致）

---

### Requirement: 配置层统一注入 themeConfig 内容数据

系统 SHALL 在 VitePress 配置（config）中仅通过领域 API 获取数据，并将结果分别挂载到 `themeConfig.posts`、`themeConfig.invest`、`themeConfig.projects`。组件与模块不得直接调用公用方法或自行扫描文件系统获取内容列表。

#### Scenario: config 注入 posts、invest、projects

- **WHEN** 站点 build 或 dev 启动时加载 config
- **THEN** themeConfig 中 SHALL 包含 `posts`、`invest`、`projects` 三个键，其值分别为 `getPosts()`、`getInvestEntries()`、`getProjectEntries()` 的返回值

#### Scenario: 模块仅通过 useData().theme 消费

- **WHEN** 博客、投资、项目模块需要内容列表
- **THEN** 各模块 SHALL 仅通过 `useData().theme.posts`、`theme.invest`、`theme.projects` 或基于它们的 composable 获取数据，不得直接调用 getXxx 或公用方法

---

### Requirement: 投资模块与页面

系统 SHALL 提供投资内容域对应的模块与页面：投资模块仅消费 `theme.invest`；存在投资列表页（如 `/invest/`），由该模块的组件渲染，展示来自 `theme.invest` 的条目；导航中 SHALL 包含「投资」入口，指向投资列表页，且 activeMatch 使该路由下导航高亮正确。

#### Scenario: 投资导航与路由

- **WHEN** 用户点击导航中的「投资」
- **THEN** 跳转至投资列表页（如 `/invest/`），且导航栏「投资」项高亮

#### Scenario: 投资列表数据来源

- **WHEN** 用户访问投资列表页
- **THEN** 页面展示的列表数据 MUST 来自 `theme.invest`，且投资模块不读取 `theme.posts` 或 `theme.projects`

---

### Requirement: 项目模块与页面

系统 SHALL 提供项目内容域对应的模块与页面：项目模块仅消费 `theme.projects`；项目页（如 `/projects` 或 `/projects/`）由项目模块的组件渲染，可包含说明文案与来自 `theme.projects` 的条目列表；导航中已存在的「项目」入口 SHALL 指向该项目页，且 activeMatch 正确。

#### Scenario: 项目导航与路由

- **WHEN** 用户点击导航中的「项目」
- **THEN** 跳转至项目页（如 `/projects/`），且导航栏「项目」项高亮

#### Scenario: 项目页数据来源

- **WHEN** 用户访问项目页
- **THEN** 页面中列表部分（若有）的数据 MUST 来自 `theme.projects`，且项目模块不读取 `theme.posts` 或 `theme.invest`

---

### Requirement: 博客行为无回归

现有博客的 URL 结构、sidebar 按年分组、列表页与文章详情页行为 SHALL 保持不变；`themeConfig.posts` 的产出方式可由内部重构为通过公用方法，但对外的数据结构与消费方兼容。

#### Scenario: 博客列表与 sidebar 不变

- **WHEN** 用户访问 `/posts/` 或任意博客文章页
- **THEN** 列表顺序、sidebar 分组与链接、文章详情内容与重构前一致
