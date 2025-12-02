---
title: vue项目vite全局静态变量配置
description: vue项目vite全局静态变量配置
date: 2024-05-10
tags:
  - Vue
  - 前端开发
---

> 参考文档
> 1. https://cn.vitejs.dev/guide/env-and-mode

# 全局环境变量

.env**文件在项目对根目录创建，vite可以正常读取并且加载

```Bash
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```
