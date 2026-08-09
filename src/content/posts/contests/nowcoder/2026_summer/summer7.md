---
title: 2026 牛客多校7
published: 2026-08-07
description: "Nowcoder Multi-University Training Contest 7"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营7](https://ac.nowcoder.com/acm/contest/133882)

# A - Infiltrate Angel's Domain

> 关键词：按位贪心

## 思路

题目中一次操作选择非负整数 $k$，支付 $k$ 的代价，然后任选若干元素与 $k$ 异或，目标是让数组最终单调不下降。

**关键的一步转化是，把操作按照二进制位拆开算**。

> 假设一次操作选择 $k=10=(1010)_2=2^3+2^1$，对某些元素异或 $10$，等价于花费 $8$，对这些元素异或 $8$；再花费 $2$，对这些元素异或 $2$。

对于一个二进制位，显然被翻转偶数次相当于没翻，被翻转奇数次相当于翻一次，所以两次及以上的操作次数，最终都可以看作只购买一次第 $b$ 位，然后选择所有总共被翻奇数次的元素。

可以用一个整数 $M$ 描述对序列的全部操作。定义 $M=\sum_{\text{购买的 bit }b}2^b$，显然总代价就是 $M$。因此问题转化成：找最小的整数 $M$，使得如果 $M$ 中为 $1$ 的数位可以对每个 $a_i$ 任意翻转，可以把数组变得单调不降。

**考虑固定 $M$ 后，$a_i$ 的变化**。假设 $a_i=(101101)_2$，$M=(001011)_2$。那么 $M$ 中 $0$ 的位置不能改变，$1$ 的位置可以任意决定最终是 $0$ 还是 $1$。我们让 $r_i=a_i\mathbin{\&}\sim M$ 表示 $a_i$ 中无法修改的数位。因此所有可达的值都可以写作 $r_i\mid s$，其中 $s$ 为 $M$ 中为 $1$ 的数位。会发现最小可达值是 $r_i$，也就是把所有可修改位都改成 $0$；最大可达值是 $r_i \mid M$，也就是把所有可修改位都设成 $1$。

**考虑固定 $M$ 后，如何判断数组能不能变成单调不降**。我们从左往右处理，假设前面已经确定好了最终值，前一个数是 $pre$，现在对于当前处理的 $a_i$，我们应该贪心地选择所有 $\le pre$ 的可达值中最小的那个。因为当前的 $a_i$ 越小，对后面的限制越少。如果过程中发现最大的可达值都比 $pre$ 小，说明无解。

**考虑如何找到不小于 $pre$ 的最大可达值**。同样按位考虑，我们从高位到低位贪心，每次尝试将当前位设为 $0$，所有低位先全设成 $1$，如果到不了 $pre$，说明当前位必须为 $1$，否则继续往下一位贪心。

**考虑如何求最小的 $M$**。同样从最高位开始贪心。和上面的策略相同，首先尝试令当前位为 $0$，并购买所有未决定的低位，若不可行，该位必须取 $1$，否则继续往下一位贪心。

## Code

```c++
// Problem: Infiltrate Angel's Domain
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133882/A
// Time: 2026-08-09 00:12:18
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

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    auto check = [&](int m) -> bool
    {
        int pre = 0;
        for (auto x: a)
        {
            int cur = x & ~m; // 修改不了的部分

            if ((cur | m) < pre) // max < pre
                return false;

            for (int b = 29; b >= 1; b--)
            {
                if ((m >> b & 1) == 0)
                    continue;

                int low = m & ((1 << b) - 1); // 第b位为0，下面都为1
                if ((cur | low) < pre)
                    cur |= 1 << b;
            }
            pre = cur;
        }
        return true;
    };

    int res = 0;
    for (int b = 29; b >= 0; b--)
    {
        int m = res | ((1 << b) - 1);
        if (!check(m))
            res |= (1 << b);
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



# G - Both of You, Dance Like You Want to Win!

> 关键词：猜结论，博弈论

## 思路

**结论：存在必胜策略，当且仅当不同数值不超过 $3$ 种**。

考虑只有 $1$ 种值的情况，不难发现一定成立。

考虑 $2$ 种值 $A,B$，每次对手给出不同的值，交替放置 $(A,B),(B,A)$ 即可。由于保证这些值对的数量一定是偶数，交替抵消即必胜。

考虑 $3$ 种值 $A,B,C$，每次对手给出不同值，我们都交替放置。三类剩余数量的奇偶性相同，假如都是奇数个，也可以通过成环的方式抵消，即：$(A-B)+(B-C)+(C-A)=0$。

如果至少有 $4$ 种值，取 $A<B<C<D$ 各两份，$MAGI$ 先给出 $(A,B),(C,D)$。操作员做出选择后，设左侧两个数为 $p,q$，右侧两个数为 $r,s$。由于四个数互不相同，总差值不可能为 $0$，因此只要有四种值及以上，就无法必胜。

## Code

```c++
// Problem: Both of You, Dance Like You Want to Win!
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133882/G
// Time: 2026-08-07 13:16:23
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

    vector<int> a(n + 1);
    map<int, int> mp;

    for (int i = 1; i <= n; i++)
        cin >> a[i], mp[a[i]]++;

    cout << (mp.size() > 3 ? "YES" : "NO") << endl;
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



# H - Modulo Triples

> 关键词：构造

## 思路

> 之前做不下去的思路如下。
>
> ![](https://img.hailuo4ever.com/nowcoder/summer_2026_7_img2.png)

我们需要把 $\{0,1,2,\ldots,3N-1\}$ 划分为 $N$ 个有序三元组 $(x_i,y_i,z_i)$，满足 $z_i>0$ 且 $x_i\bmod z_i=y_i$，且所有数恰好用一次。

首先应该考虑把取模变成加法，也就是将 $0\sim3N-1$ 分组，让绝大多数三元组满足 $x-z=y$。

这里的关键点是按 $y$ 的奇偶性配对。假设我们想构造一个偶数差 $y=2i$，一种方法是找一个中点 $C$，取 $z=C-i$，$x=C+i$。配对成 ${(C+i,\ 2i,\ C-i)}$；要想构造一个奇数差 $y=2i-1$，让两个错开一格，即 $z=C-i$，$x=C+i-1$，配对成 ${(C+i-1,\ 2i-1,\ C-i)}$。

所以可以用一个中心处理一批偶数，用另一个中心处理一批奇数。这两个中心为 ${
A=N+\left\lfloor\frac N2\right\rfloor
}$，${
B=2N+\left\lfloor\frac N2\right\rfloor
}$。

考虑分别处理奇偶的 $N$。

当 $N$ 为奇数时，设 $N=2m+1,\left\lfloor\frac N2\right\rfloor=m$，所以 $A=N+m=3m+1$，$B=2N+m=5m+2$。所以先输出 ${(3N-1,\ 0,\ A)}$，对于 $1\le i\le m$，输出两类：${(A+i,\ 2i,\ A-i)}$ 和 ${(B+i-1,\ 2i-1,\ B-i)}$。

当 $N$ 为偶数时，设 $N=2m$，那么 $A=N+m=3m$，$B=2N+m=5m$。先输出两个特殊三元组 ${(B,N,A)}$，${(A+1,0,1)}$。然后对于 $1\le i<m$，输出两类：${(B+i,\ 2i,\ B-i)}$ 和 ${(A+i+1,\ 2i+1,\ A-i)}$。

> [!NOTE]
>
> 由于我们要制造连续的差值，因此考虑左右对称地构造，让他们的差直接是所有偶数，即 $(C+i)-(C-i)=2i$。
>
> 再错位一下，直接就是全部奇数，即 $(C+i-1)-(C-i)=2i-1$。

## Code

```c++
// Problem: Modulo Triples
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133882/H
// Time: 2026-08-07 15:50:32
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

    int m = n / 2;

    int A = n + m, B = 2 * n + m;

    if (n & 1)
    {
        cout << 3 * n - 1 << ' ' << 0 << ' ' << A << endl;

        for (int i = 1; i <= m; i++)
        {
            cout << A + i << ' ' << 2 * i << ' ' << A - i << endl;
            cout << B + i - 1 << ' ' << 2 * i - 1 << ' ' << B - i << endl;
        }
    }
    else
    {
        cout << B << ' ' << n << ' ' << A << endl;
        cout << A + 1 << ' ' << 0 << ' ' << 1 << endl;

        for (int i = 1; i < m; i++)
        {
            cout << B + i << ' ' << 2 * i << ' ' << B - i << endl;
            cout << A + i + 1 << ' ' << 2 * i + 1 << ' ' << A - i << endl;
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



# K - D-Mail Institution Codes

> 关键词：模拟

## 思路

首先用 `stringstream` 读进来所有字符串，对于每一个学校，维护一个 `idx[i]` 表示前多少个单词已经被完整展开，初始时 `idx[i] = 0` 表示所有单词只取首字母。同时维护一个标记数组，表示当前学校的缩写是否被确定。

> [!NOTE]
>
> 因为我们要求一旦缩写唯一，就永久确定。假设某个学校已经唯一确定了缩写 `ABC`，后来另一个还在变化的学校正好也变成了 `ABC`，我们不能修改前面的，而是让后面的继续展开。

考虑每一轮怎么模拟，假设当前所有学校的缩写是 `abbre[i]`，首先统计当前缩写出现次数，然后检查每个还没有确定的学校。如果 `mp[abbre[i]] = 1`，说明已经唯一，否则 `idx[i]++`，表示下一轮展开一个单词。 

## Code

```c++
// Problem: D-Mail Institution Codes
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133882/K
// Time: 2026-08-07 12:00:45
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
    cin.ignore();

    // str[1] -> line1, str[1][0] -> 1st string of line1, str[1][0][0] -> 1st char of 1st string
    vector<vector<string>> str(n + 1);
    vector<string> abbre(n + 1);

    // mp1 -> abbre
    map<string, int> mp1;

    for (int i = 1; i <= n; i++)
    {
        string s, abbr;
        getline(cin, s);

        stringstream ss(s);

        string sss;
        while (getline(ss, sss, ' '))
            str[i].push_back(sss), abbr += sss[0];

        mp1[abbr]++, abbre[i] = abbr;
    }

    vector<int> idx(n + 1, 0);
    vector<bool> st(n + 1, false);

    auto calc = [&](int i) -> string
    {
        string res;

        for (int j = 0; j < str[i].size(); j++)
        {
            if (j < idx[i])
                res += str[i][j];
            else
                res += str[i][j][0];
        }

        return res;
    };

    int k = 0;
    while (k != n)
    {
        map<string, int> mp;

        for (int i = 1; i <= n; i++)
            mp[abbre[i]]++;

        vector<int> id;
        for (int i = 1; i <= n; i++)
        {
            if (st[i])
                continue;

            if (mp[abbre[i]] == 1)
                st[i] = true, k++;
            else
                id.eb(i);
        }

        for (auto x: id)
            idx[x]++, abbre[x] = calc(x);
    }

    for (int i = 1; i <= n; i++)
        cout << abbre[i] << endl;
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



# L - Bobo's Lucky Modulo

> 关键词：推公式

## 思路

![](https://img.hailuo4ever.com/nowcoder/summer_2026_7_img1.jpg)

注意在算完所有的整周期以后，还要取模去算那个尾巴的周期。对于每个周期，都是前 $b$ 个合法，后面的不合法。

## Code

```c++
// Problem: Bobo's Lucky Modulo
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133882/L
// Time: 2026-08-07 22:06:00
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
    ll n;
    cin >> n;

    ll res = 0;
    for (ll b = 1; b <= sqrtl(n); b++)
    {
        ll len = n - b * b + 1; // b^2 -> n

        ll t = len / (b * (b + 1));
        res += b * t;

        ll rem = len % (b * (b + 1));
        res += min(rem, b);
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

