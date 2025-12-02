---
title: linux连接蓝牙设备📶
description: linux连接蓝牙设备
date: 2024-01-23
tags:
  - Linux
  - 系统配置
---
## 检测蓝牙模块/启动蓝牙


1. 查看硬件设备
    ```shell

    lspci | grep Bluetooth

    ```
2. 查看usb设备 
    ```
    lsusb | grep Bluetooth
    ```

3. 查看蓝牙状态
    ```shell
    # 查看蓝牙状态
    systemctl status bluetooth
    # 如果该命令输出显示 disabled 说明服务未启动

    # 查看设备是否启动
    hciconfig
    # 如果该命令输出中有 DOWN 字样则说明设备未启动
   
    ```

4. 启动蓝牙设备和服务
    ```shell
    #启动蓝牙硬件
    hciconfig hci0 up

    #启动蓝牙服务
    sudo systemctl start bluetooth
    
    ```


## 连接蓝牙

1. 启动蓝牙管理工具
    ```shell
    bluetoothctl
    ```

2. 扫描设备
    ```shell
    # 开始扫描
    scan on
    #列出所有diveces
    devices
    ```

3. 连接蓝牙设备
    ```shell
    # MAC_ADDRESS 是上面扫描到的设备的mac地址，根据名字判断你需要连接的设备，然后进行蓝牙配对

    pair MAC_ADDRESS

    trust MAC_ADDRESS

    connect MAC_ADDRESS
    ```
    > 完成这一系列的命令，将蓝牙设备配对、信任并连接

4. 验证设备状态
    ```shell
    info MAC_ADDRESS
    ```
