---
title: 2026 牛客多校5
published: 2026-07-31
description: "Nowcoder Multi-University Training Contest 5"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营5](https://ac.nowcoder.com/acm/contest/133880)

# I - Sequence Operation 2

> 关键词：消元构造，不变量

## 思路

一次操作选择 $x,y,z$，满足 $x=y\oplus z$。这个式子等价于 $x\oplus y\oplus z=0$。

考虑当前所有为 $1$ 的位置的异或和 $F(u)=\bigoplus_{i:s_i=1} i$，一次操作翻转 $x,y,z$ 后，发现异或和 $F(u)$ 始终不变。因此最终状态是被这个异或和 $F(u)$ 确定好的。如果 $F(u)=0$，说明最终不能有 $1$，如果 $F(u)=p$，那么 $p$ 位置最后要有一个 $1$。

假设初始字符串是 $s$，目标是 $g$。我们需要找到若干操作，让 $s\oplus\text{所有操作}=g$，定义 $a=s\oplus g$，$a_i=1$ 表示原状态 $s_i$ 和目标状态 $g_i$ 在位置 $i$ 不相同。实际上构造 $a=s\oplus g$ 只需要根据 $F(u)$ 最多翻转一个位置即可。问题可以变成：找到若干操作，把 $a$ 全部消成 $0$。

考虑如何消元 $a$。假设当前处理位置 $x$，并且 $a_x=1$，目标是找到一个合法操作，把位置 $x$ 翻转成 $0$。我们让 $y$ 为 $x$ 的最高位二次幂，并让 $z=x\oplus y$，可以说明这总是合法的。

> 例如，$x=13$ 时，$13=(1101)_2$，$y=8=(1000)_2$，剩余的低位为 $z=13\oplus8=5$。所以编号为 $13$ 的操作可以翻转 $13,8,5$。

注意到上述的操作方式有一个特点：一次操作只会影响当前位置 $x$ 和两个小于 $x$ 的位置 $y,z$，那显然我们应该倒序处理。

但还需要注意到二次幂位置是特殊的，因为它没有低位部分，此时 $z=x\oplus y=0$，操作不合法，因此要跳过。实际上 $a$ 这个状态在被构造出来的时候，已经确保二次幂位置上不为 $0$ 了。

## Code

```c++
// Problem: Sequence Operation 2
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133880/I
// Time: 2026-07-31 14:07:59
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
const ll mod = 1;

void solve()
{
    int n;
    cin >> n;

    string s;
    cin >> s;

    int sz = s.size();
    s = ' ' + s;

    int cnt = count(all(s), '1');

    vector<int> res(sz + 1, 0);
    if (cnt <= 1)
    {
        for (int i = 1; i <= sz; i++)
            cout << res[i] << " \n"[i == sz];
        return;
    }

    int sum = 0;
    for (int i = 1; i <= sz; i++)
    {
        if (s[i] == '1')
            sum ^= i;
    }

    if (sum)
        s[sum] ^= 1;

    for (int x = sz; x >= 1; x--)
    {
        if ((x & (x - 1)) == 0 || s[x] == '0')
            continue;

        int y = 1 << __lg(x), z = x ^ y;

        res[x] = y;
        s[x] ^= 1, s[y] ^= 1, s[z] ^= 1;
    }

    for (int i = 1; i <= sz; i++)
        cout << res[i] << " \n"[i == sz];
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

# K - Sequence (Mex Version)

> 关键词：模拟

## 思路

赛时认为 $mex$ 序列会在计算两次后进入循环，但这是错的。

但有周期性是肯定的，推测是在某个样例上需要多算几次才能进周期。尝试写暴力，直到发现循环了再停止，但写了一会没写出来。试试多算两次（一个周期）就过了。证明好像有些难以理解，交给注意力了。

## Code

```c++
// Problem: Sequence（Mex Version）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133880/K
// Time: 2026-07-31 13:19:41
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
const ll mod = 1;

void solve()
{
    int n, k;
    cin >> n >> k;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    auto mex = [&](int a, int b, int c) -> int
    {
        int ret = 0;

        set<int> s;
        s.insert(a), s.insert(b), s.insert(c);

        while (s.count(ret))
            ret++;

        return ret;
    };

    auto calc = [&](auto &vec) -> vector<int>
    {
        vector<int> res(n);
        for (int i = 0; i < n; i++)
            res[i] = mex(vec[i], vec[(i + 1) % n], vec[(i + n - 1) % n]);

        return res;
    };

    vector<int> res1 = calc(a);
    vector<int> res2 = calc(res1);
    vector<int> res3 = calc(res2);

    vector<int> res4 = calc(res3);
    vector<int> res5 = calc(res4);

    if (k == 1)
    {
        for (auto x: res1)
            cout << x << ' ';
    }
    else if (k == 2)
    {
        for (auto x: res2)
            cout << x << ' ';
    }
    else if (k == 3)
    {
        for (auto x: res3)
            cout << x << ' ';
    }
    else if (k % 2 == 0)
    {
        for (auto x: res4)
            cout << x << ' ';
    }
    else
    {
        for (auto x: res5)
            cout << x << ' ';
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

# L - Matrix

> 关键词：模拟，递推

## 思路

赛时考虑递推：对于每个点 $(i, j)$ 有多少条合法路径经过，但这没什么用。因为题目是从所有路径中选择一个多重集合，直接把使用了哪些路径作为状态，规模会非常大，而且这个想法没有区分路径的方向。

首先我们考虑怎样计算操作次数 $k$。下面首先假设 $n\ge2,\quad m\ge2$ 的情况，由于每条路径都经过起点，因此进行 $k$ 次操作后，最终值为 $V=a[1][1] + k$。再观察起点后面的两个格子，每条路径离开起点时要么向右经过 $(1,2)$，要么向下经过 $(2,1)$，一定会经过两个格子中的一个。**因此，经过这两个格子的路径数之和为 $c_{1,2}+c_{2,1}=k$。最终它们都应该等于 $V$。**

根据上面的思考，有 $c_{1,2}=V-a_{1,2}$，$c_{2,1}=V-a_{2,1}$，代入 $(V-a_{1,2})+(V-a_{2,1})=k$ 和 $V=a_{1,1}+k$，最终整理得到 $${k=a_{1,2}+a_{2,1}-2a_{1,1}}$$，且 $V=a_{1,1}+k$。

确定了 $V$ 后，格子 $(i,j)$ 必须被经过 $c_{i,j}=V-a_{i,j}$ 次，特别地，起终点的值必须有 $a_{n,m}=a_{1,1}$。**但只检查这一条件还不够，因为路径必须连续。例如某个格子需要被经过，但它的左边和上边都没有路径到达，那么显然无解。**

我们把经过某个格子的路径次数分为向右和向下。具体地，设 $r_{i,j}$ 表示经过格子 $(i,j)$ 后，向右移动到 $(i,j+1)$ 的路径数量。一共有 $c_{i,j}$ 条路径经过 $(i,j)$，因此向下移动的路径数量为 $c_{i,j}-r_{i,j}$。

考虑格子 $(i,j+1)$，从左边来的路径数是 $r_{i,j}$，上方格子 $(i-1,j+1)$ 共有 $c_{i-1,j+1}$ 条路径经过，其中有 $r_{i-1,j+1}$ 条向右走，因此向下走的数量为 $c_{i-1,j+1}-r_{i-1,j+1}$。两部分相加是经过 $(i,j+1)$ 的路径总数，因此 $${
r_{i,j}
=
c_{i,j+1}
-c_{i-1,j+1}
+r_{i-1,j+1}
}$$。

**考虑网格边界的情况**。第一列的格子的所有路径都从上面过来，满足 ${
c_{i,1}=c_{i-1,1}-r_{i-1,1}
}$；最后一列的格子只能向下走，令 $r_{i,m}=0$。经过最后一行的格子的路径都必须向右走，满足 ${
r_{n,j}=c_{n,j}
}$。

综上，$k$ 唯一确定了以后，我们递推整个矩阵的 $c_{i,j}$ 和 $r_{i,j}$，检查所有流量和边界是否合法。另外特判 $n=1$ 或 $m=1$ 的情况。

## Code

```c++
// Problem: Matrix
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133880/L
// Time: 2026-08-01 13:29:20
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
const ll mod = 1;

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<vector<ll>> g(n + 1, vector<ll>(m + 1));
    vector<vector<ll>> c(n + 1, vector<ll>(m + 1));
    vector<vector<ll>> r(n + 1, vector<ll>(m + 1));

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> g[i][j];

    if (n == 1 || m == 1)
    {
        int v = g[1][1];
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                if (g[i][j] != v)
                {
                    cout << -1 << endl;
                    return;
                }

        cout << 0 << endl;
        return;
    }

    ll k = g[1][2] + g[2][1] - 2 * g[1][1];
    if (k < 0)
    {
        cout << -1 << endl;
        return;
    }

    ll v = k + g[1][1];
    bool flag = true;

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            c[i][j] = v - g[i][j];
            if (c[i][j] < 0 || c[i][j] > k)
            {
                flag = false;
                goto end;
            }
        }

    if (c[1][1] != k || c[n][m] != k)
    {
        flag = false;
        goto end;
    }

    for (int i = 1; i <= n; i++)
        for (int j = 1; j < m; j++)
        {
            r[i][j] = c[i][j + 1] - c[i - 1][j + 1] + r[i - 1][j + 1];
            if (r[i][j] > c[i][j] || r[i][j] < 0)
            {
                flag = false;
                goto end;
            }
        }

    for (int i = 2; i <= n; i++)
    {
        ll up = c[i - 1][1] - r[i - 1][1];
        if (up != c[i][1])
        {
            flag = false;
            goto end;
        }
    }

    for (int j = 1; j < m; j++)
    {
        if (r[n][j] != c[n][j])
        {
            flag = false;
            goto end;
        }
    }

end:
    cout << (flag ? k : -1) << endl;
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



# N - Welcome to HIT

> 关键词：签到

## Code

```c++
cout << "HIT" << endl;
```

