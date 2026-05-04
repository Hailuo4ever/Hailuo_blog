---
title: LGR-265-Div3
published: 2026-05-04
description: "洛谷基础赛 Round 34"
image: "https://img.hailuo4ever.com/cover/lanqiao.png"
tags: [算法题解, 洛谷]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[LGR-265-Div.3 洛谷基础赛 #34](https://www.luogu.com.cn/contest/274106#description)

# A - 珊瑚海

> 关键词：模拟，贪心

## 思路

为了保证小Y至少拿到 $n$ 杯水，我们无论如何都要走 $n$ 趟，最小需要花费的代价为 $n*(d+1)$，假如 $m<n*(d+1)$，说明无法完成基础任务，输出 `-1`。

如果可以做到这个基础任务，我们考虑最大化小Z的利益：**之前的这 $n$ 趟应该选择方案3：给两个人都接一杯**，会额外消耗 $(d+2) - (d+1) = \mathbf{1}$ 点体力。如果还有体力，就只给自己接水，额外消耗 $d+1$ 点体力。

设满足小Y的要求后，还剩余 `rem` 点体力，有 `rem = m - n * (d + 1)`。顺手接水的杯数为 `C = min(n, rem)`，单独接水的杯数为 `B = (rem - C) / (d + 1)`。

最终答案为 `C + B`。

## Code

```c++
// Problem: Luogu C274106 T663578
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/T663578?contestId=274106
// Time: 2026-05-04 14:00:03
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

int main()
{
    ll n, m, d;
    cin >> n >> m >> d;

    ll req = n * (d + 1);

    if (m < req)
    {
        cout << -1 << endl;
        return 0;
    }

    ll t = m - req;

    ll a = min(n, t);
    t -= a;

    ll b = t / (d + 1);
    cout << a + b << endl;

    return 0;
}

```

# B - 听妈妈的话

> 关键词：贪心，思维

## 思路

我们希望尽可能多的相邻对能成功配对，所以我们指定性别为：公母公母公母...（性别交替）一定是最优的，这样每一个相邻对都可以生产鸡蛋。

我们考虑如何计算每堆的贡献，对于相邻的第 $i$ 个和第 $i+1$ 个箱子，必须等两只鸡都孵化出来才能下蛋，他们最早开始下蛋的日期是两只鸡孵化日期的最大值：`d = max(a[i], a[i+1])`。第 $i$ 对邻居的贡献即为：`max(0, t - max(a[i], a[i+1]))`。

## Code

```c++
// Problem: Luogu C274106 T664073
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/T664073?contestId=274106
// Time: 2026-05-04 14:10:32
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

ll res;

int main()
{
    ll n, t;
    cin >> n >> t;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = 0; i < n - 1; i++)
    {
        ll d = max(a[i], a[i + 1]);

        if (d < t)
            res = res + t - d;
    }

    cout << res << endl;
    return 0;
}

```

# C - 本草纲目

> 关键词：思维，数学

## 思路

我们考虑这两种操作实际上干了什么：

1. 将当前所有病毒群数量翻倍：最终数组里的元素个数一定是2的整数次幂，也就是 $2^m$ 个。
2. 选择一个病毒群的数量乘 $x$：最终数组里的每一个元素都一定是 $x$ 的某次幂（即 $x_k$ 个）。

因此，这道题的本质是在问：**能否将整数 $n$ 拆分成恰好 $2^m$ 个 $x$ 的整数次幂之和**。

需要的最小项数是容易考虑的：如果我们把 `n` 写成 `x` 进制，比如 `n = 12, x = 3`，那么 12 的三进制是 `110`，也就是 $1 \times 3^2 + 1 \times 3^1 + 0 \times 3^0$。 各位数字之和（$1+1+0=2$）就是我们拼出 `n` 所需的最少 $x^k$ 项的数量。我们把这个最小项数记为 $S_x(n)$。

如果想要增加项数怎么办？我们只能把一个 $x^k$ 拆分成 `x` 个 $x^{k-1}$。每次这样拆分，项的总数会增加 `x - 1`。

这意味着，所有合法的项数 `K` 必须满足两个条件：

1. 范围限制：$S_x(n) \le K \le n$ （最多全拆成 1，也就是 `n` 项）。

2. 同余限制：每次拆分增加 `x - 1`，所以 `K` 必须满足：$K \equiv S_x(n) \pmod{x-1}$

   根据数论知识，一个数和它的各位数字之和关于“进制减一”是同余的。所以这个条件可以直接简化为：$K \equiv n \pmod{x-1}$

因为我们需要的项数 `K` 必须是 $2^m$，所以我们只需要枚举 `m`，检查 $2^m$ 是否同时满足上述的“范围限制”和“同余限制”即可！

(注意特判：当 `x = 1` 时，操作 2 无效，只能靠操作 1 翻倍，此时 `n` 必须是 2 的整数次幂。)

## Code

```c++
// Problem: Luogu C274106 T615820
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/T615820?contestId=274106
// Time: 2026-05-04 14:19:53
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    ll n, x;
    cin >> n >> x;

    if (x == 1)
    {
        if ((n & (n - 1)) == 0)
            cout << "Yes" << endl;
        else
            cout << "No" << endl;
        return;
    }

    ll s = 0, tmp = n;
    while (tmp > 0)
    {
        s += tmp % x;
        tmp /= x;
    }

    ll m = x - 1, u = n % m;
    for (int i = 0; i <= 32; i++)
    {
        ll k = 1ll << i;
        if (k >= s && k <= n && (k % m) == u)
        {
            cout << "Yes" << endl;
            return;
        }
    }

    cout << "No" << endl;
}

int main()
{
    int T;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

