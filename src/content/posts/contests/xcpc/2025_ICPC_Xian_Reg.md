---
title: 2025 icpc 西安区域赛
published: 2026-09-05
description: "The 2025 ICPC Asia Xi'an Regional Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 区域赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2025 ICPC Asia Xi'an Regional Contest - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/2562?v=1)

# F - Follow the Penguins

> 关键词：基环树DP

## 思路

首先发现，一只企鹅的运动方向一定不会变，我们定义 $dir_i=\begin{cases}1,&a_{t_i}>a_i\\-1,&a_{t_i}<a_i\end{cases}$。即 $1$ 向右，$-1$ 向左。

然后考虑，对于当前的某只企鹅 $i$，如果知道他的目标企鹅 $j$ 什么时候停，我们可以计算当前企鹅 $i$ 什么时候停。设初始距离 $D=|a_i-a_j|$，讨论企鹅的运动方向。

两只企鹅同向运动时，他们之间的距离一直都是 $D$，直到 $j$ 停下来。答案为 ${ans_i=ans_j+2D}$。

两只企鹅相向运动时，他们每秒靠近的距离是 $1$。考虑两种情况：一种是 $j$ 没有提前停止，即 $ans_j\ge D$，两只企鹅会在重点相遇，答案是 ${ans_i=D}$；一种是 $j$ 提前停下来了，答案是 $ans_i=ans_j+2(D-ans_j)$。

可以总结成如下递推式：$\boxed{ans_i=\begin{cases}ans_j+2D,&dir_i=dir_j\\[4pt]D,&dir_i\ne dir_j,\ ans_j\ge D\\[4pt]2D-ans_j,&dir_i\ne dir_j,\ ans_j<D\end{cases}}$。

考虑如何找到最开始的那个企鹅，然后才能根据那个企鹅的答案往下递推。每个点的出度均为 $1$，因此每个连通块都是一个基环树。树上直接就有递推关系，**所以我们需要在环上找到一个可以直接确定答案的企鹅作为递推起点**。然后我们可以发现，这只企鹅一定是和它的目标相向运动的，因为如果同向的话就停不下来了。进一步地，**我们选择所有相向边中，初始距离最小的企鹅**，而它一定是最先停下的。

> 由于对于 $i \to j$，递推关系是先知道 $j$ 后知道 $i$，可以反着建图。拓扑排序找环的时候要用原图，这里只需要把入度信息按照原图来记录即可。

## Code

```c++
// Problem: F. Follow the Penguins
// Contest: QOJ - GP of Xi'an
// URL: https://qoj.ac/contest/2562/problem/14686/statement/zh_cn
// Time: 2026-09-14 22:42:30
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<ll> t(n + 1), dir(n + 1), a(n + 1), ind(n + 1), dis(n + 1), res(n + 1, -1);
    vector<vector<int>> g(n + 1);

    for (int i = 1; i <= n; i++)
    {
        cin >> t[i];
        g[t[i]].eb(i);
        ind[t[i]]++;
    }

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        dir[i] = (a[t[i]] > a[i] ? 1 : -1), dis[i] = abs(a[i] - a[t[i]]);

    queue<int> q;
    for (int i = 1; i <= n; i++)
        if (ind[i] == 0)
            q.push(i);

    // u -> t[u]
    while (!q.empty())
    {
        auto u = q.front();
        q.pop();

        if (--ind[t[u]] == 0)
            q.push(t[u]);
    }

    vector<bool> vis(n + 1, false);
    for (int i = 1; i <= n; i++)
    {
        if (ind[i] == 0 || vis[i])
            continue;

        ll mn = INF;
        int u = i, idx = u;

        do
        {
            vis[u] = true;
            if (dir[u] != dir[t[u]] && dis[u] < mn)
                mn = dis[u], idx = u;
            u = t[u];
        } while (u != i);

        res[idx] = dis[idx];

        queue<int> qu;
        qu.push(idx);

        while (!qu.empty())
        {
            auto u = qu.front();
            qu.pop();

            for (auto v: g[u])
            {
                if (res[v] != -1)
                    continue;

                if (dir[u] == dir[v])
                    res[v] = res[u] + 2 * dis[v];
                else
                    res[v] = (res[u] >= dis[v] ? dis[v] : 2 * dis[v] - res[u]);

                qu.push(v);
            }
        }
    }

    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

# G - Grand Voting

> 关键词：签到

## Code

```c++
// Problem: G. Grand Voting
// Contest: QOJ - GP of Xi'an
// URL: https://qoj.ac/contest/2562/problem/14687/statement/zh_cn
// Time: 2026-09-14 23:38:58
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a.begin() + 1, a.end());

    ll cur = 0;
    for (int i = 1; i <= n; i++)
        cur >= a[i] ? cur++ : cur--;

    cout << cur << ' ';

    cur = 0, reverse(a.begin() + 1, a.end());

    for (int i = 1; i <= n; i++)
        cur >= a[i] ? cur++ : cur--;

    cout << cur << endl;
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

# I - Imagined Holly

> 关键词：构造、找性质

## 思路

题目给出的 $A_{u,v}$ 是树上 $u\to v$ 简单路径中所有节点编号的异或和。

不妨设节点 $1$ 为根，可以推出一个本题最关键的结论：${A_{1,i}\oplus A_{1,j}\oplus A_{i,j}=\operatorname{LCA}(i,j)}$。

> ```c++
>             1
>             |
>             |
>             x = LCA(i,j)
>            / \
>           /   \
>          i     j
> ```
>
> 从 $1$ 到 $x$ 的所有节点在两条路径中都出现了两次，因此全部异或抵消，但会发现 $x$ 被异或了两次。观察一下可知，$x$ 是 $i$ 和 $j$ 的 $LCA$。

所以现在我们有了所有节点的 $LCA(i,j)$，我们需要构造出原树。

应用一个 $LCA$ 的性质：$\operatorname{LCA}(i,j)=i$ 当且仅当 $i$ 是 $j$ 的祖先。我们可以根据这个性质来建边，建出来的实际上是整棵树上祖先关系的传递闭包。然后我们直接拓扑排序，就可以建出整张图。

## Code

```c++
// Problem: I. Imagined Holly
// Contest: QOJ - GP of Xi'an
// URL: https://qoj.ac/contest/2562/problem/14689/statement/zh_cn
// Time: 2026-09-15 00:48:34
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<vector<int>> mat(n + 1, vector<int>(n + 1)), adj(n + 1);
    vector<int> ind(n + 1);

    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j++)
            cin >> mat[i][j];

    for (int i = 1; i <= n; i++)
        for (int j = i + 1; j <= n; j++)
        {
            int lca = mat[1][i] ^ mat[1][j] ^ mat[i][j];
            if (lca == i)
                adj[i].eb(j), ind[j]++;
            else if (lca == j)
                adj[j].eb(i), ind[i]++;
        }

    queue<int> q;
    q.push(1);

    while (!q.empty())
    {
        auto u = q.front();
        q.pop();

        for (auto v: adj[u])
            if (--ind[v] == 0)
                q.push(v), cout << u << ' ' << v << endl;
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



# L - Let's Make a Convex!

> 关键词：双指针

## 思路

首先有一个结论：能把选出的木棍拼成凸多边形，当且仅当最长的木棍小于其余木棍长度的总和。

> 这是三角形两边之和大于第三边的推广，又称作多边形不等式。

我们设选出来的最长木棍长度是 $mx$，选出来的所有木棍总长是 $sum$，其余木棍的长度和就是 $sum-mx$。凸多边形成立的条件是 $mx<sum-mx$，移项得到 ${2mx<sum}$。所以问题转化成，如何找到一批数，让他们的最大值满足 $2mx<sum$。

我们从边数更大的答案做起，也就是一开始就尝试选 $n$ 个。设 $k$ 表示当前需要几根木棍，我们发现答案是有单调性的，也就是在合法窗口中，右端点越大，周长越大，所以只需要找到最大的合法右端点。如果右端点 $r$ 能组成 $k$ 边形，那么只要左边还有木棍，它也能组成 $k+1$ 边形。

## Code

```c++
// Problem: L. Let's Make a Convex!
// Contest: QOJ - GP of Xi'an
// URL: https://qoj.ac/contest/2562/problem/14692/statement/zh_cn
// Time: 2026-09-14 23:47:42
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n + 1), pre(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a.begin() + 1, a.end());

    for (int i = 1; i <= n; i++)
        pre[i] = pre[i - 1] + a[i];

    vector<ll> res(n + 1);
    int r = n;

    for (int len = n; len >= 3; len--)
    {
        while (r >= len)
        {
            ll sum = pre[r] - pre[r - len];
            if (sum > 2 * a[r])
                break;
            r--;
        }

        if (r >= len)
            res[len] = pre[r] - pre[r - len];
    }

    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

