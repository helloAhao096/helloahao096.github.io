---
title: vue&vite的api网络请求proxy设置
description: vue&vite的api网络请求proxy设置
date: 2024-05-10
tags:
  - Vue
  - 前端开发
---


> 参考文档
> 1. https://cn.vitejs.dev/guide/env-and-mode
> 2. https://zxuqian.cn/vite-proxy-config/


## vite server proxy设置

### 配置文件总览

```Bash
// vite.config.ts

export default defineConfig({
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
      },
    },
  },
})
```

## 多个server api文件配置

```Bash
  server: {
    // port: 8080, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域
    // 设置代理，根据我们项目实际情况配置
    proxy: {
      //第一访问地址
      '/api': { //apiTest是自行设置的请求前缀，按照这个来匹配请求，有这个字段的请求，就会进到代理来
        target: 'https://api.apiopen.top/', // 需要代理的域名
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/api/, ""), //重写匹配的字段，如果不需要放在请求路径上，可以重写为""
      },
      //第二访问地址，以此类推可写多个
      '^/amap/.*': { //amap是自行设置的请求前缀，按照这个来匹配请求，有这个字段的请求，就会进到代理来
        target: 'https://restapi.amap.com', // 需要代理的域名
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/amap/, ""), //重写匹配的字段，如果不需要放在请求路径上，可以重写为""
      }
    }
  }
```
