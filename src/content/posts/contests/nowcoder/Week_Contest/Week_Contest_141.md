---
title: 牛客周赛 Round 141
published: 2026-04-28
description: "Nowcoder Week Contest 141"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Nowcoder_Week_Contest_141](https://ac.nowcoder.com/acm/contest/133523)

# A - 回文 1

> 关键词：签到，读题

## 思路

一定要仔细读题，本题并不是检查$x$和$x^2$是不是回文数，而是$x$和$\sqrt{x}$

另：回文数直接转成字符串，用 `reverse()` 判断会简单很多。

## Code

```cpp
// Problem: 回文(version 1）
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/A
// Time: 2026-04-26 19:00:02
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

bool check(ll x)
{
    string s = to_string(x);

    string t = s;
    reverse(t.begin(), t.end());

    if (t == s)
        return true;
    else
        return false;
}

int main()
{
    ll x;
    cin >> x;

    bool flag1 = check(x);

    ll y = round(sqrt(x));
    bool flag2 = check(y);

    if (y * y == x)
    {
        if (flag1 && flag2)
            cout << "YES" << endl;
        else
            cout << "NO" << endl;
    }
    else
        cout << "NO" << endl;

    return 0;
}
```

# B - 未知 1

> 关键词：签到，位运算，构造

## 思路

我们需要构造一个整数$n$，使得$x \oplus n > y \oplus n$，注意到令$n=y$，$y \oplus n=0$，$x \oplus n >0$

所以直接输出$y$即可。

## Code

```cpp
// Problem: 未知(version 1)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/B
// Time: 2026-04-26 19:06:45
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
    ll x, y;
    cin >> x >> y;

    cout << y << endl;
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

# C - 回文 2

> 关键词：贪心

## 思路

我们可以把所有的 `m` 都看作是由两个 `n` 组成的。这样一来，给定字符串就变成了一个全是 `n` 的串。

这样一来，任何字符串都可以被映射成一个全由 `n` 组成的“基础字符串”。我们考虑在这个基础字符串的坐标系下，通过检查原有的 `m` 在对称映射时是否会发生“错位冲突”，来判断能否构成回文串。

## Code

```cpp
// Problem: 回文(version 2)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/C
// Time: 2026-04-26 19:15:18
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
    string s;
    cin >> s;

    set<int> pos;

    int idx = 0;
    for (auto c: s)
    {
        if (c == 'm')
        {
            pos.insert(idx);
            idx += 2;
        }
        else
            idx++;
    }

    int sz = idx;

    for (auto p: pos)
    {
        int pp = sz - p - 2;

        bool flag1 = false, flag2 = false;

        if (pp >= 0 && pos.count(pp - 1))
            flag1 = true;

        if (pp < sz && pos.count(pp + 1))
            flag2 = true;

        if (flag1 || flag2)
        {
            cout << "NO" << endl;
            return;
        }
    }
    cout << "YES" << endl;
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

# D - 未知 2

> 关键词：分类讨论、枚举、压缩解集

## 法 1 - 剪枝

对于涉及指数计算的问题，由于题目给定所有的数都是正整数，我们考虑 `1` 在所有数中的特殊性，分类讨论：

1. 假设数组中存在两个以上的 `1`，由于 `1` 的任何次方都是 `1`，所以直接输出 `Yes`
2. 假设数组中唯一存在一个 `1`，我们让这个 `1` 充当指数，检查是否有一个数的出现次数$\geq 2$，如果有就输出 `Yes`
3. 假设不满足以上两种情况，我们只需要关心不同数字之间的幂运算。考虑将数组排序并去重，并枚举所有指数和底数。进行剪枝：每次作乘积后判断是否大于数组的最后一个元素，如果大于就直接 `break` 掉。

> [!TIP]
> 注意这里不要讨论 `1` 的情况，如果底数或指数出现 `1` 需要 `continue`

### Code

```cpp
// Problem: 未知(version 2)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/D
// Time: 2026-04-26 19:37:22
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
    int n;
    cin >> n;

    vector<int> a(n);
    map<int, int> mp;

    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        mp[a[i]]++;
    }

    if (mp[1] >= 2)
    {
        cout << "YES" << endl;
        return;
    }

    if (mp[1] == 1)
    {
        for (auto &[val, cnt]: mp)
        {
            if (cnt >= 2)
            {
                cout << "YES" << endl;
                return;
            }
        }
    }

    sort(a.begin(), a.end());
    a.erase(unique(a.begin(), a.end()), a.end());

    for (int i = 0; i < a.size(); i++)
    {
        for (int j = 0; j < a.size(); j++)
        {
            ll x = (ll) a[i], y = (ll) a[j], res = 1;

            if (x == 1 || y == 1)
                continue;

            bool lim = false;

            for (int k = 0; k < y; k++)
            {
                if (res > a[a.size() - 1] / x)
                {
                    lim = true;
                    break;
                }
                res *= x;
            }

            // 如果已经超过最大值，后续更大的 y 就不必看了
            // 直接 break j 循环
            if (lim)
                break;

            if (mp.count(res))
            {
                cout << "YES" << endl;
                return;
            }
        }
    }
    cout << "NO" << endl;
    return;
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

## 法 2 - 压缩解集

对于 `1` 的两种讨论与法 1 中的相同，我们考虑如何更高效地处理所有数。

由于限定了最大范围为 `1e9`，而 $\sqrt{10^9} \approx 31622.77$。如果底数 $x > 31622$，那么即使它配上最小的有效指数 $2$，其结果 $x^2$ 也会大于 $10^9$，必然超出了数组可能存在的最大值。

因此，**所有大于 31622 的数，绝对不可能作为底数去生成别的数**（指数为 1 的情况已单独特判）。

可以使用 `unordered_map` 进行$O(1)$的查找。

### Code

```cpp
// Problem: 未知(version 2)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/D
// Time: 2026-04-26 19:37:22
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
    int n;
    cin >> n;

    vector<int> a;
    unordered_map<int, int> mp;

    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;

        mp[x]++;

        if (x <= 31622 && x != 1)
            a.push_back(x);
    }

    if (mp[1] >= 2)
    {
        cout << "YES" << endl;
        return;
    }

    for (auto [u, v]: mp)
    {
        if (v >= 2 && mp[1] == 1)
        {
            cout << "YES" << endl;
            return;
        }
    }

    for (auto v: a)
    {
        ll x = 1ll * v * v;
        for (int i = 2; x <= 1e9; i++, x *= v)
        {
            if (mp.count(i) && mp.count(x))
            {
                cout << "YES" << endl;
                return;
            }
        }
    }
    cout << "NO" << endl;
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

# E - 未知 3

> 关键词：构造、贪心

## 思路

### Step1 - 判断能否构造

我们考虑寻找上下界，即用最省节点的方式和最费节点的方式，分别能凑出多大的树。

**首先考虑最省节点的方式（**$N_{min}$**）：**

为了用最少的节点，我们应该让这 $m$ 个叶子节点**尽可能多地共享路径**。

我们可以先建一条长度为 $m$ 的主干，需要 $m+1$ 个节点（包含根节点）。这条主干的末端恰好是一个深度为 $m$ 的叶子。

对于剩余的深度为 $1$ 到 $m-1$ 的叶子，只要在主干上深度为$d-1$的节点处直接挂上一个节点，它就是一个深度为$d$的叶子。

除了主干的 $m+1$ 个节点，我们额外增加了 $m-1$ 个叶子节点。

总节点数$N_{min} = (m + 1) + (m - 1) = 2m$

**再考虑最费节点的方式（**$N_{max}$**）：**

为了用最多的节点，我们应该让这 $m$ 个叶子节点**完全不共享任何路径**（除了根节点）。

让每个叶子都从根节点单独伸出一条链。

深度为 1 的叶子需要 1 个独立节点；深度为 2 的叶子需要 2 个独立节点，以此类推，深度为 $m$ 的叶子需要 $m$ 个独立节点。

总节点数$N_{max} = 1 + 1 + 2 + \dots + m = 1 + \frac{m(m+1)}{2}$

结论：当输入的$n$满足 $2m \le n \le 1 + \frac{m(m+1)}{2}$ 时，可以构造出合法的树。

### Step2 - 输出构造方案

1. **初始化主干**：先用节点 1 到 $m+1$ 连成一条直线主干。
2. **分配剩余节点**：维护一个可用节点分配器（从 $m+2$ 开始），以及剩余需要消化的配额 $S$。
3. **逐个拉伸叶子**：遍历深度 $d$ 从 1 到 $m-1$。

- 计算当前叶子可以消化的节点数：$x = \min(S, d - 1)$。
- 这说明这个叶子应该挂在主干深度为 $d - 1 - x$ 的节点上。
- 然后从该挂载点开始，拉出一条长度为 $x + 1$ 的独立链，链的末端就是深度为 $d$ 的叶子。
- 更新 $S = S - x$。

## Code

```cpp
// Problem: 未知(version 3)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/E
// Time: 2026-04-28 14:31:49
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
    ll n, m;
    cin >> n >> m;

    ll minN = 2 * m, maxN = 1LL + m * (m + 1LL) / 2LL;

    if (n < minN || n > maxN)
    {
        cout << "NO" << endl;
        return 0;
    }

    cout << "YES" << endl;

    // 初始化主干
    // 节点1到m+1连成一条直线，节点i的深度就是i-1
    for (int i = 1; i <= m; i++)
        cout << i << " " << i + 1 << endl;

    // 剩余的节点，编号从m+2开始
    ll rest = n - 2 * m;
    int id = m + 2;

    for (int d = 1; d <= m - 1; d++)
    {
        ll x = min(rest, (ll) d - 1);
        rest -= x;

        // 应该挂在深度(d-1-x)的地方，编号+1
        int t = (d - 1 - x) + 1;

        // 连边：从挂载点拉出一条长度为x+1的链
        int p = t;
        for (int s = 0; s < x + 1; s++)
        {
            cout << p << " " << id << endl;
            p = id, id++;
        }
    }

    return 0;
}
```

# F - 回文 3

> 关键词：分类讨论、前缀和

## 思路

> [!TIP]
> 关键信息：查询的回文子序列长度 $x \le 3$，对这三种情况直接分类讨论。

1. 当$x=1$时，直接输出区间长度$r-l+1$即可。
2. 当$x=2$时，长度为 $2$ 的回文串一定是两个相同的字符。我们统计在查询区间内每个字符区间的次数，假设某个字符出现了$k$次，答案即为$C_k^2$，对于每种字符，我们使用前缀和 `cnt[26][n]` 来预处理所有的出现次数。
3. 当$x=3$时，长度为 $3$ 的回文串结构一定是左右相同，中间任意。我们首先固定两侧的字符为 `c`，枚举所有字母作为放在中间的字符，看它左右两边各有多少个相同的 `c`。根据乘法原理，它能组成的数量为左边 `c` 的数量乘右边 `c` 的数量。

我们考虑如何不遍历区间，更快地求出两边的数量：

记前$i$个字符中$c$出现了$cnt[i]$次。

令$A=cnt[l-1]$，$B=cnt[r]$，有以下公式：

$\sum_{i=l}^{r} (cnt[i-1] - A) \times (B - cnt[i])$

展开上式有$\sum_{i=l}^{r} (B \cdot cnt[i-1] - cnt[i-1] \cdot cnt[i] - A \cdot B + A \cdot cnt[i])$

所以我们维护$cnt$的前缀和$cnt[i]*cnt[i-1]$的前缀和即可。

## Code

```cpp
// Problem: 回文(version 3)
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133523/F
// Time: 2026-04-28 15:53:58
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

int n, q;
string s;

vector<vector<int>> cnt; // 前i个字符中字母c的出现次数
vector<vector<ll>> P2, P3;
// P2[c][i] : sum_{j=1..i} cnt[c][j-1]*cnt[c][j]
// P3[c][i] : sum_{j=1..i} cnt[c][j]

void solve(int &l, int &r, int &x)
{
    if (x == 1)
    {
        cout << r - l + 1 << endl;
        return;
    }

    else if (x == 2)
    {
        ll res = 0;
        for (int c = 0; c < 26; c++)
        {
            int c_cnt = cnt[c][r] - cnt[c][l - 1];
            res += (ll) c_cnt * (c_cnt - 1) / 2;
        }
        cout << res << endl;
        return;
    }

    else
    {
        ll res = 0;
        for (int c = 0; c < 26; c++)
        {
            int A_l = cnt[c][l - 1], A_r = cnt[c][r];

            // S1 = sum_{i=l-1}^{r-1} cnt[c][i]
            ll S1 = P3[c][r - 1] - (l - 2 >= 0 ? P3[c][l - 2] : 0);

            // S2 = sum_{k=l}^{r} cnt[c][k-1] * cnt[c][k]
            ll S2 = P2[c][r] - P2[c][l - 1];

            // S3 = sum_{i=l}^{r} cnt[c][i]
            ll S3 = P3[c][r] - P3[c][l - 1];

            ll L = r - l + 1;
            res += A_r * S1 - S2 - L * A_l * A_r + A_l * S3;
        }
        cout << res << endl;
    }
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0), cout.tie(0);

    cin >> n >> q >> s;

    cnt.assign(26, vector<int>(n + 1, 0));
    P2.assign(26, vector<ll>(n + 1, 0));
    P3.assign(26, vector<ll>(n + 1, 0));

    for (int c = 0; c < 26; c++)
    {
        for (int i = 1; i <= n; i++)
        {
            int cur = (s[i - 1] - 'a' == c) ? 1 : 0;
            cnt[c][i] = cnt[c][i - 1] + cur;
            P3[c][i] = P3[c][i - 1] + cnt[c][i];
            P2[c][i] = P2[c][i - 1] + (ll) cnt[c][i - 1] * cnt[c][i];
        }
    }

    while (q--)
    {
        int l, r, x;
        cin >> l >> r >> x;
        solve(l, r, x);
    }
}
```
