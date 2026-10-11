---
title: 2025 icpc 沈阳区域赛
published: 2026-10-09
description: "The 2025 ICPC Asia Shenyang Regional Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 区域赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2025 ICPC Asia Shenyang Regional Contest - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/2641?v=1)

# B - Buggy Painting Software I

> 关键词：思维，分类讨论

## 思路

由于题目每次只修改一个像素，因此像素的具体位置不会影响答案，我们考虑这个矩阵有用的信息有哪些，实际上重要信息只有透明像素的数量 $z$，和每种非零颜色的出现次数。

**我们要决定的是：哪些颜色用免费创建的纯色图层提供，这些图层的排列顺序，其他像素通过画笔还是橡皮来处理**。

我们考虑固定图层顺序后，一个非零像素的代价是多少。假设一共创建 $t$ 个纯色图层，从上到下颜色分别是 $C_1,C_2,\ldots,C_t$。如果某个位置的目标颜色是 $C_i$，有两种处理方式。

第一种：擦掉它上方的 $i-1$ 个像素，费用为 $(i-1)b$；

第二种：直接把最上层这个位置涂成目标颜色，费用为 $a$。

对于透明的像素需要单独处理，因为一个位置要最终透明，必须让所有图层在这个位置都透明。如果建了 $t$ 个图层，每个目标透明像素必须都擦除 $t$ 次，费用为 $tb$。

另外，还要考虑一个特殊方案：**不建任何纯色图层，只建一个透明图层，然后把所有像素逐个画出来**。

## Code

```c++
// Problem: B. Buggy Painting Software I
// Contest: QOJ - GP of Shenyang
// URL: https://qoj.ac/contest/2641/problem/14941/statement/zh_cn
// Time: 2026-10-09 15:12:27
#include <bits/stdc++.h>
#include <cassert>
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
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    ll n, m, a, b;
    cin >> n >> m >> a >> b;

    vector<int> cnt(n * m + 1);
    int z = 0;

    for (int i = 1, x; i <= n * m; i++)
        cin >> x, (x == 0 ? z++ : cnt[x]++);

    vector<int> c;
    for (int i = 1; i <= n * m; i++)
        if (cnt[i])
            c.eb(cnt[i]);

    sort(all(c), greater<int>());
    ll cur = a * (n * m - z), res = cur;

    for (int i = 0; i < c.size(); i++)
    {
        cur += z * b;
        ll sv = max(0ll, a - i * b);
        cur -= c[i] * sv;

        res = min(res, cur);
    }

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

