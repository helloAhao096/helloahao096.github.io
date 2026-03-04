<template>
  <PageContainer>
    <section class="projects-hero">
      <p class="eyebrow">Projects Overview</p>
      <h1 class="projects-title">开源项目与网站</h1>
      <p class="projects-description">
        这里集中展示自己维护的开源应用、工具和网站，方便一站式查看与跳转。
      </p>
    </section>

    <section v-if="entries.length" class="projects-list">
      <article
        v-for="entry in entries"
        :key="entry.regularPath"
        class="project-item"
      >
        <h2 class="project-item-title">
          <a :href="entry.regularPath.replace(/\\.html$/, '')">
            {{ entry.frontMatter.title || "未命名项目" }}
          </a>
        </h2>
        <p v-if="entry.frontMatter.description" class="project-item-desc">
          {{ entry.frontMatter.description }}
        </p>
        <p class="project-item-meta">
          <span v-if="entry.frontMatter.date">更新：{{ entry.frontMatter.date }}</span>
        </p>
      </article>
    </section>

    <section v-else class="empty-state">
      <p>当前还没有单独的项目条目，可以在 docs/projects/ 下添加项目介绍 md 文件。</p>
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
  return (theme.value.projects || []) as Post[];
});
</script>

<style scoped>
.projects-hero {
  margin-bottom: 2rem;
}

.eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 0.4rem;
}

.projects-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.projects-description {
  font-size: 0.98rem;
  color: var(--vp-c-text-2);
  max-width: 640px;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-item-title {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.project-item-title a {
  text-decoration: none;
  color: inherit;
}

.project-item-title a:hover {
  text-decoration: underline;
}

.project-item-desc {
  margin: 0.25rem 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}

.project-item-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.empty-state {
  padding: 2rem 0;
  color: var(--vp-c-text-2);
}
</style>

