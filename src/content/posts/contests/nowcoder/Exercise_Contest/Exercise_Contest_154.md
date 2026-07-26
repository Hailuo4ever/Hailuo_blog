---
title: 牛客练习赛 Round 154
published: 2026-06-01
description: "Nowcoder Exercise Contest 154"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客练习赛 154](https://ac.nowcoder.com/acm/contest/135884)

# A - Mizuki and Multiset

> 关键词：数学

## 思路

考虑两个问题：

1. 一个整数 $x$ 在什么情况下可以被拆分？
2. 如果可以拆分，最多能够拆成多少个元素？

考虑拆分的规则：要求 $x=y+z$，$\gcd(y,z)>1$，记 $\gcd(y, z) = d > 1$，那么 $y, z$ 都是 $d$ 的倍数，不妨记作 $y=da, z=db$

于是 $x=d(a+b)$，由于 $d>1$，且 $a+b \ge 2$，因此 $x$ 一定是合数。

因此有第一个结论：$1$ 和质数无法拆分，合数一定可以拆分。

我们希望尽可能多地拆出元素，注意到 $y,z \ge 2$，所以最优的情况是尽可能地拆出 $2$。

对于偶合数，容易想到答案为 $\lfloor \frac {n}{2} \rfloor$。而对于奇合数，存在以下的结论：

**任意奇合数都能拆成：$3+\underbrace{2+2+\cdots+2}_{(n-3)/2\text{ 个}}$ 的形式**

综上，答案即为  $\lfloor \frac {n}{2} \rfloor$。

## Code

```c++
// Problem: Mizuki and Multiset
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136382/A
// Time: 2026-06-01 12:15:40
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

bool is_prime(int x)
{
    if (x == 1)
        return false;

    for (int i = 2; i <= x / i; i++)
        if (x % i == 0)
            return false;
    return true;
}

void solve()
{
    int n;
    cin >> n;

    if (is_prime(n) || n == 1)
        cout << 1 << endl;
    else
        cout << n / 2 << endl;
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

# B - Mizuki and Mex

> 关键词：MEX，数学

## 思路

首先考虑对单个元素集合操作，有两种情况，当 $x=0$ 时变成 $1$，否则变成 $0$。

因此任意一个初始元素都可以被加工成 $0$ 或 $1$。

而为了通过一次操作得到 $k$，集合中必须包含 $0,1,2,\cdots,k-1$，因为只有这样，$mex$ 才可以变大。

设初始元素总数为：$m=n+1$，为了制造 $k$，首先需要一个 $k-1$。

定义：$\text{need}$ 表示当前需要多少个值为 $x$ 的零件。最开始处理 $x=k-1$ 时：$\text{need}=1$。

假设目前正在处理值 $x$，并且有 $\text{cnt}[x]$ 个现成的 $x$ 号零件。能够直接使用的数量为：$\text{take}=\min(\text{cnt}[x],\text{need})$。剩余无法直接满足的需求数量为：$\text{missing}=\text{need}-\text{take}$。每缺少一个 $x$，就必须现场制造一个 $x$。而制造一个 $x$ 需要：$0,1,2,\ldots,x-1$。因此，当我们继续处理 $x-1$ 时，需求量会额外增加 $\text{missing}$：$\text{need}\leftarrow\text{need}+\text{missing}$。

也可以写成：$\text{need}\leftarrow 2\cdot\text{need}-\text{take}$。

只需要处理到 $2$ 即可，当所有 $x \ge 2$ 的需求都处理完毕后，剩下的只有 $need$ 个 $0$ 和 $need$ 个 $1$，总消耗为 $used+2 \times need$，如果总消耗满足 $\le m$，那么可以构造出 $k$。

由于可行性具有单调性，考虑二分答案。

## Code

```c++
// Problem: Mizuki and Mex
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136382/B
// Time: 2026-06-01 13:02:45
// 想不到。开AI补了。
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

    vector<ll> cnt(n + 1);

    ll tot = 0;
    int mx = 0;

    for (int i = 0; i <= n; i++)
    {
        cin >> cnt[i];
        tot += cnt[i];
        if (cnt[i] > 0)
            mx = i;
    }

    auto check = [&](int t) -> bool
    {
        if (t <= 1)
            return true;

        ll need = 1, used = 0;

        for (int x = t - 1; x >= 2; x--)
        {
            ll take = 0;

            if (x <= n)
                take = min((ll) cnt[x], need);

            used += take;
            need = 2 * need - take;

            if (used + 2 * need > tot)
                return false;
        }
        return used + 2 * need <= tot;
    };

    int len = __lg(tot);

    int l = 1, r = n + len + 2;

    while (l + 1 < r)
    {
        int mid = (l + r) >> 1;

        if (check(mid))
            l = mid;
        else
            r = mid;
    }

    cout << max(mx, l) << endl;
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

# D - Mizuki and (Mod M)

> 关键词：字符串变换，线性DP

## 思路

首先发现不能模拟字符串替换，因为字符串长度会指数级增加，很快就会超时间和空间。

关键点在于：**每一次操作中，每个数字 $0-9$ 产生的替换是相互独立的。我们只需要弄清楚单个数字经过 $K$ 次操作后，会对最终的数值产生多少贡献，以及它会给数量级带来多大的变化**。

1. 我们考虑DP，由于我们最终只需要求值对 $M$ 取模的结果，对于每个状态我们需要用两个二维数组表示：
    1. **`val[k][c]`**：数字 $c$ 经过 $k$ 次操作后，生成的字符串对应的**十进制数值**，对 $M$ 取模的结果。
    2. **`mul[k][c]`**：数字 $c$ 经过 $k$ 次操作后，生成的字符串对应的**长度带来的数量级乘数**（即 $10^{\text{长度}}$），对 $M$ 取模的结果。这个乘数用于将其左侧的数字提升到正确的数量级。

初始化：$k=0$ 时，没有进行任何操作时，数字 $c$ 就是它本身，长度为 1。`val[0][c] = c % M`，`mul[0][c] = 10 % M`。

状态转移（从 $k-1$ 转移到 $k$ ）：

当我们要计算数字 $c$ 经过 $k$ 次操作的属性时，根据题意，它在第 1 次操作后会变成字符串 $P_c$。**假设 $P_c$ 是一个长度为 $L$ 的字符串 $d_1 d_2 \dots d_L$。那么 $c$ 经过 $k$ 次操作的结果，等价于把 $P_c$ 中的每一个字符 $d_i$ 都进行 $k-1$ 次操作拼接而成**。

考虑如何计算拼接后的数值，可以从右往左遍历 $P_c$ 的字符，维护一个当前累计的数值 `cur_val = 0`，以及当前的位移乘数 `cur_mul = 1`。

```c++
for (int i = (int)P[c].length() - 1; i >= 0; --i)
{
    int d = P[c][i] - '0';
                
    cur_val = (cur_val + val[k - 1][d] * cur_mul) % M; // 值
    cur_mul = (cur_mul * mul[k - 1][d]) % M; // 指数
}
```

计算答案：从右往左遍历 $S$ 的每一个字符 $s_i$，维护 `ans_val = 0` 和 `ans_mul = 1`。同样利用最终状态 `val[K][d]` 和 `mul[K][d]` 进行累加。

## Code

```c++
// Problem: Mizuki and (Mod M)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136382/D
// Time: 2026-06-02 20:48:39
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
    string s;
    cin >> s;

    ll K, m;
    cin >> K >> m;

    vector<string> p(10);
    for (int i = 0; i < 10; ++i)
        cin >> p[i];

    vector<vector<ll>> val(K + 1, vector<ll>(10, 0));
    vector<vector<ll>> mul(K + 1, vector<ll>(10, 1));

    for (int c = 0; c < 10; ++c) // k = 0
    {
        val[0][c] = c % m;
        mul[0][c] = 10 % m;
    }

    for (int k = 1; k <= K; ++k)
    {
        for (int c = 0; c < 10; ++c)
        {
            ll cur = 0, curm = 1;
            for (int i = p[c].size() - 1; i >= 0; --i)
            {
                int d = p[c][i] - '0';
                cur = (cur + val[k - 1][d] * curm) % m;
                curm = (curm * mul[k - 1][d]) % m;
            }

            val[k][c] = cur, mul[k][c] = curm;
        }
    }

    ll res = 0, resm = 1;
    for (int i = s.size() - 1; i >= 0; --i)
    {
        int d = s[i] - '0';
        res = (res + val[K][d] * resm) % m;
        resm = (resm * mul[K][d]) % m;
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



