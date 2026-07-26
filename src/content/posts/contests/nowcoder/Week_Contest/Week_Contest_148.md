---
title: 牛客周赛 Round 148
published: 2026-06-14
description: "Nowcoder Week Contest 148"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 148](https://ac.nowcoder.com/acm/contest/136707)

# A - 小红的追及问题

> 关键词：签到

## Code

```c++
// Problem: 小红的追及问题
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136707/A
// Time: 2026-06-14 19:00:03
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
    int a, b, c;
    cin >> a >> b >> c;
    cout << abs(a - b) << endl;
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

# B - 小红的好数

> 关键词：模拟

## 思路

考虑枚举 $n$ 的因子，由于题目要求找到满足 $p \times p \times q$ 的两个数，可以减少枚举次数，枚举到 $\sqrt[3]{n}$ 即可。

## Code

```c++
// Problem: 小红的好数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136707/B
// Time: 2026-06-14 19:02:12
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
    ll n;
    cin >> n;

    for (ll i = 2; i <= n / i / i; i++)
    {
        if (n % i == 0)
        {
            if (n % (i * i) == 0)
            {
                ll p = i, q = n / (i * i);
                cout << p << " " << q << endl;
                return;
            }
            else
            {
                ll p = sqrtl(n / i), q = i;
                cout << p << " " << q << endl;
                return;
            }
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

# C - 小红的小苯

> 关键词：模拟，推公式

## 思路

需要对题目做一步转化。相比于模拟小苯数量，我们考虑统计最终有多少个坐标被覆盖。

首先考虑将坐标数组排序。由于第一秒，最小的坐标一定会被清除，所以这个点没机会分裂，直接消失。

对于 $a_2,a_3,\dots,a_n$，每个点经过 $k$ 秒分裂后，理论上会形成一个区间：$[a_i, a_i+k]$。

例如 $a_i=10,k=3$，它会覆盖：$10,11,12,13$，区间长度是：$k+1$。

但是每一秒小红都会删掉当前最小坐标。第一秒删的是 $a_1$，之后还会删掉 $k-1$ 个坐标。

最终答案可以理解为：$\left|\bigcup_{i=2}^{n}[a_i,a_i+k]\right|-(k-1)$

进一步化简后可以得到：$ans=n+\sum_{i=3}^{n}\min(k,a_i-a_{i-1}-1)$

## Code

```c++
// Problem: 小红的小苯
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136707/C
// Time: 2026-06-14 19:19:38
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

    vector<ll> a(n);
    for (auto &x: a)
        cin >> x;

    sort(all(a));

    if (k == 0)
    {
        cout << n << endl;
        return;
    }

    if (n == 1)
    {
        cout << 0 << endl;
        return;
    }

    ll res = 0;
    for (int i = 2; i < n; i++)
        res += min(k, a[i] - a[i - 1] - 1);

    // res += (a[1] == a[0] + 1 ? 1 : 0);
    res += n;

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

# D - 小红的最小路径

> 关键词：构造，xor，最小瓶颈路

最小瓶颈路的参考资料：[最小生成树 - OI Wiki](https://oi-wiki.org/graph/mst/#最小瓶颈路)

## 思路

题目要找一条从 $l$ 到 $r$ 的路径，使得相邻两个点的异或值的最大值尽可能小。

可以证明最优答案是 $2^p$，其中 $p$ 是 $l$ 和 $r$ 的最高不同位。

> 证明过程如下图：
>
> ![](https://img.hailuo4ever.com/nowcoder/week_contest_148_img1.png)

我们想从 $l$ 走到 $r$，其实就是在反转 $l$ 的二进制位，直到和 $r$ 完全相同。但题目要求输出的节点编号是正整数，不能输出 $0$，所以不能从低位开始翻，而是从高位。

## Code

```c++
// Problem: 小红的最小路径
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136707/D
// Time: 2026-06-14 19:27:10
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

void check(ll l, ll r)
{
    vector<ull> res;
    bitset<64> bits1(l), bits2(r);

    // cout << bits1 << bits1[0] << endl;
    int t = 0;
    for (int i = 63; i >= 0; i--)
    {
        if (bits1[i] != bits2[i])
        {
            t = i;
            break;
        }
    }

    for (int i = t; i >= 0; i--)
    {
        ull tmp = bits1.to_ullong();

        if (bits1[i] == bits2[i])
            continue;
        res.push_back(tmp);
        bits1.flip(i);
    }

    res.push_back(r);

    cout << res.size() << endl;
    for (auto i: res)
        cout << i << " ";
}

void solve()
{
    ll l, r;
    cin >> l >> r;

    check(l, r);
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

# E - 小芳的数组操作

> 关键词：数位分拆

## 思路

操作是：$a_i \gets a_i \operatorname{xor} 2^k$，$a_{(i+1)\bmod n} \gets a_{(i+1)\bmod n} \operatorname{xor} 2^k$

也就是说，每次操作只影响某一个二进制位 $k$，并且同时翻转环上相邻两个位置的这一位。

所以这题可以拆成 $30$ 个独立问题：对于每一位，给定一个 $0/1$ 环形数组，每次可以选择一条边，把边两端的点同时翻转，问能不能全变成 $0$，最少翻多少条边。最后答案就是所有二进制位答案之和。

对某一个二进制位来说，每次操作都会同时翻转两个位置，所以这一位上 $1$ 的个数奇偶性不会改变。所以每一位上的 $1$ 必须是偶数，等价于所有数的异或和为 $0$。

接下来我们固定某一位，求最少操作次数。把第 $k$ 位拿出来，记为：$b_i \in \{0,1\}$，如果 $a_i$ 的第 $k$ 位是 $1$，则 $b_i=1$，否则 $b_i=0$。

环上一共 $n$ 条边，定义：$x_i =
\begin{cases}
1, & \text{第 } i \text{ 条边操作一次} \\
0, & \text{第 } i \text{ 条边不操作}
\end{cases}$

其中第 $i$ 条边连接：$i \quad \text{和} \quad (i+1)\bmod n$

对于点 $i$，它会受到两条边影响：

- 左边的边 $x_{i-1}$
- 右边的边 $x_i$

所以最终第 $i$ 位变成：$b_i \operatorname{xor} x_{i-1} \operatorname{xor} x_i$，我们希望它等于 $0$，所以：$x_{i-1} \operatorname{xor} x_i = b_i$。这就是一个环上的异或方程组。

而方案是可以通过递推确定的，见下

![image-20260614215948783](https://img.hailuo4ever.com/nowcoder/week_contest_148_img2.png)

## Code

```c++
// Problem: 小芳的数组操作
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136707/E
// Time: 2026-06-14 19:30:45
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

    vector<int> a(n);

    int xr = 0;
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        xr ^= a[i];
    }

    if (xr != 0)
    {
        cout << -1 << endl;
        return;
    }

    int ans = 0;

    for (int bit = 0; bit < 30; bit++)
    {
        int cnt = 0;
        int cur = 0;

        // 假设最后一条边 x_{n-1} = 0
        for (int i = 0; i < n - 1; i++)
        {
            int b = (a[i] >> bit) & 1;
            cur ^= b;

            // cur 表示当前边 x_i 是否需要操作
            cnt += cur;
        }

        ans += min(cnt, n - cnt);
    }

    cout << ans << endl;
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

