<template>
  <button
    class="back-to-top"
    :class="{ visible: isVisible }"
    @click="scrollToTop"
    aria-label="返回顶部"
    type="button"
  >
    <svg
      class="back-to-top-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 15L12 9L6 15"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

// 控制按钮显示/隐藏
const isVisible = ref(false);

// 滚动阈值配置
const SCROLL_THRESHOLD_PERCENT = 0.2; // 视口高度的 20%

// 计算滚动阈值（基于视口高度的百分比）
const getScrollThreshold = () => {
  if (typeof window === "undefined") return 300; // SSR 时返回默认值
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  return viewportHeight * SCROLL_THRESHOLD_PERCENT;
};

// 节流函数
let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (typeof window !== "undefined") {
        const scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const threshold = getScrollThreshold();
        isVisible.value = scrollTop > threshold;
      }
      ticking = false;
    });
    ticking = true;
  }
};

// 返回顶部
const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  if (typeof window === "undefined") return;
  // 初始检查滚动位置
  handleScroll();
  // 添加滚动监听
  window.addEventListener("scroll", handleScroll, { passive: true });
  // 监听窗口大小变化，重新检查滚动位置
  window.addEventListener("resize", handleScroll, { passive: true });
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  }
});
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 999;
  
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  
  color: var(--color-bg);
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
  
  cursor: pointer;
  user-select: none;
  
  /* 初始状态：隐藏在下方 */
  transform: translateY(100px);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  
  /* 性能优化 */
  will-change: transform, opacity;

  /* 动画配置 */
  transition: 
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease,
    visibility 0s 0.4s; /* 隐藏延迟 */
}

.back-to-top.visible {
  /* 显示状态：回到原位 */
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  
  /* 显示立即生效 */
  transition: 
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease,
    visibility 0s 0s; 
}

/* 键盘聚焦样式 */
.back-to-top:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.back-to-top.visible:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: 0 20px 40px rgba(8, 203, 0, 0.2);
  
  /* hover 轻微上浮 */
  transform: translateY(-4px);
  transition: 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease;
}

.back-to-top.visible:active {
  /* 点击回缩 */
  transform: translateY(-2px) scale(0.96);
  transition: 
    transform 0.1s ease,
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease;
}

.back-to-top-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
  }

  .back-to-top-icon {
    width: 20px;
    height: 20px;
  }
}

/* 深色模式适配 */
.dark .back-to-top {
  color: var(--color-bg);
  background-color: var(--color-primary);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.55);
}

.dark .back-to-top:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 20px 40px rgba(74, 222, 128, 0.3);
}
</style>
