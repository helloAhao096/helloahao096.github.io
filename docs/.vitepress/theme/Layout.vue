<template>
  <div class="layout-wrapper">
    <Layout>
      <!--  文章标题 小结  -->
      <template #doc-before>
        <!--  文章标题    -->
        <PostTitle/>
        <!--   段落小结   -->
        <PostCategory/>
      </template>

      <!--  github评论   -->
      <template #doc-after>
        <Comments />
      </template>
    </Layout>

    <Footer/>

    <MouseEvent/>
  </div>
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";

import Footer from "./components/layout/Footer.vue";
import Comments from "./components/plugin/Comments.vue";
import PostCategory from "./components/post/PostCategory.vue";
import PostTitle from "./components/post/PostTitle.vue";
import MouseEvent from "./components/effect/MouseEvent.vue";

const {Layout} = DefaultTheme;
</script>
<style scoped>
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

