---
title: 图论 (Notebook)
published: 2024-01-01
description: "Graph Theory"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 分层图最短路

分层图是一种建模技巧，它的核心思想是：**当到达同一个节点时，仅记录“当前位置”不够，还需要记录某种额外状态，就把一个节点拆成多个状态节点。（特殊操作会改变未来的决策能力，因此需要增加一维状态）**

最典型的额外状态是：

- 已经使用了多少次免费通行机会；
- 已经修改了多少条边；
- 是否使用过一次特殊技能；
- 当前钥匙数量；
- 当前奇偶状态；
- 已经穿过了多少个障碍物。

然后再在扩展后的图上运行 Dijkstra、BFS 或 0-1 BFS。

## 算法详解

### 为什么普通最短路不够用？

考虑一个简单问题：

> 给定一张带权图，从起点 $s$ 到终点 $t$。你最多可以选择 $k$ 条边，使这些边的费用变为 $0$。求最短路。

假设当前走到了节点 $u$，如果只记录普通最短路状态 $dist[u]$，那么信息是不完整的。

例如下面两种情况虽然都处于节点 $u$，但对未来的决策能力不同：

- 到达 $u$ 时，一次免费机会都没有使用；

- 到达 $u$ 时，免费机会已经全部用完。

前者之后还可以把某条昂贵的边变成免费边，后者则不行，因此，两种状态不能合并。

### 建模思路：把图复制成多层

可以把原图想象成一栋大楼。

- 第 $0$ 层：尚未使用任何特殊操作；
- 第 $1$ 层：已经使用了 $1$ 次特殊操作；
- 第 $2$ 层：已经使用了 $2$ 次特殊操作；
- $\cdots$
- 第 $k$ 层：已经使用了 $k$ 次特殊操作。

原图中的每个节点 $u$，都会被复制成：
$$
(u,0),(u,1),(u,2),\ldots,(u,k)
$$
其中：$(u,j)$ 表示：当前位于节点 $u$，并且已经使用了恰好 $j$ 次特殊操作。

每一次正常走边，相当于在同一层楼横向移动，每一次使用特殊操作，相当于前往下一层。

> [!NOTE]
>
> 实际上不需要把原图扩成这么多点，再加上好多边。只要在跑最短路的时候使用一种类似DP的思想转移即可。

### 模型：最多让 $k$ 条边免费

假设原图中存在一条边 $u \to v$，边权为 $w$，对于每一层 $j$，我们都有两种选择。

1. 正常支付费用：不使用特殊操作，停留在第 $j$ 层。$(u, j) \to (v, j)$，边权为 $w$。
2. 让当前边免费：使用一次特殊操作，从第 $j$ 层进入第 $j+1$ 层，边权为 $0$，前提是 $j < k$

状态转移：定义 $dist[u][j]$ 表示从起点 $s$ 出发，到达节点 $u$，并且恰好使用了 $j$ 次免费机会时的最短距离。

对于边 $u \to v$，边权为 $w$，转移为：

不使用免费机会
$$
dist[v][j]
=
\min \left(dist[v][j],dist[u][j]+w\right)
$$
使用一次免费机会

当 $j < k$ 时：
$$
dist[v][j+1]
=
\min \left(dist[v][j+1],dist[u][j]\right)
$$

### 不同情况下的答案

最多使用 $k$ 次：答案为：$\min_{0 \le j \le k} dist[t][j]$

恰好使用 $k$ 次：答案为：$dist[t][k]$

至少使用一次：答案为：$\min_{1 \le j \le k} dist[t][j]$

## 例题

[P4568 JLOI2011 飞行路线 - 洛谷](https://www.luogu.com.cn/problem/P4568)

### Code

```c++
// Problem: Luogu P4568
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P4568
// Time: 2026-06-07 10:43:47
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

struct Edge
{
    int v, w;
};

void solve()
{
    int n, m, k;
    cin >> n >> m >> k;

    int s, t;
    cin >> s >> t;
    s++, t++;

    vector<vector<Edge>> g(n + 1);
    for (int i = 1; i <= m; i++)
    {
        int u, v, w;
        cin >> u >> v >> w;
        u++, v++;

        g[u].push_back({v, w});
        g[v].push_back({u, w});
    }

    vector<vector<int>> dist(n + 1, vector<int>(k + 1, inf));

    using state = array<int, 3>;
    priority_queue<state, vector<state>, greater<state>> pq;
    dist[s][0] = 0;
    pq.push({0, s, 0});

    while (!pq.empty())
    {
        auto [d, u, s] = pq.top();
        pq.pop();

        if (d > dist[u][s])
            continue;

        for (auto [v, w]: g[u])
        {
            if (dist[v][s] > d + w)
            {
                dist[v][s] = d + w;
                pq.push({dist[v][s], v, s});
            }

            if (s < k && dist[v][s + 1] > d)
            {
                dist[v][s + 1] = d;
                pq.push({dist[v][s + 1], v, s + 1});
            }
        }
    }

    int res = inf;
    for (int i = 0; i <= k; i++)
        res = min(res, dist[t][i]);
    cout << res << endl;
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

# LCA

## 传统倍增法

> 
