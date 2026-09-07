---
title: 2026 icpc Asia EC 网络赛 I
published: 2026-09-05
description: "The 2026 ICPC Asia East Continent Online Contest (I)"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 网络赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC Asia East Continent Online Contest (I) - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/4071)

# A - Recall

> 关键词：模拟，贪心

## 思路

题目给出的 `+ x`、`T x`、`F x` 都按原顺序保留，中间丢失了一些 `-` 操作；同时栈中任意时刻不能有重复元素，并且 `T/F` 查询必须正确。题目保证一定存在合法方案。

实际上，`T x` 是一个下界约束，代表 $x$ 至少必须活到这里。`F x` 是一个上界约束，代表 $x$ 在这里之前必须已经死掉。

我们将每次 `+` 操作独立，看作一次 `+ x` 创建了一份 $x$，显然如果这份 $x$ 所对应的最后一次 `T x` 执行之前，当前的 $x$ 绝对不能删掉。这提示我们对每一个 `+` 操作，维护这一份 $x$ 对应的最后一次 `T x`。

我们定义 `lst[i]` 表示**下一次 `+ x` 之前，最后一次 `T x` 的位置**。如果下一次 `+ x` 之前没有 `T x`，那么让 $lst_i=i$，表示这个 $x$ 弹入栈以后没有任何未来需求，可以立刻弹掉。求解 `lst[i]` 的过程中，我们定义 `mp[x]` 表示扫描过程中 $x$ 最近一次出现 `+ x` 的位置。

得到 `lst[i]` 后，我们开始构造答案。我们维护一个栈，存放 `lst`。因为我们不需要知道每次 `-` 操作弹掉的是什么，只需关心栈顶这个元素现在能不能弹。判断标准即为 $lst_{\text{top}}\le i$。

遇到 `+ x` 时，首先答案加入 `+`，然后把这一份 $x$ 压到栈里，例如 $lst_i=10$，相当于栈里面放它至少要活到第 $10$ 个操作。遇到 `T / F` 时，首先答案加入 `?`，然后我们贪心地弹栈，当 $stk.back()\le i$ 时，表示当前栈顶元素最后一次需要存在的时刻已经结束了，就应该立刻弹掉。

> [!NOTE]
>
> 为什么弹栈条件不是 `stk.back() == i` ？
>
> 因为元素可能想弹出，但会被别人压住。考虑样例，会出现以下的情况：
>
> ```c++
> 1: +1
> 2: +2
> 3: T1
> 4: F3
> 5: T2
> 6: +2
> 
> 栈底
> 1      deadline = 3
> 2      deadline = 5
> 栈顶
> ```
>
> 因此已经过了截止时间，并且当前已经来到栈顶，才能弹出。

> 考虑为什么这个做法没有处理 `F x`，但不影响正确性。
>
> 假设反过来，执行到 `F x` 时，这一份 $x$ 仍在我们的栈中。那么有两种可能：一种是 $x$ 自己未来还需要，说明在下一次 `+ x` 之前，后面还有 `T x`。但这显然是不可能的，因为如果查出了 `F x`，就不会再出 `T x`。另一种是 $x$ 已经过期，但被其他元素压住了。例如如下情况：
>
> ```c++
> 栈底
> x    deadline = 2
> y    deadline = 100
> 栈顶
> ```
>
> 现在 `5: F x`，为了弹 $x$，必须要弹 $y$，但如果现在弹掉，对后面的 $y$ 的约束就无法成立。
>
> 因此上述的两种情况均代表输入不存在合法方案，但题目保证输入一定有解。因此都不可能出现。

## Code

```c++
// Problem: A. Recall
// Contest: QOJ - The 2026 ICPC Asia East Continent Online Contest (I)
// URL: https://qoj.ac/contest/4071/problem/20016
// Time: 2026-09-07 18:59:40
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

using p = tuple<char, int>;

void solve()
{
    int n;
    cin >> n;

    vector<p> a(n + 1);
    vector<int> lst(n + 1);
    map<int, int> mp;

    for (int i = 1; i <= n; i++)
    {
        char c;
        int x;
        cin >> c >> x, a[i] = {c, x};
        lst[i] = i;
    }

    for (int i = 1; i <= n; i++)
    {
        auto &[c, x] = a[i];
        if (c == 'T')
            lst[mp[x]] = i;
        else if (c == '+')
            mp[x] = i;
    }

    string res = "";
    vector<int> stk;
    for (int i = 1; i <= n; i++)
    {
        auto &[c, x] = a[i];
        if (c == '+')
            res += '+', stk.eb(lst[i]);
        else
            res += '?';

        while (!stk.empty() && stk.back() <= i)
            stk.pop_back(), res += '-';
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

# C - Permutation Inversions

> 关键词：拓扑排序

## 思路

用 `vis[i]` 记录某个点是否真正参与过某个约束关系，`cur` 维护当前所填的数值。

每条信息 $q_1,q_2,\ldots,q_k$ 表示 $p_{q_1}<p_{q_2}<\cdots<p_{q_k}$，我们可以将上述约束看成有向边，即 $q_1\to q_2\to\cdots\to q_k$。按照拓扑序给所有的约束填数，但注意要使用小根堆。因为当有多个当前可以放置的点时，需要优先选择编号更小的位置。这样才能保证逆序对数量尽可能小。

在拓扑排序过程中，一个节点的 ${res[u]\neq0}$ 表示点 $u$ 成功进入过拓扑序，并且已经给它分配了排列值。而有环的点不可能进入拓扑排序，因此最后没被处理过的点一定入度 $\ge 1$，根据这个条件判断无解。

## Code

```c++
// Problem: C. Permutation Inversions
// Contest: QOJ - The 2026 ICPC Asia East Continent Online Contest (I)
// URL: https://qoj.ac/contest/4071/problem/20018
// Time: 2026-09-07 17:54:24
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<vector<int>> g(n + 1);
    vector<int> ind(n + 1, 0), vis(n + 1, 0), res(n + 1, 0);

    for (int i = 1; i <= m; i++)
    {
        int l, r;
        cin >> l >> r;

        int len = r - l + 1;
        vector<int> e(len + 1);
        for (int i = 1; i <= len; i++)
            cin >> e[i];

        for (int i = 2; i <= len; i++)
            g[e[i - 1]].eb(e[i]), ind[e[i]]++, vis[e[i - 1]] = vis[e[i]] = 1;
    }

    int cur = 1;
    for (int i = 1; i <= n; i++)
    {
        if (!vis[i])
            res[i] = cur++;
        else if (ind[i] == 0)
        {
            int mx = 0;
            priority_queue<int, vector<int>, greater<int>> pq;
            pq.push(i);

            while (!pq.empty())
            {
                auto u = pq.top();
                pq.pop();

                res[u] = cur++;
                mx = max(mx, u);

                for (auto v: g[u])
                    if (--ind[v] == 0)
                        pq.push(v);
            }

            i = mx;
        }
    }

    for (int i = 1; i <= n; i++)
    {
        if (vis[i] && !res[i])
        {
            cout << -1 << endl;
            return;
        }
    }

    for (int i = 1; i <= n; i++)
        cout << res[i] << " \n"[i == n];
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

# F - 50 Years of Excellence

> 关键词：签到

## Code

```c++
// Problem: F. 50 Years of Excellence
// Contest: QOJ - The 2026 ICPC Asia East Continent Online Contest (I)
// URL: https://qoj.ac/contest/4071/problem/20021
// Time: 2026-09-07 17:43:45
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n, m;
    cin >> n >> m;

    int pre = 0, res = 0;
    for (int i = 1; i <= n; i++)
    {
        int s = 0;
        for (int i = 1, x; i <= m; i++)
            cin >> x, s += x;

        if (s < pre)
            res++;

        pre = s;
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

# M - Check In

> 关键词：签到

## Code

```c++
// Problem: M. Check In
// Contest: QOJ - The 2026 ICPC Asia East Continent Online Contest (I)
// URL: https://qoj.ac/contest/4071/problem/20028
// Time: 2026-09-07 17:46:49
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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution{l, r}(rnd);
}

void solve()
{
    int n, m;
    cin >> n >> m;

    map<string, bool> mp, mp2;
    for (int i = 1; i <= n; i++)
    {
        string s;
        cin >> s;

        mp[s] = true;
    }

    for (int i = 1; i <= m; i++)
    {
        string s;
        cin >> s;

        if (mp.count(s))
        {
            if (!mp2.count(s))
                cout << "OK" << endl, mp2[s] = true;
            else
                cout << "REPEAT" << endl;
        }
        else
            cout << "WRONG" << endl;
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

