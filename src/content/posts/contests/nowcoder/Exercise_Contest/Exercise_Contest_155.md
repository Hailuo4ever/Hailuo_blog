---
title: 牛客练习赛 Round 155
published: 2026-06-19
description: "Nowcoder Exercise Contest 155"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客练习赛 155](https://ac.nowcoder.com/acm/contest/136719)

# A - 出题灵感：异或最大值

> 关键词：构造

## 思路

这道题不用模拟日期。如果从每个日期正着算到 $20260109$ 会超时，如果倒着枚举预处理，写起来就会很麻烦。

发现数位异或值是有一个天然上限的，从 $0$ 到 $9$ 的数字最多只用四个二进制位，因此异或的最大值为 $15$。

因此只要找到离 $20260109$ 最近的某天的异或值为 $15$，直接输出即可，当询问为 $20260109$ 的时候特判一下。

> 找这个疑似纯直觉。

## Code

```c++
// Problem: 出题灵感：异或最大值
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136719/A
// Time: 2026-06-19 22:28:12
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
const int N = 0;

const int days[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

void solve()
{
    int a, b, c;
    cin >> a >> b >> c;

    if (a == 2026 && b == 1 && c == 9)
        cout << "2026 1 9" << endl;
    else
        cout << "2026 1 8" << endl;
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

# B - 正负交锋：光与暗的能量序列

> 关键词：博弈论

## 思路

$n \le 2$ 时策略是唯一的，答案为 $1$，当 $n > 2$ 时，先手把 $1$ 放在除两端外的位置，后手只能堵一头，因此先手可以放两个连续的 $1$，而后就是 $1$ 和 $-1$ 交替了，答案为 $2$。

## Code

```c++
// Problem: 正负交锋：光与暗的能量序列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136719/B
// Time: 2026-06-19 22:45:11
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
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    cout << (n > 2 ? 2 : 1) << endl;
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

# C - 遗迹探索：不可重叠的频段

> 关键词：贪心

## 思路

首先把每个数看作二选一。对于每个 $a_i$，它可以产生两个数：$a_i$ 或 $a_i-x$，也可以丢弃。注意 $S$ 是不可重集合。

首先我们考虑最小值如何贪心。对于一个 $a_i$，定义 $l_i=\min (a_i, a_i-x)$，$r_i=\max (a_i, a_i-x)$，显然有 $l_i \le r_i$，如果想让集合元素和尽可能小，我们应该优先选更小的数 $l_i$。

所以正确的最小值贪心策略如下：

1. 正序排序数组；
2. 如果候选值是正数就直接跳过，因为正数只会让最小值变大；
3. 优先尝试加入 $l_i$；
4. 如果 $l_i$ 已经在集合 $S$ 里，就尝试加入 $r_i$。

最大值的贪心策略同理：

1. 倒序排序数组；
2. 如果候选值是负数直接跳过，因为负数只会让最大值变小；
3. 优先尝试加入 $r_i$；
4. 如果 $r_i$ 已经在集合 $S$ 里，就尝试加入 $l_i$。

## Code

```c++
// Problem: 遗迹探索：不可重叠的频段
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136719/C
// Time: 2026-06-19 23:09:38
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
    ll n, x;
    cin >> n >> x;

    vector<ll> a(n);
    for (auto &y: a)
        cin >> y;

    sort(all(a));

    ll mn = 0;
    set<ll> s;

    for (int i = 0; i < n; i++)
    {
        ll l = min(a[i], a[i] - x);
        ll r = max(a[i], a[i] - x);

        if (l >= 0)
            break;

        if (!s.count(l))
            s.insert(l), mn += l;
        else if (r < 0 && !s.count(r))
            s.insert(r), mn += r;
    }

    ll mx = 0;
    s.clear();
    reverse(all(a));

    for (int i = 0; i < n; i++)
    {
        ll l = min(a[i], a[i] - x);
        ll r = max(a[i], a[i] - x);

        if (r <= 0)
            break;

        if (!s.count(r))
            s.insert(r), mx += r;
        else if (l > 0 && !s.count(l))
            s.insert(l), mx += l;
    }

    cout << mn << " " << mx << endl;
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

