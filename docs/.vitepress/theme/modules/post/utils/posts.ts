import type { Post } from "../../../core/types";
import { normalizeDateString, dateToTimestamp } from "../../../core/utils/date";
import { getMarkdownEntriesByDir } from "../../../core/content/entries";

export async function getPosts(): Promise<Post[]> {
  const posts = await getMarkdownEntriesByDir({
    dirName: "posts",
    excludeIndex: true,
  });
  // 由于公用方法已按时间降序排序，这里仅保留与旧逻辑等价的排序调用
  posts.sort(_compareDate);
  return posts;
}

/** 优先按 lastUpdated 降序，无则按 frontMatter.date 降序 */
function _compareDate(obj1: Post, obj2: Post): number {
  const t1 = obj1.lastUpdated ?? dateToTimestamp(obj1.frontMatter.date);
  const t2 = obj2.lastUpdated ?? dateToTimestamp(obj2.frontMatter.date);
  return t2 - t1;
}

export async function getPostLength(): Promise<number> {
  const posts = await getMarkdownEntriesByDir({
    dirName: "posts",
    excludeIndex: true,
  });
  return posts.length;
}

/** 取 post 用于排序/分组的时间戳：优先 lastUpdated，否则 date */
export function getPostTimestamp(post: Post): number {
  return post.lastUpdated ?? dateToTimestamp(post.frontMatter.date);
}

/** 从 post 取年份字符串，优先 lastUpdated 的年份，否则 frontMatter.date */
export function getPostYear(post: Post): string {
  const ts = getPostTimestamp(post);
  if (ts > 0) {
    const y = new Date(ts).getFullYear();
    if (Number.isFinite(y)) return `${y}`;
  }
  const date = post.frontMatter.date;
  if (date) return date.split("-")[0] || "未分类";
  return "未分类";
}

/**
 * 从 posts 数据生成 VitePress sidebar 配置
 * 按年份分组（优先 lastUpdated 年份），年份倒序，同一年内按 lastUpdated/date 倒序
 */
export function generateSidebarFromPosts(posts: Post[]): any[] {
  const filteredPosts = posts.filter((post) => !post.regularPath.includes("posts/index"));

  const yearGroups: Record<string, Post[]> = {};
  filteredPosts.forEach((post) => {
    const year = getPostYear(post);
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(post);
  });

  const sortedYears = Object.keys(yearGroups).sort((a, b) => {
    const yearA = Number(a);
    const yearB = Number(b);
    if (Number.isNaN(yearA) || Number.isNaN(yearB)) {
      return b.localeCompare(a, "zh-CN");
    }
    return yearB - yearA;
  });

  return sortedYears.map((year) => {
    const yearPosts = yearGroups[year].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
    return {
      text: `${year}年`,
      collapsed: false,
      items: yearPosts.map((post) => ({
        text: post.frontMatter.title || "未命名文章",
        link: post.regularPath.replace(".html", ""),
      })),
    };
  });
}
