<template>
  <div class="home-post-list">
    <h2 class="section-title">Recent Posts</h2>
    <PostList :posts="posts" :page-size="pageSize" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useData } from "vitepress";
import PostList from "../blog/PostList.vue";
import type { Post } from "../../types";

const { theme } = useData();

// 获取文章数据
const posts = computed(() => {
  return (theme.value.posts || []) as Post[];
});

// 获取分页大小
const pageSize = computed(() => {
  return theme.value.pageSize || 5;
});
</script>

<style scoped>
.home-post-list {
  width: 100%;
  margin-top: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2rem;
  text-align: center;
  font-family: var(--font-sans);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .home-post-list {
    margin-top: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>

