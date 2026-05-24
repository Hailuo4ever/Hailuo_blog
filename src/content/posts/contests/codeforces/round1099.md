---
title: cf round 1099
published: 2026-05-22
description: "Codeforces Round 1099 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1099.(Div. 2)](https://codeforces.com/contest/2231)

# A - Construct an Array

> 关键词：签到，构造

## 思路

要求所有的相邻项和、所有的数组元素都互不相同，直接顺序输出所有奇数即可。

## Code

```c++
// Problem: CF 2231 A
// Contest: Codeforces - Codeforces Round 1099 (Div. 2)
// URL: https://codeforces.com/contest/2231/problem/A
// Time: 2026-05-21 23:47:25
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

    for (int i = 1; i <= 2 * n; i += 2)
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

# B - Another Sorting Problem

> 关键词：贪心，思维

## 思路

当我们遇到一个逆序对时，有 $a_i > a_{i+1}$，我们想让他变成顺序，只能通过给 $a_{i+1}$ 加上 $k$。

且 $k$ 有一个下界，为 $L = \max_{a_i > a_{i+1}} (a_i - a_{i+1})$，**我们希望加上的 $k$ 尽可能小，因为假如 $k$ 非常大，后面的数也被迫要加 $k$，但根据前面的推导，逆序对前面的数 $a_i$ 是不能改动的，这样就矛盾了。**

我们让 $k=L$，从左到右模拟，记录上一个确定好的数字为 $prev$（初始为 $a_0$）。

对于接下来的每一个 $a_i$：

- 如果它原本就 $\ge prev$，我们不给它加 $k$，直接让 $prev = a_i$。
- 如果它 $< prev$，那它只能被迫加 $k$。我们检查 $a_i + k$ 是否 $\ge prev$：
    - 如果是，更新 $prev = a_i + k$。
    - 如果连加了 $k$ 还是小于 $prev$，说明不能变成顺序的，直接输出 `NO`。

如果顺利走到数组末尾，说明存在合法方案，输出 `YES`。

## Code

```c++
// Problem: CF 2231 B
// Contest: Codeforces - Codeforces Round 1099 (Div. 2)
// URL: https://codeforces.com/contest/2231/problem/B
// Time: 2026-05-21 23:48:58
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
const ll inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    ll k = 0;
    for (int i = 0; i < n - 1; i++)
        k = max(k, a[i] - a[i + 1]);

    if (k == 0)
    {
        cout << "YES" << endl;
        return;
    }

    ll prev = a[0];
    for (int i = 1; i < n; i++)
    {
        if (a[i] >= prev)
            prev = a[i];
        else
        {
            if (a[i] + k >= prev)
                prev = a[i] + k;
            else
            {
                cout << "NO" << endl;
                return;
            }
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

# C - Chipmunk Theo and Equality

> 关键词：模拟

## 思路

注意到对于任何一个给定的数字，它的下一步是唯一确定的，都不用搜索，直接模拟下去就可以。

对某个数字不断操作，它最后一定会落入 $1 \leftrightarrow 2$ 的无限循环，因此让所有数字相等的目标一定可以在有限步实现。

由于最多两次操作就能右移一位某个数字，任何一个高达 $10^9$ 的数字，最多只需要约 60 步，就会掉进 1 和 2 的循环中。

因此考虑枚举所有状态，并记录需要操作的步数，也就是 `pair<int, int> （状态, 步数）`，并预留 $60 \times n$ 的空间。

最后排序所有状态，使用双指针统计答案，假设某个状态出现了 $n$ 次，说明可以集体到达这个数，记录并更新答案。

> [!NOTE]
>
> 本题卡 `map`。

## Code

```c++
// Problem: CF 2231 C
// Contest: Codeforces - Codeforces Round 1099 (Div. 2)
// URL: https://codeforces.com/contest/2231/problem/C
// Time: 2026-05-22 13:19:18
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
    for (int i = 0; i < n; i++)
        cin >> a[i];

    vector<pii> st; // pair<数值，步数>
    st.reserve(n * 60);

    for (int i = 0; i < n; i++)
    {
        int x = a[i], steps = 0;
        while (true)
        {
            st.push_back({x, steps});
            if (x == 1)
            {
                st.push_back({2, steps + 1});
                break;
            }
            if (x == 2)
            {
                st.push_back({1, steps + 1});
                break;
            }

            if (x % 2 == 0)
                x /= 2;
            else
                x++;

            steps++;
        }
    }

    sort(all(st));

    ll res = 1e18;

    for (int i = 0; i < (int) st.size();)
    {
        int val = st[i].first;
        int cnt = 0;
        ll cost = 0;

        while (i < (int) st.size() && st[i].first == val)
        {
            cnt++;
            cost += st[i].second;
            i++;
        }

        if (cnt == n)
            res = min(res, cost);
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

