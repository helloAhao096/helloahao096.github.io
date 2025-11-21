<template>
  <section class="friends-section">
    <div class="section-header">
      <h2 class="section-title">// Handshake_Nodes</h2>
    </div>
    <div class="friends-list">
      <a
        v-for="friend in friends"
        :key="friend.name"
        :href="friend.url"
        target="_blank"
        rel="noopener noreferrer"
        class="friend-capsule"
      >
        <div class="friend-name">{{ friend.name }}</div>
        <div class="friend-desc">{{ friend.description }}</div>
      </a>
    </div>
  </section>
</template>

<script lang="ts" setup>
interface Friend {
  name: string;
  url: string;
  description: string;
}

const friends: Friend[] = [
  {
    name: "Hacker News",
    description: "Tech News",
    url: "https://news.ycombinator.com",
  },
  {
    name: "Dribbble",
    description: "Design Inspiration",
    url: "https://dribbble.com",
  },
  {
    name: "Vercel",
    description: "Deployment",
    url: "https://vercel.com",
  },
];
</script>

<style scoped>
.friends-section {
  background: var(--color-surface);
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: bold;
  font-family: var(--font-mono);
  text-transform: uppercase;
  color: var(--color-text-gray);
  margin: 0;
}

.friends-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.friend-capsule {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.friend-capsule:hover {
  border-color: var(--color-primary);
  background: var(--color-bg);
}

.friend-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  font-family: var(--font-sans);
}

.friend-desc {
  font-size: 0.75rem;
  color: var(--color-text-gray);
  font-family: var(--font-mono);
}
</style>

