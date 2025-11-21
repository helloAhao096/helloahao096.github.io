<template>
  <div class="gear-item">
    <div class="gear-icon">{{ icon || "📦" }}</div>
    <div class="gear-info">
      <div class="gear-name">{{ name }}</div>
      <div class="gear-model">{{ model }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  name: string;
  model: string;
  icon?: string;
}

defineProps<Props>();
</script>

<style scoped>
.gear-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.gear-item:hover {
  border-color: var(--color-primary);
  background: var(--color-surface);
}

.gear-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.gear-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gear-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  font-family: var(--font-sans);
}

.gear-model {
  font-size: 0.75rem;
  color: var(--color-text-gray);
  font-family: var(--font-mono);
}
</style>

