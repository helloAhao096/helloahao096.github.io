# 提案：赞助页（Sponsor Page）

## 变更类型

**改代码**（新增赞助页、收支统计、Sponsor 组件扩展、nav 调整；不新增博客文章）。

---

## Why

站点已有 Sponsor 打赏组件（支付宝/微信），展示在 about 页与文章底部，但缺少赞助记录与收支透明公示。用户希望查看赞助者列表、金额、时间、渠道、备注，以及网站维护支出，以增强信任与参与感。同时需区分捐助渠道（微信/支付宝）与收支逻辑。

---

## Goals

1. **赞助页**：新增独立页面 `/sponsor`，标题为「赞助」，采用单页分块布局（方案 A）。
2. **收支统计**：页面顶部展示三个统计卡片——总收入、总支出、结余；结余 = 总收入 - 总支出。
3. **收入明细**：展示赞助者列表（昵称、金额、捐助时间、渠道、备注），按时间倒序。
4. **支出明细**：展示网站维护支出（用途说明、金额、时间），按时间倒序。
5. **入口 1（组件内）**：Sponsor 组件中的「🧋喝口奶茶」标题文本本身可点击，点击后跳转至 `/sponsor`；不新增额外「查看赞助明细」等描述文字。
6. **入口 2（导航栏）**：将 nav 中「关于」改为下拉菜单，包含「关于我」→ `/about`、「🧋 赞助」→ `/sponsor`（带 icon/emoji）。
7. **数据源**：`sponsors.json`（赞助记录）+ `expenses.json`（支出记录）；手动维护，随站点部署。
8. **打赏入口**：赞助页底部必须展示 Sponsor 打赏组件（支付宝/微信），方便继续打赏。

---

## Non-goals

1. **不新增博客文章**：`docs/sponsor.md` 为普通页面（layout: doc），标题「赞助」，非 `docs/posts/` 下的博文。
2. **不接入动态 API**：赞助与支出数据来自静态 JSON，不实现后端接口或实时同步。
3. **不影响 posts sidebar**：`/sponsor` 不纳入 `posts/` 的 sidebar 配置，无 frontmatter.date/title 依赖。
4. **不实现筛选、排序、分页**：列表按时间倒序一次性展示，不支持前端筛选、排序或分页。

---

## 涉及文件与目录

| 操作 | 路径 | 说明 |
|------|------|------|
| 新增 | `docs/sponsor.md` | 赞助页，标题「赞助」，frontmatter 含 title、description；正文嵌入 SponsorStats、SponsorList、ExpenseList、Sponsor 打赏组件 |
| 新增 | `docs/.vitepress/sponsor/sponsors.json` | 赞助数据（收入） |
| 新增 | `docs/.vitepress/sponsor/expenses.json` | 支出数据 |
| 新增 | `docs/.vitepress/theme/components/SponsorStats.vue` | 统计卡片（总收入、总支出、结余），含 scoped 样式 |
| 新增 | `docs/.vitepress/theme/components/SponsorList.vue` | 收入明细表格，含 scoped 样式 |
| 新增 | `docs/.vitepress/theme/components/ExpenseList.vue` | 支出明细表格，含 scoped 样式 |
| 修改 | `docs/.vitepress/theme/components/Sponsor.vue` | 「🧋喝口奶茶」标题改为可点击链接，href 指向 `/sponsor`；不新增额外描述文字 |
| 修改 | `docs/.vitepress/config.ts` | `themeConfig.nav` 中「关于」由单链接改为 `items` 下拉（关于我、🧋 赞助） |
| 修改 | `docs/.vitepress/theme/index.ts` | 注册 SponsorStats、SponsorList、ExpenseList 为全局组件 |

**不涉及**：`docs/.vitepress/theme/utils/posts.ts`、`sidebar` 生成逻辑、`frontmatter.date/title` 约定。`/sponsor` 为独立 doc 页面，路由由 VitePress 自动生成，不影响 posts 列表与 sidebar。

---

## 路由、sidebar、主题组件影响面

| 影响项 | 说明 |
|--------|------|
| 路由 | 新增 `/sponsor`（对应 `docs/sponsor.md`），由 VitePress 自动生成；与 posts 路由互不干扰。 |
| sidebar | `/sponsor` 不纳入 `sidebar['/posts/']` 配置；该页使用默认 doc layout，无自定义 sidebar。 |
| 主题组件 | 新增 SponsorStats、SponsorList、ExpenseList；修改 Sponsor；均需在 index.ts 中注册（SponsorStats/List/ExpenseList 供 markdown 使用）。 |
| nav | 「关于」从单链接改为 `items` 下拉，需确保 VitePress 默认主题在移动端与桌面端均支持 `items` 展开。 |

---

## 页面布局（方案 A：单页分块）

```
┌─────────────────────────────────────────────────────┐
│  赞助（标题带 icon/emoji）                             │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ 总收入      │ │ 总支出      │ │ 结余        │   │
│  │ ¥ xxx       │ │ ¥ xxx       │ │ ¥ xxx       │   │
│  └─────────────┘ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────────────────────┤
│  ## 收入明细（赞助记录）                              │
│  [SponsorList 组件]                                  │
├─────────────────────────────────────────────────────┤
│  ## 支出明细                                         │
│  [ExpenseList 组件]                                  │
├─────────────────────────────────────────────────────┤
│  [Sponsor 打赏入口]                                  │
└─────────────────────────────────────────────────────┘
```

---

## 列表组件设计

**采用手动实现的 Vue 组件**，不引入第三方 UI 库。理由：

1. **表格结构**：收支明细适合用 HTML table 展示，列对齐清晰、便于阅读。
2. **实现成本低**：SponsorList 与 ExpenseList 各自为独立 Vue 组件，内部基于 `<table>`，在组件内使用 `<style scoped>` 统一样式。
3. **响应式**：桌面端用表格；移动端可通过 CSS 转为卡片式或横向滚动，与现有 `donation-card`、`link-hub` 风格一致。
4. **无额外依赖**：与 VitePress + Vue3 生态契合，保持项目轻量。

| 组件 | 职责 | 数据源 | 列 |
|------|------|--------|-----|
| SponsorStats | 渲染总收入、总支出、结余三个卡片 | sponsors.json + expenses.json 计算 | — |
| SponsorList | 收入明细表格 | sponsors.json | 序号、昵称、金额、渠道、时间、备注 |
| ExpenseList | 支出明细表格 | expenses.json | 序号、用途说明、金额、时间 |

---

## 映射与边界约定

### channel 展示映射

| 字段值 | 展示文案 |
|--------|----------|
| channel: `alipay` | 支付宝 |
| channel: `wechat` | 微信 |
### 边界情况与数据加载

| 情况 | 预期行为 |
|------|----------|
| sponsors.json 不存在或解析失败 | 总收入 = 0，收入明细区显示「暂无赞助记录」或空表 |
| expenses.json 不存在或解析失败 | 总支出 = 0，支出明细区显示「暂无支出记录」或空表 |
| 空数组 | 对应统计为 0，列表为空 |
| 结余为负 | 正常显示负值（如 ¥-20），不强制隐藏 |
| date 格式异常 | 按原始字符串显示，不校验格式 |

---

## 数据结构

### sponsors.json（收入）

```json
[
  {
    "name": "张三",
    "amount": 50,
    "date": "2025-01-15",
    "channel": "alipay",
    "message": "感谢分享，继续加油"
  },
  {
    "name": "匿名",
    "amount": 20,
    "date": "2025-01-10",
    "channel": "wechat",
    "message": ""
  }
]
```

| 字段    | 类型   | 必填 | 说明 |
|---------|--------|------|------|
| name    | string | 是   | 昵称/姓名，可为「匿名」 |
| amount  | number | 是   | 金额（元） |
| date    | string | 是   | 捐助日期，如 `"2025-01-15"` |
| channel | string | 是   | 捐助渠道：`"alipay"`（支付宝）或 `"wechat"`（微信） |
| message | string | 否   | 备注/留言 |

### expenses.json（支出）

```json
[
  {
    "description": "网站域名续费（105 一年×2）",
    "amount": 210,
    "date": "2026-02-24"
  }
]
```

| 字段        | 类型   | 必填 | 说明 |
|-------------|--------|------|------|
| description | string | 是   | 用途说明 |
| amount      | number | 是   | 金额（元） |
| date        | string | 是   | 日期，如 `"2026-02-24"` |

---

## Capabilities

### New Capabilities

- `sponsor-detail-page`：赞助页（标题「赞助」）及其入口、收支统计、收入/支出列表、底部 Sponsor 打赏组件；nav 使用「🧋 赞助」并带 icon/emoji；Sponsor 组件中「🧋喝口奶茶」标题可点击跳转至 `/sponsor`，不新增额外描述文字；包含 SponsorStats、SponsorList、ExpenseList 与 sponsors.json、expenses.json 数据约定；涵盖 channel 映射、边界情况与数据加载行为。

### Modified Capabilities

- （无。无现有 spec 行为变更。）

---

## 验收预期

1. **本地启动**：`pnpm run docs:dev` 启动后，访问 `/sponsor` 可见赞助页，含统计卡片、收入明细表、支出明细表、底部 Sponsor 打赏组件。
2. **Sponsor 组件**：about 页与文章底部 Sponsor 组件中，点击「🧋喝口奶茶」标题可跳转到 `/sponsor`；不增加额外「查看赞助明细」等文字。
3. **nav 下拉**：顶部 nav「关于」显示为下拉，包含「关于我」→ `/about`、「🧋 赞助」→ `/sponsor`；移动端可正常展开。
4. **统计正确**：总收入 = Σ sponsors.amount，总支出 = Σ expenses.amount，结余 = 总收入 - 总支出；空 JSON 或缺失时按边界约定展示。
5. **样式一致**：SponsorStats、SponsorList、ExpenseList 在各组件内使用 scoped 样式，与 donation-card 风格统一，支持明暗主题；不修改 custom.css。

---

## 风险与回滚

| 风险 | 缓解 | 回滚 |
|------|------|------|
| nav `items` 在部分主题版本不兼容 | 使用 VitePress 官方支持的 nav items 结构 | 恢复「关于」为单链接 `link: "/about"` |
| JSON 路径或加载方式变更 | 在组件内集中处理加载逻辑，路径写死或从配置读取 | 移除组件内 JSON 加载，改静态展示或占位 |
| 移动端表格溢出 | 表格使用 overflow-x: auto 或响应式布局 | 移除表格，改为卡片堆叠 |

---

请确认上述范围与 Non-goals 是否符合预期，确认后再进入 design / tasks 阶段。
