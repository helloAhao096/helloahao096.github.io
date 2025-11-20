<template>
  <PageContainer>
    <Profile />
    <Skills />
    <Timeline />
  </PageContainer>
</template>

<script lang="ts" setup>
import PageContainer from "../../components/layout/PageContainer.vue";
import Profile from "../../components/about/Profile.vue";
import Skills from "../../components/about/Skills.vue";
import Timeline from "../../components/about/Timeline.vue";
</script>

<style scoped>
/* 关于我页面样式已在各个子组件中定义 */
</style>

