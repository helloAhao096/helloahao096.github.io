---
title: osm离线地图docker服务器搭建流程
description: osm离线地图docker服务器搭建流程
date: 2023-12-07 
tags:
  - Docker
  - 系统配置
---
# 安装docker
  >  参考资料:
  > 1. https://docs.docker.com/engine/install/ubuntu/
  > 2. https://www.runoob.com/docker/ubuntu-docker-install.html
  > 3. 一键部署脚本的源代码在 docker-install 仓库中。 不建议在生产环境中使用这些脚本 https://get.docker.com/
  > 4. https://www.wbolt.com/install-docker-ubuntu.html

- 一键部署脚本
```shell
curl -fsSL https://get.docker.com -o get-docker.sh
#以root权限运行脚本
sudo sh get-docker.sh
Executing docker install script
```
1. 更新ubuntu系统的软件包、安装apt依赖
    ```shell
        # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
      
    # Add the repository to Apt sources:
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    ```
2. 安装最新的docker版本
    ```shell
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```
3. 检测docker是否安装成功
    ```
   sudo systemctl status docker
   ```

# 配置docker的网络代理

因为地图数据服务器在外网，下载得特别慢，需要配置代理

TIPS: 
1. 如果是需要通过 本机(windows)主机 -> 使用ssh连接本地局域网的linux主机 -> 再进入docker的容器，来连接网络代理的话，可以先去容器里试试直接ping(windows)主机，如果能ping通，就直接配置局域网里的ip就行
2. 如果要连接使用 (windows)主机的网络代理，记得把window的局域网防火墙关掉，不然也用不了
> 参考资料：
> 1. https://www.cnblogs.com/abc1069/p/17496240.html
> 2. https://www.zdkteam.com/archives/docker-rong-qi-nei-shi-yong-su-zhu-ji-de-dai-li-pei-zhi
> 3. https://docs.docker.com/network/proxy/#use-environment-variables
> 4. https://kebingzao.com/2019/02/22/docker-container-proxy/
> 5. https://neucrack.com/p/286
> 6. https://blog.csdn.net/lxr1908/article/details/132487243
> 7. https://cn.linux-console.net/?p=21489

1. 设置宿主机(本机)的docker国内镜像
    ```shell
    #在/etc/docker/daemon.json文件中加入
    # 国内有些镜像的源已经失效，这些是暂时还可以使用的镜像
    
    {
        "registry-mirrors": [
            "https://registry.hub.docker.com",
            "http://hub-mirror.c.163.com",
            "https://mirror.baidubce.com",
            "https://docker.mirrors.sjtug.sjtu.edu.cn",
            "https://docker.nju.edu.cn"
        ]
    }
    
    ```

2. 设置docker中容器的代理服务器
    ```shell
    # vi ~/.docker/config.json (没有的话就创建这个路径和文件，代理服务器需要替换成自己搭建的vpn地址
   # 先试试容器里ping代理的网络通不通，再根据具体情况配置
    
    {
     "proxies":
     {
       "default":
       {
         "httpProxy": "http://example.com:port",
         "httpsProxy": "http://example.com:port",
         "noProxy": "localhost,127.0.0.1,.daocloud.io"
       }
     }
    }
    ```

# 安装osm离线地图服务(openstreetmap-tile-server)

> 参考资料:
> 1. https://switch2osm.org/serving-tiles/using-a-docker-container/
> 2. https://github.com/Overv/openstreetmap-tile-server
> 3. https://hub.docker.com/r/overv/openstreetmap-tile-server/
> 4. 官方详细步骤：https://switch2osm.org/serving-tiles/manually-building-a-tile-server-ubuntu-22-04-lts/
> 5. https://zhuanlan.zhihu.com/p/25889246

1. 下载地图osm.pbf文件
    ```shell
    wget https://download.geofabrik.de/africa/zambia-latest.osm.pbf
    ```

2. 创建docker的volume
    ```shell
   docker volume create osm-data
   ```

3. 下载docker镜像和挂载地图资源文件
    ```shell
   docker run \
   --name osm_server
    -v {替换成本机的文件路径}/{文件名}.osm.pbf:/data/region.osm.pbf \
    -v osm-data:/data/database/ \
    overv/openstreetmap-tile-server \
    import
   ```
   
4. 使用docker启动osm服务
    --name 参数指定之后每次启动的服务器就是同一个，如果根据官方的指令运行，没有name，每次掉了容器启动的都是新的，要重新挂载之类的，耗时耗性能
    ```shell
   docker run --name osm_server -p 8080:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run
   ```

5. 查看服务器是否部署成功
    ```shell
   http://your.server.ip.address:8080
   http://your.server.ip.address:8080/tile/0/0/0.png
   ```
   
> 地图数据源:
> 
> https://download.openstreetmap.fr/extracts/asia/china/
> 
> https://app.protomaps.com/
> 
> https://github.com/leaflet-extras/leaflet-providers
> 
> https://leaflet-extras.github.io/leaflet-providers/preview/
