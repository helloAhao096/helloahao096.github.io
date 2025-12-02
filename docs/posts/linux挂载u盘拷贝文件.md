---
title: linux挂载硬盘拷贝文件
description: linux挂载硬盘拷贝文件
date: 2023-12-18
tags:
  - Linux
  - 系统配置
---

## linux挂载硬盘/u盘
> 参考文档
> 
> https://blog.csdn.net/best_luxi/article/details/108534573
> 
> 这篇内容比较详细 https://www.cnblogs.com/linuxprobe/p/5473645.html

在linux系统下硬盘不是插上去就直接能识别使用的，需要我们手动的进行挂载

把硬盘设备的路径手动的挂载到本地文件目录上

挂载硬盘的基本命令

注：在linux系统下最需要注意的是挂载的硬盘格式和字符格式
```shell
# 查询插入的usb设备叫什么，例：/dev/sda1
fdisk -l

....
....
....
磁盘 /dev/sda：2000.4 GB, 2000398933504 字节，3907029167 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 4096 字节
I/O 大小(最小/最佳)：4096 字节 / 33553920 字节
磁盘标签类型：dos
磁盘标识符：0x2f9b8fd3

设备 Boot      Start         End      Blocks   Id  System
/dev/sda1   *          64  3907024128  1953512032+   7  HPFS/NTFS/exFAT

# 在任意目录下创建一个文件夹，名字自己喜欢什么用什么
mkdir /media/usb1
# 挂载设备到你创建的目录
mount -t ntfs /dev/sda1 /media/usb1
# 注：对ntfs格式的磁盘分区应使用-t ntfs参数，对fat32格式的磁盘分区应使用-t vfat参数。若汉字文件名显示为乱码或不显示，可以使用下面的命令格式。
mount -t ntfs -o iocharset=cp936 /dev/sdc1 /mnt/usb1 
mount -t vfat -o iocharset=cp936 /dev/sdc5 /mnt/usb2
# 卸载硬盘
umount /mediat/usb1
```
