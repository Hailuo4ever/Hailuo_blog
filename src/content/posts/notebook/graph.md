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

考虑到这张蕴含图，由上所述，边 $A\rightarrow B$ 表示如果选择 $A$，就一定要选择 $B$。这启发我们对这张图缩点并跑强联通分量，不难发现 $x_i,\neg x_i$ 不能互相推出，否则必然存在逻辑矛盾。

因此，**`2-SAT` 有解的充要条件是：$\forall i,\; SCC(x_i)\neq SCC(\neg x_i)$**。

考虑如何构造解集，我们根据缩点后的有向无环图的拓扑顺序来选。如果某个状态推出另一个状态，那么我们不能把前者设为“选中”，同时把后者设为“不选”。由于求强联通分量时，编号是按照弹栈顺序的，也就是缩点有向无环图的逆拓扑序，因此按照这个顺序构造即可。

## 常用建模

| 题意               | 逻辑式                             | 写法                                            |
| ------------------ | ---------------------------------- | ----------------------------------------------- |
| $x,y$ 至少一个为真 | $x\lor y$                          | `addClause(x,1,y,1)`                            |
| $x,y$ 不能同时真   | $\neg x\lor\neg y$                 | `addClause(x,0,y,0)`                            |
| $x,y$ 至多一个真   | 同上                               | `addClause(x,0,y,0)`                            |
| $x,y$ 恰好一个真   | $(x\lor y)\land(\neg x\lor\neg y)$ | 两个 clause                                     |
| $x,y$ 相同         | $x\leftrightarrow y$               | `addClause(x, 0, y, 1); addClause(x, 1, y, 0);` |
| $x,y$ 不同         | $x\oplus y$                        | `addClause(x, 1, y, 1); addClause(x, 0, y, 0);` |
| $x\Rightarrow y$   | $\neg x\lor y$                     | `addClause(x,0,y,1)`                            |
| 强制 $x=1$         | $x\lor x$                          | `addClause(x,1,x,1)`                            |
| 强制 $x=0$         | $\neg x\lor\neg x$                 | `addClause(x,0,x,0)`                            |

## 模板代码

```c++
struct TwoSat
{
    int n;
    vector<vector<int>> e;
    vector<bool> ans;
    TwoSat(int n) : n(n), e(2 * n + 1), ans(n + 1) {}

    void addClause(int u, bool f, int v, bool g)
    {
        e[2 * u - 1 + !f].push_back(2 * v - 1 + g);
        e[2 * v - 1 + !g].push_back(2 * u - 1 + f);
    }

    bool satisfiable()
    {
        vector<int> id(2 * n + 1, -1), dfn(2 * n + 1, -1), low(2 * n + 1, -1);
        vector<int> stk;
        int now = 0, cnt = 0;

        auto tarjan = [&](auto &&self, int u) -> void
        {
            stk.push_back(u);
            dfn[u] = low[u] = now++;

            for (auto v: e[u])
            {
                if (dfn[v] == -1)
                {
                    self(self, v);
                    low[u] = min(low[u], low[v]);
                }
                else if (id[v] == -1)
                    low[u] = min(low[u], dfn[v]);
            }

            if (dfn[u] == low[u])
            {
                int v;
                do
                {
                    v = stk.back();
                    stk.pop_back();
                    id[v] = cnt;
                } while (v != u);
                ++cnt;
            }
        };

        for (int i = 1; i <= 2 * n; i++)
            if (dfn[i] == -1)
                tarjan(tarjan, i);

        for (int i = 1; i <= n; i++)
        {
            if (id[2 * i - 1] == id[2 * i])
                return false;

            ans[i] = id[2 * i - 1] > id[2 * i];
        }

        return true;
    }
};

```

# 欧拉路径 / 欧拉回路

给定一张图，如果存在一条路径，使得图中的每一条边都恰好经过一次，那么这条路径就叫欧拉路径。

| 问题       | 要求                         |
| ---------- | ---------------------------- |
| 欧拉路径   | 每条**边**恰好一次           |
| 欧拉回路   | 每条**边**恰好一次且回到起点 |
| 哈密顿路径 | 每个**点**恰好一次           |
| 哈密顿回路 | 每个**点**恰好一次且回到起点 |

## 判定定理

### 无向图

如果存在欧拉回路，显然当我们经过任意一个点时，只要进入了这个点，就必须通过另外一条边离开这个点。**因此边一定是成对出现的**。

所以普通点的度数一定是偶数。且由于能从起点回到原点，因此起终点也不存在只进不出或者只出不进的情况。

因此，**无向图存在欧拉回路，当且仅当所有有边的点连通，并且所有点度数均为偶数**。

我们考虑欧拉路径。欧拉路径和欧拉回路的区别在于允许起点和终点不相同。考虑起点和终点的度数，一个只出一次，一个只进一次，显然是奇度的。因此，**无向图存在欧拉路径，当且仅当所有有边的点连通，并且奇度顶点数量为 $0$ 或 $2$**。

### 有向图

有向图需要分别考虑入度和出度。考虑欧拉回路，如果要回到起点，每个点都必须满足入度和出度相同。因此，**有向图存在欧拉回路，当且仅当所有有边的点连通，并且对所有点，有 $in[u]=out[u]$**。

考虑有向图的欧拉路径，起点比普通点多出去一次，有 $out[S]=in[S]+1$；终点比普通点多进来一次，有 $in[T]=out[T]+1$。其余点均有 $in[u]=out[u]$。因此，**有向图存在非闭合欧拉路径时，恰好有一个起点的 `out - in = 1`，恰好有一个终点的 `in = out - 1`，其余点 `in = out`**。

## Hierholzer 算法

Hierholzer 的本质是特殊一些的 DFS，核心是**确定一条边在最终欧拉路中的位置**。

在 DFS 过程中，如果简单地看到没走过的边就走，容易直接进循环，但并没有验证完其他的边。因此我们需要**一直走没走过的边，直到无路可走时，再把当前点加入答案**。大致思路如下：

```c++
dfs(u)
{
    while (u 还有没有走过的边)
    {
        取一条 u -> v
        删除这条边
        dfs(v)
    }

    ans.push_back(u);
}
```

> [!NOTE]
>
> 1. 由于 DFS 的递归是从深到浅 `return` 的，所以最终答案需要反转。
>
> 2. 对于无向图，我们需要给两条边赋予相同编号，防止重复走。
> 3. 如果每次 DFS 都从头扫一遍每个点的邻接情况，可能会导致复杂度变差，因此记录 `cur[u]` 表示 $u$ 的邻接表已经扫描到哪里。

[记录详情 - 洛谷 | P7771 有向图欧拉路径](https://www.luogu.com.cn/record/296325313)

[记录详情 - 洛谷 | P2731 无向图欧拉路径](https://www.luogu.com.cn/record/296322944)

## 模板代码

```c++
struct Euler
{
    int n, m = 0, type = 0;
    bool dir; // true 有向图，false 无向图
    vector<vector<pii>> adj;
    vector<int> deg;

    Euler(int n, bool dir) : n(n), dir(dir), adj(n + 1), deg(n + 1) {}

    void addEdge(int u, int v)
    {
        adj[u].eb(v, ++m);

        if (dir)
            deg[u]++, deg[v]--;
        else
            adj[v].eb(u, m), deg[u]++, deg[v]++;
    }

    int getStart()
    {
        if (!m)
            return type = 2, 1;

        if (dir)
        {
            int s = -1, cntS = 0, cntT = 0;

            for (int u = 1; u <= n; u++)
            {
                if (deg[u] == 1)
                    cntS++, s = u;
                else if (deg[u] == -1)
                    cntT++;
                else if (deg[u] != 0)
                    return -1;
            }

            if (cntS == 1 && cntT == 1)
                return type = 1, s;

            if (cntS || cntT)
                return -1;
        }
        else
        {
            int s = -1, cnt = 0;

            for (int u = 1; u <= n; u++)
                if (deg[u] & 1)
                {
                    cnt++;
                    if (s == -1)
                        s = u;
                }

            if (cnt == 2)
                return type = 1, s;

            if (cnt)
                return -1;
        }

        type = 2;
        for (int u = 1; u <= n; u++)
            if (!adj[u].empty())
                return u;

        return -1;
    }

    vector<int> work()
    {
        type = 0;
        int s = getStart();

        if (s == -1)
            return {};

        for (int u = 1; u <= n; u++)
            sort(all(adj[u]));

        vector<int> cur(n + 1), ans;
        vector<char> vis(m + 1);

        auto dfs = [&](auto &&self, int u) -> void
        {
            while (cur[u] < adj[u].size())
            {
                auto [v, id] = adj[u][cur[u]++];

                if (vis[id])
                    continue;

                vis[id] = true;
                self(self, v);
            }

            ans.eb(u);
        };

        dfs(dfs, s);

        if (ans.size() != m + 1)
            return type = 0, vector<int>{};

        reverse(all(ans));
        return ans;
    }
};

```

```c++
Euler e(n, false); // 无向图
Euler e(n, true); // 有向图

for (int i = 1; i <= m; i++)
{
    int u, v;
    cin >> u >> v;
    e.addEdge(u, v);
}

auto ans = e.work();
```

# 树链剖分（HLD）

树链剖分用于将树上路径问题转化为若干个数组区间问题。它给整棵树的所有节点赋一个 $dfn$ 编号，满足以下性质：一条重链上的节点编号连续、一个节点的整棵子树编号连续、任意的 $u\to v$ 路径都可以拆成 $O(\log n)$ 条重链。套上线段树即可进行很多操作。

## 原理

树链剖分通常需要维护如下的信息：

| 数组     | 含义                   |
| -------- | ---------------------- |
| `fa[u]`  | $u$ 的父亲             |
| `dep[u]` | $u$ 的深度             |
| `siz[u]` | $u$ 的子树大小         |
| `son[u]` | $u$ 的重儿子           |
| `top[u]` | $u$ 所在重链的链顶     |
| `dfn[u]` | $u$ 在线性序列中的编号 |

第一次 $dfs$ 我们需要处理出所有的重儿子信息。$u$ 的重儿子定义为 $u$ 的所有儿子中 $siz$ 最大的。

第二次 $dfs$ 我们剖出重链。定义 `dfs2(u, tp)`，其中 $tp$ 表示 $u$ 所在重链的链顶。由于我们希望剖出重链，所以先 $dfs$ 重儿子，再 $dfs$ 其他儿子。

考虑如何处理路径问题。对于路径 $u\rightarrow v$，如果 `top[u] = top[v]`，那么他们在一条重链，也就是一个连续的区间上，不需要特殊处理。考虑 `top[u] != top[v]` 的情况。

> 例如，路径可能是 `5 -> 2 -> 1 -> 3 -> 7`，但树剖希望拆成 `5, 1 -> 2, 3 -> 7`，每一段都是一条重链内部的连续区间，而我们的目的是不断把路径两端所在的重链剥掉。
>

首先我们要把不同链的两个点跳到同一条上。我们每次处理完整的 $top[u]\to u$ 区间，不断向 $top[u]$ 跳。

```c++
while (top[u] != top[v]) // 只要不在同一条链，就继续拆
{
    if (dep[top[u]] < dep[top[v]]) // 保证 top[u] 是两个链顶里更深的那个
        swap(u, v);

    query(dfn[top[u]], dfn[u]); // 把当前确定属于路径的 top[u] -> u 整条重链处理掉

    u = fa[top[u]]; // 跨过轻边向 LCA 靠近
}
```

跨过轻边以后，处理最后一段区间，按照正常 $dfn$ 处理即可。

## Code

### 模板

```c++
struct HLD
{
    int n, cur;

    vector<vector<int>> g;
    vector<int> fa, dep, siz, son, top, dfn;

    HLD() {}

    HLD(int n)
    {
        init(n);
    }

    void init(int n)
    {
        this->n = n;
        cur = 0;

        g.assign(n + 1, {});
        fa.assign(n + 1, 0);
        dep.assign(n + 1, 0);
        siz.assign(n + 1, 0);
        son.assign(n + 1, 0);
        top.assign(n + 1, 0);
        dfn.assign(n + 1, 0);
    }

    void addEdge(int u, int v)
    {
        g[u].push_back(v);
        g[v].push_back(u);
    }

    void dfs1(int u, int p)
    {
        fa[u] = p;
        dep[u] = dep[p] + 1;
        siz[u] = 1;

        for (auto v: g[u])
        {
            if (v == p)
                continue;

            dfs1(v, u);

            siz[u] += siz[v];

            if (!son[u] || siz[v] > siz[son[u]])
                son[u] = v;
        }
    }

    void dfs2(int u, int tp)
    {
        top[u] = tp;
        dfn[u] = ++cur;

        if (son[u])
            dfs2(son[u], tp);

        for (auto v: g[u])
        {
            if (v == fa[u] || v == son[u])
                continue;

            dfs2(v, v);
        }
    }

    void work(int root = 1)
    {
        dfs1(root, 0);
        dfs2(root, root);
    }

    int lca(int u, int v)
    {
        while (top[u] != top[v])
        {
            if (dep[top[u]] < dep[top[v]])
                swap(u, v);

            u = fa[top[u]];
        }

        return dep[u] < dep[v] ? u : v;
    }

    bool isAncestor(int u, int v)
    {
        return dfn[u] <= dfn[v] && dfn[v] <= dfn[u] + siz[u] - 1;
    }
};
```

### 模板（洛谷 P3384）

[R299689230 - 记录详情 - 洛谷](https://www.luogu.com.cn/record/299689230)

```c++
// Problem: Luogu P3384
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P3384
// Time: 2026-09-25 21:51:31
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
// clang-format on

using ll = long long;
using ld = long double;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll INF = 4e18;
ll mod;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

struct HLD
{
    int n, cur;

    vector<vector<int>> g;
    vector<int> fa, dep, siz, son, top, dfn;

    HLD() {}

    HLD(int n)
    {
        init(n);
    }

    void init(int n)
    {
        this->n = n;
        cur = 0;

        g.assign(n + 1, {});
        fa.assign(n + 1, 0);
        dep.assign(n + 1, 0);
        siz.assign(n + 1, 0);
        son.assign(n + 1, 0);
        top.assign(n + 1, 0);
        dfn.assign(n + 1, 0);
    }

    void addEdge(int u, int v)
    {
        g[u].push_back(v);
        g[v].push_back(u);
    }

    void dfs1(int u, int p)
    {
        fa[u] = p;
        dep[u] = dep[p] + 1;
        siz[u] = 1;

        for (auto v: g[u])
        {
            if (v == p)
                continue;

            dfs1(v, u);

            siz[u] += siz[v];

            if (!son[u] || siz[v] > siz[son[u]])
                son[u] = v;
        }
    }

    void dfs2(int u, int tp)
    {
        top[u] = tp;
        dfn[u] = ++cur;

        if (son[u])
            dfs2(son[u], tp);

        for (auto v: g[u])
        {
            if (v == fa[u] || v == son[u])
                continue;

            dfs2(v, v);
        }
    }

    void work(int root = 1)
    {
        dfs1(root, 0);
        dfs2(root, root);
    }

    int lca(int u, int v)
    {
        while (top[u] != top[v])
        {
            if (dep[top[u]] < dep[top[v]])
                swap(u, v);

            u = fa[top[u]];
        }

        return dep[u] < dep[v] ? u : v;
    }

    bool isAncestor(int u, int v)
    {
        return dfn[u] <= dfn[v] && dfn[v] <= dfn[u] + siz[u] - 1;
    }
};

template<class Info, class Tag>
struct LazySegmentTree
{
    int n;
    vector<Info> info;
    vector<Tag> tag;

    LazySegmentTree() : n(0) {}

    LazySegmentTree(int n_, Info v = Info())
    {
        init(n_, v);
    }

    template<class T>
    LazySegmentTree(const vector<T> &a)
    {
        init(a);
    }

    void init(int n_, Info v = Info())
    {
        vector<Info> a(n_ + 1, v);
        init(a);
    }

    template<class T>
    void init(const vector<T> &a)
    {
        n = (int) a.size() - 1;

        info.assign(n * 4 + 5, Info());
        tag.assign(n * 4 + 5, Tag());

        if (n)
            build(1, 1, n, a);
    }

    template<class T>
    void build(int i, int l, int r, const vector<T> &a)
    {
        if (l == r)
        {
            info[i] = a[l];
            return;
        }

        int mid = (l + r) >> 1;

        build(i << 1, l, mid, a);
        build(i << 1 | 1, mid + 1, r, a);

        pull(i);
    }

    void pull(int i)
    {
        info[i] = info[i << 1] + info[i << 1 | 1];
    }

    void apply(int i, const Tag &v)
    {
        info[i].apply(v);
        tag[i].apply(v);
    }

    void push(int i)
    {
        apply(i << 1, tag[i]);
        apply(i << 1 | 1, tag[i]);

        tag[i] = Tag();
    }

    void modify(int pos, const Info &v)
    {
        modify(1, 1, n, pos, v);
    }

    void modify(int i, int l, int r, int pos, const Info &v)
    {
        if (l == r)
        {
            info[i] = v;
            tag[i] = Tag();
            return;
        }

        push(i);

        int mid = (l + r) >> 1;

        if (pos <= mid)
            modify(i << 1, l, mid, pos, v);
        else
            modify(i << 1 | 1, mid + 1, r, pos, v);

        pull(i);
    }

    void rangeApply(int l, int r, const Tag &v)
    {
        rangeApply(1, 1, n, l, r, v);
    }

    void rangeApply(int i, int l, int r, int ql, int qr, const Tag &v)
    {
        if (ql <= l && r <= qr)
        {
            apply(i, v);
            return;
        }

        push(i);

        int mid = (l + r) >> 1;

        if (ql <= mid)
            rangeApply(i << 1, l, mid, ql, qr, v);

        if (qr > mid)
            rangeApply(i << 1 | 1, mid + 1, r, ql, qr, v);

        pull(i);
    }

    Info query(int l, int r)
    {
        return query(1, 1, n, l, r);
    }

    Info query(int i, int l, int r, int ql, int qr)
    {
        if (ql <= l && r <= qr)
            return info[i];

        push(i);

        int mid = (l + r) >> 1;

        if (qr <= mid)
            return query(i << 1, l, mid, ql, qr);

        if (ql > mid)
            return query(i << 1 | 1, mid + 1, r, ql, qr);

        return query(i << 1, l, mid, ql, qr) + query(i << 1 | 1, mid + 1, r, ql, qr);
    }

    template<class F>
    int findFirst(int l, int r, F &&pred)
    {
        return findFirst(1, 1, n, l, r, pred);
    }

    template<class F>
    int findFirst(int i, int l, int r, int ql, int qr, F &pred)
    {
        if (r < ql || qr < l)
            return -1;

        if (ql <= l && r <= qr && !pred(info[i]))
            return -1;

        if (l == r)
            return l;

        push(i);

        int mid = (l + r) >> 1;

        int res = findFirst(i << 1, l, mid, ql, qr, pred);

        if (res == -1)
            res = findFirst(i << 1 | 1, mid + 1, r, ql, qr, pred);

        return res;
    }

    template<class F>
    int findLast(int l, int r, F &&pred)
    {
        return findLast(1, 1, n, l, r, pred);
    }

    template<class F>
    int findLast(int i, int l, int r, int ql, int qr, F &pred)
    {
        if (r < ql || qr < l)
            return -1;

        if (ql <= l && r <= qr && !pred(info[i]))
            return -1;

        if (l == r)
            return l;

        push(i);

        int mid = (l + r) >> 1;

        int res = findLast(i << 1 | 1, mid + 1, r, ql, qr, pred);

        if (res == -1)
            res = findLast(i << 1, l, mid, ql, qr, pred);

        return res;
    }
};

struct Tag
{
    ll add = 0;
    void apply(const Tag &v)
    {
        add = (add + v.add) % mod;
    }
};

struct Info
{
    ll sum = 0, len = 1;
    void apply(const Tag &v)
    {
        sum = (sum + v.add * len) % mod;
    }
};

Info operator+(const Info &a, const Info &b)
{
    Info c;
    c.sum = (a.sum + b.sum) % mod;
    c.len = a.len + b.len;
    return c;
}

void solve()
{
    int n, m, r;
    cin >> n >> m >> r >> mod;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    HLD hld(n);
    for (int i = 1, u, v; i <= n - 1; i++)
        cin >> u >> v, hld.addEdge(u, v);

    hld.work(r);

    vector<Info> b(n + 1);
    for (int i = 1; i <= n; i++)
        b[hld.dfn[i]].sum = a[i] % mod;

    LazySegmentTree<Info, Tag> seg(b);

    auto pathAdd = [&](int x, int y, ll z) -> void
    {
        z %= mod;

        while (hld.top[x] != hld.top[y])
        {
            if (hld.dep[hld.top[x]] < hld.dep[hld.top[y]])
                swap(x, y);

            seg.rangeApply(hld.dfn[hld.top[x]], hld.dfn[x], Tag{z});
            x = hld.fa[hld.top[x]];
        }

        if (hld.dep[x] > hld.dep[y])
            swap(x, y);

        seg.rangeApply(hld.dfn[x], hld.dfn[y], Tag{z});
    };

    auto pathQuery = [&](int x, int y) -> ll
    {
        ll res = 0;

        while (hld.top[x] != hld.top[y])
        {
            if (hld.dep[hld.top[x]] < hld.dep[hld.top[y]])
                swap(x, y);

            res = (res + seg.query(hld.dfn[hld.top[x]], hld.dfn[x]).sum) % mod;

            x = hld.fa[hld.top[x]];
        }

        if (hld.dep[x] > hld.dep[y])
            swap(x, y);

        res = (res + seg.query(hld.dfn[x], hld.dfn[y]).sum) % mod;
        return res;
    };

    while (m--)
    {
        int op;
        cin >> op;

        if (op == 1)
        {
            ll x, y, z;
            cin >> x >> y >> z;
            pathAdd(x, y, z);
        }
        else if (op == 2)
        {
            int x, y;
            cin >> x >> y;
            cout << pathQuery(x, y) << endl;
        }
        else if (op == 3)
        {
            ll x, z;
            cin >> x >> z;
            seg.rangeApply(hld.dfn[x], hld.dfn[x] + hld.siz[x] - 1, Tag{z});
        }
        else
        {
            int x;
            cin >> x;
            cout << seg.query(hld.dfn[x], hld.dfn[x] + hld.siz[x] - 1).sum << endl;
        }
    }
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

# 笛卡尔树

笛卡尔树可以理解为一种把**数组的下标顺序**和**堆的大小关系**同时编码进一棵二叉树的数据结构。常和单调栈、RMQ、树形DP、区间贡献计算、LCA、一些“以区间最小值/最大值为分界点”的分治问题等内容一起出现。

**笛卡尔树 = 中序遍历保持原数组顺序 + 节点权值满足堆性质**。

## 建树方式

> 例如数组 $[3,2,6,1,9]$，对其建立小根笛卡尔树，由于 $a_4=1$ 是最小值，所以 $4$ 一定是根。左边区间是 $3,2,6$，所以 $2$ 是 $4$ 的左儿子。以此类推，最终建树如下：
>
> ```c++
>         4(1)
>        /    \
>     2(2)    5(9)
>    /   \
> 1(3)   3(6)
> ```
> 
> 可以发现，对上面的树做中序遍历，正好是原数组的下标顺序。

笛卡尔树有一个重要的性质：对于节点 $u$，它左子树中的所有下标都小于 $u$，右子树中的所有下标都大于 $u$，这个性质使得笛卡尔树可以表示数组中的连续区间结构。

根据这个性质，我们可以递归建树。假设当前处理区间 $[l,r]$，设当前处理区间的最小值为 $p$，那么 $p$ 是当前区间的根，$[l,p-1]$ 建左子树，$[p+1,r]$ 建右子树。但这样是很慢的，最坏可能达到 $O(n^2)$。

正确的做法是，使用单调栈 $O(n)$ 地建树。对于**小根笛卡尔树**，维护一个单调递增的栈，我们从左到右处理每个位置 $i$。

> 仍然以 $[3,2,6,1,9]$ 为例，首先向栈里加入 $3$，然后加入 $2$，此时 $3$ 不可能是 $2$ 的祖先，所以弹掉 $3$，现在 $2$ 会成为 $3$ 的父亲，所以从下标角度 `ls[2] = 1`，栈变成 $2$。加入 $6$ 时，$6$ 可以成为 $2$ 的右儿子，即 `rs[2] = 3`，栈变成 $2,6$。加入 $1$ 时，弹掉 $6,2$，被弹出的节点中，最后弹出的 $2$ 会成为 $1$ 的左儿子，即 `ls[4] = 2`。加入 $9$ 后，直接成为 $1$ 的右儿子。

单调栈维护当前笛卡尔树的右链。插入新节点 $i$ 时，把右链末尾所有比 $a_i$ 大的节点弹掉，最后弹出的节点作为 $i$ 的左儿子，而弹完后剩下的栈顶把 $i$ 作为右儿子。

> [!NOTE]
>
> 作为左儿子的原因是，前面弹出的节点下标都比新来的节点 $i$ 要小，为了满足中序遍历的性质，必须在 $i$ 的左边。

## 性质

数组区间 $[l,r]$ 中的最小值位置是笛卡尔树中节点 $l,r$ 的 $LCA$。

对于笛卡尔树中的任意节点 $u$，它整棵子树对应原数组的某个连续区间 $[L_u,R_u]$。

## Code

```c++
void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    vector<int> ls(n + 1, 0), rs(n + 1, 0), stk;
    for (int i = 1; i <= n; i++)
    {
        int lst = 0;
        while (!stk.empty() && a[stk.back()] > a[i])
            lst = stk.back(), stk.pop_back();

        if (!stk.empty())
            rs[stk.back()] = i;

        if (lst)
            ls[i] = lst;

        stk.push_back(i);
    }
}
```

# 差分约束

差分约束系统，是有很多变量 $x_1,x_2,\dots,x_n$，限制条件基本是 $x_i-x_j\le c$，例如 $\begin{cases} x_2-x_1\le 3\\ x_3-x_2\le 5\\ x_3-x_1\le 10 \end{cases}$。

我们的目标通常是：判断这些条件能否同时满足 / 求一组可行解 / 求某个变量差的最大或最小值

## 原理

考虑一个最短路的性质。假设有边 $u\xrightarrow{w}v$，最短路数组 $dis$ 一定满足 $dis[v]\le dis[u]+w$，移项后 $dis[v]-dis[u]\le w$。

所以我们可以直接对应 $\boxed{x_v-x_u\le c}$ 建边 $\boxed{u\rightarrow v,\quad w=c}$，这就是差分约束的建图思想。

也可以按照最短路的松弛理解，`dis[v] = min(dis[v], dis[u] + c);` 对应 ${x_v\le x_u+c}$，建边 ${u\to v,\ c}$。

> 常见的建边方式：
>
> $x_v-x_u\le c$ 对应 $u\to v,\ c$；
>
> $x_v-x_u\ge c$ 对应 ${v\to u,\ -c}$；
>
> $x_v-x_u=c$ 对应 $\begin{cases} x_v-x_u\le c\\ x_v-x_u\ge c \end{cases}$，即 $u\to v,c$，$v\to u,-c$。
