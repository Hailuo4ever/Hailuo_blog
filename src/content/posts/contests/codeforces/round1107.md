---
title: cf round 1107
published: 2026-07-05
description: "Codeforces Round 1107 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1107.(Div. 3)](https://codeforces.com/contest/2241)

# A - Divide and Conquer

> 关键词：签到

## Code

```c++
// Problem: CF 2241 A
// Contest: Codeforces - Codeforces Round 1107 (Div. 3)
// URL: https://codeforces.com/contest/2241/problem/A
// Time: 2026-07-02 22:48:34
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
    int x, y;
    cin >> x >> y;

    cout << (x % y == 0 ? "YES" : "NO") << endl;
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

# B - Good times Good times

> 关键词：思维，构造

## 思路

设 $x$ 的十进制长度是 $m$，令 $y = 10^m + 1$，那么 $x \times y = x \times (10^m + 1)$，展开得 $x \times y = x \times 10^m + x$，在十进制中相当于把 $x$ 拼接两次。

例如 $x = 73,\quad m = 2$，取 $y = 10^2 + 1 = 101$，则 $73 \times 101 = 7373$。

## Code

```c++
// Problem: CF 2241 B
// Contest: Codeforces - Codeforces Round 1107 (Div. 3)
// URL: https://codeforces.com/contest/2241/problem/B
// Time: 2026-07-02 22:48:35

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
const int N = 1e8 + 10;

void solve()
{
    int n;
    cin >> n;

    string s = to_string(n);
    int sz = s.size();

    int res = 1;
    for (int i = 0; i < sz; i++)
        res *= 10;

    cout << ++res << endl;
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

# C - RemovevomeR

> 关键词：思维

## 思路

**二进制串有一个性质：长度至少为 $3$ 时，一定存在长度 $2$ 或 $3$ 的回文子串。**

解释：对于任意连续三个字符，如果存在相邻相同，如 $00$ 或 $11$，就有长度为 $2$ 的回文子串；如果没有相邻相同，那么三个字符一定是 $010$ 或 $101$，是长度为 $3$ 的回文。

根据这个性质，答案只可能是 $1$ 或 $2$。而对于形如 $000\cdots 0111\cdots 1$ 或 $111\cdots 1000\cdots 0$ 这样只有一个分界点的字符串，只能在左侧或右侧里删，最后一定会变成 $01$ 或 $10$，答案为 $2$，其余情况答案都是 $1$。

## Code

```c++
// Problem: CF 2241 C
// Contest: Codeforces - Codeforces Round 1107 (Div. 3)
// URL: https://codeforces.com/contest/2241/problem/C
// Time: 2026-07-02 22:48:36
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

    int cnt = 0;
    for (int i = 1; i < n; i++)
        if (s[i] != s[i - 1])
            cnt++;

    cout << (cnt == 1 ? 2 : 1) << endl;
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

# D - An Alternative Way

> 关键词：思维，前缀和

## 思路

需要注意到，一次操作对前缀和的影响只能让某些前缀和 $+1$，不会导致任何前缀和减少。并且通过操作 $[i,i+1]$，可以只让第 $i$ 个前缀和增加 $1$；通过 $[n,n]$，可以只让第 $n$ 个前缀和增加 $1$。所以每个前缀和可以独立增加，不能减少。

因此，可行当且仅当所有前缀的前缀和满足 $sa \le sb$。

## Code

```c++
// Problem: CF 2241 D
// Contest: Codeforces - Codeforces Round 1107 (Div. 3)
// URL: https://codeforces.com/contest/2241/problem/D
// Time: 2026-07-05 12:01:18
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

    vector<ll> a(n), b(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = 0; i < n; i++)
        cin >> b[i];

    ll sa = 0, sb = 0;
    for (int i = 0; i < n; i++)
    {
        sa += a[i], sb += b[i];

        if (sa > sb)
        {
            cout << "NO" << endl;
            return;
        }
    }

    cout << "YES" << endl;
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

