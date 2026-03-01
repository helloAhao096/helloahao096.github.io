<template>
  <section class="sponsor-section">
    <h2 v-if="showHeading" class="sponsor-title">
      <a :href="sponsorLink" class="sponsor-title-link">🧋喝口奶茶</a>
    </h2>
    <p class="sponsor-desc">
      捐助的任意金额都会成为搭建这个网站的一份力量，如果对任何东西感兴趣，或者对网站的建设等有建议或意见，都欢迎通过我的联系方式和我交流讨论
    </p>
    <div class="donation-grid">
      <div class="donation-card">
        <p class="donation-title">支付宝</p>
        <img
          src="/image/AliPay.jpeg"
          alt="支付宝转账二维码"
          class="donation-qr"
          loading="lazy"
        />
        <p class="donation-tip">长按保存后使用支付宝扫描</p>
      </div>
      <div class="donation-card">
        <p class="donation-title">微信</p>
        <img
          src="/image/WeChatPay.jpeg"
          alt="微信支付转账二维码"
          class="donation-qr"
          loading="lazy"
        />
        <p class="donation-tip">长按保存后使用微信扫描</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { withBase } from "vitepress";

withDefaults(
  defineProps<{
    /** 是否显示标题（about 页用 markdown 标题时会设为 false，以进入大纲） */
    showHeading?: boolean;
  }>(),
  { showHeading: true }
);

const sponsorLink = withBase("/sponsor");
</script>

<style scoped>
.sponsor-section {
  margin: 2.5rem 0 2rem;
}

.sponsor-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: var(--color-text);
}

.sponsor-title-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.sponsor-title-link:hover {
  color: var(--color-primary);
}

.sponsor-desc {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft);
}

.donation-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin: 1rem 0 0;
  justify-content: center;
}

.donation-card {
  flex: 1 1 220px;
  max-width: 320px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  text-align: center;
  background-color: var(--color-surface);
  box-shadow: 0 8px 20px rgba(8, 203, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 290px;
  gap: 0.75rem;
}

.donation-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.donation-qr {
  display: block;
  width: 170px;
  max-width: 100%;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
}

.donation-tip {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

:global(.dark) .donation-card {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}
</style>
