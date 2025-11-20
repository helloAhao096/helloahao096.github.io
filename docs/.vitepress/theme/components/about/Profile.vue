<template>
  <div class="profile">
    <div class="profile-header">
      <div class="profile-avatar">
        <img v-if="avatar" :src="avatar" alt="Avatar" />
        <div v-else class="avatar-placeholder">A</div>
      </div>
      <h2 class="profile-name">{{ name }}</h2>
      <p class="profile-bio" v-if="bio">{{ bio }}</p>
    </div>
    
    <div class="profile-links" v-if="links.length > 0">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="profile-link"
      >
        <span class="link-icon">{{ link.icon }}</span>
        <span class="link-label">{{ link.label }}</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Link {
  label: string;
  url: string;
  icon: string;
}

interface Props {
  name?: string;
  bio?: string;
  avatar?: string;
  links?: Link[];
}

withDefaults(defineProps<Props>(), {
  name: "Ahao",
  bio: "",
  avatar: "",
  links: () => [
    { label: "GitHub", url: "https://github.com/helloAhao096", icon: "🔗" },
    { label: "Email", url: "mailto:helloahao@icloud.com", icon: "📧" },
  ],
});
</script>

<style scoped>
.profile {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--color-surface);
  border: 4px solid var(--color-border);
  box-shadow: 6px 6px var(--color-primary);
  border-radius: var(--radius-card);
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  border: 4px solid var(--color-primary);
  overflow: hidden;
  background: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.profile-name {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1rem 0;
  font-family: var(--font-sans);
}

.profile-bio {
  font-size: 1rem;
  color: var(--color-text-soft);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.profile-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-bg);
  transition: all 0.2s ease;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.profile-link:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px var(--color-primary);
  text-decoration: none;
}

.link-icon {
  font-size: 1rem;
}

.link-label {
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .profile {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .avatar-placeholder {
    font-size: 2.5rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .profile-bio {
    font-size: 0.9rem;
  }
  
  .profile-links {
    gap: 0.75rem;
  }
  
  .profile-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>

