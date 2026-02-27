# 设计：赞助页（Sponsor Page）

## 依赖

- [proposal.md](./proposal.md) 已确认的 Goals / Non-goals 与涉及文件。

---

## Context

站点已有 Sponsor 打赏组件，展示在 about 页与文章底部。VitePress 配置位于 `docs/.vitepress/config.ts`，主题组件在 `docs/.vitepress/theme/`。nav 当前为平铺结构（首页、博客、关于），「关于」为单链接 `/about`。需新增赞助明细页，展示收支统计与明细列表，并调整 nav 为下拉菜单。

---

## Goals / Non-Goals

**Goals：**
- 赞助明细页 `/sponsor`，单页分块布局（统计卡片 → 收入明细 → 支出明细 → 打赏入口）
- 收支统计：总收入、总支出、结余；数据来自 sponsors.json + expenses.json
- 入口：Sponsor 组件内链接 + nav「关于」下拉（关于我、赞助明细）
- 手动实现的 Vue 组件，无第三方 UI 库

**Non-Goals：**
- 不接入动态 API
- 不影响 posts sidebar 与 frontmatter 约定
- 不实现筛选、排序、分页

---

## MVP（最小实现方案）

### 1. 数据文件

- **sponsors.json**：`docs/.vitepress/sponsor/sponsors.json`，格式见 proposal；用于收入统计与 SponsorList。
- **expenses.json**：`docs/.vitepress/sponsor/expenses.json`，格式见 proposal；用于支出统计与 ExpenseList。
- **加载方式**：Vue 组件内通过 `import sponsors from '../../sponsor/sponsors.json'`（组件在 `theme/components/` 下）加载；JSON 置于 `docs/.vitepress/sponsor/` 下，Vite 会打包。
- **边界处理**：JSON 缺失或解析失败时，组件降级为 0 / 空表，按 proposal 边界约定。

### 2. 组件实现

| 组件 | 实现要点 |
|------|----------|
| SponsorStats | 读取 sponsors + expenses，计算总收入、总支出、结余；渲染三张卡片，金额格式 `¥ xxx`；空/异常时显示 0 |
| SponsorList | 读取 sponsors，按 date 倒序；表格列：序号、昵称、金额、渠道（alipay→支付宝，wechat→微信）、时间、备注；空数组时显示「暂无赞助记录」 |
| ExpenseList | 读取 expenses，按 date 倒序；表格列：序号、用途说明、金额、时间；空数组时显示「暂无支出记录」 |

### 3. Sponsor 组件修改

- 将「🧋喝口奶茶」标题（h2）改为可点击的链接，`href` 指向 `/sponsor`，使用 `withBase('/sponsor')` 确保 base 路径正确。
- 不新增「查看赞助明细」等额外描述文字；点击标题即跳转。
- 链接样式与现有 h2 或 link 风格一致，保持视觉上为标题。

### 4. nav 配置修改

- 将 `themeConfig.nav` 中「关于」由 `{ text, link, activeMatch }` 改为：
  ```ts
  {
    text: "👤 关于",
    activeMatch: "^/(about|sponsor)",
    items: [
      { text: "关于我", link: "/about" },
      { text: "🧋 赞助", link: "/sponsor" },
    ],
  },
  ```
- VitePress 默认主题支持 `items` 下拉，移动端会自动展开。

### 5. sponsor.md 页面

- 路径：`docs/sponsor.md`
- frontmatter：`title: 赞助`，`description: 站点赞助与收支公示`
- 正文：Markdown 标题 + 组件嵌入，例如：
  ```md
  ## 收支统计
  <SponsorStats />
  ## 收入明细（赞助记录）
  <SponsorList />
  ## 支出明细
  <ExpenseList />
  ---
  <Sponsor />
  ```

### 6. 注册组件与样式

- `docs/.vitepress/theme/index.ts`：`app.component('SponsorStats', SponsorStats)` 等。
- **样式**：SponsorStats、SponsorList、ExpenseList 在各组件内使用 `<style scoped>` 定义样式，与 donation-card 风格统一，支持 dark 模式；**不修改 custom.css**。

### 7. 兼容性与影响面

- **路由**：`/sponsor` 由 VitePress 根据 `docs/sponsor.md` 自动生成。
- **sidebar**：`/sponsor` 不匹配 `sidebar['/posts/']`，使用默认 doc layout 的 outline。
- **frontmatter**：sponsor.md 仅需 title/description，无 date/tags 依赖。

---

## 备选方案与不采用理由

### 备选 A：JSON 置于 public/，运行时 fetch

- **做法**：sponsors.json、expenses.json 放入 `docs/public/`，组件在 `onMounted` 中 `fetch('/sponsors.json')` 加载。
- **不采用理由**：SSR 下需处理 hydrate 与客户端加载时序，且增加网络请求；静态 import 在构建时打包，更简单且无闪烁。

### 备选 B：使用第三方表格组件（如 PrimeVue）

- **做法**：引入 PrimeVue 等 UI 库，使用 DataTable 渲染收支列表。
- **不采用理由**：proposal 约定「手动实现 Vue 组件，不引入第三方 UI 库」；当前表格需求简单，原生 table + CSS 即可满足，保持轻量。

### 备选 C：nav 保持单链接，仅通过 Sponsor 组件进入

- **做法**：不在 nav 中增加赞助入口，用户仅通过 Sponsor 组件内「🧋喝口奶茶」点击跳转。
- **不采用理由**：proposal 明确 Goals 为「入口 2：nav 下拉包含赞助」，用户希望可从 nav 直接进入。

---

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| JSON import 路径在 VitePress 中解析失败 | 使用 `resolve(__dirname, 'sponsors.json')` 或 Vite `define` 注入；或改用 `import.meta.glob` 预加载 |
| nav items 在旧版 VitePress 不兼容 | 参考官方文档确认 nav items 结构；本变更使用标准 VitePress nav 配置 |
| 移动端表格横向溢出 | 表格容器 `overflow-x: auto`；或 `@media (max-width: 640px)` 下改为卡片堆叠 |

---

## Migration Plan

- **部署**：新增文件 + 修改配置，无数据迁移；sponsors.json、expenses.json 初始可为空数组。
- **回滚**：恢复 nav 为单链接；移除 sponsor.md；移除 Sponsor 内链接；删除 SponsorStats、SponsorList、ExpenseList 及注册；删除 `docs/.vitepress/sponsor/` 下 JSON 文件。
