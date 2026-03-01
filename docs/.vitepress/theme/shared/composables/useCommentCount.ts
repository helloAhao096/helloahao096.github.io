import { normalizePath } from "../../core/utils/path";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

interface DiscussionNode {
  title: string;
  comments: { totalCount: number };
}

interface DiscussionsResponse {
  data?: {
    repository?: {
      discussions: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: DiscussionNode[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/** 运行时缓存：路径 -> 评论数 */
let cache: Record<string, number> | null = null;
let fetchPromise: Promise<Record<string, number>> | null = null;

/**
 * 运行时通过 GitHub GraphQL 拉取 Discussions 评论数，供 post 模块按 pathname 查评论数
 * 需配置 VITE_GISCUS_DISCUSSIONS_TOKEN（仅读 Discussions 权限的细粒度 token）
 */
export function useCommentCount() {
  const ensureLoaded = (): Promise<Record<string, number>> => {
    if (cache !== null) {
      return Promise.resolve(cache);
    }
    if (fetchPromise !== null) {
      return fetchPromise;
    }

    const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env ?? {};
    const token = env.VITE_GISCUS_DISCUSSIONS_TOKEN;
    const repo = env.VITE_GISCUS_REPO;
    const categoryId = env.VITE_GISCUS_CATEGORY_ID ?? "";

    if (!token || !repo || !repo.includes("/")) {
      cache = {};
      return Promise.resolve(cache);
    }

    const [owner, name] = repo.split("/").map((s) => s.trim());
    if (!owner || !name) {
      cache = {};
      return Promise.resolve(cache);
    }

    const counts: Record<string, number> = {};
    let cursor: string | null = null;

    const fetchPage = (): Promise<Record<string, number>> => {
      const query = `
        query($owner: String!, $name: String!, $categoryId: ID, $cursor: String) {
          repository(owner: $owner, name: $name) {
            discussions(first: 100, categoryId: $categoryId, after: $cursor) {
              pageInfo { hasNextPage, endCursor }
              nodes {
                title
                comments { totalCount }
              }
            }
          }
        }
      `;

      return fetch(GITHUB_GRAPHQL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            owner,
            name,
            categoryId: categoryId || null,
            cursor: cursor || null,
          },
        }),
      })
        .then((res) => res.json())
        .then((json: DiscussionsResponse) => {
          if (json.errors?.length) {
            throw new Error(json.errors.map((e) => e.message).join("; "));
          }
          return json;
        })
        .then((json) => {
          const discussions = json.data?.repository?.discussions;
          if (!discussions) return counts;

          for (const node of discussions.nodes) {
            const key = normalizePath(node.title);
            const total = node.comments?.totalCount ?? 0;
            counts[key] = (counts[key] ?? 0) + total;
          }

          if (discussions.pageInfo.hasNextPage && discussions.pageInfo.endCursor) {
            cursor = discussions.pageInfo.endCursor;
            return fetchPage();
          }
          return counts;
        });
    };

    fetchPromise = fetchPage()
      .then((data) => {
        cache = data;
        return cache;
      })
      .catch(() => {
        cache = {};
        return cache;
      });

    return fetchPromise;
  };

  /**
   * 根据 regularPath 获取评论数
   * @param regularPath 文章路径，如 /posts/xxx
   * @returns 评论数，无数据时返回 0
   */
  const getCount = (regularPath: string): number => {
    const key = normalizePath(regularPath);
    if (cache !== null) {
      return cache[key] ?? 0;
    }
    return 0;
  };

  return {
    getCount,
    ensureLoaded,
  };
}
