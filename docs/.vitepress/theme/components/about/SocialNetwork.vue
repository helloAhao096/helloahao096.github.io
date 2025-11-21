<template>
  <section class="social-section">
    <div class="section-header">
      <span class="section-icon">🌐</span>
      <h2 class="section-title">Network_Protocols</h2>
    </div>
    <div class="social-grid">
      <a
        v-for="link in links"
        :key="link.name"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
        :title="link.name"
      >
        <span class="social-icon">{{ link.icon }}</span>
        <span class="social-name">{{ link.name }}</span>
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

const links: SocialLink[] = [
  { name: "Bilibili", icon: "📺", url: "https://space.bilibili.com/yourid" },
  { name: "NetEase", icon: "🎵", url: "https://music.163.com/#/user/home?id=yourid" },
  { name: "Steam", icon: "🎮", url: "https://steamcommunity.com/id/yourid" },
  { name: "Github", icon: "💻", url: "https://github.com/helloAhao096" },
];
</script>

<style scoped>
.social-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.section-icon {
  font-size: 0.875rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: bold;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--color-primary);
  margin: 0;
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  text-decoration: none;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  transition: all 0.2s ease;
}

.social-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(8, 203, 0, 0.1);
}

.social-icon {
  font-size: 1.5rem;
}

.social-name {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  font-weight: 500;
}
</style>

