---
title: 牛客周赛 Round 143
published: 2026-05-10
description: "Nowcoder Week Contest 143"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 143](https://ac.nowcoder.com/acm/contest/134529)

# A - 小红的区间构造

> 关键词：签到

## Code

```c++
// Problem: 小红的区间构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/A
// Time: 2026-05-10 19:00:07

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
    ll n;
    cin >> n;
    cout << 1 << " " << n << endl;
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

# B - 小红的冷门副本

> 关键词：思维

## 思路

由于 $m$ 的范围太大，如果开数组一定会超空间，假如开 `map` 正着遍历又会超时间。

我们考虑反着做，统计 $>x$ 的所有副本，用总数减掉即可。

## Code

```c++
// Problem: 小红的冷门副本
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/B
// Time: 2026-05-10 19:01:08
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
    ll n, m, x;
    cin >> n >> m >> x;

    map<ll, int> mp;

    for (int i = 1; i <= n; i++)
    {
        int k;
        cin >> k;
        mp[k]++;
    }

    ll cnt = 0;
    for (auto &[k, v]: mp)
        if (v > x)
            cnt++;

    cout << m - cnt << endl;
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

# C - 小红的因子幂和

> 关键词：数学

## 思路

考虑如何获取所有正因子，实际上直接暴力枚举所有因子，并插入 `set` 里就可以，`set` 同时自动去重并排序。

后面乘的过程同理，但注意快速幂开始一定要将底数 `a` 对 `mod` 取模，否则会溢出。

## Code

```c++
// Problem: 小红的因子幂和
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/C
// Time: 2026-05-10 19:15:54

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
const ll mod = 1e9 + 7;

map<ll, int> mp;

ll qmi(ll a, ll k)
{
    ll res = 1;
    a %= mod;
    while (k)
    {
        if (k & 1)
            res = (res * a) % mod;

        a = (a * a) % mod;
        k >>= 1;
    }
    return res % mod;
}

void solve()
{
    ll x, y;
    cin >> x >> y;

    set<ll> s1, s2;

    for (ll i = 1; i <= x / i; i++)
    {
        if (x % i != 0)
            continue;

        s1.insert(i);
        s1.insert(x / i);
    }

    // cout << s1.size() << endl;

    for (ll i = 1; i <= y / i; i++)
    {
        if (y % i != 0)
            continue;

        s2.insert(i);
        s2.insert(y / i);
    }

    set<ll> f;
    for (auto t1: s1)
        for (auto t2: s2)
            f.insert(t1 * t2);

    ll res = 0;
    for (auto i: f)
        res = (res + qmi(i, i)) % mod;

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

# D - 小红的最佳区间

> 关键词：思维，差分

## 思路

我们需要做一步转化，需要将“给定区间与滑动区间相交”这个条件，转化成计算 `L` 的合法取值范围。

假设我们选择的区间是 $[L, L+k]$，给定的第 $i$ 个区间是 $[l_i, r_i]$。 两个闭区间相交的充要条件是：它们的最大左端点，必须小于等于最小右端点，即 $\max(l_i, L) \le \min(r_i, L+k)$。

把这个不等式拆开，有$L \le r_i$ ，$l_i \le L+k \implies L \ge l_i - k$。

综上，**`L`满足的范围是 $l_i - k \le L \le r_i$。**

现在问题转化为了：已知 $n$ 个新的区间 $[l_i - k, r_i]$，求坐标轴上的哪一个点（即 $L$ 的取值）被覆盖的次数最多。

使用 `map` 对原数组离散化，并作差分即可。

## Code

```c++
// Problem: 小红的最佳区间
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/D
// Time: 2026-05-10 19:59:49
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
    int n, k;
    cin >> n >> k;

    map<ll, int> mp;

    for (int i = 1; i <= n; i++)
    {
        ll l, r;
        cin >> l >> r;

        mp[l - k]++;
        mp[r + 1]--;
    }

    ll res = -1, tmp = 0;

    for (auto &[k, val]: mp)
    {
        tmp += val;
        if (tmp > res)
            res = tmp;
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

# E - 小红的好矩阵

> 关键词：分类讨论，构造

## 思路

要让一个 $2 \times n$ 的 01 矩阵合法（即所有 0 连通块和 1 连通块的大小都恰好为 3），我们可以从图形拼接的角度来推导其所有合法的形态。
