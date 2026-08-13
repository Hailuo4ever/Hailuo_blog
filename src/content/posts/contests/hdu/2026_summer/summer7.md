---
title: 2026 杭电多校7
published: 2026-08-11
description: "HDU Multi-University Training Contest 7"
image: https://img.hailuo4ever.com/cover/hdu.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营7](https://acm.hdu.edu.cn/contest/problems?cid=1235)

# 1002 - 今晚吃...

> 关键词：分类讨论

## 思路

题目很容易转化成：给定 $00,01,10,11$ 中哪些出现过，找原串的最短子序列，使这些类型恰好出现。统计这四个信息，可以放在一个四位的二进制掩码里。

注意到答案只可能很小，因为最多 $6$ 个字符就能覆盖所有信息了。我们开始进行分类讨论。

只有一种二元串的情况，答案显然为 $2$，对应掩码的 $1,2,4,8$。

有两种二元串的情况，答案为 $3$。这部分也可以挨个验证，对应掩码的 $3,5,6,10,12$。

有三种二元串的情况，答案为 $4$。具体情况如下，对应掩码的 $7,11,13,14$。

| $x$  | 存在的二元串 | 长度 $4$ 的一种表示 |
| ---- | ------------ | ------------------- |
| 7    | `00 01 10`   | `0010`              |
| 11   | `00 01 11`   | `0011`              |
| 13   | `00 10 11`   | `1100`              |
| 14   | `01 10 11`   | `0110`              |

有四种二元串的情况是特殊的。它的理论下界是 $5$，但实际上还有特殊的情况。比如 `110100`，这种串的特殊性在于 `00` 后面不存在 `1`，且· `11` 后面不存在 `0`。考虑达到下界 $5$ 的情况，实际上只有四种：`00110`，`11001`，`01100`，`10011`。因此直接暴力匹配，验证这四个串是不是原串的子序列即可。

## Code

```c++
// Problem: 今晚吃……
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1235&pid=1002
// Time: 2026-08-11 20:05:55
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
    string s;
    cin >> s;

    int n = s.size();

    int st = 0;
    for (int i = 1; i < n; i++)
    {
        if (s[i - 1] == '0' && s[i] == '0')
            st |= (1 << 0);
        if (s[i - 1] == '0' && s[i] == '1')
            st |= (1 << 1);
        if (s[i - 1] == '1' && s[i] == '0')
            st |= (1 << 2);
        if (s[i - 1] == '1' && s[i] == '1')
            st |= (1 << 3);
    }

    auto check = [&](string t) -> bool
    {
        int m = t.size();
        int i = 0, j = 0;
        for (i = 0; i < n; i++)
        {
            if (s[i] == t[j])
                j++;

            if (j == m)
                return true;
        }
        return false;
    };

    int res = 0;
    if (st == 1 || st == 2 || st == 4 || st == 8)
        res = 2;
    else if (st == 3 || st == 5 || st == 6 || st == 10 || st == 12)
        res = 3;
    else if (st == 7 || st == 11 || st == 13 || st == 14)
        res = 4;
    else
    {
        string a = "00110", b = "11001", c = "01100", d = "10011";
        if (check(a) || check(b) || check(c) || check(d))
            res = 5;
        else
            res = 6;
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



# 1008 - 今晚吃NPC

> 关键词：位运算

## 思路

首先考虑，输出的答案中有且仅有两种数：$0$ 和 $w$。

由于与运算符的优先级最高，并且或和异或都不会影响答案，我们只需要让开头第一个连续的与段等于 $w$ 即可，剩下全部填 $0$。

即 ${
\underbrace{w\&w\&\cdots\&w}_{\text{第一个 AND 块}}
\quad+\quad
\text{其余全部 }0
}$，先把最高优先级运算形成的连续段压缩成一个整体

## Code

```c++
// Problem: 今晚吃 NPC
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1235&pid=1008
// Time: 2026-08-11 12:08:47
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
    int n, w;
    cin >> n >> w;

    string s;
    cin >> s;

    cout << "Yes" << endl;

    int r = 1;
    while (r < n && s[r - 1] == '&')
        r++;

    for (int i = 1; i <= n; i++)
        cout << (i <= r ? w : 0) << " \n"[i == n];
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

# 1012 - 今晚吃 TopTree

> 关键词：树形DP

## 思路

题意是把一个多叉树，通过插入虚点，变成二叉树，并分别优化最大深度和深度总和。

首先明确，可以对每个点独立考虑的原因是：无论如何插入新点，都不会改变原本子树的结构。因此我们考虑先把儿子的子树内部做到最优，再去接在父亲下面。由于输入满足 $p_i<i$，也就是父亲编号一定小于儿子编号，因此直接从 $n$ 做到 $1$，倒序处理即可，

考虑如何解决最小高度问题，定义 $h_u$ 表示把 $u$ 的整棵子树变成最多二叉的以后，以 $u$ 为根的最小可能高度。假设 $u$ 只有一个儿子 $v$，显然 $h_u=h_v+1$。如果有两个以上的孩子，我们就要考虑合并高度最小的那个，使用小根堆来贪心的合并。

最小深度是同理的，先计算所有子树大小作为初始的 $sum$，每次合并的时候更新 $sum$ 即可。

## Code

```c++
// Problem: 今晚吃 TopTree
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1235&pid=1012
// Time: 2026-08-11 13:47:06
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

    vector<vector<int>> g(n + 1);
    vector<int> fa(n + 1), sz(n + 1, 1), h(n + 1, 0);

    for (int i = 2, x; i <= n; i++)
        cin >> x, g[x].eb(i), fa[i] = x;

    auto dfs = [&](auto &&self, int u) -> void
    {
        for (auto v: g[u])
        {
            h[v] = h[u] + 1;
            self(self, v);
            sz[u] += sz[v];
        }
    };

    dfs(dfs, 1);

    ll sum = accumulate(all(h), 0ll);
    fill(begin(h), end(h), 0);

    for (int u = n; u >= 1; u--)
    {
        priority_queue<int, vector<int>, greater<int>> pq;
        for (auto v: g[u])
            pq.push(sz[v]);

        while (pq.size() > 2)
        {
            auto sz1 = pq.top();
            pq.pop();

            auto sz2 = pq.top();
            pq.pop();

            pq.push(sz1 + sz2);
            sum += sz1 + sz2;
        }
    }

    for (int u = n; u >= 1; u--)
    {
        priority_queue<int, vector<int>, greater<int>> pq;
        for (auto v: g[u])
            pq.push(h[v]);

        while (pq.size() > 2)
        {
            auto h1 = pq.top();
            pq.pop();

            auto h2 = pq.top();
            pq.pop();

            pq.push(max(h1, h2) + 1);
        }

        if (pq.empty())
            h[u] = 0;
        else if (pq.size() == 1)
            h[u] = pq.top() + 1;
        else
        {
            int a = pq.top();
            pq.pop();

            int b = pq.top();
            pq.pop();

            h[u] = max(a, b) + 1;
        }
    }

    cout << h[1] << ' ' << sum << endl;
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

