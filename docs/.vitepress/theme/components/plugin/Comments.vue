<template>
  <div class="giscus-container">
    <Giscus v-if="isClient" :key="routeKey" v-bind="giscusProps" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useData } from "vitepress";
import Giscus from "@giscus/vue";
import type { GiscusProps } from "@giscus/vue";
import { GISCUS_CONFIG } from "../../constants";

const { page, isDark } = useData();
const isClient = ref(false);
const routeKey = ref("index");

const currentTheme = computed(() =>
  isDark.value
    ? (GISCUS_CONFIG.themeDark || "transparent_dark")
    : (GISCUS_CONFIG.theme || "light")
);

const giscusProps = computed<GiscusProps>(() => ({
  id: "comments",
  repo: (GISCUS_CONFIG.repo || "owner/repo") as `${string}/${string}`,
  repoId: GISCUS_CONFIG.repoId,
  category: GISCUS_CONFIG.category || undefined,
  categoryId: GISCUS_CONFIG.categoryId || undefined,
  mapping: (GISCUS_CONFIG.mapping || "pathname") as GiscusProps["mapping"],
  strict: GISCUS_CONFIG.strict as GiscusProps["strict"],
  reactionsEnabled: GISCUS_CONFIG.reactionsEnabled as GiscusProps["reactionsEnabled"],
  emitMetadata: GISCUS_CONFIG.emitMetadata as GiscusProps["emitMetadata"],
  inputPosition: (GISCUS_CONFIG.inputPosition || "bottom") as GiscusProps["inputPosition"],
  theme: currentTheme.value as GiscusProps["theme"],
  lang: GISCUS_CONFIG.lang,
  loading: (GISCUS_CONFIG.loading || "lazy") as GiscusProps["loading"],
}));

watch(
  () => page.value.relativePath,
  (path) => {
    routeKey.value = path || "index";
  },
  { immediate: true }
);

onMounted(() => {
  isClient.value = true;
});
</script>

<style scoped>
.giscus-container {
  margin-top: 2rem;
}
</style>
