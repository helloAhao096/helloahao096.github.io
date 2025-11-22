<template>
  <section class="post-title">
    <h1 class="title">{{ title }}</h1>

    <blockquote v-if="description" class="description">
      <p class="description-text">{{ description }}</p>
    </blockquote>

    <section
      v-if="publishDate || tags.length"
      class="meta-block"
    >
      <div v-if="publishDate" class="meta-row">
        <span class="meta-leading">
          <span class="meta-emoji" aria-hidden="true">🗓️</span>
          <span class="meta-label">发布时间</span>
        </span>
        <span class="meta-value">{{ publishDate }}</span>
      </div>

      <div v-if="tags.length" class="meta-row meta-row-tags">
        <span class="meta-leading">
          <span class="meta-emoji" aria-hidden="true">🏷️</span>
          <span class="meta-label">标签</span>
        </span>
        <div class="meta-value">
          <span
            v-for="tag in tags"
            :key="tag"
            class="meta-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useData } from "vitepress";
import dayjs from "dayjs";
import type { PageData } from "../../types";

const pageData: PageData = useData().page.value;
const { title, description, frontmatter } = pageData;

// 计算发布时间（YYYY-MM-DD HH:mm:ss），若格式异常则回退原始值
const publishDate = computed(() => {
  const source = frontmatter?.date;
  if (!source) {
    return "";
  }
  const date = dayjs(source);
  return date.isValid() ? date.format("YYYY-MM-DD HH:mm:ss") : String(source);
});

// 规范化标签数据，兼容 string / array
const tags = computed(() => {
  const raw = frontmatter?.tags;
  if (Array.isArray(raw)) {
    return raw;
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
});
</script>
<style scoped>
.title {
  color: var(--color-primary);
  font-weight: 500;
  font-size: 2.4rem;
  margin: 0.35em 0 0.25em;
  line-height: 1.25;
  font-family: var(--font-sans);
  text-transform: none;
  text-shadow: 0 0 18px rgba(8, 203, 0, 0.12);
}

.meta-block {
  margin-bottom: 1.5rem;
  padding: 1rem 0 1.15rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
}

.meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--color-text-gray);
}

.meta-leading {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.meta-emoji {
  font-size: 1rem;
  line-height: 1;
}

.meta-label {
  color: var(--color-text-gray);
  letter-spacing: 0.04em;
}

.meta-value {
  color: var(--color-primary);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.meta-row-tags .meta-value {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.meta-tag {
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(8, 203, 0, 0.2);
  font-size: 0.75rem;
  color: var(--color-primary);
  background: rgba(8, 203, 0, 0.08);
}

.description {
  display: flex;
  align-items: flex-start;
  gap: 0.95rem;
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  border-left: 3px solid var(--color-primary);
  background: rgba(8, 203, 0, 0.06);
  border-radius: 0 12px 12px 0;
  font-family: var(--font-sans);
}

.description-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text);
  opacity: 0.9;
}

:global(.dark) .description {
  background: rgba(8, 203, 0, 0.16);
}

:global(.dark) .meta-block {
  border-color: rgba(255, 255, 255, 0.08);
}

:global(.dark) .meta-tag {
  background: rgba(8, 203, 0, 0.2);
  border-color: rgba(8, 203, 0, 0.4);
  color: var(--color-bg);
}

@media (max-width: 640px) {
  .post-title {
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .meta-block {
    padding: 0.85rem 0 1rem;
  }

  .meta-row {
    align-items: flex-start;
    gap: 0.45rem;
  }

  .meta-row-tags .meta-value {
    flex: 1 1 auto;
  }
}
</style>
