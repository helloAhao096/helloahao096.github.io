<template>

</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
  if (typeof window === "undefined") {
    return;
  }
  const isMobile = /AppleWebKit.*Mobile.*/.test(navigator.userAgent);
  if (isMobile) {
    return;
  }

  const CursorEffects = await import("cursor-effects");
  new CursorEffects.rainbowCursor({
    length: 8,
    colors: [
      "#FE0000",
      "#FD8C00",
      "#FFE500",
      "#119F0B",
      "#0644B3",
      "#C22EDC",
    ],
    size: 3,
  });
});
</script>

<style scoped>

</style>
