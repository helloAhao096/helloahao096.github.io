# 设计：RenderCV 简历集成（方案 A）

## 依赖

- [proposal.md](./proposal.md) 已确认的 Goals / Non-goals 与涉及文件。

---

## MVP（最小实现方案）

### 1. 清理与迁移

- **删除**：`docs/public/resume/index.html`、`docs/public/resume/style.css`、`docs/public/resume/static/`（若存在）。
- **头像**：将 `docs/public/resume/static/张智伟.jpg` 移动为 `docs/public/image/zhangzhiwei.jpg`（若当前无 `static/`，则从旧简历引用路径反推源文件位置并移动）。
- **cv.yaml**：在 `resume/cv.yaml` 中按 RenderCV 官方 schema 编写内容，数据来源为旧简历（见 proposal 数据迁移概要）。不包含 `image` 或任何头像引用。

### 2. 根目录 Python（uv）

- 用户已执行 `uv init`，根目录存在 `pyproject.toml`（及可选 `uv.lock`）。
- 在 `pyproject.toml` 的依赖中增加 `rendercv[full]`，Python 版本约束 ≥ 3.12。
- 渲染命令通过 `uv run rendercv` 调用，保证与 CI 一致。

### 3. 渲染命令与输出路径

- RenderCV 使用 **分格式输出参数**，非单一 `-o` 目录：
  - `--html-path PATH`（或 `-html`）：HTML 输出路径。
  - `--pdf-path PATH`（或 `-pdf`）：PDF 输出路径。
- MVP 约定：
  - HTML：`docs/public/resume/index.html`（VitePress 通过 `/resume/` 访问）。
  - PDF：`docs/public/resume/resume.pdf`（供下载/发 HR）。
- 单条命令示例：
  ```bash
  uv run rendercv render resume/cv.yaml --html-path docs/public/resume/index.html --pdf-path docs/public/resume/resume.pdf
  ```

### 4. package.json 脚本

- 新增脚本名：`resume:render`。
- 脚本内容：调用上述 `uv run rendercv render ...` 命令（路径与上一致），便于本地与 CI 复用。

### 5. .gitignore

- 新增一行：`docs/public/resume/`，使该目录下所有生成文件不被提交（CI 每次从「空」状态生成）。

### 6. CI（.github/workflows/deploy-pages.yml）

- 在现有 **Build** 步骤（`pnpm run docs:build`）**之前**插入：
  1. **Setup Python**：使用 `actions/setup-python@v5`，`python-version: '3.12'`。
  2. **安装 uv**（可选）：若 CI 使用 uv，增加安装 uv 的 step；否则使用 `pip install "rendercv[full]"` 并直接调用 `rendercv`。
  3. **渲染简历**：执行与本地一致的渲染（即 `pnpm run resume:render`，或等价的 `uv run rendercv render ...` / `rendercv render ...`），确保 `docs/public/resume/` 在 `docs:build` 前已生成。
- 不改变现有步骤顺序：checkout → pnpm → （新增）Python + 简历渲染 → docs:build → CNAME → Deploy。

### 7. 兼容性与影响面

- **VitePress**：不修改 `config.ts`、theme、路由或 sidebar；`docs/public/resume/` 仅为静态资源，build 时被复制到输出目录。
- **旧文章 / frontmatter**：无变更，无迁移策略需求。
- **访问方式**：部署后 `/resume/` 对应 `docs/public/resume/index.html`（与 cleanUrls 一致）；nav 按 Non-goals 暂不修改，后续可单独加「简历」入口。

---

## 备选方案与不采用理由

### 备选 A：CI 中不渲染简历，改为提交生成物

- **做法**：本地渲染后把 `docs/public/resume/` 下 HTML/PDF 提交进仓库，CI 只执行 `pnpm run docs:build`，不安装 Python。
- **不采用理由**：与 proposal 约定「生成物不入库、CI 从空目录生成」不符；且易出现 YAML 与生成物不同步，增加维护成本。

### 备选 B：简历放在独立仓库，构建时拷贝到本仓库

- **做法**：单独建一个「简历仓库」用 RenderCV 生成，再通过 CI 或脚本将生成物拷贝到本仓库的 `docs/public/resume/`。
- **不采用理由**：用户已选择「本仓库内维护 Python + RenderCV」，且希望 CI 一条流水线完成；多仓库与多流水线增加复杂度，当前需求下不必要。

### 备选 C：使用 JSON Resume + resumed 生成 HTML，仅 PDF 用 RenderCV

- **做法**：数据源用 `resume.json`，HTML 用 resumed 生成，PDF 通过 jsonresume-to-rendercv 转 YAML 再用 RenderCV 生成。
- **不采用理由**：proposal 明确 Non-goals 为「不引入 JSON Resume」；用户偏好 RenderCV 主题与单数据源（YAML），故不采用。

---

## 风险与回滚

- **风险**：CI 中增加 Python 步骤，构建时间略增；若 RenderCV 或 uv 版本变动可能导致渲染失败。
- **回滚**：删除 CI 中简历相关步骤，恢复 `docs/public/resume/` 的旧版静态文件（若已提交过备份）或移除 nav 中简历链接；移除 `resume:render` 脚本与 `resume/cv.yaml` 即可恢复为「无 RenderCV」状态。
