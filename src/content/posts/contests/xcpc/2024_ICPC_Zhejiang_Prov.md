---
title: 2025 icpc 浙江省赛
published: 2026-09-21
description: "The 2025 ICPC China Zhejiang Province Programming Contest (22nd)"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2025 ICPC China Zhejiang Province Programming Contest (22nd) - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/2021?v=1)

# B - Turn on the Light 3

> 关键词：模拟

## 思路

启示我们应该正确计算时间复杂度。

## Code

```c++
// Problem: B. Turn on the Light 3
// Contest: QOJ - The 3rd Universal Cup. Stage 36: Wulin
// URL: https://qoj.ac/contest/2021/problem/10724/statement/default
// Time: 2026-09-09 00:04:44
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
    int n, m;
    cin >> n >> m;

    vector<bool> st(n + 1, false);
    for (int i = 1; i <= m; i++)
    {
        int x;
        cin >> x;

        if (st[x])
        {
            cout << "the lights are already on!" << endl;
            continue;
        }
        else
        {
            int res = 0;
            for (int i = x; i <= n; i += x)
            {
                if (!st[i])
                    st[i] = true, res++;
            }
            cout << res << endl;
        }
    }
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

# F - Challenge NPC III

> 关键词：多源BFS，图论建模

## 思路

正难则反，我们考虑什么时候答案是 $NO$，我们发现，一条路径如果颜色不相异，当且仅当这条路径上存在两个不同顶点 $u\neq v$ 满足 $c_u=c_v$。因此我们真正要找的是，是否存在两个同色点 $u,v$，使得 $u$ 能在足够少的边数内到达 $v$。这里注意简单路径的定义，我们要找的是 ${\operatorname{dist}(u,v)\le k-1}$，而显然我们只关心最短路。

由于颜色最多只有 $50$ 种，我们可以固定一种颜色，然后把这种颜色的所有点一起处理，

# I - Version Number

> 关键词：模拟，字符串处理

## 思路

启示我们应该学会用 `stringstream`。

## Code

```c++
// Problem: I. Version Number
// Contest: QOJ - The 3rd Universal Cup. Stage 36: Wulin
// URL: https://qoj.ac/contest/2021/problem/10731/statement/zh_cn
// Time: 2026-09-09 00:07:44
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
    string s, t;
    cin >> s >> t;

    auto get = [&](string s)
    {
        vector<ll> a;

        stringstream ss(s);
        string x;

        while (getline(ss, x, '.'))
            a.eb(stoll(x));

        return a;
    };

    auto a = get(s), b = get(t);

    if (a > b)
        cout << 'A' << endl;
    else if (a < b)
        cout << 'B' << endl;
    else
        cout << "Equal" << endl;
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

# L - Nailoongs Always Lie

> 关键词：基环树DP

## 思路

注意到题目有 $n$ 个点和 $n$ 条边，而树有 $n-1$ 条边，所以它其实是一个基环树。这引导我们把树和环分开来看。

每个点的出度为 $1$，所以每一个连通块最后会变成中间有一个环，环上的每个节点下面可能挂若干棵树的形式。我们的策略是先找环上点，把环切开，然后把环和树分开看。

如果我们想从一个环上点往下面 DFS 它挂着的树，就需要反过来建边，也就是 $a_i\to i$。所以我们反着建有向边，然后按照原图来做拓扑排序剥掉叶子，找出环上的点。

对于树上我们正常 $DP$，设 $dp[u][0]$ 表示 $u$ 不选时，以 $u$ 为根的这棵树最多选多少个奶龙，$dp[u][1]$ 表示选 $u$。

转移为 $dp[u][0]=\sum_v\max(dp[v][0],dp[v][1])$，$dp[u][1]=1+\sum_vdp[v][0]$。并且先做树上 $DP$ 的好处是，它可以把整棵树的信息压到根节点，然后找出每一个环，在环上线性 $DP$ 即可。在实现时，需要分两次 $DP$，分别处理选起始点和不选起始点的情况。另外要特殊处理自环，如果 $a_u=u$，说明他自己肯定不是奶龙，所以不能选。

## Code

```c++
// Problem: L. Nailoongs Always Lie
// Contest: QOJ - The 3rd Universal Cup. Stage 36: Wulin
// URL: https://qoj.ac/contest/2021/problem/10734/statement/zh_cn
// Time: 2026-09-09 00:11:26
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

    vector<vector<int>> g(n + 1);
    vector<int> a(n + 1), din(n + 1);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        g[a[i]].eb(i), din[a[i]]++;
    }

    queue<int> q;
    for (int i = 1; i <= n; i++)
        if (din[i] == 0)
            q.push(i);

    while (!q.empty())
    {
        int u = q.front();
        q.pop();

        int v = a[u];
        if (--din[v] == 0)
            q.push(v);
    }

    vector<bool> cyc(n + 1);
    for (int i = 1; i <= n; i++)
        if (din[i] > 0)
            cyc[i] = true;

    vector<array<ll, 2>> dp(n + 1);
    auto dfs = [&](auto &&self, int u) -> void
    {
        dp[u][0] = 0, dp[u][1] = 1;
        for (auto v: g[u])
        {
            if (cyc[v])
                continue;

            self(self, v);
            dp[u][0] += max(dp[v][0], dp[v][1]);
            dp[u][1] += dp[v][0];
        }
    };

    for (int i = 1; i <= n; i++)
        if (cyc[i])
            dfs(dfs, i);

    vector<bool> vis(n + 1, false);
    ll res = 0;

    for (int i = 1; i <= n; i++)
    {
        if (!cyc[i] || vis[i])
            continue;

        vector<int> cir;

        int u = i;
        while (!vis[u])
            vis[u] = true, cir.eb(u), u = a[u];

        int m = cir.size();
        if (m == 1)
        {
            res += dp[cir[0]][0];
            continue;
        }

        ll f0 = dp[cir[0]][0], f1 = -INF;
        for (int j = 1; j < m; j++)
        {
            ll nf0 = max(f0, f1) + dp[cir[j]][0], nf1 = f0 + dp[cir[j]][1];
            f0 = nf0, f1 = nf1;
        }

        ll t = max(f0, f1);
        f0 = -INF, f1 = dp[cir[0]][1];
        for (int j = 1; j < m; j++)
        {
            ll nf0 = max(f0, f1) + dp[cir[j]][0], nf1 = f0 + dp[cir[j]][1];
            f0 = nf0, f1 = nf1;
        }

        res += max(f0, t);
    }

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

