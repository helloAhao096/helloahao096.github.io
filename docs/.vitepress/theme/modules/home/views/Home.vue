<template>
  <PageContainer>
    <Hero />
    <Greeting />
    <HomePostList />
  </PageContainer>
</template>

<script lang="ts" setup>
import PageContainer from "../../../shared/components/layout/PageContainer.vue";
import Hero from "../components/Hero.vue";
import Greeting from "../components/Greeting.vue";
import HomePostList from "../components/HomePostList.vue";
</script>

<style scoped>
/* 主页样式已在各个子组件中定义 */
</style>
