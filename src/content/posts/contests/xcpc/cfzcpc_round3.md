---
title: 2025 牛客多校3 (cfzcpc round 3)
published: 2026-09-28
description: "cfzcpc round 3"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Cfzcpc Round 3 -  QOJ.ac](https://qoj.ac/contest/3200)

# A - Ad-hoc Newbie

> 关键词：构造，mex

## 思路

对于每个 $i$，我们要构造一个 $n \times n$ 的矩阵 $g$，使得第 $i$ 行和第 $j$ 列的 $mex$ 都等于 $f_i$。

稍微翻译一下这个条件，对于第 $i$ 行，我们只需要做到让 $0,1,\dots,a_i-1$ 全部出现，并且 $a_i$ 不出现。

我们考虑初始化整个矩阵为 $0$，并且把 $1$ 放在矩阵的对角线。对于 $f_i=1$ 的行，我们直接跳过即可。

现在还缺 $2,3,\dots,f_i-1$ 这些数，我们可以选择让 $g_{i,j}=g_{j,i}=j+1$，由于 $f_i$ 满足 $f_i \le n$，因此这一列肯定有地方放下这些数，

> [!NOTE]
>
> 这样构造不会冲突的原因如下：假设有另外一行 $k$，在构造第 $k$ 行时，如果枚举到了 $j=i$，那么会执行 $g_{k,i}=g_{i,k}=i+1$。这意味着其他行向第 $i$ 行塞进来的东西一定比 $a_i$ 大，而 $mex$ 不关心比 $a_i$ 大的数。

## Code

```c++
// Problem: A. Ad-hoc Newbie
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16501/statement/zh_cn
// Time: 2026-09-29 15:28:11
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

    vector<vector<int>> g(n + 1, vector<int>(n + 1, 0));
    vector<int> f(n + 1);

    for (int i = 1; i <= n; i++)
        cin >> f[i];

    for (int i = 1; i <= n; i++)
        g[i][i] = (f[i] == 1 ? 0 : 1);

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j < f[i] - 1; j++)
            g[i][j] = g[j][i] = j + 1;
    }

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cout << g[i][j] << " \n"[j == n];
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



# B - Bitwise Puzzle

> 关键词：位运算，思维

## 思路

允许最多 $64$ 次操作，目标是得到 $a=b=c$。

> 1. $a\leftarrow 2a$，即 $a$ 左移一位
> 2. $b\leftarrow \lfloor b/2\rfloor$，即 $b$ 右移一位
> 3. $a\leftarrow a\oplus b$
> 4. $b\leftarrow b\oplus a$

考虑用 $b$ 的最高位 $1$ 来修改 $a$，假设 $b$ 的最高位在第 $k$ 位，执行 $a\leftarrow a\oplus b$ 一定会让 $a$ 的第 $k$ 位翻转。但不会改变 $k$ 位以上的情况，这启示我们按照从高位到低位的顺序处理。

> [!NOTE]
>
> 这里其实并不需要考虑 $k$ 以下的位。在赛时的时候考虑到会把 $a$ 的低位改乱，所以放弃了这个想法。

首先我们对齐 $a$ 和 $b$ 的最高位，这里判断 $a$ 和 $b$ 的大小，然后使用一次异或操作即可做到。并且特殊处理 $a$ 或 $b$ 为 $0$ 的情况，在这个过程中会发现，如果 $a=b=0$，无论四种操作怎么做最后都会得到 $0$，所以如果 $c\ne0$ 一定无解。

对齐后，设 $a$ 和 $b$ 的共同最高位为 $k$，看目标 $c$ 的最高位 $tc$，此时会产生两种情况。

情况一：$tc\le k$，此时我们让 $b$ 一路右移，按照 $c$ 上的情况去修改 $a$，最后 $b$ 会被右移成 $0$，然后直接一次异或就能变成 $c$。

情况二：$tc>k$，此时因为 $b$ 只能右移，无法修改更高的位，于是我们考虑左移 $a$。我们考虑始终利用 $b$ 的第 $k$ 位控制 $a_k$，然后不断左移 $a$，把这个位送往高处。送到高位后，我们从原先的 $ta$ 开始，按照上面的逻辑往下处理。

在让 $a=c$ 后，我们通过一次操作 $4$ 让 $b=c$。

## Code

```c++
// Problem: B. Bitwise Puzzle
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16502/statement/zh_cn
// Time: 2026-09-29 13:08:16
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
    int a, b, c;
    cin >> a >> b >> c;

    vector<int> res;

    auto get = [](int x) -> int
    {
        for (int i = 30; i >= 0; i--)
            if (x >> i & 1)
                return i;

        return -1;
    };

    auto op1 = [&](void) -> void
    {
        a <<= 1;
        res.eb(1);
    };

    auto op2 = [&](void) -> void
    {
        b >>= 1;
        res.eb(2);
    };

    auto op3 = [&](void) -> void
    {
        a ^= b;
        res.eb(3);
    };

    auto op4 = [&](void) -> void
    {
        b ^= a;
        res.eb(4);
    };

    int ta = get(a), tb = get(b), tc = get(c);
    if (a == 0 && b == 0)
    {
        if (c != 0)
            cout << -1 << endl;
        else
            cout << 0 << endl;

        return;
    }
    else if (a == 0)
        op3(), ta = tb;
    else if (b == 0)
        op4(), tb = ta;
    else
    {
        if (ta < tb)
            op3(), ta = tb;
        else if (ta > tb)
            op4(), tb = ta;
    }

    if (ta >= tc)
    {
        for (int i = ta; i > tc; i--)
        {
            if (a >> i & 1)
                op3();

            op2();
        }

        for (int i = tc; i >= 0; i--)
        {
            if ((a >> i & 1) != (c >> i & 1))
                op3();

            op2();
        }
    }
    else
    {
        int ptr = tc, cur = ta;
        for (int i = 1; i <= tc - ta && ptr > ta; i++, ptr--)
        {
            if ((c >> ptr & 1) != (a >> cur & 1))
                op3();

            op1();
        }

        for (int i = ta; i >= 0; i--)
        {
            if ((a >> i & 1) != (c >> i & 1))
                op3();

            op2();
        }
    }

    op4();

    assert(res.size() <= 64);
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

# D - Distant Control

> 关键词：双指针

## 思路

如果能至少进行一次操作，那么这个操作会不断往外扩张，最终会让 $n$ 个机器人都变成 $1$，否则答案为原字符串中 $1$ 的数量。

## Code

```c++
// Problem: D. Distant Control
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16504/statement/zh_cn
// Time: 2026-09-29 15:52:42
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
    int n, a;
    cin >> n >> a;

    string s;
    cin >> s;

    int cnt = 0;
    bool fl = false;

    for (int i = 0; i < n;)
    {
        int j = i;
        while (j < n && s[j] == s[i])
            j++;

        int len = j - i, k = s[i] - '0';
        if (k == 0)
        {
            if (len >= a + 1)
                fl = true;
        }
        else
        {
            if (len >= a)
                fl = true;

            cnt += len;
        }

        i = j;
    }

    if (fl)
        cout << n << endl;
    else
        cout << cnt << endl;
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

# E - Equal

> 关键词：质因子

## 思路

开始时想到了一个让质因子对对碰，相消的思路。这个思路其实可以更进一步。

首先独立考虑所有质因子，假设当前固定了质因子 $p$，如果操作中的 $d$ 含有 $p^k$，那么一次操作本质上会让两个位置 $a_i,a_j$ 同时增加或减少 $k$，因此我们发现，对于质因子 $p$，它在所有数中的指数和 $S_p=\sum_{i=1}^{n}a_i$ 的奇偶性是不会改变的。

如果最终所有数都相同，并且其中质因子 $p$ 的指数都是 $x$，那么最终这个质因子的指数总和一定是 $nx$。

由以上式子，我们考虑 $n$ 的奇偶性，如果 $n$ 是偶数，那右边一定是偶数，因此如果某个 $S_p$ 是奇数，这种情况就无解了。如果 $n$ 是奇数，对总和没有限制。

更进一步地，我们发现，当 $n$ 是奇数时一定可以构造，我们通过乘法操作进行即可。

综上，完整的判定条件如下：

$n=1$ 时，直接为 $yes$，$n=2$ 时，只能操作唯一的一对数 $a_1,a_2$。当 $n \ge 3$ 且为奇数时答案为 $yes$，当 $n \ge 4$ 且为偶数时，对于每一个质因子 $p$，都需要 ${\sum_i v_p(a_i)\equiv0\pmod2}$。

> [!NOTE]
>
> 对于这个数据范围，我们不要每次都枚举根号，而是预处理出数据范围内每个数的最小质因子来加速分解，有点像 [Codeforces - 2266E](https://codeforces.com/contest/2266/problem/E)

## Code

```c++
// Problem: E. Equal
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16505/statement/zh_cn
// Time: 2026-09-29 17:10:19
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
const int N = 5e6 + 10;
const ll INF = 4e18;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

int primes[N], cnt, minp[N];

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!minp[i])
            primes[cnt++] = i, minp[i] = i;

        for (int j = 0; j < cnt && primes[j] <= n / i; j++)
        {
            int p = primes[j];
            minp[p * i] = p;

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

    if (n == 1)
        cout << "YES" << endl;
    else if (n == 2)
        cout << (a[1] == a[2] ? "YES" : "NO") << endl;
    else if (n & 1)
        cout << "YES" << endl;
    else
    {
        map<int, int> mp;

        auto divide = [&](int x) -> void
        {
            while (x > 1)
            {
                mp[minp[x]]++;
                x /= minp[x];
            }
        };

        for (int i = 1; i <= n; i++)
            divide(a[i]);

        bool fl = true;
        for (auto [p, cnt]: mp)
        {
            if (cnt & 1)
            {
                fl = false;
                break;
            }
        }

        cout << (fl ? "YES" : "NO") << endl;
    }
}

int main()
{
    fastio();

    get_primes(N);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# F - Flower

> 关键词：签到

## Code

```c++
// Problem: F. Flower
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16506/statement/zh_cn
// Time: 2026-09-29 09:12:47
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
    int n, a, b;
    cin >> n >> a >> b;

    if (n <= a)
        cout << "Sayonara" << endl;
    else if (n % (a + b) > a)
        cout << 0 << endl;
    else
        cout << n % (a + b) << endl;
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

# J - Jetton

> 关键词：博弈论

## 思路

每次筹码更小的一方都会翻倍增加，注意到如果游戏能进行有限轮，那么轮数一定不会太多，所以我们直接模拟 $100$ 次即可。

## Code

```c++
// Problem: J. Jetton
// Contest: QOJ - Cfzcpc Round 3
// URL: https://qoj.ac/contest/3200/problem/16510/statement/zh_cn
// Time: 2026-09-29 17:20:05
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
    int x, y;
    cin >> x >> y;

    int n = 100, res = 1;
    while (n-- && x != y)
    {
        if (x > y)
            swap(x, y);

        y -= x, x *= 2, res++;
        if (x == y)
            break;
    }

    cout << (x != y ? -1 : res) << endl;
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

