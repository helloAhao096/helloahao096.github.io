<template>
  <CyberSection title="User_Manual.md">
    <div class="manual-content">
      <div class="manual-grid">
        <div class="manual-item">
          <h3 class="manual-category">[Cognition]</h3>
          <p class="manual-text">
            INTJ-A. Driven by logic but inspired by art. I believe in "Less is More" but "Details are Everything".
          </p>
        </div>
        <div class="manual-item">
          <h3 class="manual-category">[Philosophy]</h3>
          <p class="manual-text">
            Technology should be quiet. It should work for us, not demand our attention. I build calm software.
          </p>
        </div>
      </div>

      <div class="manual-skills">
        <div class="skill-item">
          <span class="skill-label">Coding</span>
          <div class="skill-bar">
            <div class="skill-fill" style="width: 90%"></div>
          </div>
        </div>
        <div class="skill-item">
          <span class="skill-label">Design</span>
          <div class="skill-bar">
            <div class="skill-fill primary" style="width: 75%"></div>
          </div>
        </div>
        <div class="skill-item">
          <span class="skill-label">Sleeping</span>
          <div class="skill-bar">
            <div class="skill-fill muted" style="width: 40%"></div>
          </div>
        </div>
      </div>
    </div>
  </CyberSection>
</template>

<script lang="ts" setup>
import CyberSection from "./CyberSection.vue";
</script>

<style scoped>
.manual-content {
  font-family: var(--font-mono);
}

.manual-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .manual-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.manual-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.manual-category {
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0;
  font-family: var(--font-mono);
}

.manual-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-soft);
  margin: 0;
}

.manual-skills {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}

.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  padding-bottom: 0.25rem;
  border-bottom: 1px dashed var(--color-border);
}

.skill-label {
  flex-shrink: 0;
  color: var(--color-text-soft);
}

.skill-bar {
  flex: 1;
  max-width: 8rem;
  height: 0.375rem;
  background: var(--color-surface);
  border-radius: 999px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--color-text);
  border-radius: 999px;
}

.skill-fill.primary {
  background: var(--color-primary);
}

.skill-fill.muted {
  background: var(--color-text-gray);
}
</style>

