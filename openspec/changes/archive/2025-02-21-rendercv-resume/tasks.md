# 任务：RenderCV 简历集成（方案 A）

## 依赖

- [proposal.md](./proposal.md)
- [design.md](./design.md)

---

## 任务列表

以下任务按可交付物拆分，建议顺序执行；验收通过后在框中勾选 `[x]`。

---

### 任务 1：清理旧简历并迁移头像

**交付物**：旧简历文件已删除，头像已移至 `docs/public/image/zhangzhiwei.jpg`。

**文件级改动**：

| 操作 | 路径 |
|------|------|
| 删除 | `docs/public/resume/index.html` |
| 删除 | `docs/public/resume/style.css` |
| 删除 | `docs/public/resume/static/`（若存在，含其下所有文件） |
| 移动 | 原 `docs/public/resume/static/张智伟.jpg` → `docs/public/image/zhangzhiwei.jpg` |

**验收**：`docs/public/resume/` 下无旧 HTML/CSS/静态资源；`docs/public/image/zhangzhiwei.jpg` 存在且为有效图片。

**回滚**：从 git 历史恢复被删文件；将 `zhangzhiwei.jpg` 移回原路径（若需恢复旧简历）。

- [x] 任务 1 完成

---

### 任务 2：新增 resume/cv.yaml 并迁移内容

**交付物**：存在 `resume/cv.yaml`，内容符合 RenderCV schema，且由旧简历内容迁移（basics、work、education、projects、skills 等）；不包含头像引用。

**文件级改动**：

| 操作 | 路径 |
|------|------|
| 新增 | `resume/cv.yaml` |

**验收**：在项目根执行 `uv run rendercv render resume/cv.yaml --html-path docs/public/resume/index.html --pdf-path docs/public/resume/resume.pdf` 可成功生成 HTML 与 PDF，无 schema 报错；生成页内容与旧简历信息一致（除头像外）。

**回滚**：删除 `resume/cv.yaml`。

- [x] 任务 2 完成

---

### 任务 3：配置 .gitignore 与 package.json 脚本

**交付物**：生成物不被提交；本地可通过 `pnpm run resume:render` 执行渲染。

**文件级改动**：

| 操作 | 路径 | 变更摘要 |
|------|------|----------|
| 修改 | `.gitignore` | 新增一行 `docs/public/resume/` |
| 修改 | `package.json` | 在 `scripts` 中新增 `resume:render`，命令为 design 中约定的 `uv run rendercv render resume/cv.yaml --html-path docs/public/resume/index.html --pdf-path docs/public/resume/resume.pdf` |

**验收**：执行 `pnpm run resume:render` 后 `docs/public/resume/` 下出现 `index.html` 与 `resume.pdf`；执行 `git status` 不显示 `docs/public/resume/` 下文件为待提交。

**回滚**：从 `.gitignore` 移除 `docs/public/resume/`；从 `package.json` 移除 `resume:render` 脚本。

- [x] 任务 3 完成

---

### 任务 4：CI 中增加 Python 与简历渲染步骤

**交付物**：push 到 master 后，CI 在 Build 前安装 Python 3.12、安装 RenderCV（或 uv + 依赖），执行简历渲染，再执行 `docs:build`。

**文件级改动**：

| 操作 | 路径 | 变更摘要 |
|------|------|----------|
| 修改 | `.github/workflows/deploy-pages.yml` | 在 `pnpm install` 之后、`pnpm run docs:build` 之前插入：Setup Python 3.12；安装 uv 或 pip 安装 `rendercv[full]`；执行 `pnpm run resume:render`（或等价的 `uv run rendercv render ...` / `rendercv render ...`） |

**验收**：在 CI 日志中可见「简历渲染」步骤成功；部署后访问 `https://<站点>/resume/` 可见与当前 `resume/cv.yaml` 一致的简历页；`/resume/resume.pdf` 可下载。

**回滚**：从 workflow 中移除新增的 Python 与 resume 渲染步骤，保留原有 Build 与 Deploy。

- [x] 任务 4 完成

---

### 任务 5：确认 pyproject.toml 依赖

**交付物**：根目录 `pyproject.toml` 中包含 `rendercv[full]`，Python 版本 ≥ 3.12；执行 `uv sync` 后可正常执行 `uv run rendercv --help`。

**文件级改动**：

| 操作 | 路径 | 变更摘要 |
|------|------|----------|
| 修改 | `pyproject.toml`（根目录） | 在依赖中增加 `rendercv[full]`；若尚未约束 Python 版本，增加 `requires-python = ">=3.12"`（或等价写法） |

**验收**：`uv sync` 无报错；`uv run rendercv render resume/cv.yaml --html-path docs/public/resume/index.html --pdf-path docs/public/resume/resume.pdf` 可成功执行。

**回滚**：从 `pyproject.toml` 移除 `rendercv[full]` 并重新 `uv sync`。

- [x] 任务 5 完成

---

## 执行顺序建议

1. 任务 5（pyproject.toml）→ 保证本地有 RenderCV。
2. 任务 1（清理与头像）→ 避免路径冲突。
3. 任务 2（cv.yaml）→ 内容就绪后可本地试渲染。
4. 任务 3（.gitignore + package.json）→ 统一渲染入口。
5. 任务 4（CI）→ 最后打通部署。

全部勾选后即可视为本变更实现完成，可进入验证与归档阶段。
