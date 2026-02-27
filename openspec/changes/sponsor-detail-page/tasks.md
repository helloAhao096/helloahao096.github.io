# 任务：赞助页（Sponsor Page）

## 依赖

- [proposal.md](./proposal.md)
- [design.md](./design.md)
- [specs/sponsor-detail-page/spec.md](./specs/sponsor-detail-page/spec.md)

---

## 任务列表

以下任务按可交付物拆分，建议顺序执行；验收通过后在框中勾选 `[x]`。

---

## 1. 数据文件与样式基础

- [x] 1.1 新增 `docs/.vitepress/sponsor/sponsors.json`，初始为空数组 `[]`；新增 `docs/.vitepress/sponsor/expenses.json`，初始为空数组 `[]`

  **验收**：两个 JSON 文件存在且为有效 JSON 数组；可手动添加一条测试数据验证格式。

  **回滚**：删除 `docs/.vitepress/sponsor/` 目录及其中文件。

- [x] 1.2 样式在各组件内定义：SponsorStats、SponsorList、ExpenseList 使用 `<style scoped>`，与 donation-card 风格统一，支持 dark 模式；不修改 custom.css

  **验收**：各组件创建后样式随组件加载；切换明暗主题时样式正常。

  **回滚**：无需回滚（无 custom.css 修改）。

---

## 2. 组件实现

- [x] 2.1 新增 `docs/.vitepress/theme/components/SponsorStats.vue`，读取 sponsors.json + expenses.json，计算总收入、总支出、结余，渲染三张统计卡片；处理 JSON 缺失/解析失败/空数组，按 proposal 边界约定显示 0；组件内使用 `<style scoped>` 定义样式

  **验收**：在 sponsor.md 中嵌入 `<SponsorStats />`，访问 `/sponsor` 可见三张卡片；空 JSON 时显示 ¥0；有数据时统计正确；样式与 donation-card 统一。

  **回滚**：删除 SponsorStats.vue。

- [x] 2.2 新增 `docs/.vitepress/theme/components/SponsorList.vue`，读取 sponsors.json，按 date 倒序渲染收入明细表格；列：序号、昵称、金额、渠道（alipay→支付宝、wechat→微信）、时间、备注；空/异常时显示「暂无赞助记录」；组件内使用 `<style scoped>` 定义表格样式

  **验收**：在 sponsor.md 中嵌入 `<SponsorList />`，有数据时表格按时间倒序展示，channel 映射正确；空 JSON 时显示「暂无赞助记录」；样式与 donation-card 统一。

  **回滚**：删除 SponsorList.vue。

- [x] 2.3 新增 `docs/.vitepress/theme/components/ExpenseList.vue`，读取 expenses.json，按 date 倒序渲染支出明细表格；列：序号、用途说明、金额、时间；空/异常时显示「暂无支出记录」；组件内使用 `<style scoped>` 定义表格样式

  **验收**：在 sponsor.md 中嵌入 `<ExpenseList />`，有数据时表格按时间倒序展示；空 JSON 时显示「暂无支出记录」；样式与 donation-card 统一。

  **回滚**：删除 ExpenseList.vue。

---

## 3. 注册组件与 Sponsor 入口

- [x] 3.1 在 `docs/.vitepress/theme/index.ts` 中注册 SponsorStats、SponsorList、ExpenseList 为全局组件（`app.component(...)`）

  **验收**：markdown 中可直接使用 `<SponsorStats />`、`<SponsorList />`、`<ExpenseList />` 无需局部导入。

  **回滚**：移除 index.ts 中的 component 注册。

- [x] 3.2 在 `docs/.vitepress/theme/components/Sponsor.vue` 中将「🧋喝口奶茶」标题改为可点击链接，href 指向 `/sponsor`，使用 `withBase('/sponsor')`；不新增「查看赞助明细」等额外描述文字

  **验收**：about 页与文章底部 Sponsor 组件中「🧋喝口奶茶」标题可点击，点击跳转至 `/sponsor`；无额外文字。

  **回滚**：恢复标题为普通 h2 文本，移除链接。

---

## 4. 赞助明细页与 nav

- [x] 4.1 新增 `docs/sponsor.md`，frontmatter 含 `title: 赞助`、`description: 站点赞助与收支公示`；正文依次嵌入 SponsorStats、SponsorList、ExpenseList、Sponsor 打赏组件（带 Markdown 标题分隔）

  **验收**：访问 `/sponsor` 可见完整赞助页，含统计、收入明细、支出明细、底部 Sponsor 打赏组件；页面大纲正常。

  **回滚**：删除 docs/sponsor.md。

- [x] 4.2 修改 `docs/.vitepress/config.ts` 中 `themeConfig.nav`，将「关于」由单链接改为 `items` 下拉，包含「关于我」→ `/about`、「🧋 赞助」→ `/sponsor`（带 icon/emoji）；`activeMatch` 调整为 `^/(about|sponsor)`

  **验收**：顶部 nav「关于」显示为下拉，展开后含「关于我」「🧋 赞助」；点击「🧋 赞助」跳转至 `/sponsor`；移动端可正常展开。

  **回滚**：恢复 nav 为 `{ text: "👤 关于", link: "/about", activeMatch: "^/about" }`。

---

## 执行顺序建议

1. 1.1（数据文件）→ 组件加载依赖
2. 1.2（样式策略：组件内 scoped）→ 实现时在各组件内定义
3. 2.1 / 2.2 / 2.3（三个组件）→ 可并行或按依赖顺序
4. 3.1（注册）→ 3.2（Sponsor 入口）
5. 4.1（sponsor.md）→ 4.2（nav）

全部勾选后即可视为本变更实现完成，可进入验证与归档阶段。
