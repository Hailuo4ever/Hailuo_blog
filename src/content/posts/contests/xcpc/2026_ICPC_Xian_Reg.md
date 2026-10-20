---
title: 2026 icpc 西安区域赛
published: 2026-10-19
description: "The 2026 ICPC Asia Xi'an Regional Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 区域赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC Asia Xi’an Regional Contest 补题 - Dashboard - Contest - QOJ.ac](https://qoj.ac/contest/4580)

# C - Cryptarithm

> 关键词：DP，前后缀处理

## 思路

做此类 $DP$ 的一个思考技巧是：**如果状态设计是和长度相关的东西，往往会变的非常复杂**。

对于本题，粘贴操作和删除操作都可以在任意位置执行，所以我们很难确定状态中的长度信息。如果先考虑复制，再考虑删除的话，我们并不清楚我们想删的那个元素需不需要再复制一次。

注意到，删除和修改都不会改变被保留元素的相对顺序。**我们不妨换成，我们需要保留哪些元素，也就是转化成序列匹配的问题**。如果我们选择将 $a_j$ 对应到 $b_i$，修改代价显然是 $y|a_j-b_i|$。

到这里，这个问题转化成了：**从无限重复的 $a$ 中，依次选出 $m$ 个元素与 $b$ 匹配。每跨入一个新的 $a$ 需要支付 $x$，每跳过一个不使用的元素需要支付 $z$，每个匹配也要支付修改代价**。

现在考虑，当前已经匹配了 $b$ 的前 $i$ 个元素，下一步要决定：使用 $a$ 中的哪个位置来匹配 $b_{i+1}$，我们发现这个选择是有限制2的，因为当上一个选择位置大于等于它的话，一定需要复制一次再删除，否则不需要复制直接保留。**因此我们需要知道上一个匹配元素来自 $a$ 的哪个位置**。

**定义 $dp[i][j]$ 表示已经匹配完 $b_1,\dots,b_i$，其中 $b_i$ 使用某一份 $a$ 的第 $j$ 个元素时，所需要的最小代价**。

> [!TIP]
>
> 这个状态记录了以下信息：
>
> 1. 目前为止产生的操作费用
> 2. 如果我们需要复制下一份 $a$，需要删掉前面那份 $a$ 的多少个元素

我们首先可以考虑一种暴力一点的转移方式。假设我们已经计算出 $dp[i-1][k]$，表示前 $i-1$ 个元素已经匹配完成，且使用 $a$ 中的第 $k$ 个元素匹配 $b[i-1]$。现在要匹配 $b[i]$，我们决定使用 $a[j]$，$j$ 的选择会出现两种情况。当 $j>k$ 时，此时可以仍然使用当前这份 $a$，此时要删掉 $k\to j$ 的所有元素；当 $j \le k$ 时，必须复制一份 $a$ 出来，并删掉前缀 $j-1$ 的所有元素。最后再加上修改操作的代价。

> [!NOTE]
>
> 注意边界 $j=k$ 的问题。如果 $j=k$ 是必须要再复制一份的，因为当前的这个 $j$ 已经和上一轮匹配了。

```c++
for (int i = 2; i <= m; i++)
    {
        for (int k = 1; k <= n; k++) // pre
        {
            for (int j = 1; j <= n; j++) // now
            {
                if (j > k)
                    dp[i][j] = min((j - k - 1) * z + y * abs(a[j] - b[i]) + dp[i - 1][k], dp[i][j]);
                else
                    dp[i][j] = min(x + (j - 1 + n - k) * z + y * abs(a[j] - b[i]) + dp[i - 1][k], dp[i][j]);
            }
        }
    }
```

枚举 $i,j,k$ 的时间复杂度是 $O(mn^2)$，是无法通过的。我们考虑能不能不枚举 $k$，将带有字母 $k$ 和 $j$ 的项分开，我们发现对于固定的 $i$，两种情况都只需要找到 $dp[i-1][k] - kz$ 的最小值来转移，可以预处理出前后缀最小值，就不需要枚举 $k$，直接转移。时间复杂度 $O(nm)$。

考虑如何初始化与计算答案。当只匹配第一个元素 $b_1$ 时，我们需要复制一次 $a$，然后删掉 $a_j$ 前面的 $j-1$ 个元素，再将 $a_j$ 修改为 $b_1$。所以 $\boxed{dp[1][j]=x+(j-1)z+y|a_j-b_1|}$。当我们匹配完 $b_m$，假设最后一个匹配位置为 $j$，不能发现我们还需要把最后一份 $a$ 中的剩余元素全部删除才行。因此 $\boxed{ ans=\min_{1\le j\le n} \left\{ dp[m][j]+(n-j)z \right\} }$。

## Code

```c++
// Problem: C. Cryptarithm
// Contest: QOJ - The 2026 ICPC Asia Xi’an Regional Contest 补题
// URL: https://qoj.ac/contest/4580/problem/20053/statement/zh_cn
// Time: 2026-10-19 13:06:30
#include <bits/stdc++.h>
#include <cassert>
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    ll n, m, x, y, z;
    cin >> n >> m >> x >> y >> z;

    vector<ll> a(n + 1), b(m + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= m; i++)
        cin >> b[i];

    // dp[i][j]: matched b[1]...b[i], using a[j] to match b[i + 1]
    vector<vector<ll>> dp(m + 1, vector<ll>(n + 1, INF));
    for (int j = 1; j <= n; j++)
        dp[1][j] = x + y * abs(a[j] - b[1]) + z * (j - 1);

    for (int i = 2; i <= m; i++)
    {
        vector<ll> pre(n + 2, INF), suf(n + 2, INF);
        for (int j = n; j >= 1; j--)
            suf[j] = min(suf[j + 1], dp[i - 1][j] - j * z);

        for (int j = 1; j <= n; j++)
            pre[j] = min(pre[j - 1], dp[i - 1][j] - j * z);

        for (int j = 1; j <= n; j++)
            dp[i][j] = min(pre[j - 1] + (j - 1) * z, suf[j] + x + (n + j - 1) * z) + y * abs(a[j] - b[i]);
    }

    ll res = INF;
    // using a[j] to match b[m]
    for (int j = 1; j <= n; j++)
        res = min(res, dp[m][j] + z * (n - j));
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

# J - Journey

> 关键词：构造，找性质，结论证明

## 思路

原序列长度为 $2n$，每个数字恰好出现两次。我们把相同数字之间的边记作 $A$，括号之间的边记作 $B$。题目要求把这两种边放在一起，形成一个经过所有顶点的大环。

我们先考虑随便选一个括号序列。这里需要用到一个性质：由于每个顶点都恰好属于一条 $A$ 边和一条 $B$ 边，因此每个顶点度数均为 $2$。这种图的性质是：**一定由若干个互不相交的环组成**。因为原图不一定联通，所以是若干个。

我们发现，无论如何构造括号，结果都是若干个环，那么我们就需要通过某种方式把多个环合并成一个。

考虑处理相邻的括号对。例如 `()()`，把中间的 `)(` 交换得到的 `(())` 仍然是合法括号序列，但匹配关系发生了变化。显然这种操作可以推广到任意合法括号序列中的相邻 `)(`。所以可以得到一个结论，**如果相邻的 `)(` 属于不同的环，交换它们后两个环会合并**。

但我们还需要证明一定可以把所有环合并。仍然先考虑让 $s=\texttt{()()()}\cdots\texttt{()}$，这样，以下的位置对一定会相连：$(1,2),(3,4),(5,6),\ldots,(2n-1,2n)$。考虑形如 `)(` 的边界位置 $(2,3),(4,5),(6,7),\dots$。这些边界涉及的位置互不重叠，处理其他边界不会提前改变当前边界上的 `)(`。而且我们只会合并连通块，并不拆开已经连通的连通块。

综上，本题思路为：

1. 首先直接构造 `()()()...()`，允许最初存在多个环
2. 使用并查集维护连通性，检查所有相邻对。如果这两个位置属于不同的环，那么交换可以将两个环合并。

## Code

```c++
// Problem: J. Journey
// Contest: QOJ - The 2026 ICPC Asia Xi’an Regional Contest 补题
// URL: https://qoj.ac/contest/4580/problem/20060/statement/zh_cn
// Time: 2026-10-19 07:40:45
#include <bits/stdc++.h>
#include <cassert>
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

struct DSU
{
    vector<int> fa;
    vector<int> sz;

    DSU() {}

    DSU(int n)
    {
        init(n);
    }

    void init(int n)
    {
        fa.resize(n + 1);
        sz.assign(n + 1, 1);

        iota(fa.begin(), fa.end(), 0);
    }

    int find(int x)
    {
        if (fa[x] == x)
            return x;

        return fa[x] = find(fa[x]);
    }

    bool merge(int x, int y)
    {
        x = find(x);
        y = find(y);

        if (x == y)
            return false;

        if (sz[x] < sz[y])
            swap(x, y);

        fa[y] = x;
        sz[x] += sz[y];

        return true;
    }

    bool connected(int x, int y)
    {
        return find(x) == find(y);
    }

    int sze(int x)
    {
        return sz[find(x)];
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<pii> a(n + 1);
    for (int i = 1, x; i <= 2 * n; i++)
    {
        cin >> x;
        if (!a[x].first)
            a[x].first = i;
        else if (!a[x].second)
            a[x].second = i;
    }

    DSU dsu(2 * n);
    for (auto [x, y]: a)
        dsu.merge(x, y);

    for (int i = 1; i <= 2 * n; i += 2)
        dsu.merge(i, i + 1);

    vector<char> res(2 * n + 1);
    for (int i = 1; i <= 2 * n; i++)
        res[i] = (i & 1 ? '(' : ')');

    for (int i = 2; i <= 2 * n - 1; i += 2)
    {
        if (dsu.merge(i, i + 1))
            swap(res[i], res[i + 1]);
    }

    for (int i = 1; i <= 2 * n; i++)
        cout << res[i];
    cout << endl;
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

# M - Melodiniq

> 关键词：模拟

## 思路

觉得自己处理细节的能力还是太差了。还有读题的能力。赛场上因为这个 $-10$，唉。

有下面几个细节需要注意：

1. 打出字符 $C$ 时需要重置 `combo` 数量。
2. 计算分数后立刻处理 `combo` 的加分，因为可能有人被扣分后直接被救活。
3. 分数清零的人仍然可以贡献 `combo`。
4. $2000$ 和 $0$ 都在中途判。

## Code

```c++
// Problem: M. Melodiniq
// Contest: QOJ - The 2026 ICPC Asia Xi’an Regional Contest 补题
// URL: https://qoj.ac/contest/4580/problem/20063/statement/en
// Time: 2026-10-19 07:06:29
#include <bits/stdc++.h>
#include <cassert>
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<string> s(5);

    for (int i = 1; i <= 4; i++)
    {
        while (s[i].size() < n)
        {
            string t;
            cin >> t;
            s[i] += t;
        }
    }

    vector<int> score(5, 2000), combo(5);
    vector<bool> valid(5, true);

    for (int i = 0; i < n; i++)
    {
        for (int j = 1; j <= 4; j++)
        {
            if (s[j][i] == 'H')
                combo[j]++;
            else if (s[j][i] == 'C')
                combo[j] = 0;
            else if (s[j][i] == 'J')
                combo[j] = 0, score[j] -= 50;
            else if (s[j][i] == 'A')
                combo[j] = 0, score[j] -= 100;
            else
                combo[j] = 0, score[j] -= 200;
        }

        for (int j = 1; j <= 4; j++)
        {
            if (combo[j] >= 100)
            {
                combo[j] = 0;
                for (int k = 1; k <= 4; k++)
                {
                    if (j == k)
                        continue;
                    score[k] += 30;
                }
            }
        }

        for (int j = 1; j <= 4; j++)
        {
            score[j] = min(score[j], 2000);

            if (!valid[j])
                score[j] = 0;
            else if (score[j] <= 0)
                score[j] = 0, valid[j] = false;
        }
    }

    for (int i = 1; i <= 4; i++)
        cout << (valid[i] ? score[i] : 0) << " \n"[i == 4];
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

