# 提案：RenderCV 简历集成（方案 A）

## 变更类型

**改代码**（涉及静态资源、构建脚本、CI；不新增博客文章）。

---

## Goals

1. **删除旧简历**：移除 `docs/public/resume/` 下现有静态简历（`index.html`、`style.css` 及 `static/` 目录），并将内容迁移到 RenderCV 格式的 `resume/cv.yaml`。
2. **头像迁移**：将原简历所用头像文件移动到 `docs/public/image/`，重命名为 `zhangzhiwei.jpg`；简历 YAML 中**不引用**该头像。
3. **Python 与渲染**：使用 **uv** 管理根目录 Python 环境（用户已手动 `uv init`），通过 RenderCV 从 `resume/cv.yaml` 生成 HTML 与 PDF，输出到 `docs/public/resume/`。
4. **生成物不入库**：`docs/public/resume/` 下生成的文件不提交；CI 每次从「空目录」执行渲染后再执行 `docs:build`，保证线上简历与 YAML 一致。
5. **本地预览（方案 A）**：本地编辑 `cv.yaml` 后手动执行渲染命令，通过 VitePress 开发服务器访问 `/resume/` 查看效果；不实现 watch 自动渲染。

---

## Non-goals

1. **不修改 nav**：不在 `docs/.vitepress/config.ts` 的 `themeConfig.nav` 中新增「简历」入口；后续可单独操作。
2. **简历内不引用头像**：`cv.yaml` 中不配置头像图片字段。
3. **不引入 JSON Resume**：不维护 `resume.json`，不以 JSON Resume 生态为本变更的一部分。

---

## 涉及文件与目录

| 操作 | 路径 | 说明 |
|------|------|------|
| 删除 | `docs/public/resume/index.html` | 旧简历 HTML |
| 删除 | `docs/public/resume/style.css` | 旧简历样式 |
| 删除 | `docs/public/resume/static/` | 旧头像等静态资源（若存在） |
| 移动 | 原 `docs/public/resume/static/张智伟.jpg` → `docs/public/image/zhangzhiwei.jpg` | 头像迁移并重命名 |
| 新增 | `resume/cv.yaml` | RenderCV 格式简历内容（由旧简历内容迁移） |
| 修改 | `.gitignore` | 增加 `docs/public/resume/`，使生成物不被提交 |
| 修改 | `package.json` | 增加脚本 `resume:render`，通过 uv 调用 `rendercv render resume/cv.yaml -o docs/public/resume` |
| 修改 | `.github/workflows/deploy-pages.yml` | 在 Build 前增加：Setup Python（3.12）、安装 RenderCV（uv 或 pip）、执行 `resume:render` |

**不涉及**：`docs/.vitepress/config.ts`（nav 不改）、`docs/.vitepress/theme/**`（无主题/路由逻辑变更）。站点路由与 sidebar 不受影响；仅 `docs/public/resume/` 由 CI 在构建时生成，部署后若通过其他方式链到 `/resume/` 即可访问。

---

## 数据迁移概要（旧简历 → cv.yaml）

- **basics**：姓名张智伟，手机、邮箱、博客 URL、籍贯江苏省无锡市、民族汉族、年龄 25、性别男（按 RenderCV schema 与 locale 组织）。
- **work**：三段经历——无锡中交遥感天域（2023.12～至今 / Python 开发）、无锡天思团创（2023.4～2023.10 / Python 开发）、无锡沃爱思（2021.7～2022.12 / 后端开发）；职责可放入各条 `highlights` 或 `summary`。
- **education**：南京理工大学 软件工程 本科；无锡南洋学院 计算机应用 专科。
- **projects**：Neumix（ERP）、无人机信号检测与干扰系统、北京特警总队全频全向天线信号侦测——名称、时间、技术栈、责任描述迁移到 RenderCV 的 projects/自定义 section。
- **skills / 个人优势**：按「后端开发」「Linux」「前端开发」等块迁移为 RenderCV 的 sections 或 skills，关键词与描述对应旧内容。
- **不包含**：头像引用、nav 配置。

---

## 验收预期

- 删除并迁移完成后，`docs/public/resume/` 在仓库中仅存在目录或为 gitignore 忽略，无提交的 HTML/CSS/图片。
- 本地：根目录 `uv run rendercv render resume/cv.yaml -o docs/public/resume`（或 `pnpm run resume:render`）可生成 HTML/PDF；`pnpm run docs:dev` 下访问 `/resume/` 可见简历页。
- CI：push 后 workflow 先渲染简历再 `docs:build`，部署站点中 `/resume/` 内容与当前 `resume/cv.yaml` 一致；PDF 可用于求职投递。

---

请确认上述范围与 Non-goals 是否符合预期，确认后再进入 design / tasks 阶段。
