---
title: 牛客周赛 Round 146
published: 2026-05-31
description: "Nowcoder Week Contest 146"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 146](https://ac.nowcoder.com/acm/contest/135882)

# A - 小红买橘子

> 关键词：签到

## Code

```c++
// Problem: 小红买橘子
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/A
// Time: 2026-05-31 19:14:21
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
    int x, y, z;
    cin >> x >> y >> z;

    cout << x * ceil((double) z / y) << endl;
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

# B - 小红的传送阵

> 关键词：模拟

## 思路

传送门是单向的，因此想要使用传送门必须从原点走到左端点，再通过右端点后走到终点，答案为 $abs(r - k) + abs(l)$，枚举每一个传送门进行计算即可。注意可以选择不走任何一个传送门，因此答案初始化成 $abs(k)$。

## Code

```c++
// Problem: 小红的传送阵
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/B
// Time: 2026-05-31 19:16:53
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
    ll n, k;
    cin >> n >> k;

    ll res = abs(k);
    for (ll i = 1, l, r; i <= n; i++)
    {
        cin >> l >> r;
        res = min(res, abs(r - k) + abs(l));
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

# C - 小红的好三角形

> 关键词：模拟，STL

## 思路

选取平行于坐标轴的两个点后，注意到等腰三角形的第三个端点始终在中垂线上，而因为坐标全为整数，所以需要平行于坐标轴的两个坐标的中点为整数值。

因此对于每一个给定点 $(a, b)$，我们记录每个 $x$ 坐标和 $y$ 坐标的出现次数方便统计，由于可能存在共线的情况，需要使用一个集合来统计全部点，并特判是否有重合的情况。

## Code

```c++
// Problem: 小红的好三角形
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/C
// Time: 2026-05-31 19:25:00
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
const int N = 3010;

void solve()
{
    int n;
    cin >> n;

    vector<pii> p(n);

    unordered_map<ll, ll> x, y;
    set<pii> s;

    for (auto &[a, b]: p)
    {
        cin >> a >> b;

        x[a]++;
        y[b]++;
        s.insert({a, b});
    }

    ll res = 0;
    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            auto &[x1, y1] = p[i];
            auto &[x2, y2] = p[j];

            if (y1 == y2 && (x1 + x2) % 2 == 0)
            {
                ll mid = (x1 + x2) / 2;
                res += x[mid];

                if (s.count({mid, y1}))
                    res--;
            }

            if (x1 == x2 && (y1 + y2) % 2 == 0)
            {
                ll mid = (y1 + y2) / 2;
                res += y[mid];

                if (s.count({x1, mid}))
                    res--;
            }
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

# D - 小红的子序列计数

> 关键词：线性DP

## 思路

考虑DP，设 $dp[i][j]$ 表示：从字符串前 $i$ 个字符中选出一个非空子序列，组成的数字对 $6$ 取模后余数为 $j$ 的方案数。

对于新来的一个字符，我们有三种情况：

1. 它自己单独作为一个子序列，答案 $+1$
2. 不选择当前字符：$dp[i][j] += dp[i - 1][j]$
3. 将当前字符追加到上一个子序列的末尾：$dp[i][nxt] += dp[i - 1][j], nxt = (j * 10 + idx) % 6$

> [!NOTE]
>
> 末尾追加数字的模数转移（常用于子序列计数、数位DP、整除性统计）：
>
> 若当前数字为 $x$，且 $x \bmod m=r$，在十进制数 $x$ 的末尾追加数字 $d$ 后，新数字为：$x' = 10 \cdot x + d$。
>
> 因此新余数为 $r' = (10 \cdot r + d) \bmod m$，更一般地，在 $B$ 进制下有 $r' = (B \cdot r + d) \bmod m$。
>
> 一般使用这个方法时，对后续转移而言，相同余数的数字是等价的。

## Code

```c++
// Problem: 小红的子序列计数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/D
// Time: 2026-05-31 19:47:15
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
const int N = 200010;
const int mod = 998244353;

int dp[N][6];

void solve()
{
    int n;
    cin >> n;

    string s;
    cin >> s;

    for (int i = 1; i <= n; i++)
    {
        int idx = s[i - 1] - '0';
        for (int j = 0; j < 6; j++)
        {
            dp[i][j] = (dp[i - 1][j] + dp[i][j]) % mod;

            dp[i][(j * 10 + idx) % 6] = (dp[i - 1][j] + dp[i][(j * 10 + idx) % 6]) % mod;
        }
        dp[i][idx % 6] = (dp[i][idx % 6] + 1) % mod;
    }
    cout << dp[n][0] << endl;
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

# E - 小红的博弈

> 关键词：博弈论

## 思路

题目约定小红为先手，小芳为后手。

小红无论如何操作，小芳都可以通过进行镜像操作来压缩先手的操作空间。

基于镜像的思路，考虑将相同大小的石子堆两两配对。

考虑 $1,1,3,3,3,3,7,7$，小芳一定可以通过使用镜像策略模仿来获胜，可以证明小芳一定可以成功模仿。

假如有不能两两匹配的石子，小红就可以直接拿那个奇数的，然后转换角色，开始模仿小芳。最终小红会获胜。

## Code

```c++
// Problem: 小红的博弈
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/E
// Time: 2026-05-31 19:49:26
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

    map<ll, ll> mp;
    for (ll i = 0, x; i < n; i++)
    {
        cin >> x;
        mp[x]++;
    }

    bool flag = false;
    for (auto it = mp.rbegin(); it != mp.rend(); ++it)
    {
        auto &[x, y] = *it;
        if (y % 2 == 1)
        {
            flag = true;
            break;
        }
    }
    cout << (flag ? "red" : "fang") << endl;
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

# F - 小红打牌

> 关键词：状态压缩，贪心，分类讨论

## 思路

由于两种操作会竞争同一批牌，也就是说某次出顺子可能破坏掉多个三张相同的组合，因此局部的贪心是不正确的。

注意题目的数据范围：牌的点数只有 $1-13$，且顺子的起点只有 $1-11$，这意味着我们可以进行小规模的状态枚举。

考虑从 $x$ 开始的顺子 $x+1,x+2,x+3$，如果连续三次打出完全相同的顺子，这批牌也可以变成打出三个对子，两种方案使用的牌完全相同，但一个获得 $3a$，一个获得 $3b$。

考虑从这一点入手，我们设 $s_x$ 表示起点为 $x$ 的顺子使用了多少次，例如 $s[4] = 8$ 表示顺子 $4,5,6$ 被使用了 $8$ 次。

将其拆分为：$s_x=3q_x+r_x$，其中 $r_x\in\{0,1,2\}$。$r_x$ 表示无法再按三组打包的顺子，$q_x$ 表示可以整体处理的顺子块。实际上只需要枚举余数 $r_x$，每个起点只有三种余数：$0,1,2$，因此总枚举数量为 $3^{11}=177147$。

假设已经枚举出所有：$r_1,r_2,\dots,r_{11}$，对于某个点数 $v$，它会被以下三种顺子消耗：

- 起点为 $v$ 的顺子；
- 起点为 $v-1$ 的顺子；
- 起点为 $v-2$ 的顺子。

因此，点数 $v$ 被零散顺子消耗的数量为：$r_v+r_{v-1}+r_{v-2}$，越界位置视为 $0$。

设原本点数 $v$ 有：$cnt_v$ 张牌，则剩余数量为：$left_v=cnt_v-r_v-r_{v-1}-r_{v-2}$

如果：$left_v<0$，说明当前枚举方案不合法。

考虑对 $a,b$ 进行分类讨论：

当 $a \ge b$ 时，对于任意起点，如果至少存在三组相同顺子，都可以被替换成三个对子，不会更劣。因此一定存在一种最优方案，使得 $s_x \le 2$，只需要枚举 $r_x\in\{0,1,2\}$，枚举完零散顺子后，剩下的尽可能组成对子即可。

当 $b>a$ 时，顺子比对子收益更高，但由于零散顺子之间存在冲突，依然考虑枚举余数，然后处理剩余牌中的“三张一组”，定义 $\text{group}_v = \left\lfloor 3 \cdot \text{left}_v \right\rfloor$，可以理解成点数 $v$ 还剩多少完整的三张牌资源包，默认情况下每一个资源包都可以打出一个对子，获得 $a$ 分。由于 $b>a$，三组相同牌可以改成三次顺子，额外获得 $3(b-a)$ 的收益。此时在剩余的“三张相同牌块”上，从左到右贪心合成连续三段即可。因为处理到位置 i*i* 后，包含 i*i* 的后续顺子只可能从 i*i* 开始，所以能合成多少就合成多少是最优的。

## Code

```c++
// Problem: 小红打牌
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135882/F
// Time: 2026-06-02 17:22:49
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define int long long
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
    int n, a, b;
    cin >> n >> a >> b;

    array<int, 13> cnt{};
    for (int i = 0, x; i < n; i++)
    {
        cin >> x;
        cnt[x - 1]++;
    }

    int lim = 1;
    for (int i = 0; i < 11; ++i)
        lim *= 3;

    int res = 0;
    for (int mask = 0; mask < lim; ++mask)
    {
        int t = mask;
        array<int, 13> used{}, block{};
        int cur = 0;

        for (int i = 0; i < 11; i++)
        {
            int r = t % 3;
            t /= 3;
            cur += r * b;
            used[i] += r;
            used[i + 1] += r;
            used[i + 2] += r;
        }

        bool ok = true;
        for (int i = 0; i < 13; ++i)
        {
            if (used[i] > cnt[i])
            {
                ok = false;
                break;
            }
            block[i] = (cnt[i] - used[i]) / 3;
            cur += block[i] * a;
        }
        if (!ok)
            continue;

        if (b > a)
        {
            int res = 0;
            for (int i = 0; i < 11; ++i)
            {
                int t = min({block[i], block[i + 1], block[i + 2]});
                res += t;
                block[i] -= t;
                block[i + 1] -= t;
                block[i + 2] -= t;
            }
            cur += 3 * (b - a) * res;
        }

        res = max(res, cur);
    }

    cout << res << endl;
}

signed main()
{
    fastio();

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

