<template>
  <footer>
    <Counter/>
    Powered by
    <a href="https://github.com/helloAhao096" target="_blank" title="作者">
      QianFan
    </a>

    | Copyright © 2023.3.6-{{ date }} | MIT License
  </footer>
</template>
<script lang="ts" setup>
import Counter from "../effect/Counter.vue";

const date = new Date().getFullYear();
</script>
<style scoped>
footer {
  text-align: center;
  padding: 1.5rem 20px;
  margin-top: 2rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  flex-shrink: 0;
}
a {
  color: var(--vp-c-brand);
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: var(--vp-c-hover);
}

/* 移动端适配 */
@media (max-width: 640px) {
  footer {
    padding: 1rem 20px;
    margin-top: 1.5rem;
  }
}
</style>
