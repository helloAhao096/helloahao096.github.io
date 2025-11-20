<template>
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
</template>
<script lang="ts" setup>
import DefaultTheme from "vitepress/theme";

import Footer from "./components/layout/Footer.vue";
import Comments from "./components/plugin/Comments.vue";
import PostCategory from "./components/blog/PostCategory.vue";
import PostTitle from "./components/blog/PostTitle.vue";
import MouseEvent from "./components/effect/MouseEvent.vue";

const {Layout} = DefaultTheme;
</script>
<style scoped></style>

