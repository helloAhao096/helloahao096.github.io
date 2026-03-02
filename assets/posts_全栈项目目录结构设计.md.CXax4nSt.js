import{_ as l,C as e,c as t,o as a,aa as n,b as h,w as i,a as k,G as r,ac as d}from"./chunks/framework.Bof20DqB.js";const B=JSON.parse('{"title":"FastAPI + Vue 3 全栈项目目录结构设计指南","description":"基于实际项目经验，设计前后端分离的全栈项目目录结构，支持开发模式（热重载）和生产模式（容器化部署），提供最小可维护的核心服务配置和可扩展的可选服务集成方案","frontmatter":{"title":"FastAPI + Vue 3 全栈项目目录结构设计指南","description":"基于实际项目经验，设计前后端分离的全栈项目目录结构，支持开发模式（热重载）和生产模式（容器化部署），提供最小可维护的核心服务配置和可扩展的可选服务集成方案","date":"2025-12-01T14:28:48.000Z","tags":["FastAPI","Vue","全栈开发","工程化","Docker"]},"headers":[],"relativePath":"posts/全栈项目目录结构设计.md","filePath":"posts/全栈项目目录结构设计.md","lastUpdated":1764670496000}'),o={name:"posts/全栈项目目录结构设计.md"};function c(g,s,E,F,y,u){const p=e("Mermaid");return a(),t("div",null,[s[1]||(s[1]=n(`<blockquote><p>基于实际项目经验，设计前后端分离的全栈项目目录结构，支持开发模式（热重载）和生产模式（容器化部署），提供最小可维护的核心服务配置和可扩展的可选服务集成方案。</p></blockquote><h2 id="一、项目结构概览" tabindex="-1">一、项目结构概览 <a class="header-anchor" href="#一、项目结构概览" aria-label="Permalink to &quot;一、项目结构概览&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>project-root/</span></span>
<span class="line"><span>├── frontend/                      # Vue 3 前端项目</span></span>
<span class="line"><span>│   ├── src/                       # 源代码（混合模式：core/shared/modules）</span></span>
<span class="line"><span>│   ├── public/                    # 静态资源</span></span>
<span class="line"><span>│   ├── Dockerfile                 # 生产环境 Dockerfile</span></span>
<span class="line"><span>│   ├── nginx.conf                 # Nginx 配置</span></span>
<span class="line"><span>│   ├── .dockerignore</span></span>
<span class="line"><span>│   ├── package.json</span></span>
<span class="line"><span>│   ├── vite.config.ts</span></span>
<span class="line"><span>│   └── tsconfig.json</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── backend/                       # FastAPI 后端项目</span></span>
<span class="line"><span>│   ├── app/                       # 源代码（混合模式：core/shared/modules）</span></span>
<span class="line"><span>│   ├── Dockerfile                 # 生产环境 Dockerfile</span></span>
<span class="line"><span>│   ├── .dockerignore</span></span>
<span class="line"><span>│   ├── main.py</span></span>
<span class="line"><span>│   ├── pyproject.toml             # 项目配置和依赖（使用 uv 管理）</span></span>
<span class="line"><span>│   └── uv.lock                    # 锁定的依赖版本（使用 uv 生成）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── docker/                        # Docker 配置目录</span></span>
<span class="line"><span>│   ├── docker-compose.dev.yml    # 开发环境编排</span></span>
<span class="line"><span>│   ├── docker-compose.prod.yml   # 生产环境编排</span></span>
<span class="line"><span>│   └── .env.example               # 环境变量示例</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── data/                          # 数据目录（统一管理，通过 volume 挂载）</span></span>
<span class="line"><span>│   ├── uploads/                  # 本地临时上传（如需要）</span></span>
<span class="line"><span>│   │   └── temp/</span></span>
<span class="line"><span>│   ├── logs/                      # 日志文件</span></span>
<span class="line"><span>│   │   ├── backend/              # 后端日志</span></span>
<span class="line"><span>│   │   ├── frontend/             # 前端日志（如需要）</span></span>
<span class="line"><span>│   │   └── nginx/                # Nginx 日志</span></span>
<span class="line"><span>│   └── database/                  # 数据库相关</span></span>
<span class="line"><span>│       ├── scripts/              # SQL 脚本（初始化、备份等）</span></span>
<span class="line"><span>│       └── backups/              # 数据库备份</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── config/                        # 配置文件目录</span></span>
<span class="line"><span>│   ├── development/              # 开发环境配置</span></span>
<span class="line"><span>│   │   ├── backend.env</span></span>
<span class="line"><span>│   │   └── frontend.env</span></span>
<span class="line"><span>│   ├── production/               # 生产环境配置</span></span>
<span class="line"><span>│   │   ├── backend.env</span></span>
<span class="line"><span>│   │   └── frontend.env</span></span>
<span class="line"><span>│   └── nginx/                    # Nginx 配置（全局）</span></span>
<span class="line"><span>│       └── default.conf</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── scripts/                       # 项目级脚本</span></span>
<span class="line"><span>│   ├── docker.sh                  # Docker 统一管理脚本</span></span>
<span class="line"><span>│   ├── dev/                      # 开发环境脚本</span></span>
<span class="line"><span>│   │   ├── start.sh             # 启动开发环境</span></span>
<span class="line"><span>│   │   ├── stop.sh              # 停止开发环境</span></span>
<span class="line"><span>│   │   ├── setup.sh             # 初始化环境</span></span>
<span class="line"><span>│   │   └── logs.sh               # 查看日志</span></span>
<span class="line"><span>│   ├── build/                    # 构建脚本</span></span>
<span class="line"><span>│   │   ├── build-frontend.sh</span></span>
<span class="line"><span>│   │   ├── build-backend.sh</span></span>
<span class="line"><span>│   │   └── build-all.sh</span></span>
<span class="line"><span>│   └── deploy/                   # 部署脚本</span></span>
<span class="line"><span>│       ├── deploy.sh             # 部署脚本</span></span>
<span class="line"><span>│       ├── deploy-docker.sh      # Docker 部署</span></span>
<span class="line"><span>│       └── rollback.sh           # 回滚脚本</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── docs/                          # 项目文档</span></span>
<span class="line"><span>│   ├── api/                      # API 文档</span></span>
<span class="line"><span>│   ├── deployment/               # 部署文档</span></span>
<span class="line"><span>│   └── development/             # 开发文档</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── tests/                         # 测试目录</span></span>
<span class="line"><span>│   ├── e2e/                      # 端到端测试</span></span>
<span class="line"><span>│   ├── integration/              # 集成测试</span></span>
<span class="line"><span>│   └── fixtures/                 # 测试数据</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── .github/                       # GitHub Actions</span></span>
<span class="line"><span>│   └── workflows/</span></span>
<span class="line"><span>│       ├── ci.yml                # CI 流程</span></span>
<span class="line"><span>│       └── deploy.yml            # 部署流程</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── .gitignore</span></span>
<span class="line"><span>├── .dockerignore                  # 全局 Docker 忽略文件</span></span>
<span class="line"><span>├── README.md</span></span>
<span class="line"><span>└── LICENSE</span></span></code></pre></div><h2 id="二、核心设计理念" tabindex="-1">二、核心设计理念 <a class="header-anchor" href="#二、核心设计理念" aria-label="Permalink to &quot;二、核心设计理念&quot;">​</a></h2><h3 id="_2-1-设计原则" tabindex="-1">2.1 设计原则 <a class="header-anchor" href="#_2-1-设计原则" aria-label="Permalink to &quot;2.1 设计原则&quot;">​</a></h3><p>本目录结构采用<strong>最小可维护性 + 可扩展性</strong>的设计原则：</p><ul><li><strong>核心服务</strong>：数据库（PostgreSQL）是必须的，所有项目都需要</li><li><strong>可选服务</strong>：文件存储、缓存、消息队列等服务根据项目需求按需添加</li><li><strong>灵活扩展</strong>：通过 Docker Compose 轻松添加新服务，不影响核心功能</li><li><strong>环境分离</strong>：开发和生产使用不同的配置策略，最大化开发效率和优化生产性能</li></ul><h3 id="_2-2-开发模式-vs-生产模式" tabindex="-1">2.2 开发模式 vs 生产模式 <a class="header-anchor" href="#_2-2-开发模式-vs-生产模式" aria-label="Permalink to &quot;2.2 开发模式 vs 生产模式&quot;">​</a></h3>`,8)),(a(),h(d,null,{default:i(()=>[r(p,{id:"mermaid-43",class:"mermaid",graph:"graph%20TB%0A%20%20%20%20subgraph%20%22%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%22%0A%20%20%20%20%20%20%20%20A%5BVite%20Dev%20Server%3Cbr%2F%3E%E5%AE%BF%E4%B8%BB%E6%9C%BA%3A5173%5D%20--%3E%20B%5BBackend%20Container%3Cbr%2F%3EVolume%E6%8C%82%E8%BD%BD%E4%BB%A3%E7%A0%81%5D%0A%20%20%20%20%20%20%20%20B%20--%3E%20C%5BPostgreSQL%20Container%3Cbr%2F%3E%E7%AB%AF%E5%8F%A3%E6%9A%B4%E9%9C%B2%3A5432%5D%0A%20%20%20%20%20%20%20%20style%20A%20fill%3A%23e1f5ff%0A%20%20%20%20%20%20%20%20style%20B%20fill%3A%23fff4e1%0A%20%20%20%20%20%20%20%20style%20C%20fill%3A%23e8f5e9%0A%20%20%20%20end%0A%20%20%20%20%0A%20%20%20%20subgraph%20%22%E7%94%9F%E4%BA%A7%E7%8E%AF%E5%A2%83%22%0A%20%20%20%20%20%20%20%20D%5BNginx%20Container%3Cbr%2F%3E%E9%9D%99%E6%80%81%E6%96%87%E4%BB%B6%5D%20--%3E%20E%5BBackend%20Container%3Cbr%2F%3E%E9%95%9C%E5%83%8F%E6%89%93%E5%8C%85%5D%0A%20%20%20%20%20%20%20%20E%20--%3E%20F%5BPostgreSQL%20Container%3Cbr%2F%3E%E4%BB%85%E5%AE%B9%E5%99%A8%E5%86%85%E8%AE%BF%E9%97%AE%5D%0A%20%20%20%20%20%20%20%20style%20D%20fill%3A%23e1f5ff%0A%20%20%20%20%20%20%20%20style%20E%20fill%3A%23fff4e1%0A%20%20%20%20%20%20%20%20style%20F%20fill%3A%23e8f5e9%0A%20%20%20%20end%0A"})]),fallback:i(()=>[...s[0]||(s[0]=[k(" Loading... ",-1)])]),_:1})),s[2]||(s[2]=n(`<h3 id="_2-3-环境差异对比" tabindex="-1">2.3 环境差异对比 <a class="header-anchor" href="#_2-3-环境差异对比" aria-label="Permalink to &quot;2.3 环境差异对比&quot;">​</a></h3><table tabindex="0"><thead><tr><th>维度</th><th>开发环境（Dev）</th><th>生产环境（Prod）</th></tr></thead><tbody><tr><td><strong>前端运行方式</strong></td><td>Vite Dev Server（宿主机）</td><td>Nginx 容器（构建后静态文件）</td></tr><tr><td><strong>前端热重载</strong></td><td>✅ 支持</td><td>❌ 不支持</td></tr><tr><td><strong>后端代码挂载</strong></td><td>✅ Volume 挂载源代码</td><td>❌ 代码打包到镜像</td></tr><tr><td><strong>后端热重载</strong></td><td>✅ Uvicorn <code>--reload</code></td><td>❌ 不支持</td></tr><tr><td><strong>后端运行方式</strong></td><td>Uvicorn 单进程</td><td>Uvicorn 多进程（<code>--workers 4</code>）</td></tr><tr><td><strong>数据库端口</strong></td><td>✅ 暴露 5432（便于本地工具连接）</td><td>❌ 不暴露（仅容器内访问）</td></tr><tr><td><strong>环境变量</strong></td><td>硬编码（便于快速启动）</td><td>环境变量（安全、灵活）</td></tr><tr><td><strong>重启策略</strong></td><td>无（手动控制）</td><td><code>restart: always</code>（自动恢复）</td></tr><tr><td><strong>启动速度</strong></td><td>快（秒级，无需构建）</td><td>较慢（需要构建镜像）</td></tr><tr><td><strong>调试能力</strong></td><td>✅ 完整调试支持</td><td>⚠️ 通过日志调试</td></tr></tbody></table><p><strong>设计思路：</strong></p><ul><li><strong>开发环境</strong>：最大化开发效率，代码修改立即生效，支持完整调试，快速启动</li><li><strong>生产环境</strong>：优化性能和稳定性，代码打包，多进程运行，安全加固</li></ul><h2 id="三、详细目录结构" tabindex="-1">三、详细目录结构 <a class="header-anchor" href="#三、详细目录结构" aria-label="Permalink to &quot;三、详细目录结构&quot;">​</a></h2><h3 id="_3-1-frontend-目录结构" tabindex="-1">3.1 Frontend 目录结构 <a class="header-anchor" href="#_3-1-frontend-目录结构" aria-label="Permalink to &quot;3.1 Frontend 目录结构&quot;">​</a></h3><blockquote><p>💡 <strong>详细参考</strong>：如需了解前端目录结构的详细设计原则、模块化方案、命名规范等，请参考 <a href="https://blog.mapin.net/posts/Vue%203%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">Vue 3 项目工程化结构设计指南</a>。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>frontend/</span></span>
<span class="line"><span>├── src/                           # 源代码（混合模式）</span></span>
<span class="line"><span>│   ├── core/                     # 核心基础设施</span></span>
<span class="line"><span>│   │   ├── api/                 # HTTP 客户端</span></span>
<span class="line"><span>│   │   ├── utils/               # 工具函数</span></span>
<span class="line"><span>│   │   └── types/               # 通用类型</span></span>
<span class="line"><span>│   ├── shared/                  # 共享业务代码</span></span>
<span class="line"><span>│   │   ├── components/          # 跨模块组件</span></span>
<span class="line"><span>│   │   ├── stores/              # 共享状态</span></span>
<span class="line"><span>│   │   └── composables/        # 共享逻辑</span></span>
<span class="line"><span>│   ├── modules/                 # 业务模块</span></span>
<span class="line"><span>│   │   ├── user/</span></span>
<span class="line"><span>│   │   ├── project/</span></span>
<span class="line"><span>│   │   └── ...</span></span>
<span class="line"><span>│   ├── router/                  # 路由配置</span></span>
<span class="line"><span>│   ├── styles/                  # 样式文件</span></span>
<span class="line"><span>│   ├── locales/                 # 国际化</span></span>
<span class="line"><span>│   ├── plugins/                 # 插件配置</span></span>
<span class="line"><span>│   ├── assets/                  # 资源文件</span></span>
<span class="line"><span>│   ├── main.ts                  # 应用入口</span></span>
<span class="line"><span>│   ├── App.vue                  # 根组件</span></span>
<span class="line"><span>│   └── vite-env.d.ts            # Vite 类型声明</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── public/                       # 静态资源（不参与构建）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Dockerfile                    # 生产环境 Dockerfile</span></span>
<span class="line"><span>├── nginx.conf                    # Nginx 配置</span></span>
<span class="line"><span>├── .dockerignore</span></span>
<span class="line"><span>├── .env.development              # 开发环境变量</span></span>
<span class="line"><span>├── .env.production               # 生产环境变量</span></span>
<span class="line"><span>├── .env.example                  # 环境变量示例</span></span>
<span class="line"><span>├── package.json</span></span>
<span class="line"><span>├── vite.config.ts</span></span>
<span class="line"><span>├── tsconfig.json</span></span>
<span class="line"><span>└── README.md</span></span></code></pre></div><h3 id="_3-2-backend-目录结构" tabindex="-1">3.2 Backend 目录结构 <a class="header-anchor" href="#_3-2-backend-目录结构" aria-label="Permalink to &quot;3.2 Backend 目录结构&quot;">​</a></h3><blockquote><p>💡 <strong>详细参考</strong>：如需了解后端目录结构的详细设计原则、分层架构、数据库设计、模块化方案等，请参考 <a href="https://blog.mapin.net/posts/FastAPI%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">FastAPI 项目工程化结构设计指南</a>。</p></blockquote><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>backend/</span></span>
<span class="line"><span>├── app/                          # 源代码（混合模式）</span></span>
<span class="line"><span>│   ├── core/                    # 核心基础设施</span></span>
<span class="line"><span>│   │   ├── config.py            # 配置管理</span></span>
<span class="line"><span>│   │   ├── exceptions/          # 异常定义</span></span>
<span class="line"><span>│   │   ├── response.py          # 响应模型</span></span>
<span class="line"><span>│   │   ├── security/            # 安全认证</span></span>
<span class="line"><span>│   │   └── middleware/          # 中间件</span></span>
<span class="line"><span>│   ├── db/                      # 数据库层</span></span>
<span class="line"><span>│   │   ├── base.py              # 基础模型</span></span>
<span class="line"><span>│   │   ├── connection.py        # 数据库连接</span></span>
<span class="line"><span>│   │   └── repositories/        # 基础仓储</span></span>
<span class="line"><span>│   ├── shared/                  # 共享服务</span></span>
<span class="line"><span>│   │   ├── storage/             # 存储服务（可选，根据需求选择方案）</span></span>
<span class="line"><span>│   │   │   └── [storage_service].py</span></span>
<span class="line"><span>│   │   ├── cache/               # 缓存服务（可选，如需要）</span></span>
<span class="line"><span>│   │   └── utils/               # 共享工具</span></span>
<span class="line"><span>│   ├── modules/                 # 业务模块</span></span>
<span class="line"><span>│   │   ├── user/</span></span>
<span class="line"><span>│   │   │   ├── models.py</span></span>
<span class="line"><span>│   │   │   ├── schemas.py</span></span>
<span class="line"><span>│   │   │   ├── repositories.py</span></span>
<span class="line"><span>│   │   │   ├── services.py</span></span>
<span class="line"><span>│   │   │   ├── routers.py</span></span>
<span class="line"><span>│   │   │   └── dependencies.py</span></span>
<span class="line"><span>│   │   └── ...</span></span>
<span class="line"><span>│   └── api/                     # API 统一注册</span></span>
<span class="line"><span>│       └── router.py</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── Dockerfile                    # 生产环境 Dockerfile</span></span>
<span class="line"><span>├── .dockerignore</span></span>
<span class="line"><span>├── .env.development              # 开发环境变量</span></span>
<span class="line"><span>├── .env.production               # 生产环境变量</span></span>
<span class="line"><span>├── .env.example                  # 环境变量示例</span></span>
<span class="line"><span>├── main.py                       # 应用入口</span></span>
<span class="line"><span>├── pyproject.toml                # 项目配置和依赖（使用 uv 管理）</span></span>
<span class="line"><span>├── uv.lock                       # 锁定的依赖版本（使用 uv 生成）</span></span>
<span class="line"><span>└── README.md</span></span></code></pre></div><h3 id="_3-3-data-和-config-目录结构" tabindex="-1">3.3 Data 和 Config 目录结构 <a class="header-anchor" href="#_3-3-data-和-config-目录结构" aria-label="Permalink to &quot;3.3 Data 和 Config 目录结构&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>data/</span></span>
<span class="line"><span>├── uploads/                      # 本地临时上传（如需要）</span></span>
<span class="line"><span>│   └── temp/                     # 临时文件（定期清理）</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── logs/                         # 日志文件</span></span>
<span class="line"><span>│   ├── backend/                 # 后端日志</span></span>
<span class="line"><span>│   ├── frontend/                # 前端日志（如需要）</span></span>
<span class="line"><span>│   └── nginx/                   # Nginx 日志</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── database/                     # 数据库相关</span></span>
<span class="line"><span>    ├── scripts/                 # SQL 脚本</span></span>
<span class="line"><span>    └── backups/                 # 数据库备份</span></span>
<span class="line"><span></span></span>
<span class="line"><span>config/</span></span>
<span class="line"><span>├── development/                  # 开发环境配置</span></span>
<span class="line"><span>│   ├── backend.env</span></span>
<span class="line"><span>│   └── frontend.env</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>├── production/                   # 生产环境配置</span></span>
<span class="line"><span>│   ├── backend.env</span></span>
<span class="line"><span>│   └── frontend.env</span></span>
<span class="line"><span>│</span></span>
<span class="line"><span>└── nginx/                        # Nginx 配置</span></span>
<span class="line"><span>    └── default.conf</span></span></code></pre></div><p><strong>管理要点：</strong></p><ul><li>所有运行时数据统一放在 <code>data/</code> 目录，通过 <code>.gitignore</code> 排除，通过 volume 挂载到容器</li><li>配置文件按环境分离，敏感信息使用环境变量管理</li></ul><h2 id="四、docker-配置" tabindex="-1">四、Docker 配置 <a class="header-anchor" href="#四、docker-配置" aria-label="Permalink to &quot;四、Docker 配置&quot;">​</a></h2><h3 id="_4-1-配置组织方式" tabindex="-1">4.1 配置组织方式 <a class="header-anchor" href="#_4-1-配置组织方式" aria-label="Permalink to &quot;4.1 配置组织方式&quot;">​</a></h3><p>本项目采用<strong>集中管理 + 脚本封装</strong>的方式组织 Docker 配置：</p><ul><li><strong>配置集中</strong>：所有 <code>docker-compose.*.yml</code> 文件放在 <code>docker/</code> 目录</li><li><strong>脚本封装</strong>：通过 <code>scripts/docker.sh</code> 统一管理，简化使用</li><li><strong>环境分离</strong>：开发和生产使用不同的 compose 文件</li></ul><h3 id="_4-2-管理脚本" tabindex="-1">4.2 管理脚本 <a class="header-anchor" href="#_4-2-管理脚本" aria-label="Permalink to &quot;4.2 管理脚本&quot;">​</a></h3><p><strong>scripts/docker.sh</strong> - Docker Compose 统一管理脚本</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># scripts/docker.sh - Docker Compose 统一管理脚本</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">set</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">COMPOSE_DIR</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;docker&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">DEV_FILE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">COMPOSE_DIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}/docker-compose.dev.yml&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PROD_FILE</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;\${</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">COMPOSE_DIR</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">}/docker-compose.prod.yml&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">check_file</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ]; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">then</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;❌ 文件不存在: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fi</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">show_usage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;Docker Compose 管理脚本&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;用法: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> {dev|prod} [docker-compose 命令]&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;示例:&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;  </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev up -d              # 启动开发环境&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;  </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev logs -f backend    # 查看后端日志&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;  </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$0</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prod up -d --build     # 构建并启动生产环境&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">case</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> in</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">    dev</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        check_file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$DEV_FILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        shift</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        docker-compose</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$DEV_FILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$@</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ;;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;">    prod</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        check_file</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$PROD_FILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        shift</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        docker-compose</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$PROD_FILE</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$@</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ;;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    *)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        show_usage</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ;;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">esac</span></span></code></pre></div><p><strong>使用前确保脚本有执行权限：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">chmod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> scripts/docker.sh</span></span></code></pre></div><p><strong>Windows 用户</strong>：可使用 Git Bash 运行脚本，或直接使用 <code>docker-compose -f docker/docker-compose.dev.yml</code> 命令。</p><h3 id="_4-3-开发环境配置" tabindex="-1">4.3 开发环境配置 <a class="header-anchor" href="#_4-3-开发环境配置" aria-label="Permalink to &quot;4.3 开发环境配置&quot;">​</a></h3><p><strong>docker/docker-compose.dev.yml</strong></p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 后端服务</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  backend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">python:3.11-slim</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-backend-dev</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    working_dir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/app</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 挂载源代码，支持热重载</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../backend:/app</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 挂载数据目录</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../data/logs/backend:/app/logs</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      # 挂载配置文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../config/development/backend.env:/app/.env</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;8000:8000&quot;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # FastAPI</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">ENV=development</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">DEBUG=true</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    command</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">      sh -c &quot;uv sync &amp;&amp;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">             uvicorn main:app --host 0.0.0.0 --port 8000 --reload&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    depends_on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">db</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 数据库（核心服务）</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  db</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">postgres:15-alpine</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-db-dev</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_DB=myapp_dev</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_USER=dev_user</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_PASSWORD=dev_password</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;5432:5432&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">postgres_data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  postgres_data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  app-network</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">bridge</span></span></code></pre></div><p><strong>说明：</strong></p><ul><li>前端不在此 compose 中，在宿主机运行 Vite Dev Server</li><li>后端代码通过 volume 挂载，修改后自动重载</li><li>数据库作为核心服务，必须配置</li></ul><h3 id="_4-4-生产环境配置" tabindex="-1">4.4 生产环境配置 <a class="header-anchor" href="#_4-4-生产环境配置" aria-label="Permalink to &quot;4.4 生产环境配置&quot;">​</a></h3><p><strong>docker/docker-compose.prod.yml</strong></p><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">version</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">services</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 前端服务（Nginx）</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  frontend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      context</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../frontend</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      dockerfile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Dockerfile</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-frontend-prod</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;80:80&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../config/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../data/logs/nginx:/var/log/nginx</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    depends_on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">backend</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-network</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">always</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 后端服务</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  backend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    build</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      context</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../backend</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      dockerfile</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">Dockerfile</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-backend-prod</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;8000:8000&quot;</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../data/logs/backend:/app/logs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../config/production/backend.env:/app/.env</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">ENV=production</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">DEBUG=false</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    command</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    depends_on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">db</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-network</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">always</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 数据库（核心服务）</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  db</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    image</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">postgres:15-alpine</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    container_name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-db-prod</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    environment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_DB=\${DB_NAME}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_USER=\${DB_USER}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">POSTGRES_PASSWORD=\${DB_PASSWORD}</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">postgres_data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">../data/database/backups:/backups</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      - </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">app-network</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">always</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">volumes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  postgres_data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">networks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  app-network</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    driver</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">bridge</span></span></code></pre></div><p><strong>注意：</strong> 生产环境后端使用 <code>--workers 4</code>，建议根据 CPU 核心数调整（通常为 <code>CPU核心数 * 2 + 1</code>）。</p><h2 id="五、快速开始" tabindex="-1">五、快速开始 <a class="header-anchor" href="#五、快速开始" aria-label="Permalink to &quot;五、快速开始&quot;">​</a></h2><h3 id="_5-1-初始化项目" tabindex="-1">5.1 初始化项目 <a class="header-anchor" href="#_5-1-初始化项目" aria-label="Permalink to &quot;5.1 初始化项目&quot;">​</a></h3><p><strong>1. 创建项目目录结构</strong></p><ul><li>按照&quot;一、项目结构概览&quot;章节创建完整的目录结构</li></ul><p><strong>2. 初始化前后端项目</strong></p><ul><li><strong>前端</strong>：使用 Vue 3 官方模板或 Vite 创建项目，参考 <a href="https://blog.mapin.net/posts/Vue%203%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">Vue 3 项目工程化结构设计指南</a></li><li><strong>后端</strong>：创建 FastAPI 项目，参考 <a href="https://blog.mapin.net/posts/FastAPI%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">FastAPI 项目工程化结构设计指南</a></li></ul><p><strong>3. 配置环境变量</strong></p><ul><li>在 <code>config/development/</code> 和 <code>config/production/</code> 目录下创建环境变量文件</li><li>提供 <code>.env.example</code> 作为模板</li></ul><p><strong>4. 创建 Docker 配置和管理脚本</strong></p><ul><li>创建 <code>docker/docker-compose.dev.yml</code> 和 <code>docker/docker-compose.prod.yml</code></li><li>创建 <code>scripts/docker.sh</code> 统一管理脚本</li><li>创建 <code>scripts/dev/start.sh</code> 和 <code>scripts/dev/stop.sh</code> 开发环境脚本</li><li>设置脚本执行权限：<code>chmod +x scripts/docker.sh scripts/dev/*.sh</code></li></ul><p><strong>5. 安装依赖并启动</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装前端依赖</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> frontend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ..</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装后端依赖（使用 uv，需先安装 uv）</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> backend</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sync</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;&amp; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ..</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动开发环境</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/dev/start.sh</span></span></code></pre></div><h3 id="_5-2-开发流程" tabindex="-1">5.2 开发流程 <a class="header-anchor" href="#_5-2-开发流程" aria-label="Permalink to &quot;5.2 开发流程&quot;">​</a></h3><ol><li><strong>启动开发环境</strong>：<code>./scripts/dev/start.sh</code></li><li><strong>前端开发</strong>：修改 <code>frontend/src/</code> 中的代码，Vite 自动热重载</li><li><strong>后端开发</strong>：修改 <code>backend/app/</code> 中的代码，Uvicorn 自动重载</li><li><strong>查看日志</strong>： <ul><li>后端日志：<code>tail -f data/logs/backend/app.log</code></li><li>Docker 日志：<code>./scripts/docker.sh dev logs -f backend</code></li></ul></li><li><strong>停止环境</strong>：<code>./scripts/dev/stop.sh</code></li></ol><h3 id="_5-3-docker-管理" tabindex="-1">5.3 Docker 管理 <a class="header-anchor" href="#_5-3-docker-管理" aria-label="Permalink to &quot;5.3 Docker 管理&quot;">​</a></h3><p><strong>开发环境：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 启动</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        # 查看日志</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ps</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">             # 查看状态</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> down</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # 停止</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> backend</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  # 重启服务</span></span></code></pre></div><p><strong>生产环境：</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --build</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 构建并启动</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # 查看日志</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ps</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">            # 查看状态</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prod</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> down</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">          # 停止</span></span></code></pre></div><h3 id="_5-4-开发启动脚本" tabindex="-1">5.4 开发启动脚本 <a class="header-anchor" href="#_5-4-开发启动脚本" aria-label="Permalink to &quot;5.4 开发启动脚本&quot;">​</a></h3><p><strong>scripts/dev/start.sh</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># scripts/dev/start.sh - 启动开发环境（前端 + 后端）</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">set</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -e</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;🚀 启动开发环境...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检查 Docker</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> !</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> info</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> 2&gt;&amp;1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">then</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;❌ Docker 未运行，请先启动 Docker&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    exit</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动后端服务</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;📦 启动后端容器（PostgreSQL + Backend）...&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> db</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> up</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> backend</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sleep</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动前端开发服务器</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;🎨 启动前端开发服务器...&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> frontend</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">!</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;node_modules&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ]; </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">then</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;📦 安装前端依赖...&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;✅ 开发环境已启动！&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;📋 服务地址：&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;   - 前端: http://localhost:5173&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;   - 后端: http://localhost:8000&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;   - API 文档: http://localhost:8000/docs&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;&quot;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;按 Ctrl+C 停止服务&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">FRONTEND_PID</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">$!</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">trap</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;echo &#39;🛑 停止服务...&#39;; kill </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$FRONTEND_PID</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 2&gt;/dev/null; ./scripts/docker.sh dev down; exit&quot;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> INT</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> TERM</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">wait</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $FRONTEND_PID</span></span></code></pre></div><p><strong>scripts/dev/stop.sh</strong></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># scripts/dev/stop.sh - 停止开发环境</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;🛑 停止开发环境...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 停止前端</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pkill</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;vite&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ||</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 停止 Docker 服务</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./scripts/docker.sh</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> down</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;✅ 开发环境已停止&quot;</span></span></code></pre></div><h2 id="六、技术选型与扩展" tabindex="-1">六、技术选型与扩展 <a class="header-anchor" href="#六、技术选型与扩展" aria-label="Permalink to &quot;六、技术选型与扩展&quot;">​</a></h2><h3 id="_6-1-设计原则" tabindex="-1">6.1 设计原则 <a class="header-anchor" href="#_6-1-设计原则" aria-label="Permalink to &quot;6.1 设计原则&quot;">​</a></h3><p>采用<strong>最小可维护性 + 可扩展性</strong>的设计原则：</p><ul><li><strong>核心服务</strong>：数据库（PostgreSQL）是必须的</li><li><strong>可选服务</strong>：文件存储、缓存、消息队列等服务根据项目需求按需添加</li><li><strong>灵活扩展</strong>：通过 Docker Compose 轻松添加新服务，不影响核心功能</li></ul><h3 id="_6-2-可选服务选型建议" tabindex="-1">6.2 可选服务选型建议 <a class="header-anchor" href="#_6-2-可选服务选型建议" aria-label="Permalink to &quot;6.2 可选服务选型建议&quot;">​</a></h3><table tabindex="0"><thead><tr><th>服务类型</th><th>小型项目</th><th>中型项目</th><th>大型项目</th></tr></thead><tbody><tr><td><strong>文件存储</strong></td><td>本地文件存储</td><td>MinIO 自托管</td><td>AWS S3 / 阿里云 OSS</td></tr><tr><td><strong>缓存</strong></td><td>内存缓存</td><td>Redis</td><td>Redis（集群）</td></tr><tr><td><strong>消息队列</strong></td><td>Redis Streams（如有 Redis）</td><td>RabbitMQ</td><td>Kafka</td></tr><tr><td><strong>监控</strong></td><td>简单文件日志</td><td>Prometheus + Grafana</td><td>Prometheus + Grafana + ELK</td></tr></tbody></table><h3 id="_6-3-添加服务的通用步骤" tabindex="-1">6.3 添加服务的通用步骤 <a class="header-anchor" href="#_6-3-添加服务的通用步骤" aria-label="Permalink to &quot;6.3 添加服务的通用步骤&quot;">​</a></h3><ol><li><p><strong>在 Docker Compose 中添加服务配置</strong></p><ul><li>在 <code>docker/docker-compose.dev.yml</code> 和 <code>docker/docker-compose.prod.yml</code> 中添加服务定义</li><li>配置网络、卷、环境变量等</li><li>更新相关服务的 <code>depends_on</code> 依赖</li></ul></li><li><p><strong>在后端代码中创建服务封装（如需要）</strong></p><ul><li>在 <code>backend/app/shared/</code> 下创建对应的服务目录</li><li>封装服务客户端，提供统一的接口</li></ul></li><li><p><strong>更新环境变量配置</strong></p><ul><li>在 <code>config/development/</code> 和 <code>config/production/</code> 中添加服务配置</li><li>提供 <code>.env.example</code> 模板</li></ul></li><li><p><strong>更新依赖文件</strong></p><ul><li>在 <code>backend/pyproject.toml</code> 中添加服务 SDK 依赖（使用 <code>uv add</code> 命令）</li><li>运行 <code>uv lock</code> 更新 <code>uv.lock</code> 文件</li></ul></li></ol><p><strong>服务集成示例位置：</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>backend/app/shared/</span></span>
<span class="line"><span>├── storage/              # 文件存储服务封装</span></span>
<span class="line"><span>├── cache/                # 缓存服务封装</span></span>
<span class="line"><span>├── messaging/            # 消息队列服务封装</span></span>
<span class="line"><span>└── monitoring/           # 监控服务封装</span></span></code></pre></div><p><strong>选择原则：</strong></p><ol><li><strong>按需添加</strong>：不要一开始就添加所有服务，根据实际需求逐步添加</li><li><strong>考虑成本</strong>：云服务按量付费，自托管需要维护成本</li><li><strong>保持简单</strong>：优先选择简单方案，复杂方案只在必要时使用</li></ol><h2 id="七、-gitignore-配置" tabindex="-1">七、.gitignore 配置 <a class="header-anchor" href="#七、-gitignore-配置" aria-label="Permalink to &quot;七、.gitignore 配置&quot;">​</a></h2><h3 id="_7-1-配置组织原则" tabindex="-1">7.1 配置组织原则 <a class="header-anchor" href="#_7-1-配置组织原则" aria-label="Permalink to &quot;7.1 配置组织原则&quot;">​</a></h3><p><code>.gitignore</code> 配置采用<strong>分层管理</strong>的方式：</p><ul><li><strong>项目根目录</strong>：管理项目级别的忽略规则（数据、配置、构建产物等）</li><li><strong>前端目录</strong>：管理前端特定的忽略规则（Node.js 依赖、构建产物等）</li><li><strong>后端目录</strong>：管理后端特定的忽略规则（Python 依赖、缓存等）</li></ul><h3 id="_7-2-关键规则" tabindex="-1">7.2 关键规则 <a class="header-anchor" href="#_7-2-关键规则" aria-label="Permalink to &quot;7.2 关键规则&quot;">​</a></h3><p><strong>项目根目录 <code>.gitignore</code> 关键规则：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 数据目录（运行时数据，不提交到版本控制）</span></span>
<span class="line"><span>data/uploads/</span></span>
<span class="line"><span>data/logs/</span></span>
<span class="line"><span>data/database/backups/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 配置文件（敏感信息，使用 .env.example 作为模板）</span></span>
<span class="line"><span>config/development/*.env</span></span>
<span class="line"><span>config/production/*.env</span></span>
<span class="line"><span>*.env</span></span>
<span class="line"><span>!.env.example</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 构建产物</span></span>
<span class="line"><span>frontend/dist/</span></span>
<span class="line"><span>backend/dist/</span></span>
<span class="line"><span>backend/*.egg-info/</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 依赖目录</span></span>
<span class="line"><span>node_modules/</span></span>
<span class="line"><span>__pycache__/</span></span>
<span class="line"><span>.venv/</span></span>
<span class="line"><span>venv/</span></span></code></pre></div><p><strong>前端目录 <code>.gitignore</code> 关键规则：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>node_modules/</span></span>
<span class="line"><span>dist/</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span></code></pre></div><p><strong>后端目录 <code>.gitignore</code> 关键规则：</strong></p><div class="language-text vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__pycache__/</span></span>
<span class="line"><span>*.pyc</span></span>
<span class="line"><span>.venv/</span></span>
<span class="line"><span>venv/</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.local</span></span>
<span class="line"><span>*.log</span></span></code></pre></div><h3 id="_7-3-详细配置参考" tabindex="-1">7.3 详细配置参考 <a class="header-anchor" href="#_7-3-详细配置参考" aria-label="Permalink to &quot;7.3 详细配置参考&quot;">​</a></h3><blockquote><p>💡 <strong>详细配置</strong>：如需了解完整的 <code>.gitignore</code> 配置规则、最佳实践、常见问题处理等，请参考 <a href="https://blog.mapin.net/posts/gitignore%20%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">gitignore 配置指南</a>。</p></blockquote><h2 id="八、参考资源" tabindex="-1">八、参考资源 <a class="header-anchor" href="#八、参考资源" aria-label="Permalink to &quot;八、参考资源&quot;">​</a></h2><h3 id="相关指南" tabindex="-1">相关指南 <a class="header-anchor" href="#相关指南" aria-label="Permalink to &quot;相关指南&quot;">​</a></h3><ul><li><strong><a href="https://blog.mapin.net/posts/Vue%203%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">Vue 3 项目工程化结构设计指南</a></strong>：详细说明 Vue 3 前端项目的目录结构、模块化设计、命名规范等</li><li><strong><a href="https://blog.mapin.net/posts/FastAPI%20%E9%A1%B9%E7%9B%AE%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%BB%93%E6%9E%84%E8%AE%BE%E8%AE%A1%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">FastAPI 项目工程化结构设计指南</a></strong>：详细说明 FastAPI 后端项目的目录结构、分层架构、数据库设计等</li><li><strong><a href="https://blog.mapin.net/posts/uv%20Python%20%E5%8C%85%E7%AE%A1%E7%90%86%E5%99%A8%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">uv Python 包管理器使用指南</a></strong>：介绍 uv（由 Astral 开发的极快 Python 包管理器），比 pip 快 10-100 倍，可替代 pip、pip-tools、pipx、poetry、virtualenv 等多个工具</li><li><strong><a href="https://blog.mapin.net/posts/gitignore%20%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8D%97" target="_blank" rel="noreferrer">gitignore 配置指南</a></strong>：完整的 <code>.gitignore</code> 配置规则、最佳实践、常见问题处理</li></ul><h3 id="官方文档" tabindex="-1">官方文档 <a class="header-anchor" href="#官方文档" aria-label="Permalink to &quot;官方文档&quot;">​</a></h3><ul><li><a href="https://vuejs.org/" target="_blank" rel="noreferrer">Vue 3 官方文档</a></li><li><a href="https://fastapi.tiangolo.com/" target="_blank" rel="noreferrer">FastAPI 官方文档</a></li><li><a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">TypeScript 官方文档</a></li><li><a href="https://vitejs.dev/" target="_blank" rel="noreferrer">Vite 官方文档</a></li><li><a href="https://docs.docker.com/" target="_blank" rel="noreferrer">Docker 官方文档</a></li></ul><h3 id="相关工具" tabindex="-1">相关工具 <a class="header-anchor" href="#相关工具" aria-label="Permalink to &quot;相关工具&quot;">​</a></h3><ul><li><a href="https://pinia.vuejs.org/" target="_blank" rel="noreferrer">Pinia 官方文档</a> - Vue 状态管理</li><li><a href="https://router.vuejs.org/" target="_blank" rel="noreferrer">Vue Router 官方文档</a> - Vue 路由</li><li><a href="https://docs.sqlalchemy.org/" target="_blank" rel="noreferrer">SQLAlchemy 官方文档</a> - Python ORM</li><li><a href="https://docs.pydantic.dev/" target="_blank" rel="noreferrer">Pydantic 官方文档</a> - 数据验证</li></ul>`,90))])}const b=l(o,[["render",c]]);export{B as __pageData,b as default};
