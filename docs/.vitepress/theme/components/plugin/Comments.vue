<template>
  <div id="gitalk-container"></div>
</template>
<script lang="ts" setup>
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";
import { onMounted } from "vue";
import { useData } from "vitepress";

const { page } = useData();

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

onMounted(() => {
  const pageId = getPageId();
  
  // 获取页面标题和描述
  const pageTitle = page.value.title || document.title;
  const pageDescription = page.value.description || '';
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const gitalk = new Gitalk({
    clientID: "53f859bc548f68175265",
    clientSecret: "73f528b5f57c8ca681785d711ee9904f197671ec",
    repo: "blog-comments",
    owner: "helloAhao096", // github仓库用户名
    admin: ["helloAhao096"], // 可以初始化插件的用户（注意：用户名必须完全匹配，包括大小写）
    id: pageId, // 使用页面路径作为唯一标识
    title: pageTitle, // GitHub issue 的标题
    body: pageDescription ? `${pageDescription}\n\n${pageUrl}` : pageUrl, // GitHub issue 的内容
    labels: ["Gitalk", "评论"], // GitHub issue 的标签
    language: "zh-CN",
    distractionFreeMode: true, // Facebook-like distraction free mode
    createIssueManually: false, // 自动创建 issue（如果为 true，需要手动点击 init 按钮）
    perPage: 10, // 每次加载的评论数量
  });

  gitalk.render("gitalk-container");
});
</script>
<style scoped>
</style>

