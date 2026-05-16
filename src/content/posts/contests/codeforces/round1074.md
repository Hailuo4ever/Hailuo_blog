---
title: cf round 1074
published: 2026-05-15
description: "Codeforces Round 1074 (Div.4)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1074 (Div. 4)](https://codeforces.com/contest/2185)

# A - Perfect Root

> 关键词：签到

## Code

```c++
// Problem: CF 2185 A
// Contest: Codeforces - Codeforces Round 1074 (Div. 4)
// URL: https://codeforces.com/contest/2185/problem/A
// Time: 2026-05-14 22:08:57
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

    for (int i = 1; i <= n; i++)
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

# B - Prefix Max

> 关键词：签到

## 思路

把最大值换到数组的最开始一定是最优的，答案为 $max \times n$。

## Code

```c++
// Problem: CF 2185 B
// Contest: Codeforces - Codeforces Round 1074 (Div. 4)
// URL: https://codeforces.com/contest/2185/problem/B
// Time: 2026-05-14 22:08:42
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

    int mx = -1;
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        if (a[i] > mx)
            mx = a[i];
    }

    cout << (ll) mx * n << endl;
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

# C - Shifted MEX

> 关键词：MEX，思维

## 思路

**任意次的操作都不会改变数组中任意两个元素之间的相对差值。**

如果在变换后的数组中存在 $0, 1, \dots, M-1$ 这样一段连续的公差为 1 的序列，那么在原数组中，必然也存在一段长度为 $M$ 的连续公差为 1 的序列，即 $y, y+1, y+2, \dots, y+M-1$（其中 $y = -x$）。

因此我们只需要找到原数组去重后，最长的连续公差为 $1$ 的序列的长度即可。假设原数组中最长的一段连续整数序列的长度为 $L$，起止元素分别为 $y$ 到 $y+L-1$。 我们只需令 $x = -y$，那么这段序列就会被平移成 $0, 1, \dots, L-1$。

## Code

```c++
// Problem: CF 2185 C
// Contest: Codeforces - Codeforces Round 1074 (Div. 4)
// URL: https://codeforces.com/contest/2185/problem/C
// Time: 2026-05-14 22:13:43
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

    sort(all(a));

    a.erase(unique(all(a)), a.end());

    int res = 0, cur = 0;
    for (int i = 0; i < n; i++)
    {
        if (i == 0 || a[i] - a[i - 1] != 1)
            cur = 0;
        cur++;
        res = max(res, cur);
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

# D - OutOfMemoryError

> 关键词：模拟

## 思路

如果每次都进行重置操作，最坏情况下的时间复杂度是 $O(n \times m)$，考虑将重置操作从 $O(n)$ 优化到 $O(1)$。

维护一个全局时间戳 $t$，并对于每个数维护个体时间戳，记录第 $i$ 个元素最后一次被修改时，系统处于第一次崩溃的状态。

当我们要操作第 `op` 个元素时，先检查它的个体时间戳 `lst_up[op]` 是否落后于全局时间戳 `t`。

1. 假如是落后的，说明它需要被重置，进行一次重置操作并更新个体时间戳为 $t$，表示它已经更新到最新了。

2. 假如加完 `num` 后导致了系统崩溃，就让全局时间戳 `t++`。

当所有操作结束，输出的时候，我们检查 `lst_up[i] =?= t`，假如  `lst_up[i] < t`，说明它还欠一次重置，所以我们输出原值

## Code

```c++
// Problem: CF 2185 D
// Contest: Codeforces - Codeforces Round 1074 (Div. 4)
// URL: https://codeforces.com/contest/2185/problem/D
// Time: 2026-05-14 22:26:44
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
    ll n, m, h;
    cin >> n >> m >> h;

    vector<ll> a(n + 1);
    vector<ll> cur(n + 1);

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        cur[i] = a[i];
    }

    vector<int> lst_up(n + 1, 0);
    int t = 0;

    while (m--)
    {
        ll op, num;
        cin >> op >> num;

        if (lst_up[op] < t)
            cur[op] = a[op], lst_up[op] = t;

        cur[op] += num;

        if (cur[op] > h)
            t++;
    }

    for (int i = 1; i <= n; i++)
    {
        if (lst_up[i] == t)
            cout << cur[i] << " ";
        else
            cout << a[i] << " ";
    }
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

# E - The Robotic Rush

> 关键词：二分，思维，预处理

## 思路

所有机器人都是一起移动的，这意味着机器人和地刺之间的相对初始距离始终不变。

我们考虑计算全局位移的历史最远记录。对于任意一个机器人，它只会被距离它两侧最近的地刺扎死：

1. 如果左边最近的地刺距离它是 `pre`，那么只要全局向左的位移首次达到 `pre`，这个机器人就会死。

2. 如果右边最近的地刺距离它是 `suf`，那么只要全局向右的位移首次达到 `suf`，它也会死。

我们预处理出首次到达特定位移的时间，也就是记录首次到达向左/向右的某个位移时是在第几条指令（从 $1$ 开始）

1. `cur` 记录的是：当前的累积偏移量。

2. `L[x]` 记录的是：全局**第一次**向左偏移达到 `x` 单位长度时，是在第几步（`i + 1`）。

3. `R[x]` 记录的是：全局**第一次**向右偏移达到 `x` 单位长度时，是在第几步。

对于第 `i` 个机器人（初始坐标 `a[i]`），使用二分查找 `lower_bound` 在排序好的地刺数组 `b` 中找到它的位置。

**假如距离大于 $K$，说明在 $K$ 次操作内不可能碰到，设置成 $K+1$ 防止数组越界。**

设 `pre` 是它到左侧最近地刺的距离，`suf` 是它到右侧最近地刺的距离。直接查表，机器人碰到左地刺的时间是 `L[pre]`，碰到右地刺的时间是 `R[suf]`，它的死亡时间就是二者的最小值。

我们再维护一个统计死亡信息的数组，记录在第 $i$ 步刚好死掉的机器人的数量。

初始存活人数为 `n`。随着步数 `i` 从 1 推进到 `k`，每次减去在这一步刚好死掉的机器人数量 `cnt[i]`，并输出即可。

## Code

```c++
// Problem: CF 2185 E
// Contest: Codeforces - Codeforces Round 1074 (Div. 4)
// URL: https://codeforces.com/contest/2185/problem/E
// Time: 2026-05-08 14:42:04
// 预处理出向左和向右移动每个特定距离的“首次到达时间”
// 然后直接计算出每个机器人的确切死亡时刻
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
    int n, m, k;
    cin >> n >> m >> k;

    vector<int> a(n), b(m);

    for (int i = 0; i < n; i++)
        cin >> a[i];
    for (int i = 0; i < m; i++)
        cin >> b[i];

    sort(all(b));

    string s;
    cin >> s;

    // 记录首次到达向左/向右某一位移时，是在第几条指令（从1开始）
    vector<int> L(k + 2, inf), R(k + 2, inf);
    int cur = 0; // 记录当前绝对位移

    for (int i = 0; i < k; i++)
    {
        if (s[i] == 'L')
            cur--;
        else
            cur++;

        if (cur < 0 && L[-cur] == inf)
            L[-cur] = i + 1;
        if (cur > 0 && R[cur] == inf)
            R[cur] = i + 1;
    }

    // cnt[i] 表示在第 i 步死亡的机器人数量
    vector<int> cnt(k + 2, 0);

    for (int i = 0; i < n; i++)
    {
        auto it = lower_bound(all(b), a[i]);

        // 找左侧和右侧最近的地刺距离，找不到或者距离超过k则设为 k + 1
        int pre = (it == b.begin()) ? k + 1 : (a[i] - *prev(it));
        int suf = (it == b.end()) ? k + 1 : (*it - a[i]);

        if (pre > k)
            pre = k + 1;
        if (suf > k)
            suf = k + 1;

        int death = min(L[pre], R[suf]);
        if (death != inf)
            cnt[death]++;
    }

    int res = n;
    for (int i = 1; i <= k; i++)
    {
        res -= cnt[i];
        cout << res << " ";
    }
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

