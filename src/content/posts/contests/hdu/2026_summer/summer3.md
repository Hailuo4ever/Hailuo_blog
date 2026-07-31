---
title: 2026 杭电多校3
published: 2026-07-28
description: "HDU Multi-University Training Contest 3"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营3](https://acm.hdu.edu.cn/contest/problems?cid=1231)

# 1005 - GCD

> 关键词：思维，枚举优化

## 思路

假设当前的数为 $x=\prod_{i=1}^{k}p_i^{c_i}$，其中 $c_i$ 是质数 $p_i$ 在 $x$ 中的指数。

单独考虑某个质因子 $p_i$。假设它在 $a,b$ 中的指数分别为 $u_i,v_i$，因为 $ab=x$，所以 $u_i+v_i=c_i$，而在 $\gcd(a,b)$ 中，$p_i$ 的指数是 $\min(u_i,v_i)$。

考虑怎样让这个指数尽可能大，显然是尽可能平均分配，最优情况下每个质因子的指数都会变成：$c_i\longrightarrow\left\lfloor\frac{c_i}{2}\right\rfloor$。

所以答案只和质因数的指数最大值有关，设最大值为 $M$，答案即为 ${\left\lfloor\log_2 M\right\rfloor+1}$。

**枚举时也有一个策略：枚举到 $10^6$ 即可，否则会超时**。把所有不超过 $10^6$ 的质因子全部除掉之后，设剩余部分为 $x$，此时 $x$ 的所有质因子都大于 $10^6$。因为原数不超过 $10^{18}$，剩余部分最多只能包含两个质因子。否则爆 $10^{18}$ 了。剩余部分只可能是以下三种情况。

| 剩余部分               | 最大指数 |
| ---------------------- | -------- |
| 一个大质数 (p)         | (1)      |
| 两个不同的大质数 (pq)  | (1)      |
| 某个大质数的平方 (p^2) | (2)      |

## Code

```c++
// Problem: GCD
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1231&pid=1005
// Time: 2026-07-28 18:25:56
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll N = 1e6 + 10;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    ll x;
    cin >> x;

    auto divide = [&](ll x) -> ll
    {
        ll cnt = 0;
        for (ll i = 2; i <= N; i++)
        {
            ll t = 0;
            while (x % i == 0)
            {
                x /= i;
                t++;
            }
            cnt = max(cnt, t);
        }

        if (x)
            cnt = max(cnt, 1ll);

        ll k = sqrt(x);
        if (x != 1 && k * k == x)
            cnt = max(cnt, 2ll);

        return cnt;
    };

    ll ret = divide(x);
    ll res = 0;

    while (ret)
    {
        ret /= 2;
        res++;
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

