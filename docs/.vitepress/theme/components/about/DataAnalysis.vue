<template>
  <CyberSection title="Data_Analysis">
    <div class="data-content">
      <div class="data-section">
        <h3 class="data-label">Interests</h3>
        <div class="data-tags">
          <span
            v-for="tag in interests"
            :key="tag"
            class="data-tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="data-section">
        <h3 class="data-label">Taste / Favorites</h3>
        <div class="data-favorites">
          <div class="favorite-item">
            <span class="favorite-icon">🎵</span>
            <div class="favorite-info">
              <span class="favorite-name">Daft Punk</span>
              <span class="favorite-desc">Electronic / French House</span>
            </div>
          </div>
          <div class="favorite-item">
            <span class="favorite-icon">🎬</span>
            <div class="favorite-info">
              <span class="favorite-name">Blade Runner 2049</span>
              <span class="favorite-desc">Movie / Visuals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CyberSection>
</template>

<script lang="ts" setup>
import CyberSection from "./CyberSection.vue";

const interests = [
  "Sci-Fi",
  "Cyberpunk",
  "Coffee Brewing",
  "Pixel Art",
  "Synthesizers",
  "Brutalism",
  "Notion",
];
</script>

<style scoped>
.data-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-label {
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-text-gray);
  margin: 0;
  font-family: var(--font-mono);
}

.data-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.data-tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  font-family: var(--font-mono);
  color: var(--color-text-gray);
  border: none;
  background: transparent;
  opacity: 0.8;
  line-height: 1.5;
}

.data-favorites {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .data-favorites {
    grid-template-columns: repeat(2, 1fr);
  }
}

.favorite-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.favorite-icon {
  font-size: 0.875rem;
  color: var(--color-text-gray);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.favorite-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.favorite-name {
  display: block;
  font-weight: bold;
  color: var(--color-text);
}

.favorite-desc {
  font-size: 0.75rem;
  color: var(--color-text-gray);
}
</style>

