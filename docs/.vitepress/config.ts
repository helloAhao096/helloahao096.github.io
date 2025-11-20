import {getPosts, getPostLength} from "./theme/utils/posts";
// import {buildBlogRSS} from "./theme/rss";


async function config() {
    return {
        lang: "zh-CN",
        title: "Ahao",
        base:"/",
        description: "Home of Ahao",
        appearance: true, // 启用主题切换，支持明暗主题切换和自动跟随系统主题
        // editLinks: true,
        // SEO优化配置  配置 网页 head 标签
        head: [
            ["link", {rel: "icon", type: "image/svg", href: "/horse.svg",},],
            ['meta', {name: 'referrer', content: 'no-referrer-when-downgrade'}],
            ["meta", {name: "author", content: "Ahao",},],
            ["meta", {property: "og:title", content: "Home",},],
            ["meta", {property: "og:description", content: "Home of Ahao",},],
        ],
        cleanUrls: "with-subfolders", // 启用 clean URLs，去掉 .html 后缀
        lastUpdated: true,
        // https://juejin.cn/post/7042206108458909727
        themeConfig: {
            // repo: "clark-cui/homeSite",
            logo: "/horse.svg",
            // 项目
            // docsDir: "/",
            // docsBranch: "master",
            // 这里配置的数据通过useData获取，等于是全局的变量
            posts: await getPosts(),
            pageSize: 5,
            postLength: await getPostLength(),
            // search: true,
            nav: [
                {
                    text: "🏡 首页",
                    link: "/",
                },
                {
                    text: "📸 照片",
                    link: "/gallery",
                },
                {
                    text: "🛠️ 工具箱",
                    link: "/tools",
                },
                {
                    text: "👤 关于",
                    link: "/about",
                },
            ],
            socialLinks: [
                {icon: "github", link: "https://github.com/helloAhao096"},
                {
                    icon: {
                        svg: `<svg role="img" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20">
            <path d="M874.666667 375.189333V746.666667a64 64 0 0 1-64 64H213.333333a64 64 0 0 1-64-64V375.189333l266.090667 225.6a149.333333 149.333333 0 0 0 193.152 0L874.666667 375.189333zM810.666667 213.333333a64.789333 64.789333 0 0 1 22.826666 4.181334 63.616 63.616 0 0 1 26.794667 19.413333 64.32 64.32 0 0 1 9.344 15.466667c2.773333 6.570667 4.48 13.696 4.906667 21.184L874.666667 277.333333v21.333334L553.536 572.586667a64 64 0 0 1-79.893333 2.538666l-3.178667-2.56L149.333333 298.666667v-21.333334a63.786667 63.786667 0 0 1 35.136-57.130666A63.872 63.872 0 0 1 213.333333 213.333333h597.333334z" ></path>
            </svg>`,
                    },
                    link: "mailto:helloahao@icloud.com",
                },
            ],
        },
        // buildEnd: buildBlogRSS,
    };
}

export default config();
