---
title: cf round 995
published: 2026-05-19
description: "Codeforces Round 995 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 995 (Div. 3)](https://codeforces.com/contest/2051)

# D - Counting Pairs

> 关键词：二分

## 思路

题目要求找出一对下标 $(i, j)$，满足 $1 \le i < j \le n$，且在删去这两个数后，剩余元素的和在 $[x, y]$ 之间。

假设整个数组所有元素的总和为 $S$。如果我们删去 $a_i$ 和 $a_j$，剩余元素的和就是 $S - (a_i + a_j)$。

根据题意，我们需要满足：$x \le S - (a_i + a_j) \le y$

我们对这个不等式进行移项，把未知的 $a_i + a_j$ 提取出来：

1. 先两边减去 $S$：

    $$x - S \le -(a_i + a_j) \le y - S$$

2. 两边同时乘 $-1$：

    $$S - y \le a_i + a_j \le S - x$$

令 $L = S - y$，$R = S - x$。现在，问题就转换成了：**在一个数组中，寻找有多少对元素的和落在给定的区间 $[L, R]$ 内。**

枚举每一个元素 $a_i$，对于当前元素 $a_i$，我们需要在它之后的元素中找出有多少个元素 $a_j$ 满足 $L - a_i \le a_j \le R - a_i$，先排序，后用二分查找即可。

> [!NOTE]
>
> 注意 `std::accumulate` 的返回值和累加过程的类型取决于第三个参数，所以应该传 `0LL`。

## Code

```c++
// Problem: CF 2051 D
// Contest: Codeforces - Codeforces Round 995 (Div. 3)
// URL: https://codeforces.com/contest/2051/problem/D
// Time: 2026-05-17 23:27:47
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
const int N = 2e5 + 10;

ll a[N];

void solve()
{
    ll n, x, y;
    cin >> n >> x >> y;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    ll sum = accumulate(a + 1, a + n + 1, 0LL);

    sort(a + 1, a + n + 1);

    ll res = 0;
    for (int i = 1; i <= n; i++)
    {
        ll pos1 = lower_bound(a + i + 1, a + n + 1, sum - a[i] - y) - a;
        ll pos2 = upper_bound(a + i + 1, a + n + 1, sum - a[i] - x) - a - 1;

        if (pos1 <= pos2)
            res += pos2 - pos1 + 1;
    }

    cout << res << endl;
}

int main()
{
    fastio();

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

