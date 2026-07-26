---
title: 牛客小白月赛 132
published: 2026-05-08
description: "Nowcoder Rookie Month Contest 132"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客小白月赛 132](https://ac.nowcoder.com/acm/contest/134527#question)
>
> 赛时四题。

# A - 出题需要 rating

> 关键词：签到

## Code

```c++
// Problem: 出题需要 rating
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/A
// Time: 2026-05-08 19:25:47

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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int m;
    cin >> m;

    int a[7] = {0};
    int n = 1000;

    while (m--)
    {
        int x;
        cin >> x;

        n += x;

        if (n <= 699)
            a[0]++;
        else if (n >= 700 && n <= 1099)
            a[1]++;
        else if (n >= 1100 && n <= 1499)
            a[2]++;
        else if (n >= 1500 && n <= 1999)
            a[3]++;
        else if (n >= 2000 && n <= 2399)
            a[4]++;
        else if (n >= 2400 && n <= 2799)
            a[5]++;
        else if (n >= 2800)
            a[6]++;
    }

    for (auto i: a)
        cout << i << " ";
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

# B - 出题需要语文

> 关键词：模拟

## 思路

我们需要维护三个信息：题目编号、题目难度、题目质量，可以使用结构体存储并重载小于号。

但赛时的思维有点混乱，选择了 `map<char, vector<pii>>`，赛后复盘时发现结构体更好一点。

## Code

```c++
// Problem: 出题需要语文
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/B
// Time: 2026-05-08 19:30:56
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 1e5 + 10;

map<char, vector<pii>> mp;

bool cmp(pii &A, pii &B)
{
    return A.second > B.second;
}

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
    {
        char c;
        int q;
        cin >> c >> q;

        mp[c].push_back({i, q});
    }

    if (mp.size() < 6)
    {
        cout << -1 << endl;
        return;
    }

    vector<pii> res;

    for (auto &[c, vec]: mp)
    {
        sort(all(vec), cmp);
        res.push_back(vec[0]);
    }

    double ave = 0;
    for (auto i: res)
    {
        ave += i.second;
        if (i.second < 60)
        {
            cout << -1 << endl;
            return;
        }
    }

    ave = ave * 1.0 / 6;
    // cout << ave << endl;

    if (ave >= 70)
        for (auto i: res)
            cout << i.first << " ";
    else
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

# C - 出题需要加法

> 关键词：位运算，二分

## 思路

刚开始的时候想到一个思路：使用 `bitset` 来考察区间 `[L, R]` 上每个数的二进制表示，只有某个数的二进制表示中 `1` 的个数 $\le 2$ 才计入答案，但这样做在区间跨度很大的情况下会超时，并且没有特判 `0` 和 `1` 的情况。

正确的思路是，我们直接构造出所有符合条件的 `w`，$x$ 和 $y$ 的取值范围最大只有 $62$ （因为 $2^{62} + 2^{62} = 2^{63}$），我们可以使用两层循环嵌套枚举 $x$ 和 $y \in [0, 62]$，计算所有可能的 $w$。符合条件的数大约只有 `2000` 个，把这些数去重并排序，对于每一次查询，使用二分查找即可。

> [!NOTE]
>
> `distance(itl, itr)`函数可以计算两个迭代器之间的距离，它支持所有合法迭代器，但不会检查非法性。
>
> 这道题注意使用 `unsigned long long`。

## Code

```c++
// Problem: 出题需要加法
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/C
// Time: 2026-05-08 19:43:51
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

vector<ull> nums;

void init()
{
    for (int i = 0; i < 63; i++)
        for (int j = 0; j < 63; j++)
        {
            ull tmp = (1ull << i) + (1ull << j);
            nums.push_back(tmp);
        }

    sort(all(nums));
    nums.erase(unique(all(nums)), nums.end());
}

void solve()
{
    ll l, r;
    cin >> l >> r;

    auto itL = lower_bound(all(nums), l);
    auto itR = upper_bound(all(nums), r);

    cout << distance(itL, itR) << endl;
}

int main()
{
    fastio();

    int T = 1;
    cin >> T;

    init();

    while (T--)
        solve();

    return 0;
}

```

# D - 出题需要构造

> 关键词：构造

## 思路

> [!NOTE]
> 赛时竟然想出来了这题的思路，感觉自己进步了。下面抛开直觉，更严谨地考虑这个问题。

我们需要在 $n \times m$ 的矩阵中填入 $1 \sim n$ 的颜色，使得任意选出 $k$ 种颜色，矩阵的每一行和每一列都恰好有 2 个格子被点亮。

### Step 1：确定 $k$ 的值

单独看矩阵的某一列（长度为 $n$）。假设在这列中，颜色 $i$ 出现了 $c_i$ 次。题目要求：任意选 $k$ 种颜色，这 $k$ 种颜色出现的次数总和必定为 2。

即对于任意大小为 $k$ 的集合 $S$，都有 $\sum_{i \in S} c_i = 2$。既然对任意组合都成立，这就意味着所有颜色的出现次数必须完全相同。

设每个颜色在这一列出现 $c$ 次，那么就有：$k \times c = 2$，因为 $k$ 和 $c$ 都是正整数，满足这个等式的组合只有两种：

1. $k = 1, c = 2$
2. $k = 2, c = 1$

我们把这两种情况代入列的总长度（这一列共有 $n$ 个格子）：

- 如果 $k = 1, c = 2$：意味着 $n$ 种颜色，每种颜色在这列出现了 $2$ 次。那么这一列的总格子数应该是 $2n$。但这列的长度是 $n$（$n = 2n \implies n=0$），矛盾
- 如果 $k = 2, c = 1$：意味着每种颜色在这列恰好出现 $1$ 次。那么总格子数是 $n \times 1 = n$。完全合理！

**结论 1：$k$ 必定等于 $2$。且每种颜色在每一列中恰好出现 1 次**。

### Step 2：确定 $n$ 和 $m$ 的关系

我们用同样的逻辑去分析某一行（长度为 $m$）。

为了满足任意 2 种颜色在这一行恰好点亮 2 个格子，那么每种颜色在这一行中也必须恰好出现 1 次。

既然 $n$ 种颜色每种都在这一行出现 1 次，那么这一行的长度就必须是 $n$。

但这一行的长度是 $m$，所以：$n = m$

**结论 2：如果 $n \neq m$，绝对不可能存在合法方案，直接输出 `NO`。**

另外，因为需要选出 $k=2$ 种颜色，所以颜色总数 $n$ 必须 $\geqslant 2$（如果 $n=1$ 也是 `NO`）。

### Step3：构造方案

现在问题转化成了：构造一个 $n \times n$ 的方阵，用 $1 \sim n$ 填满，使得**每行每列的 $1 \sim n$ 都恰好出现一次**。

直接循环移位即可。使用 `rotate()` 会方便一些。

## Code

```c++
// Problem: 出题需要构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/D
// Time: 2026-05-08 20:01:20
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n, m;
    cin >> n >> m;

    if (n != m || n == 1)
    {
        cout << "NO" << endl;
        return;
    }
    else
    {
        cout << "YES" << endl << 2 << endl;
        vector<int> a(n);
        iota(all(a), 1);

        for (int i = 0; i < m; i++)
        {
            for (auto x: a)
                cout << x << " ";
            cout << endl;

            rotate(a.begin(), a.begin() + 1, a.end());
        }
    }
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

# E - 出题需要魔法

> 关键词：单调栈，补集计数

## 思路

对于排列中的某一个元素 $p_x$，题目要求找包含 $x$ 的子区间 $[l, r]$（即 $l \leqslant x \leqslant r$），使得 $p_x$ 是“可见的”。

“可见的”意味着满足以下两个条件之一：

1. 左边可见：区间 $[l, x]$ 中，$p_x$ 是最大值。也就是说，不能有比 $p_x$ 大的数出现在 $x$ 左边。
2. 右边可见：区间 $[x, r]$ 中，$p_x$ 是最大值。也就是说，不能有比 $p_x$ 大的数出现在 $x$ 右边。

为了快速判断，我们可以预处理出两个数组：

- $L[x]$：表示在 $x$ 左边，第一个大于 $p_x$ 的元素的下标。如果不存在，则 $L[x] = 0$。
- $R[x]$：表示在 $x$ 右边，第一个大于 $p_x$ 的元素的下标。如果不存在，则 $R[x] = n + 1$。

> [!NOTE]
>
> 这部分预处理使用**单调栈**，从两侧分别扫一遍即可。
>
> 单调栈的作用就是找左右的第一个大于或者小于的坐标，一定要记住。

接下来我们把条件转化为对区间端点 $l$ 和 $r$ 的限制条件：

- 满足“左边可见”的方案数 ($W_1$)：

  要保证左边没有比 $p_x$ 大的数，左端点 $l$ 必须越过 $L[x]$，即 $l \in [L[x] + 1, x]$。右端点 $r$ 可以随便选，即 $r \in [x, n]$。

  所以，$W_1 = (x - L[x]) \times (n - x + 1)$

- 满足“右边可见”的方案数 ($W_2$)：

  要保证右边没有比 $p_x$ 大的数，右端点 $r$ 必须在 $R[x]$ 之前，即 $r \in [x, R[x] - 1]$。左端点 $l$ 可以随便选，即 $l \in [1, x]$。

  所以，$W_2 = x \times (R[x] - x)$

- 同时满足“左边和右边都可见”的方案数 ($W_{12}$)：

  取上面两个条件的交集，即 $l \in [L[x] + 1, x]$ 且 $r \in [x, R[x] - 1]$。

  所以，$W_{12} = (x - L[x]) \times (R[x] - x)$

根据**容斥原理**，满足“至少一边可见”的总方案数就是：$Ans(x) = W_1 + W_2 - W_{12}$

## Code

```c++
// Problem: 出题需要魔法
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/E
// Time: 2026-05-08 20:37:27
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    vector<int> L(n + 1, 0);
    vector<int> R(n + 1, n + 1);

    stack<int> st;
    for (int i = 1; i <= n; i++)
    {
        while (!st.empty() && a[st.top()] < a[i])
            st.pop();

        if (!st.empty())
            L[i] = st.top();

        st.push(i);
    }

    stack<int> st2;
    for (int i = n; i >= 1; i--)
    {
        while (!st2.empty() && a[st2.top()] < a[i])
            st2.pop();

        if (!st2.empty())
            R[i] = st2.top();

        st2.push(i);
    }

    for (int i = 1; i <= n; i++)
    {
        ll W1 = 1LL * (i - L[i]) * (n - i + 1);
        ll W2 = 1LL * i * (R[i] - i);
        ll W12 = 1LL * (i - L[i]) * (R[i] - i);

        ll res = W1 + W2 - W12;

        cout << res << " ";
    }
    cout << "\n";
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

# F - 出题需要树论

> 关键词：树形DP，前后缀最大值

## 思路

> [Gemini 对话记录](https://gemini.google.com/share/fb8d3d4f536f)，这个题有点困难，现在还不能完全理解。

假设我们选择节点 $u$ 进行操作，将其子树内所有节点的点权 $w_v$ 变为 $w_v \oplus x$。考虑这个操作对树上从根节点到任意节点 $k$ 的路径和造成的影响。

我们考虑把所有节点分为两类：

1. $k$ 不在 $u$ 的子树内：

   此时，从根节点 $1$ 到 $k$ 的路径**完全不会经过 $u$ 的子树**，所以路径和保持不变，依然是原本的权值和。

2. $k$ 在 $u$ 的子树内：

   此时，从根节点 $1$ 到 $k$ 的路径被分成了两段：

   - $1 \to parent(u)$：这一段不在 $u$ 的子树内，权值保持不变。
   - $u \to k$：这一段全部在 $u$ 的子树内，所有的点权都被异或了 $x$。

为了快速计算，我们可以用 DFS 预处理出两个数组：

- $A[i]$：表示原树中，从根 $1$ 到节点 $i$ 的原点权路径和。
- $B[i]$：表示假如**所有**节点点权都被异或 $x$（即 $w_v \oplus x$），从根 $1$ 到节点 $i$ 的新点权路径和。

如果选择了节点 $u$ 进行操作，那么对于**子树内**的任意节点 $k$，新的路径和可以表示为：$S_{new}(k) = A[parent(u)] + (B[k] - B[parent(u)])$

其中 $A[parent(u)] - B[parent(u)]$ 对于固定的 $u$ 是一个常数。因此，子树内的最大路径和为：$\max_{k \in subtree(u)} S_{new}(k) = A[parent(u)] - B[parent(u)] + \max_{k \in subtree(u)} B[k]$。

而对于**子树外**的节点，最大路径和就是：$\max_{k \notin subtree(u)} A[k]$

> [!NOTE]
>
> 如何快速求“子树内/外”的最大值？
>
> - 子树内的 $B[k]$ 最大值可以通过一次后序遍历计算；
> - 子树外的 $A[k]$ 最大值，我们可以利用 DFS 序将树压缩成一维数组。子树外就对应了数组里的一段前缀和一段后缀。我们可以预处理该数组的前缀最大值 (pref) 和 后缀最大值 (suff)，做到 $O(1)$ 查询。
>
> DFS 序可以将一棵树拉直成一个一维数组，并且保证任何一棵子树在这个数组里都是连续的一段。
>
> 通过维护一个时间戳 `timer`，我们记录进树时间 `dfn[u] = timer`，记录进一维数组 `seq[timer] = u` 后递归子树，递归完成后记录出树时间 `out[u] = timer`。
>
> 我们可以将 [进树时间，出树时间] 看作一个区间，去一维数组里找这个子树。

## Code

```c++
// Problem: 出题需要树论
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134527/F
// Time: 2026-05-08 22:45:58
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const ll inf = 1e18;
const int N = 0;

void solve()
{
    int n;
    ll x;
    cin >> n >> x;

    vector<ll> w(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> w[i];

    vector<vector<int>> adj(n + 1);
    for (int i = 1; i < n; i++)
    {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v), adj[v].push_back(u);
    }

    // A[i] 存储原权值路径和，B[i] 存储异或后权值路径和
    vector<ll> A(n + 1, 0), B(n + 1, 0);
    vector<int> dfn(n + 1), out(n + 1), seq(n + 1), par(n + 1, 0);
    vector<ll> maxB(n + 1, 0);
    int t = 0;

    auto dfs = [&](auto &self, int u, int p) -> void
    {
        par[u] = p;
        A[u] = A[p] + w[u];
        B[u] = B[p] + (w[u] ^ x);

        t++;
        dfn[u] = t;
        seq[t] = u;

        maxB[u] = B[u];

        for (int v: adj[u])
        {
            if (v != p)
            {
                self(self, v, u);
                maxB[u] = max(maxB[u], maxB[v]);
            }
        }
        out[u] = t;
    };

    dfs(dfs, 1, 0);

    vector<ll> prefA(n + 2, 0), suffA(n + 2, 0);
    for (int i = 1; i <= n; i++)
        prefA[i] = max(prefA[i - 1], A[seq[i]]);

    for (int i = n; i >= 1; i--)
        suffA[i] = max(suffA[i + 1], A[seq[i]]);

    ll res = inf;

    for (int u = 1; u <= n; u++)
    {
        int p = par[u];

        // 子树内部的最大路径和
        ll I = A[p] - B[p] + maxB[u];

        // 子树外部的最大路径和
        ll O = max(prefA[dfn[u] - 1], suffA[out[u] + 1]);

        ll tmp = max(I, O);
        res = min(res, tmp);
    }

    cout << res << "\n";
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

