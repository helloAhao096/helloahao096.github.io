import type { Post } from "../../../core/types";
import { getMarkdownEntriesByDir } from "../../../core/content/entries";

/**
 * 项目内容域的数据获取 API
 * 仅在 Node 端（例如 config.ts）调用，用于生成 themeConfig.projects
 */
export async function getProjectEntries(): Promise<Post[]> {
  const entries = await getMarkdownEntriesByDir({
    dirName: "projects",
    excludeIndex: true,
  });
  return entries;
}

