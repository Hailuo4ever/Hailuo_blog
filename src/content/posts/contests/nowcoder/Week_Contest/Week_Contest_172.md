---
title: 牛客周赛 Round 172
published: 2026-11-24
description: "Nowcoder Week Contest 172"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: true
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 172内测](https://ac.nowcoder.com/acm/contest/144371#question)

# A - qc的等比数列

> 关键词：签到，枚举

## 思路

注意到这个 $x$ 的范围不是特别大，因此枚举是可以承受的。

## Code

```c++
// Problem: qc的等比数列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/144371/A
// Time: 2026-11-20 14:11:58
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int a, b;
    cin >> a >> b;

    int res = 0;
    for (int x = 1; x <= 2 * max(a, b); x++)
    {
        if (max(x, a) % min(x, a) == 0 and max(x, a) / min(x, a) == 2 and max(x, b) % min(x, b) == 0 and max(x, b) / min(x, b) == 2)
            res++;
    }

    cout << res << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# B - qc的乘号

> 关键词：模拟

## Code

```c++
// Problem: qc的乘号
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/144371/B
// Time: 2026-11-20 14:15:43
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    string s;
    cin >> s;

    int b = s.back() - '0';

    int res = 0;
    for (int i = 0; i < s.size() - 1; i++)
    {
        int a = s[i] - '0';
        if (a & 1 and b & 1)
            res++;
    }

    cout << res << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# C - qc的矩阵

> 关键词：分类讨论

## 思路

首先处理出原来矩阵每行每列的信息，我们设有 $x$ 行的 $1$ 的个数是奇数，$y$ 列的个数是奇数。然后我们开始分类讨论。

当 $x=2$ 且 $y=2$ 时，我们可以选 $(x1,y1),(x2,y2)$ 或者 $(x1,y2),(x2, y1)$ 来交换，一共有两种方案。

当 $x=2$ 且 $y=0$ 时，说明我们只需要交换这两行上任意的同列元素即可，一共有 $m$ 种交换方案。

当 $x=0$ 且 $y=2$ 时，说明我们需要交换这两列上的任意同行元素，一共有 $n$ 种交换方案。

其余情况无解。

## Code

```c++
// Problem: qc的矩阵
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/144371/C
// Time: 2026-11-20 14:28:21
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<vector<char>> g(n + 1, vector<char>(m + 1));
    vector<int> row(n + 1), col(m + 1);

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> g[i][j], row[i] += (g[i][j] == '1'), col[j] += (g[i][j] == '1');

    vector<int> r, c;
    for (int i = 1; i <= n; i++)
    {
        if (row[i] & 1)
            r.eb(i);
    }

    for (int i = 1; i <= m; i++)
    {
        if (col[i] & 1)
            c.eb(i);
    }

    int x = r.size(), y = c.size();
    if (x == 2 && y == 2)
        cout << 2 << endl;
    else if (x == 2 && y == 0)
        cout << m << endl;
    else if (x == 0 && y == 2)
        cout << n << endl;
    else
        cout << 0 << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# D - qc的字符串

> 关键词：DP

## 思路

观察数据范围，我们考虑一种 $O(n^2)$ 的做法。

定义 $dp[i]$ 表示前 $i$ 个字符的最多划分数。转移为 $dp[i]=\max_{\substack{1\le j\le i\\s[j\ldots i]\text{ 合法}}}(dp[j-1]+1)$。

考虑如何判断某个区间是合法的，可以直接处理出 $26$ 个字母的前缀信息，每次前缀和一下即可。时间复杂度 $O(26n^2)$。

## Code

```c++
// Problem: qc的字符串
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/144371/D
// Time: 2026-11-24 18:27:37
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n;
    string s;

    cin >> n >> s, s = ' ' + s;

    vector<array<int, 26>> info(n + 1);
    for (int i = 1; i <= n; i++)
    {
        int idx = s[i] - 'a';
        info[i][idx]++;

        for (int j = 0; j < 26; j++)
            info[i][j] += info[i - 1][j];
    }

    vector<int> dp(n + 1, -1);
    dp[0] = 0;

    auto check = [&](int l, int r) -> bool
    {
        auto Infor = info[r];
        for (int i = 0; i < 26; i++)
            Infor[i] -= info[l - 1][i];

        bool fl = true;
        for (int i = 0; i < 26; i++)
        {
            if (Infor[i] > 0 and Infor[i] < 2)
            {
                fl = false;
                break;
            }
        }

        return fl;
    };

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= i; j++)
        {
            if (check(j, i) and dp[j - 1] != -1)
                dp[i] = max(dp[i], dp[j - 1] + 1);
        }
    }

    cout << dp[n] << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# E - qc分组

> 关键词：枚举

## 思路

对于确定的 \(x\)，坐标为 \(a_i\) 的物品属于编号为 ${\left\lfloor \frac{a_i}{x}\right\rfloor}$ 的格子。因为每个格子最多放一个物品，所以这些物品所属的格子编号必须严格递增，我们考虑先把整个数组排序。现在考虑最后一个物品，因为存在 $n$ 个物品，而且每个格子最多放一个，所以最后一个物品的格子编号至少是 $n-1$，即 $\left\lfloor\frac{a_n}{x}\right\rfloor\ge n-1$，所以 $\boxed{x\le\left\lfloor\frac{a_n}{n-1}\right\rfloor}$。

知道答案上界以后，我们直接从大到小暴力枚举 $x$，每次检查一下所有物品是否落在不同格子。由于排好序，只需要检查相邻物品的 $\left\lfloor\frac{a_i}{x}\right\rfloor\ne\left\lfloor\frac{a_{i-1}}{x}\right\rfloor$。如果所有相邻物品的格子编号都不同，就说明合法。

## Code

```c++
// Problem: qc分组
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/144371/E
// Time: 2026-11-24 18:44:55
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a.begin() + 1, a.end());

    for (int x = a[n] / (n - 1); x > 0; x--)
    {
        bool fl = true;
        for (int t = 0; t * x <= n; t++)
        {
            if (a[t] >= (t + 1) * x or a[t] < t * x)
            {
                fl = false;
                break;
            }
        }

        if (fl)
        {
            cout << x << endl;
            return;
        }
    }
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# F - qc的盒子

> 关键词：群论，等价转换

## 思路

设 \(P_k(i)\) 表示：以第 \(k\) 次操作为起点，执行完所有操作后，**第** \(i\) **个盒子里装着原本属于哪个盒子的球**。定义 $f_k[i]=[P_k(i)=i]$。

设当前第一步交换的是盒子 $u,v$，记这个交换操作为 $S$，其余所有操作合起来记为 $R$，两种执行顺序分别是 $S \to R$ 和 $R \to S$。

首先我们注意到，交换两次操作等于不交换，形式化地，$S\circ S=I$。对于原来的操作序列 $S,R$，如果在它前面额外执行两次 $S$，最终结果是不变的，也就是说，我们可以把 $R \circ S$ 写成 $S \circ S \circ R \circ S$，而 $S \circ R$ 等价于第一种顺序，因此我们证明了，两种顺序最终得到的排列满足 $\boxed{P_{k+1}=S\circ P_k\circ S}$。

由上式，我们对任意一个盒子 $i$，判断它在新方案中能不能得分。