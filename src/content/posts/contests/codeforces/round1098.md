---
title: cf round 1098
published: 2026-05-16
description: "Codeforces Round 1098 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
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

    此时 $b$ 肯定小于 $a$，$b$ 需要尽可能大，我们就需要用集合里最大的数把 $b$ 填满来使得 $|a - b|$ 最小。

2. $b$ 的长度比 $a$ 长（长度为 $L + 1$）

    此时 $b$ 肯定大于 $a$，$b$ 需要尽可能小，我们就需要用集合里最小的数把 $b$ 填满。注意第一位上的数不能是 $0$。

3. $b$ 的长度和 $a$ 相同（长度为 $L$）

    考虑从左到右逐位对齐前缀。假设我们在构造 $b$ 时，前几位都和 $a$ 完全一样，现在来到了第 $i$ 位，准备从中挑一个数字 $x \in d$ 填入：

    1. $x < a[i]$：一旦这一位填了比 $a[i]$ 小的数，意味着最终构成的 $b$ 必定小于 $a$。为了让差值最小，我们应该让后续所有的数字**尽可能大**，即后面全部填满 $d_{max}$。
    2. $x > a[i]$：一旦这一位填了比 $a[i]$ 大的数，意味着最终构成的 $b$ 必定大于 $a$。为了让差值最小，我们应该让后续所有的数字**尽可能小**，即后面全部填满 $d_{min}$。
    3. $x=a[i]$：继续匹配下一位。

> [!NOTE]
>
> 前缀没办法匹配的时候就要退出了。实际上对于前面的两种情况，我们只是在某个前缀无法匹配的时候检验两个分支。
>
> 大循环 `for (int i = 0; i < L; i++)` 有一个前提，在处理第 $i$ 位时，前面的 $0$ 到 $i-1$ 位已经和目标数字 $a$ 完全一样了。
>
> 在处理第 $i$ 位时，我们需要做两件完全独立的事情：利用当前已经匹配好的“完美前缀” `pref`，尝试在这里产生分歧，并更新给 `update` 结算。再去检查能不能延续完美前缀 `pref`，如果可以就到下一轮，不可以就 `break`。

> [!TIP]
>
> `unsigned long long` 无法表示负数，如果直接写 `val - a`，而恰好 `val < a`，它不会变成负数，而是会下溢变成一个巨大的正数（比如 $1.8 \times 10^{19}$）。因此在计算绝对值的时候我们需要做一个类似“安全取绝对值”的操作，也就是下面的条件表达式：`(a > val) ? (a - val) : (val - a)`。

## Code

```c++
// Problem: CF 2228 C2
// Contest: Codeforces - Codeforces Round 1098 (Div. 2)
// URL: https://codeforces.com/contest/2228/problem/C2
// Time: 2026-05-16 22:57:16
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
    ull a, n;
    cin >> a >> n;

    vector<int> d(n);
    for (ull i = 0; i < n; i++)
        cin >> d[i];

    string s = to_string(a);
    int L = s.size();

    int d_min = d[0], d_max = d[n - 1];

    ull res = ~0ULL;

    // 更新答案
    auto update = [&](ull val) -> void
    {
        ull diff = (a > val) ? (a - val) : (val - a);
        if (diff < res)
            res = diff;
    };

    // 长度为 L - 1，全部用最大数填充的情况
    if (L > 1)
    {
        ull val = 0;
        for (int i = 0; i < L - 1; i++)
            val = val * 10 + d_max;

        update(val);
    }

    // 长度为 L + 1，最小非零数作开头，其余都用最小值的情况
    int nz = -1; // 寻找最小的非零数字
    for (int x: d)
    {
        if (x > 0)
        {
            nz = x;
            break;
        }
    }

    // 存在非零数字时才进入这个逻辑
    if (nz != -1)
    {
        ull val = nz;
        for (int i = 0; i < L; i++) // 要补 L 位，总长 L+1
            val = val * 10 + d_min;

        update(val);
    }

    // 长度为 L，前缀匹配贪心的情况
    ull pref = 0; // 可以完全匹配的部分的前缀值

    for (int i = 0; i < L; i++)
    {
        int cur = s[i] - '0';

        for (int x: d)
        {
            if (x < cur)
            {
                ull val = pref * 10 + x;
                for (int j = 0; j < L - i - 1; j++)
                    val = val * 10 + d_max;

                update(val);
            }
            else if (x > cur)
            {
                ull val = pref * 10 + x;
                for (int j = 0; j < L - i - 1; j++)
                    val = val * 10 + d_min;

                update(val);
            }
        }

        // 检查这一位能否完全匹配
        bool match = false;
        for (int x: d)
        {
            if (x == cur)
            {
                match = true;
                break;
            }
        }

        // 不能匹配就直接退出
        if (!match)
            break;

        // 更新pref
        pref = pref * 10 + cur;

        // 假如走到了最后一位，也要把这个pref给update，此时差值为0
        // 否则就可能不会输出0了，一定要考虑这种情况
        if (i == L - 1)
            update(pref);
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

# D - Sanae, Cross and Color

> 关键词：平面几何，set

## 思路

注意到染色方案只在十字线跨过某个点的时候才会发生改变。如果横坐标 $x$ 只有 $1, 3, 5$，那么 $k_1 = 1$ 和 $k_1 = 2$ 画出的垂直线，对所有点的左右划分是一样的。

因此，我们不需要关心 $k_1, k_2$ 具体是多少，我们只需要关心：

1. 垂直线切在按 $X$ 排序的哪两个相邻的去重坐标之间（定义为 **X-split**）。
2. 水平线切在按 $Y$ 排序的哪两个相邻的去重坐标之间（定义为 **Y-split**）。

假设我们现在选定了一条垂直线，把所有的点严格分成了左半部分和右半部分，此时我们还需要选一条水平线，考察这个水平线满足的条件：

1. **左上角非空**：水平线必须**低于**左半部分最高的点。令 `Lmax = 左半部分最大的 Y 值`，则 $Y_{split} < Lmax$。

2. **左下角非空**：水平线必须**高于**左半部分最低的点。令 `Lmin = 左半部分最小的 Y 值`，则 $Y_{split} \ge Lmin$。

3. **右上角非空**：水平线必须**低于**右半部分最高的点。令 `Rmax = 右半部分最大的 Y 值`，则 $Y_{split} < Rmax$。

4. **右下角非空**：水平线必须**高于**右半部分最低的点。令 `Rmin = 右半部分最小的 Y 值`，则 $Y_{split} \ge Rmin$。

将这四个不等式合并，有 $\max(Lmin, Rmin) \le Y_{split} < \min(Lmax, Rmax)$

只要有 $\max(Lmin, Rmin) < \min(Lmax, Rmax)$，说明在这个垂直线下存在合法的水平线。

考虑如何计算答案，因为 Y-split 本质上是 $Y$ 坐标之间的间隙，所以合法 Y-split 的数量等于区间 $[low, high-1]$ 内存在多少个去重后的不同 Y 坐标。

## Code

```c++
// Problem: CF 2228 D
// Contest: Codeforces - Codeforces Round 1098 (Div. 2)
// URL: https://codeforces.com/problemset/problem/2228/D
// Time: 2026-05-21 00:33:59
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

struct Point
{
    int x, y;
};

void solve()
{
    int n;
    cin >> n;

    vector<Point> p(n);
    vector<int> unique_Y(n);

    for (int i = 0; i < n; i++)
    {
        cin >> p[i].x >> p[i].y;
        unique_Y[i] = p[i].y;
    }

    sort(p.begin(), p.end(), [](const Point &a, const Point &b) { return a.x < b.x; });

    // 离散化
    sort(unique_Y.begin(), unique_Y.end());
    unique_Y.erase(unique(unique_Y.begin(), unique_Y.end()), unique_Y.end());

    // 预处理出前缀（左半部分）和后缀（右半部分）的最值
    vector<int> L_min(n), L_max(n);
    vector<int> R_min(n), R_max(n);

    L_min[0] = p[0].y;
    L_max[0] = p[0].y;

    for (int i = 1; i < n; i++)
    {
        L_min[i] = min(L_min[i - 1], p[i].y);
        L_max[i] = max(L_max[i - 1], p[i].y);
    }

    R_min[n - 1] = p[n - 1].y;
    R_max[n - 1] = p[n - 1].y;

    for (int i = n - 2; i >= 0; i--)
    {
        R_min[i] = min(R_min[i + 1], p[i].y);
        R_max[i] = max(R_max[i + 1], p[i].y);
    }

    ll res = 0;

    // 遍历每一个合法的垂直切割线
    // 切割线在第 i 个点和第 i+1 个点之间
    for (int i = 0; i < n - 1; i++)
    {
        // 如果相邻的两个点 X 坐标相同，说明它们中间不能画线，跳过
        if (p[i].x == p[i + 1].x)
            continue;

        int low = max(L_min[i], R_min[i + 1]);
        int high = min(L_max[i], R_max[i + 1]);

        // 如果区间存在 (low < high)，则统计该区间内有多少个不同的 Y 坐标
        if (low < high)
        {
            auto it1 = lower_bound(unique_Y.begin(), unique_Y.end(), low);
            auto it2 = lower_bound(unique_Y.begin(), unique_Y.end(), high);
            res += (it2 - it1);
        }
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

