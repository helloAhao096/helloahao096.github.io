---
title: vitepress自定义静态文件路由
description: vitepress自定义静态文件路由
date: 2023-03-11
tags:
  - VitePress
  - 博客搭建
---

## 自定义路由
有一个需要自定义的页面，与博客风格不同，但是查了很久都没有查到资料如何链接，如果直接/到静态文件页面就是404错误

- 在public中添加需要的静态文件

使用`pathname`定义指定的文件目录（完全按照下面的格式写，pathname不需要修改，后面的具体地址按需修改）  
` pathname:\\\customPath\index.html `

## Reference
https://vitepress.dev/guide/asset-handling#public-files

