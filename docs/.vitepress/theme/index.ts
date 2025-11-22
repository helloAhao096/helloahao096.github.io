import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import Home from "./views/home/Home.vue";
import Gallery from "./views/gallery/Gallery.vue";
import Tools from "./views/tools/Tools.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件
    app.component("Home", Home);
    app.component("Gallery", Gallery);
    app.component("Tools", Tools);
  },
};
