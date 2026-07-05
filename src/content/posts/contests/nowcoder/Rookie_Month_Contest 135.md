---
title: 牛客小白月赛 135
published: 2026-07-03
description: "Nowcoder Rookie Month Contest 135"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

# A - 9勤

> 关键词：签到

## Code

```c++
// Problem: ⑨ 勤
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137264/A
// Time: 2026-07-03 19:00:03
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
    int n, a, b;
    cin >> n >> a >> b;

    cout << (a + b - n >= 0 ? (a + b - n) : 0) << endl;
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

# B - 9数

> 关键词：构造

## 思路

只要保证 $a$ 含有数字 $9$，且 $b=x-a$ 也含有数字 $9$。最简单的办法是让 $b$ 的个位变成 $9$。

考虑如何完成以上操作。我们想让 $b=x-a$ 满足 $b \equiv 9 \pmod {10})$，也就是 $x-a \equiv 9 \pmod {10})$，由于 $9 \equiv -1 \pmod {10})$，所以 $x-a \equiv -1 \pmod {10})$，移项得到 $a \equiv x+1 \pmod {10})$。所以只要选一个含有数字 $9$，且个位等于 $x+1 \pmod {10}$ 的数作为 $a$ 即可。

总结一下，$a$ 需要满足个位数是 $x+1 \pmod {10}$，且含有数字 $9$。

## Code

```c++
// Problem: ⑨ 数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137264/B
// Time: 2026-07-03 19:01:48
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
    int x;
    cin >> x;

    int t = (x % 10 + 1) % 10, a, b;

    a = (t == 9 ? 9 : 90 + t);
    b = x - a;

    cout << a << ' ' << b << endl;
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

# C - 9积

> 关键词：dp

## 思路

题目目标为：通过最少的加一操作，让数组中所有数总共贡献至少 $2$ 个因子 $3$。

对于每个数 $a_i$，考虑其对因子 $3$ 的贡献，有三种选择：

1. 不修改，贡献 $0$ 个因子 $3$，代价为 $0$。
2. 变成 $3$ 的倍数，代价为 $cost_1 = (3 - a_i \bmod 3) \bmod 3$。
3. 变成 $9$ 的倍数，代价为 $cost_2 = (9 - a_i \bmod 9) \bmod 9$。

可以使用 $dp$。设 $dp[i][j]$ 表示：考虑前 $i$ 个数，已经让乘积中有 $j$ 个因子 $3$ 的最小操作次数。超过 $2$ 的情况也压缩成 $2$。

初始化 $dp[0][0]=0$，其它状态为 $inf$。

状态转移如下：

1. 不修改：$dp[i][j] = \min(dp[i][j], dp[i-1][j])$

2. 变成 $3$ 的倍数：$dp[i][\min(2,j+1)] = \min(dp[i][\min(2,j+1)], dp[i-1][j] + cost_1)$
3. 变成 $9$ 的倍数：$dp[i][\min(2,j+2)] = \min(dp[i][\min(2,j+2)], dp[i-1][j] + cost_2)$

答案为 $dp[n][2]$。

## Code

```c++
// Problem: ⑨ 积
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137264/C
// Time: 2026-07-03 19:06:48
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

    vector<ll> a(n + 1);

    bool flag = false;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        if (a[i] == 0)
            flag = true;
    }

    if (flag)
    {
        cout << 0 << endl;
        return;
    }

    vector<vector<ll>> dp(n + 1, vector<ll>(3, INF));
    dp[0][0] = 0;

    for (int i = 1; i <= n; i++)
    {
        int c = (3 - a[i] % 3) % 3;
        int c2 = (9 - a[i] % 9) % 9;

        for (int j = 0; j < 3; j++)
        {
            if (dp[i - 1][j] == INF)
                continue;

            dp[i][j] = min(dp[i][j], dp[i - 1][j]);
            dp[i][min(2, j + 1)] = min(dp[i][min(2, j + 1)], dp[i - 1][j] + c);
            dp[i][min(2, j + 2)] = min(dp[i][min(2, j + 2)], dp[i - 1][j] + c2);
        }
    }

    cout << dp[n][2] << endl;
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

# D - 9战

> 关键词：模拟

## 思路

使用一个栈模拟消除过程即可，记录消除次数来判断先手能否必胜。

## Code

```c++
// Problem: ⑨ 战
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137264/D
// Time: 2026-07-03 19:44:55
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

    vector<int> a(n);
    for (auto &x: a)
        cin >> x;

    stack<int> stk;
    int cnt = 0;

    for (int i = 0; i < n; i++)
    {
        if (!stk.empty() && (stk.top() + a[i]) % 9 == 0)
        {
            stk.pop();
            cnt++;
            continue;
        }

        stk.push(a[i]);
    }

    cout << (cnt % 2 ? "Yes" : "No") << endl;
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

# E - 9串

> 关键词：思维，DP

## 思路

题目简述：定义一个长度为 $n$ 的数字串 $s$ 是「⑨串」，当且仅当：对于任意位置 $i$，从 $i$ 开始连续取 $9$ 个字符：$s_i,s_{i+1},\dots,s_{i+8}$，（下标是循环的），把这 $9$ 个字符拼成一个十进制整数 $x_i$，要求 $x$ 能被 $9$ 整除。现在你可以修改任意位置的字符，每次修改一个字符，求最少修改次数。

**有一个关键性质：一个整数能被 $9$ 整除，当且仅当它的数位和能被 $9$ 整除。**

设第 $i$ 个窗口的数位和为：$W_i=s_i+s_{i+1}+\cdots+s_{i+8}$，下一个窗口为 $W_{i+1}=s_{i+1}+s_{i+2}+\cdots+s_{i+9}$。

两者相减，有 $W_{i+1}-W_i=s_{i+9}-s_i$，因为他们都要是 $9$ 的倍数，所以 $s_{i+9}-s_i\equiv 0\pmod 9$，也就是 $s_{i+9}\equiv s_i\pmod 9$。

这说明，每个位置 $i$ 和位置 $i+9$ 上的数字，在模 $9$ 意义下必须相同。也就是要求 $s_i \bmod 9 = s_{i+9}\bmod 9$。且由于 $0 \equiv 9 \pmod 9$，字符 $0$ 和字符 $9$ 是同一类。

**因为下标是循环的，所以我们不断从 $i$ 跳到 $i+9 \pmod n$。这会把所有位置分成若干组，组数为 $g=\gcd(n,9)$。**

由于 $9$ 的因子只有 $1,3,9$，所以 $g\in\{1,3,9\}$。同一组内的位置，最终必须选择相同的模 $9$ 余数。

确定上述条件后，还需要满足窗口和是 $9$ 的倍数。设每一组最终选择的余数为：$r_0,r_1,\dots,r_{g-1}$。因为任意长度为 $9$ 的窗口里，每个组会出现 $\frac{9}{g}$ 次，所以窗口和为：$\frac{9}{g}(r_0+r_1+\cdots+r_{g-1})$，要求模 $9$ 为 $0$。

现在问题变成，对于每一个数 $c$，选择一个余数 $r_c\in\{0,1,2,\dots,8\}$。如果某个位置原来的数字模 $9$ 不等于 $r_c$，就需要修改一次。要求总代价最小，并且满足窗口和条件。

假设第 $c$ 组中，有 $cnt[c][r]$ 个数字模 $9$ 等于 $r$，这组总大小是 $sz_c$。

如果最终把这一组全部改成余数 $r$，那么不需要改的数量是：$cnt[c][r]$，需要改的数量是：$cost[c][r]=sz_c-cnt[c][r]$。

**所以我们要做的是：每组选择一个余数 $r$，使总代价最小，并满足模 $9$ 条件。**

考虑 $DP$，$dp[i][m]$ 表示已经处理前 $i$ 个组，当前窗口和对 $9$ 取模为 $m$ 时的最小修改次数。答案为 $dp[g][0]$。

## Code

```c++
// Problem: ⑨ 串
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/137264/E
// Time: 2026-07-03 22:33:01
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
    string s;

    cin >> n >> s;

    int g = gcd(n, 9), c = 9 / g;

    vector<vector<int>> cnt(g, vector<int>(9, 0));
    vector<int> sz(g, 0);

    for (int i = 0; i < n; i++)
    {
        int c = i % g;
        int v = (s[i] - '0') % 9;

        cnt[c][v]++;
        sz[c]++;
    }

    vector<vector<int>> dp(g + 1, vector<int>(9, inf));
    dp[0][0] = 0;

    for (int i = 0; i < g; i++)
    {
        for (int m = 0; m < 9; m++)
        {
            if (dp[i][m] == inf)
                continue;

            for (int r = 0; r < 9; r++)
            {
                int cost = sz[i] - cnt[i][r];
                int nm = (m + c * r) % 9;

                dp[i + 1][nm] = min(dp[i + 1][nm], dp[i][m] + cost);
            }
        }
    }

    cout << dp[g][0] << endl;
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

