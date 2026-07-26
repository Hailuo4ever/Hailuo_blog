---
title: 2026 杭电多校2
published: 2026-07-23
description: "HDU Multi-University Training Contest 2"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营2](https://acm.hdu.edu.cn/contest/problems?cid=1230)

# 1008 - 最遥远的距离

> 关键词：构造，树上问题

## 思路

给定每个景点 $i$ 的探索度 $d_i$，要求构造一棵树，使得从景点 $i$ 出发，不重复经过景点时，最多能够访问 $d_i$ 个不同景点。

### 基础概念

1. 距离：设树上两点为 $u, v$，他们之间的距离 $dist(u,v)$ 定义为简单路径所经过的边数。
2. 离心率：对于一个固定节点 $u$，它的离心率定义为 $\operatorname{ecc}(u)=\max_{v\in V}\operatorname{dist}(u,v)$。也就是从节点 $u$ 出发，到整棵树中最远节点的距离。注意离心率的主体是某个节点，不同节点的离心率可能不相同。**题目给定的序列就是每个点的离心率 $+1$**。
3. 半径：取每个节点离心率的最小值，即 $R=\min_{u\in V}\operatorname{ecc}(u)$。选择一个最合适的节点作为中心，使它到最远节点的距离尽可能小，这个最小的最远距离就是树的半径。
4. 直径：树上任意两点之间的最大距离。可以表示为 $D=\max_{u,v\in V}\operatorname{dist}(u,v)$。也可以用离心率表示：$D=\max_{u\in V}\operatorname{ecc}(u)$，表示每个节点离心率的最大值。
5. 中心：树的中心定义为离心率与半径相等的节点。中心有一个重要性质：**一棵树的中心只可能有一个节点，或者两个相邻节点**。

**直径与半径的关系：若直径为偶数，则半径为 $R=\frac d2$，若直径为奇数则半径为 $R=\frac {d+1}2$。写在一起有：$R=\left\lceil\frac d2\right\rceil$**。

### 无解判定

根据以上分析，设给定序列的最小值为 $mn$，最大值为 $mx$，有 $r=mn-1$，$D=mx-1$。代入得 $mn-1=\left\lceil\frac{mx-1}{2}\right\rceil$。

直径只可能有两种情况。当直径长度为偶数时，$D=2r$，$mx-1=2(mn-1)$，即 $mx=2mn-1$。偶数长度的直径只有一个中心点，因此探索度为 $mn$ 的点必须恰好有一个，对于每个 $x\in[mn+1,mx]$，探索度为 $x$ 的点至少有两个。

当直径长度为奇数时，$D=2r-1$，$mx-1=2(mn-1)-1$，即 $mx=2mn-2$。奇数长度的直径有两个相邻中心点，因此探索度为 $mn$ 的点必须恰好有两个，对于每个 $x\in[mn+1,mx]$，探索度为 $x$ 的点至少有两个。

观察一条直径，假设直径边数为 $D$，从一个端点走向另一个端点，直径上的离心率会呈现如下变化：

```c++
偶数直径：D, D-1, ..., r+1, r, r+1, ..., D-1, D
奇数直径：D, D-1, ..., r+1, r, r, r+1, ..., D-1, D

非中心层一定有两个点（距离要相同）
奇数直径有一个中心，偶数直径有两个中心
```

因此可以判定无解条件：

一个中心点的情况，满足 $mx=2mn-1$ 时，需要满足 $cnt[mn]=1$，并对所有 $x\in[mn+1,mx]$，都有 $cnt[x]\ge 2$。

两个中心点的情况，满足 $mx=2mn-2$ 时，需要满足 $cnt[mn]=2$，并对所有 $x\in[mn+1,mx]$，都有 $cnt[x]\ge 2$。

### 构造方法

对每个探索度 $x$，记录拥有该探索度的点。对于每个 $x>mn$，取两个点 $L[x]$，$R[x]$，把他们分别连成左右两条链。

单中心：令唯一的最小探索度节点为中心，即 $L[mn]=R[mn]=center$，然后连接 $L[x-1]\leftrightarrow L[x]$，$R[x-1]\leftrightarrow R[x]$。

双中心：取两个最小探索度节点 $L[mn],R[mn]$，先连接 $L[mn]\leftrightarrow R[mn]$，同样向两边延伸。

考虑多余节点如何处理，有两个已经放在直径骨架上，其余节点全部挂到 $L[x-1]$，作为叶子。这样探索度相同。

```c++
                 extra
                   |           
L[x-1] ----------- L[x]
   |
 extra
```

## Code

```c++
// Problem: 最遥远的距离
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1230&pid=1008
// Time: 2026-07-26 12:08:07
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    int n;
    cin >> n;

    vector<vector<int>> pos(n + 1);
    int mn = inf, mx = -inf;

    for (int i = 1; i <= n; i++)
    {
        int d;
        cin >> d;

        pos[d].eb(i);
        mn = min(mn, d), mx = max(mx, d);
    }

    bool ok = true;
    if (mx != 2 * mn - 1 && mx != 2 * mn - 2)
        ok = false;

    if (ok)
    {
        if (mx == 2 * mn - 1) // center = 1
        {
            if (pos[mn].size() != 1)
                ok = false;
        }
        else // center = 2
        {
            if (pos[mn].size() != 2)
                ok = false;
        }

        for (int x = mn + 1; x <= mx; x++)
            if (pos[x].size() < 2)
                ok = false;
    }

    if (!ok)
    {
        cout << "No" << endl;
        return;
    }

    vector<pii> res;
    vector<int> L(n + 1), R(n + 1);

    if (mx == 2 * mn - 1)
        L[mn] = pos[mn][0], R[mn] = pos[mn][0];
    else
    {
        L[mn] = pos[mn][0], R[mn] = pos[mn][1];
        res.eb(L[mn], R[mn]);
    }

    for (int x = mn + 1; x <= mx; x++)
    {
        L[x] = pos[x][0], R[x] = pos[x][1];
        res.eb(L[x - 1], L[x]), res.eb(R[x - 1], R[x]);

        for (int j = 2; j < (int) pos[x].size(); j++)
            res.eb(L[x - 1], pos[x][j]);
    }

    cout << "Yes" << endl;
    for (auto [u, v]: res)
        cout << u << ' ' << v << endl;
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

# 1010 - 幻灵战队 2

> 关键词：思维

## 思路

考虑如何计算一段连续 $0$ 的贡献，这一段每场获得的科技点依次为 $25,30,35,\ldots,20+5L$，总贡献为：$\begin{aligned}
F(L)
&=\sum_{x=1}^{L}(20+5x)\\
&=20L+5\sum_{x=1}^{L}x\\
&=20L+5\cdot\frac{L(L+1)}2
\end{aligned}$。

注意到长为 $L$ 的连续零段中，全零子串的数量为 $\frac{L(L+1)}2$。因此一段 $0$ 的贡献可以写成：$F(L)=20L+5\times\text{全零子串数量}$。

综上，把一个 $0$ 改成 $1$ 可能会导致两种结果：$0$ 的总数减少 $1$，减少 $20$ 点贡献；原来的连续零段被切开，全零子串的数量减少。不管怎么改，科技点都会减少，因此最终使用的修改次数为 $k$ 和 $0$ 的个数取最小值。

考虑一个连续的长度为 $L$ 的 $0$ 段。在其中修改 $c$ 个 $0$ 为 $1$，最多会将剩余的 $0$ 分成 $c+1$ 段。直觉上需要尽量平均分配，事实上也确实是这样的。这部分可以用数学严格证明，但目前还没有看懂。

> $f$ 是离散凸函数，总长度固定时，应该让各段长度尽量接近。

考虑如何给一个段来分段。修改了 $cnt$ 个 $0$ 后，剩余 $rem=len-cnt$ 个 $0$。这些新产生的 $1$，可以把原来的零段分成 $cnt+1$ 段，这里允许某些段长度为 $0$。

剩余 $rem$ 个零，要分成 $cnt+1$ 段。令 $x=\left\lfloor\frac{rem}{cnt+1}\right\rfloor$，$y=rem\bmod(cnt+1)$，最均匀的分法即为 y 段长度为 $x+1$，$cnt+1-y$ 段长度为 $x$。总贡献为 $cal(len,cnt)
=
(cnt+1-y)f(x)+yf(x+1)$。

考虑如何把 $k$ 次操作均匀分配到多个段上。这里需要考虑一次操作能减少多少科技点，不难想到对于一段长度为 $len$ 的零，已经修改了 $t$ 次的前提下，继续修改带来的收益是不增的。例如，第一段的操作收益为 $65,35,25,\ldots$，第二段的操作收益为 $50,30,25,\ldots$ 这样。

因此可以枚举所有的收益情况，放进数组或大根堆里，贪心取前 $k$ 大即可。

## Code

```c++
// Problem: 幻灵战队 2
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1230&pid=1010
// Time: 2026-07-26 20:21:13
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    ll n, k;
    cin >> n >> k;

    string s;
    cin >> s;

    auto f = [&](ll x) -> ll { return 20 * x + 5 * x * (x + 1) / 2; };

    auto calc = [&](ll len, ll cnt) -> ll
    {
        int rem = len - cnt;
        int x = rem / (cnt + 1), y = rem % (cnt + 1);

        return f(x) * (cnt + 1 - y) + f(x + 1) * y;
    };

    vector<ll> a;
    ll res = 0;

    for (int i = 0; i < n; i++)
    {
        if (s[i] == '1')
            continue;

        int j = i;
        while (j < n && s[j] == s[i])
            j++;

        ll len = j - i;
        res += calc(len, 0);

        for (ll t = 0; t < len; t++)
            a.eb(calc(len, t) - calc(len, t + 1));

        i = j - 1;
    }

    sort(all(a), greater<ll>());

    ll sz = a.size();
    for (int i = 0; i < min(sz, k); i++)
        res -= a[i];

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

# 1011 - 键盘杀手

> 关键词：DP

## 思路

赛时开始想的是，$dp[i][0]$ 表示已经处理完前面的 $i-1$ 个位置，但不删 $i$ 的最小代价，$dp[i][1]$ 表示删 $i$ 的最小代价。

但这样是不对的，注意到每个位置的代价是由左右位置决定的，我们考虑新的状态定义。

定义状态 $dp[i][0]$ 表示已经确定了前 $i$ 个位置，第 $i$ 个位置比第 $i+1$ 个位置先拔的最小代价。$dp[i][1]$ 为后拔的最小代价。

状态转移见图。

## Code

```c++
// Problem: 键盘杀手
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1230&pid=1011
// Time: 2026-07-23 12:06:01
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
#define eb emplace_back
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

using st = array<ll, 2>;

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n + 2, 0);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    if (n == 1)
    {
        cout << 0 << endl;
        return;
    }

    vector<st> dp(n + 1, st{inf, inf});
    dp[1][0] = a[2], dp[1][1] = 0;

    for (int i = 2; i <= n; i++)
    {
        dp[i][0] = min(dp[i - 1][0] + a[i + 1], dp[i - 1][1] + max(a[i - 1], a[i + 1]));
        dp[i][1] = min(dp[i - 1][0], dp[i - 1][1] + a[i - 1]);
    }

    cout << min(dp[n][0], dp[n][1]) << endl;
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

