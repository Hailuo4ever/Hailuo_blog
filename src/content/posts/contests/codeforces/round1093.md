---
title: cf round 1093
published: 2026-05-23
description: "Codeforces Round 1093 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 
> 比赛链接：[Codeforces Round 1093 (Div. 2)](https://codeforces.com/contest/2220)

# A - Blocked

> 关键词：构造

## 思路

注意到数组中不能出现两个相同的元素，因为总有一个位置会被阻塞。

## Code

```c++
// Problem: CF 2220 A
// Contest: Codeforces - Codeforces Round 1093 (Div. 2)
// URL: https://codeforces.com/contest/2220/problem/A
// Time: 2026-05-23 10:53:51
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

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    sort(all(a));

    for (int i = 1; i < n; i++)
    {
        if (a[i] == a[i - 1])
        {
            cout << -1 << endl;
            return;
        }
    }

    for (int i = n - 1; i >= 0; i--)
        cout << a[i] << " ";
    cout << endl;
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

# B -OIE Excursion

> 关键词：思维，贪心

## 思路

考虑什么情况下他无论如何也过不去：考虑一段计时器相同的监视者。设这一段有 $l$ 个，由于每次只能移动 $1$ 格，所以至少需要 $l$ 秒来通过，故当周期小于 $l+1$（有一秒是被监视的，不能通过）秒时不能通过该段。

## Code

```c++
// Problem: CF 2220 B
// Contest: Codeforces - Codeforces Round 1093 (Div. 2)
// URL: https://codeforces.com/contest/2220/problem/B
// Time: 2026-05-23 10:59:20
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
    int n, m;
    cin >> n >> m;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    int mx = 1;

    for (int i = 0; i < n;)
    {
        int j = i;

        while (j < n && a[j] == a[i])
            j++;

        mx = max(mx, j - i);
        i = j;
    }

    if (mx < m)
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# C - Grid L

> 关键词：数学

## 思路

一个 $n \times m$ 网格有：$(n+1) \times m$ 个横向单位边，$n \times (m+1)$ 个纵向单位边，则总边数为 $2nm+n+m$。

**则第一个必要条件为：$p+2q=2nm+n+m$。**

不妨设 $n \le m$，纵向边数为 $V=n(m+1)$，横向边数为 $H=(n+1)m$，差值为 $H-V=(n+1)m-n(m+1)=m-n$。每个 L 形块都会同时消耗一条横边和一条竖边，所以它无法消除横竖数量的差异，因此，最后至少有 $m-n$ 条多出来的横边必须用单独线段覆盖。

**则第二个必要条件为：$p \ge m-n$。**

> 关于充分性的证明：当 $n \le m$ 时，较少的是纵边，数量为：$V=n(m+1)$
> 
> 可以证明所有纵边都能各自配到一条不同的相邻横边，形成 L 形块。
>
> 也就是说，一个 $n \times m$ 网格最多能放：$n(m+1)$ 个 L 形块。
>
> 而条件 $p \ge m-n$ 等价于：$q \le n(m+1)$。
> 
> 所以只要满足总边数和 $p \ge m-n$，就一定可以放下 $q$ 个 L 形块，剩下的边全部用 $p$ 个单独线段补上。

下面我们考虑，如何找到 $n, m$，使得 $2nm+n+m=p+2q$，就是数学方法了。

![](https://img.hailuo4ever.com/codeforces/round_1093_img1.png)

直接暴力枚举因子 $a$，通过 $S / a$ 计算 $b$，再算出 $n, m$，检查 $|n-m| \le p$ 即可。

## Code

```c++
// Problem: CF 2220 C
// Contest: Codeforces - Codeforces Round 1093 (Div. 2)
// URL: https://codeforces.com/contest/2220/problem/C
// Time: 2026-05-23 12:07:18
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
    ll p, q;
    cin >> p >> q;

    ll S = 2 * (p + 2 * q) + 1;
    for (ll a = 3; a * a <= S; a += 2)
    {
        if (S % a != 0)
            continue;

        ll b = S / a, n = (a - 1) / 2, m = (b - 1) / 2;

        if (n >= 1 && m >= 1 && abs(n - m) <= p)
        {
            cout << n << " " << m << endl;
            return;
        }
    }
    cout << -1 << endl;
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

