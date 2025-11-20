// 常量配置

// 博客配置
export const BLOG_CONFIG = {
  pageSize: 5,
} as const;

// Gitalk 配置（敏感信息，建议使用环境变量）
export const GITALK_CONFIG = {
  clientID: "53f859bc548f68175265",
  clientSecret: "73f528b5f57c8ca681785d711ee9904f197671ec", // ⚠️ 建议移到环境变量
  repo: "blog-comments",
  owner: "helloAhao096",
  admin: ["helloAhao096"],
  labels: ["Gitalk", "评论"],
  language: "zh-CN",
  distractionFreeMode: true,
  createIssueManually: false,
  perPage: 10,
} as const;

