---
title: cf round 1103
status: editing
published: 2026-06-13
description: "Codeforces Round 1103 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1103.(Div. 3)](https://codeforces.com/contest/2236)

# A - Games on the Train

> 关键词：签到

## 思路

由于 $x_i \ge 1$，因此无论如何都要给原来的数 $+1$，因此答案为最大值减去最小值再加一。

## Code

```c++
// Problem: CF 2236 A
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/A
// Time: 2026-06-12 22:35:17
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
    for (auto &x: a)
        cin >> x;

    sort(all(a));
    cout << a[n - 1] - a[0] + 1 << endl;
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

# B - Tatar TV Show

> 关键词：模拟

## 思路

每次操作选择一个位置 $i$，同时翻转：$i, i + k$。

例如，当 $k=3$ 时：

- 位置 $1$ 可以与位置 $4$ 操作；
- 位置 $4$ 可以与位置 $7$ 操作；
- 位置 $2$ 可以与位置 $5$ 操作；
- 位置 $3$ 可以与位置 $6$ 操作。

因此，整个字符串实际上被拆分成了若干条互不相干的链：$1 \rightarrow 1+k \rightarrow 1+2k \rightarrow \cdots$

可以把它们想象成 $k$ 条互不连通的铁轨。一次操作只能在同一条铁轨上翻转两个相邻位置，无法跨越轨道传递影响。

对于从 $0$ 开始的下标，位置 $i$ 所属的链由 $i \bmod k$ 决定。**对于每条链，考察数字 $1$ 出现的奇偶性** 。

## Code

```c++
// Problem: CF 2236 B
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/B
// Time: 2026-06-12 22:35:18
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
    int n, k;
    cin >> n >> k;

    string s;
    cin >> s;

    vector<int> cnt(k, 0);

    for (int i = 0; i < n; i++)
    {
        if (s[i] == '1')
            cnt[i % k]++;
    }

    for (auto x: cnt)
    {
        if (x % 2 == 1)
        {
            cout << "NO" << endl;
            return;
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

# C - Omsk Programmers

> 关键词：数学

## 思路

首先不考虑使用除法，答案即为 $\lvert a - b \rvert$。假设当前 $a > b$，我们都有两种决策，一种是不使用除法，直接将 $b$ 增加到 $a$，一种是对较大的数 $a$ 继续使用除法，但这可能会显著缩小两个数的差距，也有可能增大。因此需要对每种 $a>b$ 的状态算答案并取最小。

任何方案都可以整理成如下标准形式：**先执行若干次除法，最后再执行若干次加法。**

## Code

```c++
// Problem: CF 2236 C
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/C
// Time: 2026-06-12 22:35:19
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
    ll a, b, x;
    cin >> a >> b >> x;

    ll cnt = 0, res = abs(a - b);

    while (a != b)
    {
        if (a < b)
            swap(a, b);

        a /= x, cnt++;
        res = min(res, cnt + abs(a - b));
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

# D - Brand New Tatar TV Show

> 关键词：博弈论

## 思路

根据题意，`Arseniy` 代替 `Dabir` 完成第一次删除。此后轮到 `Egor`。后续选择的数值必须满足 $0\le y-x\le k$，因此选择序列只能保持不变或逐渐增大，不能回头。

假设当前刚刚删除的元素为 $x$，我们总结一下游戏的规则：

1. 可以继续删除相同的数，因为 $y - x = 0$
2. 可以向更大的数跳跃，但跳跃距离不超过 $k$
3. 不能选择更小的数

我们首先考虑一种简单情况：假如所有的不同数值之间都无法跳跃怎么办？

例如 $k = 1$，数组为 `1 1 1 3 3 3 5 5 5`，一旦 `Arseniy` 第一次选择某个数值，后续玩家只能不断删除相同数值。其他数值全部无法到达。显然如果存在某个数值出现的次数为偶数时，`Arseniy` 就直接去拿这个数，`Egor` 总可以通过拿走最后一个而获胜。而如果所有数值出现的次数都是奇数，`Egor` 就没办法赢了。

由此有第一个结论，**如果不同数值之间无法跳跃，那么存在偶数次出现的数值时答案为 `YES`；所有数值均出现奇数次时答案为 `NO`。**

接下来我们**考虑可以跳跃的情况** 。假设排序并去重后的数组为：$b_1<b_2<\cdots<b_m$，如果存在相邻的两个不同数值满足：$b_i-b_{i-1}\le k$，那么玩家就可以从 $b_{i-1}$ 跳到 $b_i$。

考虑选择最大的下标 $i$，使得：$b_i-b_{i-1}\le k$。记：$u=b_{i-1},v=b_i$。

因为这一对已经是最靠右的可跳跃关系，所以从 $v$ 出发，不可能继续跳到任何更大的不同数值。

对于所有 $j>i$，都有：$b_j-b_{j-1}>k$，因此，一旦游戏来到 $v$，后续只能继续删除相同的 $v$。

对 $v$ 的奇偶性进行分类讨论，如果 $v$ 出现偶数次，`Arseniy` 直接删掉第一个 $v$，就能确保 `Egor` 取得最后一个元素；如果 $v$ 出现奇数次，`Arseniy` 可以删除 $v$ 的前一个数字 $u$​。由于 $v-u\le k$，`Egor` 可以跳到 $v$，删除一个 $v$。此时 `Dabir` 是必输的。

综上，唯一输出 `NO` 的情况是：

1. 任意两个相邻的不同数值之间，差值都大于 $k$；

2. 每一种数值的出现次数都是奇数。

## Code

```c++
// Problem: CF 2236 D
// Contest: Codeforces - Codeforces Round 1103 (Div. 3)
// URL: https://codeforces.com/contest/2236/problem/D
// Time: 2026-06-12 22:35:20
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
    int n, k;
    cin >> n >> k;

    map<int, int> mp;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        mp[a[i]]++;
    }

    sort(all(a));
    a.erase(unique(all(a)), a.end());

    bool flag1 = true;
    for (int i = 1; i < a.size(); i++)
    {
        if (a[i] - a[i - 1] <= k)
        {
            flag1 = false;
            break;
        }
    }

    bool flag2 = true;
    for (auto &[_, cnt]: mp)
        if (cnt % 2 == 0)
        {
            flag2 = false;
            break;
        }

    if (flag1 && flag2)
        cout << "NO" << endl;
    else
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

