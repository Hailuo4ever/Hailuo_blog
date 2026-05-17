---
title: cf round 1098
status: "editing"
published: 2026-05-16
description: "Codeforces Round 1098 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1098.(Div. 2)](https://codeforces.com/contest/2228)

# A - Marisa Steals Reimu's Takeout

> 关键词：模拟

## 思路

由于是子序列，我们不需要关心数字在数组中的顺序。

我们需要统计 $0, 1, 2$ 在数组中的出现次数，考虑怎样才能凑出尽可能多的被 $3$ 整除的序列。

记出现次数为 $c_0, c_1, c_2$。

首先每个 $0$ 都可以组成一个被 $3$ 整除的子序列，对答案的贡献为 $c_0$。

然后尽可能地把 $1, 2$ 凑成一对，对答案的贡献为 $min(c_1, c_2)$，配对后必定至少有一个数被消耗光了。

此时剩下的数只有全 $1$，全 $2$，或者没有数三种情况，相同的数每三个分一组，对答案的贡献为 $c_1 / 3 + c_2 / 3$。

## Code

```c++
// Problem: CF 2228 A
// Contest: Codeforces - Codeforces Round 1098 (Div. 2)
// URL: https://codeforces.com/contest/2228/problem/A
// Time: 2026-05-16 22:35:20
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
    int n;
    cin >> n;

    int c0 = 0, c1 = 0, c2 = 0;
    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;

        if (x == 0)
            c0++;
        else if (x == 1)
            c1++;
        else
            c2++;
    }

    int res = 0;
    int t = min(c1, c2);

    res = c0 + t;
    c1 -= t, c2 -= t;

    res = res + c1 / 3 + c2 / 3;
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

# B - Remilia Plays Soku

> 关键词：思维，模拟

## 思路

首先我们发现，在一个长度为 $n$ 的环上，任何两个点之间都有两条路径。分别是 $d$ 和 $n - d$。

假设相对短的那一条路径为 $d$，则有 $d = \min(|x_1 - x_2|, n - |x_1 - x_2|)$。

考虑边界情况，如果这个环特别小，小到任何两个不同的位置都是相邻的，也就是 $n \le 3$ 的情况，那无论 $k$ 是多少，游戏一定会在 $1$ 秒内结束。

否则因为双方都采取最优策略，逃跑者会使用 $k$ 秒来拖延时间，答案即为 $d+k$。

> [!NOTE]
>
> 为什么 $+k$ 是正确的？
>
> 因为逃跑者肯定会根据追逐者的路线反方向跑，而追逐者会观察到逃跑者的行动后再行动，因此在最优策略下一定会拖延 $k$ 秒。

## Code

```c++
// Problem: CF 2228 B
// Contest: Codeforces - Codeforces Round 1098 (Div. 2)
// URL: https://codeforces.com/contest/2228/problem/B
// Time: 2026-05-16 22:35:21
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
    ll n, x1, x2, k;
    cin >> n >> x1 >> x2 >> k;

    ll dist = abs(x1 - x2);
    dist = min(dist, n - dist);

    if (n <= 3)
        cout << 1 << endl;
    else
        cout << dist + k << endl;
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

# C - Cimo and Number

> 关键词：贪心，前缀匹配

## 思路

> 如果使用搜索，会导致分枝数非常大且不太好剪枝，所以使用贪心与前缀匹配的思想考虑。

我们要构造的数字 $b$ 需要尽可能接近给定的数字 $a$。假设数字 $a$ 的字符串长度为 $L$。那么 $b$ 的长度只可能是以下三种情况：

1. $b$ 的长度比 $a$ 短（长度为 $L - 1$）