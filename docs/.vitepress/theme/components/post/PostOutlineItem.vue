<template>
  <li class="outline-item">
    <a
      :href="`#${header.slug}`"
      :class="`outline-link outline-h${header.level}`"
      :aria-label="`跳转到：${header.title}`"
    >
      {{ header.title }}
    </a>
    <ul v-if="header.children && header.children.length > 0" class="outline-nested">
      <PostOutlineItem
        v-for="(child, index) in header.children"
        :key="index"
        :header="child"
      />
    </ul>
  </li>
</template>

<script lang="ts" setup>
interface Header {
  level: number;
  title: string;
  slug: string;
  children?: Header[];
}

defineProps<{
  header: Header;
}>();
</script>

<style scoped>
.outline-item {
  margin: 0.5rem 0;
}

.outline-link {
  display: block;
  padding: 0.4rem 0.75rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  border-radius: 6px;
  transition: all 0.2s ease;
  line-height: 1.5;
  word-break: break-word;
}

.outline-link:hover {
  color: var(--vp-c-brand);
  background: rgba(8, 203, 0, 0.08);
  transform: translateX(4px);
}

.outline-link:focus-visible {
  outline: 2px solid var(--vp-c-brand);
  outline-offset: 2px;
}

/* 不同层级的样式 */
.outline-h2 {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-brand);
  padding-left: 0.75rem;
}

.outline-h3 {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  padding-left: 1.5rem;
}

.outline-h4 {
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding-left: 2.25rem;
}

.outline-h5 {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  padding-left: 3rem;
}

.outline-h6 {
  font-weight: 400;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  padding-left: 3.75rem;
}

.outline-nested {
  margin: 0.25rem 0 0 0;
  padding: 0;
  list-style: none;
}

/* 深色模式适配 */
:global(.dark) .outline-link:hover {
  background: rgba(74, 222, 128, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .outline-h2 {
    font-size: 0.9rem;
  }

  .outline-h3 {
    font-size: 0.85rem;
    padding-left: 1.25rem;
  }

  .outline-h4 {
    font-size: 0.8rem;
    padding-left: 1.75rem;
  }

  .outline-h5 {
    font-size: 0.75rem;
    padding-left: 2.25rem;
  }

  .outline-h6 {
    font-size: 0.7rem;
    padding-left: 2.75rem;
  }
}
</style>

