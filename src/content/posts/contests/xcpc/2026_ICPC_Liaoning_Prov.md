---
title: 2026 icpc 辽宁省赛
published: 2026-11-18
description: "The 2026 ICPC China Liaoning Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 第七届辽宁省大学生程序设计竞赛 (沈阳) - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/4707)

# A - 海鸥传说

> 关键词：连通块，并查集

## 思路

首先需要转换一下参考系，固定食物为出发点，看作食物移向所有的海鸥。

然后可以发现前进与回退是类似于 $DFS$ 的，由于回退不需要消耗代价，我们考虑把同行同列的所有点使用并查集合并在一起。只要能够通过一系列同行或同列的点间接连接，它们就属于同一个连通块。考虑如何计算代价。

对于每个连通块内部，设大小为 $k$。连通块内可以通过同行或同列的关系相互到达，我们使用生成树来访问每一个点，代价是 $k-1$。对于连通块之间，我们需要在横向和纵向各走一次，消耗 $2$ 点代价。设连通块一共有 $cnt$ 个，连通块间连接的代价为 $2\times (cnt-1)$，所有连通块内部的代价加起来是 $n+1-cnt$，总答案为 $n+cnt-1$。

## Code

```c++
// Problem: A
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25505
// Time: 2026-11-17 23:53:47
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

struct Node
{
    int x, y, id;
};

void solve()
{
    int n;
    cin >> n;

    vector<Node> a(n + 2);
    for (int i = 1, x, y; i <= n + 1; i++)
        cin >> x >> y, a[i] = {x, y, i};

    sort(a.begin() + 1, a.end(), [](const auto aa, const auto bb) { return aa.x < bb.x; });

    DSU dsu(n + 1);

    int cnt = n + 1;
    for (int i = 1; i <= n + 1; i++)
    {
        auto [x, y, id] = a[i];
        auto [x2, y2, id2] = a[i + 1];

        if (x == x2 && dsu.merge(id, id2))
            cnt--;
    }

    sort(a.begin() + 1, a.end(), [](const auto aa, const auto bb) { return aa.y < bb.y; });

    for (int i = 1; i <= n + 1; i++)
    {
        auto [x, y, id] = a[i];
        auto [x2, y2, id2] = a[i + 1];

        if (y == y2 && dsu.merge(id, id2))
            cnt--;
    }

    cout << n + cnt - 1 << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# B - VP 选手的最优解题方案

> 关键词：反悔贪心

## 思路

标准反悔贪心。我们发现普通贪心时，假如我们后面发现做某道题更优，但已经没时间了，就没法撤销这个操作。因此，我们把所有的编码时间推进大根堆里即可。每次需要撤销的时候总撤销最大的，在过程中更新答案。

## Code

```c++
// Problem: B
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25506
// Time: 2026-11-18 10:49:45
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
    ll n, t;
    cin >> n >> t;

    vector<ll> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        cin >> b[i];

    priority_queue<ll> pq;
    ll res = 0, cur = 0;

    for (int i = 1; i <= n; i++)
    {
        cur += a[i] + b[i], pq.push(b[i]);
        while (!pq.empty() && cur > t)
            cur -= pq.top(), pq.pop();

        res = max(res, (ll) pq.size());
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

# D - 可爱的质数

> 关键词：结论，质数筛

## 思路

假如某个数是合数，他一定有一个比他小的质因子，我们直接选取他即可。

假如某个数是质数，我们可以感性的理解一下。首先这个数一定是奇数，我们想找到一个比他小的质数，满足他们相减的情况是合数。首先奇数减去奇数一定是偶数，那么这个偶数显然不能是 $2$，我们可以从比这个质数小的最大的质数开始，用双指针直接往后扫。在 $\frac x {primes[j]}$ 相同的情况下，答案是单调递增的，换句话说，我们总能在比较少的情况下找到合法解。

上述结论可以通过打表来证明。赛后 `assert` 发现，$j$ 向后查找的次数不超过 $10$ 次。

其实，有一个更普遍的结论是，如果一个质数 $<11$，它就一定无解，否则有解。

## Code

```c++
// Problem: D
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25508
// Time: 2026-11-17 22:16:12
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
const int N = 1e7 + 10;
const ll INF = 4e18;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

vector<int> primes;
vector<char> st;

void get_primes(int n)
{
    primes.clear();
    st.assign(n + 1, 0);

    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
            primes.eb(i);

        for (auto p: primes)
        {
            if (p > n / i)
                break;

            st[p * i] = true;

            if (i % p == 0)
                break;
        }
    }
}

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    int mx = 0;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] > 0 && a[i] <= 3)
        {
            cout << -1 << endl;
            return;
        }

        mx = max(mx, a[i]);
    }

    if (mx == 0)
    {
        cout << 0 << endl;
        return;
    }

    int res = 0;
    for (int i = 1; i <= n; i++)
    {
        int x = a[i];

        if (x == 0)
            continue;

        if (st[x])
            res++;
        else
        {
            bool valid = false;

            auto it = lower_bound(all(primes), x) - primes.begin() - 1;
            for (int j = it; j >= 0; j--)
            {
                assert(j - it <= 10);

                if ((a[i] % primes[j]) % 2 == 0 && (a[i] % primes[j]) != 2)
                {
                    valid = true;
                    break;
                }
            }

            if (valid)
                res += 2;
            else
            {
                cout << -1 << endl;
                return;
            }
        }
    }

    cout << res << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0), get_primes(N - 5);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# E - 夏日归途

> 关键词：不变量，推性质

## 思路

题目中，每次可以选择相邻的两个元素 $a_i,a_{i+1}$，要求 $a_i-a_{i+1}\ge 2$，然后先将左边的 $1$ 张牌移到右边，再交换两堆牌的位置，实际上是 ${(x,y)\longrightarrow(y+1,x-1)}$。

我们观察这个操作，进行 $+1$，$-1$ 后交换位置。**能不能给每个位置加一个偏移量，让这两个元素的加减操作抵消，最后直接交换？**

定义 $b_i=a_i+i$，我们发现原来的操作变成了直接交换，即 ${(b_i,b_{i+1})\longrightarrow(b_{i+1},b_i)}$。检查一下操作条件，原来有 $a_i-a_{i+1}\ge2$，变换到 $b$ 后，有 $b_i>b_{i+1}$。

**现在题目转化成，给定数组 $b$，每次选择一对相邻的逆序元素 $b_i>b_{i+1}$，交换它们的位置。两名玩家轮流操作，无法操作的人输**。这实际上就是逆序对的定义。

还有一个性质是，每次交换相邻的一对逆序元素，会使逆序对数量恰好减少 $1$。

> [!NOTE]
>
> 假设交换相邻的 $x>y$，对于其他元素，由于二者相邻，交换不会改变他们与其他元素构成的逆序对总数。

所以统计一下逆序对数量，判断奇偶性即可。实现上可以用离散化和 `Fenwick`。

## Code

```c++
// Problem: E
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25509
// Time: 2026-11-18 12:39:22
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

struct Fenwick
{
    int n;
    vector<ll> tr;

    Fenwick() {}

    Fenwick(int n)
    {
        init(n);
    }

    void init(int n_)
    {
        n = n_;
        tr.assign(n + 1, 0);
    }

    int lowbit(int x)
    {
        return x & -x;
    }

    void add(int x, ll val)
    {
        for (int i = x; i <= n; i += lowbit(i))
            tr[i] += val;
    }

    ll query(int x)
    {
        ll res = 0;

        for (int i = x; i > 0; i -= lowbit(i))
            res += tr[i];

        return res;
    }

    ll query(int l, int r)
    {
        if (l > r)
            return 0;

        return query(r) - query(l - 1);
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1), b;
    for (int i = 1; i <= n; i++)
        cin >> a[i], a[i] += i, b.eb(a[i]);

    sort(all(b)), b.erase(unique(all(b)), b.end());
    auto id = [&](int x) -> int { return lower_bound(all(b), x) - b.begin() + 1; };

    int mx = 0;
    for (int i = 1; i <= n; i++)
        a[i] = id(a[i]), mx = max(mx, a[i]);

    Fenwick tr(mx);
    ll res = 0;

    for (int i = 1; i <= n; i++)
    {
        res += i - 1 - tr.query(a[i]);
        tr.add(a[i], 1);
    }

    cout << (res & 1 ? "Shion" : "Kanon") << endl;
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

# F - 咏人不知

> 关键词：线性DP，枚举

## 简化题意

> [!NOTE]
>
> 读题并迅速抽象出题目描述感觉很重要。赛时读题读太慢了。

给定一个由数字 $1\sim7$ 组成的字符串 $s$，长度为 $n$。对于每个位置 $i$，假设原来的数字是 $a_i$，可以选择一种转位 

$t_i\in\{0,1,2\}$，使它的最低音变为 $B(a_i,t_i)=((a_i+2t_i-1)\bmod7)+1$。选好每个位置的最低音后，我们需要计算所有相邻位置之间的距离。这里数字 $1\sim7$ 围成了一个圆环，距离的定义是环上两个方向的距离取最短，即 $D(x,y)=\min(|x-y|,\ 7-|x-y|)$。

要求选择每个位置的转位，使得总代价 $\boxed{\sum_{i=1}^{n-1}D(B(a_i,t_i),B(a_{i+1},t_{i+1}))}$ 最小。

## 思路

显然，这里的操作都具有无后效性，我们考虑线性 $DP$。

设 $dp[i][0/1/2]$ 表示已经操作完前 $i-1$ 个和弦，操作第 $i$ 个和弦时选择转位 $0/1/2$ 的最小代价。

转移时枚举当前操作 $j$ 和上一次操作 $k$，更新每种情况即可。

## Code

```c++
// Problem: F
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25510
// Time: 2026-11-18 13:05:27
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
    cin >> s, s = ' ' + s;

    int n = s.size() - 1;

    vector<array<int, 3>> dp(n + 1, {inf, inf, inf});
    dp[1] = {0, 0, 0};

    auto dis = [&](int x, int y) -> int { return min(abs(x - y), 7 - abs(x - y)); };
    auto modify = [&](int c, int t) -> int { return (c + 2 * t - 1) % 7 + 1; };

    for (int i = 2; i <= n; i++)
    {
        for (int j = 0; j < 3; j++)
        {
            for (int k = 0; k < 3; k++)
            {
                int x = modify(s[i - 1] - '0', k), y = modify(s[i] - '0', j);
                dp[i][j] = min(dp[i][j], dp[i - 1][k] + dis(x, y));
            }
        }
    }

    cout << min({dp[n][0], dp[n][1], dp[n][2]}) << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# J - 数字谜题

> 关键词：思维

## 思路

我们可以发现，两个玩家所拥有的牌型和数量全部固定，我们又提前知道了对手的操作序列。

如果存在一个最优策略，能让我们拿到 $x$ 分，则不管对手的序列是什么，我们只要一直采取这个策略就能每次都拿到 $x$ 分，因此答案为 $xn$。

观察样例发现 $x=21$。

> [!NOTE]
>
> 可以构造出如下方案：对方出 $1 \le x \le 8$ 时，我们出 $x+1$。对方出 $9$ 时，我们出 $1$。

## Code

```python
n = int(input())
print(21 * n)
```

# K - 显卡

> 关键词：签到

## 思路

设 `q = n / m`，`r = n % m`。最优的分配方案是，给 $r$ 个人分配 $q+1$ 张显卡，其余 $m-r$ 个人分配 $q$ 张显卡。其他人会先把 $q+1$ 的选走，所以答案就是 $\frac n m$。

## Code

```python
a, b = map(int, input().split())
print(a // b)
```

# L - 情绪波动计划

> 关键词：构造

## 思路

我们需要构造一个奇偶序列，使得相邻位置奇偶性不同的次数恰好为 $k$。

可以考虑构造 $k+1$ 个奇偶交替出现的连续段，这样会产生 $k$ 个切换点，相比于奇偶对，更好控制一些。因为我们只需要把剩下的数塞到段内就可以了。

如果 $k=4$，我们需要考虑序列是奇偶奇偶奇，还是偶奇偶奇偶。因此，**先判断一下先以奇数还是偶数开头，可以构造出来**。只要任意一种的数量 $\ge\left\lceil\frac {k+1}2\right\rceil$ 就可以以它为起始构造。

最后我们把剩余元素填进尾部的段里面即可，这时候记录一下前面有没有反转过，如果反转过就再转回来。

## Code

```c++
// Problem: L
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25516
// Time: 2026-11-18 13:43:16
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
    int n, k;
    cin >> n >> k;

    vector<int> ev, od;
    for (int i = 1, x; i <= n; i++)
        cin >> x, x & 1 ? od.eb(x) : ev.eb(x);

    if (k == 0)
    {
        if (od.size() && ev.size())
            cout << -1 << endl;
        else if (od.size())
        {
            for (auto x: od)
                cout << x << ' ';
            cout << endl;
        }
        else if (ev.size())
        {
            for (auto x: ev)
                cout << x << ' ';
            cout << endl;
        }

        return;
    }

    bool flip = false;
    int m = k + 1;
    if (od.size() >= (m + 1) / 2 and ev.size() >= m / 2)
        ;
    else if (ev.size() >= (m + 1) / 2 and od.size() >= m / 2)
        swap(od, ev), flip = true;
    else
    {
        cout << -1 << endl;
        return;
    }

    // od, ev, od, ev...
    int ptrod = 0, ptrev = 0;
    vector<int> res;

    for (int i = 1; i <= k + 1; i++)
        i & 1 ? res.eb(od[ptrod++]) : res.eb(ev[ptrev++]);

    int lst = res.back();
    res.pop_back();

    int lst2 = res.back();

    if (flip)
        swap(od, ev);

    if (lst2 & 1)
        while (ptrod < od.size())
            res.eb(od[ptrod++]);
    else
        while (ptrev < ev.size())
            res.eb(ev[ptrev++]);

    res.eb(lst);
    if (lst & 1)
        while (ptrod < od.size())
            res.eb(od[ptrod++]);
    else
        while (ptrev < ev.size())
            res.eb(ev[ptrev++]);

    for (int i = 0; i < n; i++)
        cout << res[i] << " \n"[i == n - 1];
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# M - 猫猫虫想吃麦香鱼 2

> 关键词：通信，二进制编码

## 思路

不好想的点在于：第三层每个节点的父亲可能不一样，但传递信息不允许重复元素且打乱顺序。

考虑利用编号从左向右的单调性。设第二层最后一个节点编号为 $k$，我们要还原第三层的父亲。

注意到第三层的编号是单调不减的，而且第三层父亲的编号也是单调不减的，所以**我们只需要知道第二层从左向右各个节点有几个儿子即可**。设第二层每个节点的儿子数量为 $c_2,c_3,\ldots,c_k$，由于第三层一共有 $n-k$ 个节点，有 $\sum_{i=2}^{k}c_i=n-k$。并且我们知道第二层最多有 $n-2$ 个节点。

我们可以考虑使用 $n-2$ 个二进制位来编码第三层节点的父亲。设第二层每个节点的儿子数量为 $c_2,c_3,\ldots,c_k$，例如 $c_2=2,\quad c_3=0,\quad c_4=1$，可以表示为如下的样子：

```text
节点 2       节点 3      节点 4
  **           空           *
       |              |
       
考虑将上面的图编码成二进制，使用 1 表示当前第二层节点有一个第三层儿子，0 表示切换到下一个第二层节点。因此 ** || * 对应二进制 11001
```

> [!TIP]
>
> 可以证明恰好需要 $n-2$ 位，因为需要 $n-k$ 个 $1$ 表示第三层节点，$k-2$ 个 $1$ 表示第二层节点之间的分界。

我们考虑怎么将这 $n-2$ 个二进制位转化成不重复的整数序列。我们可以只传那些在二进制中为 $1$ 的位置。这样最多传 $n-2$ 个，由于接收方不知道树的节点数 $n$，因此我们可以始终发送一个数字 $n-1$，正好它是结束标记。

## Code

```c++
// Problem: M
// Contest: QOJ - （2026）第七届辽宁省大学生程序设计竞赛 (沈阳)
// URL: https://qoj.ac/contest/4707/problem/25517
// Time: 2026-11-18 20:41:52
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#ifdef LOCAL
#include "Debug.hpp"
#else
#define debug(...) ((void) 0)
#endif

// #define endl '\n'
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

void first()
{
    int n;
    cin >> n;

    vector<int> p(n + 1), cnt(n + 1);

    int k = 1;
    for (int i = 2; i <= n; i++)
    {
        cin >> p[i];
        p[i] == 1 ? k = i : cnt[p[i]]++;
    }

    vector<int> res;
    int ptr = 0;

    for (int i = 2; i <= k; i++)
    {
        for (int j = 1; j <= cnt[i]; j++)
            res.eb(++ptr);

        if (i < k)
            ptr++;
    }

    res.eb(n - 1);

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << " ";

    cout << endl;
}

void second()
{
    int m;
    cin >> m;

    vector<int> a(m);

    int mx = 0;
    for (auto &x: a)
        cin >> x, mx = max(mx, x);

    int n = mx + 1, k = n - m + 1;
    vector<int> info(n), res(n + 1);

    for (auto x: a)
    {
        if (x != n - 1)
            info[x] = 1;
    }

    for (int i = 2; i <= k; i++)
        res[i] = 1;

    int par = 2, ptr = k + 1;

    for (int i = 1; i <= n - 2; i++)
    {
        if (info[i])
            res[ptr++] = par;
        else
            par++;
    }

    cout << n << endl;

    for (int i = 2; i <= n; i++)
        cout << res[i] << " ";

    cout << endl;
}


int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T;
    string op;
    cin >> op >> T;

    if (op == "first")
    {
        while (T--)
            first();
    }
    else
    {
        while (T--)
            second();
    }

    return 0;
}

```

