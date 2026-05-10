---
title: cf round 1095
published: 2026-05-09
description: "Codeforces Round 1095 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1095 (Div. 2)](https://codeforces.com/contest/2226)

# A - Disturbing Distribution

> 关键词：思维

## 思路

对于任意两个大于1的数，有 $x \times y \ge x+y$，因此对于所有大于1的数，我们都必须单独移除，产生的代价即为总和。

假如数组最后一个元素是 1，它无法和其他任何的元素结合，所以会导致答案 `+1`，其余的 1 直接找某个元素相乘即可。

## Code

```c++
// Problem: CF 2226 A
// Contest: Codeforces - Codeforces Round 1095 (Div. 2)
// URL: https://codeforces.com/contest/2226/problem/A
// Time: 2026-05-09 19:04:42
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll mod = 676767677;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    ll res = 0;
    for (int i = 0; i < n; i++)
        if (a[i] > 1)
            res = (res + a[i]) % mod;

    if (a[n - 1] == 1)
        res++;

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

# B - Everything Everywhere

> 关键词：思维

## 思路

记一个数组中所有元素的最大公约数为 `g`，那么数组中的所有数都应该是 `g` 的倍数，设最大元素为 $M \times g$，最小元素为 $m \times g$，这意味着 $M - m = 1$，也就是说给定数组必须恰好包含两个不同的元素。

因为排列中所有的元素互异，所以任何长度不为 2 的子数组一定不是好的，检查所有长度为 2 的子数组即可。

## Code

```c++
// Problem: CF 2226 B
// Contest: Codeforces - Codeforces Round 1095 (Div. 2)
// URL: https://codeforces.com/contest/2226/problem/B
// Time: 2026-05-09 19:20:10
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n);

    for (int i = 0; i < n; i++)
        cin >> a[i];

    ll res = 0;

    for (int i = 1; i < n; i++)
    {
        if (a[i] % (a[i] - a[i - 1]) == 0)
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

# C - Mental Monumental (Easy Version)

> 关键词：数学，二分答案，贪心

## 思路

### Step1 - 转化操作

对于数组中的任意元素 $x$，我们可以选择一个任意的正整数 $y \ge 1$，把它变成 $x \bmod y$。我们考虑这个操作会将 $x$ 变为哪些数：

1. 原封不动：假设选择的 $y>x$，那么 $x \bmod y = x$，也就是说我们总是可以选择把原数保留下来。
2. 变成更小的数：假设我们想把 $x$ 变成一个更小的非负整数 $k$ ($k < x$)。我们需要满足 $x \bmod y = k$。最简单的取法就是直接令 $y = x - k$。此时要满足余数 $k$ 必须严格小于除数 $y$，也就是 $k < x - k$，变形得到 **$2k < x$**，或者写成整数形式 **$2k + 1 \le x$**。

> [!NOTE]
>
> 数组里的任何一个数字 $x$，要么把它当 $x$ 本身用，要么可以把它变成任何一个满足 $k \le \lfloor \frac{x-1}{2} \rfloor$ 的非负整数 $k$。

> 比如 `x = 5`，可以把它变成 `5, 0, 1, 2`，但不能变成 `3, 4`。

### Step2 - 判断能否到达某个具体的 mex

假设我们现在的目标是：验证最终数组的 MEX 能否达到 $M$。要让 MEX 为 $M$，这就意味着我们的数组里必须凑齐 $\{0, 1, 2, \dots, M-1\}$ 这 $M$ 个数字。

我们可以把原数组的元素分为两类来分配：

1. 原配优先（某个元素能直接填补这个空缺）：

   如果我们需要填补 $k$ ($k < M$)，而原数组里刚好有 $k$，那我们**贪心地直接把这个 $k$ 拿来用**。

   为什么？因为 $k$ 如果不当 $k$ 用，它只能用来变成小于等于 $\lfloor \frac{k-1}{2} \rfloor$ 的数，其“能力范围”非常窄。所以能直接匹配就直接匹配。

2. 剩余的元素作为“万能元素”补进来：

   当我们把所有能直接匹配的 $k$ 都匹配完后，有些数字 $< M$ 还没被凑出来。

   此时，原数组里剩下的元素（包括多余的 $< M$ 的数字，以及所有 $\ge M$ 的数字）就成了万能的。

   对于一个还没凑出来的空缺 $k$，我们需要一个 $x$，只要满足 **$x \ge 2k + 1$**，这个数就能变成 $k$ 来填补空缺。

> [!NOTe]
>
> 验证方法：用一个 `bool` 数组记录 $0 \sim M-1$ 哪些位置已经被“原配”填了，把剩下的数字收集起来作为万能数字。
>
> 对于还没填满的空缺 $k$，我们需要找一个 $\ge 2k + 1$ 的万能牌。为了尽可能把大的万能牌留给大的空缺，我们将空缺和万能牌**从小到大排序，使用双指针进行贪心匹配**。

### Step3 - 二分答案找最大的 M

因为 MEX 具有**单调性**（如果能凑出 $0 \sim M-1$ 使得 MEX 为 $M$，那稍微丢弃几个数字，自然也能让 MEX 为 $M-1$），所以我们可以直接在 $[0, n+1]$ 的范围内二分查找最大的 $M$。

## Code

```c++
// Problem: CF 2226 C
// Contefilled: Codeforces - Codeforces Round 1095 (Div. 2)
// URL: https://codeforces.com/contest/2226/problem/C
// Time: 2026-05-09 19:44:19
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    sort(all(a));

    auto check = [&](int m)
    {
        vector<bool> filled(m, false);
        vector<int> w;

        for (int x: a)
        {
            if (x < m && !filled[x])
                filled[x] = true;
            else
                w.push_back(x);
        }

        vector<int> unfilled;
        for (int i = 0; i < m; i++)
            if (!filled[i])
                unfilled.push_back(i);

        int idx = 0;
        for (int req: unfilled)
        {
            while (idx < w.size() && w[idx] < 2 * req + 1)
                idx++;

            if (idx == w.size())
                return false;

            idx++;
        }
        return true;
    };

    int l = 0, r = n + 1, res = 0;
    while (l <= r)
    {
        int mid = (l + r + 1) >> 1;
        if (check(mid))
            res = mid, l = mid + 1;
        else
            r = mid - 1;
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

