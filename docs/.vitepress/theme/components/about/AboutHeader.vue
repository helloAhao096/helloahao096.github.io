<template>
  <header class="about-header">
    <div class="header-avatar">
      <div class="avatar-container">
        <div class="avatar-placeholder">
          <span class="avatar-text">A</span>
        </div>
        <div class="avatar-status">
          <span class="status-label">Status</span>
          <span class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">ONLINE</span>
          </span>
        </div>
      </div>
    </div>

    <div class="header-content">
      <div class="header-title">
        <h1 class="name">
          AHAO<span class="name-accent">096</span>
        </h1>
        <p class="tagline">
          Full Stack Developer / Digital Nomad / Minimalist
        </p>
      </div>

      <div class="header-bio">
        <span class="bio-label">BIO.txt</span>
        <p class="bio-text">
          Hi there. I construct digital experiences with a focus on simplicity and performance.
          Exploring the boundaries between Code, Design, and Art.
        </p>
      </div>

      <div class="header-actions">
        <a
          href="mailto:helloahao@icloud.com"
          class="action-btn primary"
        >
          CONTACT_ME
        </a>
        <button class="action-btn secondary">
          DOWNLOAD_CV
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
// Header component with avatar, name, bio, and action buttons
</script>

<style scoped>
.about-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 5rem;
  align-items: center;
}

@media (min-width: 768px) {
  .about-header {
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }
}

.header-avatar {
  display: flex;
  justify-content: center;
}

.avatar-container {
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.avatar-text {
  font-size: 6rem;
  font-weight: bold;
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.avatar-status {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--color-border);
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 0.625rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-gray);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.625rem;
  font-family: var(--font-mono);
  font-weight: bold;
  color: var(--color-primary);
}

.status-dot {
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--color-primary);
}

.status-dot::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.75;
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.status-text {
  font-weight: bold;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
  line-height: 1.1;
  font-family: var(--font-sans);
}

.name-accent {
  color: var(--color-primary);
}

.tagline {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-gray);
  border-left: 2px solid var(--color-primary);
  padding-left: 0.75rem;
  margin: 0;
}

.header-bio {
  position: relative;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-soft);
  background: var(--color-surface);
  padding: 1rem;
  border: 1px solid var(--color-border);
}

.bio-label {
  position: absolute;
  top: -0.5rem;
  left: 1rem;
  background: var(--color-bg);
  padding: 0 0.25rem;
  font-size: 0.625rem;
  color: var(--color-text-gray);
}

.bio-text {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  font-family: var(--font-mono);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.action-btn.primary {
  background: var(--color-primary);
  color: var(--color-bg);
}

.action-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: var(--color-bg);
  color: var(--color-accent);
  border: 1px solid var(--color-border);
}

.action-btn.secondary:hover {
  background: var(--color-surface);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .name {
    font-size: 2rem;
  }

  .tagline {
    font-size: 0.75rem;
  }

  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }
}
</style>

