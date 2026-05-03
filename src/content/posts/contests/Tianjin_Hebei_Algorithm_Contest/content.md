---
title: 第一届津冀九校
published: 2026-04-26
description: "第一届津冀联合高校大学生程序设计竞赛"
image: "https://img.hailuo4ever.com/cover/cry.png"
tags: [算法题解, 线下练习赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：
> [https://ac.nowcoder.com/acm/contest/134059](https://ac.nowcoder.com/acm/contest/134059)

> [!TIP]
> 难度预估表 by Liang_SYEA：
> ![](https://img.hailuo4ever.com/Jinji_Contest/difficulties.png)

# D - 铁银银铜金铜银银铁

> 题目关键词：签到、STL

## 思路

> 自己赛时唯一做出来的一道题，八分钟签到，然后后面四小时五十二分钟一道题都不会，唉唉...

和今年蓝桥杯的题面一样，任意一个子串都是回文串，当且仅当所有字符都相同。

所以我们遍历给定字符串，统计所有字母出现的次数，用总长度减去这个出现最多的字母即可。

## Code

```cpp
// Problem: 铁银银铜金铜银银铁
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134059/D
// Time: 2026-04-26 16:36:10
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    string s;

    map<char, int> mp;

    cin >> n >> s;

    for (auto c: s)
        mp[c]++;

    int mx = -1;
    for (auto &[ch, val]: mp)
        mx = max(val, mx);

    cout << (int) s.size() - mx << endl;
}

int main()
{
    int T;
    cin >> T;

    while (T--)
        solve();

    return 0;
}
```

# E - 树树菌的星形共振

> 题目关键词：思维，贪心，DFS

## 思路

> 赛时并没有开这道题，其实这道题也不是特别难，但是在那种环境下别说考虑异或了，连五芒星都想不到，还是缺乏开题策略了。

### Step1 - 转化题意

#### 类五芒星

将剩下的 $k$ 个节点排成环，且 $i$ 与 $(i+2) \bmod k$ 连边，最终必须是一个连通块。

按步长 $2$ 在大小为 $k$ 的环上跳跃，要能遍历所有节点（即形成单一连通块），其充要条件是 $\gcd(2, k) = 1$，这意味着$k$**必须是一个奇数**

**因此，最终保留的节点数 **$k$** 必须是奇数。**

#### 共振频率

假设经过若干次合并，我们最终把树划分成了 $k$ 个连通块（每个块缩成一个新节点），且每个新节点的发光频率（即该块内原节点的异或和）都等于同一个值 $X$。

- 根据异或运算的性质，这 $k$ 个节点的总异或和，必然等于原树所有 $n$ 个节点的总异或和 $S$。
- 所以有：$S = X \oplus X \oplus \dots \oplus X$ （共 $k$ 个 $X$）。
- 由于 $k$ 是奇数，奇数个 $X$ 异或的结果就是 $X$ 本身！
- **所以有以下结论**：**同频共振的目标频率 **$X$**，永远严格等于整棵树初始的全局异或和 $S$**

### Step2 - 贪心 DFS

我们要把树切分成尽可能多的子树，使得每棵子树的异或和都等于 $S$。（因为切的块数 $k$ 越多，合并操作数 $n - k$ 就越少）。

我们可以从叶子节点往上做后序遍历：

- 用 `cur` 记录当前子树的异或和。
- 一旦发现 `cur == S`，我们就贪心地将这棵子树“剪下”，计数器 `cnt++`，然后向父节点返回 `0`（表示这部分已经被切走，对上方的异或和不再有影响）。

### Step3 - 分类讨论结果

1. **情况 A：**$S \neq 0$
   - 如果全局异或和不为 $0$，根据数学逻辑，此时通过上述 DFS 切出来的块数 `cnt` **必定是奇数**！（证明：总和是 $S$，所有切下来的块和也是 $S$。如果切了偶数块，它们的总和会变成 $0$，导致根节点剩余必然是 $S$ 从而再切一块，因此必定是奇数块）。
   - 直接满足要求，最少操作数 = $n - cnt$。

2. **情况 B：**$S = 0$
   - 如果全局异或和是 $0$，说明我们要找的共振频率就是 $0$。
   - DFS 切出的 `cnt` 可能是偶数也可能是奇数。
   - 如果 `cnt` 是奇数，满足条件，答案是 $n - cnt$。
   - 如果 `cnt` 是偶数，因为我们必须保留奇数个节点，只需随便挑两个相邻的 $0$ 节点合并一下（$0 \oplus 0 = 0$），节点数就变成了 $cnt - 1$（奇数）。所以答案是 $n - (cnt - 1)$。

## Code

```cpp
// Problem: 树树菌的星形共振
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134059/E
// Time: 2026-04-26 22:54:07
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);
    int S = 0; // 全局异或和
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        S ^= a[i];
    }

    vector<vector<int>> adj(n + 1);
    for (int i = 1; i < n; i++)
    {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    int cnt = 0;

    auto dfs = [&](auto &self, int u, int p) -> int
    {
        int cur = a[u];
        for (auto v: adj[u])
        {
            if (v == p)
                continue;
            cur ^= self(self, v, u);
        }

        if (cur == S)
        {
            cnt++;
            return 0;
        }

        return cur;
    };

    dfs(dfs, 1, 0);

    if (S != 0)
        cout << n - cnt << endl;
    else
    {
        int k = (cnt % 2 == 1) ? cnt : (cnt - 1);
        cout << n - k << endl;
    }
}

int main()
{
    int T;
    cin >> T;
    while (T--)
        solve();
    return 0;
}
```

# G - 不协和音程

> 题目关键词：思维，STL，数据结构

## 思路

> 赛时思路是对每次询问做 `bfs`，然后发现在空间的时候就被卡了...，而且 `bfs` 的复杂度绝对过不去...
> 哎，还是缺乏注意力了。

### Step1 - 转化题目要求

我们注意到题目要求：从 `(1, 1)` 走到 `(n, m)`，每次只能**向下**或**向右**移动。这意味着在任意合法的路径上，经过的坐标 $(x_1, y_1), (x_2, y_2), \dots$ 不管是横坐标还是纵坐标，都必须是单调不降的。

因此，对于一条路径上的任意两个点，不会出现一个点在另一个点的左下角的情况。

设整个矩阵中所有音高为 `v` 的点构成一个集合$S_v$，如果我们把集合中所有点的坐标按 `x` 递增地排序，那么排序后的 `y` 坐标也必须是单调不降的。也就是说，假设$x_{a} \ge x_{b}$，但$y_{a} < y_{b}$，这两个点一定不能被同一条合法路径同时经过。

### Step2 - 动态维护集合

显然不能在每次查询时都重新遍历集合。

根据上面的推导，有以下的结论：如果在一个有序集合中，存在任意一对点破坏了纵坐标单调不降的规则，那么必然至少存在一对“相邻”的点破坏了规则。

> 上述结论的思考可以用反证法，假设所有相邻的点对都满足规则，显然整体一定是单调不降的。

因此，我们需要为每一种音高值 `v` 维护两个东西：

1. 一个 `set<pair<int, int>>`，用来存储所有音高为 `v` 的坐标（自动按 $x$ 优先、$y$ 其次排序）。
2. 一个计数器 `bad_count[v]`，用来记录在 `v` 的集合中，有多少对**相邻的元素**构成了“前一个的 $y$ 大于后一个的 $y$”的非法情况。

那么两种操作的思路如下：

1. **查询**：只要 `bad_count[x] == 0`，就说明没有任何非法相邻对，直接输出 `YES`；否则输出 `NO`。
2. **修改**：将点从旧音高集合中删除，并加入新音高集合。在此过程中，只有插入/删除位置的**前驱节点**和**后继节点**的相邻关系会被打破或重建。我们只需在 $O(\log K)$ 的时间内局部更新 `bad_count` 即可。

> [!TIP]
> 注意：直接开定长数组会爆空间，要用 `vector<vector<int>>`

## Code

```cpp
// Problem: 不协和音程
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134059/G
// Time: 2026-04-26 17:24:00
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 2e5 + 5;

set<pii> s[N];
int bad_count[N];

// 从音高v的集合中移除一个点(x, y)
void remove(int v, int x, int y)
{
    auto it = s[v].find({x, y});
    if (it == s[v].end())
        return;

    auto prev_it = it, next_it = it;
    bool has_prev = (it != s[v].begin());
    if (has_prev)
        prev_it--;

    next_it++;
    bool has_next = (next_it != s[v].end());

    // 如果和前驱构成了非法对，移除当前点后非法计数减少
    if (has_prev && prev_it->second > it->second)
        bad_count[v]--;

    // 如果和后继构成了非法对，移除当前点后非法计数减少
    if (has_next && it->second > next_it->second)
        bad_count[v]--;

    // 移除当前点后，前驱和后继变成了相邻关系，检查是否构成新的非法对
    if (has_prev && has_next && prev_it->second > next_it->second)
        bad_count[v]++;

    s[v].erase(it);
}

// 向音高v的集合中加入一个点(x, y)
void add(int v, int x, int y)
{
    auto result = s[v].insert({x, y});
    // 注意insert函数的返回值为std::pair<iterator, bool>

    auto it = result.first;
    auto prev_it = it, next_it = it;

    bool has_prev = (it != s[v].begin()); // 找前驱
    if (has_prev)
        prev_it--;

    next_it++;
    bool has_next = (next_it != s[v].end()); // 找后继

    // 加入当前点前，前驱和后继是相邻关系
    // 被当前点隔开后，如果之前的非法，就撤销之前的检查结果
    if (has_prev && has_next && prev_it->second > next_it->second)
        bad_count[v]--;

    // 检查插入新元素后，新元素和前驱是否非法
    if (has_prev && prev_it->second > it->second)
        bad_count[v]++;

    // 检查插入新元素后，新元素和后继是否非法
    if (has_next && it->second > next_it->second)
        bad_count[v]++;
}

int main()
{
    int n, m;
    cin >> n >> m;

    vector<vector<int>> g(n + 1, vector<int>(m + 1));

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            int v;
            cin >> v;
            g[i][j] = v;
            add(v, i, j);
        }
    }

    int q;
    cin >> q;

    while (q--)
    {
        int op;
        cin >> op;

        if (op == 1)
        {
            int x, y, v;
            cin >> x >> y >> v;

            int prev_v = g[x][y];
            if (prev_v != v)
            {
                remove(prev_v, x, y);
                add(v, x, y);
                g[x][y] = v;
            }
        }
        else
        {
            int x;
            cin >> x;
            if (bad_count[x] == 0)
                cout << "YES" << endl;
            else
                cout << "NO" << endl;
        }
    }
}
```

# I - Yet Another Patchouli's Magical Problem

> 题目关键词：思维，构造

## 思路

> 赛时思路非常混乱，我考虑的是蛇形填进来，但是怎么调都不对，想了两个多小时无果 qwq
>
> 注意：样例有一定的迷惑性，务必自行判断！

在把二维网格变成一维序列的过程中，当我们放完某几个节点后，序列可以看作被切成两半：**已放置的节点集合 $S$ 和 未放置的节点集合 $V \setminus S$**。 所谓的“间隔负载”，就是计算此时此刻，有多少条边连接着 $S$ 和 $V \setminus S$。

我们考虑按照朴素的按行遍历来排列节点来计算负载：

假设已经放完了第$i-1$行，现在正在放第$i$行，且恰好放到了第 $j$ 列的节点 $(i, j)$。

考虑跨越当前这个间隔的边，有三种情况：

1. 向下的纵向边：从第 $i$ 行已放置的节点 $(i, 1) \dots (i, j)$ 连向它们正下方的第 $i+1$ 行。这里有 $j$ 条边。
2. 上一行剩余的向下的纵向边：从第 $i-1$ 行**尚未被覆盖下方节点**的位置连向第 $i$ 行。也就是列数从 $j+1$ 到 $m$ 的位置。这里有 $m-j$ 条边。
3. 向右的横向边：当前刚放下的节点 $(i, j)$ 连向下一个即将放置的节点 $(i, j+1)$。这里有 $1$ 条边。

> [!TIP]
> 将三种情况相加，有$j + (m - j) + 1 = m + 1$，也就是说，在逐行放置的过程中，只要处于网格的内部，任何一个间隔的负载恰好等于 $m + 1$

题目要求最大负载 $C \le \min(n,m)+1$。

根据刚才的推导：

- 如果我们**逐行放置**，最大负载是 $m + 1$。当 $m \le n$ 时，满足要求
- 如果我们**逐列放置**，最大负载就是 $n + 1$。当 $n < m$ 时，满足要求

## Code

```cpp
// Problem: Yet Another Patchouli's Magical Problem
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134059/I
// Time: 2026-04-26 16:37:26
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

int n, m;

int main()
{
    cin >> n >> m;

    if (m <= n)
    {
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                cout << i << " " << j << endl;
    }
    else
    {
        for (int j = 1; j <= m; j++)
            for (int i = 1; i <= n; i++)
                cout << i << " " << j << endl;
    }
    return 0;
}
```

# J - The Eschatology of 0 and 1

> 题目关键词：贪心，线性 DP

## 思路

> 赛时只是有感觉这可能是个 DP，不过也没开就是了...

### Step1 - 转化题意

假设当前我们确定的目标字符是 `T`，对于原串当中的每一个字符，它要么是正确的（已经等于 `T`），要么是错误的，在这个想法上，我们做题目中的两种操作：

1. **操作 1 (单点修改)**：翻转一个字符的代价是 `a`。
2. **操作 2 (区间修改)**：翻转一个长度为 `L` 的区间的代价是 `k * L + b`。这相当于进行一次区间翻转需要固定花费 `b`，然后区间内每一个字符都要花费代价 `k`。

现在我们考虑，假设原串中有两个错误字符构成的块，中间隔着一段正确的字符（比如 `错 错 对 对 错 错`）。我们有两个选择：

1. 不合并（执行两次独立的操作 2）：分别翻转两端的错误块，中间的正确字符不受影响。代价是两次的 `b`，加上错误字符数量乘以 `k`。
2. 合并（执行一次很大的操作 2，然后再修正中间的正确字符）：用一次操作 2 把整个区间全翻了，省下了一次 `b`。但这会导致中间的正确字符被翻成了错误字符。我们考虑如何将这些错误字符再翻回来：
   - 如果用操作 1 翻回来，每个字符的代价是 `a`。那么这些中间字符被这次大操作覆盖的总代价是：`k` (被操作 2 覆盖) + `a` (被操作 1 修正) = `k + a`。
   - 如果用操作 2 翻回来，相当于在内部嵌套了一个新的区间翻转。<u>因为 </u><u>k >= 0</u><u>，嵌套区间操作的额外代价（增加的 </u><u>k \* L</u><u> 和新的 </u><u>b</u><u>）</u>**永远大于或等于**<u>直接把大区间断开成两个小区间。</u>

根据上面的推导，对于任何一个字符，只有三种最优命运：

1. 它是正确的，且不在操作 2 的区间内。代价：`0`。
2. 它是错误的，且在操作 2 的区间内被顺手翻正。代价：`k`。
3. 它被操作 1 单独翻转。代价：`a`。
   - 如果一个**正确的字符**被包含在了一个大区间内（为了省 `b` 而强行合并区间），它必须由操作 1 翻回来，它的总代价就是 `k + a`。

### Step2 - DP

我们只需要从左到右遍历字符串，每一个字符只面临一个选择：**它是否被包含在一个连续的“操作 2 区间”内部？**

**状态表示：**

我们可以定义两个状态，代表到达第 `i` 个字符时的最小代价：

- `dp0`: 当前字符**不在**操作 2 区间内。
- `dp1`: 当前字符**在**操作 2 区间内。

**状态转移：**

假设当前考虑的目标字符是 `T`。

当前字符的验证结果为 `correct = (s[i] == T)`。

1. 如果在区间外 (`dp0`)：
   - 所需代价 `cost_out`：如果 `correct`，不需要翻转，代价为 0；如果错误，必须用操作 1 翻转，代价为 `a`。
   - 它可以从上一个不在区间内的状态 (`dp0`) 继续保持，也可以从上一个区间内的状态 (`dp1`) 结束区间转移过来。
     转移方程：$new\_dp0 = \min(dp0, dp1) + cost\_out$

2. 如果在区间内 (`dp1`)：
   - 所需代价 `cost_in`：如果错误，被区间顺手翻正，代价为 `k`；如果 `correct`，被区间搞坏了必须用操作 1 补救，代价为 `k + a`。
   - 它可以从上一个区间内的状态 (`dp1`) 延续过来，也可以从上一个不在区间内的状态 (`dp0`) **新开启一个区间**转移过来（新开启需要额外支付固定代价 `b`）。
     转移方程：$new\_dp1 = \min(dp0 + b, dp1) + cost\_in$

因为目标是将整个二进制串变为全 `0` 或全 `1`，我们分别计算两种情况的代价并取 `min`。

## Code

```cpp
// Problem: The Eschatology of 0 and 1
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/134059/J
// Time: 2026-04-26 18:41:45
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const ll inf = 2e18;
const int N = 0;

ll sol(string &s, char target_char, ll a, ll b, ll k)
{
    ll dp0 = 0, dp1 = inf;

    for (char c: s)
    {
        bool correct = (c == target_char);

        ll cost_out = correct ? 0 : a;
        ll cost_in = correct ? (k + a) : k;

        // 状态转移
        ll next_dp0 = min(dp0, dp1);
        if (next_dp0 != inf)
            next_dp0 += cost_out;

        ll next_dp1 = min(dp0 != inf ? dp0 + b : inf, dp1);
        if (next_dp1 != inf)
            next_dp1 += cost_in;

        dp0 = next_dp0;
        dp1 = next_dp1;
    }

    // 字符串遍历结束，无论是区间刚好结束(dp0)还是刚好切断(dp1)，取两者最优即可
    return min(dp0, dp1);
}

void solve()
{
    ll n, a, b, k;
    cin >> n >> a >> b >> k;

    string s;
    cin >> s;

    ll res0 = sol(s, '0', a, b, k);
    ll res1 = sol(s, '1', a, b, k);

    cout << min(res0, res1) << endl;
}

int main()
{
    int T;
    cin >> T;

    while (T--)
        solve();

    return 0;
}
```
