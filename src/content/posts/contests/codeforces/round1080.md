---
title: cf round 1080
published: 2026-05-12
description: "Codeforces Round 1080 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1080 (Div. 3)](https://codeforces.com/contest/2195)

# A - Sieve of Erato67henes

> 关键词：签到

## Code

```c++
// Problem: CF 2195 A
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/A
// Time: 2026-05-08 14:17:57
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    bool fl = false;

    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;
        if (x == 67)
            fl = true;
    }

    if (fl)
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

# B - Heapify 1

> 关键词：模拟

## 思路

由于只能交换下标为 $2$ 倍关系的数，所以可交换的次数其实不多。暴力即可。

## Code

```c++
// Problem: CF 2195 B
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/B
// Time: 2026-05-08 15:19:19
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j *= 2)
            for (int k = i * 2; k <= n; k *= 2)
                if (a[k / 2] > a[k])
                    swap(a[k / 2], a[k]);

    if (is_sorted(all(a)))
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

# C - Dice Roll Sequence

> 关键词：思维，贪心

## 思路

注意到两个整数位于相邻面，当且仅当 $s \neq t$ 并且 $s+t \neq 7$。并且注意到对于任意的两个面，总存在第三个面和两者均相邻。

考虑遍历 $a_i$，如果 $a_i + a_{i + 1} = 7$ 或 $a_i = a_{i + 1}$，就一定要有一个值被修改，如果修改 $a_i$，后续的 $a_{i + 1}$ 和 $a_{i + 2}$ 可能还有问题，根据上面的结论，我们修改中间的 $a_{i + 1}$ 即可。可以把 $a_{i+1}$ 改成 $0$ 表示已修改，也可以 `i++` 跳过。

## Code

```c++
// Problem: CF 2195 C
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/C
// Time: 2026-05-08 16:25:33
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

    int res = 0;
    for (int i = 1; i < n; i++)
    {
        if (a[i - 1] + a[i] == 7 || a[i - 1] == a[i])
            res++, i++;
    }

    cout << res << endl;
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

# D - Absolute Cinema

> 关键词：数学，推公式，差分

## 思路

> [!NOTE]
>
> 对于绝对值函数求和的式子，可以从数学的角度看。
>
> 对于这样的函数 $f(x) = \sum a_i \cdot |x - i|$，一阶导数是斜率，在 $x = i$ 处突变。对于 $y = |x - i|$，除了 $x=i$ 这个“拐点”之外，其他所有地方的二阶导数都是 $0$。只有在 $x=i$ 处，斜率从 $-1$ 瞬间跳变到 $1$（变化量为 $2$）。
>
> 既然我们想求 $a_x$，我们只需要对 $f(x)$ 求二阶导数。因为在 $x$ 这个点，其他所有的项 $a_i \cdot |x - i|$ ($i \neq x$) 的二阶导数都是 $0$，只有 $a_x \cdot |x - x|$ 在这里会暴露出 $2a_x$ 的值。
>
> 而**一阶导数对应一维差分，二阶导数对应二维差分**，因此对 $f(x)$ 做两次差分就能提取 $a_x$。
>
> 首尾两项比较特殊，需要单独求解。

![](https://img.hailuo4ever.com/codeforces/round_1080_img1.png)

## Code

```c++
// Problem: CF 2195 D
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/D
// Time: 2026-05-12 17:42:57
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
const int N = 3e5 + 10;

ll a[N], res[N];

void solve()
{
    ll n;
    cin >> n;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n - 2; i++)
        res[i + 1] = (a[i] - a[i + 1] - (a[i + 1] - a[i + 2])) / 2;

    ll sum1 = 0, sum2 = 0;
    for (int i = 2; i < n; i++)
    {
        sum1 = sum1 + (n - i) * res[i];
        sum2 = sum2 + (i - 1) * res[i];
    }

    cout << (a[n] - sum1) / (n - 1) << " ";

    for (int i = 2; i < n; i++)
        cout << res[i] << " ";

    cout << (a[1] - sum2) / (n - 1) << endl;
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

