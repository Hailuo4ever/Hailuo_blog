---
title: 牛客周赛 Round 151
published: 2026-07-05
description: "Nowcoder Week Contest 151"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 151](https://ac.nowcoder.com/acm/contest/137267)

# A - 运动会

> 关键词：双指针

## Code

```c++
// Problem: 运动会
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/A
// Time: 2026-06-29 22:39:17
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    string s;
    cin >> s;

    int res = 0;
    for (int i = 0; i < s.size(); i++)
    {
        if (s[i] == '|')
        {
            int j = i + 1;
            while (j < s.size() && s[j] == '=')
                j++;

            if (j - i > 1)
                res++, i = j;
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

# B - 数方格

> 关键词：异或（xor）

## 思路

可以固定选择第一行第一列的格子来修改，根据数据范围，一定是有解的。

计算 $cur = row_1 \oplus col_1 \oplus a_{1,1}$，修改 $(1,1)$ 的值为 $val = a_{1,1} \oplus cur \oplus x$ 即可。

## Code

```c++
// Problem: 数方格
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/B
// Time: 2026-06-29 22:44:30
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n, m;
    cin >> n >> m;

    int row = 0, col = 0;
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1, x; j <= m; j++)
        {
            cin >> x;

            if (i == 1)
                row ^= x;

            if (j == 1)
                col ^= x;
        }
    }

    int x;
    cin >> x;

    cout << "YES" << endl;
    cout << "1 1 " << (row ^ col ^ x) << endl;
    cout << "1 1" << endl;
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

# C - 列竖式

> 关键词：模拟

## 思路

先补前 $0$ 和后 $0$，对齐位数后直接模拟即可。

## Code

```c++
// Problem: 列竖式
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/C
// Time: 2026-06-29 23:01:21
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    string s1, s2;
    cin >> s1 >> s2;

    int pos1 = s1.find('.');
    int pos2 = s2.find('.');

    // cout << pos1 << ' ' << pos2 << endl;

    if (pos1 < pos2)
    {
        int t = pos2 - pos1;
        string s(t, '0');
        s1 = s + s1;
    }

    if (pos1 > pos2)
    {
        int t = pos1 - pos2;
        string s(t, '0');
        s2 = s + s2;
    }

    int sz1 = s1.size(), sz2 = s2.size();
    if (sz1 < sz2)
    {
        int t = sz2 - sz1;
        string s(t, '0');
        s1 = s1 + s;
    }

    if (sz1 > sz2)
    {
        int t = sz1 - sz2;
        string s(t, '0');
        s2 = s2 + s;
    }

    // cout << s1 << endl << s2 << endl;

    int res = 0;
    for (int i = s1.size() - 1, t = 0; i >= 0; i--)
    {
        if (s1[i] == '.')
            continue;

        int s = (s1[i] - '0') + (s2[i] - '0') + t;
        if (s >= 10)
            t = 1, res++;
        else
            t = 0;
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

# D - 走迷宫

> 关键词：BFS，前缀和

## 思路

我们还是移动左上角，每次计算出右下角的坐标是否出界。而我们在移动过程中需要快速判断某个矩形内有没有墙，容易想到使用二维前缀和预处理。剩下就是普通的 $bfs$ 了。

## Code

```c++
// Problem: 走迷宫
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/E
// Time: 2026-06-29 23:30:28
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
const ll INF = 4e18;
const int N = 0;

using P = array<int, 2>;

void solve()
{
    int n, m, a, b;
    cin >> n >> m >> a >> b;

    P st, ed;

    vector<vector<char>> g(n + 1, vector<char>(m + 1));
    vector<vector<int>> s(n + 1, vector<int>(m + 1, 0));

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            cin >> g[i][j];

            if (g[i][j] == 'S')
                st = {i, j};

            if (g[i][j] == 'E')
                ed = {i, j};

            int w = (g[i][j] == '#');
            s[i][j] = s[i - 1][j] + s[i][j - 1] - s[i - 1][j - 1] + w;
        }

    auto get_sum = [&](int x1, int y1, int x2, int y2) -> int
    { return s[x2][y2] - s[x1 - 1][y2] - s[x2][y1 - 1] + s[x1 - 1][y1 - 1]; };

    auto check = [&](int x, int y) -> bool
    {
        if (x < 1 || y < 1)
            return false;
        if (x + a - 1 > n)
            return false;
        if (y + b - 1 > m)
            return false;

        int cnt = get_sum(x, y, x + a - 1, y + b - 1);
        return cnt == 0;
    };

    queue<P> q;
    vector<vector<bool>> vis(n + 1, vector<bool>(m + 1, false));

    q.push(st);
    vis[st[0]][st[1]] = true;

    while (!q.empty())
    {
        auto [a, b] = q.front();
        q.pop();

        if (a == ed[0] && b == ed[1])
        {
            cout << "Yes" << endl;
            return;
        }

        for (int i = 0; i < 4; i++)
        {
            int x = a + dx[i], y = b + dy[i];

            if (!check(x, y)) // care RE !!
                continue;

            if (vis[x][y])
                continue;

            vis[x][y] = true;
            q.push({x, y});
        }
    }

    cout << "No" << endl;
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

# E - 跷跷板

> 关键词：数学，推公式

## 思路

设赶走一个小朋友后，剩余小朋友的总重量为 $S$，坐标乘重量之和为 $T$。把题目给定的力矩平衡式展开，有 $2p(S+W)=2T+Wl$。

因此合法终点的唯一可能为：$p=\frac {2T+Wl} {2(S+W)}$。

枚举被赶走的小朋友，并维护去掉后的 $S,T$，判断上式是否可以整除，且满足 $0 \le p \le l$。

特别注意，中间会炸 $ll$，要开 $i128$。

## Code

```c++
// Problem: 跷跷板
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/E
// Time: 2026-07-03 13:30:58
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
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    ll l, W;

    cin >> n >> l >> W;

    vector<ll> x(n + 1), w(n + 1);

    i128 sumW = 0, sumNow = 0;

    for (int i = 1; i <= n; i++)
    {
        cin >> x[i] >> w[i];
        sumW += w[i];
        sumNow += (i128) x[i] * w[i];
    }

    int res = 0;

    for (int i = 1; i <= n; i++)
    {
        i128 rest = sumW - w[i];
        i128 restNow = sumNow - (i128) x[i] * w[i];

        i128 A = 2 * restNow + (i128) W * l;
        i128 B = 2 * (rest + W);

        if (A % B == 0)
            res++;
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

# F - 解方程

> 关键词：gcd，组合数学

## 思路

设我们选出的 $k$ 个数的最大公约数是 $g$，那么这 $k$ 个数都必须是 $g$ 的倍数。

所以如果某个数 $d$ 想成为选出 $k$ 个数的公约数，那么数组中至少要有 $k$ 个数能被 $d$ 整除。

令 $cnt[d]$ 为数组中能被 $d$ 整除的元素个数，那么 $d$ 可以作为某种选法的公约数，当且仅当 $cnt[d] \ge k$，因此对于询问 $k$，最大可能的公约数就是 $G_k = \max\{d \mid cnt[d] \ge k\}$。

**由于 $G_k$ 是最大可能的公因数，所以从所有能被 $G_k$ 整除的元素中任选 $k$ 个，它们的 gcd 一定恰好等于 $G_k$。，答案即为 $\binom{cnt[G_k]}{k}$。 **

## Code

代码思路：

1. 对每个 $a_i$ 枚举所有因子；
2. 得到每个因子 $d$ 的倍数个数 $cnt[d]$；
3. 按照 $d$ 从大到小排序；
4. 对于每个 $d$，它可以成为所有 $k\le cnt[d]$ 的候选 gcd；
5. 因为从大到小处理，所以第一次赋值给 $ways[k]$ 的 $d$，就是最大 gcd；
6. 用并查集跳过已经赋值过的 $k$，避免重复处理；
7. 回答询问时直接输出 $ways[k]$。

```c++
// Problem: 解方程
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137329/F
// Time: 2026-07-06 17:52:18
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

const int MOD = 1e9 + 7;
using u32 = uint32_t;
using u64 = uint64_t;
template<class T>
constexpr T power(T a, u64 b, T res = 1)
{
    for (; b != 0; b >>= 1, a *= a)
    {
        if (b & 1)
            res *= a;
    }
    return res;
}

template<class U, U P>
struct ModIntBase
{
public:
    U x;

    constexpr ModIntBase() : x(0)
    {
    }

    constexpr ModIntBase(long long x_)
    {
        long long v = x_ % (long long) P;
        if (v < 0)
            v += (long long) P;
        x = (U) v;
    }

    constexpr static U mod()
    {
        return P;
    }

    constexpr U val() const
    {
        return x;
    }

    constexpr ModIntBase operator-() const
    {
        return ModIntBase(x == 0 ? 0 : P - x);
    }

    // 注意：这里要求 P 是质数
    constexpr ModIntBase inv() const
    {
        return power(*this, P - 2);
    }

    constexpr ModIntBase &operator*=(const ModIntBase &rhs) &
    {
        x = (u64) x * rhs.x % P;
        return *this;
    }

    constexpr ModIntBase &operator+=(const ModIntBase &rhs) &
    {
        x += rhs.x;
        if (x >= P)
            x -= P;
        return *this;
    }

    constexpr ModIntBase &operator-=(const ModIntBase &rhs) &
    {
        if (x < rhs.x)
            x += P;
        x -= rhs.x;
        return *this;
    }

    constexpr ModIntBase &operator/=(const ModIntBase &rhs) &
    {
        return *this *= rhs.inv();
    }

    friend constexpr ModIntBase operator*(ModIntBase lhs, const ModIntBase &rhs)
    {
        return lhs *= rhs;
    }

    friend constexpr ModIntBase operator+(ModIntBase lhs, const ModIntBase &rhs)
    {
        return lhs += rhs;
    }

    friend constexpr ModIntBase operator-(ModIntBase lhs, const ModIntBase &rhs)
    {
        return lhs -= rhs;
    }

    friend constexpr ModIntBase operator/(ModIntBase lhs, const ModIntBase &rhs)
    {
        return lhs /= rhs;
    }

    friend istream &operator>>(istream &is, ModIntBase &a)
    {
        long long v;
        is >> v;
        a = ModIntBase(v);
        return is;
    }

    friend ostream &operator<<(ostream &os, const ModIntBase &a)
    {
        return os << a.val();
    }

    friend bool operator==(const ModIntBase &lhs, const ModIntBase &rhs)
    {
        return lhs.val() == rhs.val();
    }

    friend bool operator!=(const ModIntBase &lhs, const ModIntBase &rhs)
    {
        return !(lhs == rhs);
    }
};

using Z = ModIntBase<u32, MOD>;

struct Comb
{
    int n;
    vector<Z> _fac;
    vector<Z> _invfac;
    vector<Z> _inv;

    Comb() : n(1), _fac(2), _invfac(2), _inv(2)
    {
        _fac[0] = _fac[1] = 1;
        _invfac[0] = _invfac[1] = 1;
        _inv[1] = 1;
    }

    Comb(int n) : Comb()
    {
        init(n);
    }

    void init(int m)
    {
        if (m <= n)
            return;

        int old = n;

        _fac.resize(m + 1);
        _invfac.resize(m + 1);
        _inv.resize(m + 1);

        for (int i = old + 1; i <= m; i++)
        {
            _fac[i] = _fac[i - 1] * i;
        }

        _invfac[m] = _fac[m].inv();

        for (int i = m; i > old; i--)
        {
            _invfac[i - 1] = _invfac[i] * i;
            _inv[i] = _invfac[i] * _fac[i - 1];
        }

        n = m;
    }

    Z fac(int m)
    {
        if (m > n)
            init(2 * m);
        return _fac[m];
    }

    Z invfac(int m)
    {
        if (m > n)
            init(2 * m);
        return _invfac[m];
    }

    Z inv(int m)
    {
        if (m > n)
            init(2 * m);
        return _inv[m];
    }

    Z binom(int n, int m)
    {
        if (m < 0 || m > n)
            return 0;
        return fac(n) * invfac(m) * invfac(n - m);
    }

    Z perm(int n, int m)
    {
        if (m < 0 || m > n)
            return 0;
        return fac(n) * invfac(n - m);
    }
} comb;

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

void solve()
{
    int n;
    cin >> n;

    unordered_map<int, int> mp;

    for (int i = 1, x; i <= n; i++)
    {
        cin >> x;
        for (int d = 1; d * d <= x; d++)
        {
            if (x % d == 0)
            {
                mp[d]++;

                if (d * d != x)
                    mp[x / d]++;
            }
        }
    }

    vector<pii> v;
    for (auto [d, cnt]: mp)
        v.eb(d, cnt);

    sort(v.rbegin(), v.rend());

    vector<Z> ways(n + 2, 0);
    DSU dsu(n + 1);

    for (auto [d, cnt]: v)
    {
        // 当前因子 d 能覆盖所有 k ≤ cnt[d]，但只处理还没有被更大因子覆盖过的 k。
        for (int k = dsu.find(1); k <= cnt; k = dsu.find(k))
        {
            ways[k] = comb.binom(cnt, k);
            dsu.fa[k] = dsu.find(k + 1);
        }
    }

    int q;
    cin >> q;

    for (int i = 0, k; i < q; i++)
    {
        cin >> k;
        cout << ways[k] << endl;
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

