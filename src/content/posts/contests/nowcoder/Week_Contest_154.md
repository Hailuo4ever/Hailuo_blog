---
title: 牛客周赛 Round 154
published: 2026-07-26
description: "Nowcoder Week Contest 154"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: true
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

    if (mx >= m)
    {
        for (int i = 0; i < n; i++)
        {
            if (s[i] == c[0] || s[i] == c[1])
                cout << s[i];
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



