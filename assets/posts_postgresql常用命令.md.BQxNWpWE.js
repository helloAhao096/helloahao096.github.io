import{_ as a,c as i,o as n,aa as l}from"./chunks/framework.QoKpdLiW.js";const c=JSON.parse('{"title":"postgresql 常用命令","description":"postgresql 常用命令","frontmatter":{"title":"postgresql 常用命令","description":"postgresql 常用命令","date":"2024-07-01T00:00:00.000Z","tags":["linux","sql"]},"headers":[],"relativePath":"posts/postgresql常用命令.md","filePath":"posts/postgresql常用命令.md","lastUpdated":1721285897000}'),p={name:"posts/postgresql常用命令.md"};function t(e,s,h,k,r,d){return n(),i("div",null,[...s[0]||(s[0]=[l(`<blockquote><p>参考资料: <a href="https://www.cnblogs.com/my-blogs-for-everone/p/10226473.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/my-blogs-for-everone/p/10226473.html</a><a href="https://ken.io/note/macos-postgresql-install-and-configuration" target="_blank" rel="noreferrer">https://ken.io/note/macos-postgresql-install-and-configuration</a></p></blockquote><h1 id="mac-命令" tabindex="-1">mac 命令 <a class="header-anchor" href="#mac-命令" aria-label="Permalink to &quot;mac 命令&quot;">​</a></h1><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看服务状态</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">brew</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> services</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> list</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动服务</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">brew</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> services</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgresql</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 连接进入数据库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">psql</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -U</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgres</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # -U 指定用户</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">psql</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgres</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # -d 指定数据库</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 重启服务（brew安装）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">brew</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> services</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postgresql@15</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 重启服务（dmg安装，通过-D指定数据目录）</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pg_ctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -D</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /Library/PostgreSQL/15/data</span></span></code></pre></div><h1 id="postgresql-操作命令" tabindex="-1">postgresql 操作命令 <a class="header-anchor" href="#postgresql-操作命令" aria-label="Permalink to &quot;postgresql 操作命令&quot;">​</a></h1><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看所有用户</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\du</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看所有数据库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\l</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 切换当前数据库</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {dbname}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看当前库下所有的表</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\dt</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看指定表</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {tablename}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看数据目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">SHOW</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> data_directory</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 退出psql</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\q</span></span></code></pre></div>`,5)])])}const g=a(p,[["render",t]]);export{c as __pageData,g as default};
