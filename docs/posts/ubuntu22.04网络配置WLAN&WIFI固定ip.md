---
title: ubuntu22.04网络配置WLAN&WIFI固定ip
description: ubuntu22.04网络配置WLAN&WIFI固定ip
date: 2023-12-08
tags:
  - Ubuntu
  - 系统配置
---

> 适用于Ubuntu 17.04及更高版本
## 配置文件
1. 进入 netplan 配置文件目录

    通常在 /etc/netplan/ 目录下。 一般有一些不同的名字，但是都是yaml文件
2. 在编辑前先拷贝一份，以防万一
    ```shell
    #   没有则创建
   touch 01-netcfg.yaml
   cp 01-netcfg.yaml 01-netcfg.yaml.bak
    ```
3. 查看本地使用的网络模式

    如果是有线连接一般就是eth0,wifi就是wlan0
   
   **注(大坑): wifi网络和以太网网络要配置的网络模式不一样，网络上的文章都基本只说了以太网（网线）模式**


    ```shell
    nmcli device show
    ```
    查看顶部的 GENERAL.DEVICE是什么，下面配置文件要用
4. 配置netplan的yaml文件
    ```shell
    sudo nano /etc/netplan/01-netcfg.yaml
    ```
   ## 以太网模式(ethernets):
    ```shell
      network:
      version: 2
      renderer: networkd
    #   以太网模式 使用 ethernets:
      ethernets:
        eth0:
          dhcp4: true
      ## 可以ip a查看以太网连接名称
      ## addresses添加网络掩码，如192.168.56.3/24
          addresses: [ 192.168.52.192/24 ]
          routes:
            - to: "default"
              via: "192.168.52.1"
          nameservers:
            search: [ mydomain , otherdomain ]
            addresses: [ 192.168.52.1 , 114.114.114.114 ]
          optional: true
    ```
   ## WIFI模式(wifis):
   ```shell
   network:
     version: 2
     renderer: networkd
     ethernets:
       eth0:
         dhcp4: true
         ## 可以ip a查看以太网连接名称
         ## addresses添加网络掩码，如192.168.56.3/24
     #      addresses: [ 192.168.52.192/24 ]
     #      # gateway4: 10.10.10.1
     #      ## gateway4已经废弃，推荐使用routes
     #      routes:
     #        - to: "default"
     #          via: "192.168.52.1"
     #      nameservers:
     #        search: [ mydomain , otherdomain ]
     #        addresses: [ 192.168.52.1 , 114.114.114.114 ]
     #      optional: true
     wifis:
       wlan0:
         dhcp4: false
         addresses:
           - 192.168.52.192/24
         routes:
           - to: "default"
             via: "192.168.52.1"
         nameservers:
           search: [ mydomain , otherdomain ]
           addresses: [ 192.168.52.1 , 114.114.114.114 ]
         access-points:
           "your_ssid":
             password: 'your_wifi_pwd'
   ```
## 重启网络
5. 应用配置并且重启网络
    ```shell
    sudo netplan apply
    sudo systemctl restart Networkmanager
    ```
6. 查看静态ip是否配置成功
    ```shell
   # 喜欢哪个运行哪个
    ifconfig
    
   ip addr show
    ```

> 参考资料
> https://cloud.tencent.com/developer/article/2323503
> https://www.cnblogs.com/zjdxr-up/p/17444844.html
> https://blog.csdn.net/Neutionwei/article/details/107130995
> https://blog.csdn.net/ly2020_/article/details/89330404
