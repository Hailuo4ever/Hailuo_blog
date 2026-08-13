---
title: 2026 牛客多校8
published: 2026-08-12
description: "Nowcoder Multi-University Training Contest 8"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营8](https://ac.nowcoder.com/acm/contest/133883)

# B - Deep Finesse

> 关键词：DP，抽屉原理

## 思路

题目简述：汐先选择 $n$ 个不同整数作为手牌，剩下所有整数给风子。之后风子每轮先出牌，汐必须出一个不大于风子所出数字的牌，否则直接输。并且要求汐的手牌必须包含给定的 $m$ 个数字。

首先看到数据范围，想到可以 $O(n^2)$，我们考虑 $DP$。

先把汐的手牌排序，我们考虑这副手牌什么时候必胜。考虑第 $i$ 小的手牌 $b_i$，在它前面一共有 $b_i-1$ 个数，是  $1,2,\dots,b_i-1$。因为 $b_i$ 是汐的第 $i$ 小手牌，所以前面的这些数中，恰好有 $i-1$ 个属于汐，剩下属于风子的数字数量就是 $b_i-i$。如果 $b_i \ge 2i$，那么  $b_i-i\ge i$，也就是说风子至少拥有 $i$ 张严格小于 $b_i$ 的牌。**这时，如果风子把这 $i$ 张牌连续打出来，而汐手中严格小于 $b_i$ 的牌只有 $i-1$ 张，所以一定会输**。因此，对于所有的 $i$，都要满足 $b_i \le 2i-1$。

**因为 $b_n\le2n-1$，所以汐的一副必胜手牌中的所有数字都一定位于 $[1,2n-1]$**。这一步可以筛掉一部分。

考虑如何 $DP$。对每一个 $1\le i\le2n$，定义 ${a_i=
\begin{cases}
1,&i\text{ 属于 Ushio}\\
-1,&i\text{ 属于 Fuuko}
\end{cases}}$。因为汐最终选择 $n$ 张牌，因此最后前缀和一定为 $0$。且必胜的充要条件是所有前缀和都非负。一种感性一点的理解是，风子每次打出一张 $-1$，汐都要从左侧找一个 $1$ 来应对。

定义 $dp[i][j]$ 表示当前已经考虑了 $a_1,a_2,\dots,a_i$，并且当前前缀和等于 $j$ 的合法方案数。初始化 $dp[0][0] = 1$。

考虑第 $i$ 个数属于谁，$i$ 属于汐时，那么 $a_i=1$，如果当前的前缀和是 $j$，那么显然前缀和 $+1$ 前是 $j-1$，所以 $dp[i][j]\mathrel{+}=dp[i-1][j-1]$。$i$ 属于风子时，同理有 $dp[i][j]\mathrel{+}=dp[i-1][j+1]$，但如果 $i$ 是必须给汐的牌，就不能转移。

**注意这里实际上是：指定的必须选，没有指定的可选可不选，而不是二选一**。

## Code

```c++
// Problem: Deep Finesse
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133883/B
// Time: 2026-08-12 18:50:16
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
// clang-format on

using ll = long long;
using ld = long double;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll INF = 4e18;
const ll mod = 998244353;

void solve()
{
    int n, m;
    cin >> n >> m;

    bool flag = true;
    vector<bool> st(2 * n + 1, false);
    for (int i = 1, x; i <= m; i++)
    {
        cin >> x;
        if (x > 2 * n)
            flag = false;
        else
            st[x] = true;
    }

    if (!flag)
    {
        cout << 0 << endl;
        return;
    }

    vector<vector<ll>> dp(2 * n + 1, vector<ll>(n + 2, 0));
    dp[0][0] = 1;

    for (int i = 1; i <= 2 * n; i++)
    {
        for (int j = 0; j <= n; j++)
        {
            if (j >= 1)
                dp[i][j] = (dp[i][j] + dp[i - 1][j - 1]) % mod;

            if (!st[i] && j + 1 <= n)
                dp[i][j] = (dp[i][j] + dp[i - 1][j + 1]) % mod;
        }
    }

    cout << dp[2 * n][0] << endl;
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



# G - Multiplication

> 关键词：构造

## 思路

由于输出给的值域非常大，我们直接考虑构造四个非常大的数，让它天然就满足所有 $a,b$ 的前缀限制。

考虑让最终的乘积进位，即 $x_1y_1=999999 \dots$，$x_2y_2=100000\dots$，即可满足要求。

构造这样四个足够长的数即可：`333..33, 300..00, 333...34, 300...01`。

## Code

```c++
// Problem: Multiplication
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133883/G
// Time: 2026-08-12 12:16:51
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
// clang-format on

using ll = long long;
using ld = long double;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 5e5 - 2;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    int a, b, c;
    cin >> a >> b >> c;

    // 333..33, 300..00, 333...34, 300...01

    for (int i = 1; i <= N + 1; i++)
        cout << '3';
    cout << ' ';

    cout << '3';
    for (int i = 2; i <= N + 1; i++)
        cout << '0';
    cout << ' ';

    for (int i = 1; i <= N; i++)
        cout << '3';
    cout << '4';
    cout << ' ';

    cout << '3';
    for (int i = 2; i <= N; i++)
        cout << '0';
    cout << '1';
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

# H - It's Magic, Not a Trick!

> 关键词：贪心

## 思路

一次魔法会让某个元素 $+1$，并让某个至少为 $x$ 的元素 $-x$。因此数组总和每操作一次都会减少 $x-1$。当 $x\ge2$ 时，最小化最后的数组和，等价于最大化成功操作次数。如果最后可以操作 $k$ 次，答案就是 $S-k(x-1)$。

首先要特判 $x=1$ 的情况，答案直接为 $\sum a_i$。

考虑把每个 $a_i$ 拆成两部分，即作带余除法：$a_i=q_i x+r_i$，其中有 $0\le r_i<x$。例如 $a_i=37,\quad x=10$，那么 $q_i=3,\quad r_i=7$。这里的 $q_i$ 表示：这个元素里面本来就有 $q_i$ 个完整的 $x$。所以仅凭初始能量，就可以进行 $p=\sum_i q_i$ 次操作。

容易想到，这 $p$ 次操作产生的 $p$ 个 $+1$ 是可以随便分配的。执行完这 $p$ 次操作后，原来的 $q_ix$ 都被消掉，只剩 $r_1,r_2,\cdots ,r_n$，还有 $p$ 次自由分配的 $+1$。我们考虑如何让操作次数尽可能多。

假设当前元素为 $r_i$，我们想利用它额外做一次操作。注意一次操作的顺序是：先 $+1$，再判断有没有元素到达 $x$，然后 $-x$。所以在操作开始前，我们只需要把当前元素准备到 $x-1$。因此如果 $r_i>0$，那么需要提前投入的 $+1$ 数量（代价）就是 $c_i=(x-1)-r_i$。

我们把所有点按照 $c_i$ 从小到大排序，能操作就操作。假设当前所有余数的优惠机会都处理完了，每多一次操作就需要 $x-1$ 的代价。剩余的预算可以再换 ${\left\lfloor\frac{p}{x-1}\right\rfloor}$ 次操作。

所以：$k=\sum q_i+\text{买到的优惠次数}+\left\lfloor\frac{\text{剩余 }p}{x-1}\right\rfloor$。

## Code

> [!NOTE]
>
> 本题爆 `lon

```c++
// Problem: It's Magic, Not a Trick!
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133883/H
// Time: 2026-08-13 00:57:01
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
// clang-format on

using ll = long long;
using ld = long double;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll INF = 4e18;
const ll mod = 998244353;

void solve()
{
    ll n, x;
    cin >> n >> x;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    i128 s = accumulate(all(a), (i128) 0);

    if (x == 1)
    {
        cout << (ll) (s % mod) << endl;
        return;
    }

    vector<ll> c;

    i128 k = 0;
    for (int i = 1; i <= n; i++)
    {
        k += a[i] / x;

        ll r = a[i] % x;

        if (r)
            c.eb(x - 1 - r);
    }

    sort(all(c));

    i128 cnt = k, op = k;
    for (auto cc: c)
    {
        if (cnt >= cc)
            cnt -= cc, op++;
        else
            break;
    }
    op += cnt / (x - 1);

    i128 res = s - op * (x - 1);
    cout << ll(res % mod) << endl;
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



# I - Bridge VI

> 关键词：贪心，分类讨论

## 思路

按最好和最差的最终排名比较好理解。

最好的排名意味着大豆的分数要尽可能高，我们把 $m$ 全加到 $a[1]$ 上，然后对于后面的每场比赛独立贪心，要求超过 $x=a[1]+m$ 的人尽可能少。设左边的人是 $u$，右边的人是 $v$，不难发现，如果一场比赛一开始双方原本就超过了 $x$，贡献显然是 $2$，我们考虑能不能让两个人都不超过 $x$，注意到不管怎么加，$u+v+m$ 的和始终是不变的，因此如果满足 ${u\le x,\quad v\le x,\quad u+v+m\le2x}$，这组的贡献就是 $0$，否则就是 $1$。

最差的排名意味着大豆的分数要尽可能少，我们把 $m$ 全加到 $a[2]$ 上。要求超过 $x=a[1]$ 的人尽可能多。考虑能不能让两个人都严格超过 $x$，首先每一个人都要有超过 $x$ 的可能性，然后总和要严格大于 $2x$，因此满足 ${u+m>X,\quad v+m>X,\quad u+v+m>2X}$ 时贡献为 $2$，否则如果有一个可以超过 $x$，贡献为 $1$。其他情况为 $0$。

## Code

```c++
// Problem: Bridge VI
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133883/I
// Time: 2026-08-12 16:26:26
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
// clang-format on

using ll = long long;
using ld = long double;
using ull = unsigned long long;
using pii = pair<int, int>;
using pdd = pair<double, double>;
using pll = pair<long long, long long>;
using i128 = __int128;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<ll> a(2 * n + 1);
    for (int i = 1; i <= 2 * n; i++)
        cin >> a[i];

    ll res1 = 0, res2 = 0;

    ll x = a[1] + m;
    if (a[2] > x)
        res1++;

    for (int i = 3; i <= 2 * n; i += 2)
    {
        ll u = a[i], v = a[i + 1];
        if (u > x && v > x)
            res1 += 2;
        else if (u <= x && v <= x && u + v + m <= 2 * x)
            ;
        else
            res1++;
    }

    x = a[1];
    if (a[2] + m > x)
        res2++;

    for (int i = 3; i <= 2 * n; i += 2)
    {
        ll u = a[i], v = a[i + 1];
        if (u + m > x && v + m > x && u + v + m > 2 * x)
            res2 += 2;
        else if (u + m > x || v + m > x)
            res2++;
    }

    cout << res1 << ' ' << res2 << endl;
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

