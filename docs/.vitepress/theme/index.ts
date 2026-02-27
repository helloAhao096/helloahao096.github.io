import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import Sponsor from "./components/Sponsor.vue";
import SponsorStats from "./components/SponsorStats.vue";
import SponsorList from "./components/SponsorList.vue";
import ExpenseList from "./components/ExpenseList.vue";
import Home from "./views/home/Home.vue";
import Gallery from "./views/gallery/Gallery.vue";
import Tools from "./views/tools/Tools.vue";
import PostsOverview from "./views/posts/PostsOverview.vue";
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
