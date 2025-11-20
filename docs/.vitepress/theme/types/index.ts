// 类型定义

export interface Post {
  frontMatter: {
    date?: string;
    title?: string;
    tags?: string[];
    description?: string;
  };
  regularPath: string;
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
  lastUpdated: number;
  relativePath: string;
}

