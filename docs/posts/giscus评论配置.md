---
title: giscus 评论插件配置指南
description: 从启用 GitHub Discussions 到在 VitePress 中完成 giscus 评论集成的完整流程
date: 2025-11-26 18:29:00
tags:
  - 博客搭建
  - giscus
  - VitePress
---

> 这篇文章记录了我将博客评论系统从 Gitalk 迁移到 giscus 的全过程，涵盖仓库准备、环境变量、组件集成与常见问题排查，适合直接复制到自己的 VitePress 站点。

## 1. 为什么选择 giscus

- ✅ 基于 GitHub Discussions，评论内容天然可搜索、可订阅。
- ✅ 不再需要 OAuth App 与 `clientSecret`，部署更安全。
- ✅ 支持多语言与暗色主题，可通过 `data-theme`/props 实时切换。
- ✅ 官方提供 React/Vue/Svelte 组件，也可以直接用 Web Component。

## 2. 仓库侧准备

1. **开启 Discussions**  
   进入评论存储仓库（可以是站点本身，也可以是单独仓库），`Settings → General → Features` 勾选 `Discussions`。
2. **安装 giscus App**  
   打开 [github.com/apps/giscus](https://github.com/apps/giscus) → `Install` → 选择当前仓库。若是组织仓库，需要拥有者授予权限。
3. **创建分类**  
   在仓库 `Discussions` 页左侧点击 `Categories` 的铅笔图标，创建一个分类（例如 `Blog Comments`）。后续每篇文章的讨论都会落在这个分类里。

## 3. giscus.app 生成配置

访问 [https://giscus.app](https://giscus.app)：

- Repository：选择上面授权的仓库，例如 `helloAhao096/helloahao096.github.io`
- Discussion Category：选刚创建的 `Blog Comments`
- Mapping：推荐 `pathname`，可与 VitePress 的 `page.relativePath` 对齐
- 其他选项按需勾选（是否启用 Reactions、Strict 模式、输入框位置、主题、语言等）

页面右侧会生成一段 `<script>`，其中包含：

- `data-repo` / `data-repo-id`
- `data-category` / `data-category-id`
- `data-mapping` / `data-strict` / `data-reactions-enabled` 等

把这些值抄下来，后面写入 `.env`。

## 4. 环境变量与 Vite 配置

在 `docs/.env.local`（或 `docs/.env`）写入：

```bash
VITE_GISCUS_REPO=<owner>/<repo>
VITE_GISCUS_REPO_ID=<repo_id>
VITE_GISCUS_CATEGORY=<category_name>
VITE_GISCUS_CATEGORY_ID=<category_id>
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_STRICT=0
VITE_GISCUS_REACTIONS=1
VITE_GISCUS_EMIT_METADATA=0
VITE_GISCUS_INPUT_POSITION=bottom
VITE_GISCUS_THEME=preferred_color_scheme
VITE_GISCUS_THEME_DARK=transparent_dark
VITE_GISCUS_LANG=zh-CN
```

> ⚠️ 重点：VitePress 的根目录是 `docs/`，所以 `.env` 也要放在 `docs/`，否则不会注入 `import.meta.env`。

如果想把 `.env` 放在仓库根，可以在 `docs/.vitepress/config.ts` 里加入：

```ts
export default defineConfig({
  vite: {
    envDir: process.cwd(), // 让 Vite 读取仓库根目录下的 env
  },
});
```

## 5. 主题层集成

在 `docs/.vitepress/theme/constants/index.ts` 中导出 `GISCUS_CONFIG`，将上面环境变量映射为常量：

```ts
const viteEnv =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {};

export const GISCUS_CONFIG = {
  repo: viteEnv.VITE_GISCUS_REPO,
  repoId: viteEnv.VITE_GISCUS_REPO_ID,
  category: viteEnv.VITE_GISCUS_CATEGORY,
  categoryId: viteEnv.VITE_GISCUS_CATEGORY_ID,
  mapping: viteEnv.VITE_GISCUS_MAPPING || "pathname",
  strict: viteEnv.VITE_GISCUS_STRICT || "0",
  reactionsEnabled: viteEnv.VITE_GISCUS_REACTIONS || "1",
  emitMetadata: viteEnv.VITE_GISCUS_EMIT_METADATA || "0",
  inputPosition: viteEnv.VITE_GISCUS_INPUT_POSITION || "bottom",
  theme: viteEnv.VITE_GISCUS_THEME || "light",
  themeDark: viteEnv.VITE_GISCUS_THEME_DARK || "transparent_dark",
  lang: viteEnv.VITE_GISCUS_LANG || "zh-CN",
  loading: viteEnv.VITE_GISCUS_LOADING || "lazy",
} as const;
```

## 6. Vue 组件挂载方式

项目使用官方的 `@giscus/vue` 组件，核心逻辑在 `docs/.vitepress/theme/components/plugin/Comments.vue`：

```vue
<template>
  <Giscus v-if="isClient" :key="routeKey" v-bind="giscusProps" />
</template>

<script setup lang="ts">
import Giscus from "@giscus/vue";
import { computed, ref, watch, onMounted } from "vue";
import { useData } from "vitepress";
import { GISCUS_CONFIG } from "../../constants";

const { page, isDark } = useData();
const routeKey = ref("index");
const isClient = ref(false);

const giscusProps = computed(() => ({
  id: "comments",
  repo: GISCUS_CONFIG.repo,
  repoId: GISCUS_CONFIG.repoId,
  category: GISCUS_CONFIG.category,
  categoryId: GISCUS_CONFIG.categoryId,
  mapping: GISCUS_CONFIG.mapping,
  strict: GISCUS_CONFIG.strict,
  reactionsEnabled: GISCUS_CONFIG.reactionsEnabled,
  emitMetadata: GISCUS_CONFIG.emitMetadata,
  inputPosition: GISCUS_CONFIG.inputPosition,
  theme: isDark.value ? GISCUS_CONFIG.themeDark : GISCUS_CONFIG.theme,
  lang: GISCUS_CONFIG.lang,
  loading: GISCUS_CONFIG.loading,
}));

watch(
  () => page.value.relativePath,
  (path) => (routeKey.value = path || "index"),
  { immediate: true }
);

onMounted(() => {
  isClient.value = true; // 避免 SSR 阶段挂载 giscus
});
</script>
```

关键点：

- 使用 `routeKey` 监听 `page.relativePath`，切换文章时强制刷新评论。
- 利用 `isDark` 计算主题，确保深浅色模式自动同步。
- `isClient` 避免 SSR 渲染时访问浏览器 API。

## 7. 本地与 CI 调试

```bash
pnpm install
pnpm docs:dev
```

- 若控制台报 “giscus is not installed”，说明 giscus App 没授权到当前仓库或 `repoId` 来自其他仓库。
- 若请求参数仍显示 `your-github-username/your-repo`，说明 `.env` 没被读取，请检查文件位置或 `vite.envDir`。

CI 场景（如 GitHub Actions）可在 workflow 中添加：

```yaml
env:
  VITE_GISCUS_REPO: ${{ secrets.VITE_GISCUS_REPO }}
  VITE_GISCUS_REPO_ID: ${{ secrets.VITE_GISCUS_REPO_ID }}
  # 其余变量同理
```

### 7.1 在 GitHub 中添加 Secrets

1. 打开仓库 → `Settings` → 左侧 `Secrets and variables` → `Actions`。
2. 点击 `New repository secret`，依次创建：
   - `VITE_GISCUS_REPO`
   - `VITE_GISCUS_REPO_ID`
   - `VITE_GISCUS_CATEGORY`
   - `VITE_GISCUS_CATEGORY_ID`
   - 其他需要的 `VITE_GISCUS_*` 字段
3. 在 GitHub Actions workflow（例如 `deploy-pages.yml`）中通过 `env` 或 `with.env` 引用这些 secrets，构建时 `import.meta.env` 就能拿到对应值。

> 如果多个仓库共用同一套 giscus 参数，可在组织级 Secrets 中统一配置，然后在 workflow 中引用 `secrets.ORG_SECRET_NAME`。

## 8. 常见问题排查

| 问题 | 处理办法 |
| --- | --- |
| `giscus is not installed on this repository` | 重新安装 giscus App，并确认 `VITE_GISCUS_REPO` 与授权仓库一致。 |
| 403 Forbidden 且请求参数为默认值 | `.env` 未被读取，把文件放到 `docs/` 或设置 `envDir`。 |
| 暗色主题不生效 | 检查 `theme`、`themeDark` 是否填入 giscus 支持的主题名称，并确认 `isDark` 是否响应。 |
| Discussions 未自动创建 | 先在页面提交第一条评论，giscus 会自动建讨论；若失败，手动在仓库 Discussions 下创建同名讨论确认映射。 |

## 9. giscus VS Gitalk

| 对比项 | giscus | Gitalk |
| --- | --- | --- |
| 数据存储 | GitHub Discussions | GitHub Issues |
| 授权方式 | 安装 giscus App（无需 clientSecret） | 需要 GitHub OAuth App + clientID/clientSecret |
| repo / 分类 | 支持同仓库多分类（Category） | 单仓库 Issues，通常额外开评论仓库 |
| 映射方式 | `pathname` / `url` / `title` / `number` 等 | 需要手动生成 `id`，长度 < 50 |
| 组件支持 | 提供 React / Vue / Svelte / Web Component | 仅提供 Web Widget |
| 明暗主题 | 内置多个主题，可通过 props/`postMessage` 动态切换 | 仅支持 CSS 覆盖，切换需要重新渲染 |
| Reactions / Metadata | 内建，可配置 | 需要依赖 Issues 原生的 reactions |
| 访问者体验 | 可直接在 Discussions 中查看/参与，支持实时刷新 | 基于 Issues，不支持原生 Discussions 功能 |

迁移时可按以下策略：

1. 在原评论仓库开启 Discussions，或新建一个专门用于 giscus 的仓库。
2. 如果原 Issue 中有历史评论，可手动将 Issue 转换为 Discussion（GitHub 支持迁移），确保标题或 pathname 与 giscus 映射保持一致。
3. 在站点中替换 `Comments.vue` 逻辑，并更新 `.env` 为 giscus 所需的变量。
4. 验证新的讨论能否在 `Blog Comments` 分类下自动创建，再决定是否关闭旧的 Gitalk 初始化代码。

## 9. 总结

切换到 giscus 之后，评论体验和维护成本都大幅降低：不再需要独立仓库维护 Issues，也不用管理 OAuth 密钥。只要按本文流程准备好 Discussions、安装 giscus App，并把生成的参数放进 `.env`，就能在 VitePress 中即时启用。希望这份笔记能帮助你在自己的博客里顺利部署 giscus！


