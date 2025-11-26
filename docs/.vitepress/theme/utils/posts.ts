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

