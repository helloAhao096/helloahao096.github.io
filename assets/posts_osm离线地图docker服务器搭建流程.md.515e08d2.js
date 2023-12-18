import{_ as s,o as a,c as n,Q as l}from"./chunks/framework.676e9b8e.js";const u=JSON.parse('{"title":"osm离线地图docker服务器搭建流程","description":"osm离线地图docker服务器搭建流程","frontmatter":{"title":"osm离线地图docker服务器搭建流程","description":"osm离线地图docker服务器搭建流程","date":"2023-12-07T00:00:00.000Z","tags":["linux","docker","map"]},"headers":[],"relativePath":"posts/osm离线地图docker服务器搭建流程.md","filePath":"posts/osm离线地图docker服务器搭建流程.md","lastUpdated":1702879232000}'),o={name:"posts/osm离线地图docker服务器搭建流程.md"},p=l(`<h1 id="安装docker" tabindex="-1">安装docker <a class="header-anchor" href="#安装docker" aria-label="Permalink to &quot;安装docker&quot;">​</a></h1><blockquote><p>参考资料:</p><ol><li><a href="https://docs.docker.com/engine/install/ubuntu/" target="_blank" rel="noreferrer">https://docs.docker.com/engine/install/ubuntu/</a></li><li><a href="https://www.runoob.com/docker/ubuntu-docker-install.html" target="_blank" rel="noreferrer">https://www.runoob.com/docker/ubuntu-docker-install.html</a></li><li>一键部署脚本的源代码在 docker-install 仓库中。 不建议在生产环境中使用这些脚本 <a href="https://get.docker.com/" target="_blank" rel="noreferrer">https://get.docker.com/</a></li><li><a href="https://www.wbolt.com/install-docker-ubuntu.html" target="_blank" rel="noreferrer">https://www.wbolt.com/install-docker-ubuntu.html</a></li></ol></blockquote><ul><li>一键部署脚本</li></ul><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-fsSL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://get.docker.com</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-o</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">get-docker.sh</span></span>
<span class="line"><span style="color:#6A737D;">#以root权限运行脚本</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">sh</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">get-docker.sh</span></span>
<span class="line"><span style="color:#B392F0;">Executing</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">script</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-fsSL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://get.docker.com</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-o</span><span style="color:#24292E;"> </span><span style="color:#032F62;">get-docker.sh</span></span>
<span class="line"><span style="color:#6A737D;">#以root权限运行脚本</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">sh</span><span style="color:#24292E;"> </span><span style="color:#032F62;">get-docker.sh</span></span>
<span class="line"><span style="color:#6F42C1;">Executing</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span><span style="color:#24292E;"> </span><span style="color:#032F62;">script</span></span></code></pre></div><ol><li>更新ubuntu系统的软件包、安装apt依赖<div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;"># Add Docker&#39;s official GPG key:</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">apt-get</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">update</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">apt-get</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">ca-certificates</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">gnupg</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-m</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">0755</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/etc/apt/keyrings</span></span>
<span class="line"><span style="color:#B392F0;">curl</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-fsSL</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://download.docker.com/linux/ubuntu/gpg</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">gpg</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">--dearmor</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-o</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">chmod</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">a+r</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span></span>
<span class="line"><span style="color:#6A737D;"># Add the repository to Apt sources:</span></span>
<span class="line"><span style="color:#79B8FF;">echo</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&quot;deb [arch=$(</span><span style="color:#B392F0;">dpkg</span><span style="color:#9ECBFF;"> </span><span style="color:#79B8FF;">--print-architecture</span><span style="color:#9ECBFF;">) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#9ECBFF;">  $(</span><span style="color:#79B8FF;">.</span><span style="color:#9ECBFF;"> /etc/os-release &amp;&amp; </span><span style="color:#79B8FF;">echo</span><span style="color:#9ECBFF;"> &quot;</span><span style="color:#E1E4E8;">$VERSION_CODENAME</span><span style="color:#9ECBFF;">&quot;) stable&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">tee</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/etc/apt/sources.list.d/docker.list</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">/dev/null</span></span>
<span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">apt-get</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">update</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;"># Add Docker&#39;s official GPG key:</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">apt-get</span><span style="color:#24292E;"> </span><span style="color:#032F62;">update</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">apt-get</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span><span style="color:#24292E;"> </span><span style="color:#032F62;">ca-certificates</span><span style="color:#24292E;"> </span><span style="color:#032F62;">curl</span><span style="color:#24292E;"> </span><span style="color:#032F62;">gnupg</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-m</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">0755</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-d</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/etc/apt/keyrings</span></span>
<span class="line"><span style="color:#6F42C1;">curl</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-fsSL</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://download.docker.com/linux/ubuntu/gpg</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">gpg</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--dearmor</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-o</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">chmod</span><span style="color:#24292E;"> </span><span style="color:#032F62;">a+r</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/etc/apt/keyrings/docker.gpg</span></span>
<span class="line"><span style="color:#24292E;">  </span></span>
<span class="line"><span style="color:#6A737D;"># Add the repository to Apt sources:</span></span>
<span class="line"><span style="color:#005CC5;">echo</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&quot;deb [arch=$(</span><span style="color:#6F42C1;">dpkg</span><span style="color:#032F62;"> </span><span style="color:#005CC5;">--print-architecture</span><span style="color:#032F62;">) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#032F62;">  $(</span><span style="color:#005CC5;">.</span><span style="color:#032F62;"> /etc/os-release &amp;&amp; </span><span style="color:#005CC5;">echo</span><span style="color:#032F62;"> &quot;</span><span style="color:#24292E;">$VERSION_CODENAME</span><span style="color:#032F62;">&quot;) stable&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">tee</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/etc/apt/sources.list.d/docker.list</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#032F62;">/dev/null</span></span>
<span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">apt-get</span><span style="color:#24292E;"> </span><span style="color:#032F62;">update</span></span></code></pre></div></li><li>安装最新的docker版本<div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">sudo</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">apt-get</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker-ce</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker-ce-cli</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">containerd.io</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker-buildx-plugin</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">docker-compose-plugin</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">sudo</span><span style="color:#24292E;"> </span><span style="color:#032F62;">apt-get</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker-ce</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker-ce-cli</span><span style="color:#24292E;"> </span><span style="color:#032F62;">containerd.io</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker-buildx-plugin</span><span style="color:#24292E;"> </span><span style="color:#032F62;">docker-compose-plugin</span></span></code></pre></div></li><li>检测docker是否安装成功<div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">sudo systemctl status docker</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">sudo systemctl status docker</span></span></code></pre></div></li></ol><h1 id="配置docker的网络代理" tabindex="-1">配置docker的网络代理 <a class="header-anchor" href="#配置docker的网络代理" aria-label="Permalink to &quot;配置docker的网络代理&quot;">​</a></h1><p>因为地图数据服务器在外网，下载得特别慢，需要配置代理</p><p>TIPS:</p><ol><li>如果是需要通过 本机(windows)主机 -&gt; 使用ssh连接本地局域网的linux主机 -&gt; 再进入docker的容器，来连接网络代理的话，可以先去容器里试试直接ping(windows)主机，如果能ping通，就直接配置局域网里的ip就行</li><li>如果要连接使用 (windows)主机的网络代理，记得把window的局域网防火墙关掉，不然也用不了</li></ol><blockquote><p>参考资料：</p><ol><li><a href="https://www.cnblogs.com/abc1069/p/17496240.html" target="_blank" rel="noreferrer">https://www.cnblogs.com/abc1069/p/17496240.html</a></li><li><a href="https://www.zdkteam.com/archives/docker-rong-qi-nei-shi-yong-su-zhu-ji-de-dai-li-pei-zhi" target="_blank" rel="noreferrer">https://www.zdkteam.com/archives/docker-rong-qi-nei-shi-yong-su-zhu-ji-de-dai-li-pei-zhi</a></li><li><a href="https://docs.docker.com/network/proxy/#use-environment-variables" target="_blank" rel="noreferrer">https://docs.docker.com/network/proxy/#use-environment-variables</a></li><li><a href="https://kebingzao.com/2019/02/22/docker-container-proxy/" target="_blank" rel="noreferrer">https://kebingzao.com/2019/02/22/docker-container-proxy/</a></li><li><a href="https://neucrack.com/p/286" target="_blank" rel="noreferrer">https://neucrack.com/p/286</a></li><li><a href="https://blog.csdn.net/lxr1908/article/details/132487243" target="_blank" rel="noreferrer">https://blog.csdn.net/lxr1908/article/details/132487243</a></li><li><a href="https://cn.linux-console.net/?p=21489" target="_blank" rel="noreferrer">https://cn.linux-console.net/?p=21489</a></li></ol></blockquote><ol><li><p>设置宿主机(本机)的docker国内镜像</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">#在/etc/docker/daemon.json文件中加入</span></span>
<span class="line"><span style="color:#6A737D;"># 国内有些镜像的源已经失效，这些是暂时还可以使用的镜像</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">&quot;registry-mirrors&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#E1E4E8;"> [</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">&quot;https://registry.hub.docker.com&quot;</span><span style="color:#B392F0;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">&quot;http://hub-mirror.c.163.com&quot;</span><span style="color:#B392F0;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">&quot;https://mirror.baidubce.com&quot;</span><span style="color:#B392F0;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">&quot;https://docker.mirrors.sjtug.sjtu.edu.cn&quot;</span><span style="color:#B392F0;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#B392F0;">&quot;https://docker.nju.edu.cn&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">    ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">#在/etc/docker/daemon.json文件中加入</span></span>
<span class="line"><span style="color:#6A737D;"># 国内有些镜像的源已经失效，这些是暂时还可以使用的镜像</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">&quot;registry-mirrors&quot;</span><span style="color:#005CC5;">:</span><span style="color:#24292E;"> [</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">&quot;https://registry.hub.docker.com&quot;</span><span style="color:#6F42C1;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">&quot;http://hub-mirror.c.163.com&quot;</span><span style="color:#6F42C1;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">&quot;https://mirror.baidubce.com&quot;</span><span style="color:#6F42C1;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">&quot;https://docker.mirrors.sjtug.sjtu.edu.cn&quot;</span><span style="color:#6F42C1;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6F42C1;">&quot;https://docker.nju.edu.cn&quot;</span></span>
<span class="line"><span style="color:#24292E;">    ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div></li><li><p>设置docker中容器的代理服务器</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;"># vi ~/.docker/config.json (没有的话就创建这个路径和文件，代理服务器需要替换成自己搭建的vpn地址</span></span>
<span class="line"><span style="color:#6A737D;"># 先试试容器里ping代理的网络通不通，再根据具体情况配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">&quot;proxies&quot;</span><span style="color:#79B8FF;">:</span></span>
<span class="line"><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">   </span><span style="color:#B392F0;">&quot;default&quot;</span><span style="color:#79B8FF;">:</span></span>
<span class="line"><span style="color:#E1E4E8;">   {</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#B392F0;">&quot;httpProxy&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;http://example.com:port&quot;,</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#B392F0;">&quot;httpsProxy&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;http://example.com:port&quot;,</span></span>
<span class="line"><span style="color:#E1E4E8;">     </span><span style="color:#B392F0;">&quot;noProxy&quot;</span><span style="color:#79B8FF;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;localhost,127.0.0.1,.daocloud.io&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">   }</span></span>
<span class="line"><span style="color:#E1E4E8;"> }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;"># vi ~/.docker/config.json (没有的话就创建这个路径和文件，代理服务器需要替换成自己搭建的vpn地址</span></span>
<span class="line"><span style="color:#6A737D;"># 先试试容器里ping代理的网络通不通，再根据具体情况配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;"> </span><span style="color:#6F42C1;">&quot;proxies&quot;</span><span style="color:#005CC5;">:</span></span>
<span class="line"><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">   </span><span style="color:#6F42C1;">&quot;default&quot;</span><span style="color:#005CC5;">:</span></span>
<span class="line"><span style="color:#24292E;">   {</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#6F42C1;">&quot;httpProxy&quot;</span><span style="color:#005CC5;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;http://example.com:port&quot;,</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#6F42C1;">&quot;httpsProxy&quot;</span><span style="color:#005CC5;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;http://example.com:port&quot;,</span></span>
<span class="line"><span style="color:#24292E;">     </span><span style="color:#6F42C1;">&quot;noProxy&quot;</span><span style="color:#005CC5;">:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;localhost,127.0.0.1,.daocloud.io&quot;</span></span>
<span class="line"><span style="color:#24292E;">   }</span></span>
<span class="line"><span style="color:#24292E;"> }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div></li></ol><h1 id="安装osm离线地图服务-openstreetmap-tile-server" tabindex="-1">安装osm离线地图服务(openstreetmap-tile-server) <a class="header-anchor" href="#安装osm离线地图服务-openstreetmap-tile-server" aria-label="Permalink to &quot;安装osm离线地图服务(openstreetmap-tile-server)&quot;">​</a></h1><blockquote><p>参考资料:</p><ol><li><a href="https://switch2osm.org/serving-tiles/using-a-docker-container/" target="_blank" rel="noreferrer">https://switch2osm.org/serving-tiles/using-a-docker-container/</a></li><li><a href="https://github.com/Overv/openstreetmap-tile-server" target="_blank" rel="noreferrer">https://github.com/Overv/openstreetmap-tile-server</a></li><li><a href="https://hub.docker.com/r/overv/openstreetmap-tile-server/" target="_blank" rel="noreferrer">https://hub.docker.com/r/overv/openstreetmap-tile-server/</a></li><li>官方详细步骤：<a href="https://switch2osm.org/serving-tiles/manually-building-a-tile-server-ubuntu-22-04-lts/" target="_blank" rel="noreferrer">https://switch2osm.org/serving-tiles/manually-building-a-tile-server-ubuntu-22-04-lts/</a></li><li><a href="https://zhuanlan.zhihu.com/p/25889246" target="_blank" rel="noreferrer">https://zhuanlan.zhihu.com/p/25889246</a></li></ol></blockquote><ol><li><p>下载地图osm.pbf文件</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">wget</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://download.geofabrik.de/africa/zambia-latest.osm.pbf</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">wget</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://download.geofabrik.de/africa/zambia-latest.osm.pbf</span></span></code></pre></div></li><li><p>创建docker的volume</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">volume</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">create</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">osm-data</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">volume</span><span style="color:#24292E;"> </span><span style="color:#032F62;">create</span><span style="color:#24292E;"> </span><span style="color:#032F62;">osm-data</span></span></code></pre></div></li><li><p>下载docker镜像和挂载地图资源文件</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">--name </span><span style="color:#9ECBFF;">osm_server</span></span>
<span class="line"><span style="color:#B392F0;">-v</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">{替换成本机的文件路径}/{文件名}.osm.pbf:/data/region.osm.pbf</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">-v </span><span style="color:#9ECBFF;">osm-data:/data/database/</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">overv/openstreetmap-tile-server </span><span style="color:#79B8FF;">\\</span></span>
<span class="line"><span style="color:#E1E4E8;">import</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">--name </span><span style="color:#032F62;">osm_server</span></span>
<span class="line"><span style="color:#6F42C1;">-v</span><span style="color:#24292E;"> </span><span style="color:#032F62;">{替换成本机的文件路径}/{文件名}.osm.pbf:/data/region.osm.pbf</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">-v </span><span style="color:#032F62;">osm-data:/data/database/</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">overv/openstreetmap-tile-server </span><span style="color:#005CC5;">\\</span></span>
<span class="line"><span style="color:#24292E;">import</span></span></code></pre></div></li><li><p>使用docker启动osm服务 --name 参数指定之后每次启动的服务器就是同一个，如果根据官方的指令运行，没有name，每次掉了容器启动的都是新的，要重新挂载之类的，耗时耗性能</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">docker</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">--name</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">osm_server</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-p</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">8080</span><span style="color:#9ECBFF;">:80</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-v</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">osm-data:/data/database</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-d</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">overv/openstreetmap-tile-server</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">run</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">docker</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">--name</span><span style="color:#24292E;"> </span><span style="color:#032F62;">osm_server</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-p</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">8080</span><span style="color:#032F62;">:80</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-v</span><span style="color:#24292E;"> </span><span style="color:#032F62;">osm-data:/data/database</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-d</span><span style="color:#24292E;"> </span><span style="color:#032F62;">overv/openstreetmap-tile-server</span><span style="color:#24292E;"> </span><span style="color:#032F62;">run</span></span></code></pre></div></li><li><p>查看服务器是否部署成功</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">http://your.server.ip.address:8080</span></span>
<span class="line"><span style="color:#B392F0;">http://your.server.ip.address:8080/tile/0/0/0.png</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">http://your.server.ip.address:8080</span></span>
<span class="line"><span style="color:#6F42C1;">http://your.server.ip.address:8080/tile/0/0/0.png</span></span></code></pre></div></li></ol><blockquote><p>地图数据源:</p><p><a href="https://download.openstreetmap.fr/extracts/asia/china/" target="_blank" rel="noreferrer">https://download.openstreetmap.fr/extracts/asia/china/</a></p><p><a href="https://app.protomaps.com/" target="_blank" rel="noreferrer">https://app.protomaps.com/</a></p><p><a href="https://github.com/leaflet-extras/leaflet-providers" target="_blank" rel="noreferrer">https://github.com/leaflet-extras/leaflet-providers</a></p><p><a href="https://leaflet-extras.github.io/leaflet-providers/preview/" target="_blank" rel="noreferrer">https://leaflet-extras.github.io/leaflet-providers/preview/</a></p></blockquote>`,15),e=[p];function t(r,c,i,y,E,d){return a(),n("div",null,e)}const h=s(o,[["render",t]]);export{u as __pageData,h as default};
