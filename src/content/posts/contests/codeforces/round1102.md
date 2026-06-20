---
title: cf round 1102
status: editing
published: 2026-06-07
description: "Codeforces Round 1102 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1102.(Div. 2)](https://codeforces.com/contest/2234)

# A - Euclid, Sequence and Two Numbers

> 关键词：数学，思维

## 思路

我们需要找到满足欧几里得算法的排列方式的性质。

对于任意两个正整数 $u,v$，余数满足：$0\leq u\bmod v<v$。

题目要求序列中的每一个数都是正整数，因此余数不能为 $0$。于是：$0<a_{i+2}<a_{i+1}$。

这意味着：$a_2>a_3>a_4>\cdots>a_n$。

同时，题目要求：$a_1=x\geq y=a_2$，因此，合法序列必然满足：$a_1\geq a_2>a_3>\cdots>a_n$。

当 $n\geq 3$ 时，实际上 $a_1$ 也必须严格大于 $a_2$。否则，如果 $a_1=a_2$，那么：$a_1\bmod a_2=0$。

但 $a_3$ 必须是正整数，所以，当 $n\geq 3$ 时：$a_1>a_2>a_3>\cdots>a_n$、

**因此满足要求的合法序列一定是严格递减的**，只需要将给定数组递减排序，检查每对三元组是否成立即可。

## Code

```c++
// Problem: CF 2234 A
// Contest: Codeforces - Codeforces Round 1102 (Div. 2)
// URL: https://codeforces.com/contest/2234/problem/A
// Time: 2026-06-07 22:35:09
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

    vector<ll> a(n);
    for (auto &x: a)
        cin >> x;

    sort(all(a), greater<ll>());

    for (int i = 0; i + 2 < n; ++i)
    {
        if (a[i] % a[i + 1] != a[i + 2])
        {
            cout << -1 << endl;
            return;
        }
    }

    cout << a[0] << " " << a[1] << endl;
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

# B - Palindrome, Twelve and Two Terms

> 关键词：模拟

## 思路

从最接近 $n$ 的 $b$ 值开始模拟即可，虽然还有 $O(1)$ 的解法，但这种解法也是可以通过的。

## Code

```c++
// Problem: CF 2234 B
// Contest: Codeforces - Codeforces Round 1102 (Div. 2)
// URL: https://codeforces.com/contest/2234/problem/B
// Time: 2026-06-07 22:51:38
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

    auto check = [&](ll a) -> bool
    {
        string s = to_string(a);
        string ss = s;
        reverse(ss.begin(), ss.end());

        return ss == s;
    };

    for (ll b = n / 12 * 12; b >= 0; b -= 12)
    {
        ll a = n - b;

        if (check(a))
        {
            cout << a << " " << b << endl;
            return;
        }
    }

    cout << -1 << endl;
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

# C - Vessels, Heights and Two Versions (Easy Version)

> 关键词：图论建模，并查集（DSU）

## 思路

假设要求容器 $r$ 保持为空，即 $w_r=0$，现在考虑另一个容器 $v$，最多能装多少水？

从 $v$ 出发，沿着某条路径 $P$ 走向 $r$，假设路径上的隔板高度依次为 $h_{e_1},h_{e_2},\ldots,h_{e_k}$，令路径上的最高隔板为 $H=\max_{e \in P} h_e$。显然沿着 $P$ 路径可以达到的水位最大是 $H$，但 $v \to r$ 不一定只有 $P$ 一条路径，只要存在一条较容易被水流打通的路径，就足以限制 $v$ 的水位。因此：$d_r(v)=\min_{P:v \to r}\left(\max_{e \in P} h_e\right)$。我们需要**最小化路径最大值**，这个答案就是最终容器 $v$ 的最大水位。

此外，可以证明每个容器都取最大值是仍然合法的。

我们考虑使用并查集计算每个容器的答案，首先将所有连接口按照高度从小到大排序。一开始，不加入任何边，每个容器都是一个独立的连通块。随后依次加入高度为 $H$ 的边，并合并边两端的联通块。

**当某个容器第一次与空容器 $r$ 连通时，当前处理的高度 $H$ 就是该容器的答案。**

> 原因是：
>
> - 此时存在一条从该容器到 $r$ 的路径，路径上所有边的高度都不超过 $H$；
> - 在处理高度小于 $H$ 的边时，它还无法与 $r$ 连通；
> - 所以能够打通它们的最小瓶颈高度恰好为 $H$。

此外，并不需要逐个记录容器答案。假设处理高度为 $H$ 的边时，一侧的连通块已经包含空容器 $r$，另一侧不含 $r$，大小为 $s$，合并后，另一侧连通块中的 $s$ 个容器第一次与 $r$ 连通，因此这 $s$ 个容器的最大水位全部为 $H$，答案增加 $H \times s$。

## Code

```c++
// Problem: CF 2234 C
// Contest: Codeforces - Codeforces Round 1102 (Div. 2)
// URL: https://codeforces.com/contest/2234/problem/C
// Time: 2026-06-07 23:03:39
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
    vector<int> fa;
    vector<int> sz;

    DSU()
    {
    }

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

struct Edge
{
    int u, v;
    ll h;

    bool operator<(const Edge &other) const
    {
        return h < other.h;
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<Edge> edges;

    for (int i = 1; i <= n; i++)
    {
        ll h;
        cin >> h;

        int j = i % n + 1;
        edges.push_back({i, j, h});
    }

    sort(all(edges));

    vector<ll> res(n + 1);

    for (int i = 1; i <= n; i++)
    {
        DSU dsu(n);
        ll sum = 0;

        for (auto [u, v, h]: edges)
        {
            int fu = dsu.find(u), fv = dsu.find(v);
            if (fu == fv)
                continue;

            int root = dsu.find(i);

            if (fu == root)
                sum += h * dsu.sz[fv];
            else if (fv == root)
                sum += h * dsu.sz[fu];

            dsu.merge(fu, fv);
        }

        res[i] = sum;
    }

    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

