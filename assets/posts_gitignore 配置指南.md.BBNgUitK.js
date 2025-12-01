import{_ as e,C as i,c as t,o as n,a0 as a,b as c,w as p,a as o,G as d,a2 as r}from"./chunks/framework.DXI-tbPr.js";const E=JSON.parse('{"title":".gitignore 配置指南","description":"通用的、可复用、可标准化的 .gitignore 配置指南，适用于各种类型的项目，提供分层管理策略和最佳实践","frontmatter":{"title":".gitignore 配置指南","description":"通用的、可复用、可标准化的 .gitignore 配置指南，适用于各种类型的项目，提供分层管理策略和最佳实践","date":"2025-12-01T14:43:20.000Z","tags":["Git","工程化","最佳实践","版本控制"]},"headers":[],"relativePath":"posts/gitignore 配置指南.md","filePath":"posts/gitignore 配置指南.md","lastUpdated":1764582741000}'),h={name:"posts/gitignore 配置指南.md"};function g(k,s,u,b,v,m){const l=i("Mermaid");return n(),t("div",null,[s[1]||(s[1]=a('<blockquote><p>基于实际项目经验，总结通用的 <code>.gitignore</code> 配置原则和最佳实践，提供可复用的、标准化的配置方案，适用于各种类型的项目。</p></blockquote><h2 id="一、核心原则" tabindex="-1">一、核心原则 <a class="header-anchor" href="#一、核心原则" aria-label="Permalink to &quot;一、核心原则&quot;">​</a></h2><h3 id="_1-1-为什么需要-gitignore" tabindex="-1">1.1 为什么需要 .gitignore <a class="header-anchor" href="#_1-1-为什么需要-gitignore" aria-label="Permalink to &quot;1.1 为什么需要 .gitignore&quot;">​</a></h3><p><code>.gitignore</code> 用于告诉 Git 哪些文件或目录不应该被版本控制。核心原则：</p><ul><li><strong>不提交生成文件</strong>：构建产物、编译文件等由工具生成，不应提交</li><li><strong>不提交依赖目录</strong>：依赖由包管理器管理，通过声明文件（如 <code>package.json</code>）管理版本</li><li><strong>不提交敏感信息</strong>：环境变量、密钥、密码等敏感信息不应提交</li><li><strong>不提交个人配置</strong>：IDE 配置、系统文件等个人偏好不应影响团队</li></ul><h3 id="_1-2-配置策略" tabindex="-1">1.2 配置策略 <a class="header-anchor" href="#_1-2-配置策略" aria-label="Permalink to &quot;1.2 配置策略&quot;">​</a></h3><p>根据项目复杂度选择配置策略：</p><table tabindex="0"><thead><tr><th>策略</th><th>适用场景</th><th>结构</th></tr></thead><tbody><tr><td><strong>单文件管理</strong></td><td>单一技术栈、小型项目</td><td>项目根目录一个 <code>.gitignore</code></td></tr><tr><td><strong>分层管理</strong></td><td>多技术栈、中大型项目</td><td>根目录通用规则 + 子目录特定规则</td></tr></tbody></table>',8)),(n(),c(r,null,{default:p(()=>[d(l,{id:"mermaid-81",class:"mermaid",graph:"graph%20TD%0A%20%20%20%20A%5B%E9%A1%B9%E7%9B%AE%E7%B1%BB%E5%9E%8B%5D%20--%3E%20B%7B%E5%8D%95%E4%B8%80%E6%8A%80%E6%9C%AF%E6%A0%88%3F%7D%0A%20%20%20%20B%20--%3E%7C%E6%98%AF%7C%20C%5B%E5%8D%95%E6%96%87%E4%BB%B6%E7%AE%A1%E7%90%86%5D%0A%20%20%20%20B%20--%3E%7C%E5%90%A6%7C%20D%5B%E5%88%86%E5%B1%82%E7%AE%A1%E7%90%86%5D%0A%20%20%20%20C%20--%3E%20E%5B%E6%A0%B9%E7%9B%AE%E5%BD%95%20.gitignore%5D%0A%20%20%20%20D%20--%3E%20F%5B%E6%A0%B9%E7%9B%AE%E5%BD%95%E9%80%9A%E7%94%A8%E8%A7%84%E5%88%99%5D%0A%20%20%20%20D%20--%3E%20G%5B%E5%AD%90%E7%9B%AE%E5%BD%95%E7%89%B9%E5%AE%9A%E8%A7%84%E5%88%99%5D%0A%20%20%20%20F%20--%3E%20H%5Bfrontend%2F.gitignore%5D%0A%20%20%20%20F%20--%3E%20I%5Bbackend%2F.gitignore%5D%0A%20%20%20%20F%20--%3E%20J%5Bmobile%2F.gitignore%5D%0A"})]),fallback:p(()=>[...s[0]||(s[0]=[o(" Loading... ",-1)])]),_:1})),s[2]||(s[2]=a(`<h3 id="_1-3-分类组织原则" tabindex="-1">1.3 分类组织原则 <a class="header-anchor" href="#_1-3-分类组织原则" aria-label="Permalink to &quot;1.3 分类组织原则&quot;">​</a></h3><p>按类别组织规则，使用注释清晰标注：</p><ul><li><strong>数据目录</strong>：运行时数据（<code>data/</code>、<code>logs/</code>、<code>uploads/</code>）</li><li><strong>配置文件</strong>：环境变量、本地配置（<code>*.env</code>、<code>*.local</code>）</li><li><strong>构建产物</strong>：编译输出、打包文件（<code>dist/</code>、<code>build/</code>、<code>target/</code>）</li><li><strong>依赖目录</strong>：包管理器安装的依赖（<code>node_modules/</code>、<code>venv/</code>、<code>vendor/</code>）</li><li><strong>测试覆盖率</strong>：测试报告、覆盖率数据（<code>coverage/</code>、<code>.coverage</code>）</li><li><strong>IDE 配置</strong>：编辑器配置文件（<code>.vscode/</code>、<code>.idea/</code>）</li><li><strong>系统文件</strong>：操作系统生成的文件（<code>.DS_Store</code>、<code>Thumbs.db</code>）</li><li><strong>日志和临时文件</strong>：运行时日志、临时文件（<code>*.log</code>、<code>*.tmp</code>）</li></ul><h2 id="二、模板集合" tabindex="-1">二、模板集合 <a class="header-anchor" href="#二、模板集合" aria-label="Permalink to &quot;二、模板集合&quot;">​</a></h2><h3 id="_2-1-通用项目模板" tabindex="-1">2.1 通用项目模板 <a class="header-anchor" href="#_2-1-通用项目模板" aria-label="Permalink to &quot;2.1 通用项目模板&quot;">​</a></h3><p><strong>位置：</strong> <code>project-root/.gitignore</code><br><strong>适用场景：</strong> 所有项目的通用规则</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># 数据目录（运行时数据，不提交到版本控制）</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>data/</span></span>
<span class="line"><span>logs/</span></span>
<span class="line"><span>uploads/</span></span>
<span class="line"><span>cache/</span></span>
<span class="line"><span>temp/</span></span>
<span class="line"><span>tmp/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 配置文件（敏感信息，使用 .env.example 作为模板）</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.env</span></span>
<span class="line"><span>*.env.local</span></span>
<span class="line"><span>*.env.*.local</span></span>
<span class="line"><span>!.env.example</span></span>
<span class="line"><span>!.env.template</span></span>
<span class="line"><span>*.local</span></span>
<span class="line"><span>.local/</span></span>
<span class="line"><span>config.local.*</span></span>
<span class="line"><span>settings.local.*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 构建产物（由构建工具生成，不应提交）</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>build/</span></span>
<span class="line"><span>out/</span></span>
<span class="line"><span>.output/</span></span>
<span class="line"><span>*.min.js</span></span>
<span class="line"><span>*.min.css</span></span>
<span class="line"><span>*.bundle.js</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 测试和覆盖率报告</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>coverage/</span></span>
<span class="line"><span>.nyc_output/</span></span>
<span class="line"><span>.coverage</span></span>
<span class="line"><span>htmlcov/</span></span>
<span class="line"><span>.pytest_cache/</span></span>
<span class="line"><span>.tox/</span></span>
<span class="line"><span>.hypothesis/</span></span>
<span class="line"><span>*.cover</span></span>
<span class="line"><span>*.lcov</span></span>
<span class="line"><span>test-results/</span></span>
<span class="line"><span>junit.xml</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># IDE 和编辑器配置（可选，团队统一时可提交）</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># VS Code</span></span>
<span class="line"><span>.vscode/</span></span>
<span class="line"><span>!.vscode/settings.json</span></span>
<span class="line"><span>!.vscode/tasks.json</span></span>
<span class="line"><span>!.vscode/launch.json</span></span>
<span class="line"><span>!.vscode/extensions.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span># IntelliJ IDEA / PyCharm / WebStorm</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.iml</span></span>
<span class="line"><span>*.iws</span></span>
<span class="line"><span>*.ipr</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Eclipse</span></span>
<span class="line"><span>.classpath</span></span>
<span class="line"><span>.project</span></span>
<span class="line"><span>.settings/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Vim / Emacs</span></span>
<span class="line"><span>*.swp</span></span>
<span class="line"><span>*.swo</span></span>
<span class="line"><span>*~</span></span>
<span class="line"><span>.vim/</span></span>
<span class="line"><span>\\#*\\#</span></span>
<span class="line"><span>.\\#*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Sublime Text</span></span>
<span class="line"><span>*.sublime-project</span></span>
<span class="line"><span>*.sublime-workspace</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 系统文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># macOS</span></span>
<span class="line"><span>.DS_Store</span></span>
<span class="line"><span>.AppleDouble</span></span>
<span class="line"><span>.LSOverride</span></span>
<span class="line"><span>._*</span></span>
<span class="line"><span>.Spotlight-V100</span></span>
<span class="line"><span>.Trashes</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Windows</span></span>
<span class="line"><span>Thumbs.db</span></span>
<span class="line"><span>ehthumbs.db</span></span>
<span class="line"><span>Desktop.ini</span></span>
<span class="line"><span>$RECYCLE.BIN/</span></span>
<span class="line"><span>*.lnk</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Linux</span></span>
<span class="line"><span>.directory</span></span>
<span class="line"><span>.Trash-*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 日志文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.log</span></span>
<span class="line"><span>logs/</span></span>
<span class="line"><span>*.log.*</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 临时文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.tmp</span></span>
<span class="line"><span>*.temp</span></span>
<span class="line"><span>*.bak</span></span>
<span class="line"><span>*.cache</span></span>
<span class="line"><span>*.backup</span></span>
<span class="line"><span>*.old</span></span>
<span class="line"><span>*.orig</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># Docker 相关</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>docker-compose.override.yml</span></span></code></pre></div><h3 id="_2-2-node-js-javascript-typescript-项目" tabindex="-1">2.2 Node.js / JavaScript / TypeScript 项目 <a class="header-anchor" href="#_2-2-node-js-javascript-typescript-项目" aria-label="Permalink to &quot;2.2 Node.js / JavaScript / TypeScript 项目&quot;">​</a></h3><p><strong>完整模板：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># 依赖</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>node_modules/</span></span>
<span class="line"><span>npm-debug.log*</span></span>
<span class="line"><span>yarn-debug.log*</span></span>
<span class="line"><span>yarn-error.log*</span></span>
<span class="line"><span>pnpm-debug.log*</span></span>
<span class="line"><span>lerna-debug.log*</span></span>
<span class="line"><span>.pnpm-store/</span></span>
<span class="line"><span>.yarn/</span></span>
<span class="line"><span>.yarn/cache/</span></span>
<span class="line"><span>.yarn/unplugged/</span></span>
<span class="line"><span>.yarn/build-state.yml</span></span>
<span class="line"><span>.yarn/install-state.gz</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 构建产物</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>build/</span></span>
<span class="line"><span>out/</span></span>
<span class="line"><span>.next/</span></span>
<span class="line"><span>.nuxt/</span></span>
<span class="line"><span>.vite/</span></span>
<span class="line"><span>.output/</span></span>
<span class="line"><span>.cache/</span></span>
<span class="line"><span>.webpack/</span></span>
<span class="line"><span>.angular/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 测试覆盖率</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>coverage/</span></span>
<span class="line"><span>.nyc_output/</span></span>
<span class="line"><span>.jest/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 环境变量</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span>
<span class="line"><span>.env.*.local</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 编辑器</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.vscode/*</span></span>
<span class="line"><span>!.vscode/extensions.json</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.suo</span></span>
<span class="line"><span>*.ntvs*</span></span>
<span class="line"><span>*.njsproj</span></span>
<span class="line"><span>*.sln</span></span></code></pre></div><h3 id="_2-3-python-项目" tabindex="-1">2.3 Python 项目 <a class="header-anchor" href="#_2-3-python-项目" aria-label="Permalink to &quot;2.3 Python 项目&quot;">​</a></h3><p><strong>完整模板：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># Python 编译文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>__pycache__/</span></span>
<span class="line"><span>*.py[cod]</span></span>
<span class="line"><span>*$py.class</span></span>
<span class="line"><span>*.so</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 分发和打包</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.Python</span></span>
<span class="line"><span>build/</span></span>
<span class="line"><span>develop-eggs/</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>downloads/</span></span>
<span class="line"><span>eggs/</span></span>
<span class="line"><span>.eggs/</span></span>
<span class="line"><span>lib/</span></span>
<span class="line"><span>lib64/</span></span>
<span class="line"><span>parts/</span></span>
<span class="line"><span>sdist/</span></span>
<span class="line"><span>var/</span></span>
<span class="line"><span>wheels/</span></span>
<span class="line"><span>pip-wheel-metadata/</span></span>
<span class="line"><span>share/python-wheels/</span></span>
<span class="line"><span>*.egg-info/</span></span>
<span class="line"><span>.installed.cfg</span></span>
<span class="line"><span>*.egg</span></span>
<span class="line"><span>MANIFEST</span></span>
<span class="line"><span></span></span>
<span class="line"><span># PyInstaller</span></span>
<span class="line"><span>*.manifest</span></span>
<span class="line"><span>*.spec</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 虚拟环境</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.venv/</span></span>
<span class="line"><span>venv/</span></span>
<span class="line"><span>ENV/</span></span>
<span class="line"><span>env/</span></span>
<span class="line"><span>.conda/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 测试覆盖率</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>htmlcov/</span></span>
<span class="line"><span>.tox/</span></span>
<span class="line"><span>.nox/</span></span>
<span class="line"><span>.coverage</span></span>
<span class="line"><span>.coverage.*</span></span>
<span class="line"><span>.cache</span></span>
<span class="line"><span>nosetests.xml</span></span>
<span class="line"><span>coverage.xml</span></span>
<span class="line"><span>*.cover</span></span>
<span class="line"><span>*.py,cover</span></span>
<span class="line"><span>.hypothesis/</span></span>
<span class="line"><span>.pytest_cache/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># Jupyter Notebook</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.ipynb_checkpoints</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># mypy</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.mypy_cache/</span></span>
<span class="line"><span>.dmypy.json</span></span>
<span class="line"><span>dmypy.json</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># pyenv</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.python-version</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 环境变量</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span>
<span class="line"><span>.env.*.local</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 数据库文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.db</span></span>
<span class="line"><span>*.sqlite</span></span>
<span class="line"><span>*.sqlite3</span></span>
<span class="line"><span>*.db-journal</span></span></code></pre></div><h3 id="_2-4-java-项目" tabindex="-1">2.4 Java 项目 <a class="header-anchor" href="#_2-4-java-项目" aria-label="Permalink to &quot;2.4 Java 项目&quot;">​</a></h3><p><strong>完整模板：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># 编译文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.class</span></span>
<span class="line"><span>*.jar</span></span>
<span class="line"><span>*.war</span></span>
<span class="line"><span>*.ear</span></span>
<span class="line"><span>*.nar</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 构建工具</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># Maven</span></span>
<span class="line"><span>target/</span></span>
<span class="line"><span>.mvn/</span></span>
<span class="line"><span>mvnw</span></span>
<span class="line"><span>mvnw.cmd</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Gradle</span></span>
<span class="line"><span>.gradle/</span></span>
<span class="line"><span>build/</span></span>
<span class="line"><span>!gradle/wrapper/gradle-wrapper.jar</span></span>
<span class="line"><span>!**/src/main/**/build/</span></span>
<span class="line"><span>!**/src/test/**/build/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># IDE</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.iml</span></span>
<span class="line"><span>*.iws</span></span>
<span class="line"><span>*.ipr</span></span>
<span class="line"><span>.classpath</span></span>
<span class="line"><span>.project</span></span>
<span class="line"><span>.settings/</span></span></code></pre></div><h3 id="_2-5-go-项目" tabindex="-1">2.5 Go 项目 <a class="header-anchor" href="#_2-5-go-项目" aria-label="Permalink to &quot;2.5 Go 项目&quot;">​</a></h3><p><strong>完整模板：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># 编译文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>*.exe</span></span>
<span class="line"><span>*.exe~</span></span>
<span class="line"><span>*.dll</span></span>
<span class="line"><span>*.so</span></span>
<span class="line"><span>*.dylib</span></span>
<span class="line"><span>*.test</span></span>
<span class="line"><span>*.out</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># 依赖</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>vendor/</span></span>
<span class="line"><span>go.sum</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># IDE</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.swp</span></span>
<span class="line"><span>*.swo</span></span></code></pre></div><h3 id="_2-6-rust-项目" tabindex="-1">2.6 Rust 项目 <a class="header-anchor" href="#_2-6-rust-项目" aria-label="Permalink to &quot;2.6 Rust 项目&quot;">​</a></h3><p><strong>完整模板：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ============================================</span></span>
<span class="line"><span># 编译文件</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>target/</span></span>
<span class="line"><span>Cargo.lock</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span># IDE</span></span>
<span class="line"><span># ============================================</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.swp</span></span>
<span class="line"><span>*.swo</span></span></code></pre></div><h3 id="_2-7-移动端项目" tabindex="-1">2.7 移动端项目 <a class="header-anchor" href="#_2-7-移动端项目" aria-label="Permalink to &quot;2.7 移动端项目&quot;">​</a></h3><h4 id="ios" tabindex="-1">iOS <a class="header-anchor" href="#ios" aria-label="Permalink to &quot;iOS&quot;">​</a></h4><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*.pbxuser</span></span>
<span class="line"><span>*.mode1v3</span></span>
<span class="line"><span>*.mode2v3</span></span>
<span class="line"><span>*.perspectivev3</span></span>
<span class="line"><span>*.xcuserstate</span></span>
<span class="line"><span>project.xcworkspace/</span></span>
<span class="line"><span>xcuserdata/</span></span>
<span class="line"><span>*.moved-aside</span></span>
<span class="line"><span>DerivedData/</span></span>
<span class="line"><span>*.hmap</span></span>
<span class="line"><span>*.ipa</span></span>
<span class="line"><span>*.dSYM.zip</span></span>
<span class="line"><span>*.dSYM</span></span></code></pre></div><h4 id="android" tabindex="-1">Android <a class="header-anchor" href="#android" aria-label="Permalink to &quot;Android&quot;">​</a></h4><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>*.apk</span></span>
<span class="line"><span>*.ap_</span></span>
<span class="line"><span>*.aab</span></span>
<span class="line"><span>.gradle/</span></span>
<span class="line"><span>local.properties</span></span>
<span class="line"><span>*.iml</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.dex</span></span>
<span class="line"><span>*.class</span></span>
<span class="line"><span>bin/</span></span>
<span class="line"><span>gen/</span></span>
<span class="line"><span>out/</span></span></code></pre></div><h3 id="_2-8-分层配置示例" tabindex="-1">2.8 分层配置示例 <a class="header-anchor" href="#_2-8-分层配置示例" aria-label="Permalink to &quot;2.8 分层配置示例&quot;">​</a></h3><p><strong>场景：</strong> Vue3 + FastAPI 全栈项目</p><p><strong>项目结构：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>project-root/</span></span>
<span class="line"><span>├── .gitignore           # 通用规则</span></span>
<span class="line"><span>├── frontend/</span></span>
<span class="line"><span>│   ├── .gitignore       # 前端特定规则</span></span>
<span class="line"><span>│   └── ...</span></span>
<span class="line"><span>└── backend/</span></span>
<span class="line"><span>    ├── .gitignore       # 后端特定规则</span></span>
<span class="line"><span>    └── ...</span></span></code></pre></div><p><strong>根目录 <code>.gitignore</code>：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 通用规则</span></span>
<span class="line"><span>data/</span></span>
<span class="line"><span>logs/</span></span>
<span class="line"><span>uploads/</span></span>
<span class="line"><span>*.env</span></span>
<span class="line"><span>*.env.local</span></span>
<span class="line"><span>!.env.example</span></span>
<span class="line"><span>.DS_Store</span></span>
<span class="line"><span>Thumbs.db</span></span>
<span class="line"><span>*.log</span></span>
<span class="line"><span>*.tmp</span></span></code></pre></div><p><strong><code>frontend/.gitignore</code>：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 前端特定规则</span></span>
<span class="line"><span>node_modules/</span></span>
<span class="line"><span>.pnpm-store/</span></span>
<span class="line"><span>.yarn/</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>.vite/</span></span>
<span class="line"><span>.output/</span></span>
<span class="line"><span>coverage/</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span></code></pre></div><p><strong><code>backend/.gitignore</code>：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 后端特定规则</span></span>
<span class="line"><span>__pycache__/</span></span>
<span class="line"><span>*.pyc</span></span>
<span class="line"><span>*.pyo</span></span>
<span class="line"><span>.venv/</span></span>
<span class="line"><span>venv/</span></span>
<span class="line"><span>.pytest_cache/</span></span>
<span class="line"><span>.coverage</span></span>
<span class="line"><span>htmlcov/</span></span>
<span class="line"><span>*.db</span></span>
<span class="line"><span>*.sqlite</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span></code></pre></div><h2 id="三、最佳实践" tabindex="-1">三、最佳实践 <a class="header-anchor" href="#三、最佳实践" aria-label="Permalink to &quot;三、最佳实践&quot;">​</a></h2><h3 id="_3-1-敏感信息管理" tabindex="-1">3.1 敏感信息管理 <a class="header-anchor" href="#_3-1-敏感信息管理" aria-label="Permalink to &quot;3.1 敏感信息管理&quot;">​</a></h3><p><strong>环境变量文件：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 忽略所有环境变量文件</span></span>
<span class="line"><span>*.env</span></span>
<span class="line"><span>*.env.local</span></span>
<span class="line"><span>*.env.*.local</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但保留模板文件</span></span>
<span class="line"><span>!.env.example</span></span>
<span class="line"><span>!.env.template</span></span></code></pre></div><p><strong>推荐做法：</strong></p><ul><li>✅ 提交 <code>.env.example</code> 作为模板</li><li>❌ 不提交实际的 <code>.env</code> 文件</li><li>✅ 使用环境变量管理敏感信息</li><li>✅ 在 README 中说明如何配置</li></ul><h3 id="_3-2-构建产物管理" tabindex="-1">3.2 构建产物管理 <a class="header-anchor" href="#_3-2-构建产物管理" aria-label="Permalink to &quot;3.2 构建产物管理&quot;">​</a></h3><p><strong>原则：</strong></p><ul><li>❌ 不提交构建产物（由构建工具生成）</li><li>✅ 在 CI/CD 中构建，而不是提交构建后的文件</li><li>✅ 明确列出所有构建产物目录</li></ul><p><strong>常见构建产物：</strong></p><ul><li>前端：<code>dist/</code>、<code>build/</code>、<code>out/</code>、<code>.next/</code>、<code>.nuxt/</code>、<code>.vite/</code></li><li>后端：<code>target/</code>、<code>build/</code>、<code>dist/</code>、<code>*.egg-info/</code></li></ul><h3 id="_3-3-依赖管理" tabindex="-1">3.3 依赖管理 <a class="header-anchor" href="#_3-3-依赖管理" aria-label="Permalink to &quot;3.3 依赖管理&quot;">​</a></h3><p><strong>原则：</strong></p><ul><li>❌ 不提交依赖目录（由包管理器管理）</li><li>✅ 提交依赖声明文件（<code>package.json</code>、<code>requirements.txt</code>、<code>Cargo.toml</code> 等）</li><li>✅ 在 README 中说明如何安装依赖</li></ul><p><strong>常见依赖目录：</strong></p><ul><li>Node.js：<code>node_modules/</code>、<code>.pnpm-store/</code></li><li>Python：<code>venv/</code>、<code>.venv/</code>、<code>__pycache__/</code></li><li>Java：<code>target/</code>、<code>.gradle/</code></li><li>Go：<code>vendor/</code></li><li>Rust：<code>target/</code>（但 <code>Cargo.lock</code> 通常需要提交）</li></ul><h3 id="_3-4-ide-配置管理" tabindex="-1">3.4 IDE 配置管理 <a class="header-anchor" href="#_3-4-ide-配置管理" aria-label="Permalink to &quot;3.4 IDE 配置管理&quot;">​</a></h3><p><strong>两种策略：</strong></p><p><strong>策略一：忽略所有 IDE 配置（个人项目）</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>.vscode/</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span>*.iml</span></span></code></pre></div><p><strong>策略二：提交部分 IDE 配置（团队项目）</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 忽略个人配置</span></span>
<span class="line"><span>.vscode/*</span></span>
<span class="line"><span>.idea/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但保留团队共享配置</span></span>
<span class="line"><span>!.vscode/settings.json</span></span>
<span class="line"><span>!.vscode/tasks.json</span></span>
<span class="line"><span>!.vscode/launch.json</span></span>
<span class="line"><span>!.vscode/extensions.json</span></span></code></pre></div><p><strong>选择建议：</strong></p><ul><li>个人项目：忽略所有 IDE 配置</li><li>团队项目：提交共享配置，忽略个人配置</li></ul><h3 id="_3-5-规则优先级" tabindex="-1">3.5 规则优先级 <a class="header-anchor" href="#_3-5-规则优先级" aria-label="Permalink to &quot;3.5 规则优先级&quot;">​</a></h3><p><code>.gitignore</code> 规则按顺序匹配，更具体的规则会覆盖更通用的规则：</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 通用规则</span></span>
<span class="line"><span>*.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 特定规则（优先级更高）</span></span>
<span class="line"><span>!important.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 目录规则</span></span>
<span class="line"><span>logs/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但保留 .gitkeep</span></span>
<span class="line"><span>!logs/.gitkeep</span></span></code></pre></div><p><strong>规则优先级：</strong></p><ol><li>更具体的规则优先于通用规则</li><li>后面的规则可以覆盖前面的规则（使用 <code>!</code>）</li><li>目录规则会忽略目录中的所有文件</li></ol><h2 id="四、常见问题处理" tabindex="-1">四、常见问题处理 <a class="header-anchor" href="#四、常见问题处理" aria-label="Permalink to &quot;四、常见问题处理&quot;">​</a></h2><h3 id="_4-1-已提交的文件需要忽略" tabindex="-1">4.1 已提交的文件需要忽略 <a class="header-anchor" href="#_4-1-已提交的文件需要忽略" aria-label="Permalink to &quot;4.1 已提交的文件需要忽略&quot;">​</a></h3><p><strong>问题：</strong> 文件已经被 Git 跟踪，但需要添加到 <code>.gitignore</code></p><p><strong>解决方案：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 从 Git 中移除但保留本地文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --cached</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">fil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 对于目录</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --cached</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">director</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">y</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 提交更改</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> commit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Remove tracked files from Git&quot;</span></span></code></pre></div><p><strong>批量处理：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 移除所有已跟踪的 .env 文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --cached</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> **</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">*</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">.env</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 移除所有已跟踪的 node_modules</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">find</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> .</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> node_modules</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -type</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -exec</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --cached</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +</span></span></code></pre></div><h3 id="_4-2-忽略规则不生效" tabindex="-1">4.2 忽略规则不生效 <a class="header-anchor" href="#_4-2-忽略规则不生效" aria-label="Permalink to &quot;4.2 忽略规则不生效&quot;">​</a></h3><p><strong>检查步骤：</strong></p><ol><li><p><strong>确认文件路径正确</strong></p><ul><li>使用相对路径（相对于 <code>.gitignore</code> 文件位置）</li><li>使用 <code>/</code> 作为路径分隔符（跨平台）</li></ul></li><li><p><strong>检查规则优先级</strong></p><ul><li>更具体的规则会覆盖更通用的规则</li><li>使用 <code>!</code> 可以取消忽略</li></ul></li><li><p><strong>确认文件未被 Git 跟踪</strong></p><ul><li>如果文件已被跟踪，需要先使用 <code>git rm --cached</code></li></ul></li><li><p><strong>检查 .gitignore 文件位置</strong></p><ul><li><code>.gitignore</code> 只影响其所在目录及子目录</li><li>确保 <code>.gitignore</code> 在正确的位置</li></ul></li></ol><p><strong>调试技巧：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检查文件是否被忽略</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> check-ignore</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">fil</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">e</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看所有被忽略的文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> status</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --ignored</span></span></code></pre></div><h3 id="_4-3-需要忽略但保留目录结构" tabindex="-1">4.3 需要忽略但保留目录结构 <a class="header-anchor" href="#_4-3-需要忽略但保留目录结构" aria-label="Permalink to &quot;4.3 需要忽略但保留目录结构&quot;">​</a></h3><p><strong>问题：</strong> 需要忽略目录中的文件，但保留目录结构（用于 Git 跟踪空目录）</p><p><strong>解决方案：</strong> 使用 <code>.gitkeep</code> 文件</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 创建目录并添加 .gitkeep</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> data/logs/backend</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">touch</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> data/logs/backend/.gitkeep</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># .gitignore 中排除 .gitkeep</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!**</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/.gitkeep</span></span></code></pre></div><p><strong>配置示例：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 忽略目录中的所有文件</span></span>
<span class="line"><span>data/logs/</span></span>
<span class="line"><span>data/uploads/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但保留 .gitkeep 文件</span></span>
<span class="line"><span>!**/.gitkeep</span></span></code></pre></div><h3 id="_4-4-部分文件需要提交" tabindex="-1">4.4 部分文件需要提交 <a class="header-anchor" href="#_4-4-部分文件需要提交" aria-label="Permalink to &quot;4.4 部分文件需要提交&quot;">​</a></h3><p><strong>问题：</strong> 某个模式的文件需要忽略，但其中某些文件需要提交</p><p><strong>解决方案：</strong> 使用 <code>!</code> 取消忽略</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 忽略所有 .env 文件</span></span>
<span class="line"><span>*.env</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但提交 .env.example</span></span>
<span class="line"><span>!.env.example</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 忽略所有日志文件</span></span>
<span class="line"><span>*.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 但提交 changelog.log</span></span>
<span class="line"><span>!changelog.log</span></span></code></pre></div><h3 id="_4-5-跨平台路径问题" tabindex="-1">4.5 跨平台路径问题 <a class="header-anchor" href="#_4-5-跨平台路径问题" aria-label="Permalink to &quot;4.5 跨平台路径问题&quot;">​</a></h3><p><strong>问题：</strong> Windows 和 Linux/macOS 路径分隔符不同</p><p><strong>解决方案：</strong> 使用 <code>/</code> 作为路径分隔符（Git 会自动处理）</p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># ✅ 正确（跨平台）</span></span>
<span class="line"><span>data/logs/</span></span>
<span class="line"><span>config/*.env</span></span>
<span class="line"><span></span></span>
<span class="line"><span># ❌ 错误（Windows 特定）</span></span>
<span class="line"><span>data\\logs\\</span></span>
<span class="line"><span>config\\*.env</span></span></code></pre></div><h2 id="五、团队协作建议" tabindex="-1">五、团队协作建议 <a class="header-anchor" href="#五、团队协作建议" aria-label="Permalink to &quot;五、团队协作建议&quot;">​</a></h2><h3 id="_5-1-统一配置" tabindex="-1">5.1 统一配置 <a class="header-anchor" href="#_5-1-统一配置" aria-label="Permalink to &quot;5.1 统一配置&quot;">​</a></h3><p><strong>原则：</strong></p><ul><li>团队成员使用相同的 <code>.gitignore</code> 配置</li><li><code>.gitignore</code> 文件应该提交到版本控制</li><li>定期审查和更新 <code>.gitignore</code> 配置</li></ul><p><strong>实践：</strong></p><ol><li>在项目初始化时创建 <code>.gitignore</code></li><li>使用模板或参考最佳实践</li><li>在 README 中说明 <code>.gitignore</code> 的配置原则</li><li>定期审查是否有遗漏的规则</li></ol><h3 id="_5-2-文档说明" tabindex="-1">5.2 文档说明 <a class="header-anchor" href="#_5-2-文档说明" aria-label="Permalink to &quot;5.2 文档说明&quot;">​</a></h3><p><strong>建议在 README 中说明：</strong></p><ul><li><code>.gitignore</code> 的配置原则</li><li>哪些文件/目录被忽略及原因</li><li>如何添加新的忽略规则</li><li>如何处理已提交的文件</li></ul><p><strong>示例：</strong></p><div class="language-markdown vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold;">## .gitignore 配置说明</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">本项目采用分层管理的方式组织 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">\`.gitignore\`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 根目录：项目级通用规则</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 子目录：特定技术栈规则</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">被忽略的内容：</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 依赖目录（node_modules、venv 等）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 构建产物（dist、build 等）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 环境变量文件（*.env）</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 日志文件（*.log）</span></span></code></pre></div><h3 id="_5-3-定期审查" tabindex="-1">5.3 定期审查 <a class="header-anchor" href="#_5-3-定期审查" aria-label="Permalink to &quot;5.3 定期审查&quot;">​</a></h3><p><strong>审查时机：</strong></p><ul><li>项目初始化时</li><li>添加新技术栈时</li><li>发现意外提交的文件时</li><li>定期（如每季度）审查</li></ul><p><strong>审查内容：</strong></p><ol><li>检查是否有遗漏的忽略规则</li><li>检查是否有不必要的忽略规则</li><li>检查配置是否清晰易懂</li><li>检查是否符合团队规范</li></ol><h2 id="六、工具推荐" tabindex="-1">六、工具推荐 <a class="header-anchor" href="#六、工具推荐" aria-label="Permalink to &quot;六、工具推荐&quot;">​</a></h2><ul><li><strong><a href="https://www.toptal.com/developers/gitignore" target="_blank" rel="noreferrer">gitignore.io</a></strong>：根据技术栈生成 <code>.gitignore</code></li><li><strong><a href="https://github.com/github/gitignore" target="_blank" rel="noreferrer">GitHub .gitignore 模板</a></strong>：官方模板集合</li><li><strong>Git 命令</strong>：<code>git check-ignore -v &lt;file&gt;</code> 检查文件是否被忽略</li></ul><h2 id="参考资源" tabindex="-1">参考资源 <a class="header-anchor" href="#参考资源" aria-label="Permalink to &quot;参考资源&quot;">​</a></h2><h3 id="官方文档" tabindex="-1">官方文档 <a class="header-anchor" href="#官方文档" aria-label="Permalink to &quot;官方文档&quot;">​</a></h3><ul><li><a href="https://git-scm.com/docs/gitignore" target="_blank" rel="noreferrer">Git 官方文档 - gitignore</a></li><li><a href="https://github.com/github/gitignore" target="_blank" rel="noreferrer">GitHub .gitignore 模板</a></li></ul><h3 id="在线工具" tabindex="-1">在线工具 <a class="header-anchor" href="#在线工具" aria-label="Permalink to &quot;在线工具&quot;">​</a></h3><ul><li><a href="https://www.toptal.com/developers/gitignore" target="_blank" rel="noreferrer">gitignore.io</a> - 根据技术栈生成 .gitignore</li></ul><h3 id="相关指南" tabindex="-1">相关指南 <a class="header-anchor" href="#相关指南" aria-label="Permalink to &quot;相关指南&quot;">​</a></h3><ul><li><a href="https://git-scm.com/book" target="_blank" rel="noreferrer">Git 最佳实践</a></li><li><a href="https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files" target="_blank" rel="noreferrer">GitHub 文档 - 忽略文件</a></li></ul>`,117))])}const F=e(h,[["render",g]]);export{E as __pageData,F as default};
