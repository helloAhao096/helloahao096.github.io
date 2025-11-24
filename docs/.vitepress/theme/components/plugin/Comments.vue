<template>
  <div id="gitalk-container"></div>
</template>
<script lang="ts" setup>
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { useData } from "vitepress";
import { GITALK_CONFIG } from "../../constants";

const { page } = useData();
const gitalkInstance = ref<Gitalk | null>(null);
const containerId = "gitalk-container";

// 生成页面唯一标识
function getPageId(): string {
  // 优先使用 VitePress 的页面路径
  const path = page.value.relativePath || location.pathname;
  // 移除文件扩展名，将路径中的斜杠替换为横杠，作为唯一标识
  let id = path.replace(/\.md$/, "").replace(/\//g, "-");
  // 如果路径为空或者是首页，使用默认值
  if (!id || id === "-" || id === "index") {
    id = "index";
  }
  // Gitalk 要求 id 长度必须小于50
  return id.length > 50 ? id.substring(0, 50) : id;
}

// 销毁 Gitalk 实例
function destroyGitalk() {
  if (gitalkInstance.value) {
    // 清空容器内容
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = "";
    }
    gitalkInstance.value = null;
  }
}

// 初始化 Gitalk
function initGitalk() {
  // 先销毁旧的实例
  destroyGitalk();

  // 等待 DOM 更新
  nextTick(() => {
    const pageId = getPageId();
    
    // 获取页面标题和描述
    const pageTitle = page.value.title || document.title;
    const pageDescription = page.value.description || '';
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    const gitalk = new Gitalk({
      clientID: GITALK_CONFIG.clientID,
      clientSecret: GITALK_CONFIG.clientSecret,
      repo: GITALK_CONFIG.repo,
      owner: GITALK_CONFIG.owner,
      admin: [...GITALK_CONFIG.admin],
      id: pageId,
      title: pageTitle,
      body: pageDescription ? `${pageDescription}\n\n${pageUrl}` : pageUrl,
      labels: [...GITALK_CONFIG.labels],
      language: GITALK_CONFIG.language,
      distractionFreeMode: GITALK_CONFIG.distractionFreeMode,
      createIssueManually: GITALK_CONFIG.createIssueManually,
      perPage: GITALK_CONFIG.perPage,
    });

    gitalk.render(containerId);
    gitalkInstance.value = gitalk;
  });
}

// 监听页面路径变化
watch(
  () => page.value.relativePath,
  () => {
    initGitalk();
  },
  { immediate: false }
);

onMounted(() => {
  initGitalk();
});

onUnmounted(() => {
  destroyGitalk();
});
</script>
<style scoped>
</style>
