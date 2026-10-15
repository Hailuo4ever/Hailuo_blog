---
title: 2024 南京区域赛
published: 2026-10-12
description: "The 2024 ICPC Asia Nanjing Regional Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 区域赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 3rd Universal Cup. Stage 16: Nanjing - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/1828)

# B - Birthday Gift

> 关键词：思维，Ad-hoc，不变量

## 思路

**本题的关键结论：原字符串中，只有位于不同奇偶位置的两个相同字符，才能通过操作相互消除**。

一个比较容易推出的结论是：删除以后，下标的奇偶性是不变的。可以先忽略 $2$ 带来的影响，每次只删除恰好两个相邻字符，下标要么不变要么减 $2$。因此两个同种类字符必须奇偶性不同，才能够消除。

**但我们还需要证明：奇偶位置的相同字符只要数量足够，就一定可以配对删除**。

考虑等价转化题目的删除条件。我们仍然暂时不考虑 $2$，**把偶数位置上的 $0,1$ 全部取反**。这样删除相邻相同的规则就变成了删除相邻不同字符。**现在问题变成：给定一个只含有 `0` 和 `1` 的字符串，每次可以删除相邻的 `01` 或 `10`，求最短长度**。

注意到这个问题中，每次删除都会恰好减少一个 $0$ 和一个 $1$。因此显然他们的数量差 $D=C_0-C_1$ 是不变的，因此答案下界为 ${ans\ge |C_0-C_1|}$。**这个下界一定是可以达到的**，因为只要字符串中同时存在 $0,1$，就一定存在相邻的不同字符。

以上就完成了奇偶性结论的证明。

在没有 $2$ 的情况下，$\boxed{ans=|(Odd_0+Even_1)-(Odd_1+Even_0)|}$，存在 $2$ 时，它可以变成数量较少的字符来缩小下界 $D$。由于 $2$ 在取反后也可以任意选，所以它的选择没有限制，且不需要区分奇偶位置，它可以自由产生 $+1$ 或 $-1$ 的贡献。

如果补齐下界以后还有剩余的 $2$，就让 $2$ 自己和自己消。

## Code

```c++
// Problem: B. Birthday Gift
// Contest: QOJ - Nanjing Regional 2024
// URL: https://qoj.ac/contest/1828/problem/9565/statement/zh_cn
// Time: 2026-10-13 09:13:38
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
    string s;
    cin >> s;

    int n = s.size();
    s = ' ' + s;

    vector<array<int, 3>> cnt(2);
    for (int i = 1; i <= n; i++)
        cnt[i & 1][s[i] - '0']++;

    int d = abs((cnt[1][0] + cnt[0][1]) - (cnt[1][1] + cnt[0][0])); // 偶数位置取反
    int z = cnt[0][2] + cnt[1][2];

    if (d >= z)
        cout << d - z << endl;
    else
        cout << ((z - d) % 2) << endl;
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

# E - 左移 3

> 关键词：枚举

## 思路

实际上，字符串 `nanjing` 没有相等的非空真前缀和真后缀，因此两个 `nanjing` 不可能相互重叠。

把整个字符串看作一个环，所有 `nanjing` 就是环上互不重叠的若干段，每段长度为 $7$，左移操作相当于改变环形字符串中的切割位置。一个 `nanjing` 只有在切割位置落在它内部时才会被截断。每个 `nanjing` 最多有 \(6\) 个内部切割位置。因为所有匹配互不重叠，所以在连续 \(7\) 个切割位置中，一定存在至少一个位置不会截断任何 `nanjing`。

因此，如果 \(k\ge 6\)，一定可以找到一种左移方案，保留环上所有的完整 `nanjing`，因此有 ${k\gets\min(k,6)}$。

把前 $k$ 个字符拼接到后面即可。可以证明，拼接后统计到的所有匹配，一定可以通过某一次合法左移同时保留下来。

## Code

```c++
// Problem: E. Left Shifting 3
// Contest: QOJ - Nanjing Regional 2024
// URL: https://qoj.ac/contest/1828/problem/9568/statement/zh_cn
// Time: 2026-10-12 22:44:32
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
    int n, k;
    cin >> n >> k;

    string s;
    cin >> s, s = ' ' + s;

    k = min(6, k);
    for (int i = 1; i <= k; i++)
        s += s[i];

    if (n < 7)
    {
        cout << 0 << endl;
        return;
    }

    int res = 0;
    for (int i = 1; i + 7 <= s.size(); i++)
    {
        if (s.substr(i, 7) == "nanjing")
            res++;
    }

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

# G - Binary Tree

> 关键词：点分治

## 思路

树上涉及到二分的问题，我们可以考虑利用**重心**的一个性质：**删除重心后，所有剩余连通块的大小都不会超过原树节点数的一半**。删除重心后，最多有 $3$ 个连通块。

但考虑一个问题，如果直接询问重心和它的一个邻居，并不能保证每次都至少排除一半的节点。

> 例如：假设删除重心后，三个连通块分别有 $4,3,2$ 个点，如果询问 $c$ 和大小为 $4$ 的连通块中的邻居，而结果表示 $c$ 更近，剩余候选节点的数量就是 $3+2+1=6$。

**正确的做法是：考虑询问重心 $c$ 的两个子树 $u,v$**，我们讨论一下不同返回值的情况：

返回 $0$：表示 $s$ 位于 $u$ 连通块里，返回 $1$：表示 $s$ 可能就是重心 $c$，也可能在第三个连通块中，返回 $2$：表示 $s$ 位于 $v$ 连通块里。

# J - Social Media

> 关键词：图论，分类讨论

## 思路

讨论不同种类的两个端点对答案的影响。记现在已经能看到的评论为 $sum$ 条。分为四种情况：

1. 两个端点都是已有好友：此时不需要新增，对答案的贡献为 `sum++`。
2. 其中一个端点 $u$ 是已有好友：想获得这条评论需要添加另一个用户，即 `w[v]++`。
3. 两个都不是好友：想获得这条评论需要同时添加 $u,v$ 为好友，即 `cnt[u][v]++`。
4. 有自环：只需要考虑 $u$ 的好友情况。

假设最终选择两个不同的非好友用户 \(u,v\)。新增他们后，能够看到的评论可以拆分为三部分：

1. 原本就能看到的 $sum$ 条。
2. 分别添加 \(u,v\) 后，增加的 \(w[u]+w[v]\) 条。
3. 只有同时添加 \(u,v\) 才能看到的 \(cnt[u][v]\) 条。

由于大部分的 $cnt[u][v]=0$，我们开个 `map` 记录一下，然后取最大值即可。

## Code

```c++
// Problem: J. Social Media
// Contest: QOJ - Nanjing Regional 2024
// URL: https://qoj.ac/contest/1828/problem/9573/statement/zh_cn
// Time: 2026-10-12 23:13:18
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
    int n, m, k;
    cin >> k >> m >> n;

    vector<vector<int>> g(n + 1);
    vector<int> a(k + 1), c(n + 1);

    for (int i = 1; i <= k; i++)
        cin >> a[i], c[a[i]] = 1;

    int sum = 0;
    vector<int> w(n + 1);
    map<pii, int> mp;

    for (int i = 1, u, v; i <= m; i++)
    {
        cin >> u >> v, g[u].eb(v), g[v].eb(u);

        if (u > v)
            swap(u, v);
        else if (u == v)
        {
            c[u] ? sum++ : w[u]++;
            continue;
        }

        if (c[u] && c[v])
            sum++;
        else if (c[u])
            w[v]++;
        else if (c[v])
            w[u]++;
        else
            mp[{u, v}]++;
    }

    int res = 0;
    for (auto [k, x]: mp)
    {
        auto &[u, v] = k;
        res = max(res, w[u] + w[v] + x);
    }

    int mx1 = 0, mx2 = 0;
    for (int i = 1; i <= n; i++)
    {
        if (w[i] > mx1)
            mx2 = mx1, mx1 = w[i];
        else if (w[i] > mx2)
            mx2 = w[i];
    }
    // cerr << mx1 << ' ' << mx2 << endl;

    res = max(res, mx1 + mx2);
    cout << res + sum << endl;
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

# K - Strips

> 关键词：贪心

## 思路

假设黑色格子的位置是 $b_1<b_2<\cdots<b_m$，我们添加两个边界 $b_0=0,\quad b_{m+1}=w+1$。那么每两个相邻黑格之间的合法位置是 $[b_i+1,b_{i+1}-1]$。且各个区间的情况是互不影响的。

首先考虑如何最少的放纸条。假设某个区间中，最左侧还没有被覆盖的红格位置为 $x$，显然应该把纸条的左端点和 $x$ 重合。这样能使右端点尽可能靠右，尝试覆盖尽可能多的后续红格。

现在我们知道了最少放多少条纸带，但我们并没有考虑黑格子，现在加入这个的考虑。我们从右向左检查，如果右边界不合法，就向左推动前面的纸条。可以证明这个策略是正确的。

> 首先，左移过程是不会漏掉红格的。因为我们移动某个纸条的时候，一定是因为它的右边界和下一张纸条的左边界发生了冲突，所以下一张纸条会接管左移出的那部分空白区域。可以想象一下，这是一个从右往左逐渐压紧纸条的过程。
>
> 其次，只要左边界越界就一定无解，因为纸条不能重叠，一旦发生越界就证明，把所有纸条堆在一起，也放不下。

## Code

实现左移纸条的部分：假设贪心之后，左端点依次为 $p_1,p_2,\ldots,p_c$。原本放纸条的方式是不重叠的，有 $p_{i+1}\ge p_i+k$。对于最后一张纸条，设该区间最右侧的合法格子位置为 $R$，有 ${p_c\gets\min(p_c,R-k+1)}$，然后不断移动前面的纸条：${p_i\gets\min(p_i,p_{i+1}-k)}$。

```c++
// Problem: K. Strips
// Contest: QOJ - Nanjing Regional 2024
// URL: https://qoj.ac/contest/1828/problem/9574/statement/zh_cn
// Time: 2026-10-13 11:54:40
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
    int n, m, k, w;
    cin >> n >> m >> k >> w;

    vector<int> a(n + 1), b(m + 2);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= m; i++)
        cin >> b[i];

    b[m + 1] = w + 1;
    sort(a.begin() + 1, a.end()), sort(b.begin() + 1, b.end());

    vector<int> res;

    for (int i = 1, j = 1; i <= m + 1; i++)
    {
        // [L, R] 为当前段合法区间，lst 表示上一张纸条的右端点
        int L = b[i - 1] + 1, R = b[i] - 1, lst = -1;
        vector<int> pos;

        while (j <= n && a[j] < b[i])
        {
            if (a[j] > lst)
                pos.eb(a[j]), lst = a[j] + k - 1;

            j++;
        }

        if (pos.empty())
            continue;

        for (int idx = pos.size() - 1; idx >= 0; idx--)
        {
            if (idx == pos.size() - 1)
                pos[idx] = min(pos[idx], R - k + 1);
            else
                pos[idx] = min(pos[idx], pos[idx + 1] - k);

            if (pos[idx] < L)
            {
                cout << -1 << endl;
                return;
            }
        }

        for (auto x: pos)
            res.eb(x);
    }

    cout << res.size() << endl;
    for (int i = 0; i < res.size(); i++)
        cout << res[i] << " \n"[i == res.size() - 1];
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

