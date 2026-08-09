---
title: 2026 杭电多校6
published: 2026-08-06
description: "HDU Multi-University Training Contest 6"
image: https://img.hailuo4ever.com/cover/hdu.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营6](https://acm.hdu.edu.cn/contest/problems?cid=1234)

# 1010 - Card Damage

> 关键词：推公式

## 思路

一共有 $n=x+y$ 张牌。**我们把所有红牌的位置记为 $r_1<r_2<\cdots<r_y$，并定义 $r_0=0$**。

考虑第 $i$ 张红牌，显然在 $r_{i-1}$ 到 $r_i$ 之间全都是蓝牌，一共有 $r_i-r_{i-1}-1$ 张蓝牌。由于每张红牌结算后，$k$ 会重新变成 $1$，所以当前红牌打出时，$k=1+(r_i-r_{i-1}-1)=r_i-r_{i-1}$。打出第 $i$ 张红牌后，剩余 $n-r_i$ 张牌，所以第 $i$ 张红牌造成的伤害为 $(r_i-r_{i-1})(n-r_i)$。总伤害为 ${
\sum_{i=1}^{y}(r_i-r_{i-1})(n-r_i)
}$。

考虑把牌分成若干段。定义 $d_i=r_i-r_{i-1}\quad 1\le i\le y$，并定义最后一段 $d_{y+1}=n-r_y$。也就是一共分成 $y+1$ 段。

> 例如：`B B R | B R | B B B R | B B  ->  [ B B R ] [ B R ] [ B B B R ] [ B B ]`

从这个视角来看，第 $i$ 张红牌的伤害即为 $d_i(d_{i+1}+d_{i+2}+\cdots+d_{y+1})$。容易推出总伤害为 ${
D=\sum_{1\le i<j\le y+1}d_i d_j
}$。

现在问题变成了，我们现在有 $m=y+1$ 个整数 $d_1,d_2,\ldots,d_m$，满足 $d_1+d_2+\cdots+d_m=n$。需要最大化 $\sum_{i<j}d_i d_j$。

**利用 $\left(\sum d_i\right)^2
=
\sum d_i^2+2\sum_{i<j}d_i d_j$，上式可以转化成 $D
=
\frac{
n^2-\sum d_i^2
}{2}$**。由于 $n$ 已经固定，最大化伤害等于最小化 $d_i$ 的平方和。

> 上述式子是平方和公式的推广。考虑 $(a+b)^2=a^2+ab+ba+b^2$，$ab$ 和 $ba$ 各出现了一次。而对于三个数的情况，$(d_1+d_2+d_3)^2
> =
> d_1^2+d_2^2+d_3^2
> +
> 2(d_1d_2+d_1d_3+d_2d_3)$。

考虑如何最小化平方和，不难想到尽量平均分配 $d_i$。一种比较感性的理解是，平方会导致大的数产生的代价更大，为了使代价更小，应该大家一起均摊。

整理现在的所有字母变量。一共有 $m=y+1$ 段，总长度 $n=x+y$，令 $q=\left\lfloor\frac{n}{m}\right\rfloor$，$r=n\bmod m$。这样就均分成了：$m-r$ 段长度为 $q$，$r$ 段长度为 $q+1$。$d_i$ 平方和的最小值为 $(m-r)q^2+r(q+1)^2$。最终答案为 ${
\frac{
n^2-\left((m-r)q^2+r(q+1)^2\right)
}{2}
}$。

## Code

```c++
// Problem: Card Damage
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1234&pid=1010
// Time: 2026-08-09 15:56:47
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
    ll x, y;
    cin >> x >> y;

    ll n = x + y, m = y + 1;
    ll q = n / m, r = n % m;

    ll mn = (m - r) * q * q + r * (q + 1) * (q + 1);

    ll res = (n * n - mn) / 2;
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





# 1012 - P2P

> 关键词：图论建模

## 思路

由于操作有无限次，考虑操作会在什么时候开始，每次的变化都相同。

由于是按照节点编号的顺序进行操作的，我们定义 $d_i$ 表示节点 $i$ 在第多少轮才能被收上来。考虑建有向边，并使用 $bfs$ 求解 $d$ 数组。对于当前访问点 $u$，如果 $v$ 的点编号小于 $u$，说明它会先被处理，也就是说和 $u$ 同一轮被收上来，反之 $+1$。在所有点的信息被收上来之前，显然越浅的点贡献越多。

计算所有点被收上来之前，各点产生的贡献后，接下来每一次的增长就固定了，是除了 $a_1$ 之外的所有 $a$ 数组的和。由于操作有无限次，所以首先对 $sum$ 进行分类讨论。如果 $sum=0$，讨论 $res$。

## Code

```c++
// Problem: P2P
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1234&pid=1012
// Time: 2026-08-06 12:18:56
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(res) (res).begin(), (res).end()
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
    int n;
    cin >> n;

    vector<vector<int>> g(n + 1);
    vector<ll> a(n + 1), b(n + 1), d(n + 1);

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n - 1; i++)
    {
        int res;
        cin >> res;
        // g[i + 1].eb(res);
        g[res].eb(i + 1);
    }

    ll mx = 0;
    auto bfs = [&](void) -> void
    {
        queue<pll> q;
        q.push({1, 0});

        while (!q.empty())
        {
            auto [u, dist] = q.front();
            q.pop();

            d[u] = dist;
            mx = max(dist, mx);

            for (auto v: g[u])
            {
                if (v < u)
                    q.push({v, dist});
                else
                    q.push({v, dist + 1});
            }
        }
    };

    bfs();

    ll sum = accumulate(all(a), 0ll) - a[1];

    ll res = 0;
    for (int i = 2; i <= n; i++)
        res = res + a[i] * (mx - d[i] + 1);

    // res + sum + sum...
    if (sum == 0)
    {
        if (res == 0)
            cout << 0 << endl;
        else
            cout << (res > 0 ? "1" : "-1") << endl;
    }
    else
        cout << (sum > 0 ? "1" : "-1") << endl;
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

