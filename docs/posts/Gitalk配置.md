---
title: Gitalk配置
description: vitepress gitalk 配置 总结
date: 2023-03-13
tags:
  - 博客搭建
---

## 项目介绍
- Gitalk项目地址：https://github.com/gitalk/gitalk
- 官方文档：https://github.com/gitalk/gitalk/blob/master/readme-cn.md
官方文档详细说明了如何使用，不再赘述，只做记录

## 踩坑总结
1. 注册github application时，Homepage URL 
    
   一比一复制你部署在github上，能打开主页地址的URL，不然会初始化错误
   
    因为博客评论的仓库回调地址配置不对，在github application中子路由路径也得完全配置到
```
未找到相关的 Issues 进行评论
请联系 @helloahao096 初始化创建
```

## Reference
https://github.com/gitalk/gitalk/issues/115
