---
title: 牛客周赛 Round 154
published: 2026-07-26
description: "Nowcoder Week Contest 154"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 154 内测](https://ac.nowcoder.com/acm/contest/138241)

# A - 小红的类型转换

> 关键词：签到

## Code

```c++
// Problem: 小红的类型转换
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/A
// Time: 2026-07-20 18:14:22
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
    double x;
    cin >> x;

    cout << (int) x << endl;
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

# B - 小红的矩阵构造

> 关键词：签到

## Code

```c++
// Problem: 小红的矩阵构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/B
// Time: 2026-07-20 18:15:34
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

    for (int i = 1; i <= n; i++)
        cout << i << " \n"[i == n];

    for (int i = n; i >= 1; i--)
        cout << i << " \n"[i == 1];
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

# C - 小红的序列删除

> 关键词：模拟

## 思路

考虑可能取到最大值的四个方向，即为 `RU, RD, LU, LD`。对于这四个方向，我们把其中的方向字符称作“有利字符”。

我们希望对于某个方向，有利字符尽可能多。设删除 $k$ 个字符后，剩余字符串长度为 $m=n-k$。

最终必须保留 $m$ 个字符。显然应该尽可能多地保留有利字符，因此保留的有利字符数量为 $g=\min(c,m)$，剩下的 $m-g$ 个字符只能从不利字符中选择。

剩下的就是模拟了，要输出子序列。

## Code

```c++
// Problem: 小红的序列删除
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/C
// Time: 2026-07-21 17:22:33
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
    string s;

    cin >> n >> k >> s;
    int m = n - k;

    // RU, RD, LU, LD

    map<char, int> mp;
    for (int i = 0; i < n; i++)
        mp[s[i]]++;

    int cnt[4] = {mp['R'] + mp['U'], mp['R'] + mp['D'], mp['L'] + mp['U'], mp['L'] + mp['D']};
    string comb[4] = {"RU", "RD", "LU", "LD"};

    int mx = -1;
    string c;

    for (int i = 0; i < 4; i++)
    {
        if (cnt[i] > mx)
            mx = cnt[i], c = comb[i];
    }

    // cout << mx << endl;

    if (m <= mx)
    {
        for (int i = 0; i < n; i++)
        {
            if (s[i] == c[0] || s[i] == c[1])
                cout << s[i], m--;

            if (m == 0)
                break;
        }
    }
    else
    {
        int rest = m - mx;
        for (int i = 0; i < n; i++)
        {
            if (s[i] == c[0] || s[i] == c[1])
                cout << s[i];
            else if (rest > 0)
                cout << s[i], rest--;
        }
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

# D - 小红的01串

> 关键词：差分

## 思路

定义 $d_i=[s_i\ne s_{(i+1)\bmod n}]$。如果两个相邻字符不同，$d_i=1$，否则 $d_i=0$。当前答案即为 $ans=\sum_{i=0}^{n-1}d_i$。

对于一个反转的区间，内部的所有 $d_i$ 都不会变化。只有两条边恰好有一个端点被反转。左边界的边为 $s_{(l-1+n)\bmod n}\longleftrightarrow s_l$，对应的差分位置为 $left=(l-1+n)\bmod n$；右边界的边为 $s_r\longleftrightarrow s_{(r+1)\bmod n}$，对应的差分位置为 $right=r$。因此一次操作只需要反转 $d_{(l-1+n)\bmod n}$ 和 $d_r$。

跨过环的区间也一样。虽然翻转了选定区间外部，但受影响的边依旧只有端点上两条。

## Code

```c++
// Problem: 小红的01串
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/C
// Time: 2026-07-20 18:17:17
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
    int n, q;
    string s;

    cin >> n >> q >> s;

    // s[i] =?= s[(i + 1) % n]
    vector<int> d(n, 0);

    for (int i = 0; i < n; i++)
        d[i] = (s[i] != s[(i + 1) % n]);

    int res = accumulate(all(d), 0);

    auto flip = [&](int x) -> void
    {
        if (d[x] == 0)
            res++;
        else
            res--;

        d[x] ^= 1;
    };

    while (q--)
    {
        int l, r;
        cin >> l >> r;

        flip((l - 1 + n) % n), flip(r);
        cout << res << endl;
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

# D' - 小红的排列构造

> 关键词：构造

## 题目

定义一个排列的权值为：每次操作交换任意两个元素，使得排列变为升序的最小交换次数。请你构造一个长为 $n$，权值为 $k$ 的排列 $p_1, p_2,\dots, p_n$，且对于所有 $i \in \left[1, n \right]$，不存在 $p_i = i$。如果不存在合法的排列，请输出 $\texttt{-1}$。 

> [!NOTE]
>
> 注：本题为被删除题目。

## 思路

对于一个排列，可以拆成若干个互不相交的环。在这个环中可以进行内部交换。一个长度为 $L$ 的环，至少需要 $L-1$ 次交换才能恢复原位。假设长度为 $n$ 的排列中有 $c$ 个环，那么它的权值为 $n-c$。因此我们需要构造环的数量为 $c=n-k$。

固定点 $p_i=i$，在环分解中就是一个长度为 $1$ 的环。要求不存在固定点，就意味着只存在长度 $\ge 2$ 的环。

有解的充要条件为 $\left\lceil\frac n2\right\rceil\le k\le n-1$。代表每个环至少需要两个元素且排列至少有一个环。

我们可以构造前 $c-1$ 个环为长度 $2$ 的环，剩下的所有元素组成最后一个大环。最后一个环的长度为 $L=n-2(c-1)$。

长度为 $2$ 的环，对于相邻两个位置 $i,i+1$，构造 $p_i=i+1,\quad p_{i+1}=i$。

最后的大环，假设剩余区间为 $[l,n]$，构造 $p_i=i+1\quad l\le i<n$，$p_n=l$。

## Code

```c++
// Problem: 小红的排列构造
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/D
// Time: 2026-07-20 18:21:29
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

    if (k < (n + 1) / 2 || k > n - 1)
    {
        cout << -1 << endl;
        return;
    }

    int cnt = n - k;
    vector<int> res(n + 1);

    for (int i = 1; i <= n;)
    {
        if (cnt == 1)
        {
            int t = i;
            for (int j = t; j < n; j++)
                res[j] = j + 1;
            res[n] = t;

            break;
        }

        res[i] = i + 1, res[i + 1] = i;
        i += 2, cnt--;
    }

    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

# E - 小红的子数组删除

> 关键词：滑动窗口，STL

## 思路

对于这道题，比较容易想到滑动窗口枚举删除区间，而中位数又考虑对顶堆。但堆只能删除顶上的元素，没办法动态维护，所以我们用两个 `multiset` 代替对顶堆。

考虑如何用两个 `multiset` 维护中位数，定义 $L$ 存放较小的一半元素，$R$ 存放较大的一半元素。

根据对顶堆的思路，整个过程中我们需要维护两个不变量。一个是 $needL=\left\lceil\frac m2\right\rceil=\frac{m+1}{2}$，维护集合大小 $|L|=needL$，$|R|=m-needL$。一个是顺序不变量，始终满足 $\max(L)\le\min(R)$。

考虑如何获取中位数，$m$ 为奇数时，判断中位数为 `*L.rbegin() == x`；$m$ 为偶数时，判断中位数为 `*L.rbegin() + *R.begin() == 2 * x`。

## Code

```c++
// Problem: 小红的子数组删除
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137840/E
// Time: 2026-07-26 21:25:12
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
const int N = 0;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    int n, k;
    cin >> n >> k;

    ll x;
    cin >> x;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    int m = n - k;
    if (m == 0)
    {
        if (x == 0)
            cout << 1 << endl;
        else
            cout << 0 << endl;

        return;
    }

    multiset<ll> L, R;
    int cnt = (m + 1) / 2;

    auto balance = [&](void) -> void
    {
        while (L.size() > cnt)
        {
            auto it = prev(L.end());

            R.insert(*it), L.erase(it);
        }

        while ((int) L.size() < cnt && !R.empty())
        {
            auto it = R.begin();

            L.insert(*it), R.erase(it);
        }
    };

    auto add = [&](ll v) -> void
    {
        if (L.empty() || v <= *L.rbegin())
            L.insert(v);
        else
            R.insert(v);

        balance();
    };

    auto erase = [&](ll v) -> void
    {
        auto it = L.find(v);

        if (it != L.end())
            L.erase(it);
        else
            it = R.find(v), R.erase(it);

        balance();
    };

    for (int i = k; i < n; i++)
        add(a[i]);

    int res = 0;
    for (int l = 0; l + k <= n; l++)
    {
        if (m & 1)
            res += (*L.rbegin() == x);
        else
            res += (*L.rbegin() + *R.begin() == 2 * x);

        if (l + k == n)
            break;

        erase(a[l + k]), add(a[l]);
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

# F - 艾雅法拉的点燃

> 关键词：线性DP

## 题目简述

题目中有 $n$ 名敌人排成一排，第 $i$ 名敌人的生命值为 $a_i$

有两种攻击方式：

- 普通攻击：对一名敌人造成 $1$ 点伤害，消耗 $x$ 点法力
- 点燃第 $i$ 名敌人：对第 $i$ 名敌人造成 $2$ 点伤害，并对相邻敌人各造成 $1$ 点伤害，消耗 $y$ 点法力

要求消灭所有敌人的最小法力值。

由于点燃一次会同时影响三个敌人，所以贪心是错的。

## 思路

### 转化题意

我们定义 $b_i$ 为对第 $i$ 名敌人使用点燃的次数。为了方便处理边界，定义 $b_0=b_{n+1}$，考虑第 $i$ 名敌人会受到哪些点燃伤害。

来自左边：对第 $i-1$ 名敌人点燃，第 $i$ 名敌人受到 $1$ 点伤害，因此贡献为 $b_{i-1}$；

来自自己：每次对第 $i$ 名敌人点燃，会造成 $2$ 点伤害，因此贡献为 $2b_i$；

来自右边：每次对第 $i+1$ 名敌人点燃，第 $i$ 名敌人受到 $1$ 点伤害，因此贡献为 $b_{i+1}$。

所以第 $i$ 名敌人受到的点燃总伤害为 $b_{i-1}+2b_i+b_{i+1}$。如果点燃伤害不足，剩余部分必须使用普通攻击补足。因此普通攻击次数为 $\max\left(0,a_i-b_{i-1}-2b_i-b_{i+1}\right)$。

所以题目本质上是在选择 $b_1,b_2,\ldots,b_n$，最小化 $\sum_{i=1}^{n}
\left[
b_i y+
x\cdot
\max\left(0,a_i-b_{i-1}-2b_i-b_{i+1}\right)
\right]$。

### DP

定义 $dp[i][p][q]$ 表示第 $1$ 到第 $i-1$ 名敌人的费用已经全部结算，且已经确定了 $b_1,b_2,\ldots,b_i$，$b_{i-1}=p$，$b_i=q$ 情况下的当前最小法力消耗。注意在状态 $dp[i][p][q]$ 中，第 $i$ 名敌人还没有结算，因为第 $i$ 名敌人的伤害还需要知道右边的 $b_{i+1}$。

初始化时，枚举对第 $1$ 名敌人使用点燃的次数，即 $dp[1][0][q]=qy$。

状态转移方程为：${dp[i+1][q][r]=\min\left(dp[i+1][q][r],dp[i][p][q]+need\cdot x+r\cdot y\right)}$。$(p,q)\longrightarrow(q,r)$。

## Code

```c++
// Problem: 艾雅法拉的点燃
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138241/F
// Time: 2026-07-22 22:27:36
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
const int N = 50;

void solve()
{
    ll n, x, y;
    cin >> n >> x >> y;

    vector<int> a(n + 2, 0);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    vector<vector<vector<ll>>> dp(n + 2, vector<vector<ll>>(N + 1, vector<ll>(N + 1, INF)));

    for (int q = 0; q <= a[1]; q++)
        dp[1][0][q] = q * y;

    for (int i = 1; i <= n; i++)
    {
        for (int p = 0; p <= N; p++)
        {
            for (int q = 0; q <= N; q++)
            {
                if (dp[i][p][q] == INF)
                    continue;

                int limit = (i == n ? 0 : a[i + 1]);

                for (int r = 0; r <= limit; r++)
                {
                    ll need = max(0LL, 1LL * a[i] - p - 2LL * q - r);
                    dp[i + 1][q][r] = min(dp[i + 1][q][r], dp[i][p][q] + need * x + 1LL * r * y);
                }
            }
        }
    }

    ll res = INF;
    for (int q = 0; q <= N; q++)
        res = min(res, dp[n + 1][q][0]);
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

