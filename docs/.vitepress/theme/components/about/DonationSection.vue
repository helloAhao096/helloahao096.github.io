<template>
  <section class="donation-section">
    <div
      class="donation-card"
      :class="{ active: showDonate }"
      @click="showDonate = !showDonate"
    >
      <div class="donation-badge">PWR</div>

      <div class="donation-header">
        <div class="donation-icon">⚡</div>
        <div class="donation-title-group">
          <h3 class="donation-title">Energy Supply</h3>
          <span class="donation-subtitle">Buy me a coffee</span>
        </div>
      </div>

      <transition name="expand">
        <div v-if="showDonate" class="donation-content">
          <div class="donation-qrcodes">
            <div class="qrcode-item">
              <div class="qrcode-placeholder">QR</div>
              <div class="qrcode-label">WeChat</div>
            </div>
            <div class="qrcode-item">
              <div class="qrcode-placeholder">QR</div>
              <div class="qrcode-label">Alipay</div>
            </div>
          </div>
        </div>
      </transition>

      <p v-if="!showDonate" class="donation-hint">
        System running on caffeine. Click to transmit energy packets.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const showDonate = ref(false);
</script>

<style scoped>
.donation-section {
  margin-bottom: 3rem;
}

.donation-card {
  position: relative;
  padding: 1.5rem;
  border: 2px solid var(--color-primary);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.donation-card:hover {
  background: var(--color-overlay);
  transform: scale(1.02);
}

.donation-card.active {
  background: var(--color-overlay);
}

.donation-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary);
  color: var(--color-bg);
  font-size: 0.625rem;
  font-weight: bold;
  font-family: var(--font-mono);
}

.donation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.donation-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-primary);
  font-size: 1.25rem;
}

.donation-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.donation-title {
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
  font-family: var(--font-sans);
}

.donation-subtitle {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-text-gray);
}

.donation-hint {
  font-size: 0.75rem;
  color: var(--color-text-gray);
  line-height: 1.6;
  margin: 0.5rem 0 0 0;
}

.donation-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--color-border);
}

.donation-qrcodes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.qrcode-item {
  background: var(--color-bg);
  padding: 0.5rem;
  border: 1px solid var(--color-border);
}

.qrcode-placeholder {
  aspect-ratio: 1;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--color-text-gray);
  margin-bottom: 0.25rem;
}

.qrcode-label {
  font-size: 0.625rem;
  font-weight: bold;
  color: var(--color-text);
  font-family: var(--font-mono);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>

