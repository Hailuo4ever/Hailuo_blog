---
title: 扫描线 (Notebook)
published: 2024-01-01
description: "Sweep Line"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 基本思想

扫描线可以理解成：用一条直线从左往右扫过整个平面，只在状态发生变化的位置进行处理。

对于一个二维问题，我们可以选择一个方向扫描，例如选择 $x$ 从小到大，把问题转化成 $x$ 方向事件 + 维护 $y$ 方向上的状态。

而维护 $y$ 轴信息的数据结构可以是线段树、树状数组、`set`、平衡树等。其中线段树是最常见的。

# 矩形面积并

