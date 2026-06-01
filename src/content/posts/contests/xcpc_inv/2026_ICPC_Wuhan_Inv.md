---
title: 2026 icpc武汉邀请赛
published: 2026-05-21
description: "The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 邀请赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题 - QOJ.ac](https://qoj.ac/contest/3757)

# C - Believe in You

> 关键词：模拟

## 思路

只需要维护整个过程玩家造成的伤害即可，首先考虑能否使用尽可能多的攻击牌斩杀，如果不能的话考虑先用尽可能少的防御牌保命，再将剩余的出牌次数全部用来攻击即可。由于防御只影响本回合是否存活，因此在保证存活的前提下，使用尽可能多的攻击牌一定不会差。

## Code

```c++
// Problem: C
// Contest: QOJ - The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题
// URL: https://qoj.ac/contest/3757/problem/22150/statement/zh_cn
// Time: 2026-05-21 15:30:48
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
    int n, s, d, hp;
    cin >> n >> s >> d >> hp;

    int damage = 0;
    for (int i = 1; i <= n; i++)
    {
        int a, k;
        cin >> a >> k;

        int damagemx = min(a, 3) * s;
        if (damage + damagemx >= hp)
        {
            cout << "Yes" << endl << i << endl;
            return;
        }

        int def = (k + d - 1) / d;
        if (def > 5 - a || def > 3)
        {
            cout << "No" << endl;
            return;
        }

        int cnt = min(a, 3 - def);
        damage += cnt * s;
    }
    cout << "No" << endl;
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

# H - Rectangle Cutting

> 关键词：STL

## 思路

初始有一个 `n × m` 的矩形。每次沿着某条完整的竖线 `x = k` 或横线 `y = k` 切一刀，要求每次切完后输出当前所有小矩形中的最大面积。题面给出 `n, m ≤ 1e9`，`q ≤ 5e5`，所以不能模拟所有的小矩形。

所有的竖切只会影响宽度段，所有的横切只会影响高度段，因此最大面积一定是**最大宽度段乘以最大高度段**。

所以问题变成，动态插入切割位置，并维护当前相邻切割线之间的最大间距。

使用 `set<long long> pos` 维护所有切割位置**（包括边界）**，使用 `multiset<long long> len` 维护所有相邻切割线之间的长度，初始时 `xLen = {n}, yLen = {m}`，因为可能有多个长度相同的区间，所以要使用 `multiset`。

当插入一刀时，我们先找到它所在的原区间，原来有一个长度，切完后变成两个长度，擦除原先的并更新。

> [!NOTE]
>
> 访问 `set` 的最后一个元素的反向迭代器是 `s.rbegin()`。

## Code

```c++
// Problem: H
// Contest: QOJ - The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题
// URL: https://qoj.ac/contest/3757/problem/22155/statement/zh_cn
// Time: 2026-05-21 16:09:40
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

void split(set<ll> &pos, multiset<ll> &len, ll k)
{
    auto itR = pos.upper_bound(k);
    auto itL = prev(itR);

    ll L = *itL;
    ll R = *itR;

    len.erase(len.find(R - L));
    len.insert(k - L);
    len.insert(R - k);

    pos.insert(k);
}

void solve()
{
    ll n, m, q;
    cin >> n >> m >> q;

    set<ll> xs, ys;
    multiset<ll> xlen, ylen;

    xs.insert(0);
    xs.insert(n);
    ys.insert(0);
    ys.insert(m);

    xlen.insert(n);
    ylen.insert(m);

    while (q--)
    {
        int op;
        ll k;
        cin >> op >> k;

        if (op == 1)
            split(xs, xlen, k);
        else
            split(ys, ylen, k);

        ll maxw = *xlen.rbegin();
        ll maxh = *ylen.rbegin();

        cout << maxw * maxh << endl;
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

