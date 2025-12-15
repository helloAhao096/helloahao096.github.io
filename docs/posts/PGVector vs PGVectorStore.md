---
title: PGVector vs PGVectorStore
description: 深入对比 LangChain 中两个 pgvector 向量存储实现，基于官方文档提供推荐场景和选择指南，包含完整的技术实现、常见问题解决方案和性能优化建议。适合需要集成 LangChain 和 pgvector 的开发者参考。
date: 2025-12-12 18:04:14
tags:
  - RAG
  - LangChain
  - pgvector
  - FastAPI
---

# LangChain + pgvector 完整指南：PGVector vs PGVectorStore

> 深入对比 LangChain 中两个 pgvector 向量存储实现，基于官方文档提供推荐场景和选择指南。包含完整的技术实现、常见问题解决方案和性能优化建议。

## 目录

- [快速决策](#快速决策)
- [快速开始](#快速开始)
- [核心对比](#核心对比)
- [使用指南](#使用指南)
- [数据库配置](#数据库配置)
- [常见问题](#常见问题)
- [性能优化](#性能优化)
- [参考资源](#参考资源)

---

## 快速决策

### 30 秒决策表

| 场景 | 推荐选择 | 说明 |
|------|----------|------|
| **FastAPI 异步应用** | ⭐ PGVectorStore | 官方推荐，异步 API |
| **新项目** | ⭐ PGVectorStore | 官方主要推荐方向 |
| **需要集成现有数据库表** | ⭐ PGVectorStore | 唯一支持自定义表结构 |
| **生产环境** | ⭐ PGVectorStore | 避免数据迁移问题 |
| **需要复杂过滤操作符** | ⚠️ PGVector | 唯一优势，但需注意迁移限制 |
| **已有 PGVector 代码** | 评估迁移 | 建议逐步迁移到 PGVectorStore |

### 一句话总结

**FastAPI 应用：优先选择 PGVectorStore**（官方推荐，异步 API，生产就绪）

---

## 快速开始

### 官方代码仓库
> https://github.com/pgvector/pgvector
>
> https://github.com/langchain-ai/langchain-postgres/
### 安装环境要求

⚠️ **重要提示**：`pgvector` 扩展的安装需要编译 C 扩展，在不同平台上的安装体验差异较大。

#### Windows 平台限制

在 Windows 上安装 `pgvector` 需要：
- CMake 构建工具
- Visual Studio Build Tools 或 MinGW
- PostgreSQL 开发头文件

**安装过程复杂且容易出错**，不推荐在 Windows 原生环境直接安装。

#### 推荐运行环境

为了获得最佳的安装和运行体验，**强烈推荐**在以下环境中运行：

1. **Linux 系统**（推荐）
   - Ubuntu、Debian、CentOS 等主流 Linux 发行版
   - 安装简单，依赖管理方便

2. **WSL (Windows Subsystem for Linux)**
   - 在 Windows 上使用 Linux 环境
   - 安装命令：
     ```bash
     # 安装 WSL（以 Ubuntu 为例）
     wsl --install -d Ubuntu
     ```

3. **Docker 容器**（最推荐）
   - 环境隔离，配置简单，跨平台一致
   - 使用官方 PostgreSQL + pgvector 镜像：
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
   # 如果 Docker 运行在本地
   connection_string = "postgresql+asyncpg://langchain:langchain@localhost:5432/langchain"
   
   # 如果使用 Docker Compose，使用服务名
   connection_string = "postgresql+asyncpg://langchain:langchain@db:5432/langchain"
   ```

#### 为什么推荐 Linux 环境？

- ✅ 无需额外编译工具，包管理器直接提供预编译版本
- ✅ 依赖关系自动处理，安装过程简单
- ✅ 生产环境通常使用 Linux，开发环境保持一致
- ✅ Docker 容器化部署更方便

#### Windows 用户建议

如果你必须在 Windows 上开发，推荐使用以下方案：

1. **使用 WSL2**（最简单）
   ```bash
   # 安装 WSL2 和 Ubuntu
   wsl --install -d Ubuntu
   
   # 在 WSL 中安装 PostgreSQL 和 pgvector
   sudo apt-get update
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **使用 Docker Desktop**（推荐）
   - 安装 Docker Desktop for Windows
   - 使用上述 Docker 命令运行 PostgreSQL + pgvector
   - 应用代码在 Windows 上运行，数据库在容器中

3. **使用远程 Linux 服务器**
   - 在云服务器或远程 Linux 机器上运行 PostgreSQL
   - 应用通过网络连接数据库

### 依赖安装

#### 1. PostgreSQL + pgvector 扩展

**方式一：使用 Docker（推荐）**

```bash
# 运行 PostgreSQL + pgvector 容器
docker run --name pgvector \
  -e POSTGRES_USER=langchain \
  -e POSTGRES_PASSWORD=langchain \
  -e POSTGRES_DB=langchain \
  -p 5432:5432 \
  -d pgvector/pgvector:pg16

# 验证并创建扩展
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
# 使用 pip 安装
pip install langchain-core langchain-postgres langchain-openai pgvector psycopg[binary,pool] asyncpg
```

```python
langchain-core>=1.0.3
langchain-postgres>=0.0.5
langchain-openai>=1.0.2
pgvector>=0.3.6
psycopg[binary,pool]>=3.2.0
asyncpg
```

**注意**：`pgvector` Python 包只是客户端库，实际的 pgvector 扩展需要在 PostgreSQL 数据库中安装（见步骤 1）。

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
    
    # 2. 创建 PGEngine（异步连接）
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

## 核心对比

### 功能对比表

| 特性 | PGVector | PGVectorStore | 官方偏好 |
|------|----------|---------------|----------|
| **API 风格** | 同步 API | 异步 API | ✅ PGVectorStore |
| **FastAPI 兼容** | ⚠️ 需要同步包装 | ✅ 原生支持 | ✅ PGVectorStore |
| **连接驱动** | `psycopg3` | `asyncpg`（推荐）+ `psycopg3` | ✅ PGVectorStore |
| **使用已存在表** | ❌ 不支持 | ✅ 完全支持 | ✅ PGVectorStore |
| **列名映射** | ❌ 不支持 | ✅ 支持自定义 | ✅ PGVectorStore |
| **过滤操作符** | ✅ 12+ 操作符 | ⚠️ 基本过滤 | ⚠️ PGVector |
| **数据迁移** | ❌ 不支持 | ✅ 支持 | ✅ PGVectorStore |
| **维护优先级** | ⚠️ 较低 | ✅ 较高 | ✅ PGVectorStore |
| **生产就绪** | ⚠️ 有迁移限制 | ✅ 生产就绪 | ✅ PGVectorStore |

### 官方推荐说明

**PGVectorStore**：
- ✅ 官方主要推荐方向
- ✅ 持续维护和更新
- ✅ 适合 FastAPI 等异步应用
- ✅ 支持自定义表结构，可集成现有数据库

**PGVector**：
- ⚠️ 主要用于向后兼容
- ⚠️ Schema 变更需要重新创建表（官方明确限制）
- ⚠️ 如果担心数据迁移问题，官方建议使用其他 vectorstore

### 关键差异

1. **API 风格**：PGVectorStore 使用异步 API，与 FastAPI 完美配合
2. **表结构**：PGVectorStore 支持使用已存在的表，可配置列名映射
3. **过滤功能**：PGVector 支持更丰富的过滤操作符（唯一优势）
4. **数据迁移**：PGVector 不支持，PGVectorStore 支持

---

## 使用指南

### 初始化对比

#### PGVectorStore（推荐）

```python
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings

# 1. 创建 Embedding 服务
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key="your-api-key",
)

# 2. 创建 PGEngine（异步连接）
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
pg_engine = PGEngine.from_connection_string(url=connection_string)

# 3. 创建 PGVectorStore（自动创建表）
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embedding,
)

# 或使用已存在的表（配置列名映射）
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="products",
    embedding_service=embedding,
    id_column="product_id",
    content_column="description",
    embedding_column="embed",
    metadata_columns=["name", "category"],
    metadata_json_column="metadata",
)
```

#### PGVector（不推荐用于 FastAPI）

```python
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings

embedding = OpenAIEmbeddings(model="text-embedding-3-small")
connection = "postgresql+psycopg://user:password@host:port/dbname"

# 同步 API，需要包装才能在 FastAPI 中使用
vector_store = PGVector(
    embeddings=embedding,
    collection_name="my_docs",
    connection=connection,
)
```

### 常用操作对比

| 操作 | PGVectorStore | PGVector |
|------|---------------|----------|
| **添加文档** | `await vector_store.aadd_documents(docs)` | `vector_store.add_documents(docs)` |
| **搜索** | `await vector_store.asimilarity_search(query, k=5)` | `vector_store.similarity_search(query, k=5)` |
| **带分数搜索** | `await vector_store.asimilarity_search_with_score(query, k=5)` | `vector_store.similarity_search_with_score(query, k=5)` |
| **删除** | `await vector_store.adelete(ids=["id1"])` | `vector_store.delete(ids=["id1"])` |
| **过滤搜索** | `filter={"source": "doc1"}` | `filter={"id": {"$in": [1, 2]}}` |

### FastAPI 集成示例

#### 使用 PGVectorStore（推荐）

```python
from fastapi import FastAPI, Depends
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

app = FastAPI()

# 依赖注入
async def get_vector_store() -> PGVectorStore:
    embedding = OpenAIEmbeddings(model="text-embedding-3-small")
    pg_engine = PGEngine.from_connection_string(
        url="postgresql+asyncpg://user:password@host:port/dbname"
    )
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

@app.get("/search-with-filter")
async def search_with_filter(
    query: str,
    source: str,
    k: int = 5,
    vector_store: PGVectorStore = Depends(get_vector_store)
):
    results = await vector_store.asimilarity_search(
        query, k=k, filter={"source": source}
    )
    return [{"content": doc.page_content, "metadata": doc.metadata} for doc in results]
```

### 过滤功能对比

#### PGVectorStore（基本过滤）

```python
# 只能使用 metadata_columns 中定义的字段
results = await vector_store.asimilarity_search(
    query="test",
    k=5,
    filter={"source": "doc1", "category": "tech"},  # 简单键值对
)
```

#### PGVector（丰富过滤操作符）

```python
# 支持多种操作符
results = vector_store.similarity_search(
    "query",
    k=10,
    filter={
        "id": {"$in": [1, 2, 3]},
        "price": {"$gte": 100, "$lte": 500},
        "$or": [
            {"category": "tech"},
            {"category": "food"}
        ],
        "name": {"$like": "%apple%"},
    }
)
```

**PGVector 支持的过滤操作符**：
- `$eq`, `$ne`: 等于、不等于
- `$lt`, `$lte`, `$gt`, `$gte`: 比较操作
- `$in`, `$nin`: 包含、不包含
- `$between`: 范围
- `$like`, `$ilike`: 文本匹配
- `$and`, `$or`: 逻辑操作

---

## 数据库配置

### 1. 安装 pgvector 扩展

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. 创建向量表

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

### 3. 创建 HNSW 索引

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

### 4. SQLAlchemy 模型定义

```python
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID

class VectorModel(Base):
    __tablename__ = "vectors"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector(), nullable=False)  # 不指定维度
    embedding_dimension = Column(Integer, nullable=True)
    metadata = Column(JSON, nullable=True)
```

---

## 常见问题

### 1. 连接字符串格式错误

**错误**：`TypeError: 'coroutine' object is not iterable`

**原因**：使用了同步连接字符串

**解决**：
```python
# ✅ 正确（异步）
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"

# ❌ 错误（同步）
connection_string = "postgresql://user:password@host:port/dbname"
```

### 2. 列名映射错误

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

### 3. 元数据过滤不工作

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

### 4. 索引创建失败

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

### 1. 索引参数调优

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

### 2. 批量操作

```python
# 批量添加（推荐，自动批量处理）
await vector_store.aadd_documents(documents)

# 分批处理大量文档（建议每批 1000 条）
batch_size = 1000
for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    await vector_store.aadd_documents(batch)
```

### 3. 连接池配置

```python
from sqlalchemy.ext.asyncio import create_async_engine

# 根据并发请求数调整
engine = create_async_engine(
    connection_string,
    pool_size=10,        # 连接池大小（建议：并发数 / 2）
    max_overflow=20,      # 最大溢出连接数
    pool_timeout=30,      # 连接池超时时间（秒）
    pool_recycle=3600,    # 连接回收时间（秒）
)
```

### 4. 查询优化

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

### 5. 索引维护

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

## 参考资源

### 官方文档

- [PGVector 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvector) - 同步 API，丰富的过滤操作符
- [PGVectorStore 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore) - 异步 API，支持自定义表结构
- [pgvector 官方文档](https://github.com/pgvector/pgvector) - PostgreSQL 向量扩展
- [HNSW 索引说明](https://github.com/pgvector/pgvector#hnsw) - 高性能向量索引

### API 参考

- [PGVector API 参考](https://python.langchain.com/api_reference/postgres/vectorstores/langchain_postgres.vectorstores.PGVector.html)
- [PGVectorStore API 参考](https://python.langchain.com/api_reference/postgres/v2/langchain_postgres.v2.vectorstores.PGVectorStore.html)
