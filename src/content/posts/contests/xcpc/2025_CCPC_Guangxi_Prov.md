---
title: 2025 广西省赛
published: 2026-11-17
description: "2025 Guangxi Collegiate Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 8th Guangxi Collegiate Programming Contest (GXCPC 2025) - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/4120)

# A - Additive Combinatorics

> 关键词：模拟，暴力

## 思路

两个集合的大小数量级都比较小，直接暴力即可。

## Code

```c++
// Problem: QOJ 19089
// Contest: QOJ - GXCPC 2025
// URL: https://qoj.ac/contest/4120/problem/19089
// Time: 2026-11-17 11:50:55
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n1, n2, n3;
    cin >> n1 >> n2 >> n3;

    vector<ll> a(n1), b(n2);
    set<ll> c, d;
    for (int i = 0; i < n1; i++)
        cin >> a[i];
    for (int i = 0; i < n2; i++)
        cin >> b[i];
    for (int i = 0, x; i < n3; i++)
        cin >> x, c.insert(x);

    for (int i = 0; i < n1; i++)
        for (int j = 0; j < n2; j++)
            d.insert(a[i] + b[j]);

    cout << (c == d ? "YES" : "NO") << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# B - Metronome for Corgi

> 关键词：前缀和，暴力枚举

## 思路

首先容易想到前缀和，处理出前缀和后观察题目。节拍器会在每 $L$ 毫秒打一次拍，在打拍时必须恰好位于音符的边界处，换句话说不能落在任何音符内部。我们需要找到满足要求的最小 $L$。

既然第一次打拍的位置 $L$ 必须在某个音符的边界上，我们考虑直接枚举所有前缀和作为候选答案，然后向后暴力查询是否符合条件即可。

## Code

```c++
// Problem: QOJ 19090
// Contest: QOJ - GXCPC 2025
// URL: https://qoj.ac/contest/4120/problem/19090
// Time: 2026-11-17 13:34:56
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n;
    cin >> n;

    set<ll> s;
    vector<ll> a(n + 1), pre(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i], pre[i] = pre[i - 1] + a[i], s.insert(pre[i]);

    for (int i = 1; i <= n; i++)
    {
        bool fl = true;
        for (ll j = 1; pre[i] * j <= pre[n]; j++)
        {
            if (!s.contains(pre[i] * j))
            {
                fl = false;
                break;
            }
        }

        if (fl)
        {
            cout << pre[i] << endl;
            return;
        }
    }
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```



# D - DeepSeek, DeepThink!

> 关键词：签到，模拟

## 思路

使用 `substr()`，截取给定字符串 `How to ` 之后的部分，然后拼接在要求输出的字符串后即可。

## Code

```c++
// Problem: QOJ 19092
// Contest: QOJ - GXCPC 2025
// URL: https://qoj.ac/contest/4120/problem/19092
// Time: 2026-11-17 11:46:28
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    string s;
    getline(cin, s);

    cout << "Okay, so I want to figure out how to " << s.substr(7, s.size() - 8) << ".\n";
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# H - Hollow Knight: Silksong

> 关键词：签到，模拟

## 思路

日期问题，由于时间左右端点比较短，直接暴力运算即可，注意时间跨度中间有两个闰年。

## Code

```c++
// Problem: QOJ 19096
// Contest: QOJ - GXCPC 2025
// URL: https://qoj.ac/contest/4120/problem/19096
// Time: 2026-11-17 11:58:03
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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
    return uniform_int_distribution<int>(l, r)(rnd);
}

int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

void solve()
{
    int a, b, c;
    cin >> a >> b >> c;

    int ta = 2025, tb = 9, tc = 18, cnt = 0;
    while (true)
    {
        if (a == 2020 || a == 2024)
            days[2] = 29;
        else
            days[2] = 28;

        if (a == ta and b == tb and c == tc)
        {
            cout << cnt << endl;
            break;
        }

        // cerr << a << ' ' << b << ' ' << c << endl;

        c++, cnt++;
        if (c > days[b])
            b++, c = 1;

        if (b > 12)
            b = 1, a++;
    }
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# K - Kingdom Rush 5: Alliance

> 关键词：计算几何

## 思路



# L - Lost in MST

> 关键词：图论建模，Kruskal

## 思路

我们不可能枚举一张完全图所有的边，考虑如何减少边的枚举。

观察到 $w(x,y)=\gcd(x,y)+\frac{xy}{\gcd(x,y)}$，边权和 $gcd$ 相关，考虑对于一个 $d$，将所有能被 $d$ 整除的点权放在一组，直觉上，每个分组内只需要建边 $(b_1,b_2),(b_1,b_3),\ldots,(b_1,b_k)$，也就是所有顶点都连接到点权最小的顶点，成为一棵星形树。

一种感性的理解方式是，由于 $(x,y)$ 的因数全部相同，我们当然希望边权尽可能小，也就是 $x \times y$ 尽可能小，因此只关注最小的那个点即可，别的点都没用。实际上这是一种贪心。

直接处理出每个点权的所有因数，然后按照因数分组点并加边，最后跑一遍 `Kruskal` 即可。

## Code

```c++
// Problem: QOJ zh_cn
// Contest: QOJ - GXCPC 2025
// URL: https://qoj.ac/contest/4120/problem/19100/statement/zh_cn
// Time: 2026-11-17 12:11:25
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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
const int N = 1e6 + 10;
const ll INF = 4e18;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

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

vector<int> primes, minp;

void get_primes(int n)
{
    primes.clear();
    minp.assign(n + 1, 0);

    for (int i = 2; i <= n; i++)
    {
        if (!minp[i])
            primes.eb(i), minp[i] = i;

        for (auto p: primes)
        {
            if (p > n / i)
                break;

            minp[p * i] = p;

            if (i % p == 0)
                break;
        }
    }
}

struct Edge
{
    int u, v;
    ll w;
    bool operator<(const auto &other) const
    {
        return w < other.w;
    }
};

vector<ll> get_divisors(ll x)
{
    vector<pll> factor;

    while (x > 1)
    {
        int p = minp[x], cnt = 0;

        while (x % p == 0)
            x /= p, cnt++;

        factor.eb(p, cnt);
    }

    vector<ll> res;
    res.push_back(1);

    for (auto [c, d]: factor)
    {
        int sz = res.size();
        ll temp = 1;

        for (int k = 1; k <= d; k++)
        {
            temp *= c;
            for (int j = 0; j < sz; j++)
                res.push_back(res[j] * temp);
        }
    }

    return res;
}

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    map<int, vector<pll>> mp;

    for (int i = 1, x; i <= n; i++)
    {
        cin >> x;
        auto fac = get_divisors(x);
        for (const auto &p: fac)
            mp[p].eb(x, i);
    }

    vector<Edge> edges;
    for (auto &[fac, vec]: mp)
    {
        sort(all(vec));

        const auto &[w1, u] = vec[0];
        for (int i = 1; i < vec.size(); i++)
        {
            const auto &[w2, v] = vec[i];
            edges.eb(u, v, lcm(w1, w2) + gcd(w1, w2));
        }
    }

    sort(all(edges));
    DSU dsu(n);

    ll res = 0;
    for (const auto &[u, v, w]: edges)
    {
        if (dsu.merge(u, v))
            res += w;
    }
    cout << res << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    get_primes(N);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```