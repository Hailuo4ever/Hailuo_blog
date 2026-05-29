---
title: 牛客小白月赛 133
published: 2026-05-29
description: "Nowcoder Rookie Month Contest 133"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客小白月赛 133](https://ac.nowcoder.com/acm/contest/135365)
>

# A - 愿望魔镜：真名的倒影

> 关键词：签到

## Code

```c++
// Problem: 愿望魔镜：真名的倒影
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135365/A
// Time: 2026-05-29 19:14:47
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
    string s;
    cin >> s;

    if (s == "awdec")
    {
        cout << "Fantasy_Blue" << endl;
        return;
    }
    if (s == "Fantasy_Blue")
    {
        cout << "awdec" << endl;
        return;
    }
    cout << "other" << endl;
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

# B - 桃夭：花树的高度博弈

> 关键词：思维

## 思路

先手希望最后排列的最长上升子序列长度尽可能大，后手希望尽可能小，考虑他们的最优策略是什么。

先手的最优策略：每次选择当前最靠左的空位置，放当前最小的剩余高度，他至少能保证结果为 $\lfloor n / 2 \rfloor + 1$；

后手的最优策略：每次选择当前最靠左的空位置，放当前最大的剩余高度，因为他放的是最大剩余高度，所以之后所有树的高度都更小。如果一个排列可以被划分成 $k$ 个下降子序列，那么它的 LIS 长度最多是 $k$。

可以发现上下界均为 $\lfloor n / 2 \rfloor + 1$，即为答案。

## Code

```c++
// Problem: 桃夭：花树的高度博弈
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135365/B
// Time: 2026-05-29 19:16:33
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

    if (n % 2)
        cout << (n + 1) / 2 << endl;
    else
        cout << n / 2 + 1 << endl;
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

# C - 魔法少女：愿望卷轴与真名刻印

> 关键词：模拟，预处理

## 思路

两个目标子串在原串中必须相互独立，互不重叠。我们可以考虑预处理出对于每个索引 $i$，在 $i$ 位置处生成 `Fantasy_Blue` 和 `awdec` 需要多少代价。

然后我们需要找两个不重叠的起点 $i, j$ 来计算答案。如果直接双重循环找两个不重叠的起点 $i$ 和 $j$，时间复杂度是 $O(N^2)$，对于 $N \le 10^5$ 会超时。

我们需要找的是无交集的两段。有两种情况：

- `Fantasy_Blue` 在前，`awdec` 在后。
- `awdec` 在前，`Fantasy_Blue` 在后。

我们可以维护一个**后缀最小值**。比如第一种情况：当我们遍历 `awdec` 的起点 $j$ 时，`Fantasy_Blue` 的合法起点 $i$ 必须满足 $i + 11 < j$。我们只需要在遍历 $j$ 的过程中，动态记录当前所有合法的 $i$ 中，$cost1[i]$ 的最小值即可。将这个最小值加上 $cost2[j]$，就是当前划分下的最小总代价。两种情况取最小值，最后判断是否 $\le k$ 即可。

## Code

```c++
// Problem: 魔法少女：愿望卷轴与真名刻印
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135365/C
// Time: 2026-05-29 19:20:54
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

void debug(auto &f, auto &a)
{
    for (auto &x: f)
        cout << x << " ";
    cout << endl;

    for (auto &x: a)
        cout << x << " ";
    cout << endl;

    cout << endl;
}

void solve()
{
    int n, k;
    cin >> n >> k;

    string s1 = "Fantasy_Blue", s2 = "awdec", s;
    cin >> s;

    int l1 = s1.size(), l2 = s2.size();

    if (l1 + l2 > n)
    {
        cout << "No" << endl;
        return;
    }

    vector<int> f(n + 5, inf), a(n + 5, inf);

    for (int i = 0; i <= n - l1; i++)
    {
        int res = 0;
        for (int j = 0; j < l1; j++)
        {
            if (s[i + j] != s1[j])
                res++;
        }
        f[i] = res;
    }

    for (int i = 0; i <= n - l2; i++)
    {
        int res = 0;
        for (int j = 0; j < l2; j++)
        {
            if (s[i + j] != s2[j])
                res++;
        }
        a[i] = res;
    }

    vector<int> suff(n + 5, inf), sufa(n + 5, inf);
    for (int i = n - l1; i >= 0; i--)
        suff[i] = min(suff[i + 1], f[i]);
    for (int i = n - l2; i >= 0; i--)
        sufa[i] = min(sufa[i + 1], a[i]);

    int res = inf;
    for (int i = 0; i <= n - l1; i++)
        if (i + l1 <= n)
            res = min(res, f[i] + sufa[i + l1]);

    for (int i = 0; i <= n - l2; i++)
        if (i + l2 <= n)
            res = min(res, a[i] + suff[i + l2]);

    cout << (res <= k ? "Yes" : "No") << endl;
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

# D - 魔力共鸣：最小公倍数的融合

> 关键词：数学

## 思路

一次操作会把两个数变成它们的最小公倍数。最终每个元素其实都是原数组某个子集的 $\operatorname{lcm}$，目标是让最终所有元素的 $\gcd\neq 1$。

这意味着：最终所有元素都至少有一个共同质因子 $p$。

假设某个质因子 $p$ 在原数组中出现于 $cnt_p$ 个数里面，也就是说，有 $cnt_p$ 个数能被 $p$ 整除，那么最终最多可以保留 $cnt_p$ 个元素。因为每个最终元素都必须含有质因子 $p$，而一个最终元素的 $\operatorname{lcm}$ 想含有 $p$，它对应的原始集合里必须至少有一个数能被 $p$ 整除。

所以最终最多元素的个数等于所有 $cnt_p$ 可能取值的最大值，最少操作次数为 $n-maxcnt$。

如果所有数都是 $1$，没有质因子，答案就是 $-1$。

## Code

```c++
// Problem: 魔力共鸣：最小公倍数的融合
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/135365/D
// Time: 2026-05-29 19:49:20
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

bool is_prime(int x)
{
    for (int i = 2; i * i <= x; i++)
        if (x % i == 0)
            return false;
    return true;
}

void solve()
{
    int n;
    cin >> n;

    map<int, int> mp;

    auto divide = [&](int x) -> void
    {
        for (int i = 2; i * i <= x; i++)
        {
            if (x % i == 0)
                mp[i]++;
            while (x % i == 0)
                x /= i;
        }
        if (x > 1)
            mp[x]++;
    };

    int res = 0;
    for (int i = 0, x; i < n; i++)
    {
        cin >> x;
        divide(x);
    }
    for (auto &[_, cnt]: mp)
        res = max(res, cnt);

    cout << (res == 0 ? -1 : n - res) << endl;
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

