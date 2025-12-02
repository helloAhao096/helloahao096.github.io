---
title: docker 自动化安装部署、配置镜像源
description: docker 自动化安装部署、配置镜像源
date: 2024-11-18
tags:
  - Docker
  - Ubuntu
  - 系统配置
---

## Docker 自动安装部署脚本

https://linuxmirrors.cn/other/#docker-%E5%AE%89%E8%A3%85%E8%84%9A%E6%9C%AC

```shell
# 三条url命令都是使用sh脚本部署docker，在所需的环境执行和运行后，即可自动化安装docker，并且配置镜像源
# 具体命令和参数参考上面的 linuxmirrors 的文档

bash <(curl -sSL https://linuxmirrors.cn/docker.sh) # 推荐
bash <(curl -sSL https://raw.githubusercontent.com/SuperManito/LinuxMirrors/main/DockerInstallation.sh)
bash <(curl -sSL https://gitee.com/SuperManito/LinuxMirrors/raw/main/DockerInstallation.sh)

```
## Docker 手动更换镜像源

https://github.com/tech-shrimp/docker_installer


## linux 
GNU/Linux 更换系统软件源脚本

```shell
bash <(curl -sSL https://linuxmirrors.cn/main.sh)

```


# python

如何在dockerfile中下载python

```dockerfile

# 使用适合构建 HackRF 和 FastAPI 服务的基础镜像
FROM ubuntu:20.04

# 设置工作目录
WORKDIR /data_forwarding

# 设置环境变量
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHON_VERSION=3.12.0 \
    PATH="/usr/local/bin:${PATH}"

# 替换为阿里云的 Ubuntu-Ports APT 软件源并安装基础依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends gnupg software-properties-common && \
    echo "deb https://mirrors.aliyun.com/ubuntu-ports/ focal main restricted universe multiverse" > /etc/apt/sources.list && \
    echo "deb-src https://mirrors.aliyun.com/ubuntu-ports/ focal main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.aliyun.com/ubuntu-ports/ focal-security main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb-src https://mirrors.aliyun.com/ubuntu-ports/ focal-security main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.aliyun.com/ubuntu-ports/ focal-updates main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb-src https://mirrors.aliyun.com/ubuntu-ports/ focal-updates main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb https://mirrors.aliyun.com/ubuntu-ports/ focal-backports main restricted universe multiverse" >> /etc/apt/sources.list && \
    echo "deb-src https://mirrors.aliyun.com/ubuntu-ports/ focal-backports main restricted universe multiverse" >> /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        wget \
        build-essential \
        libssl-dev \
        libffi-dev \
        zlib1g-dev \
        libbz2-dev \
        libreadline-dev \
        libsqlite3-dev \
        libncurses5-dev \
        libgdbm-dev \
        libnss3-dev \
        liblzma-dev \
        libusb-1.0-0-dev \
        libfftw3-dev \
        libboost-all-dev \
        autoconf \
        libtool \
        cmake \
        make \
        pkg-config \
        ca-certificates \
        curl && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*

# 下载并安装指定版本的 Python 源码
RUN wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz && \
    tar -xf Python-${PYTHON_VERSION}.tar.xz && \
    rm Python-${PYTHON_VERSION}.tar.xz && \
    cd Python-${PYTHON_VERSION} && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make install && \
    cd /data_forwarding && \
    rm -rf Python-${PYTHON_VERSION}

# 验证 Python 和 SSL 模块是否正确安装
# 
RUN python3 -m ssl && python3 --version

# 复制 Python 依赖文件并安装依赖
COPY requirements.txt /data_forwarding/
RUN pip3 install --no-cache-dir \
    --index-url https://mirrors.aliyun.com/pypi/simple/ \
    --trusted-host mirrors.aliyun.com \
    -r requirements.txt

# 复制整个项目到容器内
COPY data_forwarding /data_forwarding

# 设置启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


```

## 设置pip源

### 临时设置源
pip install --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

### 设置全局源
pip3 config set global.index-url https://mirrors.aliyun.com/pypi/simple/


##  文档参考地址

> https://linuxmirrors.cn/
