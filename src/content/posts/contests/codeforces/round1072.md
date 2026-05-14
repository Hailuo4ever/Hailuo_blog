---
title: cf round 1072
status: "editing"
published: 2026-05-13
description: "Codeforces Round 1072 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1072 (Div. 3)](https://codeforces.com/contest/2184)

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

