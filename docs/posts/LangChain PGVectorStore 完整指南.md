---
title: LangChain PGVectorStore 完整指南
description: LangChain PGVectorStore 实战指南，包含 FastAPI 集成、数据库连接管理、Embedding API 兼容性配置、常见问题解决方案和性能优化建议。基于实际项目经验，专注于生产环境最佳实践。
date: 2025-12-12 18:04:14
tags:
  - RAG
  - LangChain
  - pgvector
  - FastAPI
---

# LangChain PGVectorStore 完整指南

> 基于官方文档和实际项目经验，提供 PGVectorStore 的完整实战指南。包含 FastAPI 集成、数据库连接管理、Embedding API 兼容性配置、常见问题解决方案和性能优化建议。

## 目录

- [简介与快速开始](#简介与快速开始)
- [环境准备与安装](#环境准备与安装)
- [数据库连接与引擎管理](#数据库连接与引擎管理)
- [Embedding 模型配置](#embedding-模型配置)
- [核心使用指南](#核心使用指南)
- [数据库表结构配置](#数据库表结构配置)
- [常见问题与解决方案](#常见问题与解决方案)
- [性能优化](#性能优化)
- [FastAPI 集成最佳实践](#fastapi-集成最佳实践)
- [参考资源](#参考资源)

---

## 简介与快速开始

### 什么是 PGVectorStore？

**PGVectorStore** 是 LangChain 官方推荐的 PostgreSQL 向量存储实现，专为 FastAPI 等异步应用设计。

**核心优势**：
- ✅ **异步 API**：原生支持 FastAPI，无需同步包装
- ✅ **生产就绪**：官方主要推荐方向，持续维护
- ✅ **灵活集成**：支持自定义表结构，可集成现有数据库
- ✅ **性能优化**：基于 `asyncpg` 驱动，连接池管理完善

### 为什么选择 PGVectorStore？

| 特性 | 说明 |
|------|------|
| **官方推荐** | LangChain 官方主要推荐方向，维护优先级高 |
| **异步支持** | 原生异步 API，与 FastAPI 完美配合 |
| **灵活表结构** | 支持使用已存在的表，可配置列名映射 |
| **生产就绪** | 支持数据迁移，避免 Schema 变更问题 |

### FastAPI 最小示例

```python
from fastapi import FastAPI
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

app = FastAPI()

# 全局变量（实际应用中应使用依赖注入）
pg_engine = None
vector_store = None

@app.on_event("startup")
async def startup():
    global pg_engine, vector_store
    
    # 1. 创建 Embedding 服务
    embedding = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key="your-api-key",
    )
    
    # 2. 创建 PGEngine（独立连接池）
    connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
    pg_engine = PGEngine.from_connection_string(url=connection_string)
    
    # 3. 创建 PGVectorStore
    vector_store = await PGVectorStore.create(
        engine=pg_engine,
        table_name="vectors",
        embedding_service=embedding,
    )

@app.post("/documents")
async def add_documents(docs: list[dict]):
    """添加文档"""
    documents = [
        Document(page_content=doc["content"], metadata=doc.get("metadata", {}))
        for doc in docs
    ]
    await vector_store.aadd_documents(documents)
    return {"status": "success"}

@app.get("/search")
async def search(query: str, k: int = 5):
    """相似度搜索"""
    results = await vector_store.asimilarity_search(query, k=k)
    return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
```

---

## 环境准备与安装

### 官方代码仓库

> https://github.com/pgvector/pgvector  
> https://github.com/langchain-ai/langchain-postgres/

### 安装环境要求

⚠️ **重要提示**：`pgvector` 扩展需要编译 C 扩展，在 Windows 上安装复杂且容易出错。

#### 推荐运行环境

**强烈推荐**在以下环境中运行：

1. **Docker 容器**（最推荐）
   ```bash
   # 运行 PostgreSQL + pgvector 容器
   docker run --name pgvector \
     -e POSTGRES_USER=langchain \
     -e POSTGRES_PASSWORD=langchain \
     -e POSTGRES_DB=langchain \
     -p 5432:5432 \
     -d pgvector/pgvector:pg16
   
   # 验证 pgvector 扩展已安装
   docker exec -it pgvector psql -U langchain -d langchain -c "CREATE EXTENSION IF NOT EXISTS vector;"
   ```
   
   **连接字符串**：
   ```python
   # Docker 运行在本地
   connection_string = "postgresql+asyncpg://langchain:langchain@localhost:5432/langchain"
   
   # Docker Compose 环境（使用服务名）
   connection_string = "postgresql+asyncpg://langchain:langchain@db:5432/langchain"
   ```

2. **Linux 系统**（推荐）- Ubuntu、Debian、CentOS 等主流发行版
3. **WSL (Windows Subsystem for Linux)** - 在 Windows 上使用 Linux 环境

#### Windows 用户建议

如果在 Windows 上开发，推荐使用：
1. **Docker Desktop**（推荐）- 应用代码在 Windows，数据库在容器中
2. **WSL2**（最简单）- 完整 Linux 环境
3. **远程 Linux 服务器** - 通过网络连接数据库

### 依赖安装

#### 1. PostgreSQL + pgvector 扩展

**方式一：使用 Docker（推荐）**

```bash
docker run --name pgvector \
  -e POSTGRES_USER=langchain \
  -e POSTGRES_PASSWORD=langchain \
  -e POSTGRES_DB=langchain \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16

docker exec -it pgvector psql -U langchain -d langchain -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**方式二：在 Linux 系统上安装**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# 进入 PostgreSQL
sudo -u postgres psql

# 创建数据库和扩展
CREATE DATABASE langchain;
\c langchain
CREATE EXTENSION IF NOT EXISTS vector;
```

#### 2. Python 依赖

```bash
pip install langchain-core langchain-postgres langchain-openai pgvector psycopg[binary,pool] asyncpg
```

```python
# pyproject.toml 或 requirements.txt
langchain-core>=1.0.3
langchain-postgres>=0.0.5
langchain-openai>=1.0.2
pgvector>=0.3.6
psycopg[binary,pool]>=3.2.0
asyncpg
```

---

## 数据库连接与引擎管理

### 3.1 连接池架构（核心概念）

**核心理解**：
- **PGEngine** 管理一个**独立的连接池**到 PostgreSQL 数据库
- 这是 LangChain 官方推荐的行业最佳实践，用于管理连接数和减少延迟
- **连接池的独立性**：即使从 SQLAlchemy Engine 创建，PGEngine 也会创建自己的连接池

**连接池架构图**：

```mermaid
graph TB
    subgraph PostgreSQL["PostgreSQL Database<br/>(同一个数据库实例)"]
    end
    
    subgraph App["应用层"]
        SA[SQLAlchemy AsyncEngine<br/>连接池 A]
        PE[PGEngine<br/>连接池 B]
        
        SA -->|业务 ORM<br/>CRUD/事务/查询| ORM[业务数据操作]
        PE -->|向量存储<br/>相似搜索/向量删除| VS[PGVectorStore]
    end
    
    PostgreSQL <-->|独立连接池| SA
    PostgreSQL <-->|独立连接池| PE
    
    style SA fill:#e1f5ff
    style PE fill:#fff4e1
    style PostgreSQL fill:#f0f0f0
```

**关键点**：
- ✅ **两个连接池完全独立**：互不干扰，可以并发使用
- ✅ **连接到同一个数据库**：使用相同的连接字符串
- ✅ **各自管理连接生命周期**：SQLAlchemy 和 PGEngine 各自管理自己的连接
- ✅ **不会导致并发冲突**：因为连接池是独立的，不是共享的

### 3.2 PGEngine 创建方法

根据 [LangChain 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore)，PGEngine 支持两种创建方式，**两种方式都是官方推荐的标准用法**。

#### 方式一：使用 from_connection_string()（纯向量场景）

```python
from langchain_postgres import PGEngine

connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
pg_engine = PGEngine.from_connection_string(url=connection_string)
```

**适用场景**：
- ✅ 只使用 PGVectorStore，不需要 SQLAlchemy ORM
- ✅ 配置简单，直接使用连接字符串
- ✅ 快速启动项目

#### 方式二：使用 from_engine()（混合场景，推荐）

```python
from sqlalchemy.ext.asyncio import create_async_engine
from langchain_postgres import PGEngine

# 创建 SQLAlchemy AsyncEngine
sqlalchemy_engine = create_async_engine(connection_string)

# 从 SQLAlchemy Engine 创建 PGEngine
pg_engine = PGEngine.from_engine(engine=sqlalchemy_engine)
```

**工作原理**：
- `from_engine()` 会从 SQLAlchemy AsyncEngine **提取连接字符串**
- PGEngine 会**创建自己的独立连接池**（不会共享 SQLAlchemy 的连接）
- 两个连接池连接到同一个数据库，但**完全独立，互不干扰**

**适用场景**：
- ✅ 项目中同时使用 SQLAlchemy ORM 和 PGVectorStore
- ✅ 需要复用已有的 SQLAlchemy Engine 配置
- ✅ 需要同时进行业务查询和向量操作

**选择建议**：
- 纯向量场景 → 使用 `from_connection_string()`
- 混合场景（ORM + 向量）→ 使用 `from_engine()`（推荐）

### 3.3 连接字符串配置

#### 格式要求

```python
# ✅ 正确：异步连接字符串（必须）
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"

# ❌ 错误：同步连接字符串
connection_string = "postgresql://user:password@host:port/dbname"  # 会导致错误
```

**关键点**：
- 必须使用 `postgresql+asyncpg://` 前缀（不是 `postgresql://`）
- 支持标准 PostgreSQL 连接参数
- 连接字符串中的参数会被传递给 asyncpg 驱动

#### 连接字符串示例

```python
# 从配置文件读取（推荐）
from core.config import settings
pg_engine = PGEngine.from_connection_string(url=settings.database_url)

# 本地 Docker 容器
connection_string = "postgresql+asyncpg://langchain:langchain@localhost:5432/langchain"

# Docker Compose 环境（使用服务名）
connection_string = "postgresql+asyncpg://langchain:langchain@db:5432/langchain"

# 带 SSL 的连接
connection_string = "postgresql+asyncpg://user:password@host:5432/db?ssl=true"
```

### 3.4 与 SQLAlchemy 共存的最佳实践

**推荐方式：使用 `from_engine()` 复用配置**

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from langchain_postgres import PGEngine, PGVectorStore

# 1. SQLAlchemy 引擎（业务数据）
sqlalchemy_engine = create_async_engine(
    "postgresql+asyncpg://user:password@host:port/dbname",
    pool_size=10,
    max_overflow=20,
)

# 2. PGEngine（从 SQLAlchemy Engine 创建，但使用独立连接池）
pg_engine = PGEngine.from_engine(engine=sqlalchemy_engine)

# 3. 可以同时使用两个引擎
# - SQLAlchemy: 用于业务查询和原生 SQL
async with sqlalchemy_engine.begin() as conn:
    await conn.execute(text("UPDATE ..."))

# - PGEngine: 用于向量操作
vector_store = await PGVectorStore.create(engine=pg_engine, ...)
```

**工作流程**：

```mermaid
sequenceDiagram
    participant App as 应用代码
    participant SA as SQLAlchemy Engine
    participant PE as PGEngine
    participant DB as PostgreSQL

    Note over App,DB: 初始化阶段
    App->>SA: create_async_engine()
    SA->>DB: 创建连接池 A
    App->>PE: from_engine(SA)
    PE->>SA: 提取连接字符串
    PE->>DB: 创建连接池 B（独立）

    Note over App,DB: 运行时阶段
    App->>SA: 业务查询
    SA->>DB: 使用连接池 A
    DB-->>SA: 返回结果
    
    App->>PE: 向量操作
    PE->>DB: 使用连接池 B
    DB-->>PE: 返回结果
```

---

## Embedding 模型配置

### 4.1 OpenAI 官方 API

```python
from langchain_openai import OpenAIEmbeddings

embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key="your-api-key",
)
```

### 4.2 阿里云百炼等兼容 API（重点）

⚠️ **重要提示**：使用阿里云百炼等兼容 OpenAI 的 API 时，必须进行特殊配置。

#### 必需配置

```python
from langchain_openai import OpenAIEmbeddings

embedding = OpenAIEmbeddings(
    model="text-embedding-v4",  # 阿里云百炼模型名称
    api_key="your-dashscope-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",  # 阿里云百炼端点
    check_embedding_ctx_length=False,  # ⚠️ 必须禁用（关键配置）
    chunk_size=10,  # ⚠️ 必须限制为 10（阿里云百炼批量限制）
)
```

#### 配置说明

| 参数 | 说明 | 为什么需要 |
|------|------|-----------|
| `check_embedding_ctx_length=False` | 禁用客户端 token 检查 | LangChain 默认会使用 tiktoken 进行客户端分片，发送 token 列表而不是文本，导致兼容 API 报错 |
| `chunk_size=10` | 限制批处理大小为 10 | 阿里云百炼限制批量大小为 10（OpenAI 默认为 1000） |

#### 常见错误与解决方案

**错误 1**：`Value error, contents is neither str nor list of str`

**原因**：LangChain 使用 tiktoken 分片，发送了 token 列表而不是文本字符串。

**解决方案**：
```python
embedding = OpenAIEmbeddings(
    model="text-embedding-v4",
    api_key="your-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    check_embedding_ctx_length=False,  # 关键配置
)
```

**错误 2**：`batch size is invalid, it should not be larger than 10`

**原因**：批量大小超过 API 限制。

**解决方案**：
```python
embedding = OpenAIEmbeddings(
    model="text-embedding-v4",
    api_key="your-api-key",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    check_embedding_ctx_length=False,
    chunk_size=10,  # 关键配置
)
```

### 4.3 其他兼容 OpenAI 的 API

配置方式类似阿里云百炼，只需调整 `base_url`：

```python
# DeepSeek
embedding = OpenAIEmbeddings(
    model="deepseek-embedding",
    api_key="your-api-key",
    base_url="https://api.deepseek.com/v1",
    check_embedding_ctx_length=False,
    chunk_size=10,
)

# Azure OpenAI
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    api_key="your-api-key",
    base_url="https://your-resource.openai.azure.com/",
    check_embedding_ctx_length=False,
    chunk_size=1000,  # Azure OpenAI 支持更大的批量
)
```

---

## 核心使用指南

### 5.1 初始化 PGVectorStore

#### 创建新表（自动创建）

```python
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings

# 1. 创建 Embedding 服务
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key="your-api-key",
)

# 2. 创建 PGEngine
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
pg_engine = PGEngine.from_connection_string(url=connection_string)

# 3. 创建 PGVectorStore（自动创建表）
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embedding,
)
```

#### 使用已存在的表（配置列名映射）

```python
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="products",
    embedding_service=embedding,
    id_column="product_id",           # 自定义 ID 列名
    content_column="description",      # 自定义内容列名
    embedding_column="embed",          # 自定义向量列名
    metadata_columns=["name", "category"],  # 元数据列（用于过滤）
    metadata_json_column="metadata",   # JSON 元数据列
)
```

### 5.2 常用操作

#### 添加文档

```python
from langchain_core.documents import Document

documents = [
    Document(
        page_content="文档内容",
        metadata={"source": "doc1", "category": "tech"}
    ),
]

# 批量添加（推荐，自动批量处理）
await vector_store.aadd_documents(documents)
```

#### 相似度搜索

```python
# 基础搜索
results = await vector_store.asimilarity_search(
    query="查询文本",
    k=5,  # 返回前 5 个最相似的结果
)

# 带分数搜索（获取相似度分数）
results_with_score = await vector_store.asimilarity_search_with_score(
    query="查询文本",
    k=5,
)
# 返回格式: List[Tuple[Document, float]]
```

#### 过滤搜索

```python
# 使用 metadata_columns 中定义的字段过滤
results = await vector_store.asimilarity_search(
    query="查询文本",
    k=5,
    filter={"source": "doc1", "category": "tech"},  # 简单键值对过滤
)
```

**注意**：
- 只能使用 `metadata_columns` 中定义的字段
- 过滤值必须是字符串（UUID 需要转换为字符串）
- 支持复杂过滤操作符（如 `$in`、`$gte` 等，详见官方文档）

#### 删除文档

```python
# 根据 ID 删除
await vector_store.adelete(ids=["id1", "id2"])
```

---

## 数据库表结构配置

### 6.1 安装 pgvector 扩展

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 6.2 创建向量表

```sql
CREATE TABLE vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector,  -- 不指定维度，支持动态维度
    embedding_dimension INTEGER,  -- 可选：记录维度
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**关键点**：
- `embedding vector` 不指定维度，支持不同 embedding 模型（1536、3072 等）
- 使用 `embedding_dimension` 字段记录实际维度
- `metadata` 字段用于存储 JSON 格式的元数据

### 6.3 创建 HNSW 索引

```sql
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);
```

**参数说明**：
- `m`: 每个节点的最大连接数（16-64，越大质量越好但索引越大）
- `ef_construction`: 构建索引时的搜索范围（64-200，越大质量越好但构建越慢）
- `vector_cosine_ops`: 使用余弦相似度运算符

### 6.4 SQLAlchemy 模型定义

```python
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class VectorModel(Base):
    __tablename__ = "vectors"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(), nullable=False)  # 不指定维度
    embedding_dimension = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
```

---

## 常见问题与解决方案

### 7.1 Embedding API 兼容性问题

详见 [4.2 节 - 阿里云百炼等兼容 API](#42-阿里云百炼等兼容-api重点) 中的常见错误与解决方案。

### 7.2 连接池相关问题

#### 问题：`cannot perform operation: another operation is in progress`

**真实原因**：
- **asyncpg 驱动限制**：同一连接对象上不能并发执行操作
- **错误理解**：误以为 `from_engine()` 会共享连接池导致冲突
- **实际情况**：`from_engine()` 会创建独立连接池，不会导致此错误

**正确的理解**：
根据 [LangChain 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore)，`PGEngine.from_engine()` 是官方支持的标准方式：
- `from_engine()` 会从 SQLAlchemy Engine **提取连接字符串**
- PGEngine 会**创建自己的独立连接池**（不会共享 SQLAlchemy 的连接）
- 两个连接池**完全独立**，不会导致并发冲突

**如果遇到此错误，可能的原因**：
1. **在同一连接对象上并发操作**（不是连接池问题）
2. **连接池配置不当**（连接数不足）
3. **其他代码层面的并发问题**

**正确的解决方案**：

```python
# ✅ 方式一：使用 from_connection_string()（推荐用于纯向量场景）
pg_engine = PGEngine.from_connection_string(url=connection_string)

# ✅ 方式二：使用 from_engine()（推荐用于混合场景）
sqlalchemy_engine = create_async_engine(connection_string)
pg_engine = PGEngine.from_engine(engine=sqlalchemy_engine)  # ✅ 正确，不会冲突
```

### 7.3 连接字符串格式错误

**错误**：`TypeError: 'coroutine' object is not iterable`

**原因**：使用了同步连接字符串

**解决**：
```python
# ✅ 正确（异步）
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"

# ❌ 错误（同步）
connection_string = "postgresql://user:password@host:port/dbname"
```

### 7.4 列名映射错误

**错误**：`KeyError: 'column_name'` 或 `Column not found`

**原因**：表列名与配置的列名不匹配

**解决**：
```python
# 确保配置的列名与表列名一致
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embedding,
    id_column="id",              # 必须是表列名
    content_column="content",     # 必须是表列名
    embedding_column="embedding", # 必须是表列名
    metadata_columns=["source"],  # 必须是表列名
)
```

### 7.5 元数据过滤不工作

**问题**：使用 `filter` 参数时没有过滤效果

**原因**：过滤字段不在 `metadata_columns` 中，或值类型不匹配

**解决**：
```python
# 1. 确保字段在 metadata_columns 中定义
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embedding,
    metadata_columns=["source", "category"],  # 必须在这里定义
)

# 2. 过滤值必须是字符串（UUID 需要转换）
results = await vector_store.asimilarity_search(
    query="test",
    k=5,
    filter={"source": str(uuid_value)},  # UUID 转换为字符串
)

# 3. JSON 字段中的值不能直接过滤
# ❌ 错误：如果 "tags" 在 metadata_json_column 中
filter={"tags": "tech"}  # 不会工作

# ✅ 正确：如果 "tags" 在 metadata_columns 中
filter={"tags": "tech"}  # 可以工作
```

### 7.6 索引创建失败

**问题**：创建 HNSW 索引时失败

**原因**：pgvector 版本不支持 HNSW

**解决**：
```sql
-- 检查 pgvector 版本
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- 如果版本 < 0.5.0，使用 ivfflat 索引
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

-- 如果版本 >= 0.5.0，使用 HNSW 索引
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);
```

---

## 性能优化

### 8.1 索引参数调优

根据数据量选择合适的参数：

```sql
-- 小数据集 (< 10万)
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);

-- 中等数据集 (10万-100万)
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 32, ef_construction = 128);

-- 大数据集 (> 100万)
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 64, ef_construction = 200);
```

### 8.2 批量操作

```python
# 批量添加（推荐，自动批量处理）
await vector_store.aadd_documents(documents)

# 分批处理大量文档（注意 Embedding API 的限制）
batch_size = 10  # 如果使用阿里云百炼，限制为 10
for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    await vector_store.aadd_documents(batch)
```

### 8.3 查询优化

```python
# 1. 限制返回数量（建议 k <= 20）
results = await vector_store.asimilarity_search(query, k=5)

# 2. 使用过滤减少搜索范围
results = await vector_store.asimilarity_search(
    query=query,
    k=5,
    filter={"category": "tech"},  # 先过滤再搜索
)

# 3. 使用带分数的搜索（如果需要排序）
results = await vector_store.asimilarity_search_with_score(query, k=5)
```

### 8.4 索引维护

```sql
-- 重建索引（如果数据大量更新）
DROP INDEX IF EXISTS idx_vectors_embedding;
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);

-- 更新统计信息
ANALYZE vectors;
```

---

## FastAPI 集成最佳实践

### 9.1 依赖注入模式

```python
from fastapi import FastAPI, Depends
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

app = FastAPI()

# 全局 PGEngine（独立连接池）
pg_engine = None
embedding = None

@app.on_event("startup")
async def startup():
    global pg_engine, embedding
    
    # 创建 Embedding 服务
    embedding = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key="your-api-key",
        check_embedding_ctx_length=False,
        chunk_size=10,
    )
    
    # 创建 PGEngine（独立连接池）
    connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
    pg_engine = PGEngine.from_connection_string(url=connection_string)

# 依赖注入：获取 VectorStore
async def get_vector_store() -> PGVectorStore:
    return await PGVectorStore.create(
        engine=pg_engine,
        table_name="vectors",
        embedding_service=embedding,
    )

@app.post("/documents")
async def add_documents(
    docs: list[dict],
    vector_store: PGVectorStore = Depends(get_vector_store)
):
    documents = [
        Document(page_content=doc["content"], metadata=doc.get("metadata", {}))
        for doc in docs
    ]
    await vector_store.aadd_documents(documents)
    return {"status": "success", "count": len(documents)}

@app.get("/search")
async def search(
    query: str,
    k: int = 5,
    vector_store: PGVectorStore = Depends(get_vector_store)
):
    results = await vector_store.asimilarity_search(query, k=k)
    return [
        {
            "content": doc.page_content,
            "metadata": doc.metadata,
        }
        for doc in results
    ]
```

### 9.2 PGEngine 与 SQLAlchemy 引擎的共存

详见 [3.4 节 - 与 SQLAlchemy 共存的最佳实践](#34-与-sqlalchemy-共存的最佳实践)。

### 9.3 错误处理

```python
from fastapi import HTTPException
from langchain_postgres import PGVectorStore

@app.post("/documents")
async def add_documents(
    docs: list[dict],
    vector_store: PGVectorStore = Depends(get_vector_store)
):
    try:
        documents = [
            Document(page_content=doc["content"], metadata=doc.get("metadata", {}))
            for doc in docs
        ]
        await vector_store.aadd_documents(documents)
        return {"status": "success", "count": len(documents)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"添加文档失败: {str(e)}")
```

---

## 参考资源

### 官方文档

- [PGVectorStore 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore) - 异步 API，支持自定义表结构
- [pgvector 官方文档](https://github.com/pgvector/pgvector) - PostgreSQL 向量扩展
- [HNSW 索引说明](https://github.com/pgvector/pgvector#hnsw) - 高性能向量索引
- [阿里云百炼 Embedding 接口兼容](https://help.aliyun.com/zh/model-studio/embedding-interfaces-compatible-with-openai) - OpenAI 兼容接口说明

### API 参考

- [PGVectorStore API 参考](https://python.langchain.com/api_reference/postgres/v2/langchain_postgres.v2.vectorstores.PGVectorStore.html)
- [OpenAIEmbeddings API 参考](https://python.langchain.com/api_reference/integrations/text_embedding/langchain_openai.embeddings.OpenAIEmbeddings.html)
