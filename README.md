# 📝 Ahao's Blog

> 基于 VitePress 打造的个人博客与主题模板，集成首页动效、文章自动索引、评论系统、访问统计与 CI/CD，适合直接部署或二次开发。

[![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646CFF?logo=vite&logoColor=white)](https://vitepress.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15.3-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Deploy-2088FF?logo=github-actions&logoColor=white)](.github/workflows/deploy-pages.yml)

🌐 **线上地址**：[https://blog.mapin.net](https://blog.mapin.net)

---

## ✨ 特性速览

- 🚀 **VitePress 1.6 + Vue 3.5**：享受极速热更新与现代构建体验。
- 🎨 **自定义主题栈**：Hero 动画、问候字符特效、文章列表与分页、鼠标轨迹、页脚计数等均模块化封装。
- 📚 **自动文章索引**：利用 `globby + gray-matter` 扫描 `docs/posts`，生成 `theme.posts` 数据源，页面零配置。
- 💬 **Gitalk 评论**：基于 GitHub Issues，按页面路径生成唯一 `id`，支持暗色模式与自定义标签。
- 📊 **访客统计**：不蒜子 PV/UV 集成，自动在页脚渲染，网络异常时自动隐藏。
- 🔄 **CI/CD**：GitHub Actions 推送即构建，自动写入 `CNAME` 并发布到 `gh-pages` 分支。
- 📱 **响应式 + 深浅色**：所有组件兼容移动端，支持系统主题切换。

## 🧱 技术栈

- **框架与运行时**：VitePress 1.6.4、Vue 3.5.12、Vite
- **工具链**：pnpm 9.15.3、Sass、autoprefixer
- **数据处理**：globby、gray-matter、fs-extra、Day.js
- **交互与插件**：lottie-web、cursor-effects、Gitalk、busuanzi.pure.js、Pinia

## 🗂 项目结构

```
.
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts                 # 站点与主题配置（title、导航、head、posts 数据注入等）
│   │   └── theme/
│   │       ├── components/           # Hero、Greeting、PostList、Comments、Footer、MouseEvent 等
│   │       ├── views/                # Home/Gallery/Tools 页面骨架
│   │       ├── utils/                # posts.ts（文章扫描）、date.ts（日期格式化）
│   │       ├── constants/            # Gitalk 与分页配置
│   │       └── Layout.vue            # 覆盖默认 Layout，挂载标题、分类、翻页、评论等 Slot
│   ├── posts/                        # Markdown 文章（含 index.md 占位）
│   ├── public/
│   │   ├── image/                    # 头像、二维码、示意图
│   │   ├── guandan/v1,v2             # Demo 静态页
│   │   ├── resume/                   # 在线简历
│   │   └── QianFan.jpg               # 站点 Logo/Favicon
│   ├── about.md / gallery.md / tools.md / index.md
│   └── ...
├── .github/workflows/deploy-pages.yml # 自动部署配置
├── package.json / pnpm-lock.yaml
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm ≥ 9.15.3（项目通过 `packageManager` 字段锁定）

### 开发调试

```bash
pnpm install
pnpm run docs:dev    # http://localhost:5173
```

### 构建与预览

```bash
pnpm run docs:build          # 产物：docs/.vitepress/dist
pnpm run docs:preview        # 以生产模式预览
```

## 📄 内容管理

- **文章目录**：`docs/posts/` 下的所有 `.md`（除 `index.md`）会被自动扫描。若需要更换目录，请同步修改 `docs/.vitepress/theme/utils/posts.ts` 的 `getPostMDFilePaths`。
- **Front Matter 建议**：

```markdown
---
title: GitHub Actions 部署指南
date: 2024-11-01
tags: [CI/CD, GitHub Actions]
description: 用于生成列表摘要、SEO、Gitalk issue body
---
```

- **排序规则**：`date` 字段会被转换为 `YYYY-MM-DD`，倒序显示。
- **标签与描述**：`PostCard` 会展示标签，`Gitalk` 使用 `title + description` 生成 issue body。

## 🎨 主题架构

| 模块 | 职责 |
| --- | --- |
| `Layout.vue` | 基于 DefaultTheme Layout，插入 `PostTitle`、`PostCategory`、`PostPager`、`Comments`、`Footer`、`MouseEvent` 等内容。 |
| `components/home` | `Hero.vue`（Lottie 动画）、`Greeting.vue`（字符揭示）、`HomePostList.vue`。 |
| `components/post` | 文章卡片、分页、分类等展示组件。 |
| `components/plugin/Comments.vue` | Gitalk 挂载逻辑，使用 `page.relativePath` 生成唯一 issue id，并自动注入标题/描述/URL。 |
| `components/effect/Counter.vue` | 不蒜子 PV/UV 统计。 |
| `constants/index.ts` | Gitalk 与分页配置，建议改造为读取环境变量。 |
| `utils/posts.ts` | `getPosts()`、`getPostLength()`，负责扫描 Markdown 并注入 `themeConfig.posts`。 |

自定义样式集中在 `docs/.vitepress/theme/custom.css`，可统一覆盖配色、字体、暗色模式等。

## 💬 评论与访客统计

- `GITALK_CONFIG` 当前位于 `docs/.vitepress/theme/constants/index.ts`，生产环境推荐改为 `import.meta.env` 或 CI 注入，避免泄露 `clientSecret`。
- 评论仓库需提前创建并允许 Issue；`admin` 数组可添加协作者，确保拥有写入权限。
- 不蒜子脚本在网络不可用时会保持隐藏状态，不影响页面布局。

## 📦 静态资源与增量内容

- 放在 `docs/public` 下的文件会被原样复制，可通过 `/image/xxx.png`、`/resume/index.html`、`/guandan/v1/index.html` 直接访问。
- 站点 Logo/头像来自 `/QianFan.jpg`，如需替换请同步更新 `docs/.vitepress/config.ts` 中的 `head`、`logo` 配置。
- 可利用 `public` 目录托管小游戏、投放页面、二维码等扩展内容，无需额外路由。

## 🚢 自动部署（GitHub Actions）

`deploy-pages.yml` 负责整条流水线：

1. 监听 `master` 分支 push。
2. actions/checkout@v3 + pnpm/action-setup@v4 + actions/setup-node@v4。
3. `pnpm install --frozen-lockfile` 保证依赖一致。
4. `pnpm run docs:build` 生成静态文件。
5. 写入 `CNAME`（默认：`blog.mapin.net`）。
6. 通过 `peaceiris/actions-gh-pages@v3` 发布到 `gh-pages` 分支并保留历史文件。

若部署到其他平台，可直接上传 `docs/.vitepress/dist`。

## 🧩 如何将本项目当作主题复用

1. **获取源码**：Fork/下载仓库，或仅复制 `docs/.vitepress`、`docs/posts`、`docs/public`。
2. **安装依赖**：
   ```bash
   pnpm add -D globby gray-matter fs-extra
   pnpm add gitalk busuanzi.pure.js lottie-web dayjs pinia cursor-effects
   ```
3. **注入文章数据**：确保 `docs/.vitepress/config.ts` 中调用 `getPosts()`、`getPostLength()` 并把结果挂到 `themeConfig`（`posts`、`pageSize`、`postLength`）。
4. **配置 Gitalk/统计**：在 `constants/index.ts` 或环境变量里写入自己 GitHub OAuth、评论仓库、管理员，必要时为生产环境新增 Secrets。
5. **替换资源与文案**：更新 Logo、`Hero.vue` 的 Lottie URL、`Greeting.vue` 文案、`Footer.vue` 版权信息、社交链接等。
6. **验证**：`pnpm run docs:dev` 检查评论、分页、鼠标特效、统计、静态资源路由等是否生效。

> **安全提醒**：`clientSecret` 不应提交到公共仓库，可在 GitHub Actions 中使用 `secrets.GITALK_CLIENT_SECRET` 并在构建时写入。

## 🧪 常见问题

- **Gitalk 无法加载/403**：确认 OAuth 应用与评论仓库一致，并已勾选 `repo` 权限；检查 `Comments.vue` 生成的 id 是否 < 50 字符。
- **文章列表为空**：确认 Markdown 位于 `docs/posts/`，且 Front Matter 包含合法日期；如修改目录，记得同步更新 `getPostMDFilePaths`。
- **静态资源 404**：VitePress 仅复制 `docs/public`，请勿放在仓库根目录；访问路径区分大小写。
- **部署后没有自定义域名**：务必保留 Actions 中的 `Add CNAME file` 步骤，或在 `gh-pages` 分支手动添加 `CNAME`。

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证，欢迎 Fork、商用或二次开发，保留署名即可。

---

如果这个主题对你有帮助，欢迎 ⭐️ Star / Issue / PR，一起完善它！
