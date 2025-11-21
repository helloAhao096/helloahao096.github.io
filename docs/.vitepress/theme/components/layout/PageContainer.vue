<template>
  <div class="page-container">
    <slot />
  </div>
</template>

<script lang="ts" setup>
// 统一页面容器组件
// 提供统一的页面布局、间距和响应式支持
</script>

<style scoped>
.page-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

/* 平板适配 */
@media (min-width: 640px) {
  .page-container {
    padding: 2rem 1.5rem;
  }
}

/* 桌面端适配 */
@media (min-width: 1024px) {
  .page-container {
    padding: 3rem 2.5rem;
  }
}
</style>

