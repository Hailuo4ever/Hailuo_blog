---
title: cf round 1072
published: 2026-05-16
description: "Codeforces Round 1072 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1072 (Div. 3)](https://codeforces.com/contest/2184)

# A - Social Experiment

> 关键词：签到

## Code

```c++
// Problem: CF 2184 A
// Contest: Codeforces - Codeforces Round 1072 (Div. 3)
// URL: https://codeforces.com/contest/2184/problem/A
// Time: 2026-05-14 22:55:01
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
        cout << 2 << endl;
    else if (n == 3)
        cout << 3 << endl;
    else
        cout << n % 2 << endl;
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

# B - Hourglass

> 关键词：分类讨论

## 思路

题目问的是在第 $m$ 分钟这个瞬间，沙漏的上半部分还剩多少沙子。

我们首先考虑：**在翻转之前，沙子能不能全漏完？** 这将问题分成了两大类：$s \le k$（能漏完/刚好漏完） 和 $s > k$（漏不完）。

当 $s \le k$​ 时，在翻转之前沙子就漏光了，因此每次反转都会重置沙漏成**上半部分满，下半部分空**的初始状态。既然每次反转都会重置，我们就不关心之前翻了多少次，只需要关心**当前处于这轮周期的第几分钟**，也就是 `m % k`。初始时上半部分有 $s$ 的沙子，漏了 `m % k` 分钟，理论上还剩 `s - m % k` 的沙子。但如果 `m % k` 已经大于 $s$ 了（说明沙子早就漏光了），剩下的沙子不能是负数，所以是 $0$。

当 $s > k$ 时，沙漏的状态会在偶数周期和奇数周期之间变化。对于偶数周期，当周期开始时，上半部分总是有 $s$ 的沙子；对于奇数周期，当周期开始时，上半部分总是有 $k$ 的沙子。我们首先需要计算经历了多少个完整的周期，即 `cnt = m / k`。在当前周期内度过的时间仍然是 `m % k`，讨论当前周期的奇偶性，然后拿总数 $k$ 或者 $s$ 减掉 `m % k` 即可。

> [!NOTE]
>
> 刚开始考虑的时候，并没有把问题分成这两类，而是统一去考虑奇偶周期了。思维还是不够清晰。

## Code

```c++
// Problem: CF 2184 b
// Contest: Codeforces - Codeforces Round 1072 (Div. 3)
// URL: https://codeforces.com/contest/2184/problem/b
// Time: 2026-05-15 15:53:27
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
    int s, k, m;
    cin >> s >> k >> m;

    if (s == k) // 可以合并成 s <= k
        cout << s - m % k << endl;
    else if (s < k)
        cout << max(0, s - m % k) << endl;
    else
    {
        int cnt = m / k;
        if (cnt % 2)
            cout << k - m % k << endl;
        else
            cout << s - m % k << endl;
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

# C - Huge Pile

> 关键词：一维BFS

## 思路

我们发现一个性质：同一个深度的节点最多只能有两个不同的值，因此整个拆分过程中产生的状态其实很少。大约只有$2 \times \log_2 N \approx 60$ 个状态。并且我们需要知道到达每种状态的“最小步数”，考虑使用一维BFS求解。

注意：过程中发现 $t < k$ 时剪枝。这道题的 `map` 类似于记忆化搜索，当我们已经搜过这个状态，就不需要再搜了。

## Code

```c++
// Problem: CF 2184 C
// Contest: Codeforces - Codeforces Round 1072 (Div. 3)
// URL: https://codeforces.com/contest/2184/problem/C
// Time: 2026-05-16 12:00:31
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

int n, k;

int bfs()
{
    queue<int> q;
    map<int, int> dist;

    q.push(n), dist[n] = 0;

    while (!q.empty())
    {
        int t = q.front();
        q.pop();

        if (t == k)
            return dist[t];

        if (t < k)
            continue;

        int ls = t / 2, rs = (t + 1) / 2;

        if (!dist.count(ls))
        {
            dist[ls] = dist[t] + 1;
            q.push(ls);
        }
        if (!dist.count(rs))
        {
            dist[rs] = dist[t] + 1;
            q.push(rs);
        }
    }

    return -1;
}

void solve()
{
    cin >> n >> k;

    cout << bfs() << endl;
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

# D - Unfair Game

> 关键词：组合数学，推公式

## 思路

考虑一个数变为 $0$ 的最小步数，显然能除以 $2$ 就一定要除以 $2$，否则只能减 $1$。

对于任意的初始数字，考虑它的二进制形式。每移出一个二进制位（除以 $2$），需要 $1$ 步，如果碰到了 $1$，需要先把它减成 $0$ 再除以 $2$，因此 $f(a) = \text{二进制长度} + \text{二进制中 1 的个数} - 1$ 。

要求我们统计在 $[1, n]$ 中，有多少个数字满足 $f(a) > k$，我们将 $[1, 2^d]$ 范围内的数分为两部分：

1. 数字 $a = 2^d$ 本身：

   它的长度是 $d+1$，包含 1 个 `1`。所以 $f(n) = (d+1) + 1 - 1 = d+1$。

   如果 $d+1 > k$，答案直接 `+1`。

2. 数字 $a \in [1, 2^d - 1]$：

   这些数字的最高位必定在第 $L$ 位（从右往左数，从 1 开始），其中 $L \in [1, d]$。

   - 对于一个固定的长度 $L$，它的最高位必定是 `1`。
   - 剩下的 $L-1$ 个低位，可以是 `0` 也可以是 `1`。假设其中有 $p$ 个 `1`（$p \in [0, L-1]$）。
   - 那么这个数字的总 `1` 个数为 $p+1$。
   - 根据公式，$f(a) = L + (p+1) - 1 = L + p$。

我们要找的是 $L + p > k$ 的数字个数。

因为在一个长度为 $L-1$ 的区域里选出 $p$ 个位置填 `1`，方案数就是组合数 **$C(L-1, p)$**。

由于 $d$ 比较小，使用杨辉三角递推出组合数即可。

## Code

```c++
// Problem: CF 2184 D
// Contest: Codeforces - Codeforces Round 1072 (Div. 3)
// URL: https://codeforces.com/contest/2184/problem/D
// Time: 2026-05-16 12:39:16
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
const int N = 55;

int c[N][N];

void init()
{
    for (int i = 0; i <= 50; i++)
    {
        c[i][0] = c[i][i] = 1;
        for (int j = 1; j < i; j++)
            c[i][j] = c[i - 1][j] + c[i - 1][j - 1];
    }
}

void solve()
{
    int n, k;
    cin >> n >> k;

    int d = __lg(n);

    ll res = 0;
    for (int i = 1; i < d; i++)
        for (int j = 0; j <= i; j++)
            if (i + j + 1 > k)
                res += c[i][j];

    if (d + 1 > k)
        res++;

    cout << res << endl;
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



# E - Exquisite Array

> 关键词：并查集，离线处理

## 思路

首先求一个差分数组，即 $D_i = |p_i - p_{i+1}|$，长度为 $n - 1$

现在问题变成了：在数组 $D$ 中，一个连续的子段如果所有元素都 $\ge k$，那么它就对应原数组中的一个满足要求的数组。

假设这个连续子段的长度为 $L$，这个区间的内部会产生 $\frac{L \times (L + 1)}{2}$ 个合法子段。

> [!TIP]
>
> 对于某个特定的 $k$，我们需要找出 $D$ 数组中所有完全由 $\ge k$ 的元素组成的“连续段”，算出每个连续段长度 $L$ 对应的 $\frac{L(L+1)}{2}$，将它们全部累加起来，就是答案。

假设我们从小到大枚举 $k$ 并计算结果，随着 $k$ 的增大，前面已经合法的 $D_i$ 会变得不合法，我们考虑从大到小倒序枚举 $k$。

随着 $k$ 的减小，越来越多的 $D_i$ 会变得合法（我们可以把它们看作是一个个被“激活”的节点）。原本断开的连续段，会因为新节点的“激活”而被连接（合并）在一起，使用并查集动态维护联通块。

> [!NOTE]
>
> 因为我们要计算贡献，当我们激活一个位置 $i$ 时，我们都需要计算包含 $i$ 的这个连续合法区间现在的长度。
>
> 因此使用并查集维护连通性和连通块的长度。

### 完整流程

1. 预处理：将所有 $D_i$ 的位置，按照值域放进若干个桶里。使用 `vector<int> pos[x]`，存下所有 $D_i = x$ 的下标 $i$。（注意 `unordered_map` 容易被卡，尽量使用 `vector`。

2. 初始化并查集和维护变量：维护一个变量 `cur` 代表当前的合法子段总数。使用 `vector<bool> active(n, false)` 记录每个差值位置是否被“激活”。

3. 倒序遍历并计算结果。当遍历到某一个 $k$ 时：

    1. 拿出 `pos[k]` 里的所有下标 $i$。

    2. 将下标 $i$ 标记为“已激活”。它本身形成了一个长度为 $1$ 的连通块，此时 `cur` 增加 $\frac{1 \times 2}{2} = 1$。

    3. 检查左邻居 $i-1$：如果 $i-1$ 也是“已激活”的，我们就需要把 $i$ 和 $i-1$ 所在的连通块合并。

        合并前，我们先从 `cur` 中减去这两个独立连通块原本的贡献。

        合并后，把它们的大小相加得到新的 $L_{new}$，再给 `cur` 加上新连通块的贡献 $\frac{L_{new}(L_{new}+1)}{2}$。

    4. 检查右邻居 $i+1$： 同理，如果 $i+1$ 也是“已激活”的，执行相同的合并与贡献更替操作。

    5. 把所有的 $i \in pos[k]$ 处理完之后，当前的 `cur` 就是 $k$ 对应的答案，存入结果数组。

## Code

```c++
// Problem: CF 2184 E
// Contest: Codeforces - Codeforces Round 1072 (Div. 3)
// URL: https://codeforces.com/problemset/problem/2184/E
// Time: 2026-05-13 22:20:17
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

struct DSU
{
    vector<int> parent;
    vector<int> sz;
    int comp_cnt;

    DSU(int n)
    {
        parent.resize(n + 1);
        iota(parent.begin(), parent.end(), 0);
        sz.assign(n + 1, 1);
        comp_cnt = n;
    }

    int find(int i)
    {
        if (parent[i] == i)
            return i;
        return parent[i] = find(parent[i]);
    }

    bool unite(int i, int j)
    {
        int pi = find(i);
        int pj = find(j);
        if (pi != pj)
        {
            if (sz[pi] < sz[pj])
                swap(pi, pj);
            parent[pj] = pi;
            sz[pi] += sz[pj];
            comp_cnt--;
            return true;
        }
        return false;
    }

    bool connected(int i, int j)
    {
        return find(i) == find(j);
    }

    int size(int i)
    {
        return sz[find(i)];
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n), d(n - 1);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    vector<vector<int>> mp(n);
    for (int i = 0; i < n - 1; i++)
    {
        d[i] = abs(a[i] - a[i + 1]);
        mp[d[i]].push_back(i);
    }

    DSU dsu(n);
    ll cur = 0;

    vector<ll> res(n);
    vector<bool> active(n, false);

    auto calc = [](ll sz) { return sz * (sz + 1) / 2; };

    for (int k = n - 1; k >= 0; k--)
    {
        for (auto i: mp[k])
        {
            active[i] = true;
            cur += calc(1);

            if (i > 0 && active[i - 1])
            {
                ll sz1 = dsu.size(i - 1);
                ll sz2 = dsu.size(i);

                cur -= calc(sz1) + calc(sz2);
                dsu.unite(i - 1, i);
                cur += calc(dsu.size(i));
            }

            if (i < n - 2 && active[i + 1])
            {
                ll sz1 = dsu.size(i + 1);
                ll sz2 = dsu.size(i);

                cur -= calc(sz1) + calc(sz2);
                dsu.unite(i + 1, i);
                cur += calc(dsu.size(i));
            }
        }
        res[k] = cur;
    }

    for (int k = 1; k < n; k++)
        cout << res[k] << " ";
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

