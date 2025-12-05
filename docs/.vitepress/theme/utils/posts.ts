import globby from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import type { Post } from "../types";
import { normalizeDateString, dateToTimestamp } from "./date";

export async function getPosts(): Promise<Post[]> {
  let paths = await getPostMDFilePaths();
  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      // 截断字符串 修改路由
      item = item.substring(5);
      const { data } = matter(content);
      data.date = normalizeDateString(data.date);
      return {
        frontMatter: data,
        regularPath: `/${item.replace(".md", ".html")}`,
      };
    })
  );
  posts.sort(_compareDate);
  return posts;
}

function _compareDate(obj1: Post, obj2: Post): number {
  return dateToTimestamp(obj2.frontMatter.date) - dateToTimestamp(obj1.frontMatter.date);
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

/**
 * 从 posts 数据生成 VitePress sidebar 配置
 * 按年份分组，年份倒序，同一年内按日期倒序
 */
export function generateSidebarFromPosts(posts: Post[]): any[] {
  // 过滤掉 index 页面
  const filteredPosts = posts.filter((post) => {
    return !post.regularPath.includes("posts/index");
  });

  // 按年份分组
  const yearGroups: Record<string, Post[]> = {};
  filteredPosts.forEach((post) => {
    const date = post.frontMatter.date;
    if (!date) return;

    // 提取年份
    const year = date.split("-")[0];
    if (!year) return;

    if (!yearGroups[year]) {
      yearGroups[year] = [];
    }
    yearGroups[year].push(post);
  });

  // 按年份倒序排序（最新的年份在前）
  const sortedYears = Object.keys(yearGroups).sort((a, b) => {
    const yearA = Number(a);
    const yearB = Number(b);
    if (Number.isNaN(yearA) || Number.isNaN(yearB)) {
      return b.localeCompare(a, "zh-CN");
    }
    return yearB - yearA; // 倒序
  });

  // 转换为 sidebar 配置格式
  return sortedYears.map((year) => {
    // 同一年内的文章按日期倒序排序（最新的在前）
    const yearPosts = yearGroups[year].sort((a, b) => {
      const timestampA = dateToTimestamp(a.frontMatter.date);
      const timestampB = dateToTimestamp(b.frontMatter.date);
      return timestampB - timestampA; // 倒序
    });

    return {
      text: `${year}年`,
      collapsed: false,
      items: yearPosts.map((post) => ({
        text: post.frontMatter.title || "未命名文章",
        link: post.regularPath.replace(".html", ""), // 支持 cleanUrls
      })),
    };
  });
}

