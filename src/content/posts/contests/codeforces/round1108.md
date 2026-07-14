---
title: cf round 1108
published: 2026-07-12
description: "Codeforces Round 1108 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1108.(Div. 2)](https://codeforces.com/contest/2246)

# A - farmpiggie and Subset Sum

> 关键词：构造

## 思路

要求计数器最后不能为 $1$，我们考虑让所有 $i \times p_i$ 都是偶数即可，这样偶数加起来也是偶数。

而只有在两个奇数相乘时，$i \times p_i$ 才是奇数，因此我们分配下标，将偶数下标分给奇数，将奇数下标分给偶数。

由于 $n$ 是偶数，上述操作等价于倒序输出整个排列。

## Code

```c++
// Problem: CF 2246 A
// Contest: Codeforces - Codeforces Round 1108 (Div. 2)
// URL: https://codeforces.com/contest/2246/problem/A
// Time: 2026-07-13 08:23:11
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    for (int i = n; i >= 1; i--)
        cout << i << " \n"[i == 1];
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

# B - ezraft and Array

> 关键词：构造

## 思路

$n=1$ 直接输出 $1$，而对于 $n=2$​ 的情况，假设存在两个不同的正整数 $a < b$。总和为 $S$，必须是 $b$ 的倍数，但 $b < a+b<2b$，因此 $n=2$ 时无解。

对于 $n=3$ 可以构造出一个基础数组 $1,2,3$，我们考虑如何在此基础上扩展数组。

假设当前已经有一个合法数组 $a_1,a_2,\ldots,a_k$，其总和为 $S$，现在把当前总和 $S$ 加入到数组尾部，新的数组和为 $2S$，仍然满足要求。并且所有元素也互不相同。

## Code

```c++
// Problem: CF 2246 B
// Contest: Codeforces - Codeforces Round 1108 (Div. 2)
// URL: https://codeforces.com/contest/2246/problem/B
// Time: 2026-07-13 09:34:15
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    if (n == 1)
    {
        cout << 1 << endl;
        return;
    }

    if (n == 2)
    {
        cout << -1 << endl;
        return;
    }

    cout << "1 2 3 ";

    ll s = 6;
    for (int i = 4; i <= n; i++)
    {
        cout << s << ' ';
        s *= 2;
    }

    cout << endl;
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

