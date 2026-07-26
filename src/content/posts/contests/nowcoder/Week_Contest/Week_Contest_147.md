---
title: 牛客周赛 Round 147
published: 2026-06-07
description: "Nowcoder Week Contest 147"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 147](https://ac.nowcoder.com/acm/contest/136224)

# A - 小红的字符串计数

> 关键词：签到

## Code

```c++
// Problem: 小红的字符串计数
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/A
// Time: 2026-06-07 19:00:02
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

    map<char, int> mp;
    for (auto c: s)
        mp[c]++;

    int res = 0;
    for (auto [_, cnt]: mp)
        if (cnt == 1)
            res++;
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

# B - 小红打舞萌

> 关键词：模拟

## 思路

因为和别人一起玩的收益更好，我们尽可能选择和别人一起，所以最优的方案是：和朋友玩，自己玩，和朋友玩，自己玩，...

小红有 $x$ 枚游戏币，不管怎么选都要花 $5$ 个，所以可以将 $t = \lfloor \frac x 5 \rfloor$ 看作选择次数。

因此和朋友玩的次数最多是 $\lceil {\frac t 2} \rceil$。答案即为 $3x + \frac {x+1} 2$。

## Code

```c++
// Problem: 小红打舞萌
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/B
// Time: 2026-06-07 19:01:00
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
    ll x;
    cin >> x;

    x /= 5;

    cout << 3 * x + (x + 1) / 2 << endl;
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

# C - 魔物76

> 关键词：数学，差分

## 思路

> [!NOTE]
>
> 注意题目的计算规则和 $abs$ 无关，赛时因为这个被卡了很久。

考虑使用类似差分的思想处理出 $b$ 数组，不难发现每次操作只会改变 $b$ 数组左右两侧的两个值，具体地，`b[l]++, b[r + 1]--`特别地，$l = 1$ 或 $r = n$ 时直接忽略操作。

## Code

```c++
// Problem: 魔物76
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/C
// Time: 2026-06-07 19:05:47
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
    int n, q;
    cin >> n >> q;

    vector<ll> a(n + 1), b(n + 2);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        b[i] = a[i] - a[i - 1];
    }

    // for (int i = 1; i <= n; i++)
    // cout << b[i] << endl;

    ll sum = 0;
    for (int i = 2; i <= n; i++)
        sum += ((b[i] % 5 + 5) % 5);

    auto merge = [&](int idx, ll k) -> void
    {
        if (idx < 2 || idx > n)
            return;

        sum -= ((b[idx] % 5 + 5) % 5);

        b[idx] += k;

        sum += ((b[idx] % 5 + 5) % 5);
    };

    while (q--)
    {
        int l, r;
        cin >> l >> r;

        merge(l, 1);
        merge(r + 1, -1);

        cout << sum << endl;
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

# D - 小红的子序列

> 关键词：DP

## 思路

### 暴力DP（50pts）

设 $dp[i]$ 表示以第 $i$ 个数为结尾的最长合法子序列长度。

显然它会从所有能整除，并且整除后结果为质数的位置转移而来，需要注意的是，如果可以转移，我们需要标记每个位置的前驱来输出路径，并记录结尾位置。

关于质数，可以使用一个线性筛预处理出数组最大值以内所有的质数，这样的判断是 $O(1)$ 的。

但这样的时间复杂度是 $O(n^2)$，无法通过本题。

### 值域+反向枚举DP（100pts）

对于当前位置 $i$，假设当前数为 $x=a_i$，如果某个前驱 $y$ 可以转移到 $x$，必须满足 $\frac x y = p$，其中 $p$ 是质数。

移项，得到 $y = \frac x p$，因此没有必要枚举前面所有位置 $j$，只需要枚举 $x$ 的所有不同质因数 $p$，合法前驱的数值一定是 $\frac x p$。

例如当前数为 $60$，质因数是 $2, 3, 5$，那么它只能接在 $30, 20, 12$ 后面，不需要检查其他数字。

我们还需要两个 $best$ 数组，定义：

```c++
best_len[x] = 已经扫描过的元素中，以数值 x 结尾的最长合法子序列长度
best_pos[x] = 对应子序列最后一个元素的下标
```

当扫描到 $a_i = x$ 时，枚举 $x$ 的不同质因数 $p$，寻找 $bestlen[x / p]$。

状态转移为：

$$dp_i=\max\left(1,\max_{p\mid a_i,\ p\text{ 为质数}}\left(best\_len\left[\dfrac{a_i}{p}\right]+1\right)\right)$$

计算完 $dp[i]$ 后，同步更新 $bestlen[a[i]]$，$bestpos[a[i]]$。

> [!TIP]
>
> 为什么只保存相同数值中的最优状态？
>
> 假设此前出现了多个值为 $6$ 的元素，后面出现一个 $18$，因为 $\frac {18} 6 = 3$，无论选择哪一个 $6$，都能够转移到 $18$，为了让最终序列最长，只需要保留此前所有值为 $6$ 的状态中，长度最大的那一个。

### 总结

暴力的转移是：枚举此前的所有位置 $j$，并检查 $j$ 能否转移到 $i$。

优化后的转移是：根据 $a[i]$ 的数学性质，直接枚举可能成为前驱的数值，查询这些数值对应的历史最优状态。

## Code

### 暴力DP

```c++
// Problem: 小红的子序列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/D
// Time: 2026-06-07 19:34:40
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
const int N = 1e6 + 10;

vector<int> primes;
int cnt;
bool st[N];

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
            primes.push_back(i), cnt++;

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
    int n;
    cin >> n;

    vector<int> a(n + 1, 1), b(n + 1, -1), path;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    get_primes(*max_element(all(a)));

    vector<int> dp(n + 1, 1);
    int res = 0, end = 0;
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j < i; j++)
        {
            if (a[i] % a[j] != 0)
                continue;

            int t = a[i] / a[j];
            if (!st[t])
            {
                if (dp[j] + 1 > dp[i])
                {
                    dp[i] = dp[j] + 1;
                    b[i] = j;
                }
            }
        }
        if (dp[i] > res)
        {
            res = dp[i];
            end = i;
        }
    }

    for (int i = end; i != -1; i = b[i])
        path.push_back(a[i]);

    reverse(all(path));

    cout << res << endl;
    for (auto x: path)
        cout << x << " ";
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

### 正解

> [!NOTE]
>
> 注意：线性筛过程中每次构造出一个合数，都必须立刻记录。

```c++
// Problem: 小红的子序列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/D
// Time: 2026-06-07 19:34:40
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
const int N = 1e6 + 10;

vector<int> primes;
int cnt, minp[N];
bool st[N];

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
        {
            primes.push_back(i);
            cnt++;
            minp[i] = i;
        }

        for (int j = 0; j < cnt && primes[j] <= n / i; j++)
        {
            st[primes[j] * i] = true;

            minp[primes[j] * i] = primes[j];

            if (i % primes[j] == 0)
                break;
        }
    }
}

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1), path;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    int mx = *max_element(all(a));
    get_primes(mx);

    vector<int> dp(n + 1, 1), pre(n + 1, -1);
    vector<int> blen(mx + 1, 0), bpos(mx + 1, -1);

    int res = 0, end = 0;

    for (int i = 1; i <= n; i++)
    {
        int x = a[i];

        while (x > 1)
        {
            int p = minp[x];

            int idx = a[i] / p;

            if (blen[idx] + 1 > dp[i])
            {
                dp[i] = blen[idx] + 1;
                pre[i] = bpos[idx];
            }

            while (x % p == 0)
                x /= p;
        }

        if (dp[i] > blen[a[i]])
        {
            blen[a[i]] = dp[i];
            bpos[a[i]] = i;
        }

        if (dp[i] > res)
        {
            res = dp[i];
            end = i;
        }
    }

    for (int i = end; i != -1; i = pre[i])
        path.push_back(a[i]);

    reverse(all(path));

    cout << res << endl;

    for (auto x: path)
        cout << x << " ";
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

# E - 小红的受欢迎子串

> 关键词：前后缀，预处理
>
> 之前做过的一道类似题目：[牛客小白月赛 133 - C](https://blog.hailuo4ever.com/posts/contests/nowcoder/rookie_month_contest-133/#c---魔法少女愿望卷轴与真名刻印)
>
> 和那道题不同的是，那题是修改字符，这题是插入字符。

## 思路

首先明确一个性质：能够重复利用的字符一定是连续的。

考虑 $greet$，假设我们希望使用原字符串中的一部分字符，剩下的通过插入来补齐。如果原字符串是 $get$，由于它是 $greet$ 的子序列，因此是可行的。但如果原字符串是 $g \cdots x \cdots t$，就不能利用它，将它补成 $greet$，因为字符 $x$ 无法被删除或修改。

因此**对于某个目标字符串，可以复用的原字符串部分必须是一个连续子串，并且该子串必须是目标字符串的子序列。**

并且两个字符串 $great$ 和 $invite$ 无法拼接，因此两个目标子串一定互不重叠，且只有两种排列方式。

如果完全不复用原字符串中的字符，直接插入两个完整字符串，需要 $11$ 次操作，因此我们要求最多可复用的字符数。

问题转化为：从原字符串中选择两个互不重叠的连续片段，使其中一个是 $greet$ 的子序列，另一个是 $invite$ 的子序列，最大化两个片段的长度之和。

我们对两个目标字符串都预处理出前后缀的最大值：

```c++
pre[i] = 仅使用 s[0 ... i - 1] 时，最多可以复用多少个字符
suf[i] = 仅使用 s[i ... n - 1] 时，最多可以复用多少个字符
```

由于两个字符串的长度都比较短，直接在每个位置上双指针扫一遍即可。

**枚举所有分界线，取两种拼接方式的最大值。**

## Code

```c++
// Problem: 小红的受欢迎子串
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/136224/E
// Time: 2026-06-07 19:50:19
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
    string s;

    cin >> n >> s;

    auto calc = [&](string p)
    {
        int m = p.size();

        // st[i]：从位置 i 开始的合法片段最大长度
        // ed[i]：在位置 i 结束的合法片段最大长度
        // pre[i]：在前 i 个字符中，合法片段最大长度
        // suf[i]：在第 i 个字符到末尾，合法片段最大长度

        vector<int> st(n + 2), ed(n + 2), pre(n + 2), suf(n + 3);

        // 枚举复用片段的左端点
        for (int l = 0; l < n; l++)
        {
            int pos = 0;

            // 复用片段的长度不会超过目标串长度
            for (int r = l; r < n && r < l + m; r++)
            {
                // 在目标串 p 中寻找与 s[r] 匹配的位置
                while (pos < m && p[pos] != s[r])
                    pos++;

                // 当前字符无法匹配，直接break
                if (pos == m)
                    break;

                pos++;

                int len = r - l + 1;

                // 注意换下标，字符串下标从0开始，数组从1开始
                st[l + 1] = max(st[l + 1], len);
                ed[r + 1] = max(ed[r + 1], len);
            }
        }

        // 前缀最优值
        for (int i = 1; i <= n; ++i)
            pre[i] = max(pre[i - 1], ed[i]);

        // 后缀最优值
        for (int i = n; i >= 1; i--)
            suf[i] = max(suf[i + 1], st[i]);

        return make_pair(pre, suf);
    };

    string a = "greet", b = "invite";

    auto [pa, sa] = calc(a);
    auto [pb, sb] = calc(b);

    int mx = 0;

    // 枚举分割点，将字符串划分为 s[1 ... i] | s[i + 1 ... n]
    for (int i = 0; i <= n; i++)
    {
        mx = max(mx, pa[i] + sb[i + 1]);
        mx = max(mx, pb[i] + sa[i + 1]);
    }

    cout << a.size() + b.size() - mx << endl;
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

