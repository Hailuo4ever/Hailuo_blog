---
title: 2026 杭电多校8
published: 2026-08-13
description: "HDU Multi-University Training Contest 8"
image: https://img.hailuo4ever.com/cover/hdu.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营8](https://acm.hdu.edu.cn/contest/problems?cid=1236)

# 1001 - 让路径生存吧！

> 关键词：二分答案

## 思路

注意到：随着删去点数的增多，答案越来越不可行。因此答案具有单调性，考虑二分答案。

我们给操作的 $p_i$ 分配一个编号，对于每一个可能的边界，重新建图，$dfs$ 或 $bfs$ 即可。注意图上可能有环，因此需要使用 $vis$ 记录到达情况，别走重了。

## Code

```c++
// Problem: 让路径生存吧！
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1236&pid=1001
// Time: 2026-08-13 18:05:14
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
const ll mod = 1;

void solve()
{
    int n, m, q;
    cin >> n >> m >> q;

    vector<vector<int>> g(n + 1);
    for (int i = 1; i <= m; i++)
    {
        int u, v;
        cin >> u >> v;
        g[u].eb(v);
    }

    vector<int> id(n + 1);
    for (int i = 1; i <= q; i++)
    {
        int x;
        cin >> x;
        id[x] = i;
    }

    auto check = [&](int x) -> bool
    {
        if (x > q)
            return false;

        vector<vector<int>> f(n + 1);
        for (int u = 1; u <= n; u++)
        {
            if (id[u] != 0 && id[u] <= x)
                continue;

            for (auto v: g[u])
                f[u].eb(v);
        }

        bool flag = false;
        vector<bool> vis(n + 1, false);
        vis[1] = true;

        auto dfs = [&](auto &&self, int u) -> void
        {
            if (u == n)
            {
                flag = true;
                return;
            }
            for (auto v: f[u])
            {
                if (!vis[v])
                    vis[v] = true, self(self, v);
            }
        };

        dfs(dfs, 1);
        return flag;
    };

    int l = -1, r = q + 1;
    while (l + 1 < r)
    {
        int mid = (l + r) >> 1;
        if (check(mid))
            l = mid;
        else
            r = mid;
    }

    if (l == -1)
        cout << "NO" << endl;
    else if (l == q)
        cout << "YES" << endl;
    else
        cout << l << endl;
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

# 1007 - 用传送门来让网格连通吧

> 关键词：缩点，图论建模

## 思路

注意到传送门的数量很少，而整张图又很大，这提示我们不要对每个询问 $bfs$，而是先缩点。

首先注意到，每个 $.$ 连通块内部的行走方式不重要，可以直接把整个连通块看作一个点。在这之后，传送门等价于一条从连通块 $A$ 到 $B$ 的有向边。因此问题变成，给定若干个连通块，最多有 $k \le 100$ 条有向边，询问两个连通块之间是否可达。

但这里容易想到对所有连通块跑 $Floyd$，但由于连通块数量最坏是 $O(nm)=5\times10^4$ 的，显然不可行。

我们实际上应该再对含有传送门的连通块做一次缩点，定义特殊联通块为至少包含一个传送门入口或出口的连通块。显然 $S\le2k\le200$。对这个有向图做 $Floyd$ 传递闭包即可。

## Code

> [!NOTE]
>
> 注：本题卡常，此做法在不使用快读的前提下无法通过。

```c++
// Problem: 用传送门来让网格连通吧
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1236&pid=1007
// Time: 2026-08-15 12:32:32
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
const ll mod = 1;

namespace FastIO
{
    const int S = 1 << 20;

    char buf[S];
    int idx = 0, len = 0;

    inline char gc()
    {
        if (idx >= len)
        {
            len = fread(buf, 1, S, stdin);
            idx = 0;

            if (len == 0)
                return EOF;
        }

        return buf[idx++];
    }

    inline int read()
    {
        int x = 0;
        char c = gc();

        while (c < '0' || c > '9')
            c = gc();

        while (c >= '0' && c <= '9')
        {
            x = x * 10 + c - '0';
            c = gc();
        }

        return x;
    }

    inline string readString()
    {
        string s;
        char c = gc();

        while (c <= ' ')
            c = gc();

        while (c > ' ')
        {
            s += c;
            c = gc();
        }

        return s;
    }
} // namespace FastIO

using FastIO::read;
using FastIO::readString;

struct DSU
{
    vector<int> fa;
    vector<int> sz;

    DSU() {}

    DSU(int n)
    {
        init(n);
    }

    void init(int n)
    {
        fa.resize(n + 1);
        sz.assign(n + 1, 1);

        iota(fa.begin(), fa.end(), 0);
    }

    int find(int x)
    {
        if (fa[x] == x)
            return x;

        return fa[x] = find(fa[x]);
    }

    bool merge(int x, int y)
    {
        x = find(x);
        y = find(y);

        if (x == y)
            return false;

        if (sz[x] < sz[y])
            swap(x, y);

        fa[y] = x;
        sz[x] += sz[y];

        return true;
    }

    bool connected(int x, int y)
    {
        return find(x) == find(y);
    }

    int sze(int x)
    {
        return sz[find(x)];
    }
};

void solve()
{
    int n = read(), m = read(), k = read(), q = read();

    vector<string> g(n);
    for (auto &s: g)
        s = readString();

    auto id = [&](int x, int y) -> int { return x * m + y; };

    DSU dsu(n * m);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
        {
            if (g[i][j] == '#')
                continue;

            if (i + 1 < n && g[i + 1][j] == '.')
                dsu.merge(id(i, j), id(i + 1, j));

            if (j + 1 < m && g[i][j + 1] == '.')
                dsu.merge(id(i, j), id(i, j + 1));
        }

    bool f[205][205] = {};
    vector<int> idx(n * m, -1);
    int timer = 0;

    for (int i = 0; i < k; i++)
    {
        int x1 = read(), y1 = read(), x2 = read(), y2 = read();

        x1--, y1--, x2--, y2--;

        int u = dsu.find(id(x1, y1)), v = dsu.find(id(x2, y2));
        if (idx[u] == -1)
            idx[u] = timer++;

        if (idx[v] == -1)
            idx[v] = timer++;

        f[idx[u]][idx[v]] = true;
    }

    for (int i = 1; i < timer; i++)
        f[i][i] = true;

    for (int k = 0; k < timer; k++)
        for (int i = 0; i < timer; i++)
            for (int j = 0; j < timer; j++)
                f[i][j] |= f[i][k] && f[k][j];

    while (q--)
    {
        int x1 = read(), y1 = read(), x2 = read(), y2 = read();

        x1--, y1--, x2--, y2--;

        int u = dsu.find(id(x1, y1)), v = dsu.find(id(x2, y2));
        if (u == v)
            cout << 1 << endl;
        else if (idx[u] == -1 || idx[v] == -1)
            cout << 0 << endl;
        else
            cout << f[idx[u]][idx[v]] << endl;
    }
}

int main()
{
    fastio();

    int T = read();

    while (T--)
        solve();

    return 0;
}

```



# 1009 - 价值总是越大越好

> 关键词：贪心，组合计数

## 思路

价值为 $V=\lvert P_1-P_2\rvert+\lvert P_3-P_4\rvert+\cdots+\lvert P_{2N-1}-P_{2N}\rvert$，对于任意一组 $(x,y)$，都有 $|x-y|=\max(x,y)-\min(x,y)$。

我们将每一组中的两个位置看作一个放较大的数，一个放较小的数。总价值就是 $V=\sum \text{大数}-\sum \text{小数}$。

考虑将每一组 $(P_{2i-1},P_{2i})$ 按照一组中 $0$ 的数量分类。如果没有 $0$，说明两个都已经确定，对答案没有影响。

如果一个确定，一个是 $0$，假设最后填进去的是 $x$，有两种可能：$x>4$，此时 $x$ 是大数，贡献 $x-4$；$x<4$ 时，$x$ 是小数，贡献 $4-x$。我们把所有这组数中已经存在的数字收集起来。设他们排序后为 $a_1<a_2<\cdots<a_s$，即假设一共有 $s$ 个。

如果两个都是 $0$，最终一定有一个数字作为大数，一个数字作为小数。设这样的组有 $d$ 个，最终会出现一个因子是 $2^d$。

考虑统计所有缺失的数字。设所有没出现过的数字排序后为 $b_1<b_2<\cdots<b_m$。每个双 $0$ 组贡献两个，每个单 $0$ 组贡献 $1$ 个，所以 $m=2d+s$。

现在来到了这道题关键的地方。我们设有 $t$ 个单零组中，填入的数字作为大端，自然有 $s-t$ 个单零组中，填入的数字作为小端。每个双零组都有一个大端空位，所以有 $d$ 个，另外 $t$ 个单零组的空位是大端。所以一共有 $A=d+t$ 个空的大端位置。再考虑空着的小端位置，双零组依然贡献 $d$ 个，剩下 $s-t$ 个单零组的空位也是小端，所以 $B=d+s-t$。

固定了 $t$ 后，显然应该让最大的 $A$ 个缺失数字全部放大的，最小的 $B$ 个数字全部放小的。但要考虑有可能把 $0$ 作为大端的情况。如果 $0$ 是大端，原来的 $a_i$ 是小端，对整体的贡献为 $-a_i$。如果 $0$ 是小端，原来的 $a_i$ 的贡献就是 $+a_i$。所以固定有 $t$ 个需要取负号时，肯定是让最小的 $t$ 个数取负号。

枚举 $t=0,1,\dots,s$，计算这个 $t$ 下能够得到的最大价值，取价值最大的方案数。时间复杂度 $O(N)$。

## Code

```c++
// Problem: 价值总是越大越好
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1236&pid=1009
// Time: 2026-08-14 00:26:21
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
const int N = 4e5 + 5;
const ll INF = 4e18;
const ll mod = 998244353;

ll fac[N], pw[N];

void init()
{
    fac[0] = 1, pw[0] = 1;

    for (int i = 1; i < N; i++)
    {
        fac[i] = (fac[i - 1] * i) % mod;
        pw[i] = (pw[i - 1] * 2) % mod;
    }
}

void solve()
{
    int n;
    cin >> n;

    vector<int> p(2 * n + 1);
    vector<bool> vis(2 * n + 1);

    for (int i = 1; i <= 2 * n; i++)
    {
        cin >> p[i];
        if (p[i])
            vis[p[i]] = true;
    }

    int d = 0;
    vector<int> a;

    for (int i = 1; i <= 2 * n; i += 2)
    {
        int x = p[i], y = p[i + 1];
        if (x == 0 && y == 0)
            d++;
        else if (x == 0 || y == 0)
            a.eb(x ? x : y);
    }

    vector<int> b;
    for (int x = 1; x <= 2 * n; x++)
        if (!vis[x])
            b.eb(x);

    sort(all(a)), sort(all(b));
    int s = a.size(), m = b.size();

    vector<ll> prea(s + 1), preb(m + 1);
    for (int i = 1; i <= s; i++)
        prea[i] = prea[i - 1] + a[i - 1];
    for (int i = 1; i <= m; i++)
        preb[i] = preb[i - 1] + b[i - 1];

    ll mx = -INF, res = 0;
    for (int t = 0; t <= s; t++)
    {
        int u = d + t, v = d + s - t;
        ll va = prea[s] - 2 * prea[t], vb = preb[m] - 2 * preb[v], val = va + vb;

        ll cnt = pw[d] * fac[u] % mod * fac[v] % mod;
        if (val > mx)
            mx = val, res = cnt;
        else if (val == mx)
            res = (res + cnt) % mod;
    }
    cout << res % mod << endl;
}

int main()
{
    fastio();
    init();
    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```



# 1012 - 数一数环的个数

> 关键词：二分图

## 思路

首先要知道，二分图有一个很强的性质：不存在奇数长度的环。又因为 $k$ 是质数，因此只有 $2$ 符合答案，其余答案都为 $0$。

考虑 $k=2$ 时如何算答案，如果两个点 $u, v$ 直接有 $m$ 条重边，必须要从这些重边中恰好选择两条，答案 $C_m^2$。

统计所有的重边即可。

## Code

```c++
// Problem: 数一数环的个数
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1236&pid=1012
// Time: 2026-08-13 19:32:22
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
const ll mod = 998244353;

void solve()
{
    int n, m, k;
    cin >> n >> m >> k;

    map<int, map<int, int>> mp;

    ll res = 0;
    for (int i = 1; i <= m; i++)
    {
        int u, v;
        cin >> u >> v;

        if (u < v)
            swap(u, v);

        res += mp[u][v], mp[u][v]++;
    }

    cout << (k == 2 ? res % mod : 0) << endl;
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

