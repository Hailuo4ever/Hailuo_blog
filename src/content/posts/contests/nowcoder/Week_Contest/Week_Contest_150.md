---
title: 牛客周赛 Round 150
published: 2026-06-28
description: "Nowcoder Week Contest 150"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 150](https://ac.nowcoder.com/acm/contest/137073)

# A - 小红的整数操作

> 关键词：签到

## Code

```c++
// Problem: 小红的整数操作
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137073/A
// Time: 2026-06-28 19:00:07
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
    ll x, y, d;
    cin >> x >> y >> d;

    if (x + d == y || x - d == y)
        puts("Yes");
    else
        puts("No");
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

# B -小红砍小苯

> 关键词：模拟

## 思路

游戏能进行到的最后一回合是第 $a[n-2]$ 回合，此时唯一幸存者（最大值）还剩下 $a[n-1]-a[n-2]$ 滴血。

## Code

```c++
// Problem: 小红砍小苯
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137073/B
// Time: 2026-06-28 19:00:55
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

    if (n == 1)
    {
        cout << 0 << endl;
        return;
    }

    vector<ll> a(n);
    for (auto &x: a)
        cin >> x;

    sort(all(a));

    ll sum = accumulate(all(a), 0LL);
    cout << sum - (a[n - 1] - a[n - 2]) << endl;
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

# C - 异或或配对计数

> 关键词：位运算，分类讨论

## 思路

单独考虑数上的某一位，分类讨论如下：

| $p_i$ | $q_i$ | $p_i \operatorname{xor} q_i$ | $p_i \operatorname{or} q_i$ | 对应 $(x_i,y_i)$ |
| ----- | ----- | ---------------------------- | --------------------------- | ---------------- |
| 0     | 0     | 0                            | 0                           | (0,0)            |
| 0     | 1     | 1                            | 1                           | (1,1)            |
| 1     | 0     | 1                            | 1                           | (1,1)            |
| 1     | 1     | 0                            | 1                           | (0,1)            |

所以每一位只有三种合法情况：

| $x_i$ | $y_i$ | 合法方案数               |
| ----- | ----- | ------------------------ |
| 0     | 0     | 1，只能是 (0,0)          |
| 0     | 1     | 1，只能是 (1,1)          |
| 1     | 1     | 2，可以是 (0,1) 或 (1,0) |
| 1     | 0     | 0，不可能                |

如果存在某一位满足 $x_i=1,y_i=0$，答案为 $0$。否则，每个 $x_i=1$ 的位置都有 $2$ 种选择：$(p_i,q_i)=(0,1)$，或者 $(p_i,q_i)=(1,0)$，而其他位置都只有 $1$ 种选择。

## Code

```c++
// Problem: 异或或配对计数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137073/C
// Time: 2026-06-28 19:15:24
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
    int x, y;
    cin >> x >> y;

    if ((x | y) != y)
    {
        cout << 0 << endl;
        return;
    }

    int cnt = __builtin_popcount(x);
    cout << (1 << cnt) << endl;
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

# D - 小红的正方形

> 关键词：分类讨论

## 思路

两个正方形的边都平行于坐标轴。每个正方形可以看作成四条线段。

所以问题转化为：求两个线段集合的交点数量。如果存在两条边重合长度大于 $0$，那么公共点有无穷多个。

对线段相交的可能情况进行分类讨论，一共只有三种情况：

1. 一条竖直线和一条水平线：此时最多只有一个交点，设竖直线段为 $x = c,\quad y \in [y_1,y_2]$，水平线段为 $y = d,\quad x \in [x_1,x_2]$。如果满足 $c \in [x_1, x_2]$，$d \in [y_1,y_2]$，那么交点即为 $(c, d)$，否则没有交点。
1. 两条竖直线：如果它们的横坐标不同，一定不相交。如果横坐标相同，考察纵坐标区间有没有交集。设两条竖直线段所占的纵坐标区间分别是 $[a,b],[c,d]$，交集为 $[\max (a, c), \min (b, d)]$，记作 $[L, R]$，如果 $L>R$，没有交点；$L=R$，有一个交点；$L<R$，有无数个交点，输出 $inf$。
1. 两条水平线：同上。

**特别地，需要将给定的点去重。因为正方形的一个点同时属于两条边，如果两个正方形只在一个点上相交，这个点可能会被多组边重复计算。**

## Code

> 注：代码是抄的 `Anoth3r` 的。
>
> Source: [题解 | 牛客周赛 Round 150 – 林月物语](https://anoth3r.top/nkwk150/)

```c++
// Problem: 小红的正方形
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137073/D
// Time: 2026-06-30 00:06:02
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

struct E
{
    int x1, y1, x2, y2;
    bool v() const
    {
        return x1 == x2;
    }
};

void solve()
{
    auto read = [&]()
    {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        int lx = min(x1, x2), rx = max(x1, x2);
        int ly = min(y1, y2), ry = max(y1, y2);
        return array<E, 4>{E{lx, ly, rx, ly}, E{lx, ry, rx, ry}, E{lx, ly, lx, ry}, E{rx, ly, rx, ry}};
    };

    auto A = read(), B = read();

    set<pii> s;

    for (auto a: A)
        for (auto b: B)
            if (a.v() && b.v())
            {
                if (a.x1 != b.x1)
                    continue;

                int l = max(a.y1, b.y1), r = min(a.y2, b.y2);

                if (l > r)
                    continue;
                if (l < r)
                    return cout << "inf" << endl, void();

                s.insert({a.x1, l});
            }
            else if (!a.v() && !b.v())
            {
                if (a.y1 != b.y1)
                    continue;
                int l = max(a.x1, b.x1), r = min(a.x2, b.x2);
                if (l > r)
                    continue;
                if (l < r)
                    return cout << "inf" << endl, void();
                s.insert({l, a.y1});
            }
            else
            {
                auto check = [&](E a, E b) { return a.x1 <= b.x1 && b.x1 <= a.x2 && b.y1 <= a.y1 && a.y1 <= b.y2; };
                if (check(a, b))
                    s.insert({b.x1, a.y1});
                if (check(b, a))
                    s.insert({a.x1, b.y1});
            }

    cout << s.size() << endl;
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



# E - 小红的异或和

> 关键词：位运算，分类讨论

## 思路

所有 $x$ 的倍数都可以写成 $n=t \times x$，首先求出这个倍数 $t$ 对应的取值范围，是 $\left\lceil \frac{l}{x} \right\rceil \le t \le \left\lfloor \frac{r}{x} \right\rfloor$。

令 $t$ 的最小值为 $L$，最大值为 $R$，答案为 $(Lx) \operatorname{xor} ((L+1)x) \operatorname{xor} \cdots \operatorname{xor} (Rx)$。

由于异或具有以下的性质：
$$
(a \ll k) \operatorname{xor} (b \ll k)
=
(a \operatorname{xor} b) \ll k
$$
所以题目转化为求连续整数 $[L,R]$ 的异或和。之前总结过异或的性质，详见 [Maths (Notebook) - Hailuo4ever](https://blog.hailuo4ever.com/posts/notebook/math/#连续自然数序列的异或前缀和)

## Code

```c++
// Problem: 小红的异或和
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137073/E
// Time: 2026-06-28 19:25:06
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
    ll l, r, x;
    cin >> l >> r >> x;

    ll a = (l + x - 1) / x, b = r / x;

    if (a > b)
    {
        cout << 0 << endl;
        return;
    }

    // cout << a % 4 << ' ' << b % 4 << ' ' << (b - a) / 4 << endl;

    auto f = [](ll k) -> ll
    {
        if (k % 4 == 0)
            return k;
        else if (k % 4 == 1)
            return 1;
        else if (k % 4 == 2)
            return k + 1;
        else
            return 0;
    };

    ll res = f(b) ^ f(a - 1);
    cout << res * x << endl;
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

