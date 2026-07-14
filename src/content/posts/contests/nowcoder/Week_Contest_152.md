---
title: 牛客周赛 Round 152
published: 2026-07-12
description: "Nowcoder Week Contest 152"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 152 内测](https://ac.nowcoder.com/acm/contest/137665)

# A - 小红的倍数构造

> 关键词：构造

## 思路

把两个给定的数字直接拼在一起就是答案，设给定数字位数为 $n$，拼在一起相当于原数乘 $10^n$ 再加上一倍的原数。

## Code

```c++
// Problem: 小红的倍数构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137665/A
// Time: 2026-07-10 18:07:48
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
const ll INF = 1e18;
const int N = 0;

void solve()
{
    ll n;
    cin >> n;

    cout << n << n << endl;
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

# B - 小红的连通块构造

> 关键词：构造

## 思路

按照最多连通块的方法，把答案构造好，如下：

```c++
101010
010101
101010
010101
101010
010101
101010
```

容易得出 $>21$ 时判无解，剩下的情况计算操作次数为 $21-k$，并把 $1$ 改成 $0$ 即可。

## Code

```c++
// Problem: 小红的连通块构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137665/B
// Time: 2026-07-10 19:53:58
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
    int k;
    cin >> k;

    if (k > 21)
    {
        cout << -1 << endl;
        return;
    }

    vector<string> g = {"101010", "010101", "101010", "010101", "101010", "010101", "101010"};

    int idx = 21 - k;

    for (auto &s: g)
    {
        if (idx == 0)
            goto end;

        for (auto &c: s)
        {
            if (c == '1')
                c = '0', idx--;
            if (idx == 0)
                goto end;
        }
    }

end:
    for (auto s: g)
        cout << s << endl;
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

# C - 小红的基环树

> 关键词：图论

## 思路

基础图论，建无向图并统计出度，出度为 $1$ 的点是环外的点，然后直接在邻接表里找边即可。

## Code

```c++
// Problem: 小红的基环树
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137665/C
// Time: 2026-07-10 20:03:39
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
const int N = 2e5 + 10;

void solve()
{
    int n;
    cin >> n;

    vector<int> outd(n + 1, 0);
    vector<vector<int>> adj(n + 1);

    for (int i = 1; i <= n; i++)
    {
        int u, v;
        cin >> u >> v;

        adj[u].eb(v), adj[v].eb(u);

        outd[u]++, outd[v]++;
    }

    for (int i = 1; i <= n; i++)
    {
        if (outd[i] == 1)
        {
            for (auto v: adj[i])
                cout << v << " " << i << endl;
            return;
        }
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

# D - 小红的计算几何

> 关键词：计算几何

## 思路

有一个边长为 $k$ 的正方形，始终保持边与坐标轴平行。左上角从 $(a,b)$ 移动到 $(c,d)$。求所有移动过程中，正方形覆盖过的区域的面积。

假如只水平或者只竖直移动，扫过的区域即为长方形，对应面积为 $k(k+|\Delta x|)=k^2+k|\Delta x|$，$y$ 轴同理。

正方形从起点移动到终点时，每个点都沿同一个位移向量 $(\Delta x, \Delta y)$ 运动，设移动距离为 $L=\sqrt{\Delta x^2+\Delta y^2}$，与 $x$ 轴夹角为 $\theta$，有 $|\Delta x|=L|\cos\theta|$，$|\Delta y|=L|\sin\theta|$。

**当一个图形沿某个方向移动时，新增面积等于移动距离乘以图形在移动方向垂直方向上的投影宽度。 **

对于边长为 $k$ 且和坐标轴对齐的正方形，它在移动方向垂直方向上的投影宽度是 $k|\sin\theta|+k|\cos\theta|$，移动新增的面积为 $L\cdot k\left(|\sin\theta|+|\cos\theta|\right)$。由于 $L|\sin\theta|=|\Delta y|$，$L|\cos\theta|=|\Delta x|$，新增面积为 $k|\Delta x|+k|\Delta y|$。

答案即为 $k^2+k|\Delta x|+k|\Delta y|$，也就是 $k\left(k+|c-a|+|d-b|\right)$。

> [!NOTE]
>
> 注意用向量的方式来考虑，推公式算答案。对于这道题，答案其实是整数。

## Code

```c++
// Problem: 小红的计算几何
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137665/D
// Time: 2026-07-10 20:10:28
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
    ll k, a, b, c, d;
    cin >> k >> a >> b >> c >> d;

    ll dx = abs(c - a), dy = abs(d - b);

    ll res = k * k + k * dx + k * dy;
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

# E - 小红的不相邻取数

> 关键词：DP

## 思路

传统的打家劫舍问题：[198. 打家劫舍 - 力扣（LeetCode）](https://leetcode.cn/problems/house-robber/description/)

假设前面已经处理完了前面的一部分，定义 $f_0$ 为最后一个位置没有选择时的最大和；$f_1$ 为最后一个位置选择时的最大和。对于接下来一个值为 $x$ 的元素，$g_0=\max (f_0,f_1)$，$g_1=f_0+x$。因为当前如果不选，前一个位置选不选都可以；当前如果选，前一个位置必须不选。

但不能把所有元素展开转移，考虑如何压缩状态。

对于一整段相同的正数，显然在不相邻的前提下尽可能选最多，因此只需要计算不同边界条件下，最多能选多少个位置。设这段正数有 $b$ 个，基于进入前最后一个位置和当前连续段的最后一个位置的选择情况，我们进行分类讨论。

| 进入前最后位置 | 当前段最后位置 | 当前段最多选择数量              | 贡献                                  | 解释                                                         |
| -------------- | -------------- | ------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| 不选           | 不选           | $\lfloor \frac{b}{2} \rfloor$   | $f_0+\lfloor \frac{b}{2} \rfloor x$   | 在前 $b-1$ 个位置中隔一个选一个，最多选 $\lceil \frac{b-1}{2} \rceil$。 |
| 选             | 不选           | $\lfloor \frac{b-1}{2} \rfloor$ | $f_1+\lfloor \frac{b-1}{2} \rfloor x$ | 当前段的第一个位置和最后一个位置都不能选，只能从中间的隔一个选一个。 |
| 不选           | 选             | $\lceil \frac{b}{2} \rceil$     | $f_0+\lceil \frac{b}{2} \rceil x$     | 最优方案是例如 $1,3,5,\dots$，或者根据奇偶性从另一侧开始选。 |
| 选             | 选             | $\lfloor \frac{b}{2} \rfloor$   | $f_1+\lfloor \frac{b}{2} \rfloor x$   | 当前段第一个位置不能选，最后一个位置必须选，当 $b \ge 2$ 时，最多选择 $\lfloor \frac{b}{2} \rfloor$。 |

注意特判 $b=1$ 的情况，如果前一个位置已经被选择，就不能再选择当前唯一的位置。

当某个段满足元素 $x \le 0$，那么最优方案一定不会选择当前段中的任何位置，选择它不会让答案变大，而且还会限制相邻位置不能选择，所以跳过整段。由于这一段至少有一个位置，跳过它之后，当前数组的最后一个位置一定没有选择，即 $g_0=\max(f_0,f_1)$，而最后一个位置被选择的状态不再需要保留，$g_1=-\infin$。也就是说，**不管上一段最后一个位置有没有选择，经过这一整段后，都已经和下一段隔开了。 **

> [!NOTE]
>
> 这种是基于边界情况来进行分类讨论，进而确定转移。

## Code

```c++
// Problem: 小红的不相邻取数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137665/E
// Time: 2026-07-10 23:21:41
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

    vector<ll> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1; i <= n; i++)
        cin >> b[i];

    ll f0 = 0, f1 = -INF;

    for (int i = 1; i <= n; i++)
    {
        ll x = a[i], len = b[i], g0, g1;

        if (x <= 0)
            g0 = max(f0, f1), g1 = -INF;
        else if (len == 1)
            g0 = max(f0, f1), g1 = f0 + x;
        else
        {
            g0 = max(f0 + (len / 2) * x, f1 + (len - 1) / 2 * x);
            g1 = max(f0 + (len + 1) / 2 * x, f1 + (len / 2) * x);
        }

        f0 = g0, f1 = g1;
    }

    cout << max(f0, f1) << endl;
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

