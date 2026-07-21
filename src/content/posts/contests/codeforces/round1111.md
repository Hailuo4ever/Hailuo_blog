---
title: cf round 1111
published: 2026-07-18
description: "Codeforces Round 1111 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1111.(Div. 2)](https://codeforces.com/contest/2247)

# A - Zero Sum

> 关键词：签到

## 思路

考虑一次操作对元素和的影响。根据这两个数的情况分类，$(1,1)\rightarrow(-1,-1)$，总和 $-4$，$(-1,-1)\rightarrow(1,1)$，总和 $+4$，两个数不同，总和不变。

因此，每次操作只会让数组总和发生以下变化：$-4,\quad 0,\quad 4$，所以数组元素和模 $4$ 的余数永远不会改变。

## Code

```c++
// Problem: CF 2247 A
// Contest: Codeforces - Codeforces Round 1111 (Div. 2)
// URL: https://codeforces.com/contest/2247/problem/A
// Time: 2026-07-18 23:02:02
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

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    int res = accumulate(all(a), 0);
    cout << (res % 4 == 0 ? "YES" : "NO") << endl;
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

# B - Yet Another Constructive

> 关键词：构造

## 思路

我们希望前缀和的余数按照 $0,1,2,\dots,k-1,0,1,2,\dots,k-1,\dots$ 的形式循环，即 $S_i\bmod m=i\bmod k$。

根据抽屉原理，要在数组里放下 $k$ 个互不相同的余数，必须满足 $k\le m$，因此无解条件是 $k>m$。

我们让普通的位置填 $1$，每个长度为 $k$ 的块末尾填 $m-k+1$。这样每 $k$ 个元素都会构成一个块 $\underbrace{1,1,\dots,1}_{k-1\text{ 个}},m-k+1$。

可以证明，不存在比其更短的子数组满足题目要求。

## Code

```c++
// Problem: CF 2247 B
// Contest: Codeforces - Codeforces Round 1111 (Div. 2)
// URL: https://codeforces.com/contest/2247/problem/B
// Time: 2026-07-18 23:12:09
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
    int n, k, m;
    cin >> n >> k >> m;

    vector<int> res(n + 1);

    if (k > m)
    {
        cout << "NO" << endl;
        return;
    }

    for (int i = 1; i <= n; i++)
    {
        if (i % k == 0)
            res[i] = m - k + 1;
        else
            res[i] = 1;
    }

    cout << "YES" << endl;
    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

# C - Inversion of a Subsequence

> 关键词：思维

## 思路

首先考虑特殊情况。如果两个数组已经相等，显然不需要操作，答案为 $0$。

如果 $a$ 数组全是 $0$，任意的非空子序列的元素和都是 $0$，所以无法执行操作，此时无解。

如果 $b$ 数组全是 $1$，考虑任意一次合法操作，因为被选择的位置中原本有奇数个 $1$，所以至少选择了一个值为 $1$ 的位置。这些位置翻转以后会变成 $0$。因此，执行完任何一次操作后，数组中一定至少存在一个 $0$，也就是说，任何一次操作都不可能使数组变成全 $1$。此时无解。

考虑其他情况，下面只考虑 $a$ 和 $b$ 在某位不同的情况。注意到如果要翻转 $a$ 的 $0$ 位置，一定需要奇数个 $1$ 来带。因此假如 $a$ 中有奇数个 $1$，可以一次完成操作，否则如果有偶数个 $1$，单独翻转一个 $1$ 即可，操作次数为 $2$。

## Code

```c++
// Problem: CF 2247 C
// Contest: Codeforces - Codeforces Round 1111 (Div. 2)
// URL: https://codeforces.com/contest/2247/problem/C
// Time: 2026-07-18 23:33:01
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

    vector<int> a(n + 1), b(n + 1);

    int s1 = 0, s2 = 0;
    for (int i = 1; i <= n; i++)
        cin >> a[i], s1 += a[i];
    for (int i = 1; i <= n; i++)
        cin >> b[i], s2 += b[i];

    vector<int> pos0, pos1;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] == 1 && b[i] == 0)
            pos1.eb(i);
        if (a[i] == 0 && b[i] == 1)
            pos0.eb(i);
    }

    int c = pos1.size(), d = pos0.size();
    // cout << c << ' ' << d << endl;

    if (c == 0 && d == 0)
        cout << 0 << endl;

    else if (s1 == 0 || s2 == n)
        cout << -1 << endl;

    else
    {
        if (c % 2 == 1)
            cout << 1 << endl;
        else
            cout << 2 << endl;
    }
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

# D1 - XOR Sorting (Easy Version)

> 关键词：二分答案

## 思路

首先，注意到随着 $k$ 的不断增大，允许交换的对数更多，可行性具有单调性，考虑二分答案。

考虑如何判断一个 $k$ 是否可行。对于固定的 $k$，允许交换满足 $i\oplus j\le k$ 的两个下标，考虑他们最终会形成哪些连通块。

假设 $k$ 已经固定好，令 $2^p$ 是不超过 $k$ 的最大二次幂，即 $2^p\le k<2^{p+1}$，那么下标会按照长度 $2^{p+1}$ 划分为连续块。

```c++
[0, 1, 2, 3]
[4, 5, 6, 7]
[8, 9, 10, 11]
...
    
// 每个块内部的所有位置都是连通的，元素可以任意排列
// 但不同块之间无法交换元素
```

并且由于异或的结果需要 $\le k$，所以真正决定交换能力的是 $k$ 的最高位 $1$ 的位置。也就是说最终答案一定是 $0,1,2,4,8,\ldots$。

对于每个块，内部排序并拼接后非递减，说明当前 $k$ 是可行的，但不需要对每个块排序。我们考虑只检查块与块的边界。如果两个块 $a,b$ 满足拼接后有序，他们需要满足 $max(a) \le max(b)$。

```c++
// Problem: CF 2247 D1
// Contest: Codeforces - Codeforces Round 1111 (Div. 2)
// URL: https://codeforces.com/contest/2247/problem/D1
// Time: 2026-07-19 12:01:56
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
    int n, q;
    cin >> n >> q;

    vector<int> a(n);
    for (auto &x: a)
        cin >> x;

    auto check = [&](int k) -> bool
    {
        int len = 1;
        if (k != 0)
        {
            int w = 1 << (31 - __builtin_clz(k));
            len = w << 1;
        }

        int premax = -inf;
        for (int i = 0; i < n; i += len)
        {
            int j = min(len + i, n);
            int mn = inf, mx = -inf;

            for (int p = i; p < j; p++)
                mn = min(mn, a[p]), mx = max(mx, a[p]);

            if (premax > mn)
                return false;

            premax = mx;
        }
        return true;
    };

    int l = -1, r = 1;

    while (r < n)
        r <<= 1;

    while (l + 1 < r)
    {
        int mid = (l + r) >> 1;
        if (check(mid))
            r = mid;
        else
            l = mid;
    }

    cout << r << endl;
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

