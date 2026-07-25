---
title: 2026 牛客多校3
published: 2026-07-24
description: "Nowcoder Multi-University Training Contest 3"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营3](https://ac.nowcoder.com/acm/contest/133878)

# A - Bitmask

> 关键词：位运算

## 思路

首先考虑怎么计算一个数的连续全 $1$ 段数量，从低位到高位编号为 $b_0,b_1,\ldots,b_{29}$，再人为增加一个恒为零的虚拟位 $b_{30}=0$。每一段连续的 $1$，在从低位向高位观察时，都会有且仅有一个位置满足：$b_j=1,\quad b_{j+1}=0$。

因此有 $f(x)=\sum_{j=0}^{29}[b_j=1\land b_{j+1}=0]$。考虑维护每一对相邻位置 $(b_j,b_{j+1})$，最终需要统计有多少相邻位变成了 $(1,0)$。

考虑某个固定二进制位 $j$，只有四种状态。假设这个位置原来的值为 $z\in\{0,1\}$，经过若干次操作后，它现在的值只取决于原来的 $z$，可以维护一个函数 $g_j:\{0,1\}\rightarrow\{0,1\}$，只需要保存两个值 $g_j(0),\quad g_j(1)$。

| $g_j(0)$ | $g_j(1)$ | 含义     |
| -------- | -------- | -------- |
| 0        | 0        | 恒为 $0$ |
| 0        | 1        | 保持原值 |
| 1        | 0        | 原值取反 |
| 1        | 1        | 恒为 $1$ |

初始时 $g_j(0)=0,\quad g_j(1)=1$。

考虑操作如何更新答案，设操作数 $x$ 的第 $j$ 位为 $c$。

1. 按位与：当前位变成 $g_j(z)\mathbin{\&}c$，更新 $g_j(0)\leftarrow g_j(0)\mathbin{\&}c$，$g_j(1)\leftarrow g_j(1)\mathbin{\&}c$。
2. 按位或：$g_j(0)\leftarrow g_j(0)\mathbin{|}c$，$g_j(1)\leftarrow g_j(1)\mathbin{|}c$。
3. 按位异或：$g_j(0)\leftarrow g_j(0)\oplus c$，$g_j(1)\leftarrow g_j(1)\oplus c$。

预处理相邻位置的初始情况。定义 $\operatorname{cnt}[j][u][v]$ 表示原始数组中有多少个 $a_i$ 满足 $\operatorname{bit}_j(a_i)=u$，$\operatorname{bit}_{j+1}(a_i)=v$。注意 $u,v$ 的可能取值只有 $0,1$。对于第 $j$ 对相邻位，原来是 $(u,v)$ 的数字，经过所有操作后会变成 $(g_j(u),g_{j+1}(v))$，对答案产生贡献当且仅当 $g_j(u)=1$ 且 $g_{j+1}(v)=0$。

**所以最后答案为：$\sum_{j=0}^{29}
\sum_{u=0}^{1}
\sum_{v=0}^{1}
\operatorname{cnt}[j][u][v]
[g_j(u)=1\land g_{j+1}(v)=0]$。**

## Code

> 时间复杂度 $O((n+m) N)$，可写作 $O(n+m)$

```c++
// Problem: Bitmask
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133878/A
// Time: 2026-07-24 16:19:56
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
const int N = 30;

ll cnt[N][2][2];
int g[N + 1][2];

void init()
{
    for (int i = 0; i < N; i++)
        g[i][0] = 0, g[i][1] = 1;

    g[N][0] = 0, g[N][1] = 0;
}

void solve()
{
    int n, m;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
    {
        bitset<N + 1> bits(a[i]);
        for (int j = 0; j < N; j++)
        {
            int u = bits[j], v = bits[j + 1];
            cnt[j][u][v]++;
        }
    }

    cin >> m;
    while (m--)
    {
        int op, x;
        cin >> op >> x;

        for (int j = 0; j < N; j++)
        {
            int d = (x >> j) & 1;

            if (op == 1)
                g[j][0] &= d, g[j][1] &= d;
            else if (op == 2)
                g[j][0] |= d, g[j][1] |= d;
            else
                g[j][0] ^= d, g[j][1] ^= d;
        }

        ll res = 0;
        for (int j = 0; j < N; j++)
            for (int u = 0; u < 2; u++)
                for (int v = 0; v < 2; v++)
                    if (g[j][u] == 1 && g[j + 1][v] == 0)
                        res += cnt[j][u][v];

        cout << res << endl;
    }
}

int main()
{
    fastio();

    init();

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# G - Matrix Marking

> 关键词：二维差分，前后缀处理

## 思路

假设数字 $x$ 出现在 $(r_0,c_0),(r_1,c_1),\ldots$，出现在若干行中，不同行号为 $r_0<r_1<\cdots<r_{k-1}$。

同一个数字在一行中也可能出现多次。对于这一行，我们实际上**只需要关心出现的最小列号和最大列号**。因为未来我们只会尝试找上方能找到的最靠左位置、下方能找到的最靠右位置。

由于输入规律，$x$ 出现的不同行号数组是递增的。考虑相邻两个出现行，我们要判断 $[r_i,r_{i+1}]$ 中哪些列可以被标记。

定义前缀最小列 $pre_i=\min_{0\le j\le i}mn_j$，后缀最大列 $suf_i=\max_{i\le j<k}mx_j$。如果满足 $pre_i<suf_{i+1}$，那么一定存在两个相同数字的位置，满足上方某个位置的列为 $pre_i$，下方某个位置的列为 $suf_{i+1}$。且行列递增。此时可以标记矩形 $[r_i,r_{i+1}]\times[pre_i,suf_{i+1}]$。

按照这个逻辑标记矩形，即求不同矩形的并集。使用二维差分来进行 $O(1)$ 的修改操作，并用二维前缀和还原。

## Code

```c++
// Problem: Matrix Marking
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133878/G
// Time: 2026-07-24 16:03:43
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
    int n, m;
    cin >> n >> m;

    int tot = n * m;

    vector<vector<pii>> pos(tot + 1);
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            int x;
            cin >> x;

            pos[x].eb(i, j);
        }
    }

    vector<vector<int>> c(n + 2, vector<int>(m + 2));

    auto modify = [&](int r1, int r2, int c1, int c2) -> void
    {
        c[r1][c1]++;
        c[r2 + 1][c1]--;
        c[r1][c2 + 1]--;
        c[r2 + 1][c2 + 1]++;
    };

    for (int v = 1; v <= tot; v++)
    {
        auto &p = pos[v];

        if (p.size() < 2)
            continue;

        vector<int> row, mx, mn;
        for (auto [r, col]: p)
        {
            if (row.empty() || row.back() != r)
            {
                row.eb(r);
                mn.eb(col);
                mx.eb(col);
            }
            else
            {
                mn.back() = min(mn.back(), col);
                mx.back() = max(mx.back(), col);
            }
        }

        int sz = row.size();
        if (sz < 2)
            continue;

        vector<int> pre(sz), suf(sz);
        pre[0] = mn[0], suf[sz - 1] = mx[sz - 1];

        for (int i = 1; i < sz; i++)
            pre[i] = min(pre[i - 1], mn[i]);

        for (int i = sz - 2; i >= 0; i--)
            suf[i] = max(suf[i + 1], mx[i]);

        for (int i = 0; i < sz - 1; i++)
        {
            int c1 = pre[i], c2 = suf[i + 1];
            if (c1 < c2)
                modify(row[i], row[i + 1], c1, c2);
        }
    }

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            c[i][j] += c[i - 1][j] + c[i][j - 1] - c[i - 1][j - 1];

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
            cout << (c[i][j] > 0 ? "1" : "0");
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

# K - Turn-by-Turn Navigation

> 关键词：计算几何，向量叉乘

## 思路

叉乘板子？我们想知道 $P$ 位于向量 $\overrightarrow{AB}$ 的哪一侧，应该判断 $\overrightarrow{AB} \times \overrightarrow{AP}$ 的正负。大于 $0$ 在左侧，小于 $0$ 在右侧，等于 $0$ 共线。

## Code

```c++
// Problem: Turn-by-Turn Navigation
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133878/K
// Time: 2026-07-25 00:20:14
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

struct Point
{
    ll x, y;

    Point operator+(const Point &other) const
    {
        return {x + other.x, y + other.y};
    }

    Point operator-(const Point &other) const
    {
        return {x - other.x, y - other.y};
    }

    bool operator==(const Point &other) const
    {
        return x == other.x && y == other.y;
    }
};

ll cross(Point a, Point b)
{
    return a.x * b.y - a.y * b.x;
}

ll chk(Point a, Point b, Point c)
{
    return cross(b - a, c - a);
}

void solve()
{
    int n;
    cin >> n;

    vector<Point> p(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> p[i].x >> p[i].y;

    for (int i = 1; i + 2 <= n; i++)
    {
        ll ret = chk(p[i], p[i + 1], p[i + 2]);
        if (ret > 0)
            cout << "LEFT" << ' ';
        else if (ret == 0)
            cout << "STRAIGHT" << ' ';
        else
            cout << "RIGHT" << ' ';
    }

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

# L - Uphill Duel

> 关键词：DP

## 思路

设 $win[x][y]$ 表示：当前轮到玩家行动，旗帜位于 $(x,y)$ 时，当前操作的玩家能否获胜。

因为两名玩家在游戏规则上没有任何区别，一个格子是好是坏只取决于当前旗帜在哪里、现在轮到谁行动，所以不需要区分先后手。

如果当前格子没有更高的相邻格子，那么无法移动，当前玩家直接输。更一般地，如果所有能移动到的状态都是必胜，那无论怎么走都会把必胜局面交给对手，对于当前格子，这也是一种必败态。

只要存在一个更高的相邻格子是必败态，就可以将必败局面交给对手。对于当前格子 $win[x][y]=1$。即当前状态必胜等价于存在一个可以到达的必败态。

综上，将所有格子按照高度从高到低排序，处理当前格子时，查看所有更高邻居。如果存在一个更高邻居是必败态，那么当前格子必胜。

## Code

```c++
// Problem: Uphill Duel
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133878/L
// Time: 2026-07-24 12:15:58
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define int long long
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

struct Point
{
    int h, x, y;
};

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<Point> p;
    vector<vector<int>> h(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; i++)
        for (int j = 1, x; j <= m; j++)
        {
            cin >> x;
            p.eb(x, i, j);
            h[i][j] = x;
        }

    auto cmp = [&](auto a, auto b) -> bool { return a.h > b.h; };

    sort(all(p), cmp);

    vector<vector<bool>> win(n + 1, vector<bool>(m + 1));

    for (int i = 0; i < (int) p.size(); i++)
    {
        auto &[_, x, y] = p[i];
        win[x][y] = false;

        for (int i = 0; i < 4; i++)
        {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx < 1 || nx > n || ny < 1 || ny > m)
                continue;

            if (h[nx][ny] <= h[x][y])
                continue;

            if (!win[nx][ny])
            {
                win[x][y] = true;
                break;
            }
        }
    }

    int q;
    cin >> q;

    while (q--)
    {
        int x, y;
        cin >> x >> y;

        cout << (win[x][y] ? "First" : "Second") << endl;
    }
}

signed main()
{
    fastio();

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

