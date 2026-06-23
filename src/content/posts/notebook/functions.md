---
title: Functions (Notebook)
published: 2024-01-01
description: "C++ 常用库函数"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> `notebook/` 路径下的文件均为自己整理的内容，按照知识点类别归纳整理。

# __builtin 函数

| 函数                                 | 作用           | 注意点            |
| ---------------------------------- | ------------ | -------------- |
| `__builtin_popcount(x)`            | 统计 (1) 的个数   | `int` 版本       |
| `__builtin_popcountll(x)`          | 统计 (1) 的个数   | `long long` 版本 |
| `__builtin_parity(x)`              | 判断 (1) 的个数奇偶 | 返回 (0/1)       |
| `__builtin_clz(x)`                 | 统计前导零        | (x=0) 未定义      |
| `__builtin_clzll(x)`               | 统计前导零        | `long long` 版本 |
| `__builtin_ctz(x)`                 | 统计后缀零        | (x=0) 未定义      |
| `__builtin_ctzll(x)`               | 统计后缀零        | `long long` 版本 |
| `__builtin_ffs(x)`                 | 找最低位 (1) 的位置 | (x=0) 返回 (0)   |
| `__builtin_bswap32(x)`             | 字节翻转         | 较少用于竞赛         |
| `__builtin_add_overflow(a,b,&res)` | 加法溢出检测       | 返回是否溢出         |
| `__builtin_sub_overflow(a,b,&res)` | 减法溢出检测       | 返回是否溢出         |
| `__builtin_mul_overflow(a,b,&res)` | 乘法溢出检测       | 返回是否溢出         |

注：`clz = count leading zeros`。`ctz = count trailing zeros`。`ffs = find first set`。
