// giscus 配置（从 theme/constants 迁入）

const viteEnv =
  (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {};

export const GISCUS_CONFIG = {
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
