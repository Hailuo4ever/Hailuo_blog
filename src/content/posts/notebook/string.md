---
title: 字符串 (Notebook)
published: 2024-01-01
description: "String"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 字符串表示数字的DP设计

假如我们需要对一个很长的字符串DP，每个状态都表示一个数。假设对 $M$ 取模，我们需要使用两个属性来表示这个数：

1. **$Val(c, k)$**：数字 $c$ 经过 $k$ 次变换后，对应字符串的十进制数值。
2. **$Mul(c, k)$**：数字 $c$ 经过 $k$ 次变换后，对应字符串的长度所代表的 $10$ 的次幂（即 $10^{\text{length}}$）。它的作用是作为一个**乘数因子**，把左侧拼进来的数字抬升到正确的数量级。

注意这两个属性都需要对 $M$ 取模。

初始状态 ($k=0$)：$Val(c, 0) = c \pmod M$，$Mul(c, 0) = 10 \pmod M$

