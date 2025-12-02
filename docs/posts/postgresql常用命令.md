---
title: postgresql 常用命令
description: postgresql 常用命令
date: 2024-07-01
tags:
  - PostgreSQL
  - 数据库
---

>  参考资料:
>  https://www.cnblogs.com/my-blogs-for-everone/p/10226473.html
>  https://ken.io/note/macos-postgresql-install-and-configuration

# mac 命令
```shell

# 查看服务状态
brew services list

# 启动服务
brew services start postgresql

# 连接进入数据库
psql -U postgres # -U 指定用户

psql -d postgres # -d 指定数据库

# 重启服务（brew安装）
brew services restart postgresql@15

# 重启服务（dmg安装，通过-D指定数据目录）
pg_ctl restart -D /Library/PostgreSQL/15/data
```

# postgresql 操作命令

```shell
# 查看所有用户
\du

# 查看所有数据库
\l

# 切换当前数据库
\c {dbname}

# 查看当前库下所有的表
\dt

# 查看指定表
\d {tablename}

# 查看数据目录
SHOW data_directory;

# 退出psql
\q

```
