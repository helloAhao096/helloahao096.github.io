import {resolve} from "node:path";
import {getPosts, getPostLength, generateSidebarFromPosts} from "./theme/utils/posts";
import type {UserConfig} from "vitepress";
// import {buildBlogRSS} from "./theme/rss";


async function config() {
    // 动态导入 ESM 插件，避免 esbuild 在加载配置时使用 require
    const {withMermaid} = await import("vitepress-plugin-mermaid");

    // 获取所有文章数据
    const posts = await getPosts();
    
    // 生成 sidebar 配置
    const sidebarConfig = generateSidebarFromPosts(posts);
    
    // 调试：输出 sidebar 配置信息
    console.log('Sidebar 配置生成完成，共', sidebarConfig.length, '个年份分组');
    if (sidebarConfig.length > 0) {
        console.log('第一个年份分组:', sidebarConfig[0].text, '包含', sidebarConfig[0].items.length, '篇文章');
        if (sidebarConfig[0].items.length > 0) {
            console.log('示例文章链接:', sidebarConfig[0].items[0].link);
        }
    }

    const baseConfig: UserConfig = {
        lang: "zh-CN",
        title: "QianFan",
        base:"/",
        description: "Home of QianFan",
        appearance: true, // 启用主题切换，支持明暗主题切换和自动跟随系统主题
        // editLinks: true,
        // SEO优化配置  配置 网页 head 标签
        head: [
            ["link", {rel: "icon", type: "image/jpg", href: "/QianFan.jpg",},],
            ['meta', {name: 'referrer', content: 'no-referrer-when-downgrade'}],
            ["meta", {name: "author", content: "QianFan",},],
            ["meta", {property: "og:title", content: "Home",},],
            ["meta", {property: "og:description", content: "Home of QianFan",},],

        ],
        cleanUrls: "with-subfolders" as any, // 启用 clean URLs，去掉 .html 后缀
        lastUpdated: true,
        // https://juejin.cn/post/7042206108458909727
        themeConfig: {
            // repo: "clark-cui/homeSite",
            logo: "/QianFan.jpg",
            lastUpdated: {
                text: "最后更新时间",
            },
            docFooter: {
                prev: '上一篇',
                next: '下一篇',
              },
            // 页面大纲配置（右侧 aside）
            outline: {
                level: [2, 6], // 显示从 h2 到 h6 的所有标题
                label: "本页目录", // 汉化 aside 标题
            },
            // Sidebar 配置 - 使用对象形式进行路径匹配
            // 根据官方文档：https://vitepress.dev/reference/default-theme-sidebar#sidebar
            sidebar: {
                // 匹配 /posts/ 下的所有页面（包括详情页）
                // 注意：这也会匹配 /posts/ 列表页，需要在列表页的 frontmatter 中设置 sidebar: false
                '/posts/': sidebarConfig,
            },
            // 项目
            // docsDir: "/",
            // docsBranch: "master",
            // 这里配置的数据通过useData获取，等于是全局的变量
            posts: posts,
            pageSize: 5,
            postLength: await getPostLength(),
            // search: true,
            nav: [
                {
                    text: "🏡 首页",
                    link: "/",
                    activeMatch: "^/$",
                },
                {
                    text: "📚 博客",
                    link: "/posts/",
                    activeMatch: "^/posts/",
                },
                // {
                //     text: "📸 照片",
                //     link: "/gallery",
                //     activeMatch: "^/gallery",
                // },
                // {
                //     text: "🛠️ 工具箱",
                //     link: "/tools",
                //     activeMatch: "^/tools",
                // },
                {
                    text: "👤 关于",
                    link: "/about",
                    activeMatch: "^/about",
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
        // 开发服务器配置，允许局域网访问
        vite: {
            publicDir: resolve(__dirname, "../public"),
            server: {
                host: '0.0.0.0', // 允许局域网访问
                port: 5173, // 指定端口
            },
            optimizeDeps: {
                // Mermaid 依赖的 ESM 包需要提前预构建
                include: [
                    "mermaid",
                    "@braintree/sanitize-url",
                    "cytoscape",
                    "cytoscape-cose-bilkent",
                    "debug",
                ],
            },
            ssr: {
                // 将相关依赖标记为内部打包，避免 SSR 阶段 require 失败
                noExternal: [
                    "vitepress-plugin-mermaid",
                    "mermaid",
                    "@braintree/sanitize-url",
                ],
            },
        },
    };
    
    // 使用 withMermaid 包装配置以启用 Mermaid 支持
    return withMermaid(baseConfig);
}

export default config();
