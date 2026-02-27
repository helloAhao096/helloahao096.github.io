# Spec: sponsor-detail-page

## ADDED Requirements

### Requirement: 赞助页可访问

系统 SHALL 提供独立页面 `/sponsor`，对应 `docs/sponsor.md`，由 VitePress 自动生成路由。页面 SHALL 包含标题「赞助」、收支统计卡片、收入明细表、支出明细表、Sponsor 打赏组件（支付宝/微信）。

#### Scenario: 访问赞助页

- **WHEN** 用户访问 `/sponsor`（或带 base 的等价路径）
- **THEN** 页面正常渲染，显示「赞助」标题及收支统计、收入明细、支出明细、底部 Sponsor 打赏入口区块

#### Scenario: 从 Sponsor 组件跳转

- **WHEN** 用户在 about 页或文章底部点击 Sponsor 组件中的「🧋喝口奶茶」标题
- **THEN** 浏览器导航至 `/sponsor`，赞助页展示

#### Scenario: 从 nav 下拉进入

- **WHEN** 用户点击顶部 nav「关于」下拉菜单中的「🧋 赞助」
- **THEN** 浏览器导航至 `/sponsor`，赞助页展示

---

### Requirement: 收支统计正确

系统 SHALL 在赞助明细页顶部展示三个统计卡片：总收入、总支出、结余。总收入 SHALL 为 sponsors.json 中所有 amount 之和；总支出 SHALL 为 expenses.json 中所有 amount 之和；结余 SHALL 为总收入减去总支出。金额 SHALL 以「¥ xxx」格式展示。

#### Scenario: 有数据时统计正确

- **WHEN** sponsors.json 含 50、20 两笔赞助，expenses.json 含 69、20 两笔支出
- **THEN** 总收入显示 ¥70，总支出显示 ¥89，结余显示 ¥-19

#### Scenario: 空数据时统计为 0

- **WHEN** sponsors.json 与 expenses.json 均为空数组，或文件缺失/解析失败
- **THEN** 总收入显示 ¥0，总支出显示 ¥0，结余显示 ¥0

#### Scenario: 结余为负时正常显示

- **WHEN** 总支出大于总收入
- **THEN** 结余显示为负值（如 ¥-20），不隐藏或截断

---

### Requirement: 收入明细表展示

系统 SHALL 在赞助明细页展示收入明细表格，数据来源于 sponsors.json。表格 SHALL 包含列：序号、昵称、金额、渠道、时间、备注。记录 SHALL 按 date 倒序排列。channel 为 `alipay` 时显示「支付宝」，为 `wechat` 时显示「微信」。当 sponsors.json 不存在、解析失败或为空数组时，SHALL 显示「暂无赞助记录」或空表。

#### Scenario: 有赞助记录时表格展示

- **WHEN** sponsors.json 含有效记录
- **THEN** 表格按时间倒序列出，每行展示序号、昵称、金额、渠道（映射为支付宝/微信）、时间、备注

#### Scenario: 无赞助记录时

- **WHEN** sponsors.json 为空数组或无法加载
- **THEN** 收入明细区显示「暂无赞助记录」或空表，不报错

---

### Requirement: 支出明细表展示

系统 SHALL 在赞助明细页展示支出明细表格，数据来源于 expenses.json。表格 SHALL 包含列：序号、用途说明、金额、时间。记录 SHALL 按 date 倒序排列。当 expenses.json 不存在、解析失败或为空数组时，SHALL 显示「暂无支出记录」或空表。

#### Scenario: 有支出记录时表格展示

- **WHEN** expenses.json 含有效记录
- **THEN** 表格按时间倒序列出，每行展示序号、用途说明、金额、时间

#### Scenario: 无支出记录时

- **WHEN** expenses.json 为空数组或无法加载
- **THEN** 支出明细区显示「暂无支出记录」或空表，不报错

---

### Requirement: Sponsor 组件标题可点击跳转

Sponsor 组件的「🧋喝口奶茶」标题 SHALL 为可点击链接，href 指向 `/sponsor`（或带 base 的等价路径）。系统 SHALL NOT 新增「查看赞助明细」等额外描述文字。该标题链接 SHALL 在 about 页与文章底部 Sponsor 组件中均可见且可点击。

#### Scenario: 标题可点击且跳转

- **WHEN** 用户在 about 页或文章底部查看 Sponsor 组件
- **THEN** 「🧋喝口奶茶」标题为可点击链接；点击后跳转至 `/sponsor`；无「查看赞助明细」等额外文字

---

### Requirement: nav 下拉包含赞助（带 icon/emoji）

顶部 nav 中「关于」SHALL 以下拉菜单形式展示，包含「关于我」链接至 `/about`、「🧋 赞助」链接至 `/sponsor`（带 icon 或 emoji）。下拉菜单 SHALL 在桌面端与移动端均可正常展开。

#### Scenario: nav 下拉可见且可用

- **WHEN** 用户查看顶部 nav
- **THEN** 「关于」显示为可展开项，展开后含「关于我」与「🧋 赞助」；点击「🧋 赞助」跳转至 `/sponsor`
