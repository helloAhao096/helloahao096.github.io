// 类型定义

export interface Post {
  frontMatter: {
    date?: string;
    title?: string;
    tags?: string[];
    description?: string;
  };
  regularPath: string;
  /** 上次更新时间（Git 最近一次提交时间戳，毫秒），用于列表排序与展示 */
  lastUpdated?: number;
}

export interface PageData {
  description: string;
  title: string;
  frontmatter: Record<string, any>;
  headers: Array<{
    level: number;
    title: string;
    slug: string;
  }>;
  lastUpdated?: number;
  relativePath: string;
}
