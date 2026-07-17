---
title: 牛客周赛 Round 153
published: 2026-07-19
description: "Nowcoder Week Contest 153"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: true
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 153 内测](https://ac.nowcoder.com/acm/contest/137895)

# A - 小红的字符串处理

> 关键词：签到

## Code

```c++
// Problem: 小红的字符串处理
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/A
// Time: 2026-07-14 18:20:58
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
    string s;
    cin >> s;

    for (int i = 0; i < s.size(); i++)
        cout << s[i] << ". "[i == s.size() - 1];
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

# B - 小红的菊花构造

> 关键词：签到

## Code

```c++
// Problem: 小红的菊花构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/B
// Time: 2026-07-14 18:21:57
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
    int n, k;
    cin >> n >> k;

    for (int i = 1; i <= n; i++)
    {
        if (i == k)
            continue;
        cout << k << ' ' << i << endl;
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

# C - 小红的swap（easy）

> 关键词：模拟

## 思路

在 `Easy Version` 中，我们可以把 $c$ 当作交换桥梁。题目保证 $s$ 和 $t$ 中 $1$ 的数量相同，所以每一个“缺少 $1$”的位置，都能找到一个“多出 $1$”的位置与它配对。

设位置 $x$ 属于类型 A，此时 $s_x=0$，目标是 $1$；位置 $y$ 属于类型 B，此时 $s_y=1$，目标是 $0$。

对于这样一对错误位置，我们可以这样操作：`swap(x, c)`, `swap(y, c)`, `swap(x, c)`

操作需要 $3k$ 次，显然是符合要求的。

## Code

```c++
// Problem: 小红的swap（easy）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/C
// Time: 2026-07-14 18:23:19
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

    string s, t;
    cin >> s >> t;

    s = " " + s, t = " " + t;

    vector<int> pos0, pos1;
    vector<bool> st(n + 1, false);

    for (int i = 1; i <= n; i++)
    {
        if (s[i] == '0' && t[i] == '1')
            pos1.eb(i);
        else if (s[i] == '1' && t[i] == '0')
            pos0.eb(i);
    }

    vector<int> res;
    for (int i = 0; i < pos0.size(); i++)
    {
        int x = pos0[i], y = pos1[i];
        res.eb(x), res.eb(y), res.eb(x);
    }

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << endl;
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

# D - 小红的swap（hard）

> 关键词：模拟

## 思路

对于 `Hard Version`，考虑最小的操作次数。我们仍然设不相同的位置共有 $2k$ 个，分为两类。

可以把所有错误位置**串成一条链**，只让额外字符 $2$ 进入字符串一次、离开字符串一次，从而将操作次数优化为 $2k+1$。

考虑证明过程。首先每个错误位置都必须至少操作一次，如果一个错误位置从未被选择，那么它的字符永远不会改变，也就不可能满足 $s_i=t_i$，一定至少需要 $2k$ 次操作。

而一开始 $c=2$，它被换进来后一定有一个位置需要再选一次来把 $2$ 换出去。所以理论下界为 $2k+1$。

## Code

```c++
// Problem: 小红的swap（hard）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/D
// Time: 2026-07-14 19:54:20
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

    string s, t;
    cin >> s >> t;

    s = " " + s, t = " " + t;

    vector<int> pos0, pos1;
    vector<bool> st(n + 1, false);

    for (int i = 1; i <= n; i++)
    {
        if (s[i] == '0' && t[i] == '1')
            pos1.eb(i);
        else if (s[i] == '1' && t[i] == '0')
            pos0.eb(i);
    }

    if (pos0.empty() || pos1.empty())
    {
        cout << 0 << endl;
        return;
    }

    vector<int> res;
    for (int i = 0; i < pos0.size(); i++)
    {
        int x = pos0[i], y = pos1[i];
        res.eb(x), res.eb(y);
    }

    res.eb(pos0[0]);

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << endl;
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

# E - 小红的分割线

> 关键词：计算几何

## 思路

首先枚举两个点所组成的连线，记作 $A,B$，再枚举其它点，记作 $P$。

考虑两个向量 $\overrightarrow{AB}=(x_j-x_i,\ y_j-y_i)$，$\overrightarrow{AP}=(x_k-x_i,\ y_k-y_i)$，通过计算两个向量的叉乘，可以判断 $P$ 位于有向直线 $A \to B$ 的哪一侧。如果叉乘结果 $>0$，则 $P$ 位于直线左侧，$<0$ 则 $P$ 位于直线右侧。

时间复杂度 $O(n^3)$。

## Code

```c++
// Problem: 小红的分割线
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/E
// Time: 2026-07-15 19:55:13
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

    vector<pll> p(n);

    for (auto &[x, y]: p)
        cin >> x >> y;

    int res = 0;

    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            int l = 0, r = 0;

            for (int k = 0; k < n; k++)
            {
                if (k == i || k == j)
                    continue;

                ll x1 = p[j].first - p[i].first, y1 = p[j].second - p[i].second;
                ll x2 = p[k].first - p[i].first, y2 = p[k].second - p[i].second;

                ll mul = x1 * y2 - y1 * x2;

                if (mul > 0)
                    l++;
                else if (mul < 0)
                    r++;
            }

            if (l == r)
                res++;
        }
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

# F - 小红的网格图构造

> 关键词：构造

## 思路

把网格划分成若干个**互不相交的 $2\times2$ 小块**，这是为了推出 $1$ 的数量下界。一共有 $L=\left\lfloor\frac n2\right\rfloor
\left\lfloor\frac m2\right\rfloor$ 个。保证每个
