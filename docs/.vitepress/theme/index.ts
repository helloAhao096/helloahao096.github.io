import DefaultTheme from "vitepress/theme";
import Layout from "./shared/components/layout/Layout.vue";
import {
  Sponsor,
  SponsorStats,
  SponsorList,
  ExpenseList,
} from "./modules/sponsor";
import Home from "./modules/home/views/Home.vue";
import Gallery from "./views/gallery/Gallery.vue";
import Tools from "./views/tools/Tools.vue";
import PostsOverview from "./modules/post/views/PostsOverview.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 注册全局组件（Sponsor、SponsorStats、SponsorList、ExpenseList 可在 markdown 中使用）
    app.component("Sponsor", Sponsor);
    app.component("SponsorStats", SponsorStats);
    app.component("SponsorList", SponsorList);
    app.component("ExpenseList", ExpenseList);
    app.component("Home", Home);
    app.component("Gallery", Gallery);
    app.component("Tools", Tools);
    app.component("PostsOverview", PostsOverview);
  },
};
