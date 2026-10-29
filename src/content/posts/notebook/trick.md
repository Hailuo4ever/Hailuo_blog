---
title: Tricks
published: 2026-10-27
description: "Some Tricks"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algo_Notes"
draft: false
lang: ""
---

# DP Trick

## 末尾追加数字的模数转移

> 常用于子序列计数、数位DP、整除性统计

若当前数字为 $x$，且 $x \bmod m=r$，在十进制数 $x$ 的末尾追加数字 $d$ 后，新数字为：$x' = 10 \cdot x + d$。

因此新余数为 $r' = (10 \cdot r + d) \bmod m$，更一般地，在 $B$ 进制下有 $r' = (B \cdot r + d) \bmod m$。

一般使用这个方法时，对后续转移而言，相同余数的数字是等价的。

## 子序列DP的常用优化

对于以下形式的子序列 DP：

```
dp[i] = max(dp[j] + 1)
要求 j < i，并且 a[i] 与 a[j] 满足某种数值关系
```

思考三个问题：

1. 能否由 $a_i$ 直接推导出合法的 $a_j$ 数值？
2. 合法前驱数值的数量是否很少？
3. 能否使用数组或哈希表维护每个数值对应的历史最优状态？

## 字符串表示数字的DP设计

假如我们需要对一个很长的字符串DP，每个状态都表示一个数。假设对 $M$ 取模，我们需要使用两个属性来表示这个数：

1. **$Val(c, k)$**：数字 $c$ 经过 $k$ 次变换后，对应字符串的十进制数值。
2. **$Mul(c, k)$**：数字 $c$ 经过 $k$ 次变换后，对应字符串的长度所代表的 $10$ 的次幂（即 $10^{\text{length}}$）。它的作用是作为一个**乘数因子**，把左侧拼进来的数字抬升到正确的数量级。

注意这两个属性都需要对 $M$ 取模。

初始状态 ($k=0$)：$Val(c, 0) = c \pmod M$，$Mul(c, 0) = 10 \pmod M$

# Graph Trick

## 维护信息的一种技巧

[Problem - F - Codeforces](https://codeforces.com/contest/2126/problem/F)

当修改一个点会影响大量邻居时，考虑能否给边确定方向，让每次修改只需要更新数量有限的统计信息。

朴素的思路是：

修改一个节点 → 找到所有受影响的邻居 → 逐个更新贡献。

优化后的思路是：

修改一个节点 → 利用预处理的信息计算所有儿子的贡献 → 更新唯一父亲的信息。