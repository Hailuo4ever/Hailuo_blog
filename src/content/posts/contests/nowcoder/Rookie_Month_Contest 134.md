---
title: 牛客小白月赛 134
published: 2026-06-26
description: "Nowcoder Rookie Month Contest 134"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

# A - 小橙分硬币

> 关键词：模拟

## 思路

总价值 $a+2b$ 不能为奇数。如果存在 $1$ 元硬币，只要总价值为偶数，就总可以调整出一半的价值。

特判 $a=0$ 时，$b$ 一定要是偶数。

## Code

```c++
// Problem: 小橙分硬币
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137072/A
// Time: 2026-06-26 19:02:50
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    ll a, b;
    cin >> a >> b;

    if (a % 2 == 0 && (a > 0 || b % 2 == 0))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# B - 小橙玩游戏

> 关键词：博弈论

## 思路

如果当前轮到小橙且 $n \le 2$，她可以一步将 $n$ 变为非正数，因此必胜。

当 $n \ge 3$ 时，小橙无论如何操作，小橘都能选择合适的操作，要么直接结束游戏，要么丢给小橙一个必败态。

## Code

```c++
// Problem: 小橙玩游戏
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137072/B
// Time: 2026-06-26 19:08:36
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    cout << (n <= 2 ? "xiaocheng" : "xiaoju") << endl;
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

# C -小橙买水果

> 关键词：贪心，模拟

## 思路

买到某个水果后，只能沿着价格非递增的方向继续免费获得后面的水果。因此对于每个位置 $i$，如果 $a_i > a_{i-1}$，它不可能由前一个水果免费得到，必须付费购买。所以答案是所有严格上升点的价格之和。

若环上不存在严格上升的点，则所有价格相等，任意买一个水果即可获得全部水果，答案为最小价格。

## Code

```c++
// Problem: 小橙买水果
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137072/C
// Time: 2026-06-26 19:18:52
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    a[0] = a[n];

    ll res = 0;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] - a[i - 1] > 0)
            res += a[i];
    }

    if (!res)
        cout << *min_element(all(a)) << endl;
    else
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

# D - 小橙访问传送门

> 关键词：模拟，贪心

## 思路

这道题完成访问并回到原点的方式有**三种**，原点分别连接两个颜色集合一次，或从某个颜色集合出发跨到另一个颜色集合后再原路意义上返回。

![](https://img.hailuo4ever.com/nowcoder/rookie_134_img1.png)

> [!NOTE]
>
> 哎，下次一定要想到讨论啊。

## Code

```c++
// Problem: 小橙访问传送门
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137072/D
// Time: 2026-06-26 19:29:40
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
// const int inf = 0x3f3f3f3f;
const ll inf = 4e18;
const int N = 0;

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<ll> a(n), b(m);

    ll st1 = inf, st2 = inf;

    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        st1 = min(abs(a[i]), st1);
    }

    for (int i = 0; i < m; i++)
    {
        cin >> b[i];
        st2 = min(abs(b[i]), st2);
    }

    sort(all(a)), sort(all(b));

    ll st = inf;

    for (int i = 0; i < n; i++)
    {
        auto it = lower_bound(all(b), a[i]);

        if (it != b.end())
            st = min(st, abs(*it - a[i]));

        if (it != b.begin())
            --it, st = min(st, abs(*it - a[i]));

        if (st == 1)
            break;
    }

    ll res = st1 + st2 + st;
    res = min(res, 2 * (st1 + st));
    res = min(res, 2 * (st2 + st));

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

# E - 小橙分配边权

> 关键词：构造，最短路性质

## 思路

Source: [题解 | 小白月赛 Round 134 – 林月物语](https://anoth3r.top/nkm134/)

![](https://img.hailuo4ever.com/nowcoder/rookie_134_img2.png)

## Code

```c++
// Problem: 小橙分配边权
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137072/E
// Time: 2026-06-26 21:09:50
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; ++i)
        cin >> a[i];

    int s = 0;

    for (int i = 1; i <= n; ++i)
        if (!a[i])
        {
            s = i;
            break;
        }

    vector<vector<int>> g(n + 1);
    vector<pii> e(m);

    for (int i = 0; i < m; ++i)
    {
        cin >> e[i].first >> e[i].second;

        g[e[i].first].push_back(e[i].second);
        g[e[i].second].push_back(e[i].first);
    }

    vector<bool> vis(n + 1);
    auto dfs = [&](auto &&self, int u) -> void
    {
        vis[u] = 1;
        for (auto v: g[u])
            if (!vis[v] && a[v] >= a[u])
                self(self, v);
    };

    if (s)
        dfs(dfs, s);

    for (int i = 1; i <= n; ++i)
        if (!vis[i])
        {
            cout << -1 << endl;
            return;
        }

    for (auto &[u, v]: e)
        cout << abs(a[u] - a[v]) << endl;
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

