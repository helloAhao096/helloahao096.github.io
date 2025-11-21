<template>
  <h1 class="title">{{ title }}</h1>

  <div class="tags">
    <svg
        t="1641783753540"
        class="fas-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1254"
        :style="{
          width: '20px',
        }"
    >
      <path
          d="M995.126867 592.38l-360.08 360.08a53.333333 53.333333 0 0 1-71.333334 3.68l356.22-356.22a64 64 0 0 0 0-90.506667L495.8402 85.333333h45.573333a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667z m-128 0l-360.08 360.08a53.333333 53.333333 0 0 1-75.426667 0l-416-416A52.986667 52.986667 0 0 1 0.0002 498.746667V138.666667a53.393333 53.393333 0 0 1 53.333333-53.333334h360.08a52.986667 52.986667 0 0 1 37.713334 15.62l416 416a53.4 53.4 0 0 1 0 75.426667zM341.333533 341.333333a85.333333 85.333333 0 1 0-85.333333 85.333334 85.426667 85.426667 0 0 0 85.333333-85.333334z"
          fill="var(--vp-c-brand)"
          p-id="1255"
      ></path>
    </svg>
    Tags:
  </div>

  <div class="tag-box">
    <span class="tag"
       v-for="tag in frontmatter.tags"
       :key="tag">
      {{ tag }}
    </span>
  </div>

  <div class="date">🕒 Published at: {{ publishDate }}</div>

<!--   <div class="description">{{ description }}</div>-->
</template>
<script lang="ts" setup>
import { useData } from "vitepress";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { PageData } from "../../types";

const pageData: PageData = useData().page.value;
const { title, description, lastUpdated, frontmatter } = pageData;
dayjs.extend(relativeTime);

// 计算发布时间
const publishDate = dayjs().to(dayjs(frontmatter.date || Date.now()));
</script>
<style scoped>
.title {
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 2.25em;
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  line-height: 1.3;
  font-family: Dosis, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji";
}
.fas-icon {
  /*width: 1rem;*/
  /*height: 1rem;*/
}

.tags {
  margin: 1rem 0 ;
  display: inline-block;

}

.tag-box {
  display: inline-block;
}

.tag {
  margin: 0 1rem;
  padding: 0 0.2rem;
  background: var(--vp-c-bg);
  box-shadow: 6px 6px var(--vp-c-brand);
  border: 4px solid var(--vp-c-border);
  color: var(--vp-c-brand-light);
  overflow-y: auto;
  display: inline-block;
}


.date {
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-bottom: 1em;
  padding-bottom: 1em;
  border-bottom: 1px dashed #c7c7c7;
}
</style>
