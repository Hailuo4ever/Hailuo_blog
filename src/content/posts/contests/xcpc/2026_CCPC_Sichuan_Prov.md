---
title: 2026 ccpc 四川省赛
published: 2026-06-21
description: "The 2026 ICPC China Sichuan Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, ccpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC China Sichuan Provincial Programming Contest - Codeforces](https://codeforces.com/gym/106570)
>
> [[SCCPC 2026\] 2026 年四川省大学生程序设计竞赛重现赛 - 洛谷](https://www.luogu.com.cn/contest/330334#description)

# C - 精灵对战

> 关键词：贪心

## 思路

每派出一只我方精灵，花费为 $1$。这只精灵会一直战斗，直到发生以下两种情况之一：

1. 它遇到一个自己**不能克制**的敌人，并且同归于尽；

2. 它遇到一个自己**不能克制**的敌人，并且被敌人击倒；

否则它一路克制到最后，直接结束。

所以这题可以看成：从当前未击败位置 $i$ 出发，选择一种精灵 $x$，看它最多能把当前位置推进到哪里，然后每次选择能推进最远的精灵即可。

先预处理出从每个位置 $i$ 出发，派出一只精灵最多能跳到哪里，记为 $b_i$。然后从 $pos=1$ 开始，每次跳到 $b_{pos}$，答案加 $1$。

## Code

> [!NOTE]
>
> 代码挺难写的。

```c++
// Problem: Luogu P16959
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16959
// Time: 2026-06-22 15:32:04
// 先预处理每个位置派一只精灵能达到的最远位置b[i]，然后贪心跳
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
    int n, m, k;
    cin >> n >> m >> k;

    vector<set<int>> g(n + 1); // 第i行表示哪些精灵可以克制第i种精灵
    // g[y].count(x) 表示x是否克制y

    for (int i = 1, x; i <= n; i++)
    {
        cin >> x;

        for (int j = 1, y; j <= x; j++)
        {
            cin >> y;
            g[i].insert(y);
        }
    }

    vector<int> a(m + 2), b(m + 2);
    // b[i]表示当前还没打败的第一个敌人是位置i，派出一只精灵后，最多能推进到的位置
    for (int i = 1; i <= m; i++)
        b[i] = i + 1; // 初始化，表示最多能推进到的地方一直是位置i+1（派出和敌人a[i]同种的精灵）

    vector<vector<int>> good(n + 1);

    for (int i = 1; i <= m; i++)
    {
        cin >> a[i];
        int x = a[i]; // 当前敌人

        for (auto t: g[x])
            good[t].push_back(i);
    }

    for (int i = 1; i <= n; i++)
    {
        auto &s = good[i]; // s里面存的是精灵i能克制的所有对手位置

        for (int r = 0; r < s.size(); r++)
        {
            int l = r;
            while (r + 1 < s.size() && s[r + 1] == s[r] + 1)
                r++; // 连续段

            int nt = s[r] + 1; // 第一个精灵i不能克制的位置

            if (nt <= m && !g[i].count(a[nt])) // 同归于尽的情况
                nt++;

            // 假设某个精灵 i 能克制的连续段是[L, R]
            // 那么如果从 L 开始派出精灵 i，它会打到 R。
            // 如果从 L + 1 开始派出精灵i，它也会打到 R。
            // 如果从 L + 2 开始派出精灵 i，它还是会打到 R。
            // 所以统一更新整个区间
            for (int j = l; j <= r; j++)
                b[s[j]] = max(b[s[j]], nt);
        }
    }

    int ans = 0, pos = 1; // pos表示当前未击败的第一个敌人，派一只精灵后最多能跳到b[pos]
    while (pos <= m)
    {
        pos = b[pos];
        ans++;
    }
    cout << ans << endl;
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



# D - 那一天的回文字符串

> 关键词：分类讨论

## 思路

显然需要注意对称位置的奇偶性。当 $n$ 是偶数时，想组成回文串，必须让奇数位置字符集合和偶数位置字符集合完全相同。

$n$ 是奇数时，对称位置的奇偶性相同，也就是奇数位置内部需要构成一个回文，偶数位置内部也需要。

考虑对一组字符，什么时候可以组成回文。对于奇数位置，允许只有一个字符出现奇数次；对于偶数位置，必须所有字符都出现偶数次。

设 $cnt_1[c]$ 为奇数位置字符 $c$ 的数量，$cnt_0[c]$ 为偶数位置字符 $c$ 的数量。

若 $n$ 是偶数，需要满足 $cnt_1[c]=cnt_0[c]$ 对所有字符 $c$ 均成立。

若 $n$ 是奇数，需要满足只有一个字符出现奇数次，且所有偶数位置出现的字符均为偶数次。**根据 $mid$ 所处位置的奇偶性分类讨论，$mid$ 出现的位置需要满足只有一个字符出现奇数次。**

## Code

```c++
// Problem: Luogu P16960
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16960
// Time: 2026-06-22 00:12:21
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
    string s;
    cin >> s;

    int n = s.size();
    s = " " + s;

    vector<int> od(26, 0), ev(26, 0);
    for (int i = 1; i <= n; i++)
    {
        int c = s[i] - 'a';

        if (i & 1)
            od[c]++;
        else
            ev[c]++;
    }

    bool flag = true;

    if (n % 2 == 0)
    {
        for (int c = 0; c < 26; c++)
        {
            if (od[c] != ev[c])
            {
                flag = false;
                break;
            }
        }
    }
    else
    {
        int mid = (n + 1) / 2;

        if (mid & 1)
        {
            int cnt = 0, cnt2 = 0;

            for (int c = 0; c < 26; c++)
            {
                if (od[c] & 1)
                    cnt++;

                if (ev[c] & 1)
                    cnt2++;
            }

            if (cnt > 1)
                flag = false;

            if (cnt2 != 0)
                flag = false;
        }
        else
        {
            int cnt = 0, cnt2 = 0;

            for (int c = 0; c < 26; c++)
            {
                if (ev[c] & 1)
                    cnt++;

                if (od[c] & 1)
                    cnt2++;
            }

            if (cnt > 1)
                flag = false;

            if (cnt2 != 0)
                flag = false;
        }
    }

    cout << (flag ? "YES" : "NO") << endl;
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

# G - 禁忌教典的消失咒文

> 关键词：前缀和，分类讨论

## 思路

这题的本质是：删除区间后，前缀符号不变，后缀整体左移。后缀的符号是否翻转，只取决于删除长度的奇偶性。

也就是说，删除一段区间 $[l,r]$ 后，剩下的序列是：$a_1,a_2,\dots,a_{l-1},a_{r+1},\dots,a_n$。

其中前半部分的正负号不变，后半部分因为向前移动了 $r-l+1$ 个位置，所以符号可能发生翻转。

首先预处理正负号交错的前缀和，考虑删除区间后的能量怎么算。设删除区间为 $[l, r]$，长度为 $d=r-l+1$。关键在于后缀会向前移动 $d$ 位。如果 $d$ 是偶数，后缀符号不变；如果 $d$ 是奇数，后缀符号全部反转。令 $p=l-1, \quad q=r$。

删除长度为偶数时，$d=q-p$ 是偶数，所以 $p$ 和 $q$ 奇偶性相同。后缀符号不变，因此总和 $E'=S_p+S_n-S_q$。要求 $S_p+S_n-S_q=k$，即需要统计满足 $S_q-S_p=S_n-k$，且 $p<q$，$p$，$q$ 奇偶性相同的 $p,q$ 对个数。

删除长度为奇数时，$d=q-p$ 是奇数，所以 $p$ 和 $q$ 奇偶性不同。后缀符号改变，因此总和 $E'=S_p-(S_n-S_q)$。要求 $S_p-S_n+S_q=k$，即需要统计满足 $S_p+S_q=S_n+k$，且 $p<q$，$p$，$q$ 奇偶性不同的 $p,q$ 对个数。

明确上面两种情况后，考虑如何 $O(n)$ 地统计。我们从左到右枚举右端点 $q$，维护两个哈希表。一个记录已经出现过的偶数下标前缀和，一个记录已经出现过的奇数下标前缀和。

枚举当前 $q$ 时，设当前前缀和为 $S_q$，当前奇偶性为 $q \bmod 2$。统计偶数长度删除区间，需要 $p,q$ 同奇偶，所以贡献为 `cnt[q & 1][S_q - S_n + k]`；统计奇数长度删除区间，需要 $p,q$ 不同奇偶，所以贡献为 `cnt[(q & 1) ^ 1][S_n + k - S_q]`。统计后把当前 $S_q$ 加入哈希表。初始化时有 $cnt[0][0] =1$ （下标 $0$ 是偶数）

## Code

```c++
// Problem: Luogu P16963
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16963
// Time: 2026-06-22 10:48:30
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
    ll k;

    cin >> n >> k;

    vector<ll> a(n + 1), s(n + 1, 0);

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];

        if (i & 1)
            s[i] = s[i - 1] + a[i];
        else
            s[i] = s[i - 1] - a[i];
    }

    ll tot = s[n];
    unordered_map<ll, ll> cnt[2];

    cnt[0].reserve(n * 2), cnt[1].reserve(n * 2);

    cnt[0][0] = 1;

    ll res = 0;

    for (int r = 1; r <= n; r++)
    {
        int idx = r & 1; // 奇偶性

        res += cnt[idx][s[r] - tot + k];
        res += cnt[idx ^ 1][tot + k - s[r]];

        cnt[idx][s[r]]++;
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



# H - 最大权独立集问题

> 关键词：位运算，性质

## 思路

需要找到一个性质：$x \oplus y$ 中 $1$ 的个数是奇数，当且仅当 $x$ 和 $y$ 本身的二进制 $1$ 的个数奇偶性不同。

对于每个点 $i$，考察它的权值 $W_i$ 的二进制中 $1$ 的个数。如果 $popcount(W_i)$ 是偶数，就放入集合 $E$，奇数放集合 $O$。

根据题意，若 $\operatorname{popcount}(W_i \oplus W_j)$ 是奇数，则 $i$ 和 $j$ 之间有边。

由上面的性质可知：

- 如果 $W_i$ 和 $W_j$ 的 $1$ 的个数奇偶性相同，那么它们之间 **没有边**；
- 如果 $W_i$ 和 $W_j$ 的 $1$ 的个数奇偶性不同，那么它们之间 **有边**。

所以整张图实际上是一个完全二分图，两侧取最大值即可。

## Code

```c++
// Problem: Luogu P16964
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16964
// Time: 2026-06-22 10:16:59
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

    vector<int> od, ev;
    for (int i = 1, x; i <= n; i++)
    {
        cin >> x;
        int cnt = __builtin_popcount(x);

        if (cnt & 1)
            od.emplace_back(x);
        else
            ev.emplace_back(x);
    }

    ll res1 = accumulate(all(od), 0LL), res2 = accumulate(all(ev), 0LL);
    cout << max(res1, res2) << endl;
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

