---
title: 牛客周赛 Round 143
published: 2026-05-10
description: "Nowcoder Week Contest 143"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 143](https://ac.nowcoder.com/acm/contest/134529)

# A - 小红的区间构造

> 关键词：签到

## Code

```c++
// Problem: 小红的区间构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/A
// Time: 2026-05-10 19:00:07

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
    cout << 1 << " " << n << endl;
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

# B - 小红的冷门副本

> 关键词：思维

## 思路

由于 $m$ 的范围太大，如果开数组一定会超空间，假如开 `map` 正着遍历又会超时间。

我们考虑反着做，统计 $>x$ 的所有副本，用总数减掉即可。

## Code

```c++
// Problem: 小红的冷门副本
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/B
// Time: 2026-05-10 19:01:08
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
    ll n, m, x;
    cin >> n >> m >> x;

    map<ll, int> mp;

    for (int i = 1; i <= n; i++)
    {
        int k;
        cin >> k;
        mp[k]++;
    }

    ll cnt = 0;
    for (auto &[k, v]: mp)
        if (v > x)
            cnt++;

    cout << m - cnt << endl;
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

# C - 小红的因子幂和

> 关键词：数学

## 思路

考虑如何获取所有正因子，实际上直接暴力枚举所有因子，并插入 `set` 里就可以，`set` 同时自动去重并排序。

后面乘的过程同理，但注意快速幂开始一定要将底数 `a` 对 `mod` 取模，否则会溢出。

## Code

```c++
// Problem: 小红的因子幂和
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/C
// Time: 2026-05-10 19:15:54

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
const ll mod = 1e9 + 7;

map<ll, int> mp;

ll qmi(ll a, ll k)
{
    ll res = 1;
    a %= mod;
    while (k)
    {
        if (k & 1)
            res = (res * a) % mod;

        a = (a * a) % mod;
        k >>= 1;
    }
    return res % mod;
}

void solve()
{
    ll x, y;
    cin >> x >> y;

    set<ll> s1, s2;

    for (ll i = 1; i <= x / i; i++)
    {
        if (x % i != 0)
            continue;

        s1.insert(i);
        s1.insert(x / i);
    }

    // cout << s1.size() << endl;

    for (ll i = 1; i <= y / i; i++)
    {
        if (y % i != 0)
            continue;

        s2.insert(i);
        s2.insert(y / i);
    }

    set<ll> f;
    for (auto t1: s1)
        for (auto t2: s2)
            f.insert(t1 * t2);

    ll res = 0;
    for (auto i: f)
        res = (res + qmi(i, i)) % mod;

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

# D - 小红的最佳区间

> 关键词：思维，差分

## 思路

我们需要做一步转化，需要将“给定区间与滑动区间相交”这个条件，转化成计算 `L` 的合法取值范围。

假设我们选择的区间是 $[L, L+k]$，给定的第 $i$ 个区间是 $[l_i, r_i]$。 两个闭区间相交的充要条件是：它们的最大左端点，必须小于等于最小右端点，即 $\max(l_i, L) \le \min(r_i, L+k)$。

把这个不等式拆开，有$L \le r_i$ ，$l_i \le L+k \implies L \ge l_i - k$。

综上，**`L`满足的范围是 $l_i - k \le L \le r_i$。**

现在问题转化为了：已知 $n$ 个新的区间 $[l_i - k, r_i]$，求坐标轴上的哪一个点（即 $L$ 的取值）被覆盖的次数最多。

使用 `map` 对原数组离散化，并作差分即可。

## Code

```c++
// Problem: 小红的最佳区间
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/D
// Time: 2026-05-10 19:59:49
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
    int n, k;
    cin >> n >> k;

    map<ll, int> mp;

    for (int i = 1; i <= n; i++)
    {
        ll l, r;
        cin >> l >> r;

        mp[l - k]++;
        mp[r + 1]--;
    }

    ll res = -1, tmp = 0;

    for (auto &[k, val]: mp)
    {
        tmp += val;
        if (tmp > res)
            res = tmp;
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

# E - 小红的好矩阵

> 关键词：分类讨论，构造

## 思路

首先考虑不可能修改到合法的情况：当 $2 \times n$ 不能被 $3$ 整除时，怎样修改都不合法。

要让一个 $2 \times n$ 的 01 矩阵合法（即所有 0 连通块和 1 连通块的大小都恰好为 3），我们可以从图形拼接的角度来推导其所有合法的形态。实际上可以枚举出 $6$ 种基本的图形块。

L型结构：

- $S_0$ 组（左侧为0，右侧为1）：
    - `A1`: 第一行 `001`，第二行 `011`
    - `B1`: 第一行 `011`，第二行 `001`
- $S_1$ 组（左侧为1，右侧为0）：
    - `A2`: 第一行 `110`，第二行 `100`
    - `B2`: 第一行 `100`，第二行 `110`

横条结构：

- `C1`: 第一行 `000`，第二行 `111`
- `C2`: 第一行 `111`，第二行 `000`

![](https://img.hailuo4ever.com/nowcoder/week_contest_143_img1.png)

> [!NOTE]
>
> 赛时想到了分类讨论，但没有想到按左右侧分0和1讨论，还是思路不够清晰，实际上正常的讨论方式就是这样。

为了让相邻的 $2 \times 3$ 块拼在一起时，边界的连通块不会意外合并导致大小超过 3，只有以下四种**相互独立的拼接模式**是合法的：

模式 1：任意拼接 `A1` 和 `B1`：

由于 `A1` 和 `B1` 的左边界都是 `0/0`，右边界都是 `1/1`。它们拼接时必定是 `1/1` 贴着 `0/0`，0 和 1 不会合并。因此，整个序列的每一个 $2 \times 3$ 块都可以自由且独立地在 `A1` 和 `B1` 中二选一。

模式 2：任意拼接 `A2` 和 `B2`：

同理，左边界 `1/1`，右边界 `0/0`，每一个块都能在 `A2` 和 `B2` 中二选一。

模式 3：交替拼接 `C1, C2, C1, C2...`

因为 `C1` 会在右侧留下 `0/1` 的缺口，如果紧接 `C1`，就会导致 0 连通块合并为 6。因此它必须且只能接上 `C2`（左侧为 `1/0`）。

模式 4：交替拼接 `C2, C1, C2, C1...`

将原矩阵按 $2 \times 3$ 划分为 $k = n/3$ 个子块。 对于第 $i$ 个子块，统计它变成 `A1, B1, A2, B2, C1, C2` 各需要修改多少次字符（即汉明距离）。 然后分别计算将整个矩阵变为以上 4 个模式所需的最小总修改次数，取其中的**最小值**即为答案。

> [!NOTE]
>
> 关键在于拼接的时候，每个联通块不能互相干扰，否则就不满足题目的限制条件。
>
> 这样其实更好做了。

## Code

```c++
// Problem: 小红的好矩阵
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134529/E
// Time: 2026-05-10 20:04:12
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

    string s[2];
    cin >> s[0] >> s[1];

    if (n % 3 != 0)
    {
        cout << "-1" << endl;
        return;
    }

    // 定义六种基本构成单位
    string A1[2] = {"001", "011"};
    string B1[2] = {"011", "001"};

    string A2[2] = {"110", "100"};
    string B2[2] = {"100", "110"};

    string C1[2] = {"000", "111"};
    string C2[2] = {"111", "000"};

    ll k1 = 0, k2 = 0, k3 = 0, k4 = 0;

    for (int i = 0; i < n / 3; i++)
    {
        int a1 = 0, b1 = 0, a2 = 0, b2 = 0, c1 = 0, c2 = 0;

        // 计算当前 2x3 的块变成 6 种基本块分别需要修改多少字符
        for (int r = 0; r < 2; r++)
            for (int c = 0; c < 3; c++)
            {
                char ch = s[r][i * 3 + c];
                if (ch != A1[r][c])
                    a1++;
                if (ch != B1[r][c])
                    b1++;
                if (ch != A2[r][c])
                    a2++;
                if (ch != B2[r][c])
                    b2++;
                if (ch != C1[r][c])
                    c1++;
                if (ch != C2[r][c])
                    c2++;
            }

        // 模式1和模式2是内部独立的，取最优即可
        k1 += min(a1, b1);
        k2 += min(a2, b2);

        // 长条块必须交替拼接
        if (i % 2 == 0)
            k3 += c1, k4 += c2;
        else
            k3 += c2, k4 += c1;
    }

    ll res = min({k1, k2, k3, k4});
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

