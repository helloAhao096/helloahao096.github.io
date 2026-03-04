import type { Post } from "../../../core/types";
import { getMarkdownEntriesByDir } from "../../../core/content/entries";

/**
 * 投资内容域的数据获取 API
 * 仅在 Node 端（例如 config.ts）调用，用于生成 themeConfig.invest
 */
export async function getInvestEntries(): Promise<Post[]> {
  const entries = await getMarkdownEntriesByDir({
    dirName: "invest",
    excludeIndex: true,
  });
  return entries;
}

