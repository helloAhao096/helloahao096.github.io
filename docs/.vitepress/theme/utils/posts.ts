import path from "node:path";
import { spawn } from "node:child_process";
import globby from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import type { Post } from "../types";
import { normalizeDateString, dateToTimestamp } from "./date";

/**
 * 获取文件最近一次 Git 提交时间
 * 与 VitePress 官方 getGitTimestamp 完全对齐：
 *   使用异步 spawn + basename/dirname 方式调用 git log
 * @see https://vitepress.dev/reference/default-theme-last-updated
 * 返回毫秒时间戳，获取失败返回 undefined。
 */
function getGitLastUpdated(absolutePath: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    if (!fs.existsSync(absolutePath)) {
      resolve(undefined);
      return;
    }
    const child = spawn(
      "git",
      ["log", "-1", '--pretty="%ai"', path.basename(absolutePath)],
      { cwd: path.dirname(absolutePath) }
    );
    let output = "";
    child.stdout.on("data", (d: Buffer) => { output += String(d); });
    child.on("close", () => {
      const timestamp = +new Date(output);
      if (Number.isNaN(timestamp) || timestamp <= 0) {
        resolve(undefined);
      } else {
        resolve(timestamp);
      }
    });
    child.on("error", () => resolve(undefined));
  });
}

/** Git 取不到时用文件修改时间，保证 dev 下也能显示「上次更新」 */
function getFileMtime(absolutePath: string): number {
  try {
    const stat = fs.statSync(absolutePath);
    return stat.mtimeMs;
  } catch {
    return 0;
  }
}

export async function getPosts(): Promise<Post[]> {
  const paths = await getPostMDFilePaths();
  const posts = await Promise.all(
    paths.map(async (rawPath) => {
      const content = await fs.readFile(rawPath, "utf-8");
      const pathForRoute = rawPath.substring(5);
      const { data } = matter(content);
      data.date = normalizeDateString(data.date);
      const absolutePath = path.resolve(process.cwd(), rawPath);
      const lastUpdated =
        (await getGitLastUpdated(absolutePath)) ?? (getFileMtime(absolutePath) || undefined);
      return {
        frontMatter: data,
        regularPath: `/${pathForRoute.replace(".md", ".html")}`,
        ...(lastUpdated !== undefined && lastUpdated > 0 && { lastUpdated }),
      };
    })
  );
  posts.sort(_compareDate);
  return posts;
}

/** 优先按 lastUpdated 降序，无则按 frontMatter.date 降序 */
function _compareDate(obj1: Post, obj2: Post): number {
  const t1 = obj1.lastUpdated ?? dateToTimestamp(obj1.frontMatter.date);
  const t2 = obj2.lastUpdated ?? dateToTimestamp(obj2.frontMatter.date);
  return t2 - t1;
}

async function getPostMDFilePaths(): Promise<string[]> {
  let paths = await globby(["**.md"], {
    ignore: ["node_modules", "README.md"],
  });
  return paths.filter((item) => {
    if (!item.includes("posts/")) {
      return false;
    }
    return !item.endsWith("posts/index.md");
  });
}

export async function getPostLength(): Promise<number> {
  return [...(await getPostMDFilePaths())].length;
}

/** 取 post 用于排序/分组的时间戳：优先 lastUpdated，否则 date */
function getPostTimestamp(post: Post): number {
  return post.lastUpdated ?? dateToTimestamp(post.frontMatter.date);
}

/** 从 post 取年份字符串，优先 lastUpdated 的年份，否则 frontMatter.date */
function getPostYear(post: Post): string {
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

