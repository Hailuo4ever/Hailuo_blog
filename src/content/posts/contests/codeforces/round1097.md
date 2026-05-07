---
title: cf round 1097
published: 2026-05-03
description: "Codeforces Round 1097 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1097.(Div. 2)](https://codeforces.com/contest/2224)

# A - Zhily and Array Operating

> 关键词：贪心

## 思路

我们希望最大化每一个数字。对于位置 $i$ 的一次操作不会改变其他位置的正负性，但可能使 $j<i$ 的 $a_j$ 变大，因此倒着做，如果$a_{i+1}>0$，那么加上它会使值增加，从而提高出现更多正数的机会，否则加上它没有帮助，略过即可。

## Code

```c++
// Problem: CF 2224 A
// Contest: Codeforces - Codeforces Round 1097 (Div. 2,  Based on Zhili Cup 2026)
// URL: https://codeforces.com/contest/2224/problem/A
// Time: 2026-05-07 22:15:48
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = n - 1; i >= 1; i--)
    {
        if (a[i] > 0)
            a[i - 1] += a[i];
    }

    ll res = 0;
    for (auto i: a)
        if (i > 0)
            res++;
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

# B - Zhily and Mex and Max

> 关键词：贪心，构造

## 思路

题目要求我们对数组进行重排，使得其所有前缀的最大值（`Max`）和最小未出现的非负整数（`Mex`）之和最大。

我们先考虑如何最大化 `Max`，由于前缀的最大值是非递减的，假如把整个数组的绝对最大值 $M$ 放在数组的第一个位置，那么对于所有位置，前缀的最大值都会是 $M$，这部分的总和就会达到最大值 $n \times M$。

我们再考虑如何最大化 `Mex`，在把 $M$ 放在第一位的前提下，我们希望 `Mex` 能够尽可能快的增长，`Mex` 从零开始，要让它成长到 $x$，需要前缀里包含 $0, 1, 2, \dots, x-1$。

因此，紧跟在 $M$ 后面的，应该是 $0, 1, 2, 3 \dots$ 这样递增的连续数字（如果原数组中存在这些数字）。

注意：如果遇到数字正好等于 $M$，我们可以直接跳过，因为 $M$ 已经在最前面了，前缀中已经包含了 $M$。

当我们无法继续凑出下一个连续数字时，说明 MEX 的增长达到了极限，此时把原数组中剩下的所有其他数字（重复的数字或不连续的大数字）全部放在数组末尾即可，它们的顺序不影响最终的 `Mex` 和 `Max`。

> [!NOTE]
>
> 这种贪心的构造方法是最优的，因为将 $M$ 放在首位对 Max 总和的贡献带来的收益，在任何情况下都远大于把它放在其他位置所能换来的微小的 MEX 收益。

## Code

```c++
// Problem: CF 2224 B
// Contest: Codeforces - Codeforces Round 1097 (Div. 2,  Based on Zhili Cup 2026)
// URL: https://codeforces.com/contest/2224/problem/B
// Time: 2026-05-07 22:21:51
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 2e5 + 5;

int a[N], cnt[N];

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a + 1, a + n + 1);
    swap(a[1], a[n]);
    sort(a + 2, a + n + 1);

    vector<ll> v1, v2;
    // v1中存储的是不重复的递增序列，v2存储多余的数字
    for (int i = 2; i <= n; i++)
    {
        if (v1.size() && v1.back() == a[i])
            v2.push_back(a[i]);
        else
            v1.push_back(a[i]);
    }

    // 重排原数组
    int idx = 1;
    for (auto i: v1)
        a[++idx] = i;
    for (auto i: v2)
        a[++idx] = i;

    ll res = 0;
    int nw = 0, mx = a[1];

    for (int i = 0; i <= n + 1; i++)
        cnt[i] = 0;

    for (int i = 1; i <= n; i++)
    {
        // 只有小于等于n的数字才会对mex的增长有意义
        if (a[i] <= n)
            cnt[a[i]]++;

        while (cnt[nw] > 0)
            nw++;

        res += mx + nw;
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

# C - Zhily and Bracket Swapping

> 关键词：合法括号序列（RBS），贪心

## 思路

> [!NOTE]
>
> 判断括号序列是否合法有一个非常经典的思路：**使用前缀和。**
>
> 把 `(` 看作 `+1`，把 `)` 看作 `-1`，任何时刻前缀和都必须 $\ge 0$，也就是左括号的数量不能少于右括号。
>
> 在结束的时候，最终的前缀和必须 $=0$，也就是左右括号总数必须相等。

题目要求我们只能在相同的位置 $i$ 交换 $a_i$ 和 $b_i$，会出现以下三种情况：

1. 二者都是 `(`：此时两个序列在这个位置的前缀和都只能 `+1`
2. 二者都是 `)`：此时两个序列在这个位置的前缀和都只能 `-1`
3. 一个是 `(`，一个是 `)`：此时我们可以决定给谁 `+1`，给谁 `-1`

那么我们让谁去拿 `+1` 呢？这里有一个贪心策略：谁当前的前缀和更小，就给它 `+1`。

其实这也不难理解，为了在整个操作过程中防止其中任何一个跌破 `0`（变得不合法），最安全的策略就是让它们尽可能保持平衡。

> [!NOTE]
>
> 这道题很有教育意义，一定要记住这种判断合法括号序列的方法！

## Code

```c++
// Problem: CF 2224 C
// Contest: Codeforces - Codeforces Round 1097 (Div. 2,  Based on Zhili Cup 2026)
// URL: https://codeforces.com/contest/2224/problem/C
// Time: 2026-05-07 23:09:28
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    string a, b;
    cin >> a >> b;

    int sa = 0, sb = 0;
    for (int i = 0; i < n; i++)
    {
        if (a[i] == b[i])
        {
            if (a[i] == '(')
                sa++, sb++;
            else
                sa--, sb--;
        }
        else
        {
            if (sa < sb)
                sa++, sb--;
            else
                sb++, sa--;
        }

        if (sa < 0 || sb < 0)
        {
            cout << "NO" << endl;
            return;
        }
    }

    if (sa == 0 && sb == 0)
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

