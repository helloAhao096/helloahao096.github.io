import globby from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import type { Post } from "../types";

export async function getPosts(): Promise<Post[]> {
  let paths = await getPostMDFilePaths();
  let posts = await Promise.all(
    paths.map(async (item) => {
      const content = await fs.readFile(item, "utf-8");
      // 截断字符串 修改路由
      item = item.substring(5);
      const { data } = matter(content);
      data.date = _convertDate(data.date);
      return {
        frontMatter: data,
        regularPath: `/${item.replace(".md", ".html")}`,
      };
    })
  );
  posts.sort(_compareDate);
  return posts;
}

function _convertDate(date = new Date().toString()): string {
  const json_date = new Date(date).toJSON();
  return json_date.split("T")[0];
}

function _compareDate(obj1: Post, obj2: Post): number {
  return obj1.frontMatter.date! < obj2.frontMatter.date! ? 1 : -1;
}

async function getPostMDFilePaths(): Promise<string[]> {
  let paths = await globby(["**.md"], {
    ignore: ["node_modules", "README.md"],
  });
  return paths.filter((item) => item.includes("posts/"));
}

export async function getPostLength(): Promise<number> {
  return [...(await getPostMDFilePaths())].length;
}

