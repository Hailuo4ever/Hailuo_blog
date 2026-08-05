---
title: 牛客周赛 Round 155
published: 2026-08-02
description: "Nowcoder Week Contest 155"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 155](https://ac.nowcoder.com/acm/contest/138240)

# A - 小月的奇偶灯控

> 关键词：签到

## Code

```c++
// Problem: 小月的奇偶灯控
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138240/A
// Time: 2026-08-02 19:00:27
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
    vector<int> a(3);
    for (int i = 0; i < 3; i++)
        cin >> a[i];

    int s = accumulate(all(a), 0);
    if (s % 2)
        cout << "ON" << endl;
    else
        cout << "OFF" << endl;
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

# B - 小月的立方体

> 关键词：三维几何

## 思路

立方体有四条体对角线，对于每个点单独判即可。

## Code

```c++
// Problem: 小月的立方体
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138240/B
// Time: 2026-08-02 19:03:38
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

    ll res = 0;
    for (int z = 0; z <= n; z++)
        for (int x = 0; x <= n; x++)
            for (int y = 0; y <= n; y++)
            {
                ll k;
                cin >> k;

                // (x, x, x)
                if (x == y && y == z)
                    res += k;

                // (x, x, n - x)
                if (x == y && z == n - x)
                    res += k;

                // (x, n - x, x)
                if (x == z && y == n - x)
                    res += k;

                // (n - x, x, x)
                if (y == z && x == n - y)
                    res += k;
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

# C - 小月的密码锁

> 关键词：暴力

## 思路

暴力枚举所有分割位置 $p$，模拟左边和右边的修改即可。

## Code

```c++
// Problem: 小月的密码锁
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138240/C
// Time: 2026-08-02 19:10:16
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

    string s, t;
    cin >> s >> t;

    int res = n;
    for (int c = 0; c <= n; c++)
    {
        for (int p = 0; p < 5; p++)
        {
            for (int q = 0; q < 5; q++)
            {
                int cnt = 0;

                for (int i = 0; i < n; i++)
                {
                    int d1 = (s[i] - 'A' + p) % 5, d2 = (s[i] - 'A' + q) % 5;
                    if (i < c)
                    {
                        if ('A' + d1 != t[i])
                            cnt++;
                    }
                    else
                    {
                        if ('A' + d2 != t[i])
                            cnt++;
                    }
                }
                res = min(res, cnt);
            }
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

# D - 小月的电台

> 关键词：状态压缩

## 思路

每台电台的频道状态只有 $m$ 位，不同状态的数量最多只有 $2^m\le 2^{11}=2048$。

将每台电台支持的频道集合表示成一个二进制整数，判断两种电台能否通信即按位与不为 $0$。

定义 $cnt[mask]$ 表示频道集合恰好为 $mask$ 的电台数量，枚举两个状态，判断与起来不为 $0$ 即可。相同状态时答案为组合数 $C_{cnt}^2$，状态不同时只需要计算前一个状态小于后一个状态的情况即可。

## Code

```c++
// Problem: 小月的电台
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/138240/D
// Time: 2026-08-02 19:26:45
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

    unordered_map<int, int> mp;
    while (n--)
    {
        string s;
        cin >> s;

        bitset<32> bits(s);
        int t = bits.to_ulong();
        mp[t]++;
    }

    ll res = 0;
    for (auto [k, cnt]: mp)
    {
        for (auto [t, cnt2]: mp)
        {
            if ((k & t) == 0)
                continue;

            if (k == t)
                res += 1ll * cnt * (cnt - 1) / 2;
            else if (k < t)
                res += 1ll * cnt * cnt2;
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

