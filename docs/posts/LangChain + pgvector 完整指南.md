---
title: LangChain + pgvector 完整指南：PGVector vs PGVectorStore
description: 深入对比 LangChain 中两个 pgvector 向量存储实现，基于官方文档提供推荐场景和选择指南，包含完整的技术实现、常见问题解决方案和性能优化建议。适合需要集成 LangChain 和 pgvector 的开发者参考。
date: 2025-12-12 18:04:14
tags:
  - RAG
  - LangChain
  - pgvector
  - PostgreSQL
  - 向量数据库
  - 技术总结
---


# LangChain + pgvector 完整指南：PGVector vs PGVectorStore 对比与官方推荐

> 深入对比 LangChain 中两个 pgvector 向量存储实现，基于官方文档提供推荐场景和选择指南。包含完整的技术实现、常见问题解决方案和性能优化建议。

## 📋 文档概览

本文档是一份纯技术性总结笔记，专注于 LangChain 与 pgvector 的集成使用，不涉及业务逻辑。主要内容包括：

- ✅ **PGVector vs PGVectorStore 详细对比**：核心区别、功能对比、官方状态
- ✅ **官方推荐场景**：基于官方文档的推荐和偏好说明
- ✅ **快速开始指南**：最小实现示例和依赖安装
- ✅ **数据库配置**：pgvector 扩展、表结构、索引设计
- ✅ **完整使用示例**：PGVectorStore 和 PGVector 的使用方法
- ✅ **常见问题解决**：8 个常见问题及解决方案
- ✅ **性能优化建议**：索引优化、批量操作、连接池配置

**适用人群**：
- 需要集成 LangChain 和 pgvector 的开发者
- 需要在 PGVector 和 PGVectorStore 之间做选择的开发者
- 需要了解官方推荐和最佳实践的开发者

## 目录

- [PGVector vs PGVectorStore 对比](#pgvector-vs-pgvectorstore-对比)
- [快速开始](#快速开始)
- [数据库配置](#数据库配置)
- [LangChain PGVectorStore 使用](#langchain-pgvectorstore-使用)
- [LangChain PGVector 使用](#langchain-pgvector-使用)
- [常见问题与解决方案](#常见问题与解决方案)
- [性能优化建议](#性能优化建议)

---

## PGVector vs PGVectorStore 对比

LangChain 提供了两个基于 pgvector 的向量存储实现：**PGVector** 和 **PGVectorStore**。它们都来自 `langchain-postgres` 包，但有不同的设计和使用方式。

### 核心区别对比表

| 特性 | PGVector | PGVectorStore |
|------|----------|---------------|
| **API 风格** | 同步 API | 异步 API |
| **连接方式** | 连接字符串 | PGEngine 对象 |
| **连接驱动** | `psycopg3` (`postgresql+psycopg://`) | `asyncpg` 或 `psycopg3` |
| **实例化** | `PGVector(...)` | `await PGVectorStore.create(...)` |
| **方法命名** | `add_documents()`, `similarity_search()` | `aadd_documents()`, `asimilarity_search()` |
| **表/集合概念** | `collection_name` | `table_name` |
| **使用已存在表** | 不支持或支持有限 | ✅ 完全支持，可配置列名映射 |
| **过滤操作符** | ✅ 丰富的操作符（`$eq`, `$ne`, `$lt`, `$in`, `$and`, `$or` 等） | 基本元数据过滤 |
| **列名映射** | 不支持 | ✅ 支持自定义列名映射 |
| **连接池管理** | 自动管理 | 通过 PGEngine 管理 |
| **适用场景** | 简单同步场景 | 异步应用、需要自定义表结构 |

### 详细对比

#### 1. API 风格

**PGVector (同步)**:
```python
from langchain_postgres import PGVector

vector_store = PGVector(
    embeddings=embeddings,
    collection_name="my_docs",
    connection="postgresql+psycopg://user:pass@host:port/db",
)

# 同步方法
vector_store.add_documents(docs)
results = vector_store.similarity_search("query", k=5)
vector_store.delete(ids=["1"])
```

**PGVectorStore (异步)**:
```python
from langchain_postgres import PGVectorStore, PGEngine

pg_engine = PGEngine.from_connection_string(
    url="postgresql+asyncpg://user:pass@host:port/db"
)

vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embeddings,
)

# 异步方法（必须使用 await）
await vector_store.aadd_documents(docs)
results = await vector_store.asimilarity_search("query", k=5)
await vector_store.adelete(ids=["1"])
```

#### 2. 连接字符串格式

**PGVector**:
```python
# 使用 psycopg3（注意：驱动名是 psycopg，不是 psycopg3）
connection = "postgresql+psycopg://user:password@host:port/dbname"
```

**PGVectorStore**:
```python
# 使用 asyncpg（推荐）或 psycopg3
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"
# 或
connection_string = "postgresql+psycopg://user:password@host:port/dbname"
```

#### 3. 过滤功能

**PGVector** - 支持丰富的过滤操作符:
```python
# 支持多种操作符
results = vector_store.similarity_search(
    "query",
    k=10,
    filter={
        "id": {"$in": [1, 2, 3]},           # $in 操作符
        "price": {"$gte": 100, "$lte": 500}, # $gte, $lte 操作符
        "$or": [                             # $or 逻辑操作符
            {"category": "tech"},
            {"category": "food"}
        ],
        "name": {"$like": "%apple%"},        # $like 文本匹配
    }
)
```

**支持的过滤操作符**:
- `$eq`: 等于 (==)
- `$ne`: 不等于 (!=)
- `$lt`, `$lte`: 小于 (<), 小于等于 (<=)
- `$gt`, `$gte`: 大于 (>), 大于等于 (>=)
- `$in`, `$nin`: 包含, 不包含
- `$between`: 范围
- `$like`, `$ilike`: 文本匹配（区分/不区分大小写）
- `$and`, `$or`: 逻辑操作符

**PGVectorStore** - 基本元数据过滤:
```python
# 只能使用 metadata_columns 中定义的字段进行简单过滤
results = await vector_store.asimilarity_search(
    "query",
    k=5,
    filter={"source": "doc1", "category": "tech"},  # 简单键值对
)
```

#### 4. 使用已存在的表

**PGVector**:
- ❌ 不支持或支持有限
- 主要使用自动创建的表结构

**PGVectorStore**:
- ✅ 完全支持使用已存在的表
- 可以配置列名映射

```python
# 使用已存在的表，配置列名映射
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="products",  # 已存在的表
    embedding_service=embeddings,
    # 配置列名映射
    id_column="product_id",
    content_column="description",
    embedding_column="embed",
    metadata_columns=["name", "category", "price"],
    metadata_json_column="metadata",
)
```

#### 5. 表结构概念

**PGVector**:
- 使用 `collection_name` 概念
- 内部可能使用集合表结构

**PGVectorStore**:
- 使用 `table_name` 概念
- 直接操作 PostgreSQL 表
- 更符合 SQL 数据库的使用习惯

### 官方状态和推荐

#### PGVector 官方状态

根据 [官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvector)：

1. **迁移历史**: 
   - PGVector 从 `langchain-community` 迁移到 `langchain-postgres` 包
   - 这是一个**向后兼容的迁移**，但有一些重要变更
2. **重要限制**: 
   - ⚠️ **目前没有机制支持简单的数据迁移**（schema 变更时）
   - ⚠️ 任何 schema 变更都需要**重新创建表并重新添加文档**
   - ⚠️ **官方明确说明**: "If this is a concern, please use a different vectorstore"
   - 这意味着如果数据迁移是关注点，官方建议使用其他 vectorstore（包括 PGVectorStore）
3. **连接要求**: 
   - 必须使用 `psycopg3`（连接字符串格式：`postgresql+psycopg://`）
   - 注意：驱动名是 `psycopg`，不是 `psycopg3`，但实际使用的是 psycopg3
4. **API 变更**: 
   - 现在需要显式传递连接对象（不再自动管理）
   - Schema 变更以支持用户指定的 ID
5. **维护状态**: 
   - 功能稳定，但**不是官方主要推荐方向**
   - 主要用于向后兼容和特定场景

#### PGVectorStore 官方状态

根据 [官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore)：

1. **现代化设计**: 
   - 基于异步 API，更符合现代 Python 应用（FastAPI、异步框架）
   - 使用 `PGEngine` 进行连接管理，更灵活
2. **灵活的表结构**: 
   - ✅ 支持使用已存在的表
   - ✅ 可配置列名映射（`id_column`, `content_column`, `embedding_column` 等）
   - ✅ 支持 `metadata_columns` 用于过滤
3. **更好的集成**: 
   - 与 SQLAlchemy 和现有数据库架构集成更好
   - 可以无缝集成到现有数据库设计中
4. **连接驱动**: 
   - 支持 `asyncpg`（**官方推荐**，性能更好）
   - 也支持 `psycopg3`（兼容性）
5. **维护状态**: 
   - ✅ **官方主要推荐方向**
   - ✅ 持续维护和更新
   - ✅ 更适合生产环境使用

### 官方推荐场景

#### 🟢 官方推荐使用 PGVectorStore 的场景

1. **新项目**: 官方更推荐使用 PGVectorStore，因为它是更现代的设计
2. **异步应用**: FastAPI、异步 Web 框架等现代异步应用
3. **需要集成现有数据库**: 如果已有 PostgreSQL 数据库和表结构
4. **需要自定义表结构**: 需要与现有业务表结构集成
5. **生产环境**: 需要更好的连接池控制和资源管理

#### 🟡 可以使用 PGVector 的场景

1. **同步应用**: 传统的同步 Python 应用（Django、Flask 等）
2. **需要丰富过滤**: 需要复杂的过滤操作符（`$eq`, `$ne`, `$lt`, `$in`, `$and`, `$or` 等）
3. **简单场景**: 快速原型、简单项目，不需要自定义表结构
4. **已有 PGVector 代码**: 已有使用 PGVector 的代码，迁移成本高

### 快速决策指南

```
开始选择
  │
  ├─ 是新项目？
  │   ├─ 是 → ⭐ 选择 PGVectorStore（官方推荐）
  │   └─ 否 → 继续判断
  │
  ├─ 是异步应用？（FastAPI、异步框架）
  │   ├─ 是 → ⭐ 选择 PGVectorStore（官方推荐）
  │   └─ 否 → 继续判断
  │
  ├─ 需要集成现有数据库表？
  │   ├─ 是 → ⭐ 选择 PGVectorStore（唯一选择）
  │   └─ 否 → 继续判断
  │
  ├─ 需要复杂的过滤操作符？（$like, $ilike, $between 等）
  │   ├─ 是 → 考虑 PGVector（但注意迁移限制）
  │   └─ 否 → 继续判断
  │
  ├─ 已有 PGVector 代码？
  │   ├─ 是 → 评估迁移成本
  │   │        ├─ 成本低 → 迁移到 PGVectorStore
  │   │        └─ 成本高 → 继续使用 PGVector（但注意限制）
  │   └─ 否 → ⭐ 选择 PGVectorStore（官方推荐）
  │
  └─ 默认选择：⭐ PGVectorStore（官方推荐）
```

### 选择建议（带官方偏好）

#### ⭐ 推荐：优先选择 PGVectorStore

**官方偏好**: LangChain 官方更推荐使用 **PGVectorStore**，因为：

1. ✅ **现代化设计**: 异步 API，符合现代 Python 开发趋势
2. ✅ **更好的集成**: 与现有数据库架构集成更容易
3. ✅ **更灵活**: 支持自定义表结构和列名映射
4. ✅ **更好的维护性**: 官方更关注这个实现的发展
5. ✅ **生产就绪**: 更适合生产环境使用

**适用场景**:
- 🎯 **新项目**（强烈推荐）
- 🎯 异步应用（FastAPI、异步框架）
- 🎯 需要与现有数据库集成
- 🎯 需要自定义表结构
- 🎯 生产环境部署

#### ⚠️ 备选：PGVector（特定场景）

**使用场景**:
- 🔸 同步应用（Django、Flask 等传统框架）
- 🔸 需要丰富的过滤操作符（`$like`, `$ilike`, `$between` 等）
- 🔸 已有 PGVector 代码，迁移成本高
- 🔸 简单原型项目

**注意事项**:
- ⚠️ **Schema 变更需要重新创建表**（官方明确说明的限制）
- ⚠️ **官方建议**: 如果担心数据迁移问题，建议使用其他 vectorstore（包括 PGVectorStore）
- ⚠️ **维护优先级较低**: 主要用于向后兼容，不是官方主要发展方向
- ⚠️ **未来风险**: 可能不会获得与 PGVectorStore 同等的新功能和优化

### 迁移建议

如果你当前使用 PGVector，考虑迁移到 PGVectorStore：

1. **评估迁移成本**: 
   - 检查是否依赖 PGVector 的特定功能（如复杂过滤操作符）
   - 评估代码修改量

2. **迁移步骤**:
   ```python
   # 从 PGVector
   vector_store = PGVector(
       embeddings=embeddings,
       collection_name="my_docs",
       connection="postgresql+psycopg://...",
   )
   
   # 迁移到 PGVectorStore
   pg_engine = PGEngine.from_connection_string(
       url="postgresql+asyncpg://..."
   )
   vector_store = await PGVectorStore.create(
       engine=pg_engine,
       table_name="my_docs",  # 或使用现有表
       embedding_service=embeddings,
   )
   ```

3. **数据迁移**: 
   - 如果表结构相同，可以直接使用现有表
   - 如果不同，需要数据迁移脚本

### 总结对比

| 维度 | PGVector | PGVectorStore | 官方偏好 | 说明 |
|------|----------|---------------|----------|------|
| **推荐度** | ⚠️ 特定场景 | ⭐ **新项目推荐** | ✅ PGVectorStore | 官方明确推荐新项目使用 |
| **维护优先级** | ⚠️ 较低 | ✅ 较高 | ✅ PGVectorStore | 官方主要维护方向 |
| **现代化程度** | ⚠️ 传统同步 API | ✅ 现代异步 API | ✅ PGVectorStore | 符合现代 Python 开发趋势 |
| **生产就绪** | ⚠️ 有迁移限制 | ✅ 生产就绪 | ✅ PGVectorStore | 官方建议生产环境使用 |
| **数据迁移** | ❌ 不支持 | ✅ 支持 | ✅ PGVectorStore | PGVector 明确不支持 |
| **过滤功能** | ✅ 丰富（12+ 操作符） | ⚠️ 基本（键值对） | ⚠️ PGVector | 唯一优势 |
| **表结构灵活性** | ❌ 有限 | ✅ 完全支持 | ✅ PGVectorStore | 支持自定义列名映射 |
| **连接驱动** | ⚠️ 仅 psycopg3 | ✅ asyncpg（推荐）+ psycopg3 | ✅ PGVectorStore | 更多选择 |
| **集成现有数据库** | ❌ 不支持 | ✅ 完全支持 | ✅ PGVectorStore | 可无缝集成 |
| **官方建议** | ⚠️ 特定场景 | ⭐ **优先推荐** | ✅ PGVectorStore | 官方明确偏好 |

### 官方建议总结

根据官方文档和最佳实践：

1. **新项目**: ⭐ **强烈推荐使用 PGVectorStore**
2. **异步应用**: ⭐ **必须使用 PGVectorStore**
3. **生产环境**: ⭐ **推荐使用 PGVectorStore**（避免数据迁移问题）
4. **需要集成现有数据库**: ⭐ **必须使用 PGVectorStore**
5. **同步应用 + 复杂过滤**: 可以考虑 PGVector，但需注意限制
6. **已有 PGVector 代码**: 评估迁移成本，建议逐步迁移到 PGVectorStore

### 参考文档

- [PGVector 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvector) - 注意查看 Status 部分的限制说明
- [PGVectorStore 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore) - 官方推荐的现代化实现

---

## 快速开始

### 1. 依赖安装

```python
# pyproject.toml 或 requirements.txt
langchain-core>=1.0.3
langchain-postgres>=0.0.5
langchain-openai>=1.0.2  # 或其他 embedding 提供商
pgvector>=0.3.6
psycopg[binary,pool]>=3.2.0
asyncpg
```

### 2. 最小实现示例

```python
from langchain_postgres import PGVectorStore, PGEngine
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document

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
    table_name="vectors",  # 表名
    embedding_service=embedding,
)

# 4. 添加文档（自动生成 embedding）
documents = [
    Document(page_content="这是第一个文档", metadata={"source": "doc1"}),
    Document(page_content="这是第二个文档", metadata={"source": "doc2"}),
]
await vector_store.aadd_documents(documents)

# 5. 相似度搜索
results = await vector_store.asimilarity_search(
    query="文档",
    k=5,
)
```

---

## 数据库配置

### 1. 安装 pgvector 扩展

```sql
-- 在 PostgreSQL 数据库中执行
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. 创建向量表（使用已存在的表）

**场景**: 如果已有 SQLAlchemy 模型定义的表，需要配置列名映射。

```sql
-- 示例表结构
CREATE TABLE vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,           -- 文本内容
    embedding vector,                -- 向量（不指定维度）
    metadata JSONB,                  -- JSON 元数据
    created_at TIMESTAMP DEFAULT NOW()
);
```

**关键点**:
- `embedding vector` 不指定维度，支持动态维度
- 如果需要记录维度，添加 `embedding_dimension INTEGER` 字段

### 3. 创建向量索引

```sql
-- HNSW 索引（推荐，支持动态维度）
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);

-- 或使用 ivfflat 索引（需要固定维度）
-- CREATE INDEX idx_vectors_embedding 
--     ON vectors 
--     USING ivfflat (embedding vector_cosine_ops) 
--     WITH (lists = 100);
```

**索引选择**:
- **HNSW**: 支持动态维度，查询速度快，但索引较大
- **ivfflat**: 需要固定维度，索引较小，但查询速度较慢

**参数说明**:
- `m`: HNSW 每个节点的最大连接数（16-64，越大质量越好但索引越大）
- `ef_construction`: 构建索引时的搜索范围（64-200，越大质量越好但构建越慢）
- `vector_cosine_ops`: 使用余弦相似度运算符（还有 `vector_l2_ops`、`vector_ip_ops`）

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
    embedding_dimension = Column(Integer, nullable=True)  # 可选：记录维度
    metadata = Column(JSON, nullable=True)
```

---

## LangChain PGVectorStore 使用

### 1. 连接字符串格式

**关键**: 必须使用 `postgresql+asyncpg://` 格式（异步），而不是 `postgresql://`（同步）。

```python
# ✅ 正确（异步）
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"

# ❌ 错误（同步，不支持异步操作）
connection_string = "postgresql://user:password@host:port/dbname"
```

### 2. PGEngine 初始化

```python
from langchain_postgres import PGEngine

# 从连接字符串创建 PGEngine
pg_engine = PGEngine.from_connection_string(url=connection_string)

# 或使用同步连接（不推荐，仅用于同步场景）
# pg_engine = PGEngine.from_connection_string(
#     url="postgresql://user:password@host:port/dbname"
# )
```

### 3. PGVectorStore 创建（使用已存在的表）

**场景**: 如果表已存在（通过 SQLAlchemy 创建），需要配置列名映射。

```python
from langchain_postgres import PGVectorStore

vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",  # 表名
    embedding_service=embedding,
    
    # 核心字段映射（必须）
    id_column="id",                    # 主键列
    content_column="content",           # 文本内容列
    embedding_column="embedding",       # 向量列
    
    # 元数据列（可选，用于过滤）
    metadata_columns=["source", "category"],  # 会映射到表列
    
    # JSON 元数据列（可选）
    metadata_json_column="metadata",     # JSONB 列名
)
```

**列名映射说明**:
- `id_column`: 主键列（通常是 UUID）
- `content_column`: 存储文本内容的列
- `embedding_column`: 存储向量的列（pgvector 类型）
- `metadata_columns`: 用于过滤的元数据列（必须是表列，不是 JSON 字段）
- `metadata_json_column`: JSON 格式的元数据列（用于存储额外信息）

### 4. PGVectorStore 创建（自动创建表）

**场景**: 如果表不存在，PGVectorStore 可以自动创建。

```python
vector_store = await PGVectorStore.create(
    engine=pg_engine,
    table_name="vectors",
    embedding_service=embedding,
    # 不指定列名映射，使用默认列名
    # id_column="id"
    # content_column="content"
    # embedding_column="embedding"
    # metadata_json_column="metadata"
)
```

**注意**: 自动创建的表使用默认列名，如果需要自定义列名，建议先创建表再配置映射。

### 5. 添加文档

```python
from langchain_core.documents import Document

# 单个文档
doc = Document(
    page_content="这是文档内容",
    metadata={"source": "doc1", "category": "tech"}
)
await vector_store.aadd_documents([doc])

# 批量添加（推荐）
documents = [
    Document(page_content="内容1", metadata={"source": "doc1"}),
    Document(page_content="内容2", metadata={"source": "doc2"}),
]
await vector_store.aadd_documents(documents)
```

**注意**:
- `page_content`: 文档文本内容（会被自动转换为 embedding）
- `metadata`: 元数据字典
  - 如果字段在 `metadata_columns` 中，会映射到表列
  - 其他字段会存储在 `metadata_json_column` 中

### 6. 相似度搜索

```python
# 基础搜索
results = await vector_store.asimilarity_search(
    query="查询文本",
    k=5,  # 返回文档数量
)

# 带过滤的搜索（使用 metadata_columns 中的字段）
results = await vector_store.asimilarity_search(
    query="查询文本",
    k=5,
    filter={"source": "doc1", "category": "tech"},  # 过滤条件
)

# 带分数的搜索
results_with_score = await vector_store.asimilarity_search_with_score(
    query="查询文本",
    k=5,
)
# 返回: List[Tuple[Document, float]]  # (文档, 相似度分数)
```

**过滤说明**:
- 只能使用 `metadata_columns` 中定义的字段进行过滤
- 过滤值必须是字符串类型（UUID 需要转换为字符串）
- JSON 字段中的值不能直接用于过滤

### 7. 删除文档

```python
# 根据 ID 删除
await vector_store.adelete(ids=["id1", "id2"])

# 根据过滤条件删除
await vector_store.adelete(filter={"source": "doc1"})

# 删除所有（谨慎使用）
await vector_store.adelete(filter={})
```

### 8. 异步操作

**所有操作都是异步的**，必须使用 `await`:

```python
# ✅ 正确
await vector_store.aadd_documents(documents)
await vector_store.asimilarity_search(query, k=5)
await vector_store.adelete(filter=filter_dict)

# ❌ 错误（同步方法不存在）
vector_store.add_documents(documents)  # 不存在
vector_store.similarity_search(query, k=5)  # 不存在
```

---

## LangChain PGVector 使用

> 注意：以下内容基于 [PGVector 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvector)

### 1. 安装和设置

```python
pip install -qU langchain-postgres
```

### 2. 初始化 PGVector

```python
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# 使用 psycopg3 驱动（注意：驱动名是 psycopg，不是 psycopg3）
connection = "postgresql+psycopg://langchain:langchain@localhost:6024/langchain"
collection_name = "my_docs"

vector_store = PGVector(
    embeddings=embeddings,
    collection_name=collection_name,
    connection=connection,
    use_jsonb=True,  # 使用 JSONB 存储元数据
)
```

### 3. 添加文档

```python
from langchain_core.documents import Document

docs = [
    Document(
        page_content="there are cats in the pond",
        metadata={"id": 1, "location": "pond", "topic": "animals"},
    ),
    Document(
        page_content="ducks are also found in the pond",
        metadata={"id": 2, "location": "pond", "topic": "animals"},
    ),
]

# 同步方法
vector_store.add_documents(docs, ids=[doc.metadata["id"] for doc in docs])
```

### 4. 相似度搜索（带过滤）

```python
# 基础搜索
results = vector_store.similarity_search("kitty", k=10)

# 使用 $in 操作符
results = vector_store.similarity_search(
    "kitty", 
    k=10, 
    filter={"id": {"$in": [1, 5, 2, 9]}}
)

# 多字段过滤（默认是 AND）
results = vector_store.similarity_search(
    "ducks",
    k=10,
    filter={
        "id": {"$in": [1, 5, 2, 9]}, 
        "location": {"$in": ["pond", "market"]}
    },
)

# 使用 $and 操作符（显式）
results = vector_store.similarity_search(
    "ducks",
    k=10,
    filter={
        "$and": [
            {"id": {"$in": [1, 5, 2, 9]}},
            {"location": {"$in": ["pond", "market"]}},
        ]
    },
)

# 带分数的搜索
results = vector_store.similarity_search_with_score(query="cats", k=1)
for doc, score in results:
    print(f"* [SIM={score:.3f}] {doc.page_content}")
```

### 5. 删除文档

```python
# 根据 ID 删除
vector_store.delete(ids=["3"])
```

### 6. 转换为 Retriever

```python
# 转换为 Retriever 用于链式调用
retriever = vector_store.as_retriever(
    search_type="mmr",  # 最大边际相关性搜索
    search_kwargs={"k": 1}
)
results = retriever.invoke("kitty")
```

### 7. 过滤操作符完整列表

PGVector 支持以下过滤操作符：

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `{"price": {"$eq": 100}}` |
| `$ne` | 不等于 | `{"status": {"$ne": "deleted"}}` |
| `$lt` | 小于 | `{"price": {"$lt": 100}}` |
| `$lte` | 小于等于 | `{"price": {"$lte": 100}}` |
| `$gt` | 大于 | `{"price": {"$gt": 100}}` |
| `$gte` | 大于等于 | `{"price": {"$gte": 100}}` |
| `$in` | 包含 | `{"id": {"$in": [1, 2, 3]}}` |
| `$nin` | 不包含 | `{"id": {"$nin": [1, 2, 3]}}` |
| `$between` | 范围 | `{"price": {"$between": [100, 500]}}` |
| `$like` | 文本匹配 | `{"name": {"$like": "%apple%"}}` |
| `$ilike` | 不区分大小写匹配 | `{"name": {"$ilike": "%apple%"}}` |
| `$and` | 逻辑与 | `{"$and": [{"a": 1}, {"b": 2}]}` |
| `$or` | 逻辑或 | `{"$or": [{"a": 1}, {"b": 2}]}` |

### 8. 注意事项

1. **连接字符串格式**: 必须使用 `postgresql+psycopg://`（注意是 `psycopg`，不是 `psycopg3`）
2. **同步 API**: 所有方法都是同步的，不需要 `await`
3. **集合概念**: 使用 `collection_name` 而不是 `table_name`
4. **自动创建表**: PGVector 会自动创建表结构，不支持使用已存在的表

---

## 常见问题与解决方案

### 1. 连接字符串格式错误

**错误**: `TypeError: 'coroutine' object is not iterable`

**原因**: 使用了同步连接字符串 `postgresql://` 而不是异步的 `postgresql+asyncpg://`

**解决**:
```python
# ✅ 正确
connection_string = "postgresql+asyncpg://user:password@host:port/dbname"

# ❌ 错误
connection_string = "postgresql://user:password@host:port/dbname"
```

### 2. 列名映射错误

**错误**: `KeyError: 'column_name'` 或 `Column not found`

**原因**: 表列名与配置的列名不匹配

**解决**:
```python
# 检查表结构
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

### 3. 动态维度支持

**问题**: 不同 embedding 模型可能有不同维度（1536、3072 等）

**解决**:
```python
# 1. 表定义：不指定维度
embedding = Column(Vector(), nullable=False)  # ✅ 不指定维度

# 2. 可选：记录维度
embedding_dimension = Column(Integer, nullable=True)

# 3. 使用 HNSW 索引（支持动态维度）
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops);
```

### 4. 元数据过滤不工作

**问题**: 使用 `filter` 参数时没有过滤效果

**原因**: 过滤字段不在 `metadata_columns` 中，或值类型不匹配

**解决**:
```python
# 1. 确保字段在 metadata_columns 中
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

### 5. 批量操作性能问题

**问题**: 添加大量文档时速度慢

**解决**:
```python
# 1. 使用批量添加（已支持）
await vector_store.aadd_documents(documents)  # 自动批量处理

# 2. 分批处理大量文档
batch_size = 100
for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    await vector_store.aadd_documents(batch)

# 3. 考虑异步并发（如果支持）
import asyncio
tasks = [
    vector_store.aadd_documents(batch) 
    for batch in batches
]
await asyncio.gather(*tasks)
```

### 6. Embedding 服务配置

**问题**: Embedding 生成失败或 API 调用错误

**解决**:
```python
# 1. 检查 API Key
embedding = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=api_key,  # 必须配置
)

# 2. 测试 Embedding 服务
test_embedding = await embedding.aembed_query("test")
print(f"维度: {len(test_embedding)}")

# 3. 处理错误
try:
    await vector_store.aadd_documents(documents)
except Exception as e:
    print(f"Embedding 失败: {e}")
```

### 7. 索引创建失败

**问题**: 创建 HNSW 索引时失败

**原因**: pgvector 版本不支持 HNSW，或参数不正确

**解决**:
```sql
-- 1. 检查 pgvector 版本
SELECT * FROM pg_available_extensions WHERE name = 'vector';

-- 2. 如果版本 < 0.5.0，使用 ivfflat 索引
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

-- 3. 如果版本 >= 0.5.0，使用 HNSW 索引
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (m = 16, ef_construction = 64);
```

### 8. 延迟初始化模式

**场景**: 避免在初始化时创建连接，实现延迟初始化

**实现**:
```python
class VectorStore:
    def __init__(self, connection_string: str, embedding: Embeddings):
        self.connection_string = connection_string
        self.embedding = embedding
        self.pg_engine = None
        self.vector_store = None
    
    async def _ensure_initialized(self):
        """延迟初始化"""
        if self.vector_store is not None:
            return
        
        if self.pg_engine is None:
            self.pg_engine = PGEngine.from_connection_string(
                url=self.connection_string
            )
        
        self.vector_store = await PGVectorStore.create(
            engine=self.pg_engine,
            table_name="vectors",
            embedding_service=self.embedding,
        )
    
    async def add_documents(self, documents):
        await self._ensure_initialized()
        await self.vector_store.aadd_documents(documents)
```

---

## 性能优化建议

### 1. 索引优化

```sql
-- HNSW 索引参数调优
CREATE INDEX idx_vectors_embedding 
    ON vectors 
    USING hnsw (embedding vector_cosine_ops) 
    WITH (
        m = 32,              -- 增加连接数（提高质量，但索引更大）
        ef_construction = 128  -- 增加构建范围（提高质量，但构建更慢）
    );
```

**参数选择**:
- **小数据集** (< 10万): `m=16, ef_construction=64`
- **中等数据集** (10万-100万): `m=32, ef_construction=128`
- **大数据集** (> 100万): `m=64, ef_construction=200`

### 2. 批量操作

```python
# 批量添加（推荐）
await vector_store.aadd_documents(documents)  # 自动批量处理

# 分批处理大量文档
batch_size = 1000
for i in range(0, len(documents), batch_size):
    batch = documents[i:i + batch_size]
    await vector_store.aadd_documents(batch)
```

### 3. 连接池配置

```python
# SQLAlchemy 连接池配置
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    connection_string,
    pool_size=10,           # 连接池大小
    max_overflow=20,        # 最大溢出连接数
    pool_timeout=30,        # 连接池超时时间
    pool_recycle=3600,      # 连接回收时间
)
```

### 4. 查询优化

```python
# 1. 限制返回数量
results = await vector_store.asimilarity_search(query, k=5)  # 不要返回太多

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

-- 分析表（更新统计信息）
ANALYZE vectors;
```

### 6. 监控和调试

```python
import time

# 监控操作时间
start = time.time()
await vector_store.aadd_documents(documents)
print(f"添加文档耗时: {time.time() - start:.2f}秒")

start = time.time()
results = await vector_store.asimilarity_search(query, k=5)
print(f"搜索耗时: {time.time() - start:.2f}秒")
```

---

## 总结

### 关键要点

1. **连接字符串**: 必须使用 `postgresql+asyncpg://`（异步）
2. **列名映射**: 使用已存在的表时，必须正确配置列名映射
3. **动态维度**: 使用 `Vector()` 不指定维度，配合 HNSW 索引
4. **异步操作**: 所有操作都是异步的，必须使用 `await`
5. **元数据过滤**: 只能使用 `metadata_columns` 中定义的字段
6. **批量操作**: 使用 `aadd_documents` 批量添加文档

### 最佳实践

- 使用 HNSW 索引支持动态维度
- 实现延迟初始化避免不必要的连接
- 批量处理大量文档提升性能
- 合理配置连接池和索引参数
- 监控操作性能，及时优化

---

## 参考资源

### 官方文档

- [PGVector 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvector) - 同步 API，丰富的过滤操作符
- [PGVectorStore 官方文档](https://docs.langchain.com/oss/python/integrations/vectorstores/pgvectorstore) - 异步 API，支持自定义表结构
- [pgvector 官方文档](https://github.com/pgvector/pgvector) - PostgreSQL 向量扩展
- [HNSW 索引说明](https://github.com/pgvector/pgvector#hnsw) - 高性能向量索引
- [LangChain 文档](https://python.langchain.com/) - LangChain 框架文档

### API 参考

- [PGVector API 参考](https://python.langchain.com/api_reference/postgres/vectorstores/langchain_postgres.vectorstores.PGVector.html)
- [PGVectorStore API 参考](https://python.langchain.com/api_reference/postgres/v2/langchain_postgres.v2.vectorstores.PGVectorStore.html)
