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
  
  const gitalk = new Gitalk({
    clientID: "53f859bc548f68175265",
    clientSecret: "73f528b5f57c8ca681785d711ee9904f197671ec",
    repo: "blog-comments",
    owner: "helloAhao096", // github仓库用户名
    admin: ["helloAhao096"], // 可以初始化插件的用户
    id: pageId, // 使用页面路径作为唯一标识
    language: "zh-CN",
    distractionFreeMode: true, // Facebook-like distraction free mode
  });

  gitalk.render("gitalk-container");
});
</script>
<style scoped>
</style>

