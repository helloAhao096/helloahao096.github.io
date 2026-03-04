import path from "node:path";
import { spawn } from "node:child_process";
import globby from "globby";
import matter from "gray-matter";
import fs from "fs-extra";
import type { Post } from "../types";
import { normalizeDateString, dateToTimestamp } from "../utils/date";

export interface GetEntriesOptions {
  /**
   * 要扫描的 docs 子目录名，例如 'posts'、'invest'、'projects'
   */
  dirName: string;
  /**
   * 是否排除该目录下的 index.md（如 posts/index.md）
   */
  excludeIndex?: boolean;
}

/**
 * 获取文件最近一次 Git 提交时间
 * 与 VitePress 官方 getGitTimestamp 完全对齐：
 *   使用异步 spawn + basename/dirname 方式调用 git log
 * 返回毫秒时间戳，获取失败返回 undefined。
 */
async function getGitLastUpdated(absolutePath: string): Promise<number | undefined> {
  if (!fs.existsSync(absolutePath)) {
    return undefined;
  }

  return await new Promise((resolve) => {
    const child = spawn(
      "git",
      ["log", "-1", '--pretty=\"%ai\"', path.basename(absolutePath)],
      { cwd: path.dirname(absolutePath) }
    );

    let output = "";
    child.stdout.on("data", (d: Buffer) => {
      output += String(d);
    });
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

/**
 * 按目录扫描 docs 下的 Markdown 文件并返回统一条目结构
 * - 仅在 Node 端（配置阶段）调用
 * - 返回值与 Post 结构兼容，便于复用现有逻辑
 */
export async function getMarkdownEntriesByDir(options: GetEntriesOptions): Promise<Post[]> {
  const { dirName, excludeIndex } = options;

  // 以仓库根目录为 cwd，docs 目录为相对路径
  const docsRoot = path.resolve(process.cwd(), "docs");
  const targetDir = path.resolve(docsRoot, dirName);

  const rawPaths = await globby(["**/*.md"], {
    cwd: targetDir,
    ignore: ["README.md"],
  });

  const filtered = rawPaths.filter((relative) => {
    if (excludeIndex && /(^|\/)index\.md$/i.test(relative)) {
      return false;
    }
    return true;
  });

  const entries = await Promise.all(
    filtered.map(async (relative) => {
      const absolutePath = path.resolve(targetDir, relative);
      const content = await fs.readFile(absolutePath, "utf-8");
      const { data } = matter(content);

      data.date = normalizeDateString(data.date);

      const lastUpdated =
        (await getGitLastUpdated(absolutePath)) || getFileMtime(absolutePath) || undefined;

      // 生成与现有 regularPath 一致的路由：以 docs 为根，替换为 .html
      const pathForRoute = path
        .relative(docsRoot, absolutePath)
        .replace(/\\/g, "/");

      return {
        frontMatter: data,
        regularPath: `/${pathForRoute.replace(/\.md$/i, ".html")}`,
        ...(lastUpdated !== undefined && lastUpdated > 0 && { lastUpdated }),
      } as Post;
    })
  );

  entries.sort((a, b) => {
    const t1 = a.lastUpdated ?? dateToTimestamp(a.frontMatter.date);
    const t2 = b.lastUpdated ?? dateToTimestamp(b.frontMatter.date);
    return t2 - t1;
  });

  return entries;
}

