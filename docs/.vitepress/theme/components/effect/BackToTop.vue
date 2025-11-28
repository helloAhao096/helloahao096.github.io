<template>
  <button
    v-if="isPostPage"
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useData } from "vitepress";

const { page } = useData();

// 判断是否为博文页面
const isPostPage = computed(() => {
  const path = page.value.relativePath || "";
  
  // relativePath 格式: "posts/xxx.md" 或 "posts/xxx/index.md"
  // 判断路径包含 posts/ 且不是 index.md
  const isPost = path.includes("posts/");
  
  // 排除 posts/index.md
  const isIndex = 
    path === "posts/index.md" ||
    path.endsWith("/posts/index.md") ||
    path.endsWith("posts/index.md");
  
  return isPost && !isIndex;
});

// 控制按钮显示/隐藏
const isVisible = ref(false);

// 客户端标识
const isClient = ref(false);

// 滚动阈值配置
// 使用视口高度的百分比，确保在不同屏幕尺寸下都有合理的触发点
// 当滚动距离超过阈值时显示按钮，在页面顶部时隐藏按钮，保持页面简洁
const SCROLL_THRESHOLD_PERCENT = 0.2; // 视口高度的 20%

// 计算滚动阈值（基于视口高度的百分比）
const getScrollThreshold = () => {
  if (typeof window === "undefined") return 300; // SSR 时返回默认值
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
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
  isClient.value = true;
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
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-bg);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-pill);
  cursor: pointer;
  z-index: 999;
  box-shadow: var(--shadow-card);
  /* 动画配置 */
  transition: 
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease,
    visibility 0s 0.4s; /* 关键：隐藏时，visibility 延迟 0.4s 后才生效 */
  
  /* 默认状态（隐藏）：在下方 100px，透明，不可见 */
  transform: translateY(100px);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  
  /* 性能优化 */
  will-change: transform, opacity;
}

.back-to-top.visible {
  /* 显示状态：回到原位，不透明，可见 */
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  
  /* 显示时：visibility 立即生效（无延迟） */
  transition: 
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease,
    visibility 0s 0s; 
}

.back-to-top:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.back-to-top.visible:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  box-shadow: 0 20px 40px rgba(8, 203, 0, 0.2);
  /* hover 时轻微上移，强化"向上"的语义 */
  transform: translateY(-4px);
  transition: 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.3s ease;
}

.back-to-top.visible:active {
  /* 点击时回到原位置并轻微缩小，提供触觉反馈 */
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
  background-color: var(--color-primary);
  color: var(--color-bg);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.55);
}

.dark .back-to-top:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 20px 40px rgba(74, 222, 128, 0.3);
}
</style>

