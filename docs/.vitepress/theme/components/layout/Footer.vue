<template>
  <footer>
    <Counter/>
    Powered by
    <a href="https://github.com/helloQianFan" target="_blank" title="作者">
      Ahao
    </a>

    | Theme By
    <a href="https://github.com/clark-cui/vitepress-blog-zaun" target="_blank" title="作者">
      Clark cui
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
  position: absolute;
  width: 100%;
  bottom: 20px;
  padding: 0 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
a {
  color: var(--vp-c-brand);
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: var(--vp-c-hover);
}
</style>
