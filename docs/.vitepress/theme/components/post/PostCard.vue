<template>
  <a :href="withBase(post.regularPath)" class="post-card">
    <div class="post-title">{{ post.frontMatter.title }}</div>
    <div class="post-right">
      <div class="post-meta">
        <span class="post-meta-icon">📅</span>
        <span class="post-meta-label">发布</span>
        <span class="post-meta-value">{{ formatDateTimeNum(post.frontMatter.date || "") }}</span>
      </div>
      <div class="post-meta" v-if="post.lastUpdated">
        <span class="post-meta-icon">📝</span>
        <span class="post-meta-label">修改</span>
        <span class="post-meta-value">{{ formatDateTimeNum(post.lastUpdated) }}</span>
      </div>
      <div class="post-tags" v-if="postTags.length > 0">
        <span
          v-for="tag in postTags"
          :key="tag"
          class="post-tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </a>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { withBase } from "vitepress";
import { formatDateTimeNum } from "../../utils/date";
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
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  text-decoration: none;
  color: var(--color-text);
  gap: 1.5rem;
  transition: border-color 0.2s ease;
}

.post-card:hover {
  border-bottom-color: var(--color-primary);
}

.post-title {
  flex: 1;
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--color-primary);
  margin: 0;
  line-height: 1.65;
  min-width: 0;
  font-family: var(--font-sans);
  transition: text-shadow 0.3s ease;
}

/* 只在支持 hover 的设备上应用 hover 效果（移动端不触发） */
@media (hover: hover) {
  .post-card:hover .post-title {
    text-shadow: 0 0 3px rgba(8, 203, 0, 0.25), 0 0 8px rgba(8, 203, 0, 0.15), 0 0 15px rgba(8, 203, 0, 0.1), 0 0 25px rgba(8, 203, 0, 0.08);
  }

  /* 深色模式 hover 效果 */
  :global(.dark) .post-card:hover .post-title {
    text-shadow: 0 0 3px rgba(102, 255, 90, 0.2), 0 0 8px rgba(102, 255, 90, 0.12), 0 0 15px rgba(102, 255, 90, 0.08), 0 0 25px rgba(102, 255, 90, 0.06);
  }
}

.post-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  min-width: 120px;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-gray);
  gap: 0.5rem;
}

.post-meta-icon {
  font-size: 1rem;
  line-height: 1;
  margin-right: -0.1rem;
}

.post-meta-label {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin-right: -0.2rem;
}

.post-meta-value {
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
  opacity: 0.9;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  row-gap: 0.4rem;
}

.post-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  margin-right: 0.5rem;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--color-text-gray);
  border: none;
  background: transparent;
  opacity: 0.8;
  line-height: 1.5;
}

.post-tag:last-child {
  margin-right: 0;
  padding-right: 0;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .post-card {
    flex-direction: column;
    padding: 0.875rem 1rem;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .post-title {
    font-size: 1.25rem;
    line-height: 1.6;
    width: 100%;
  }
  
  .post-right {
    width: 100%;
    align-items: flex-end;
    text-align: right;
    gap: 0.25rem;
    min-width: auto;
  }
  
  .post-meta {
    font-size: 0.8rem;
    justify-content: flex-end;
    gap: 0.4rem;
  }
  
  .post-meta-icon {
    font-size: 0.9rem;
  }
  
  .post-meta-label {
    font-size: 0.75rem;
    margin-right: -0.1rem;
  }
  
  .post-tags {
    row-gap: 0.3rem;
  }
  
  .post-tag {
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    margin-right: 0.4rem;
  }
}
</style>


