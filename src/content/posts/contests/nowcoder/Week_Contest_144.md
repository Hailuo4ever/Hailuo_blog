---
title: 牛客周赛 Round 144
published: 2026-05-17
description: "Nowcoder Week Contest 144"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 144](https://ac.nowcoder.com/acm/contest/134957)

# A - 我是谁？

> 关键词：签到

## 思路

统计四个字母出现次数，判断是否一致即可。

## Code

```c++
// Problem: 我是谁？
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134957/A
// Time: 2026-05-17 19:00:06
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

int a, b, cc, d;

void solve()
{
    int n;
    string s;
    cin >> n >> s;

    for (auto c: s)
    {
        if (c == 'A')
            a++;
        else if (c == 'B')
            b++;
        else if (c == 'C')
            cc++;
        else
            d++;
    }

    int ave = (a + b + cc + d) / 4;
    if (a == ave && b == ave && cc == ave && d == ave)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
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

# B - 我是清楚姐姐

> 关键词：构造

## 思路

显然只有 $1, 2, 3$ 可以构造出来合法的矩阵。

## Code

```c++
// Problem: 我是清楚姐姐
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134957/B
// Time: 2026-05-17 19:03:22
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

    if (n == 2)
    {
        cout << 1 << " " << 2 << endl;
        cout << 3 << " " << 4 << endl;
        return;
    }

    if (n == 1)
    {
        cout << 1 << endl;
        return;
    }

    if (n == 3)
    {
        cout << 1 << " " << 2 << " " << 3 << endl;
        cout << 5 << " " << 4 << " " << 6 << endl;
        cout << 7 << " " << 8 << " " << 9 << endl;
        return;
    }

    cout << -1 << endl;
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

# C - 其实我是小苯

> 关键词：构造

## 思路

由于给定长度过大，我们考虑直接构造字符串。

当 $n = m$ 时（两数长度相同）

- 最小值：因为长度相同，我们完全可以让 $a = b$，这样 $|a - b|$ 的最小值为 **`0`**。
- 最大值：我们要让其中一个数尽可能大，另一个尽可能小。
    - 最大数是 $n$ 个 9：`99...99`
    - 最小数是 1 后面跟 $n-1$ 个 0：`10...00`
    - 两者相减：$99\dots9 - 10\dots0 = \mathbf{89\dots9}$（即 1 个 `8` 后面跟着 $n-1$ 个 `9`）。

当 $n > m$ 时（两数长度不同）

此时必然有 $a > b$，所以 $|a - b| = a - b$。

- 最小值：我们要让 $a$ 尽可能小，$b$ 尽可能大。
    - 最小的 $a = 10^{n-1}$（1 后面 $n-1$ 个 0）
    - 最大的 $b = 10^m - 1$（$m$ 个 9）
    - 两者相减：$10^{n-1} - 10^m + 1$。
    - 如何化为字符串？
        - 如果 $n = m + 1$（例如 $n=3, m=2$），$100 - 99 = \mathbf{1}$。
        - 如果 $n > m + 1$（例如 $n=5, m=2$），$10000 - 99 = \mathbf{9901}$。
        - 规律：连续 **$n - m - 1$** 个 `9`，然后 **$m - 1$** 个 `0`，最后 `1`。
- 最大值：我们要让 $a$ 尽可能大，$b$ 尽可能小。
    - 最大的 $a = 10^n - 1$（$n$ 个 9）
    - 最小的 $b = 10^{m-1}$（1 后面 $m-1$ 个 0）
    - 两者相减：$10^n - 10^{m-1} - 1$。
    - 例如 $n=4, m=2$ 时：$9999 - 10 = \mathbf{9989}$。
    - 规律： **$n - m$** 个 `9`，然后 1 个 `8`，最后 **$m - 1$** 个 `9`。

## Code

```c++
// Problem: 其实我是小苯
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134957/C
// Time: 2026-05-17 19:09:59
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
    int n, m;
    cin >> n >> m;

    if (n > m)
        swap(n, m);

    string mn = "";

    if (n == m)
        mn = "0";
    else if (m == n + 1)
        mn = "1";
    else
        mn = string(m - n - 1, '9') + string(n - 1, '0') + "1";

    string mx = string(m - n, '9') + "8" + string(n - 1, '9');

    cout << mn << " " << mx << endl;
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

# D - 骗你的，我是小红

> 关键词：位运算，组合数学

## 思路

题目要求找满足 $i \operatorname{xor} j$ 是 $k$ 的倍数的数对 $(i, j)$。如果一个数 $X$ 是 $k$ 的倍数，意味着在二进制表示下，$X$ 的最低 $p$ 位必须全是 0。

**而一个数的最低 $p$ 位，在数学上是这个数对 $2^p$ 取模的余数（也就是对 $k$ 取模的余数）。**

原问题就可以转化为：在区间 $[l, r]$ 内，有多少对 $(i, j)$ 满足它们除以 $k$ 的余数相同？

也就是说，我们需要统计区间 $[l, r]$ 内，模 $k$ 余数为 $0, 1, 2, \dots, k-1$ 的数字分别有多少个。假设余数为 $m$ 的数字有 $C_m$ 个，那么从这些数字中任选 2 个组成对的方案数就是 $\frac{C_m \times (C_m - 1)}{2}$。把所有余数的方案数加起来就是最终答案。

我们可以用**整除分块**的思想直接 $O(1)$ 算出来：

1. 区间 $[l, r]$ 的总长度是 $len = r - l + 1$。
2. 每连续的 $k$ 个数，必然完美地覆盖了模 $k$ 的所有余数（$0$ 到 $k-1$ 各出现一次）。
3. 整个区间可以分为 `len / k` 个完整的块，以及末尾剩下的一小截，长度为 `len % k`。
4. 这意味着：
    - 有 `len % k` 种余数，它们多出现了一次，总共出现了 `len / k + 1` 次。
    - 剩下的 `k - len % k` 种余数，出现了 `len / k` 次。

## Code

```c++
// Problem: 骗你的，其实我是小红
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134957/D
// Time: 2026-05-17 19:24:28
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
    ll l, r, k;
    cin >> l >> r >> k;

    ll len = r - l + 1;
    ll cnt = len / k;
    ll rem = len % k;

    cout << (k - rem) * (cnt * (cnt - 1) / 2) + rem * (cnt * (cnt + 1) / 2) << endl;
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

# E - 好吧，我是Bingbong

> 关键词：DFS

## 思路

注水的过程本质上是一个由管道高度决定的 `DFS` 顺序，对于同一个瓶子的所有子树，管道位置越低，越先被完全灌满。一个节点 $u$ 的瓶子达到满水时，$u$ 的整棵子树也已经全部注满。

$$Ans[i] = \text{sum\_subtree}[i] + \text{dist}[i]$$

- **$\text{sum\_subtree}[i]$**：表示以 $i$ 为根的整棵子树，全部注满水所需要的总水量。
- **$\text{dist}[i]$**：表示为了让水能够刚好流到节点 $i$ 的“入水口”，它的所有祖先节点以及旁支子树所截留的**总历史耗水**。

>对于 `dist[i]`，可以这样理解：因为水必须填满这个节点的父亲节点，才可能流下来到子节点，因此这些被提前消耗的水对于节点 $i$ 来说就是外部的。

## Code

```c++
// Problem: 好吧，我是Bingbong
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134957/E
// Time: 2026-05-17 20:35:50
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

    vector<ll> h(n + 1), f(n + 1), w(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> h[i];

    for (int i = 2; i <= n; i++)
        cin >> f[i];

    vector<vector<pll>> g(n + 1);

    for (int i = 2; i <= n; i++)
    {
        cin >> w[i];
        g[f[i]].push_back({w[i], i}); // 管道高度-子节点编号
    }

    vector<ll> sum(n + 1), pre(n + 1), res(n + 1);

    // 计算节点u及其整棵子树，如果全部注满水需要多少水量
    auto dfs1 = [&](auto &&self, int u) -> void
    {
        sum[u] = h[u];
        for (auto [ht, v]: g[u])
        {
            self(self, v);
            sum[u] += sum[v];
        }
    };

    dfs1(dfs1, 1);

    // 代表水位上升，水一定会先流进位置低的管道
    for (int i = 1; i <= n; i++)
        sort(all(g[i]));

    auto dfs2 = [&](auto &&self, int u) -> void
    {
        res[u] = pre[u] + sum[u];

        ll cur = 0;
        // cur表示当前水位下，所有旁支子树的总容量
        for (auto [ht, v]: g[u])
        {
            // 算 v 的截留代价 = 祖先截留(pre[u]) + 自身高度(ht) + 比它低的旁支容量(cur)
            pre[v] = pre[u] + ht + cur;

            // 算完v以后需要把v的整棵子树容量加入cur，因为对于下一个更高的管子来说，v必须要被填满
            cur += sum[v];
            self(self, v);
        }
    };

    dfs2(dfs2, 1);

    for (int i = 1; i <= n; i++)
        cout << res[i] << " ";
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

