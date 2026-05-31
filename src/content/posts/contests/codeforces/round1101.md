---
title: cf round 1101
published: 2026-05-30
description: "Codeforces Round 1101 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1101.(Div. 2)](https://codeforces.com/contest/2232)

# A - Convegence

> 关键词：思维

## 思路

一次通话可以同时处理目标位置两侧的两个人，考虑把集合地点选在数组中的中位数。

> 如果目标位置选为 `x`，定义：L = 位于 x 左侧的人数，R = 位于 x 右侧的人数，每次通话最多只能处理一名左侧人员，因此至少需要 `L` 次通话。同理，至少需要 `R` 次通话。
>
> 所以答案至少为 $max(L, R)$，为了让这个值尽可能小，需要让目标位置左右两侧的人数尽可能平衡。因此应当选择中位数。

令 $mid=a[n/2]$，最终要让所有人都移动到 $mid$，考虑严格小于 $mid$ 和严格大于 $mid$ 的人数，取二者最大值即可。

## Code

```c++
// Problem: CF 2232 A
// Contest: Codeforces - Codeforces Round 1101 (Div. 2)
// URL: https://codeforces.com/contest/2232/problem/A
// Time: 2026-05-30 22:35:30
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
    ll n;
    cin >> n;

    vector<ll> a(n);

    for (int i = 0; i < n; i++)
        cin >> a[i];

    sort(all(a));

    ll mid = a[n / 2];
    ll l = lower_bound(all(a), mid) - a.begin(), r = a.end() - upper_bound(all(a), mid);
    cout << max(l, r) << endl;
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

# B - Cake Leveling

> 关键词：思维，前缀约束

## 思路

对于每一个前缀 $a[1...i]$，求一个最大的整数高度 $h$，使得用高度为 $h$ 的刀从左向右扫过之后，前 $i$ 个位置的糖霜能够全部保持在同一高度。前方位置高于 $h$ 的部分会被推向下一个位置。

假设我们正在处理长度为 $i$ 的前缀：$a_1, a_2,\cdots, a_i$，记前缀和为 $S$，对于任意前 $k$ 个位置，它们至少需要有 $k \times h$ 个单位的糖霜。因此必须满足 $S \ge k \times h$，这个条件需要对所有前缀同时成立，也就是说，前 $i$ 个位置可以达到的最大高度为 $ans_i = \min\left(\left\lfloor \frac{S_1}{1} \right\rfloor, \left\lfloor \frac{S_2}{2} \right\rfloor, \ldots, \left\lfloor \frac{S_i}{i} \right\rfloor\right)$。每加入一个新元素，需要计算当前前缀的平均值向下取整，并维护历史最小值。

## Code

```c++
// Problem: CF 2232 B
// Contest: Codeforces - Codeforces Round 1101 (Div. 2)
// URL: https://codeforces.com/contest/2232/problem/B
// Time: 2026-05-30 22:48:22
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

    ll s = 0, res = 1e18;

    for (ll i = 1, x; i <= n; i++)
    {
        cin >> x;

        s += x;
        res = min(res, s / i);
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

# C - Seating Arrangement

> 关键词：反悔贪心

## 思路

题意简述：有 $n$ 个朋友，$x$ 张桌子，每张桌子 $s$ 个座位，有三种朋友：$I$ 必须坐在空桌，$E$ 必须坐在非空桌，$A$ 可以坐在任何桌。需要按顺序分配座位，可以拒绝某个朋友入座，希望最后留下的朋友尽可能多。

### 考虑如何表示不同状态的桌子

一共有 $m$ 张桌子，每张桌子有 $k$ 个座位。我们将已经坐过人的桌子称作“已启用桌子”。

假设当前启用了 $cntm$ 张桌子，那么这些桌子的总容量为 $cntm \times k$，如果当前已经入座 $sum$ 个人，那么仍然可以坐在非空桌上的人数为 $cntm \times k - sum$，因此要判断是否还有非空但还没坐满的桌子，只需要判断 $sum+1 \le cntm \times k$，不需要记录每张桌子分别坐了多少人。

### 考虑如何安排三类人

$I$:必须新开一张桌，只要满足 $cntm <m$ 就可以直接让他入座；如果所有桌子都已经启用，则当前的 $I$ 只能离开。

```c++
cntm++, sum++;
```

$E$：只能使用已有桌子的容量，如果 $sum+1 \le cntm \times k$，说明当前已启用的桌子里面还有空位，可以直接安排。否则说明所有已启用的桌子都已经坐满。此时 $E$ 不能开新桌，但可以借助 $A$。

```c++
sum++;
```

$A$：万能符，遇到一个 $A$ 时有两种选择，将 $A$ 当作 $I$ 意味着新开一张桌，将 $A$ 当作 $E$ 意味着坐在已有的非空桌。

> 我们不能看到 $A$ 就贪心地开新桌，原因如下：
>
> 考虑 $m=2,k=2$，队列为 $AAIE$ 的情况：如果两个 $A$ 优先坐了两张空桌，$I$ 没有位置，最后只能坐 $3$ 个人，但如果第二个 $A$ 坐在第一桌，就能让四个人都坐下。

因此对于 $A$，假如当前旧桌还有空位，优先让 $A$ 坐在旧桌；如果旧桌没位置再考虑让 $A$ 开一个新桌。

### 考虑反悔策略

考虑 $m=2,k=3$，队列为 $AAEE$ 的情况，按照刚刚的贪心策略，桌 $1$ 上有 $A, A, E$ 三个人，桌 $2$ 为空。

但我们重新解释第二个 $A$ 的选择，第二个 $A$ 当时并不是坐在桌 $1$，而是坐在桌 $2$，最后桌 $1$ 上有 $A, E, E$，桌 $2$ 上有 $A$，四个人全部入座。

> [!NOTE]
>
> 算法中的“反悔”不是让某个 $A$ 真的换座，而是：此前不要立即确定 $A$ 的具体座位。当未来出现冲突时，再选择一种更合适的历史解释。

考虑用一个变量 $cntA$ 表示当前还有多少个 $A$ 没有被固定为“开桌者”。这些 $A$ 暂时被视为坐在已有桌子上，但未来仍然可以反悔，将其中一个重新解释为坐在空桌。

```c++
cntA--, cntm++;
// 选一个之前出现的A，将它重新解释为开桌者，并新增一张非空桌，总容量增加k
```

