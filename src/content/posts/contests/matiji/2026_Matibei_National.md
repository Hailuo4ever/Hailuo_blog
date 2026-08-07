---
title: 2026 码蹄杯国赛
published: 2026-08-02
description: "MatiCup National"
image: "https://img.hailuo4ever.com/cover/cry.png"
tags: [算法题解, 码蹄杯]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 题库补题链接：[码蹄集](https://www.matiji.net/exam/ojquestionlist?questionBankId=C98C14523F069FECB0DEED64F00CEAB0)

# A - 燕丹归国谋策

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
#define eb emplace_back
using ll = long long;

void solve()
{
    string s;
    cin >> s;

    bool flag1 = false, flag2 = false;
    for (auto c: s)
    {
        if (c >= 'a' && c <= 'z')
            flag1 = true;
        if (c >= 'A' && c <= 'Z')
            flag2 = true;
    }

    if (flag1 && flag2)
        cout << "No" << endl;
    else
        cout << "Yes" << endl;
}

int main()
{
    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# C - 荆轲受命陈策

> 关键词：模拟

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
#define eb emplace_back
using ll = long long;
using pll = pair<ll, ll>;
const int N = 5010;

struct area
{
    int a, b, c, d;
} p[N];

// check if A is in B
bool check(area A, area B)
{
    auto [a1, b1, c1, d1] = A;
    auto [a2, b2, c2, d2] = B;

    // auto chk = [&](int x, int y) -> bool
    // {
    // if (x >= a2 && x <= c2 && y >= b2 && y <= d2)
    // return true;
    // return false;
    // };
    //
    // if (chk(a1, d1) || chk(c1, d1) || chk(a1, b1) || chk(c1, b1))
    // return true;

    if (c2 < a1 || a2 > c1 || d2 < b1 || b2 > d1)
        return false;

    return true;
}

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
    {
        int a, b, c, d;
        cin >> a >> b >> c >> d;
        p[i] = {a, b, c, d};
    }

    for (int i = 1; i <= n; i++)
    {
        int res = 0;
        for (int j = 1; j <= n; j++)
        {
            if (i == j)
                continue;

            if (check(p[j], p[i]) || check(p[i], p[j]))
                res++;
        }
        cout << res << ' ';
    }
}

int main()
{
    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# D - 督亢樊首成礼

> 关键词：找规律

## 思路

固定一个点作为三角形的顶点，考虑有多少种顶角可以选择。不难发现，奇数情况下对于每个点都有 $\frac {n-1} 2$ 种选择，偶数情况下有 $\frac {n-2} 2$ 种选择。由于除法下取整，两种情况可以一起写。

下面可以发现一个问题，等边三角形会导致重复的计数。考虑什么时候会出现等边三角形。等边三角形的三个顶点需要把圆周均匀分成三段，所以必须满足 $n$ 是 $3$ 的倍数。

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
using ll = long long;

void solve()
{
    ll n;
    cin >> n;

    ll res = n * ((n - 1) / 2);
    cout << (n % 3 == 0 ? res - n / 3 * 2 : res) << endl;
}

int main()
{
    int T = 1;
    cin >> T;

    while (T--)
        solve();

    // cout << (double) 3376 / 4763 << endl;
    return 0;
}

```

# G - 易水送别绝唱

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define endl '\n'
#define eb emplace_back
using ll = long long;

void solve()
{
    int n, x;
    cin >> n >> x;

    vector<int> st(n + 1, 0);

    for (int i = 1; i <= x / 2; i++)
    {
        if (x - i == i)
            continue;

        st[i] = 1;
    }

    vector<int> res;
    for (int i = 1; i <= n; i++)
        if (!st[i])
            res.eb(i);

    cout << res.size() << endl;
    for (auto x: res)
        cout << x << ' ';
    cout << endl;
}

int main()
{
    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# L - 燕献太子亡国

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

void solve()
{
    int n, k;
    cin >> n >> k;

    vector<int> a(n + 1, 0), s(n + 1, 0);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        s[i] = s[i - 1] + a[i];
    }

    int res = 0;
    for (int i = k; i <= n; i += k)
    {
        // cout << i << endl;
        res += a[i];
    }
    cout << res << endl;
}

int main()
{
    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

