<template>
  <PageContainer>
    <Hero />
    <Greeting />
    <HomePostList />
  </PageContainer>
</template>

<script lang="ts" setup>
import PageContainer from "../../components/layout/PageContainer.vue";
import Hero from "../../components/home/Hero.vue";
import Greeting from "../../components/home/Greeting.vue";
import HomePostList from "../../components/home/HomePostList.vue";
</script>

<style scoped>
/* 主页样式已在各个子组件中定义 */
</style>

