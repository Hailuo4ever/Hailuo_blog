---
title: 2026 icpc 武汉邀请赛
published: 2026-07-05
description: "The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 邀请赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题 - QOJ.ac](https://qoj.ac/contest/3757)
>
> [The 4th Universal Cup. Extra Stage 7: Hubei - Dashboard - Contest - QOJ.ac](https://qoj.ac/contest/3799)

# B - Sequence Operations

> 关键词：分类讨论

## 思路

题目有三种输入操作：$c_i=1$ 强制 $mex$，$c_i=2$ 强制 $gcd$，$c_i=0$ 可以二选一。目标是在所有操作后让序列所有数相等。

考虑 $mex(a,x)$ 的效果，题目保证 $x>0$，对于一个数 $a$，只要它是正数，显然就会变成 $0$。而对于 $a=0$ 的情况，就需要根据 $x$ 来确认操作的结果，总结如下：$\begin{cases}
正数 \rightarrow 0\\
0 \rightarrow 2, & x=1\\
0 \rightarrow 1, & x>1
\end{cases}$

考虑 $gcd(a,x)$ 的效果，特别定义了 $gcd(0,x)=x$，又因为 $x>0$，**所以 $gcd$ 会让所有元素都变成正数。**

容易观察到一个必胜的操作：$gcd \to mex$，一定可以让序列变成 $0,0,0,\dots,0$。

**因此，只要操作序列中存在一种选择方式，使得某次 $gcd$ 在某次 $mex$ 之前出现，就一定 `Yes`。**

同时有一个推论，自由操作的数量只要 $\ge 2$，就可以直接判 `Yes`。

那么，现在只剩下自由操作唯一的情况。枚举这次自由操作选择 $gcd$ 还是 $mex$，并继续分类讨论。

现在每个操作都确定是 $mex$ 或 $gcd$，接下来分成三种情况：

1. 全部是 $gcd$：如果所有操作都是 $gcd$，那么所有操作可以合并。因为 $gcd(gcd(a,x_1),x_2)$ 和 $gcd(a,gcd(x_1,x_2))$ 等价。设 $G=gcd(x_1,x_2,\dots,x_m)$，最终每个数会变成 $a_j \rightarrow gcd(a_j,G)$，最后检查是否相等即可。
2. 存在 $gcd$ 在某个 $mex$ 前面：判 `Yes`。
3. 不存在 $gcd$ 在某个 $mex$ 前面：操作序列形如 $mex,mex,\dots,mex,gcd,gcd,\dots,gcd$。此时模拟前面的 $mex$，把后面的 $gcd$ 合并，再最后检查是否相等。

## Code

```c++
// Problem: B
// Contest: QOJ - The 4th Universal Cup. Extra Stage 7: Hubei
// URL: https://qoj.ac/contest/3799/problem/18429
// Time: 2026-07-06 19:11:22
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
    int n, m;
    cin >> n >> m;

    vector<int> a(n);
    for (auto &x: a)
        cin >> x;

    vector<array<int, 2>> f(m);
    for (int i = 0; i < m; i++)
        cin >> f[i][0] >> f[i][1];

    if (count(all(a), a[0]) == n)
    {
        cout << "Yes" << endl;
        return;
    }

    int cnt0 = 0;
    for (auto [c, x]: f)
        cnt0 += (c == 0);

    if (cnt0 > 1)
    {
        cout << "Yes" << endl;
        return;
    }

    int pos = -1;
    for (int i = 0; i < m; i++)
    {
        if (f[i][0] == 0)
        {
            pos = i;
            break;
        }
    }

    for (auto opt: {1, 2})
    {
        vector<array<int, 2>> op = f;

        if (pos != -1)
            op[pos][0] = opt;

        auto mex = [&](int a, int b) -> int
        {
            if (a > b)
                swap(a, b);

            if (a > 0)
                return 0;
            else if (b == 1)
                return 2;
            else
                return 1;
        };

        bool only_gcd = true;
        for (auto [c, x]: op)
        {
            if (c != 2)
                only_gcd = false;
        }

        if (only_gcd)
        {
            int g = 0;
            for (auto [c, x]: op)
                g = gcd(g, x);

            int val = gcd(g, a[0]);
            bool same = true;

            for (int i = 1; i < n; i++)
            {
                if (gcd(g, a[i]) != val)
                {
                    same = false;
                    break;
                }
            }

            if (same)
            {
                cout << "Yes" << endl;
                return;
            }

            continue;
        }

        array<int, 3> cnt{};
        for (auto x: a)
            cnt[min(2, x)]++;

        bool has_gcd = false;
        int g = 0;

        for (auto [c, x]: op)
        {
            if (c == 2)
            {
                has_gcd = true;
                g = gcd(g, x);
            }
            else
            {
                if (has_gcd)
                {
                    cout << "Yes" << endl;
                    return;
                }

                array<int, 3> ncnt{};
                for (int i = 0; i < 3; i++)
                    ncnt[mex(i, x)] += cnt[i];

                cnt = ncnt;
            }
        }

        // mex...gcd
        vector<int> st;
        for (int i = 0; i < 3; i++)
        {
            if (cnt[i])
                st.eb(gcd(g, i));
        }

        bool same = true;
        for (auto x: st)
        {
            if (x != st[0])
            {
                same = false;
                break;
            }
        }

        if (same)
        {
            cout << "Yes" << endl;
            return;
        }
    }

    cout << "No" << endl;
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



# C - Believe in You

> 关键词：模拟

## 思路

只需要维护整个过程玩家造成的伤害即可，首先考虑能否使用尽可能多的攻击牌斩杀，如果不能的话考虑先用尽可能少的防御牌保命，再将剩余的出牌次数全部用来攻击即可。由于防御只影响本回合是否存活，因此在保证存活的前提下，使用尽可能多的攻击牌一定不会差。

## Code

```c++
// Problem: C
// Contest: QOJ - The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题
// URL: https://qoj.ac/contest/3757/problem/22150/statement/zh_cn
// Time: 2026-05-21 15:30:48
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
    int n, s, d, hp;
    cin >> n >> s >> d >> hp;

    int damage = 0;
    for (int i = 1; i <= n; i++)
    {
        int a, k;
        cin >> a >> k;

        int damagemx = min(a, 3) * s;
        if (damage + damagemx >= hp)
        {
            cout << "Yes" << endl << i << endl;
            return;
        }

        int def = (k + d - 1) / d;
        if (def > 5 - a || def > 3)
        {
            cout << "No" << endl;
            return;
        }

        int cnt = min(a, 3 - def);
        damage += cnt * s;
    }
    cout << "No" << endl;
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

# D - Prime Game

> 关键词：性质，博弈论，预处理

## 思路

### 题目简述

当前有一个整数 $n$。每一回合包含两步：

1. 先手彩叶选择一个整数 $x$，满足 $0 \le x < n$，把 $n$ 变成：$n+x$，即区间 $[n, 2n)$ 中的任意整数
2. 后手辉夜选择当前数的一个质因子 $p$，把当前数变成 $\frac{n}{p}$

当某一回合结束后 $n=1$，游戏停止。

### 结论 1：辉夜一定除以最大质因子

设 $ans_n$ 表示从数字 $n$ 开始，双方最优时还能进行多少回合。

题解给了一个引理：$ans_n \le ans_{n+1}$，也就是说，当前数字越大，先手可以拖的回合不会变少。

那么假设彩叶把数字变成了 $m$，辉夜可以选择一个质因子 $p$，使下一轮变成：$\frac{m}{p}$。

因为 $ans$ 随数字增大而不减，所以辉夜为了让后续回合数尽彩叶只需要考虑质因子只有 $2$ 和 $3$ 的数量少，就应该让 $\frac{m}{p}$ 尽量小，因此 $p$ 应该尽量大。

### 结论 2：彩叶只需要考虑质因子只有 $2$ 和 $3$ 的数

彩叶当前面对数字 $n$，她可以选择任意：$m \in [n, 2n)$，然后辉夜会除以 $m$ 的最大质因子。

设 $m$ 的最大质因子是 $p$，那么这一回合结束后会变成 $\frac{m}{p}$。由于 $m<2n$，所以有 $\frac{m}{p} < \frac{2n}{p}$。

彩叶有一个保底策略，即选择区间 $[n,2n)$ 里的某个 $2$​ 的幂。因为任意 $n$ 到 $2n$ 之间一定存在一个 $2$ 的幂。

如果彩叶选择一个 $2$ 的幂，辉夜只能除以 $2$，那么回合结束后的数至少大约是 $\frac n2$，所以彩叶至少可以保证下一轮数字不小于 $\frac n2$。

**如果某种选择会导致回合结束后的数字小于 $\frac n2$，那它一定不是最优的。如果这个上界都比 $\frac n2$ 小，那么这种选择肯定不如保底策略。**

因此，想让它有可能最优，必须满足 $\frac{2n}{p} \ge \frac n2$，解得 $p \le 4$，所以 $p$ 只可能为 $2$ 或 $3$。

> 如果辉夜除以的质因子 $p$ 太大，比如 $p \ge 5$，那么即使彩叶把当前数尽量变大到接近 $2n$，除完以后也会小于 $\frac n2$，还不如直接选择一个 $2$ 的幂来保底。

**因此，最优策略中只需要考虑最大质因子为 $2$ 或 $3$ 的数，也就是形如：$2^a3^b$ 的数**

### 模拟游戏

对于当前的 $n$，我们枚举所有满足 $n \le m < 2n$ 且 $m=2^a3^b$ 的数。

对于每个这样的 $m$：

- 如果 $m$ 含有因子 $3$，那么最大质因子是 $3$，下一轮变成 $\frac{m}{3}$

- 否则 $m$ 是纯 $2$ 的幂，最大质因子是 $2$，下一轮变成 $\frac{m}{2}$

彩叶希望下一轮数字尽量大，所以取这些结果中的最大值。然后继续模拟，直到 $n=1$。

## Code

```c++
// Problem: D
// Contest: QOJ - The 4th Universal Cup. Extra Stage 7: Hubei
// URL: https://qoj.ac/contest/3799/problem/18431
// Time: 2026-07-05 19:43:18
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
const ll INF = (ll) 2e18;
const int N = 0;

void solve()
{
    ll n;
    cin >> n;

    vector<ll> nums;

    for (ll a = 1; a <= INF;) // 预处理形如 2^a*3^b 的数
    {
        for (ll b = a; b <= INF;)
        {
            nums.eb(b);

            if (b > INF / 3)
                break;
            b *= 3;
        }

        if (a > INF / 2)
            break;
        a *= 2;
    }

    sort(all(nums));
    nums.erase(unique(all(nums)), nums.end());

    ll res = 0;

    // 当前的 n 可以变成 [n, 2n) 中的任何一个数
    // 而只枚举其中形如 2^a*3^b 的 m
    while (n > 1)
    {
        ll best = 0;
        auto it = lower_bound(all(nums), n); // 找所有合法数的左端点

        while (it != nums.end() && *it < 2 * n) // 枚举所有合法数
        {
            ll m = *it, nxt = 0;
            if (m % 3 == 0)
                nxt = m / 3;
            else
                nxt = m / 2;

            best = max(best, nxt); // 选择最优的nxt状态
            ++it;
        }

        n = best, res++; // 更新当前数字和答案
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

# H - Rectangle Cutting

> 关键词：思维，STL

## 思路

初始有一个 `n × m` 的矩形。每次沿着某条完整的竖线 `x = k` 或横线 `y = k` 切一刀，要求每次切完后输出当前所有小矩形中的最大面积。题面给出 `n, m ≤ 1e9`，`q ≤ 5e5`，所以不能模拟所有的小矩形。

所有的竖切只会影响宽度段，所有的横切只会影响高度段，因此最大面积一定是**最大宽度段乘以最大高度段**。

所以问题变成，动态插入切割位置，并维护当前相邻切割线之间的最大间距。

使用 `set<long long> pos` 维护所有切割位置**（包括边界）**，使用 `multiset<long long> len` 维护所有相邻切割线之间的长度，初始时 `xLen = {n}, yLen = {m}`，因为可能有多个长度相同的区间，所以要使用 `multiset`。

当插入一刀时，我们先找到它所在的原区间，原来有一个长度，切完后变成两个长度，擦除原先的并更新。

> [!NOTE]
>
> 访问 `set` 的最后一个元素的反向迭代器是 `s.rbegin()`。

## Code

```c++
// Problem: H
// Contest: QOJ - The 2026 ICPC China Wuhan National Invitational and Hubei Provincial Programming Contest 补题
// URL: https://qoj.ac/contest/3757/problem/22155/statement/zh_cn
// Time: 2026-05-21 16:09:40
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

void split(set<ll> &pos, multiset<ll> &len, ll k)
{
    auto itR = pos.upper_bound(k);
    auto itL = prev(itR);

    ll L = *itL;
    ll R = *itR;

    len.erase(len.find(R - L));
    len.insert(k - L);
    len.insert(R - k);

    pos.insert(k);
}

void solve()
{
    ll n, m, q;
    cin >> n >> m >> q;

    set<ll> xs, ys;
    multiset<ll> xlen, ylen;

    xs.insert(0);
    xs.insert(n);
    ys.insert(0);
    ys.insert(m);

    xlen.insert(n);
    ylen.insert(m);

    while (q--)
    {
        int op;
        ll k;
        cin >> op >> k;

        if (op == 1)
            split(xs, xlen, k);
        else
            split(ys, ylen, k);

        ll maxw = *xlen.rbegin();
        ll maxh = *ylen.rbegin();

        cout << maxw * maxh << endl;
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

