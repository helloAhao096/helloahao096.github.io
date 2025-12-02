---
title: Homebrew 设置代理&国内镜像源
description: Homebrew 设置代理&国内镜像源
date: 2024-05-10
tags:
  - macOS
  - 系统配置
---

> 参考文档
> 1. 清华镜像 https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/
> 2. proxy代理设置

## 设置国内镜像代理

>    日常使用 可设置如下环境变量使用本站提供的 Homebrew 镜像：
```Bash
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
```
### 重置国内镜像源
```Bash
# brew 程序本身，Homebrew / Linuxbrew 相同
unset HOMEBREW_BREW_GIT_REMOTE
git -C "$(brew --repo)" remote set-url origin https://github.com/Homebrew/brew

# 以下针对 macOS 系统上的 Homebrew
unset HOMEBREW_API_DOMAIN
unset HOMEBREW_CORE_GIT_REMOTE
BREW_TAPS="$(BREW_TAPS="$(brew tap 2>/dev/null)"; echo -n "${BREW_TAPS//$'\n'/:}")"
for tap in core cask{,-fonts,-versions} command-not-found services; do
    if [[ ":${BREW_TAPS}:" == *":homebrew/${tap}:"* ]]; then  # 只复原已安装的 Tap
        brew tap --custom-remote "homebrew/${tap}" "https://github.com/Homebrew/homebrew-${tap}"
    fi
done

# 重新拉取远程
brew update
```

## 设置proxy
homebrew的代理直接使用的是bash的系统级代理，直接设置系统代理即可生效
```Bash
#设置HTTP/HTTPS Proxy
export HTTP_PROXY=http://your_proxy_server_address:your_proxy_port
export HTTPS_PROXY=http://your_proxy_server_address:your_proxy_port
```
### 重置代理
```Bash
unset HTTP_PROXY
unset HTTPS_PROXY
```
