---
title: 2026 牛客多校2
published: 2026-07-22
description: "Nowcoder Multi-University Training Contest 2"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营2](https://ac.nowcoder.com/acm/contest/133877)

# B - Bitwise Maximization

> 关键词：线性基，数学

## 思路

我们需要把所有数分到两个多重集合中，设两个集合的异或和分别为 $X$ 和 $Y$，目标是最大化 $X+Y$。

设整个数组的异或和为 $S=a_1\oplus a_2\oplus\cdots\oplus a_n$。假设我们选择一个子集放进第一个集合，其异或和为 $X$，剩余元素全部放入第二个集合，其异或和为 $Y$。显然有 $X\oplus Y=S$。两边异或 $X$，有 $Y=S\oplus X$。问题转化成：选择一个能够由数组子集异或得到的 $X$，最大化 $X+(S\oplus X)$。

利用加法与异或的恒等式，$X+Y=(X\oplus Y)+2(X\mathbin{\&}Y)$。所以 $X+Y=S+2(X\mathbin{\&}Y)$，我们需要最大化 $X\mathbin{\&}Y$。

单独考虑 $S$ 的某个二进制位。假如 $S$ 的某一位为 $1$，因为 $X\oplus Y=S$，所以 $X$ 和 $Y$ 在这一位上必须不同。所以这一位的贡献固定，无法再优化。若 $S$ 的某一位为 $0$，说明 $X$ 和 $Y$ 在这一位必须相同，如果两者都是 $0$，对答案的贡献为 $0$；如果两者都是 $1$，对答案的贡献为 $2^{i+1}$。所以我们希望**在 $S$ 为 $0$ 的二进制位上，让 $X$ 尽可能大**。

考虑使用线性基。普通线性基会优先让高位变成 $1$，但原数组里面有一些高位可能恰好是 $S_i=1$ 的位，这些位虽然会让数值看起来更大，但对最终答案没有作用。所以对 $S$ 取反再与上原数，这样普通的“最大异或和”查询，才和我们真正想优化的目标一致。

## Code

```c++
// Problem: Bitwise Maximization
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133877/B
// Time: 2026-07-22 22:20:01
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
const int N = 30;

vector<ll> p(N);

void insert(ll x)
{
    for (int i = N - 1; i >= 0; i--)
    {
        if (x >> i & 1)
        {
            if (p[i] == 0)
            {
                p[i] = x;
                return;
            }
            else
                x ^= p[i];
        }
    }
}

ll query()
{
    ll x = 0;
    for (int i = N - 1; i >= 0; i--)
        x = max(x, x ^ p[i]);

    return x;
}

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n);
    ll sum = 0;

    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        sum ^= a[i];
    }

    fill(all(p), 0);
    for (int i = 0; i < n; i++)
        insert(a[i] & ~sum);

    ll mx = query();
    cout << sum + 2 * mx << endl;
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

# G - GCD Graph

> 关键词：最短路，DP

## 思路

题目中从较小整数 $i$ 到较大整数 $j$ 有一条边，边权为 $\gcd(i,j)$，要求计算 $\sum_{i=l}^{r}\operatorname{cost}(i,n)$。其中 $\operatorname{cost}(i,n)$ 是从 $i$ 到 $n$ 的最短路。题目满足 $T\le100$、$n\le10^7$，并且所有询问的 $n$ 之和没有限制，

显然有 $\operatorname{cost}(i,n)=1
\iff
\gcd(i,n)=1$。考虑答案在什么情况下是 $2$。

令 $p$ 是严格小于 $n$ 的最大质数。有 ${
\operatorname{cost}(i,n)=
\begin{cases}
1,&\gcd(i,n)=1\\
2,&\gcd(i,n)>1
\end{cases}
\qquad i<p
}$，这也比较好理解。对于比 $p$ 小的 $i$，总可以先跳到 $p$，然后从 $p$ 跳到 $n$。

考虑如何处理 $p \le i \le n$ 这段的 $i$。这里应用一个质数密度的技巧。在 $n\le10^7$ 的范围内，相邻质数的最大间隔不超过 $154$，所以尾部长度至多约 $154$。这里可以暴力 $DP$。

首先考虑前半段如何快速求和。现在需要计算区间 $[L,R]\subseteq[1,p-1]$ 的答案。设其中与 $n$ 互质的数有 $c$ 个，区间长度为 $len=R-L+1$。其中 $c$ 个数贡献 $1$，剩余 $len-c$ 个数贡献 $2$。所以答案为 $c+2(len-c)$。现在的问题是，**如何快速统计区间 $[L,R]$ 中有多少个数和 $n$ 互质。**



# M - Maybe Connected

> 关键词：签到

## 思路

![](https://img.hailuo4ever.com/nowcoder/summer_2026_2_img1.jpg)

最优的构造方式实际上是一张菊花图。在 $n$ 个点里出一个点当作中心点，往外连即可。

赛时考虑的是链和树，做对了第二种情况，但第一种错了。

## Code

```c++
// Problem: Maybe Connected
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133877/M
// Time: 2026-07-22 12:08:42
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
    ll n, m;
    cin >> n >> m;

    ll cnt = m - n + 1;

    // cout << "cnt = " << cnt << endl;

    if (cnt < 0)
        cout << m * (m - 1) / 2 << endl;
    else
        cout << n * (n - 1) / 2 - m << endl;
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

# N - Narrow to Median

> 关键词：中位数，枚举

## 思路

题目要求从数组中恰好选择 $k$ 个元素，把它们全部替换成这 $k$ 个数的中位数，使最终数组和最大。

首先我们将整个数组升序排序。并且中位数是一个基于数组位置关系的数，根据 $k$ 的奇偶进行分类讨论。

**首先讨论 $k$ 为奇数的情况。**设 $k=2t+1$，那么中位数是第 $t+1$ 个元素。假设我们选择 $a_i$ 作为中位数（中位数的下标需要满足 $t+1\le i\le n-t$），那么还需要选 $t$ 个不大于 $a_i$ 的元素，$t$ 个不小于 $a_i$ 的元素。对于一个左侧元素 $x$，它产生的收益为 $a_i-x$，显然应该让 $x$ 尽可能小。所以左侧选择数组中最小的 $t$ 个元素。对于右侧元素 $y$，操作后会产生 $y-a_i$ 的损失，要让损失尽可能小，就要选择最接近 $a_i$ 的 $t$ 个较大元素。

考虑此时如何计算贡献。设前缀和数组为 $pre$。选中的元素总和为 $pre_t+a_i+pre_{i+t}-pre_i$，操作后这 $k$ 个元素的总和为 $k \times a_i$。最终数组和为 $S-\left(pre_t+a_i+pre_{i+t}-pre_i\right)+k\cdot a_i$。

**讨论 $k$ 为偶数的情况。**设 $k=2t$，中间两个数为 $a_i,a_{i+1}$。和奇数情况同理，我们希望左侧选择最小的 $t-1$ 个数，右侧选择最靠近 $a_{i+1}$ 的 $t-1$ 个数。

考虑此时如何计算贡献。此时选中的元素总和为 $pre_{t-1}+a_i+a_{i+1}+pre_{i+t}-pre_{i+1}$，操作后元素总和为 $t(a_i+a_{i+1})$，所以最终数组和为 $S-\left(pre_{t-1}+a_i+a_{i+1}+pre_{i+t}-pre_{i+1}\right)
+t(a_i+a_{i+1})$。

> [!NOTE]
>
> 由于必须操作一次，即使收益为负也需要操作，所以答案初始化成负无穷。
>
> 枚举所有合法的中位数下标取最大值。奇数情况下，左边和右边必须都有 $t$ 个数。偶数情况下，我们选的这两个数的左侧和右侧必须都有 $t-1$ 个数。

## Code

```c++
// Problem: Narrow to Median
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133877/N
// Time: 2026-07-22 20:40:33
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
    ll n, k;
    cin >> n >> k;

    vector<ll> a(n + 1), pre(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a.begin() + 1, a.end());

    for (int i = 1; i <= n; i++)
        pre[i] = pre[i - 1] + a[i];

    ll sum = pre[n], res = -INF;

    if (k & 1)
    {
        int t = k / 2;

        for (int i = t + 1; i <= n - t; i++)
        {
            ll s = pre[t] + a[i] + (pre[i + t] - pre[i]);
            res = max(res, sum - s + k * a[i]);
        }
    }
    else
    {
        int t = k / 2;

        for (int i = t; i <= n - t; i++)
        {
            ll s = pre[t - 1] + a[i] + a[i + 1] + (pre[i + t] - pre[i + 1]);
            res = max(res, sum - s + t * (a[i] + a[i + 1]));
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



