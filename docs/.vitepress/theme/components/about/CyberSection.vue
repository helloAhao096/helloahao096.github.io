<template>
  <section class="cyber-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="section-content">
      <slot />
    </div>
  </section>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
}

defineProps<Props>();
</script>

<style scoped>
.cyber-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 1rem;
  font-weight: bold;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.section-content {
  color: var(--color-text-soft);
  line-height: 1.8;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .cyber-section {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
}
</style>

