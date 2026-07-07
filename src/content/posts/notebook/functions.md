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

# std::count()

**std::count 是 C++ 标准库中用于统计指定值在迭代器范围内出现次数的算法函数**‌，定义在`<algorithm>`头文件中，需传入起始迭代器、结束迭代器和目标值三个参数 。‌‌‌

支持提供输入迭代器的容器，例如 vector, string, deque, array, 原生数组。

统计 vector 中数字 $3$ 的出现次数：`std::count(a.begin(), a.end(), 3)`。

注意：在 set, map 中，count 是一个成员函数，只判断某个 key 是否存在，不统计值。

当需要更灵活的统计条件时，可以使用 std::count_if 配合 lambda 表达式。

# std::move()

‌**std::move 是 C++ 标准库中的类型转换工具，定义在`<utility>`头文件中，用于将左值转换为右值引用以启用移动语义**‌。它本身不执行任何数据移动操作，只是告诉编译器"这个对象的资源可以被转移"，真正移动资源的是移动构造函数或移动赋值运算符。‌‌‌

通常在 DP 中使用，避免转移大量状态，直接告诉编译器这个状态可以被覆盖。
