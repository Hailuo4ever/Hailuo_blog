---
title: 2024 icpc Asia EC 网络赛 II
published: 2026-09-05
description: "The 2024 ICPC Asia East Continent Online Contest (II)"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 网络赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2024 ICPC Asia East Continent Online Contest (II) - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/1799)
>

# A - Gambling on Choosing Regionals

> 关键词：思维

## 思路

对于某一队来说，最坏的情况就是他去哪，所以的强队都去哪。因此规模越小的赛站，可能的排名就越低。

假设最小限制是 $p=\min_i c_i$，现在考虑实力为 $w$ 的队伍 $x$，属于 $THU$。某个其他学校有 $10$ 支队伍的实力比 $x$ 强，但在这场比赛里，每个学校最多只能来 $p$ 支。因此我们关心的**不是有多少支队伍比我强，而是每个学校最多贡献 $p$ 个比我强的队伍**。知道这一点以后，我们把所有队伍按照实力从大到小排序，对每个学校维护当前扫描过的队伍中，这个学校已经有多少支队伍可以占据名额，维护 $cur$ 表示当前一共有多少支有效队伍。

根据上面的推导，每个学校只允许前 $p$ 个队伍对 $cur$ 产生贡献，直接模拟即可。

## Code

```c++
// Problem: QOJ A. Gambling on Choosing Regionals
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9370/statement/zh_cn
// Time: 2026-09-05 18:18:10
#include <bits/stdc++.h>
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
    return uniform_int_distribution{l, r}(rnd);
}

struct Team
{
    int w, id;
    string s;

    bool operator<(const Team &other) const
    {
        return w > other.w;
    }
};

void solve()
{
    int n, k;
    cin >> n >> k;

    int mn = inf;
    for (int i = 1, x; i <= k; i++)
        cin >> x, mn = min(mn, x);

    vector<Team> a(n);
    for (int i = 0; i < n; i++)
    {
        int w;
        string s;
        cin >> w >> s;

        a[i] = {w, i, s};
    }

    sort(all(a));

    map<string, int> mp;
    vector<int> res(n);
    int cur = 0;

    for (auto &[w, id, s]: a)
    {
        if (mp[s] < mn)
            mp[s]++, cur++;

        res[id] = cur;
    }

    for (int i = 0; i < n; i++)
        cout << res[i] << endl;
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

# F - tourist

> 关键词：签到

## Code

```c++
// Problem: F. Tourist
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9375/statement/zh_cn
// Time: 2026-09-05 18:39:29
#include <bits/stdc++.h>
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
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    ll cur = 1500, res = -1;
    for (int i = 1; i <= n; i++)
    {
        ll x;
        cin >> x;

        cur += x;
        if (cur >= 4000)
        {
            res = i;
            break;
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

# G - Game

> 关键词：推公式，辗转相减，辗转相除

## 思路

![](https://img.hailuo4ever.com/xcpc/2024_ICPC_EC_Online_II_Img2.jpg)

以上部分为辗转相减，如果直接这样递归会导致 $TLE$，需要优化。

首先研究 $x<y$ 时的情况，我们有 $f(x,y)=p f(x,y-x)$，如果减一次以后还是 $x<y-x$，那么就要继续减下去，所以 $f(x,y)=p^2f(x,y-2x)$。依次类推，直到 $y-kx\le x$ 时，即 ${f(x,y)=p^k f(x,y-kx)}$。由于筹码不能变成 $0$，此时有 $y-kx\ge1$，因此 $\boxed{k=\left\lfloor\frac{y-1}{x}\right\rfloor}$。

考虑 $x>y$ 时的情况，我们有 $f(x,y)=p+qf(x-y,y)$。假设 $Bob$ 连赢很多次，第二层为 $f(x,y)=p+pq+q^2f(x-2y,y)$。观察出前面是等比数列 $p(1+q+q^2+\cdots+q^{k-1})$，且有 $p=1-q$。所以 $p(1+q+\cdots+q^{k-1})=1-q^k$，最终有 ${f(x,y)=1-q^k+q^k f(x-ky,y)}$，$\boxed{k=\left\lfloor\frac{x-1}{y}\right\rfloor}$。

完整的递推式为：$\boxed{f(x,y)=\begin{cases}p,&x=y\\[4pt]p^k f(x,y-kx),&x<y,\ k=\left\lfloor\dfrac{y-1}{x}\right\rfloor\\[10pt]1-q^k+q^k f(x-ky,y),&x>y,\ k=\left\lfloor\dfrac{x-1}{y}\right\rfloor\end{cases}}$。

## Code

```c++
// Problem: G - Game
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9376/statement/zh_cn
// Time: 2026-09-05 22:28:20
#include <bits/stdc++.h>
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
const ll mod = 998244353;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

ll qmi(ll a, ll x)
{
    ll res = 1;
    a = a % mod;

    while (x)
    {
        if (x & 1)
            res = (res * a) % mod;
        a = (a * a) % mod;
        x >>= 1;
    }
    return res % mod;
}

void solve()
{
    ll x, y;
    cin >> x >> y;

    ll a, b, c;
    cin >> a >> b >> c;

    ll inv = qmi(a + b, mod - 2);

    ll p = a * inv % mod, q = b * inv % mod;

    auto dfs = [&](auto &&self, ll x, ll y) -> ll
    {
        if (x == y)
            return p;

        if (x < y)
        {
            ll k = (y - 1) / x, pk = qmi(p, k);

            return pk * self(self, x, y - k * x) % mod;
        }

        else
        {
            ll k = (x - 1) / y, qk = qmi(q, k);
            ll nx = self(self, x - k * y, y);

            return (1 - qk + qk * nx % mod + mod) % mod;
        }
    };

    cout << dfs(dfs, x, y) << endl;
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



# I - Strange Binary

> 关键词：构造，分类讨论

## 思路

题目要求找 $32$ 个数 $a_0,\dots,a_{31}$，满足 $a_i\in\{-1,0,1\}$，且相邻两位不能同时为 $0$，$\sum_{i=0}^{31}a_i2^i=n$，即 $n=a_0+2a_1+4a_2+\cdots+2^{31}a_{31}$。

从这个式子入手，发现除了 $a_0$ 以外，高位都是偶数。**因此如果 $n$ 为偶数时，$a_0$ 必须为 $0$**。再进一步，如果 $n\equiv0\pmod4$，最低两位必须都是 $0$，所以这种情况无解。

我们下面先考虑，给定一个奇数 $x$，能不能用 $L$ 个 $\pm1$ 表示：$x=b_0+2b_1+\cdots+2^{L-1}b_{L-1}$。

先假设所有位都是 $1$，表示的数为 ${S=2^L-1}$，现在我们想把 $S$ 变成 $x$，需要减少 $S-x$。不难发现，把某一位从 $1$ 改成 $-1$，会产生 $2^i-(-2^i)=2^{i+1}$ 的贡献。由于 $S-x$ 一定是偶数，所以一定可以凑出 $S-x$。

再考虑偶数情况，首先把第 $0$ 位赋成 $0$，然后我们会发现，原始变成了 $n=2a_1+2^2a_2+\cdots+2^{31}a_{31}$，所有项都有一个公因子 $2$，因此我们可以把右边的 $2$ 提出来，去构造 $\frac n2$ 这个奇数，即 ${\frac n2=a_1+2a_2+2^2a_3+\cdots+2^{30}a_{31}}$。

最终思路为：奇数直接用全 $1$ 减去若干 $2^{i+1}$ 构造；偶数先确定 $a_0=0$，整体除以 $2$，转化成 $31$ 位奇数构造。

## Code

```c++
// Problem: I. Strange Binary
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9378/statement/zh_cn
// Time: 2026-09-05 18:38:05
#include <bits/stdc++.h>
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
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n;
    cin >> n;

    vector<int> res(32, 1);

    if (n % 4 == 0)
    {
        cout << "NO" << endl;
        return;
    }

    if (n & 1)
    {
        ll ini = ((1ll << 32) - 1);

        bitset<32> bit(ini - n);
        cerr << bit << endl;

        for (int i = 31; i >= 1; i--)
        {
            if (bit[i] == 1)
                res[i - 1] = -1;
        }
    }
    else
    {
        // 所有项可以提一个公因子2，从31位开始构造
        res[0] = 0;
        ll ini = ((1ll << 31) - 1);

        bitset<32> bit(ini - n / 2);
        for (int i = 30; i >= 1; i--)
        {
            if (bit[i] == 1)
                res[i] = -1;
        }
    }

    cout << "YES" << endl;
    for (int i = 0; i < 32; i++)
        cout << res[i] << " \n"[(i + 1) % 8 == 0];
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



# J - Stacking of Goods

> 关键词：贪心，交换论证

## 思路

我们考虑交换论证，只考虑两个商品 $a,b$，推一下不难发现，如果 $a$ 在下面，$b$ 在上面，产生的额外压缩量是  $c_a w_b$，反之是 $c_b w_a$。

因为要求总体积最小，也就是压缩量最大，我们希望产生的额外压缩量尽可能多，按照这个规则排序，$a$ 在 $b$ 上面当且仅当 $w_ac_b \ge w_bc_a$。

## Code

```c++
// Problem: J. Stacking of Goods
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9379/statement/zh_cn
// Time: 2026-09-05 18:42:33
#include <bits/stdc++.h>
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
    return uniform_int_distribution{l, r}(rnd);
}

struct Item
{
    ll w, v, c;
};

void solve()
{
    int n;
    cin >> n;

    vector<Item> a(n);
    for (int i = 0; i < n; i++)
    {
        ll w, v, c;
        cin >> w >> v >> c;
        a[i] = {w, v, c};
    }

    sort(all(a),
         [](const auto &a, const auto &b)
         {
             ll x = a.w * b.c, y = b.w * a.c;
             return x > y;
         });

    ll res = 0, W = 0;
    for (auto &[w, v, c]: a)
    {
        res += v - c * W;
        W += w;
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

# L - 502 Bad Gateway

> 关键词：期望

## 思路

![](https://img.hailuo4ever.com/xcpc/2024_ICPC_EC_Online_II_Img1.jpg)

## Code

```c++
// Problem: L. 502 Bad Gateway
// Contest: QOJ - The 2024 ICPC Asia East Continent Online Contest (II)
// URL: https://qoj.ac/contest/1799/problem/9381/statement/zh_cn
// Time: 2026-09-05 20:07:18
#include <bits/stdc++.h>
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
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    ll n;
    cin >> n;

    ll m = sqrtl(2 * n), l = m, r = m;

    auto check = [&](ll x) -> bool { return x * (x - 1) <= 2 * n && 2 * n < x * (x + 1); };

    while (true)
    {
        if (!check(l))
            l--;
        else
        {
            m = l;
            break;
        }

        if (!check(r))
            r++;
        else
        {
            m = r;
            break;
        }
    }

    ll son = 2 * n + m * (m - 1);
    ll mo = 2 * m;

    ll k = gcd(son, mo);
    cout << son / k << ' ' << mo / k << endl;
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

