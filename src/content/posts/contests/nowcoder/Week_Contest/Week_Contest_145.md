---
title: 牛客周赛 Round 145
published: 2026-05-24
description: "Nowcoder Week Contest 145"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 145](https://ac.nowcoder.com/acm/contest/134981)

# A - 小红的好串

> 关键词：签到

## Code

```c++
// Problem: 小红的好串
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136016/A
// Time: 2026-05-24 21:32:41
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
    string s;
    cin >> s;

    map<char, int> mp;
    for (auto c: s)
        mp[c]++;
    if (mp.size() == 2)
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

# B - 小红的好串计数

> 关键词：模拟

## 思路

正难则反，考虑计算不好的串的贡献。注意到不好的串一定是连续的，计算坏串贡献的表达式与计算全部子串的表达式相同。

## Code

```c++
// Problem: 小红的好串计数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136016/B
// Time: 2026-05-24 21:34:13
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
    string s;
    cin >> n >> s;

    ll tot = (n + 1) * n / 2, res = 0;
    for (ll i = 0; i < n;)
    {
        ll j = i;
        while (j < n && s[j] == s[i])
            j++;
        res += (j - i + 1) * (j - i) / 2;
        i = j;
    }
    cout << tot - res << endl;
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

# C - 小红的染色平均数

> 关键词：数学

## 思路

注意到操作并不改变所有元素的和，根据平均数相等，且目标总和之和等于原数组总和 $sum$：有 $\frac{S_0'}{cnt_0} = \frac{S_1'}{cnt_1}$ 和 $S_0' + S_1' = sum$，将 $S_1' = sum - S_0'$ 代入第一个等式，有 $\frac{S_0'}{cnt_0} = \frac{sum - S_0'}{cnt_1}$，移项有 $S_0' (cnt_0 + cnt_1) = sum \cdot cnt_0$，$S_0' = \frac{sum \cdot cnt_0}{n}$，如果 `(sum * cnt0) % n != 0`，则判定无解。

## Code

```c++
// Problem: 小红的染色平均数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136016/C
// Time: 2026-05-24 21:42:18
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
    for (auto &x: a)
        cin >> x;

    ll sum = accumulate(all(a), 0LL);

    string s;
    cin >> s;

    ll sum0 = 0, sum1 = 0, cnt0 = 0, cnt1 = 0;

    for (int i = 0; i < n; i++)
    {
        if (s[i] == '0')
            sum0 += (ll) a[i], cnt0++;
        else
            sum1 += (ll) a[i], cnt1++;
    }

    if ((sum * cnt0) % n != 0)
    {
        cout << "-1" << endl;
        return;
    }

    cout << abs((cnt1 * sum0 - cnt0 * sum1) / (cnt0 + cnt1)) << endl;
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

# D - 小红的排列构造

> 关键词：构造

## 思路

相比于分配数字，我们考虑分配下标。

既然对于每个位置 $i$，都要满足 $b_i = a_i$ 或 $c_i = a_i$，这意味着每个下标 $i$ 都要“分配”给 $b$ 或者 $c$ 作为匹配位。我们要确保 $b$ 和 $c$ 各自分配到恰好 $\frac{n}{2}$ 个下标。

1. 处理出现 2 次的数字：如果某个数字 $x$ 在下标 $i$ 和 $j$ 出现了两次。因为排列里不能有重复数字，所以 $b$ 只能在其中一个下标匹配 $x$，$c$ 在另一个下标匹配 $x$。

​	操作：将下标 $i$ 分配给 $b$，下标 $j$ 分配给 $c$。

2. 处理出现 1 次的数字：对于只出现一次的数字，它可以分配给 $b$，也可以分配给 $c$。

​	操作：我们检查 $b$ 当前分配到的匹配位数量，如果还不满 $\frac{n}{2}$，就分配给 $b$；否则全部分配给 $c$。

3. 填补空缺，构造完整排列：剩下的 $\frac{n}{2}$ 个空位，只要找出 $1 \sim n$ 中**还没有被该数组使用的数字**，依次填入空位即可。因为填入的是剩余未使用过的数字，所以能保证构成一个合法的排列。

## Code

```c++
// Problem: 小红的排列构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136016/D
// Time: 2026-05-24 21:58:45
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
    vector<int> cnt(n + 1, 0);

    vector<vector<int>> pos(n + 1);

    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        cnt[a[i]]++;
        pos[a[i]].push_back(i);
    }

    for (int i = 1; i <= n; i++)
    {
        if (cnt[i] >= 3)
        {
            cout << -1 << endl;
            return;
        }
    }

    vector<int> b(n, 0), c(n, 0);
    vector<bool> stb(n + 1, false), stc(n + 1, false);
    int usedb = 0;

    for (int i = 1; i <= n; i++)
    {
        if (cnt[i] == 2)
        {
            int p1 = pos[i][0], p2 = pos[i][1];

            b[p1] = i, stb[i] = true, usedb++;

            c[p2] = i, stc[i] = true;
        }
    }

    for (int i = 1; i <= n; i++)
    {
        if (cnt[i] == 1)
        {
            int p = pos[i][0];
            if (usedb < n / 2)
                b[p] = i, stb[i] = true, usedb++;
            else
                c[p] = i, stc[i] = true;
        }
    }

    vector<int> left_b, left_c;
    for (int i = 1; i <= n; i++)
    {
        if (!stb[i])
            left_b.push_back(i);
        if (!stc[i])
            left_c.push_back(i);
    }

    int idxb = 0, idxc = 0;
    for (int i = 0; i < n; i++)
    {
        if (b[i] == 0)
            b[i] = left_b[idxb++];
        if (c[i] == 0)
            c[i] = left_c[idxc++];
    }

    for (auto i: b)
        cout << i << " ";
    cout << endl;
    for (auto i: c)
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

# E - 小红的染色生成树

> 关键词：构造，Kruskal

## 思路

由于需要恰好出现两次，分别对 $0, 1$，$0, 2$，$1, 2$ 做 $Kruskal$ 即可。

每个 $Kruskal$ 的过程需要扫两遍，第一遍强行挑出**第一条颜色为 A 的边**和**第一条颜色为 B 的边**加入并查集。这样就保证了如果能生成树，里面必定“恰好包含这两种颜色”；扫完第一遍后，假如一条 $a$ 或一条 $b$ 都找不到，就直接返回 `false`。第二遍正常扫，把树补全。最后检查并查集中所有点是否连通。

## Code

```c++
// Problem: 小红的染色生成树
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134981/E
// Time: 2026-05-25 19:13:36
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
const int N = 2e5 + 10;

struct Edge
{
    int u, v, w;
} edges[N];

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
};

void solve()
{
    int n, m;
    cin >> n >> m;

    for (int i = 0; i < m; i++)
        cin >> edges[i].u >> edges[i].v >> edges[i].w;

    auto Kruskal = [&](int a, int b) -> bool
    {
        DSU dsu(n);
        vector<pii> res;
        bool f1 = false, f2 = false;

        for (int i = 0; i < m; i++)
        {
            int u = edges[i].u, v = edges[i].v, w = edges[i].w;
            if (w == a && !f1)
            {
                dsu.unite(u, v);
                res.push_back({u, v});
                f1 = true;
            }
            else if (w == b && !f2)
            {
                dsu.unite(u, v);
                res.push_back({u, v});
                f2 = true;
            }
        }

        if (!f1 || !f2)
            return false;

        for (int i = 0; i < m; i++)
        {
            int u = edges[i].u, v = edges[i].v, w = edges[i].w;
            if (w != a && w != b)
                continue;

            if (dsu.unite(u, v))
                res.push_back({u, v});
        }

        if (dsu.comp_cnt == 1)
        {
            for (auto &[u, v]: res)
                cout << u << " " << v << endl;
            return true;
        }
        return false;
    };

    if (!Kruskal(0, 1) && !Kruskal(0, 2) && !Kruskal(1, 2))
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

# F - 小红的好串构造

> 关键词：构造，数学

## 思路

为了让 $k$ 的计算最简单，我们考虑一种构造方法：让夹在中间的字符隔断两边的计算。

$$\underbrace{a \dots a}_{x \text{ 个}} + \mathbf{b} + \mathbf{a} + \underbrace{c \dots c}_{z \text{ 个}}$$

在这个字符串中，一共只有三种字符 `a`, `b`, `c`。我们来统计它的好串数量：

1. 含 `a` 和 `b` 的好串：必须包含 `b`。左端点可以在前面的 $x$ 个 `a` 或是 `b` 自己身上（共 $x+1$ 种选择），右端点可以是 `b` 自己或是后面紧跟的那个 `a`（共 2 种选择）。减去只有 `b` 自己的一种情况。总数为 $2(x+1) - 1 = \mathbf{2x + 1}$。
2. 含 `a` 和 `c` 的好串：不能包含 `b`。所以左端点**只能**是中间那个被 `b` 和 `c` 夹着的孤独的 `a`（1 种选择）。右端点落在后面 $z$ 个 `c` 的任意位置。总数为 $\mathbf{z}$。
3. 含 `b` 和 `c` 的好串：只要同时包含 `b` 和 `c`，就必定会跨过中间的那个 `a`，导致含有 3 种字符，**全部不合法**，总数为 $\mathbf{0}$。

将它们相加，**总好串数量** $Sum = 2x + 1 + z$。又因为字符串总长度 $n = x + 1 + 1 + z \implies z = n - x - 2$。

代入得到：$Sum = 2x + 1 + (n - x - 2) = \mathbf{n + x - 1}$。根据已知条件，$Sum = k$。

且由于题目约束：$n-1 \le k \le 2n-4$，最小值 $k = n-1 \implies x = 0$，最大值 $k = 2n-4 \implies x = n-3 \implies z = 1$，因此 $x$ 和 $z$ 永远是合法的非负数。

## Code

```c++
// Problem: 小红的好串构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134981/F
// Time: 2026-05-25 20:10:20
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

    ll x = k - n + 1;
    ll z = n - 2 - x;

    // x 个 'a' + "ba" + z 个 'c'
    string res = string(x, 'a') + "ba" + string(z, 'c');

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

