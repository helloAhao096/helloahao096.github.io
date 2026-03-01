---
title: Apple Watch-AnyGo解锁地区限制功能
description: 通过 AnyGo 模拟定位，在国行 Apple Watch 上开通睡眠呼吸暂停、ECG 心电图、房颤提醒等地区限制功能的操作指南
date: 2026-03-01
tags:
  - Apple Watch
---

> 参考来源：[V2EX - 国行 Watch 开通房颤和睡眠呼吸暂停](https://www.v2ex.com/t/1159981)

### 参考视频

<div class="video-container">
  <iframe src="https://player.bilibili.com/player.html?isOutside=true&aid=115243720115660&bvid=BV1rKJZzAE9W&cid=32551733015&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>

# Apple Watch 使用 AnyGo 解锁睡眠呼吸暂停、心电图、房颤功能

## 1. 前提条件

- **设备**：iPhone + Apple Watch（手表本身需支持 ECG、睡眠呼吸暂停、房颤等功能）
- **作者环境**：美版 Apple Watch Ultra 2 + iPhone，系统均为 OS 26
- **软件**：iToolab AnyGo（[官网](https://itoolab.com/ad/g/gps-simulator/)）
- **网络**：电脑和手机都需开启梯子，否则 AnyGo 可能提示「当前地区不可用」

### AnyGo 支持的平台

| 平台 | 版本要求 |
|------|----------|
| Windows | 11 / 10 / 8 / 7 |
| macOS | 10.12 及以上 |
| iOS | iOS 13 ~ iOS 26 |
| Android | Google Play 下载，支持 Android 15 |

官网支持 **Wi-Fi 无线** 与 **蓝牙** 两种虚拟 GPS 连接方式。

> Windows 端目前暂无支持蓝牙模式的学习版，但正版 AnyGo 支持。若需蓝牙模式，请使用正版。

---

## 2. 操作步骤（以 macOS + iPhone 为例）

1. **全程关闭 Apple Watch**，操作期间保持关机
2. **连接**：使用 AnyGo 蓝牙模式连接 iPhone（或用数据线连接电脑）
3. **按 AnyGo 软件提示操作**：
   - 关闭手机定位服务（设置 → 隐私与安全性 → 定位服务）
   - 关闭 Wi-Fi、蜂窝数据（可以直接飞行模式）
   - 等待约 10 秒
   - 再依次重新打开（wifi，蜂窝数据，手机定位）
4. **手机开启全局代理**，节点选择香港等支持地区
5. **验证定位**：用百度地图或高德地图确认定位已变更为目标地区
6. **开通功能**：打开「健康」App，按提示开通睡眠呼吸暂停、ECG、房颤等
7. **关于房颤历史**：若与 ECG 只能二选一，按需选择其一

---

## 3. 常见问题

### 蓝牙连接失败

部分用户反馈：删除 `~/Library/Preferences/` 下 `com.apple.bluetooth` 和 `com.apple.bluetoothuserd` 开头的 plist 文件，重启 Mac 后，在蓝牙设置中「忽略」原设备，再重新配对，可解决部分连接问题。

### 学习版蓝牙连不上

原帖回帖中，有人用学习版可成功，有人需换成正版 AnyGo 才能连上蓝牙。可能与环境有关，建议多试几次或考虑正版。

### 定位改好了，健康 App 仍提示地区不可用

检查代理是否全局、定位是否真的生效。部分用户使用有线连接代替蓝牙后成功。

---

## 4. 重要说明

### 成功率较玄学

本教程成功率不稳定，初步怀疑与 AnyGo 版本、正版/学习版有关。原帖中有不同系统（iOS 18.x、26.x，macOS 15.x、26.x 等）成功案例，目前倾向于与系统版本关系不大。**教程仅供参考，不保证成功。**

### 代开服务风险

若选择某宝代开：需登录他人 Apple ID，存在隐私泄露风险，且可能同步大量无关数据，请谨慎选择。可能会直接被别人的ID锁住，导致被诈骗风险

