/**
 * 路径标准化工具
 * 与 PostPager、giscus pathname 映射保持一致：去掉 .html、/index，统一 trailing slash
 */
export function normalizePath(path: string): string {
  if (!path) return "/";
  let normalized = path;
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  normalized = normalized.replace(/(\.md|\.html)$/i, "");
  normalized = normalized.replace(/\/index$/i, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || "/";
}
