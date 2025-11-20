<template>
  <div class="skills">
    <h3 class="skills-title">Skills</h3>
    <div class="skills-grid">
      <div
        v-for="skill in skills"
        :key="skill"
        class="skill-tag"
      >
        {{ skill }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  skills?: string[];
}

withDefaults(defineProps<Props>(), {
  skills: () => [
    "Vue.js",
    "TypeScript",
    "Node.js",
    "Docker",
    "Linux",
    "Git",
  ],
});
</script>

<style scoped>
.skills {
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--color-surface);
  border: 4px solid var(--color-border);
  box-shadow: 6px 6px var(--color-primary);
  border-radius: var(--radius-card);
}

.skills-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-family: var(--font-sans);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.skill-tag {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-family: var(--font-mono);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 6px;
  background: transparent;
  text-align: center;
  transition: all 0.2s ease;
  cursor: default;
}

.skill-tag:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px var(--color-primary-hover);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .skills {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .skills-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  .skill-tag {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>

