# 📝 Ahao's Blog

> 基于 VitePress 构建的个人技术博客

[![VitePress](https://img.shields.io/badge/VitePress-1.6.4-646CFF?logo=vite&logoColor=white)](https://vitepress.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15.3-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-Deploy-2088FF?logo=github-actions&logoColor=white)](.github/workflows/deploy-pages.yml)

🌐 **博客地址**: [https://blog.mapin.net](https://blog.mapin.net)

---

## ✨ 功能特性

- 🚀 **基于 VitePress** - 快速、简洁的静态站点生成器
- 🎨 **自定义主题** - 基于 [vitepress-blog-zaun](https://github.com/clark-cui/vitepress-blog-zaun) 主题定制
- 💬 **Gitalk 评论系统** - 基于 GitHub Issues 的评论功能
- 📊 **访问统计** - 集成不蒜子网站计数器
- 🖱️ **交互特效** - 自定义鼠标事件和特效
- 📱 **响应式设计** - 完美适配各种设备
- 🔄 **自动部署** - GitHub Actions 自动化构建和部署
- 🌓 **深色模式** - 支持明暗主题切换

## 🚀 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9.15.3

### 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm run docs:dev
```

开发服务器启动后，访问 `http://localhost:5173` 即可预览博客。

### 构建和预览

```bash
# 构建生产版本
pnpm run docs:build

# 预览构建结果
pnpm run docs:preview
```

## 📁 项目结构

```
.
├── docs/                    # 文档目录
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.ts       # 配置文件
│   │   └── theme/          # 主题文件
│   ├── posts/              # 博客文章目录
│   ├── public/             # 静态资源目录
│   ├── index.md            # 首页
│   ├── tags.md             # 标签页
│   └── archives.md         # 归档页
├── .github/
│   └── workflows/          # GitHub Actions 工作流
├── package.json            # 项目配置
└── README.md              # 项目说明
```

## 📝 内容管理

### 添加新文章

在 `docs/posts/` 目录下创建 Markdown 文件即可。文章会自动被识别并显示在博客中。

### 文章格式

文章使用 Markdown 格式编写，支持 Front Matter 配置：

```markdown
---
title: 文章标题
date: 2024-01-01
tags: [标签1, 标签2]
---

文章内容...
```

## 🚢 部署说明

### 自动部署

项目使用 GitHub Actions 实现自动部署，当代码推送到 `master` 分支时会自动触发构建和部署流程。

部署流程：
1. 检出代码
2. 安装 pnpm 和 Node.js
3. 安装项目依赖
4. 构建 VitePress 项目
5. 部署到 `gh-pages` 分支

### 手动部署

如果需要手动部署，可以执行以下命令：

```bash
# 构建项目
pnpm run docs:build

# 构建产物在 docs/.vitepress/dist 目录
# 可以手动上传到服务器或使用其他部署方式
```

## 🛠️ 技术栈

- **静态站点生成器**: [VitePress](https://vitepress.dev/) 1.6.4
- **包管理器**: [pnpm](https://pnpm.io/) 9.15.3
- **样式预处理**: Sass
- **评论系统**: Gitalk
- **状态管理**: Pinia
- **日期处理**: Day.js
- **构建工具**: Vite

## 📚 博客内容

本博客主要分享以下内容：

- 🐳 **DevOps** - Docker、GitHub Actions、CI/CD 等
- 🐧 **Linux** - 系统配置、服务管理、网络配置等
- 💻 **前端开发** - Vue、Vite、前端工程化等
- 🗄️ **数据库** - PostgreSQL 等数据库相关
- 🔧 **工具配置** - 各种开发工具和环境配置
- 🤖 **AI 相关** - LangGraph 等 AI 框架使用

## 👤 关于作者

<!-- TODO: 请在此处填写个人信息 -->
**Ahao**

- 📧 Email: helloahao@icloud.com
- 🌐 Blog: [https://blog.mapin.net](https://blog.mapin.net)

### 社交链接

<!-- TODO: 请在此处添加社交链接，例如： -->
<!-- - 🐦 Twitter: [@your_username](https://twitter.com/your_username) -->
<!-- - 💼 LinkedIn: [Your Name](https://linkedin.com/in/your_profile) -->
<!-- - 🐙 GitHub: [@your_username](https://github.com/your_username) -->
<!-- - 📱 微信公众号: 你的公众号名称 -->

## 🙏 致谢

- 主题基于 [Clark Cui](https://github.com/clark-cui) 的 [vitepress-blog-zaun](https://github.com/clark-cui/vitepress-blog-zaun) 主题
- 感谢所有开源项目的贡献者

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

---

⭐ 如果这个项目对你有帮助，欢迎 Star！
