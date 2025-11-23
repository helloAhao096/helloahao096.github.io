<template>
  <div class="hero">
    <div class="pic"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(async () => {
  if (typeof window === "undefined") {
    return;
  }

  const { default: lottie } = await import("lottie-web");

  // storage lottie
  const svgContainer = document.getElementById("svgContainer");
  if (svgContainer) {
    return;
  }
  // created insertNode and add style
  const insertNode = document.createElement("div");
  insertNode.id = "svgContainer";
  insertNode.style.width = "300px";
  insertNode.style.margin = "0 auto";
  const pic = document.getElementsByClassName("pic")[0];
  pic.appendChild(insertNode);
  // created lottie
  const animItem = lottie.loadAnimation({
    container: insertNode,
    renderer: "svg",
    loop: true,
    path: "https://labs.nearpod.com/bodymovin/demo/markus/isometric/markus2.json",
  });
});
</script>

<style scoped>
.hero {
  text-align: center;
  height: 300px;
  margin-bottom: 2rem;
}

.pic {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .hero {
    height: 200px;
    margin-bottom: 1.5rem;
  }
  
  #svgContainer {
    width: 200px !important;
  }
}
</style>

