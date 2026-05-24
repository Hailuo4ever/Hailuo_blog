---
title: cf round 1089
published: 2026-05-23
description: "Codeforces Round 1089 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1089 (Div. 2)](https://codeforces.com/contest/2210)

# A - A Simple Sequence

> 关键词：构造

## 思路

要求每相邻两项的取模值单调不增，注意到 $1$ 模上任何一个 $\ge 2$ 的数都得 $1$，由于 `n % (n - 1) = 1`，剩下的数只要从 $n$ 开始倒序输出即可，会得到一个全为 $1$ 的序列，符合题目要求。

## Code

```c++
// Problem: CF 2210 A
// Contest: Codeforces - Codeforces Round 1089 (Div. 2)
// URL: https://codeforces.com/contest/2210/problem/A
// Time: 2026-05-23 13:01:39
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

    cout << 1 << " ";
    for (int i = n; i >= 2; i--)
        cout << i << " ";
    cout << endl;
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

# B -  Simply Sitting on Chairs

> 关键词：贪心，数学

## 思路

我们可以把所有的 $p_i$ 归为两类：

1. 安全椅（$p_i \le i$）：如果你坐在这把椅子上，你会标记一把当前或已经走过的椅子。因为你永远只能一直往右走（顺序访问），所以你在未来绝对不会再踩到这把被标记的椅子。坐它没有任何负面影响。

2. 危险椅（$p_i > i$）：如果你坐在这把椅子上，你会标记一把未来的椅子。这就像在自己前进的道路上埋了一颗“地雷”，一旦走到 $p_i$ 这个位置，游戏就会立刻强制结束。

假如安全椅有 $k$ 把，我们只选择所有的安全椅来坐，我们发现一定能坐满所有的 $k$ 把安全椅。

但实际上，存在可被证明的结论：我们不可能坐满超过 $k$ 把椅子。

[Gemini 对话链接](https://gemini.google.com/share/4ffe317c71b9)

![](https://img.hailuo4ever.com/codeforces/round_1089_img1.png)

## Code

```c++
// Problem: CF 2210 B
// Contest: Codeforces - Codeforces Round 1089 (Div. 2)
// URL: https://codeforces.com/contest/2210/problem/B
// Time: 2026-05-23 13:20:11
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

    int res = 0;
    for (int i = 1; i <= n; i++)
    {
        int x;
        cin >> x;

        if (x <= i)
            res++;
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

