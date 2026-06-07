---
title: 动态规划 (Notebook)
published: 2024-01-01
description: "Dynamic Programming"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 动态规划的理解

动态规划的核心不是数组或循环，而是两个性质：

1. 最优子结构：一个大问题的答案可以由很多小问题的答案推出
2. 重叠子问题：不同的大问题会依赖同一个小问题

DP要解决的问题就是把重复计算过的状态存下来。在数学本质上，它把一个问题拆成若干有依赖关系的子问题，并避免重复计算。
![](https://img.hailuo4ever.com/notebook_dp/1.png)

# 记忆化搜索

实际上，记忆化搜索是DP的一种实现方式，可以理解成DFS+缓存表。

它的思考方式是：我先不管状态的计算顺序，需要哪个状态，我就递归去算哪个状态，算过之后记下来，下次直接返回。

记忆化搜索更像：我要 `f(n)`，所以我去找 `f(n-1), f(n-2)`。从问题目标出发，考虑要得到当前状态的答案，需要哪些子状态。

递推 DP 更像：我已经知道 `f(0), f(1)`，所以我推出 `f(2), f(3)`。从状态转移顺序出发，考虑当前状态可以更新哪些后续状态。

当状态转移类似DFS时，例如树形DP，图上DP；或者状态顺序不好确定时，考虑使用记忆化搜索。

# 经典题

## 选择m个不相交区间，使区间和最大

### 状态设计

假设我们定义 $dp[i][j]$ 表示在前 $i$ 个数中选择最多 $j$ 个区间时，能够获得的最大区间和。

当处理 $a_i$ 时，存在两种截然不同的情况：

1. 将 $a_i$ 接在前一个区间的末尾；
2. 从 $a_i$ 开始创建一个新区间。

但是，仅仅知道 $dp[i-1][j]$，无法判断最后一个区间是否恰好延伸到了 $i-1$。

因此，需要增加一个状态，记录当前是否正在延伸区间。

考虑定义两个状态。

$f[i][j]$ 表示：只考虑前 $i$ 个元素，最多选择 $j$ 个区间，并且 **第 $i$ 个元素必须被选择** 时的最大区间和。

$g[i][j]$ 表示：只考虑前 $i$ 个元素，最多选择 $j$ 个区间时的最大区间和，对第 $i$ 个元素是否选择没有限制。

### 状态转移

对于 $f[i][j]$，如果选择元素 $a_i$，有两种情况：

1. 接在原有区间后面：如果 $a_{i-1}$ 已经位于某个区间中，可以直接延长这个区间：$f[i-1][j] + a_i$
2. 开始一个新区间：之前最多选择了 $j-1$ 个区间，现在要创建第 $j$ 个区间：$g[i-1][j-1] + a_i$

因此：$f[i][j]=max(f[i−1][j]+a_i,g[i−1][j−1]+a_i)$。

对于 $g[i][j]$，对于前 $i$ 个元素，最终答案有两种可能：

1. 不选择 $a_i$，答案沿用 $g[i-1][j]$；

2. 选择 $a_i$，答案为 $f[i][j]$。

因此：$g[i][j]=max(g[i−1][j],f[i][j])$。

### 初始化

要求最多选择 $m$ 个区间，因此可以一个都不选，初始答案为 $0$，因此初始化 $g[0][j] = 0$，其中 $0 \le j \le m$，由于不存在以位置 $0$ 为结尾的区间，因此 $f[0][j] = -inf$，最终答案为 $g[n][m]$。

### Code

```c++
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
    int n, m;
    cin >> n >> m;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    const ll neg_inf = -(1LL << 60);

    vector<vector<ll>> f(n + 1, vector<ll>(m + 1, neg_inf));
    vector<vector<ll>> g(n + 1, vector<ll>(m + 1, 0));

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            f[i][j] = max(f[i - 1][j], g[i - 1][j - 1]) + a[i];
            g[i][j] = max(g[i - 1][j], f[i][j]);
        }
    }

    cout << g[n][m] << endl;
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

# Trick

## 末尾追加数字的模数转移

> 常用于子序列计数、数位DP、整除性统计

若当前数字为 $x$，且 $x \bmod m=r$，在十进制数 $x$ 的末尾追加数字 $d$ 后，新数字为：$x' = 10 \cdot x + d$。

因此新余数为 $r' = (10 \cdot r + d) \bmod m$，更一般地，在 $B$ 进制下有 $r' = (B \cdot r + d) \bmod m$。

一般使用这个方法时，对后续转移而言，相同余数的数字是等价的。