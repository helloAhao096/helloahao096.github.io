---
title: 树莓派4b配置watchdog
description: 树莓派4b(ubuntu)配置watchdog防止系统卡死
date: 2023-12-08
tags:
  - Linux
  - Ubuntu
  - 系统配置
---

在Linux系统中，Watchdog（看门狗）是一种硬件或软件机制，用于监视系统的运行状态，并在系统出现故障或停滞时采取预定的措施，例如重启系统。Watchdog 的目标是确保系统在发生故障时能够自动恢复，提高系统的可用性和稳定性。

Watchdog 的两种类型：
硬件 Watchdog：

硬件设备： 通常是一块专用的硬件电路，与计算机主板相连。
工作原理： Watchdog 定期向硬件设备发送信号，以表示系统正在正常运行。如果系统正常，那么 Watchdog 定期重置定时器。如果系统出现故障或停滞，Watchdog 定时器将超时，导致硬件设备采取预定的操作，例如重启系统。
使用： 多数服务器和嵌入式系统具有硬件 Watchdog。

软件 Watchdog：

软件实现： Watchdog 也可以是一个软件实现，通过在操作系统中运行特殊的 Watchdog 守护进程。
工作原理： 它通过周期性地向 Watchdog 守护进程发送信号，来表示系统正常运行。如果系统正常，Watchdog 守护进程定期重置定时器。如果系统停滞或发生故障，Watchdog 守护进程未能定期重置定时器，从而触发 Watchdog 机制采取措施，如重启系统。
使用： 适用于那些没有硬件 Watchdog 的系统。
Watchdog 在 Linux 中的使用：
安装 Watchdog：

在许多 Linux 发行版中，可以使用包管理工具来安装 watchdog：

```shell
sudo apt install watchdog   # For Debian/Ubuntu
sudo yum install watchdog       # For CentOS/RHEL
```
配置 Watchdog：

修改 /boot/config.txt 并重启使其生效
```shell
# 在最后边增加一行配置项 
# echo 'dtparam=watchdog=on' >> /boot/config.txt
dtparam=watchdog=on
```
```shell
reboot
```

配置文件通常是 /etc/watchdog.conf。您可以编辑此文件以更改 Watchdog 的配置，包括定时器超时时间、Watchdog 设备、启用或禁用软件 Watchdog 等。
```shell
# /etc/watchdog.conf
#本机使用的树莓派4b，conf文件可以根据自己的需求定制

# echo 'watchdog-device = /dev/watchdog' >> /etc/watchdog.conf
# echo 'watchdog-timeout = 15' >> /etc/watchdog.conf
# echo 'max-load-1 = 24' >> /etc/watchdog.conf

max-load-1 = 24
watchdog-device = /dev/watchdog
watchdog-timeout = 15
```

启动看门狗服务
```shell
sudo systemctl enable watchdog
sudo systemctl start watchdog
sudo systemctl status watchdog
```

模拟系统停滞或死锁，看看 Watchdog 是否能够在设定的时间内检测到问题并采取相应的措施。
使用无限递归函数炸弹(Infinite Recursive Function Bomb) 测试
```shell 
sudo bash -c ':(){ :|:& };:'
```

Watchdog 的注意事项：
Watchdog 需要谨慎使用，不当的配置可能导致系统不断重启。
Watchdog 的超时时间应根据系统特性和负载来调整，以确保能够检测到真正的问题。
在使用硬件 Watchdog 时，确保主板支持并已正确配置。
在使用 Watchdog 时，建议备份重要数据，以防 Watchdog 触发不断重启导致数据丢失。
总体而言，Watchdog 是一项有用的系统保护机制，特别适用于那些要求高可用性和可靠性的系统。

> 参考文章:
> https://cmjava.ltd:8090/archives/shu-mei-pai-4b-an-zhuang-watchdog
> https://www.meowpass.com/pages/8a3f9b
