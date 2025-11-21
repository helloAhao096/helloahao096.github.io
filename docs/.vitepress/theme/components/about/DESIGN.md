# About 页面需求梳理与设计方案

## 📋 功能需求清单

### 1. 个人介绍 (Profile)
- **内容**：头像、姓名、简介
- **展示方式**：居中展示，突出个人形象
- **数据来源**：组件 props 或配置文件

### 2. 个人说明书 (PersonalStatement)
- **内容**：认知、价值观、喜好等个人理念
- **展示方式**：长文本内容，支持 Markdown 格式
- **数据来源**：Markdown 文件（推荐）或组件内文本

### 3. 电子翻包 (DigitalGear)
- **内容**：使用的电子产品列表
  - 产品名称
  - 产品图片（可选）
  - 简短描述
  - 购买时间/使用时长（可选）
- **展示方式**：列表形式，类似 PostCard 的布局
- **数据来源**：数组数据（JSON 或组件 props）

### 4. 社交账号 (SocialLinks)
- **内容**：各平台账号链接
  - B站、网易云、Steam、GitHub、Twitter 等
- **展示方式**：图标网格，点击跳转
- **图标来源**：第三方开源图标库（Simple Icons 等）
- **数据来源**：数组数据（平台名称 + 链接）

### 5. 兴趣爱好 (Interests)
- **内容**：艺术品味、口味偏好、其他兴趣
- **展示方式**：标签云或分类展示
- **数据来源**：数组数据（标签列表）

### 6. 友链 (Friends)
- **内容**：友链网站信息
  - 网站名称
  - 网站描述
  - 网站链接
  - 网站头像/Logo（可选）
- **展示方式**：列表形式，类似 PostCard
- **数据来源**：数组数据（友链列表）

### 7. 投喂/捐助 (Donation)
- **内容**：支付方式
  - 二维码图片（支付宝、微信等）
  - 支付链接（Patreon、爱发电等）
- **展示方式**：二维码网格 + 链接按钮
- **数据来源**：数组数据（支付方式配置）

---

## 🎨 页面样式设计分析

### 设计原则
1. **统一风格**：与 post 页面保持一致
2. **简约风格**：避免过度设计
3. **主题色使用**：统一使用项目 CSS 变量
4. **响应式**：适配 Web 和移动端

### 样式方案对比

#### 方案 A：纯 Border-bottom 分隔（PostCard 风格）
```
优点：
✅ 与 post 页面完全一致
✅ 视觉极简，阅读流畅
✅ 适合列表类内容
✅ 实现简单

缺点：
❌ 层次感较弱
❌ 不适合需要强调的独立模块（如个人介绍）
❌ 所有模块看起来过于相似
```

#### 方案 B：纯卡片设计
```
优点：
✅ 层次清晰，模块感强
✅ 适合独立内容块
✅ 视觉聚焦

缺点：
❌ 与 post 页面风格不一致
❌ 可能显得厚重
❌ 视觉负担较大
```

#### 方案 C：混合方案（推荐）⭐
```
核心模块（Profile、PersonalStatement）：
- 轻量卡片设计
- 边框：2px solid var(--color-border)
- 阴影：0 2px 8px rgba(8, 203, 0, 0.08)
- 圆角：var(--radius-card)
- 背景：var(--color-surface)

列表模块（DigitalGear、Friends）：
- Border-bottom 分隔
- 与 PostCard 完全一致
- border-bottom: 1px solid var(--color-border)
- Hover: border-bottom-color: var(--color-primary)

网格模块（SocialLinks、Interests、Donation）：
- 轻量容器，无边框
- 使用间距和网格布局分隔
- 保持简约风格
```

**推荐理由**：
- ✅ 既保持与 post 页面的一致性
- ✅ 又能突出重要模块
- ✅ 视觉层次清晰但不厚重
- ✅ 符合简约设计原则

---

## 🛠️ 技术实现可行性分析

### 1. Markdown 内容渲染

#### 方案 A：使用 VitePress Content 组件
```vue
<template>
  <Content />
</template>
<script setup>
import { useData } from 'vitepress'
const { page } = useData()
</script>
```

**可行性**：✅ **推荐**
- VitePress 原生支持
- 自动处理 Markdown 语法
- 样式自动应用
- 支持 Frontmatter
- **实现方式**：在 `about.md` 中直接写 Markdown，组件中通过 `<Content />` 渲染

**限制**：
- 需要将 Markdown 内容放在 `about.md` 中
- 或者创建子页面，通过路由访问

#### 方案 B：使用 markdown-it（项目已有依赖）
```typescript
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt()
const html = md.render(markdownText)
```

**可行性**：✅ **可行**
- 项目已有 `markdown-it` 依赖
- 灵活，可自定义渲染规则
- 可以读取外部 Markdown 文件

**实现方式**：
- 创建独立的 Markdown 文件（如 `docs/about-content/statement.md`）
- 在组件中通过 `fetch` 或 `import` 读取
- 使用 `markdown-it` 解析并渲染

#### 方案 C：纯 Vue 组件实现
```vue
<template>
  <div class="statement">
    <p>内容1</p>
    <p>内容2</p>
  </div>
</template>
```

**可行性**：✅ **可行但不推荐**
- 内容修改需要改代码
- 不利于内容管理
- 不支持 Markdown 语法

**推荐方案**：**方案 A（VitePress Content）**
- 最简单直接
- 与 VitePress 生态完美融合
- 内容编辑最方便

---

### 2. 社交媒体图标

#### 方案 A：Simple Icons（推荐）⭐
```bash
npm install simple-icons
```

**可行性**：✅ **高度推荐**
- 开源，包含 2000+ 品牌图标
- 支持 SVG 格式
- 图标风格统一
- 支持 B站、网易云、Steam 等国内平台

**使用方式**：
```typescript
import { simpleIcons } from 'simple-icons'
const bilibiliIcon = simpleIcons.get('bilibili')
```

#### 方案 B：自定义 SVG 图标
**可行性**：✅ **可行**
- 完全控制图标样式
- 需要自己收集和维护图标

#### 方案 C：图标字体库（Font Awesome 等）
**可行性**：✅ **可行**
- 使用方便
- 但可能增加包体积

**推荐方案**：**Simple Icons**
- 图标齐全，风格统一
- 维护成本低

---

### 3. 数据管理方案

#### 方案 A：组件 Props
```vue
<Profile :name="name" :bio="bio" />
```

**适用场景**：
- 简单数据（Profile、SocialLinks）
- 数据量小，不常变化

#### 方案 B：配置文件（JSON/TS）
```typescript
// config/about.ts
export const digitalGear = [...]
export const friends = [...]
```

**适用场景**：
- 结构化数据（DigitalGear、Friends、Donation）
- 需要频繁修改
- 数据量较大

#### 方案 C：Markdown Frontmatter
```markdown
---
gear:
  - name: "MacBook Pro"
    description: "工作主力机"
---
```

**适用场景**：
- 与 Markdown 内容结合
- 需要版本控制

**推荐方案**：**混合使用**
- Profile、SocialLinks：组件 Props（简单）
- DigitalGear、Friends、Donation：配置文件（结构化）
- PersonalStatement：Markdown 文件（内容为主）

---

## 📐 页面布局结构

```
About.vue (最大宽度 900px，居中，与 PostCard 一致)
│
├── Profile (个人介绍)
│   └── 轻量卡片，居中布局
│
├── PersonalStatement (个人说明书)
│   └── 轻量卡片，Markdown 内容
│
├── DigitalGear (电子翻包)
│   └── Border-bottom 列表，类似 PostCard
│
├── SocialLinks (社交账号)
│   └── 图标网格（4列桌面，2列移动端）
│
├── Interests (兴趣爱好)
│   └── 标签云，自动换行
│
├── Friends (友链)
│   └── Border-bottom 列表，类似 PostCard
│
└── Donation (投喂/捐助)
    └── 二维码网格（2-3列桌面，1列移动端）
```

---

## 🎯 响应式设计规范

### 断点设置
- **移动端**：`max-width: 640px`
- **平板**：`641px - 1024px`
- **桌面端**：`min-width: 1025px`

### 布局适配
- **移动端**：
  - 单列布局
  - 字体缩小（1.25rem → 1rem）
  - 间距减小（3rem → 2rem）
  - 网格改为 2 列或 1 列

- **桌面端**：
  - 最大宽度 900px，居中
  - 完整布局展示

---

## ✅ 实现可行性总结

| 功能模块 | 技术难度 | 推荐方案 | 可行性 |
|---------|---------|---------|--------|
| Profile | ⭐ 简单 | 组件 Props | ✅ 高 |
| PersonalStatement | ⭐⭐ 中等 | VitePress Content + Markdown | ✅ 高 |
| DigitalGear | ⭐⭐ 中等 | 配置文件 + 列表组件 | ✅ 高 |
| SocialLinks | ⭐⭐ 中等 | Simple Icons + 网格布局 | ✅ 高 |
| Interests | ⭐ 简单 | 标签云组件 | ✅ 高 |
| Friends | ⭐⭐ 中等 | 配置文件 + 列表组件 | ✅ 高 |
| Donation | ⭐⭐ 中等 | 图片 + 链接配置 | ✅ 高 |

**总体评估**：✅ **完全可行**
- 所有功能都有成熟的技术方案
- 项目已有必要依赖（markdown-it）
- 设计风格与现有页面一致
- 实现难度适中

---

## 📝 下一步行动建议

1. **确认设计方案**：混合方案（轻量卡片 + border-bottom）
2. **确认 Markdown 方案**：VitePress Content（最简单）
3. **确认图标库**：Simple Icons
4. **创建组件结构**：按模块拆分组件
5. **实现响应式布局**：统一断点和样式

