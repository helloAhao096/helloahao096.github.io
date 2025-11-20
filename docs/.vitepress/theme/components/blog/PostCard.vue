<template>
  <a :href="withBase(post.regularPath)" class="post-card">
    <div class="post-date">{{ formatDate(post.frontMatter.date || "") }}</div>
    <div class="post-title">{{ post.frontMatter.title }}</div>
    <div class="post-tags" v-if="postTags.length > 0">
      <span
        v-for="tag in postTags"
        :key="tag"
        class="post-tag"
      >
        {{ tag }}
      </span>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { withBase } from "vitepress";
import { formatDate } from "../../utils/date";
import type { Post } from "../../types";

interface Props {
  post: Post;
}

const props = defineProps<Props>();

// 获取文章标签
const postTags = computed(() => {
  const tags = props.post.frontMatter.tags;
  if (Array.isArray(tags)) {
    return tags;
  }
  return [];
});
</script>

<style scoped>
.post-card {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto 1.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-primary);
  background: transparent;
  text-decoration: none;
  color: var(--color-text);
  line-height: 1.2;
  position: relative;
  box-shadow: 0 0 8px rgba(8, 203, 0, 0.15);
}

.post-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--color-primary);
  opacity: 0.6;
}

.post-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 100%;
  background: var(--color-primary);
  opacity: 0.6;
}

.post-card:last-child {
  margin-bottom: 0;
}

.post-date {
  flex-shrink: 0;
  width: 100px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-right: 1.5rem;
  font-weight: 500;
}

.post-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
  min-width: 0;
  font-family: var(--font-sans);
}

.post-tags {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.post-tag {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-family: var(--font-mono);
  color: var(--color-primary);
  border: none;
  background: transparent;
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .post-card {
    flex-wrap: wrap;
    padding: 0.6rem 0.8rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  
  .post-date {
    width: 80px;
    font-size: 0.7rem;
    margin-right: 1rem;
  }
  
  .post-title {
    flex: 1;
    min-width: 0;
    font-size: 0.85rem;
  }
  
  .post-tags {
    width: 100%;
    margin-left: 0;
    margin-top: 0.3rem;
    padding-left: calc(80px + 1rem);
  }
  
  .post-tag {
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }
}
</style>

