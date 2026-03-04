<template>
  <PageContainer>
    <section class="invest-hero">
      <p class="eyebrow">Invest Overview</p>
      <h1 class="invest-title">投资与财富自由计划</h1>
      <p class="invest-description">
        这里集中展示与投资、财富自由计划相关的文章或记录，方便按时间回顾自己的思考与实践。
      </p>
    </section>

    <section v-if="entries.length" class="invest-list">
      <article
        v-for="entry in entries"
        :key="entry.regularPath"
        class="invest-item"
      >
        <h2 class="invest-item-title">
          <a :href="entry.regularPath.replace(/\\.html$/, '')">
            {{ entry.frontMatter.title || "未命名条目" }}
          </a>
        </h2>
        <p v-if="entry.frontMatter.description" class="invest-item-desc">
          {{ entry.frontMatter.description }}
        </p>
        <p class="invest-item-meta">
          <span v-if="entry.frontMatter.date">日期：{{ entry.frontMatter.date }}</span>
        </p>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>当前还没有投资相关内容，后续会在这里集中整理投资记录与思考。</p>
    </section>
  </PageContainer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useData } from "vitepress";
import PageContainer from "../../../shared/components/layout/PageContainer.vue";
import type { Post } from "../../../core/types";

const { theme } = useData();

const entries = computed<Post[]>(() => {
  return (theme.value.invest || []) as Post[];
});
</script>

<style scoped>
.invest-hero {
  margin-bottom: 2rem;
}

.eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 0.4rem;
}

.invest-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.invest-description {
  font-size: 0.98rem;
  color: var(--vp-c-text-2);
  max-width: 640px;
}

.invest-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.invest-item-title {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.invest-item-title a {
  text-decoration: none;
  color: inherit;
}

.invest-item-title a:hover {
  text-decoration: underline;
}

.invest-item-desc {
  margin: 0.25rem 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.invest-item-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.empty-state {
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}
</style>

