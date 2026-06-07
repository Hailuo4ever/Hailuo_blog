---
title: 第17届蓝桥杯国赛C/C++ B组
published: 2026-06-07
description: "2026 蓝桥杯国赛 自补"
image: "https://img.hailuo4ever.com/cover/lanqiao.png"
tags: [算法题解, 蓝桥杯]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 题目链接：洛谷题库 P16793-P16802

# A - 玩具青蛙

> 关键词：签到

## Code

```c++
// Problem: Luogu P16793
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16793
// Time: 2026-06-07 13:29:38
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
// clang-format on

using ll = long long;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    // for (int i = 2; i <= 4053; i++)
    // {
    // if (i % 2026 == 0 && i % 4053 == 0)
    // cout << i << endl;
    // }
    cout << 6079 << endl;
}

int main()
{
    fastio();

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# C - 奇偶校验排列

> 关键词：构造

## 思路

> [!NOTE]
>
> 固定从 $1$ 开始不总是正确的，某些校验串只在 $p_1$ 为偶数时有解。

首先明确，相邻差值的奇偶性只和两个数的奇偶性相关。因此应当首先构造一个奇偶性序列，只要确定了第一个位置，后面的奇偶性就可以递推确定，递推式为 $type_{i + 1} = type_{i} \oplus S_i$，也就是说如果 $S_i = 0$，代表状态不变，否则代表状态翻转。

在一个 $1-n$ 的排列中，奇数数量为 $\left\lceil \frac{n}{2}\right\rceil=\frac{n+1}{2}$，偶数数量为 $evenCnt=\left\lfloor \frac{n}{2}\right\rfloor=\frac{n}{2}$，因此需要构造两种方案，但优先采取首项是奇数的方案（因为字典序最小）。

如果首项是奇数，那么 `type == 0` 的位置需要放奇数，要求 $cnt_0 == cntodd$，并且 $cnt_1 = cnteven$。同理可判断偶数。

如果两种情况都不满足，说明需要的奇数或偶数数量与实际拥有的数量对不上，输出无解。

总结：

1. 计算相对奇偶状态
2. 统计两种状态的数量（不变 or 反转）
3. 判断首项应该是奇数还是偶数。如果都不能满足输出 $-1$
4. 依次填入当前最小的可用数字

## Code

```c++
```

