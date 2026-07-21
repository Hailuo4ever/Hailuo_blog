---
title: 牛客周赛 Round 153
published: 2026-07-19
description: "Nowcoder Week Contest 153"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 153 内测](https://ac.nowcoder.com/acm/contest/137895)

# A - 小红的字符串处理

> 关键词：签到

## Code

```c++
// Problem: 小红的字符串处理
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/A
// Time: 2026-07-14 18:20:58
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    string s;
    cin >> s;

    for (int i = 0; i < s.size(); i++)
        cout << s[i] << ". "[i == s.size() - 1];
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

# B - 小红的菊花构造

> 关键词：签到

## Code

```c++
// Problem: 小红的菊花构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/B
// Time: 2026-07-14 18:21:57
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n, k;
    cin >> n >> k;

    for (int i = 1; i <= n; i++)
    {
        if (i == k)
            continue;
        cout << k << ' ' << i << endl;
    }
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

# C - 小红的swap（easy）

> 关键词：模拟

## 思路

在 `Easy Version` 中，我们可以把 $c$ 当作交换桥梁。题目保证 $s$ 和 $t$ 中 $1$ 的数量相同，所以每一个“缺少 $1$”的位置，都能找到一个“多出 $1$”的位置与它配对。

设位置 $x$ 属于类型 A，此时 $s_x=0$，目标是 $1$；位置 $y$ 属于类型 B，此时 $s_y=1$，目标是 $0$。

对于这样一对错误位置，我们可以这样操作：`swap(x, c)`, `swap(y, c)`, `swap(x, c)`

操作需要 $3k$ 次，显然是符合要求的。

## Code

```c++
// Problem: 小红的swap（easy）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/C
// Time: 2026-07-14 18:23:19
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    string s, t;
    cin >> s >> t;

    s = " " + s, t = " " + t;

    vector<int> pos0, pos1;
    vector<bool> st(n + 1, false);

    for (int i = 1; i <= n; i++)
    {
        if (s[i] == '0' && t[i] == '1')
            pos1.eb(i);
        else if (s[i] == '1' && t[i] == '0')
            pos0.eb(i);
    }

    vector<int> res;
    for (int i = 0; i < pos0.size(); i++)
    {
        int x = pos0[i], y = pos1[i];
        res.eb(x), res.eb(y), res.eb(x);
    }

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << endl;
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

# D - 小红的swap（hard）

> 关键词：模拟

## 思路

对于 `Hard Version`，考虑最小的操作次数。我们仍然设不相同的位置共有 $2k$ 个，分为两类。

可以把所有错误位置**串成一条链**，只让额外字符 $2$ 进入字符串一次、离开字符串一次，从而将操作次数优化为 $2k+1$。

考虑证明过程。首先每个错误位置都必须至少操作一次，如果一个错误位置从未被选择，那么它的字符永远不会改变，也就不可能满足 $s_i=t_i$，一定至少需要 $2k$ 次操作。

而一开始 $c=2$，它被换进来后一定有一个位置需要再选一次来把 $2$ 换出去。所以理论下界为 $2k+1$。

## Code

```c++
// Problem: 小红的swap（hard）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/D
// Time: 2026-07-14 19:54:20
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    string s, t;
    cin >> s >> t;

    s = " " + s, t = " " + t;

    vector<int> pos0, pos1;
    vector<bool> st(n + 1, false);

    for (int i = 1; i <= n; i++)
    {
        if (s[i] == '0' && t[i] == '1')
            pos1.eb(i);
        else if (s[i] == '1' && t[i] == '0')
            pos0.eb(i);
    }

    if (pos0.empty() || pos1.empty())
    {
        cout << 0 << endl;
        return;
    }

    vector<int> res;
    for (int i = 0; i < pos0.size(); i++)
    {
        int x = pos0[i], y = pos1[i];
        res.eb(x), res.eb(y);
    }

    res.eb(pos0[0]);

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << endl;
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

# E - 小红的分割线

> 关键词：计算几何

## 思路

首先枚举两个点所组成的连线，记作 $A,B$，再枚举其它点，记作 $P$。

考虑两个向量 $\overrightarrow{AB}=(x_j-x_i,\ y_j-y_i)$，$\overrightarrow{AP}=(x_k-x_i,\ y_k-y_i)$，通过计算两个向量的叉乘，可以判断 $P$ 位于有向直线 $A \to B$ 的哪一侧。如果叉乘结果 $>0$，则 $P$ 位于直线左侧，$<0$ 则 $P$ 位于直线右侧。

时间复杂度 $O(n^3)$。

## Code

```c++
// Problem: 小红的分割线
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/E
// Time: 2026-07-15 19:55:13
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<pll> p(n);

    for (auto &[x, y]: p)
        cin >> x >> y;

    int res = 0;

    for (int i = 0; i < n; i++)
    {
        for (int j = i + 1; j < n; j++)
        {
            int l = 0, r = 0;

            for (int k = 0; k < n; k++)
            {
                if (k == i || k == j)
                    continue;

                ll x1 = p[j].first - p[i].first, y1 = p[j].second - p[i].second;
                ll x2 = p[k].first - p[i].first, y2 = p[k].second - p[i].second;

                ll mul = x1 * y2 - y1 * x2;

                if (mul > 0)
                    l++;
                else if (mul < 0)
                    r++;
            }

            if (l == r)
                res++;
        }
    }

    cout << res << endl;
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

# F - 小红的网格图构造 2.0

> 关键词：构造

## 思路

> [!NOTE]
>
> 约定下标从 $1$ 开始。

把网格划分成若干个**互不相交的 $2\times2$ 小块**，这是为了推出 $1$ 的数量下界，一共有 $L=\left\lfloor\frac n2\right\rfloor
\left\lfloor\frac m2\right\rfloor$ 个。保证每个小块至少有一个 $1$，有 $k \ge L$；每个小块至少有一个 $0$，有 $nm-k \ge L$。因此有解的必要条件为 $L \le k \le nm-L$。

我们让所有偶数行都变成交替序列 $010101...$，因为任何相邻两行，其中必定有一行是偶数行。由于偶数行填完后已经满足要求，奇数行初始为 $0$，逐个翻转成 $1$。

假如翻转完所有奇数行后还有剩余，说明此时 $m$ 一定是个奇数，把所有的偶数行从 $010101...$ 改成 $101010...$，可以额外增加一个 $1$，完成构造。

>注：奇数行一共可以增加 $\left\lceil\frac n2\right\rceil m$。如果 $m$ 是奇数，还可以通过翻转偶数行增加 $\left\lfloor\frac n2\right\rfloor$。所以最大数量为 $L+
>\left\lceil\frac n2\right\rceil m+
>\left\lfloor\frac n2\right\rfloor(m\bmod2)$，可以化简成 $nm-L$。因此所有符合条件的 $k$ 都可被构造出来。

## Code

```c++
// Problem: 小红的网格图构造 2.0
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/F
// Time: 2026-07-15 20:45:28
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n, m, k;
    cin >> n >> m >> k;

    int cnt = (n / 2) * (m / 2);

    if (k < cnt || k > n * m - cnt)
    {
        cout << "No" << endl;
        return;
    }

    int rest = k - cnt;
    vector<vector<int>> g(n + 1, vector<int>(m + 1, 0));

    for (int i = 2; i <= n; i += 2)
        for (int j = 2; j <= m; j += 2)
            g[i][j] = 1;

    cout << "Yes" << endl;
    for (int i = 1; i <= n; i += 2)
    {
        for (int j = 1; j <= m; j++)
        {
            if (rest == 0)
                goto end;

            g[i][j] = 1;
            rest--;
        }
    }

    if (rest == 0)
        goto end;

    for (int i = 2; i <= n; i += 2)
    {
        for (int j = 1; j <= m; j++)
            g[i][j] ^= 1;

        rest--;

        if (rest == 0)
            goto end;
    }

end:
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            cout << g[i][j];
            if (j == m)
                cout << endl;
        }
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

# G - 小红的网格图构造 1.0

> 关键词：构造

## 思路

> [!NOTE]
>
> 约定下标从 $1$ 开始。

连通块最多有 $\left\lceil\frac{nm}{2}\right\rceil$ 个。最大是棋盘黑白格填满。

初始化时在所有偶数行、偶数列放 $1$，每放一个 $1$，就代表多了一个连通块，让 `k--`。

初始化状态如下：

```c++
0000000
0101010
0000000
0101010
```

构造初始状态后，$k>0$ 表示当前连通块太少，需要增加。$k=0$ 表示已经完成构造。$k<0$ 表示当前连通块太多，需要合并。

$k>0$ 时，考虑如何增加连通块，代码部分如下：

```c++
if (k > 0 && !((i ^ j) & 1) && g[i][j] == 0)
{
    k--;
    g[i][j] = 1;
}
```

对于表达式 `!((i ^ j) & 1)`，异或的最低位表示奇偶性是否不同。若 $i,j$ 同奇偶，最低位为 $0$；异奇偶，最低位为 $1$。所以这个表达式表示 $i,j$ 奇偶性是否相同。

执行完以上逻辑后，图最多可能变为如下的形式：

```c++
1010101
0101010
1010101
0101010
```

$k<0$ 时，考虑如何减少连通块。分为水平桥和竖直桥两种方式。

水平桥：`bool horizontal = (j + 1 <= m && !(i & 1) && (j & 1));` 表示 $i$ 是偶数行，$j$ 是奇数列，右边有格子。用于连接偶数行的相邻岛，每次连接都会让 `k--`。

竖直桥：`bool vertical = (j == 2 && (i & 1) && i + 1 <= n);` 表示 $i$ 是奇数行，固定在第 $2$ 列且下面还有行。用于连接偶数行之间的连通块，每次连接也会让 `k--`。

## Code

```c++
// Problem: 小红的网格图构造 1.0
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137895/G
// Time: 2026-07-19 21:10:20
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n, m, k;
    cin >> n >> m >> k;

    if (k * 2 > n * m + 1)
    {
        cout << "No" << endl;
        return;
    }

    vector<vector<int>> g(n + 1, vector<int>(m + 1, 0));

    for (int i = 2; i <= n; i += 2)
    {
        for (int j = 2; j <= m; j += 2)
            k--, g[i][j] = 1;
    }

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            if (k > 0 && !((i ^ j) & 1) && g[i][j] == 0)
                k--, g[i][j] = 1;

    if (k < 0)
    {
        for (int i = 2; i <= n; i++)
            for (int j = 2; j <= m; j++)
            {
                bool col = (j == 2 && (i & 1) && i + 1 <= n);
                bool row = (j + 1 <= m && !(i & 1) && (j & 1));

                if (k < 0 && (col || row))
                    k++, g[i][j] = 1;
            }
    }

    if (k != 0)
    {
        cout << "No" << endl;
        return;
    }

    cout << "Yes" << endl;
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
            cout << g[i][j];
        cout << endl;
    }
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

