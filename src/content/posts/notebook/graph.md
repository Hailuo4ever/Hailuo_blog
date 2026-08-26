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

## 思路

假设我们想求 $LCA$，朴素的办法是让两个节点不断向父亲走，但这样太慢了，于是我们考虑**倍增**。

定义 $fa[u][j]$ 表示 $u$ 的 $2^j$ 级祖先。整个 $fa$ 数组可以通过一次 $dfs$ 预处理求出。

```c++
fa[u][0] = p;

for (int j = 1; j < lg; j++)
    fa[u][j] = fa[fa[u][j - 1]][j - 1];
```

如果我们要从 $u$ 向上跳 $2^j$ 层，可以分两次，先跳 $2^{j-1}$ 层到达 $fa[u][j-1]$，然后再从这里跳 $2^{j-1}$ 层，所以 $fa[fa[u][j-1]][j-1]$ 即为 $u$ 的 $2^j$ 级祖先。

同时还需要记录每个点的深度。

在查询时，需要先保证 $u$ 的深度一定不比 $v$ 浅。我们先把两个节点尽量跳到同一个深度，但保证 $u$ 不在 $v$ 上方。

两个节点同深度后，如果 $u=v$，那么 $lca(u,v)=v$。否则我们让两个节点一起向上跳，但我们不能直接跳到公共祖先，而是保持他们在公共祖先的下方。因为如果再跳，有可能刚好跳到一个祖先，也有可能直接超过去了。最后应该跳到如下的形式，返回 $fa[u][0]$ 即可。

```c++
        LCA
       /   \
      u     v
```

## Code

```c++
struct LCA
{
    int n, lg;
    vector<vector<int>> g, fa;
    vector<int> dep;

    LCA(int n) : n(n)
    {
        lg = 1;
        while ((1 << lg) <= n)
            lg++;

        g.resize(n + 1);
        dep.resize(n + 1);
        fa.assign(n + 1, vector<int>(lg));
    }

    void add(int u, int v)
    {
        g[u].eb(v);
        g[v].eb(u);
    }

    void dfs(int u, int p)
    {
        dep[u] = dep[p] + 1;
        fa[u][0] = p;

        for (int j = 1; j < lg; j++)
            fa[u][j] = fa[fa[u][j - 1]][j - 1];

        for (int v: g[u])
        {
            if (v == p)
                continue;
            dfs(v, u);
        }
    }

    void build(int rt = 1)
    {
        dfs(rt, 0);
    }

    int lca(int u, int v)
    {
        if (dep[u] < dep[v])
            swap(u, v);

        for (int j = lg - 1; j >= 0; j--)
        {
            if (dep[fa[u][j]] >= dep[v])
                u = fa[u][j];
        }

        if (u == v)
            return u;

        for (int j = lg - 1; j >= 0; j--)
        {
            if (fa[u][j] != fa[v][j])
            {
                u = fa[u][j];
                v = fa[v][j];
            }
        }

        return fa[u][0];
    }
};
// LCA tr(n), tr.add(u, v), tr.build(root), tr.lca(u, v)

```



# 强联通分量 (SCC)

在有向图中，如果两个点 $u,v$ 满足 $u\to v$ 且 $v\to u$，那么他们是互相可达的。

如果一个点集中的任意两个点都互相可达，那么这个点集就是一个强联通分量，简称 $SCC$。

强联通分量具有重要的意义，由于内部所有点互相可达，因此这些点本质上可以缩成一个点。而**一个重要的性质是，把一张有向图的所有 $SCC$ 缩点后，得到的图一定是一张有向无环图**。缩点后可以进行 $DP$ 或拓扑序。

## Tarjan 缩点

$Tarjan$ 的基本原理是进行一次 $DFS$，把图组织成一棵搜索树。在这个过程中维护两个数组：`dfn[u]` 和 `low[u]`。

`dfn[u]` 表示点 $u$ 第一次被 $DFS$ 访问的时间，`low[u]` 表示从 $u$ 出发，在当前 $DFS$ 结构中能够到达的最早祖先时间戳。

**这样维护是因为，祖先到后代的可达性已经由 $dfs$ 确定，我们需要知道后代能不能回到祖先，因此记录 $low$**。 

还需要在搜索过程中维护一个栈，表示**哪些点所属的强连通分量还没有被确定**。因为每个节点可能有两种情况：被搜到了但没有确定它属于哪个强连通分量，或者已经确定了所处的强联通分量。栈的第二个作用是找到一个强连通分量后，把他们整体取出来。

> ```c++
> 1 → 2 → 3
> ↑       ↓
> └───────┘
> ```
>
> 显然 `dfn[1] = 1`，`dfn[2] = 2`，`dfn[3] = 3`。但从 $3$ 可以沿边 $3 \to 1$ 回到一个更早访问的点 $1$。所以 `low[3] = 1`，而又因为 $2 \to 3 \to 1$，所以 `low[2] = 1`，同理 `low[1] = 1`。

考虑在 $DFS$ 过程中，会遇到哪几种边。假设现在枚举到了边 $u \to v$。，$Tarjan$ 主要分三种情况。

1. $v$ 之前没有被访问过：我们继续搜索 $v$，等 $v$ 搜完了以后更新 `low[u] = min(low[u], low[v])`。因为如果 $v$ 能回到一个更早的祖先，显然 $u$ 也可以。
2. $v$ 已经被访问过，并且仍然在栈中：`low[u] = min(low[u], dfn[v])`，这个边通常可以理解成：当前搜索路径重新连回了一个仍然活跃的老点。注意这里在栈中是很重要的，因为如果出栈，说明他属于另一个已经被确定下来的连通分量，而不是当前的。如果 `dfn[u] == low[u]`，说明 $u$ 是一个 $SCC$ 的 $DFS$ 根，此时从栈顶不断弹点，直到弹出 $u$。
3. $v$ 已经被访问过，并且不在栈中：说明 $v$ 已搜索完毕，其所在的连通分量也已经被处理，因此不需要操作。

> 为什么 `dfn[u] == low[u]` 就能形成强连通分量？
>
> ```c++
> 1 → 2 → 3  dfn: 1, 2, 3
> ↑       ↓
> └───────┘  low: 1, 1, 1
> ```
>
> 对于 $3$，`low[3] != dfn[3]`，说明 $3$ 可以回到更早的点，因此 $3$ 不是这个 $SCC$ 的根。对于 $2$ 同理。
>
> 直到 $1$，有 `low[1] == dfn[1]`，说明这个强联通结构最多只能回到 $1$，无法再回到 $1$ 前面的活跃祖先。
>
> 所以 $1$ 就是这个强连通分量的最上层节点。当前栈中从栈顶到 $1$ 全部属于同一个强连通分量。

## 缩点后处理

### 有向无环图

对于 $SCC$ 模板。执行 `auto bel = scc.work()` 后，`bel[u]` 表示 $u$ 所属 $SCC$ 分量的编号。然后建立一张新的有向图，描述各个分量之间的连通关系。

```c++
int C = scc.cnt;
vector<vector<int>> g(C);

for (int u = 1; u <= n; u++)
{
    for (int v : scc.adj[u])
    {
        int x = bel[u], y = bel[v];

        if (x != y)
            g[x].push_back(y);
    }
}
```

### 点权

假如每个点有点权 $a[i]$，我们可以合并每个强联通分量的点权。

```c++
vector<long long> val(scc.cnt);

for (int i = 1; i <= n; i++)
    val[bel[i]] += a[i];
```

## 应用

### 有向图上的最长路 / 最大收益

[P3387 【模板】缩点 / 强连通分量 - 洛谷](https://www.luogu.com.cn/problem/P3387)

缩点后得到有向无环图，和所有强联通分量的点权。我们考虑在这张有向无环图上 $DP$。

定义 $dp[v]$ 为走到编号为 $v$ 的强连通分量时的最大收益。对于 $u\to v$，显然转移方程为 $dp_v=\max(dp_v,dp_u+val_v)$。

使用拓扑排序来 $DP$ 即可。

### 最少从几个点出发才能遍历整张图

考虑缩点之后变成的有向无环图。在这张图中，如果一个强联通分量的入度为 $0$，说明没有其它的强连通分量可以到达它，因此必须从它的内部选一个起点，因此答案为缩点图中入度为 $0$ 的 $SCC$ 数量。

### 最少加多少条边使整个图强联通

设入度为 $0$ 的 $SCC$ 数量为 $S$，设出度为 $0$ 的 $SCC$ 数量为 $T$。

如果只有一个强联通分量，答案为 $0$，否则答案为 $max(S,T)$。

## Code

```c++
struct SCC
{
    int n;
    vector<vector<int>> adj;
    vector<int> stk;
    vector<int> dfn, low, bel;
    int cur, cnt;

    SCC() {}
    SCC(int n)
    {
        init(n);
    }

    void init(int n)
    {
        this->n = n;
        adj.assign(n + 1, {});
        dfn.assign(n + 1, -1);
        low.resize(n + 1);
        bel.assign(n + 1, -1);
        stk.clear();
        cur = cnt = 0;
    }

    void addEdge(int u, int v)
    {
        adj[u].push_back(v);
    }

    void dfs(int x)
    {
        dfn[x] = low[x] = cur++;
        stk.push_back(x);

        for (auto y: adj[x])
        {
            if (dfn[y] == -1)
            {
                dfs(y);
                low[x] = min(low[x], low[y]);
            }
            else if (bel[y] == -1)
                low[x] = min(low[x], dfn[y]);
        }

        if (dfn[x] == low[x])
        {
            int y;
            do
            {
                y = stk.back();
                bel[y] = cnt;
                stk.pop_back();
            } while (y != x);
            cnt++;
        }
    }

    vector<int> work()
    {
        for (int i = 1; i <= n; i++)
            if (dfn[i] == -1)
                dfs(i);

        return bel;
    }
};

// 1-indexed
// SCC scc(n);
// scc.addEdge(u, v);
// auto bel = scc.work();
// int cnt = scc.cnt;

```

# 2 - SAT

有 $n$ 个布尔变量 $x_1\sim x_n$，另有 $m$ 个需要满足的条件，每个条件的形式都是 「$x_i$ 为 `true` / `false` 或 $x_j$ 为 `true` / `false`」。比如 「$x_1$ 为真或 $x_3$ 为假」、「$x_7$ 为假或 $x_2$ 为假」。

2-SAT 问题的目标是给每个变量赋值使得所有条件得到满足。其中的 $2$ 实际上指的是每个约束最多包含两个文字。

## 思路

首先我们将条件的约束转化成蕴含关系式 $(A_1\lor B_1)\land(A_2\lor B_2)\land\cdots\land(A_m\lor B_m)$。

**我们可以将已知条件建模成一张蕴含图**。考虑 $A\lor B$ 只有在 $A=0$ 且 $B=0$ 时取到假，**因此存在等价关系 ${A\lor B\iff(\neg A\Rightarrow B)\land(\neg B\Rightarrow A)}$**。显然一个变量需要两个点，我们在这个 $2n$ 节点的图上直接建边。边 $A\rightarrow B$ 表示如果选择 $A$，就一定要选择 $B$。

> 这里的思路是：首先把非法情况写出来，然后取反这个非法情况，得到一个含有 $OR$ 的表达式，然后建图。
