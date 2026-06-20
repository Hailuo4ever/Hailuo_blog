---
title: cf round 1103
published: 2026-06-13
description: "Codeforces Round 1103 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1103.(Div. 3)](https://codeforces.com/contest/2236)

# A - Games on the Train

> 关键词：签到

## 思路

由于 $x_i \ge 1$，因此无论如何都要给原来的数 $+1$，因此答案为最大值减去最小值再加一。

## Code

```c++
// Problem: CF 2236 A
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/A
// Time: 2026-06-12 22:35:17
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
    for (auto &x: a)
        cin >> x;

    sort(all(a));
    cout << a[n - 1] - a[0] + 1 << endl;
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

# B - Tatar TV Show

> 关键词：模拟

## 思路

每次操作选择一个位置 $i$，同时翻转：$i, i + k$。

例如，当 $k=3$ 时：

- 位置 $1$ 可以与位置 $4$ 操作；
- 位置 $4$ 可以与位置 $7$ 操作；
- 位置 $2$ 可以与位置 $5$ 操作；
- 位置 $3$ 可以与位置 $6$ 操作。

因此，整个字符串实际上被拆分成了若干条互不相干的链：$1 \rightarrow 1+k \rightarrow 1+2k \rightarrow \cdots$

可以把它们想象成 $k$ 条互不连通的铁轨。一次操作只能在同一条铁轨上翻转两个相邻位置，无法跨越轨道传递影响。

对于从 $0$ 开始的下标，位置 $i$ 所属的链由 $i \bmod k$ 决定。**对于每条链，考察数字 $1$ 出现的奇偶性** 。

## Code

```c++
// Problem: CF 2236 B
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/B
// Time: 2026-06-12 22:35:18
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
    int n, k;
    cin >> n >> k;

    string s;
    cin >> s;

    vector<int> cnt(k, 0);

    for (int i = 0; i < n; i++)
    {
        if (s[i] == '1')
            cnt[i % k]++;
    }

    for (auto x: cnt)
    {
        if (x % 2 == 1)
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

# C - Omsk Programmers

> 关键词：数学

## 思路

首先不考虑使用除法，答案即为 $\lvert a - b \rvert$。假设当前 $a > b$，我们都有两种决策，一种是不使用除法，直接将 $b$ 增加到 $a$，一种是对较大的数 $a$ 继续使用除法，但这可能会显著缩小两个数的差距，也有可能增大。因此需要对每种 $a>b$ 的状态算答案并取最小。

任何方案都可以整理成如下标准形式：**先执行若干次除法，最后再执行若干次加法。**

## Code

```c++
// Problem: CF 2236 C
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/C
// Time: 2026-06-12 22:35:19
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
    ll a, b, x;
    cin >> a >> b >> x;

    ll cnt = 0, res = abs(a - b);

    while (a != b)
    {
        if (a < b)
            swap(a, b);

        a /= x, cnt++;
        res = min(res, cnt + abs(a - b));
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

# D - Brand New Tatar TV Show

> 关键词：博弈论，找性质

## 思路

根据题意，`Arseniy` 代替 `Dabir` 完成第一次删除。此后轮到 `Egor`。后续选择的数值必须满足 $0\le y-x\le k$，因此选择序列只能保持不变或逐渐增大，不能回头。

假设当前刚刚删除的元素为 $x$，我们总结一下游戏的规则：

1. 可以继续删除相同的数，因为 $y - x = 0$
2. 可以向更大的数跳跃，但跳跃距离不超过 $k$
3. 不能选择更小的数

我们首先考虑一种简单情况：假如所有的不同数值之间都无法跳跃怎么办？

例如 $k = 1$，数组为 `1 1 1 3 3 3 5 5 5`，一旦 `Arseniy` 第一次选择某个数值，后续玩家只能不断删除相同数值。其他数值全部无法到达。显然如果存在某个数值出现的次数为偶数时，`Arseniy` 就直接去拿这个数，`Egor` 总可以通过拿走最后一个而获胜。而如果所有数值出现的次数都是奇数，`Egor` 就没办法赢了。

由此有第一个结论，**如果不同数值之间无法跳跃，那么存在偶数次出现的数值时答案为 `YES`；所有数值均出现奇数次时答案为 `NO`。**

接下来我们**考虑可以跳跃的情况** 。假设排序并去重后的数组为：$b_1<b_2<\cdots<b_m$，如果存在相邻的两个不同数值满足：$b_i-b_{i-1}\le k$，那么玩家就可以从 $b_{i-1}$ 跳到 $b_i$。

考虑选择最大的下标 $i$，使得：$b_i-b_{i-1}\le k$。记：$u=b_{i-1},v=b_i$。

因为这一对已经是最靠右的可跳跃关系，所以从 $v$ 出发，不可能继续跳到任何更大的不同数值。

对于所有 $j>i$，都有：$b_j-b_{j-1}>k$，因此，一旦游戏来到 $v$，后续只能继续删除相同的 $v$。

对 $v$ 的奇偶性进行分类讨论，如果 $v$ 出现偶数次，`Arseniy` 直接删掉第一个 $v$，就能确保 `Egor` 取得最后一个元素；如果 $v$ 出现奇数次，`Arseniy` 可以删除 $v$ 的前一个数字 $u$​。由于 $v-u\le k$，`Egor` 可以跳到 $v$，删除一个 $v$。此时 `Dabir` 是必输的。

综上，唯一输出 `NO` 的情况是：

1. 任意两个相邻的不同数值之间，差值都大于 $k$；

2. 每一种数值的出现次数都是奇数。

## Code

```c++
// Problem: CF 2236 D
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/D
// Time: 2026-06-12 22:35:20
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
    int n, k;
    cin >> n >> k;

    map<int, int> mp;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        mp[a[i]]++;
    }

    sort(all(a));
    a.erase(unique(all(a)), a.end());

    bool flag1 = true;
    for (int i = 1; i < a.size(); i++)
    {
        if (a[i] - a[i - 1] <= k)
        {
            flag1 = false;
            break;
        }
    }

    bool flag2 = true;
    for (auto &[_, cnt]: mp)
        if (cnt % 2 == 0)
        {
            flag2 = false;
            break;
        }

    if (flag1 && flag2)
        cout << "NO" << endl;
    else
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

# E - Friendly Gifts

> 关键词：枚举，分类讨论

## 思路

题目要求从原数组中选取两个不重叠的连续子段，且他们长度相同，各自均为好数组，拼接后仍然是好数组。

首先考虑数组是好数组的条件：**对于一个子段，它是好数组的充要条件为：$mx-mn+1=len$，并且子段内没有重复元素。**

考虑两个好数组拼起来怎样还是一个好数组。假设两个子段的长度均为 $len$，第一个子段的值域是 $[L_1,R_1]$，第二个子段的值域是 $[L_2,R_2]$，两个值域一定是首尾相接的。也就是 $R_1+1=L_2$ 或 $R_2+1=L_1$。

我们可以考虑枚举分界线，枚举右侧子段的起点 $i$，左侧子段必须完全在 $i$ 左边，右侧子段从 $i$ 开始枚举。

```c++
左侧子段          右侧子段
[------]   ...   [i------]
```

我们维护一个二维表 `have[L][R]` 表示在分界线 $i$ 左边，是否已经出现过一个值域为 $[L,R]$ 的好子段。

考虑如何给右侧子段找匹配。假设当前右侧子串是好的，长度为 $len$，值域为 $[mn,mx]$，那么左侧子段有两种可能。

1. 左侧值域整体更小，即左侧值域为 $[mn-len,mn-1]$。例如当右侧是 $[3,4]$ 时，左侧是 $[1,2]$。
2. 左侧值域整体更大，即左侧值域为 $[mx+1,mx+len]$。例如当右侧是 $[1,2]$ 时，左侧是 $[3,4]$。


## Code

查询部分代码如下：

```c++
if (mn - len >= 1 && have[mn - len][mn - 1])
    ans = max(ans, len);

if (mx + len <= n && have[mx + 1][mx + len])
    ans = max(ans, len);
```

对于每个分界线，都做如下处理：

1. 把新的左侧好子段加入 `have`
2. 枚举从 $i$ 开始的右侧好子段
3. 遇到重复元素 `break`，因为一旦发生重复，更长的子段不可能是好的

```c++
// Problem: CF 2236 E
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/E
// Time: 2026-06-20 11:41:39
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
    cin >> n;

    vector<int> a(n);
    for (auto &x: a)
        cin >> x;

    vector<vector<char>> have(n + 2, vector<char>(n + 2, 0));

    vector<int> vis(n + 1, 0);
    int t = 0, res = 0;

    for (int i = 0; i < n; i++)
    {
        if (i > 0)
        {
            t++;

            int mn = inf;
            int mx = -inf;

            for (int l = i - 1; l >= 0; l--)
            {
                int v = a[l];

                if (vis[v] == t)
                    break;

                vis[v] = t;

                mn = min(mn, v);
                mx = max(mx, v);

                int len = i - l;

                if (mx - mn + 1 == len)
                    have[mn][mx] = 1;
            }
        }

        // 枚举所有左端点为 i 的右侧子段。
        t++;

        int mn = inf;
        int mx = -inf;

        for (int r = i; r < n; r++)
        {
            int v = a[r];

            if (vis[v] == t)
                break;

            vis[v] = t;

            mn = min(mn, v);
            mx = max(mx, v);

            int len = r - i + 1;

            // 当前右侧子段不是好的
            if (mx - mn + 1 != len)
                continue;

            // 左侧值域整体更小
            if (mn - len >= 1 && have[mn - len][mn - 1])
                res = max(res, len);

            // 左侧值域整体更大
            if (mx + len <= n && have[mx + 1][mx + len])
                res = max(res, len);
        }
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

# F1 - Elections in Saransk (Easy Version)

> 关键词：数论计数，质因子

## 思路

简单版本中的 $x=1$，因此题目条件为 $\operatorname{lcm}(p_1,p_2,\dots,p_n)=p_1p_2\cdots p_n$，每个 $p_i$ 还必须满足 $p_i\mid a_i$，我们需要数有多少种数组 $p$。

首先可以发现，如果 $lcm(u,v)=uv$，一定有 $\gcd (u,v)=1$，也就是两个数互质。因此 $p$ 数组中的每个数**两两互质。**

从质因数的角度看，设某个质数 $q$ 在每个 $p_i$ 中的指数为 $e_1,e_2, \cdots ,e_n$，那么在乘积中，质因子 $q$ 的指数是 $e_1+e_2+\cdots +e_n$，在最小公倍数中，质因子 $q$ 的指数是 $\max (e_1,e_2,\cdots ,e_n)$。

题目要求 $e_1+e_2+\cdots+e_n=\max(e_1,e_2,\dots,e_n)$，因为所有 $e_i \ge 0$，这个等式成立当且仅当**最多只有一个 $e_i$ 是正数。**

**也就是说，每个质因子最多只能出现在一个 $p_i$ 里面。**

对于每一个质数 $q$，我们考虑如何使用它，假设它出现了 $c_i$ 次，也就是 $a_i = q^{c_i}\cdot other$，$q$ 的指数可以选取 $1 \to c_i$ 的任何数，也可以不选。因此这个质数的方案数是 $1+\sum_{i=1}^{n} v_q(a_i)$，其中 $v_q(a_i)$ 表示质数 $q$ 在 $a_i$ 中的指数。

而不同质数之间的分配方案是互相独立的，根据乘法原理可以直接相乘。

最终答案为：
$$
\prod_{q}\left(1+\sum_{i=1}^{n}v_q(a_i)\right)
$$

## Code

```c++
// Problem: CF 2236 F1
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/F1
// Time: 2026-06-20 12:17:32
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
const ll mod = 1e9 + 7;
const int N = 5e5 + 10;

int primes[N], cnt;
bool st[N];

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
            primes[cnt++] = i;

        for (int j = 0; j < cnt && primes[j] <= n / i; j++)
        {
            st[primes[j] * i] = true;

            if (i % primes[j] == 0)
                break;
        }
    }
}

void solve()
{
    int n, x;
    cin >> n >> x;

    map<int, int> mp;
    auto divide = [&](int y) -> void
    {
        for (int i = 0; i < cnt && 1LL * primes[i] * primes[i] <= y; i++)
        {
            int p = primes[i];

            while (y % p == 0)
            {
                mp[p]++;
                y /= p;
            }
        }

        if (y > 1)
            mp[y]++;
    };

    vector<int> a(n);
    for (int i = 0, y; i < n; i++)
    {
        cin >> y;
        divide(y);
    }

    ll res = 1;

    for (auto &[p, c]: mp)
        res = res * (c + 1) % mod;

    cout << res << endl;
}

int main()
{
    fastio();

    get_primes(N - 1);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

