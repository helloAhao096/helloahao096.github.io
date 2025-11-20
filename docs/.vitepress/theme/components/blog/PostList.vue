<template>
  <div class="post-list">
    <div class="post-list-content">
      <PostCard
        v-for="post in currentPosts"
        :key="post.regularPath"
        :post="post"
      />
    </div>
    
    <div class="pagination" v-if="pagesNum > 1">
      <div
        class="pagination-link"
        :class="{ active: pageCurrent === i }"
        v-for="i in pagesNum"
        :key="i"
        @click="go(i)"
      >
        {{ i }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useData } from "vitepress";
import PostCard from "./PostCard.vue";
import type { Post } from "../../types";

interface Props {
  posts?: Post[];
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  posts: undefined,
  pageSize: 5,
});

const { theme } = useData();

// 获取所有文章
let postsAll = props.posts && props.posts.length > 0 
  ? props.posts 
  : ((theme.value.posts || []) as Post[]);

// 过滤掉 index 页面
postsAll = postsAll.filter((item: Post) => {
  return item.regularPath.indexOf("index") < 0;
});

// 计算总页数
const pagesNum = computed(() => {
  const total = postsAll.length;
  return total % props.pageSize === 0
    ? total / props.pageSize
    : Math.floor(total / props.pageSize) + 1;
});

// 当前页码
const pageCurrent = ref(1);

// 分页数据映射
const allMap: Record<number, Post[]> = {};
for (let i = 0; i < pagesNum.value; i++) {
  allMap[i] = [];
}
let index = 0;
for (let i = 0; i < postsAll.length; i++) {
  if (allMap[index].length > props.pageSize - 1) {
    index += 1;
  }
  allMap[index].push(postsAll[i]);
}

// 当前页文章
const currentPosts = computed(() => {
  return allMap[pageCurrent.value - 1] || [];
});

// 分页跳转
const go = (i: number) => {
  pageCurrent.value = i;
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.post-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 900px;
  margin: 0 auto;
  min-height: 500px;
  position: relative;
}

.post-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1.5rem;
  flex-wrap: wrap;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 0;
}

.pagination-link {
  min-width: 2.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text);
  border: 2px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  transition: all 0.2s ease;
  user-select: none;
}

.pagination-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-link.active {
  background: var(--color-primary);
  color: var(--color-bg);
  border-color: var(--color-primary);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .post-list {
    min-height: 450px;
  }
  
  .pagination {
    padding-top: 1rem;
    gap: 0.4rem;
  }
  
  .pagination-link {
    min-width: 2rem;
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
  }
}
</style>

