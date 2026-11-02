---
title: 2025 ccpc 福建省赛
published: 2026-11-02
description: "2025 CCPC Fujian Provincial Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, ccpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 12th Fujian Collegiate Programming Contest - Dashboard - Contest - QOJ.ac](https://qoj.ac/contest/2182)

# G - 炒股高手

> 关键词：前缀和

## 思路

首先把指数的乘法贡献改成加减贡献，然后直接预处理出收益即可，负收益直接忽略。

注意加上本金 $k$。

## Code

```c++
// Problem: G
// Contest: QOJ - FJCPC 2025
// URL: https://qoj.ac/contest/2182/problem/12371/statement/en
// Time: 2026-11-02 16:15:28
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

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
    int n, m;
    cin >> n >> m;

    vector<ll> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        b[i] = b[i - 1] + max(0LL, a[i] - a[i - 1]);

    ll k;
    cin >> k;

    while (m--)
    {
        int l, r;
        cin >> l >> r;
        cout << b[r] - b[l] + k << endl;
    }
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

# H - 难以控制的滑板火箭

> 关键词：分层图最短路，分类讨论

## 思路

首先考虑分别维护到达终点的奇数步数最短路和偶数步数最短路。如果均不可达输出 $-1$。

下面首先就 $l,r$ 的取值情况进行讨论。

当 $l\ne r$ 时，这个区间一定至少包含两个连续整数，也就是一定同时存在奇数和偶数。可以通过在某条边上往返移动来补足步数。

当 $l=r$ 时，讨论 $l$ 的奇偶性。

如果 $l$ 是偶数，而偶数步最短路可达，直接算上取整，否则无解。因为每次走偶数步，一定不可能走到奇数步最短路。

如果 $l$ 是奇数，**有 $S\bmod 2=t\bmod 2$，所以偶数步最短路要求时间必须是偶数，奇数步最短路要求时间必须为奇数**。考虑两种情况。如果奇数步最短路可达，首先要算上取整，然后如果上取整的结果是偶数的话，要 $+1$ 补成奇数。如果偶数步最短路可达，首先也要算上取整，然后如果上取整的结果是奇数，就要 $+1$ 补成偶数。

## Code

```c++
// Problem: H
// Contest: QOJ - FJCPC 2025
// URL: https://qoj.ac/contest/2182/problem/12372/statement/en
// Time: 2026-11-02 17:21:15
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

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
    int n, m, l, r;
    cin >> n >> m >> l >> r;

    vector<vector<char>> g(n + 1, vector<char>(m + 1));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> g[i][j];

    vector<vector<array<ll, 2>>> dis(n + 1, vector<array<ll, 2>>(m + 1, {INF, INF}));
    dis[1][1][0] = 0;

    queue<array<int, 3>> q;
    q.push({1, 1, 0});

    while (!q.empty())
    {
        auto [x, y, st] = q.front();
        q.pop();

        for (int i = 0; i < 8; i++)
        {
            int nx = x + dx[i], ny = y + dy[i], nst = st ^ 1;

            if (nx < 1 || nx > n || ny < 1 || ny > m || g[nx][ny] == '0')
                continue;

            if (dis[nx][ny][nst] == INF)
            {
                dis[nx][ny][nst] = dis[x][y][st] + 1;
                q.push({nx, ny, nst});
            }
        }
    }

    // cerr << dis[n][m][0] << ' ' << dis[n][m][1] << endl;
    ll x = dis[n][m][0], y = dis[n][m][1];
    if (x == INF && y == INF)
        cout << -1 << endl;
    else
    {
        if (l != r)
            cout << min((x + r - 1) / r, (y + r - 1) / r) << endl;
        else
        {
            if (l & 1)
            {
                ll t1 = INF, t2 = INF;

                if (x != INF)
                    t1 = (x + l - 1) / l, t1 += (t1 & 1);

                if (y != INF)
                    t2 = (y + l - 1) / l, t2 += !(t2 & 1);

                cout << min(t1, t2) << endl;
            }
            else
                cout << (x == INF ? -1 : (x + l - 1) / l) << endl;
        }
    }
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

# J - 构造大师贝贝

> 关键词：构造，位操作

## 思路

题目要求在不超过 $100$ 次操作内，将正整数 $n$ 变成完全平方数。选择的这个数必须是 $n$ 的因数，且每次选择不重复，选择后加到 $n$ 上，需要保证整个过程中 $n \le 10^{18}$。

我们考虑能不能把 $n$ 加到满足数据范围的 $2$ 的偶数次幂。

> [!NOTE]
>
> 对于所有正奇数，都可以表示成 $\boxed{n=2^k(2t+1)}$，其中 $k,t$ 均为自然数。

对 $n$ 执行一次 `lowbit` 操作，有 $\begin{aligned} n'&=n+\operatorname{lowbit}(n)\\ &=2^k(2t+1)+2^k\\ &=2^{k+1}(t+1) \end{aligned}$。可以发现，每次操作后，`lowbit` 都是严格增大的。且每加上一个 `lowbit`，二进制末尾连续 $0$ 的数量一定增加。

综上，通过这种方式，我们可以通过 `lowbit` 操作把任意一个数加到 $2$ 的某个次幂。我们判断一下指数是不是奇数即可，如果是奇数，再做一次操作让它变成偶数幂即可。

由于每次执行一次 `lowbit` 操作，二进制末尾连续 $0$ 的数量至少增加 $1$。因此在不超过 $40$ 次操作内就一定能达到某个 $2$ 的幂，满足操作次数的要求。

## Code

```c++
// Problem: J
// Contest: QOJ - FJCPC 2025
// URL: https://qoj.ac/contest/2182/problem/12374/statement/en
// Time: 2026-11-02 16:32:35
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

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
    ll n;
    cin >> n;

    auto lowbit = [](ll x) -> ll { return (x & -x); };

    vector<ll> res;
    while (lowbit(n) != n)
        res.eb(lowbit(n)), n += lowbit(n);

    if (__lg(n) & 1)
        res.eb(n);

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << ' ';
    cout << endl;
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

# K - VERTeX

> 关键词：构造，图上约束

## 思路

不妨设 $1$ 号点点权为 $x$，我们发现，点之间的边相当于给了两侧一个约束。具体地说，假设根节点深度为 $1$，那么偶数深度的节点 $x$ 前的系数为负，反之为正。

每一个点的约束都是 $kx+b$ 的形式，其中 $k=1$ 或 $k=-1$，$b$ 受其两侧的边约束，我们对每个点递推出一个式子，再根据它的系数更新左边界和右边界。

注意如果 $l,r$ 是闭区间的话，等式两边要为 $1$，即 $\ge 1$ 或 $\le 1$。

## Code

```c++
// Problem: K
// Contest: QOJ - FJCPC 2025
// URL: https://qoj.ac/contest/2182/problem/12375/statement/en
// Time: 2026-11-02 14:16:31
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

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
    int n;
    cin >> n;

    vector<vector<pll>> g(n + 1);
    for (int i = 1, u, v, w; i <= n - 1; i++)
        cin >> u >> v >> w, g[u].eb(v, w), g[v].eb(u, w);

    vector<ll> sgn(n + 1), c(n + 1);
    sgn[1] = 1;

    auto dfs = [&](this auto &&self, int u, int p) -> void
    {
        for (auto [v, w]: g[u])
        {
            if (v == p)
                continue;

            sgn[v] = -sgn[u], c[v] = w - c[u];
            self(v, u);
        }
    };

    dfs(1, 0);

    ll l = 1, r = inf;
    for (int i = 1; i <= n; i++)
    {
        if (sgn[i] > 0)
            l = max(l, 1 - c[i]);
        else
            r = min(r, c[i] - 1);
    }

    if (l > r)
        cout << "NO" << endl;
    else
    {
        cout << "YES" << endl;
        for (int i = 1; i <= n; i++)
            cout << sgn[i] * l + c[i] << " \n"[i == n];
    }
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

# M - 致谢

> 关键词：签到

## Code

```c++
// Problem: M
// Contest: QOJ - FJCPC 2025
// URL: https://qoj.ac/contest/2182/problem/12377/statement/en
// Time: 2026-11-02 13:59:13
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

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

map<int, string> mp;

void solve()
{
    int n;
    cin >> n;

    mp[1] = "FZU", mp[2] = "FNU", mp[3] = "FZU", mp[4] = "FZU", mp[5] = "FAFU";
    mp[6] = "HQU", mp[7] = "MJU", mp[8] = "XMUT", mp[9] = "QNU", mp[10] = "JMU";
    mp[11] = "FZU";

    cout << mp[n] << endl;
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

