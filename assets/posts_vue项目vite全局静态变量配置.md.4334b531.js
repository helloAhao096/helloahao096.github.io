import{_ as s,o as e,c as a,Q as n}from"./chunks/framework.676e9b8e.js";const u=JSON.parse('{"title":"vue项目vite全局静态变量配置","description":"vue项目vite全局静态变量配置","frontmatter":{"title":"vue项目vite全局静态变量配置","description":"vue项目vite全局静态变量配置","date":"2024-05-10T00:00:00.000Z","tags":["vue","vite"]},"headers":[],"relativePath":"posts/vue项目vite全局静态变量配置.md","filePath":"posts/vue项目vite全局静态变量配置.md","lastUpdated":1715308316000}'),o={name:"posts/vue项目vite全局静态变量配置.md"},t=n(`<blockquote><p>参考文档</p><ol><li><a href="https://cn.vitejs.dev/guide/env-and-mode" target="_blank" rel="noreferrer">https://cn.vitejs.dev/guide/env-and-mode</a></li></ol></blockquote><h1 id="全局环境变量" tabindex="-1">全局环境变量 <a class="header-anchor" href="#全局环境变量" aria-label="Permalink to &quot;全局环境变量&quot;">​</a></h1><p>.env**文件在项目对根目录创建，vite可以正常读取并且加载</p><div class="language-Bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Bash</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">.env</span><span style="color:#E1E4E8;">                </span><span style="color:#6A737D;"># 所有情况下都会加载</span></span>
<span class="line"><span style="color:#B392F0;">.env.local</span><span style="color:#E1E4E8;">          </span><span style="color:#6A737D;"># 所有情况下都会加载，但会被 git 忽略</span></span>
<span class="line"><span style="color:#B392F0;">.env.[mode]</span><span style="color:#E1E4E8;">         </span><span style="color:#6A737D;"># 只在指定模式下加载</span></span>
<span class="line"><span style="color:#B392F0;">.env.[mode].local</span><span style="color:#E1E4E8;">   </span><span style="color:#6A737D;"># 只在指定模式下加载，但会被 git 忽略</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">.env</span><span style="color:#24292E;">                </span><span style="color:#6A737D;"># 所有情况下都会加载</span></span>
<span class="line"><span style="color:#6F42C1;">.env.local</span><span style="color:#24292E;">          </span><span style="color:#6A737D;"># 所有情况下都会加载，但会被 git 忽略</span></span>
<span class="line"><span style="color:#6F42C1;">.env.[mode]</span><span style="color:#24292E;">         </span><span style="color:#6A737D;"># 只在指定模式下加载</span></span>
<span class="line"><span style="color:#6F42C1;">.env.[mode].local</span><span style="color:#24292E;">   </span><span style="color:#6A737D;"># 只在指定模式下加载，但会被 git 忽略</span></span></code></pre></div>`,4),l=[t];function p(c,r,i,d,v,_){return e(),a("div",null,l)}const h=s(o,[["render",p]]);export{u as __pageData,h as default};
