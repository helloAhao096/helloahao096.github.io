---
title: linux service服务配置
description: linux service服务配置
date: 2024-07-18
tags:
  - Linux
  - 系统配置
---
> 参考文档
> https://blog.csdn.net/blood_Z/article/details/128848056
> 

# 默认配置路径

```shell
1. /etc/systemd/system/

# 这个目录是Systemd服务管理器的主要配置目录。在这个目录中，可以找到各种系统服务的配置文件，
# 这些文件以.service为后缀名。
# 例如，一个名为"my-service.service"的服务配置文件将存放在/etc/systemd/system/目录下。


2. /lib/systemd/system/
# 这个目录也是Systemd服务管理器的配置目录，
# 但是与/etc/systemd/system/目录不同的是，
# 这个目录中的服务配置文件通常是由Linux发行版提供的默认服务。
# 这个目录中的服务文件一般不建议用户直接修改，以免对系统造成不可预料的影响。

```
# 常用管理命令
```shell
#常用命令
systemctl start 服务名                       开启服务
systemctl stop 服务名                        关闭服务
systemctl status 服务名                      显示状态
systemctl restart 服务名                     重启服务
systemctl enable 服务名                      开机启动服务
systemctl disable 服务名                     禁止开机启动
systemctl list-units                        查看系统中所有正在运行的服务
systemctl list-unit-files                   查看系统中所有服务的开机启动状态
systemctl list-dependencies 服务名           查看系统中服务的依赖关系
systemctl mask 服务名                        冻结服务
systemctl unmask 服务名                      解冻服务
systemctl set-default multi-user.target     开机时不启动图形界面
systemctl set-default graphical.target      开机时启动图形界面

systemctl daemon-reload  重载服务配置

systemctl enable 服务名.service 

systemctl is-enabled 服务名.service

journalctl -u xxx.service                   **查看服务运行日志**

取消服务器开机自启动
systemctl disable postgresql.service
```

# service文件编写

```shell
# 基本模版
[Unit]
Description=My Service
After=network.target

[Service]
Type=simple
ExecStart=/path/to/your/command
Restart=always

[Install]
WantedBy=multi-user.target
```
## 一键配置service启动项的shell脚本
> 需要将其中的路径替换为自己系统需要配置的路径
```shell
#!/bin/bash

# 确保脚本以 root 用户运行
if [ "$(id -u)" -ne 0 ]; then
    echo "请以 root 用户或使用 sudo 运行此脚本。"
    exit 1
fi

# 定义路径变量
SCRIPT_PATH="/home/firefly/Desktop/hackrf_build"
SERVICE_NAME="hackrf_signal"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
#START_SCRIPT="${SCRIPT_PATH}/zjyg_signal/sweep-back.py"
START_SCRIPT="${SCRIPT_PATH}/run.sh"

# 赋予启动脚本执行权限
chmod +x ${START_SCRIPT}
echo "启动脚本已创建并赋予执行权限: ${START_SCRIPT}"

# 创建 systemd 服务文件
echo "创建 systemd 服务文件..."
cat <<EOL > ${SERVICE_FILE}
[Unit]
Description=hackrf_signal
After=network.target

[Service]
Type=simple
WorkingDirectory=${SCRIPT_PATH}
User=root
ExecStart=${START_SCRIPT}
Restart=always

[Install]
WantedBy=multi-user.target

EOL

# 重新加载 systemd，启用并启动服务
echo "重新加载 systemd 守护进程..."
systemctl daemon-reload
echo "启用服务..."
systemctl enable ${SERVICE_NAME}.service
echo "启动服务..."
systemctl start ${SERVICE_NAME}.service

# 检查服务状态
echo "检查服务状态..."
systemctl status ${SERVICE_NAME}.service

echo "配置完成！'sweep-backy.py' 将在系统启动时自动运行。"
```
