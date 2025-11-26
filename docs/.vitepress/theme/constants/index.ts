// 常量配置

// 博客配置
export const BLOG_CONFIG = {
  pageSize: 5,
} as const;

// 兼容 Vite 环境变量，未定义时回落到占位
const viteEnv =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {};

// giscus 配置占位（值将由环境变量或后续确认）
export const GISCUS_CONFIG = {
  // 仓库格式：owner/repo
  repo: viteEnv.VITE_GISCUS_REPO || "your-github-username/your-repo",
  repoId: viteEnv.VITE_GISCUS_REPO_ID || "",
  category: viteEnv.VITE_GISCUS_CATEGORY || "General",
  categoryId: viteEnv.VITE_GISCUS_CATEGORY_ID || "",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "light",
  themeDark: "transparent_dark",
  lang: "zh-CN",
  loading: "lazy",
} as const;

