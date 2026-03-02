import { defineStore } from "pinia";
import { normalizePath } from "../../../core/utils/path";

/**
 * 评论数 store：统一存储 path -> 评论数 映射
 * 由 useCommentCount 在请求 GitHub GraphQL 后更新
 */
export const useCommentCountStore = defineStore("commentCount", {
  state: () => ({
    /** path (normalized) -> 评论数 */
    counts: {} as Record<string, number>,
    /** 是否已加载完成 */
    loaded: false,
  }),

  getters: {
    /**
     * 根据 regularPath 获取评论数
     */
    getCount: (state) => (regularPath: string): number => {
      const key = normalizePath(regularPath);
      return state.counts[key] ?? 0;
    },
  },

  actions: {
    /** 设置评论数映射，请求 API 成功后调用 */
    setCounts(counts: Record<string, number>) {
      this.counts = counts;
      this.loaded = true;
    },
    /** 重置，用于错误或重新加载 */
    reset() {
      this.counts = {};
      this.loaded = false;
    },
  },
});
