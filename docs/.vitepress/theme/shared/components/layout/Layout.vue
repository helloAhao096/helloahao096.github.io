<template>
  <div class="layout-wrapper">
    <Layout>
      <!--  文章标题 大纲  -->
      <template #doc-before>
        <!--  文章标题    -->
        <PostTitle />
        <!--   页面大纲   -->
        <PostOutline />
      </template>

      <!--  github评论；Sponsor 仅在文章页底部展示，about 页面在正文中有自己的章节 -->
      <template #doc-after>
        <!-- <PostPager /> -->
        <div v-if="isPostPage" class="sponsor-divider-wrap">
          <Sponsor />
        </div>
        <Comments />
      </template>
    </Layout>

    <Footer/>

    <MouseEvent/>
    <BackToTop/>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";

import Footer from "./Footer.vue";
import Sponsor from "../../../modules/sponsor/components/Sponsor.vue";
import Comments from "../../../modules/comment/components/Comments.vue";
import PostTitle from "../../../modules/post/components/PostTitle.vue";
import PostOutline from "../../../modules/post/components/PostOutline.vue";
import PostPager from "../../../modules/post/components/PostPager.vue";
import MouseEvent from "../effect/MouseEvent.vue";
import BackToTop from "../effect/BackToTop.vue";

const { page } = useData();
const isPostPage = computed(() =>
  (page.value.relativePath || "").startsWith("posts/")
);

const { Layout } = DefaultTheme;
</script>
<style scoped>
.sponsor-divider-wrap {
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-wrapper > :first-child {
  flex: 1 1 auto;
  min-height: 0;
}

.layout-wrapper > footer {
  flex-shrink: 0;
}
</style>
