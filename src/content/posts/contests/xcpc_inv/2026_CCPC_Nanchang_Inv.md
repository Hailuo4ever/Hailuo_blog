---
title: 2026 ccpc南昌邀请赛
published: 2026-05-21
description: "2026 CCPC National Invitational (Nanchang) and The 3rd Jiangxi Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Unofficial Mirror 2026 CCPC National Invitational (Nanchang) and The 3rd Jiangxi Provincial Programming Contest](https://codeforces.com/gym/106554/)

# D - 电梯

> 关键词：思维，数学

题目要求：每部电梯必须停在第 $1$ 层和第 $n$ 层；对于任意两层 $x,y$，需要存在一部电梯，使得 $x,y$ 是这部电梯的**相邻停靠层**，也就是可以直达。输出时需要给出最少电梯数，并构造每部电梯的停靠序列，且总停靠层数不能超过 $2 \times 10^6$。

## 思路

考虑如何转化问题，假设现在有 $n$ 层楼，如果一部电梯停靠 $1,3,5,n$，那么它可以直达的楼层对是 $(1,3),(3,5),(5,n)$，也就是说一部电梯的停靠方案，本质上是把整段楼层分割成若干区间。例如 $1, 3, 5, 8$ 对应区间 $[1, 3], [3, 5], [5, 8]$。

所以题目变成：用最少的区间划分方案，覆盖所有楼层对 $(x, y)$。

# G - 可能是字符串签到题

> 关键词：贪心，前缀和

## 思路

询问某个区间内出现次数最多的子串的个数，实际上由于长度为 $1$ 的子串也是合法子串，且任何长度大于 $1$ 的子串，出现次数都不可能超过它首字符的出现次数，所以求的就是某个区间内出现次数最多的字母的数量，使用前缀和预处理，每次询问枚举 $26$ 个字母，更新答案即可。

> 证明：假设在 $s[l,r]$ 中，某个子串 $T$ 出现了 $k$ 次。
>
> 例如：
> $$
> T = \texttt{ab}
> $$
> 如果 $\texttt{ab}$ 出现了 $k$ 次，那么每一次 $\texttt{ab}$ 的出现位置上，开头字符 $\texttt{a}$ 也一定出现了一次。
>
> 所以：
> $$
> \operatorname{cnt}(\texttt{ab}) \le \operatorname{cnt}(\texttt{a})
> $$
> 更一般地，假设子串 $T$ 的第一个字符是 $c$，那么：
> $$
> \operatorname{cnt}(T) \le \operatorname{cnt}(c)
> $$

## Code

```c++
// Problem: CF GYM 106554 G
// Contest: Codeforces - [Unofficial Mirror] 2026 CCPC National Invitational (Nanchang) and The 3rd Jiangxi Provincial
// Programming Contest URL: https://codeforces.com/gym/106554/problem/G
// Time: 2026-05-28 22:22:17
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

int cnt[N][26];

void solve()
{
    int n, q;
    cin >> n >> q;

    string s;
    cin >> s;

    s = " " + s;

    for (int i = 1; i <= n; i++)
    {
        for (int j = 0; j < 26; j++)
            cnt[i][j] = cnt[i - 1][j];
        cnt[i][s[i] - 'a']++;
    }

    while (q--)
    {
        int l, r;
        cin >> l >> r;

        int res = 0;
        for (int i = 0; i < 26; i++)
            res = max(res, cnt[r][i] - cnt[l - 1][i]);
        cout << res << endl;
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

