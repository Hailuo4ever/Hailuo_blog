---
title: 动态规划 (Notebook)
published: 2026-10-27
description: "Dynamic Programming"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algo_Notes"
draft: false
lang: ""
---

# 动态规划的理解

动态规划的核心不是数组或循环，而是两个性质：

1. 最优子结构：一个大问题的答案可以由很多小问题的答案推出
2. 重叠子问题：不同的大问题会依赖同一个小问题

DP要解决的问题就是把重复计算过的状态存下来。在数学本质上，它把一个问题拆成若干有依赖关系的子问题，并避免重复计算。
![](https://img.hailuo4ever.com/notebook_dp/1.png)

# 记忆化搜索

实际上，记忆化搜索是DP的一种实现方式，可以理解成DFS+缓存表。

它的思考方式是：我先不管状态的计算顺序，需要哪个状态，我就递归去算哪个状态，算过之后记下来，下次直接返回。

记忆化搜索更像：我要 `f(n)`，所以我去找 `f(n-1), f(n-2)`。从问题目标出发，考虑要得到当前状态的答案，需要哪些子状态。

递推 DP 更像：我已经知道 `f(0), f(1)`，所以我推出 `f(2), f(3)`。从状态转移顺序出发，考虑当前状态可以更新哪些后续状态。

当状态转移类似DFS时，例如树形DP，图上DP；或者状态顺序不好确定时，考虑使用记忆化搜索。

# 数位DP

> 数位DP主要解决这一类问题：统计某个很大的整数区间 $[L,R]$ 中，满足某种数位性质的整数有多少个，或者这些整数的某个权值之和。
>
> 大多数的数位DP题目都是**在数字的每一位上进行线性展开**的，类似从左往右的尝试。
>
> 数位DP的第一步是前缀和思想，不直接求 $[L,R]$，而是先定义 $F(x)$ 为 $[1,x]$ 中满足要求的数字个数，那么区间 $[L,R]$ 的答案即为 $F(R)-F(L-1)$。

## 思路

### 基本思想

> 首先认识按位 $DP$ 的思想。假设我们要统计 $0\sim527$ 中满足某种条件的数字。考虑从最高位构造一个三位数。
>
> 第一位可以填：$0,1,2,3,4,5$，如果第一位填 $3$，后面不管怎么填都 $<527$；如果第一位填 $5$，第二位最多就只能填 $2$，而如果第二位又填 $2$，第三位最多填 $0\sim7$。这就是数位DP模板中的 `limit` 的作用：找填写的数的上界。

我们**定义 `pos` 表示当前处理的是第几位，布尔变量 `limit` 表示当前已经填写的前缀，是否与上界 $x$ 的前缀完全相同**。

不难写出当前的上界为：`int up = limit ? digit[pos] : 9`。转移后 `bool nlimit = limit && (d == digit[pos])`。

考虑如何解决前导零的问题，我们**定义另一个布尔变量 `started` 表示当前这个数字是否已经开始**。例如 `00056` 的前三位 `started` 均为 `false`。 

再考虑我们要处理前面数位留下的信息，这就有了数位DP的模板状态。

### 状态设计

```c++
dfs(pos, state, limit, started)
```

| 参数      | 含义                   |
| --------- | ---------------------- |
| `pos`     | 当前处理第几位         |
| `state`   | 前面数位留下的信息     |
| `limit`   | 当前是否贴着上界       |
| `started` | 是否已经出现真正的数字 |

```c++
int up = limit ? digit[pos] : 9;
bool nlimit = limit && (d == digit[pos]);
```

需要根据题目设计的是 `state`。**我们需要知道为了判断最终数字是否合法，处理后面的数字时，需要记住前面的哪些信息**？

同样我们还需要记忆化搜索，搜过的答案就不用再搜了。一般记忆化只需要记录 `limit == false`，因为当 `limit == true` 时，还需要考察剩余的上界是什么，但如果 `limit == false`，后面的数可以随便填，此时答案只和其他三个参数有关。

```c++
if (!limit && dp[pos][state][started] != -1)
    return dp[pos][state][started];

if (!limit)
    dp[pos][state][started] = ans;
```

```c++
                solve(x)
                   │
             拆成每一位 digit
                   │
                   ▼
        dfs(pos, state, limit, started)
                   │
              枚举当前位 d
          ┌────────┴────────┐
          │                 │
     d < 上界当前位      d == 上界当前位
          │                 │
     limit = false       limit 保持 true
          │
          └────────┬────────┘
                   │
             更新 state
                   │
                pos + 1
                   │
                   ▼
                到末尾
                   │
              判断是否合法
```



# 树形DP

## 策略

1. 分析父树得到答案，需要子树的哪些信息
2. 把子树信息的全集定义成递归返回值
3. 通过递归让子树返回全集信息
4. 整合子树的全集信息，得到父树的全集信息并返回

```c++
void dfs(int u, int fa)
{
    // 这里是前序位置
    // 父节点信息传给当前节点

    for (int v : g[u])
    {
        if (v == fa)
            continue;

        // 递归前：父亲向孩子传信息
        dfs(v, u);
        // 递归后：孩子向父亲传信息
    }

    // 这里是后序位置
    // 汇总所有孩子的信息
}
```

## 题目

### Leetcode-968

[968. 监控二叉树 - 力扣（LeetCode）](https://leetcode.cn/problems/binary-tree-cameras/description/)

![](https://img.hailuo4ever.com/notebook_dp/2.jpg)

```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int minCameraCover(TreeNode* root) {
        int res = 0;
        auto dfs = [&](this auto&& dfs, TreeNode* node) -> int
        {
            if (node == nullptr)
                return 2;
            
            int l = dfs(node->left), r = dfs(node->right);
            if (l == 0 || r == 0)
            {
                res++;
                return 1;
            }

            if (l == 1 || r == 1)
                return 2;

            return 0;
        };

        if (dfs(root) == 0)
            res++;
        
        return res;
    }
};
```



# 换根DP

换根 DP（Rerooting DP）可以理解成：普通树形 DP 已经会求“固定根”的答案，而换根 DP 要高效求“每个点当根”时的答案。

核心的思想是：**根从父亲 $u$ 移到相邻儿子 $v$ 时，整棵树只有“$v$ 子树”和“$v$ 子树外”这两部分的关系发生了统一变化**。

遇到这类题目，一般先要知道父亲的全局答案，然后去掉儿子的旧贡献，加入父亲方向的新贡献，得到儿子的全局答案。

## 距离和模型

定义 $f[u]=\sum_{i=1}^{n} dist(u,i)$，也就是以 $u$ 为根时，所有节点的深度之和。

我们考虑根从 $u$ 换到 $v$ 会带来什么影响。假设 $v$ 是 $u$ 的儿子，以 $u$ 为根时，我们把整棵树分成两部分：$v$ 的子树，有 $sz[v]$ 个节点；$v$ 的子树以外的部分，有 $n-sz[v]$ 个节点。

考虑换根对距离和带来的影响，换根后容易发现，对于 $v$ 子树内部， $dist(v,x)=dist(u,x)-1$，因此 $v$ 子树中的每个节点距离都 $-1$，带来了 $-sz[v]$ 的贡献。而 $v$ 子树之外的部分有 $dist(v,x)=dist(u,x)+1$，带来了 $n-sz[v]$ 的贡献。因此得到换根公式：$\boxed{f[v]=f[u]+n-2sz[v]}$。

[R300582838 - 记录详情 - 洛谷](https://www.luogu.com.cn/record/300582838)

# 期望DP

普通 DP 通常考虑：从当前状态可以转移到哪些状态，如何取最大值、最小值，或者累加方案数。

期望 DP 考虑的是：**从当前状态开始，到达终止状态，平均还需要多少代价**。

## 思路

假设当前状态为 $u$，一次操作会转移到 $v_1,v_2,\ldots,v_k$，转移概率分别为 \(p_1,p_2,\ldots,p_k\)。如果每次操作的代价都是 $1$，就有 $\boxed{dp[u]=1+\sum_{i=1}^{k}p_i\,dp[v_i]}$​。无论这一步转移到哪里，我们都已经执行了一次操作，因此需要 \(+1\)。执行一次操作后，还要承担新状态的期望代价。因为新状态是随机的，所以要按照概率计算加权平均。

## 题目

### Atcoder DP I

由于盘子的编号不重要，我们定义 $dp[i][j][k]$ 表示从这个状态开始，直到吃完全部寿司所需要的期望操作次数。

$i$ 代表有多少个盘子剩下 $1$ 个寿司，$j$ 代表有多少个盘子剩下 $2$ 个寿司，$k$ 代表有多少个盘子剩下 $3$ 个寿司。剩下的 $n-i-j-k$ 个盘子都是空盘子。从当前状态 $(i,j,k)$ 出发，一次随机选择后会有四种情况。

$\begin{aligned}E={}&1\\&+\frac{i}{n}dp[i-1][j][k]\\&+\frac{j}{n}dp[i+1][j-1][k]\\&+\frac{k}{n}dp[i][j+1][k-1]\\&+\frac{n-i-j-k}{n}E\end{aligned}$

对于自环的部分，我们可以通过移项来解决，最终推导出 ${dp[i][j][k]=\frac{n+i\,dp[i-1][j][k]+j\,dp[i+1][j-1][k]+k\,dp[i][j+1][k-1]}{i+j+k}}$。

可以通过记忆化搜索来解决。

```c++
// Problem: AT DP J
// Contest: AtCoder - Educational DP Contest
// URL: https://atcoder.jp/contests/dp/tasks/dp_j
// Time: 2026-10-22 13:55:54
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
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
const int N = 310;
const ll INF = 4e18;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

ld dp[N][N][N];

void solve()
{
    int n;
    cin >> n;

    int c1 = 0, c2 = 0, c3 = 0;
    for (int i = 1, x; i <= n; i++)
    {
        cin >> x;
        if (x == 1)
            c1++;
        else if (x == 2)
            c2++;
        else
            c3++;
    }

    auto dfs = [&](this auto &&self, int i, int j, int k) -> ld
    {
        if (dp[i][j][k])
            return dp[i][j][k];

        if (i + j + k == 0)
            return 0;

        ld ret1 = 0, ret2 = 0, ret3 = 0;
        if (i)
            ret1 = self(i - 1, j, k);
        if (j)
            ret2 = self(i + 1, j - 1, k);
        if (k)
            ret3 = self(i, j + 1, k - 1);

        return dp[i][j][k] = (n + i * ret1 + j * ret2 + k * ret3) / (i + j + k);
    };

    ld res = dfs(c1, c2, c3);
    cout << fixed << setprecision(20) << res << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# SOSDP

>SOS DP（Sum Over Subsets DP，子集和 DP）是一种经典的状压 DP 优化技巧，主要用于快速计算每个集合的所有子集或超集的信息。
>
>一般来讲，SOSDP 的状态数组用零下标，因为二进制。

## 背景

假设有一个长度为 \(2^n\) 的数组 \(a\)，下标从 \(0\) 到 \(2^n-1\)。现在我们希望对于每个 `mask`，计算：$\displaystyle f[mask]=\sum_{sub\subseteq mask}a[sub]$。

这里的 $sub\subseteq mask$ 表示二进制意义上的子集，包括 `mask` 本身和空集。

例如，$n=3$，$mask=101$。$101$ 有四个子集，分别是 $000,001,100,101$，因此 $f[5]=a[0]+a[1]+a[4]+a[5]$。

**判断二进制子集的条件是 `(sub & mask) == sub`。**

暴力枚举的方法如下：

```c++
int S = 1 << n;
vector<ll> f(S);

for (int mask = 0; mask < S; mask++)
{
    for (int sub = mask; ; sub = (sub - 1) & mask)
    {
        f[mask] += a[sub];
        if (sub == 0) break;
    }
}
```

## 原理

SOSDP 的核心原理是：**逐位放宽限制**。仍然考虑 $f[mask]=\sum_{sub\subseteq mask}a[sub]$，我们不一次性枚举所有子集，而是从低位到高位，**逐个决定哪些二进制位允许从 $1$ 变成 $0$**。

首先我们定义 $dp_i[mask]$ 表示只允许 `mask` 的第 \(0\) 到第 \(i\) 位由 1 变为 0，其余高位必须保持不变时，所有能够得到的状态的 \(a\) 值之和。

初始时显然 $dp_{-1}[mask]=a[mask]$，现在考虑第 $i$ 位。如果第 $i$ 位是 $0$，直接继承上一轮的状态，即 $dp_i[mask]=dp_{i-1}[mask]$；如果第 $i$ 位是 $1$，所有合法子集可以分为互不相交的两组，第 $i$ 位保留 $1$ 贡献 $dp_{i-1}[mask]$，改成 $0$ 贡献 $dp_{i-1}[mask\oplus 2^i]$。

还可以优化掉第二维的 $i$，直接原地更新 `mask`。

```c++
// 初始 f[mask] = a[mask]

for (int i = 0; i < n; i++)
{
    for (int mask = 0; mask < (1 << n); mask++)
    {
        if (mask & (1 << i))
            f[mask] += f[mask ^ (1 << i)];
    }
}
```

> [!NOTE]
>
> 不能交换 $i$ 和 `mask` 两层循环，因为同一个 `mask` 在处理后面的位时，可能读到已经沿其他位更新过的状态，造成重复计数。
>
> **外层枚举二进制位，内层枚举 `mask`**。

## 子集与超集

对于子集 SOSDP，定义 $f[mask]=\sum_{sub\subseteq mask}a[sub]$，转移同上。

```c++
void sosSubset(vector<ll> &f, int n)
{
    int S = 1 << n;
    for (int i = 0; i < n; i++)
        for (int mask = 0; mask < S; mask++)
            if (mask >> i & 1)
                f[mask] += f[mask ^ (1 << i)];
}
```

对于超集 SOSDP，定义 $f[mask]=\sum_{sup\supseteq mask}a[sup]$，区别在于我们希望枚举所有包含 `mask` 的集合，对于超集，我们应该允许原本是 $0$ 的二进制位变成 $1$。所以要将原来的转移方向反过来。

```c++
void sosSuperset(vector<ll> &f, int n)
{
    int S = 1 << n;
    for (int i = 0; i < n; i++)
        for (int mask = 0; mask < S; mask++)
            if ((mask >> i & 1) == 0)
                f[mask] += f[mask | (1 << i)];
}
```

## 题目

### 2024 湖南省赛 E

> 给定长度为 \(n\) 的数组 \(a\)，满足：\(1\le n\le 10^6\)，\(1\le a_i\le 18\)。
>
> 我们可以选取两个互不重叠的连续子数组，并按原顺序拼接，要求最终每种数字最多出现一次。

容易想到用一个 $18$ 位的掩码表示状态。两个部分可以合并当且仅当 `S & T == 0`，合并后大小即为两个部分的 `popcount` 之和。但两个集合可以合并，不代表他们对应的子数组可以按要求拼接，因此我们还需要记录子数组的位置。

我们考虑**定义 $L[mask]$ 代表集合表示为 $mask$ 的合法子数组的最早结束位置，$R[mask]$ 代表集合表示为 $mask$ 的合法子数组的最晚开始位置**。如果某一个 $mask$ 无法通过一个合法的连续子数组得到，就让 $L[mask]=n+1$，$R[mask] = 0$。那么假设我们想选集合为 $S$ 的子数组作为第一段，$T$ 作为第二段，只需要满足 $L[S]<R[T]$。这样就代表存在不重叠的两段。

这两个信息可以通过直接枚举求得，固定右端点后向左枚举 $18$ 个位置，时间复杂度 $O(18n)$。

接下来，我们考虑枚举第一段集合 $S$，我们知道 $L[S]$ 表示第一段集合最早的结束位置，**我们需要找到在剩余数字中，长度尽可能大，且开始位置比 $L[S]$ 晚的连续子数组**。

显然第二段集合必须满足 $T\subseteq \overline S$，其中 $\overline S$ 是 $S$ 的补集。而肯定不能枚举 $\overline S$ 的所有子集里来寻找 $T$，此时我们考虑使用 $SOSDP$。

> [!NOTE]
>
> 但我们不能只定义一维的 $DP$ 数组，比如我们想找最靠右开始的子数组，可以只用 $dp[S]$。但最晚开始的子数组不一定是最长的。因此考虑往状态里加一维。

**定义 $dp[k][S]$ 表示：在所有 $S$ 的子集里，并且恰好包含 $k$ 种数字的合法连续子数组中，最晚能从什么位置开始**。使用子集的转移方式处理出 $dp$ 数组，之后直接查询并回答询问即可。

# 经典题

## 选择m个不相交区间，使区间和最大

### 状态设计

假设我们定义 $dp[i][j]$ 表示在前 $i$ 个数中选择最多 $j$ 个区间时，能够获得的最大区间和。

当处理 $a_i$ 时，存在两种截然不同的情况：

1. 将 $a_i$ 接在前一个区间的末尾；
2. 从 $a_i$ 开始创建一个新区间。

但是，仅仅知道 $dp[i-1][j]$，无法判断最后一个区间是否恰好延伸到了 $i-1$。

因此，需要增加一个状态，记录当前是否正在延伸区间。

考虑定义两个状态。

$f[i][j]$ 表示：只考虑前 $i$ 个元素，最多选择 $j$ 个区间，并且 **第 $i$ 个元素必须被选择** 时的最大区间和。

$g[i][j]$ 表示：只考虑前 $i$ 个元素，最多选择 $j$ 个区间时的最大区间和，对第 $i$ 个元素是否选择没有限制。

### 状态转移

对于 $f[i][j]$，如果选择元素 $a_i$，有两种情况：

1. 接在原有区间后面：如果 $a_{i-1}$ 已经位于某个区间中，可以直接延长这个区间：$f[i-1][j] + a_i$
2. 开始一个新区间：之前最多选择了 $j-1$ 个区间，现在要创建第 $j$ 个区间：$g[i-1][j-1] + a_i$

因此：$f[i][j]=max(f[i−1][j]+a_i,g[i−1][j−1]+a_i)$。

对于 $g[i][j]$，对于前 $i$ 个元素，最终答案有两种可能：

1. 不选择 $a_i$，答案沿用 $g[i-1][j]$；

2. 选择 $a_i$，答案为 $f[i][j]$。

因此：$g[i][j]=max(g[i−1][j],f[i][j])$。

### 初始化

要求最多选择 $m$ 个区间，因此可以一个都不选，初始答案为 $0$，因此初始化 $g[0][j] = 0$，其中 $0 \le j \le m$，由于不存在以位置 $0$ 为结尾的区间，因此 $f[0][j] = -inf$，最终答案为 $g[n][m]$。

### Code

```c++
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
    int n, m;
    cin >> n >> m;

    vector<ll> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    const ll neg_inf = -(1LL << 60);

    vector<vector<ll>> f(n + 1, vector<ll>(m + 1, neg_inf));
    vector<vector<ll>> g(n + 1, vector<ll>(m + 1, 0));

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            f[i][j] = max(f[i - 1][j], g[i - 1][j - 1]) + a[i];
            g[i][j] = max(g[i - 1][j], f[i][j]);
        }
    }

    cout << g[n][m] << endl;
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

## 求最大/最小子段和

```c++
auto get = [&](int l, int r) -> pii
{
    int x = a[l], mn = a[l];
    int y = a[l], mx = a[l];

    for (int i = l + 1; i <= r; i++)
    {
        x = min(a[i], x + a[i]);
        mn = min(mn, x);

        y = max(a[i], y + a[i]);
        mx = max(mx, y);
    }

    return {mn, mx};
};

```

定义 $x$ 为必须以当前位置结尾的最小子段和，$mn$ 表示到目前为止出现过的最小子段和。

同理 $y$ 为必须以当前位置结尾的最大子段和，$mx$ 表示到目前为止出现过的最大子段和。

即 $x$ 和 $y$ 是 $DP$ 状态，$mn$ 和 $mx

3. 