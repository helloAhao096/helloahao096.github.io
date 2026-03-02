import { normalizePath } from "../../core/utils/path";
import { useCommentCountStore } from "../../modules/comment/store/commentCount";
import { GISCUS_CONFIG } from "../../modules/comment/constants";

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

/** 防止重复请求 */
let fetchPromise: Promise<Record<string, number>> | null = null;

/**
 * 评论数 composable：统一数据口径，通过 store 存取
 * 请求 API 后更新 store，组件通过 getCount 从 store 获取
 */
export function useCommentCount() {
  const store = useCommentCountStore();

  const ensureLoaded = (): Promise<Record<string, number>> => {
    if (store.loaded) {
      return Promise.resolve(store.counts);
    }
    if (fetchPromise !== null) {
      return fetchPromise;
    }

    // 与 Comments.vue 共用 GISCUS_CONFIG，保证配置一致；token 敏感信息单独从 env 读取
    const token =
      ((import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_GISCUS_DISCUSSIONS_TOKEN) ?? "";
    const repo = GISCUS_CONFIG.repo ?? "";
    const categoryId = GISCUS_CONFIG.categoryId ?? "";

    if (!repo || !repo.includes("/")) {
      store.setCounts({});
      return Promise.resolve({});
    }

    const [owner, name] = repo.split("/").map((s) => s.trim());
    if (!owner || !name) {
      store.setCounts({});
      return Promise.resolve({});
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

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "User-Agent": "VitePress-Giscus-CommentCount/1.0",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      return fetch(GITHUB_GRAPHQL, {
        method: "POST",
        headers,
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
            let decodedTitle = node.title;
            try {
              decodedTitle = decodeURIComponent(node.title);
            } catch {
              // title 含畸形 % 编码时保留原值
            }
            const key = normalizePath(decodedTitle);
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
        store.setCounts(data);
        return data;
      })
      .catch(() => {
        store.setCounts({});
        return {};
      });

    return fetchPromise;
  };

  /**
   * 根据 regularPath 获取评论数（从 store 读取，响应式）
   */
  const getCount = (regularPath: string): number => {
    return store.getCount(regularPath);
  };

  return {
    getCount,
    ensureLoaded,
    store,
  };
}
