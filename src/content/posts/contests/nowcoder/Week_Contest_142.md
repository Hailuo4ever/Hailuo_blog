---
title: 牛客周赛 Round 142
published: 2026-05-03
description: "Nowcoder Week Contest 142"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 142]((https://ac.nowcoder.com/acm/contest/133790))

# A - 小苯的ovo 3.0

> 关键词：签到

## Code

```c++
// Problem: 小苯的ovo3.0
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/A
// Time: 2026-05-03 19:00:02

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

int main()
{
    string s;
    cin >> s;

    if (s[0] == 'o' || s[0] == 'O')
    {
        if (s[1] == 'v' || s[1] == 'V')
        {
            if (s[2] == 'o' || s[2] == 'O')
            {
                cout << "YES" << endl;
                return 0;
            }
        }
    }

    cout << "NO" << endl;
    return 0;
}

```

# B - 小苯的双端队列

> 关键词：签到，模拟

## 思路

用两个指针来模拟，左指针指向开头，右指针指向尾部，每次操作都必须让左右指针其中的一个可以移动，否则序列不合法。

## Code

```c++
// Problem: 小苯的双端队列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/B
// Time: 2026-05-03 19:02:27
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

    vector<int> b(n);
    for (int i = 0; i < n; i++)
        cin >> b[i];

    int l = 1, r = n;

    bool flag = true;

    for (int i = 0; i < n; i++)
    {
        if (b[i] == l)
            l++;
        else if (b[i] == r)
            r--;
        else
        {
            flag = false;
            break;
        }
    }

    if (flag)
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# C - 小苯的整除序列

> 关键词：模拟

## 思路

由于子序列不要求连续，我们只需要模拟这个整除的过程即可。

具体来说，在遍历数组的同时，我们不断尝试能否整除 `idx`，遍历结束后记得将 `idx` 减掉 1。

## Code

```c++
// Problem: 小苯的整除序列
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/C
// Time: 2026-05-03 19:18:49
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

    vector<int> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    int idx = 1;
    for (int i = 0; i < n; i++)
    {
        if (a[i] % idx == 0)
            idx++;
    }

    cout << idx - 1 << endl;
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

# D - 小苯的幼儿园

> 关键词：数学

## 思路

由于要求最终每个人的糖果数量一样，所以有 `sum % n == 0`，首先过滤掉一部分数据。

设目标糖果数为 $k$，假设第 $i$ 个小朋友给他右边的第 $i+1$ 个小朋友的糖果数为 $x_i$，根据题意，$x_i$ 的取值只能是 0 或 1。

**第 $i$ 个小朋友最终的糖果数，等于他原本的糖果数 $a_i$，减去他给出去的 $x_i$，加上他收到的 $x_{i-1}$：$a_i - x_i + x_{i-1} = k$。**

将方程变形，有$a_i - x_i + x_{i-1} = k$，这是一个递推式，意味着我们只要确定了第0个小朋友给出的糖果数量 $x_0$，后面的 $x_1, x_2, \dots, x_{n-1}$ 就全部唯一确定了。

我们只需要在算完平均数 $k$ 后，写一个 `check` 函数。分别假设 $x_n = 0$ 和 $x_n = 1$，然后顺着递推式验证一遍：如果途中没有任何 $x_i$ 越界（即不是 0 也不是 1），且最终首尾能闭合，就是合法的。

> [!NOTE]
>
> 总结：遇到这种“同时传递”的环形问题，考虑设未知数并列出传递方程。

## Code

```c++
// Problem: 小苯的幼儿园
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/D
// Time: 2026-05-03 19:22:20
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

    ll sum = 0;

    vector<ll> a(n), b(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        sum += a[i];
    }

    if (sum % n != 0)
    {
        cout << "NO" << endl;
        return;
    }

    ll tg = sum / n;

    auto check = [&](int t) -> bool
    {
        int x = t;
        for (int i = 0; i < n; i++)
        {
            x = x + a[i] - tg;
            if (x < 0 || x > 1)
                return false;
        }
        return (x == t);
    };

    if (check(0) || check(1))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# E - 小苯的区间操作

> 关键词：思维

## 思路

我们可以用一种形象的方式来思考：把原数组想象成一个由方块堆成的山（柱状图）。我们翻译一下题目的要求：

1. 区间长度 $\ge 2$：你手里有一把宽度至少为 2 的铲子。

2. $a_L = a_R$ 且内部 $a_i \ge a_L$：你这把铲子必须平着铲（两端高度一样），并且铲子中间的部分不能悬空（区间内的地形不能有低于铲子底部的“坑”）。

3. 区间内全部减 1：每次你可以把这一层、宽度至少为 2 的方块给水平“削”掉一层。

我们的目标是把整座山用铲子削成全为 0。

既然铲子的最小宽度为 2，显然我们无论如何也削不掉**宽度仅为 1 的孤峰**，也就是说，只要数组中存在任何一个**严格大于左右相邻元素**的点，我们就无法将数组清零。如果不存在这样的“孤峰”，我们总是可以从最高处找到宽度 $\geq 2$ 的平顶山脉，一层层削平。

考虑特判开头和结尾的状况，只要把数组长度开成 `n + 2`，把原来的数放在位置 `1 ~ n`，在前后补上 0 即可。实际上整个山的物理边界之外，就是海拔为 0 的平地。

> 例如 `[5, 3]` 实际上应该是 `[0, 5, 3, 0]`。

因此我们可以在 $O(n)$ 的时间下解决这个问题。

## Code

```c++
// Problem: 小苯的区间操作
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/E
// Time: 2026-05-03 19:43:34
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

    vector<int> a(n + 2, 0);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    bool flag = true;
    for (int i = 1; i <= n + 1; i++)
    {
        if (a[i] > a[i - 1] && a[i] > a[i + 1])
        {
            flag = false;
            break;
        }
    }

    if (flag)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
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

# F - 小苯的DFS

> 思路：树上DFS，组合数学，概率计数

## 思路

题目要求我们在 DFS 时，第一次到达节点就把它的权值加进序列 $b$ 中。也就是**树的前序遍历**。

既然要求整个前序遍历序列**单调不降**，这意味着我们在遍历树的过程中，得到的值必须越来越大。

我们考虑遍历过程中的限制因素：

1. 父亲与子树的限制：对于任意节点 $u$，它的权值 $w_u$ 必须小于等于它整个子树里所有节点的权值；
2. 兄弟子树的限制：假设 $u$ 决定按照 $c_1, c_2, \dots, c_k$ 的顺序访问它的子节点。那么我们肯定是先把 $c_1$ 这棵子树全部遍历完，再进入 $c_2$。为了保证单调不降，$c_1$ 子树里的最大值，必须小于等于 $c_2$ 子树里的最小值。

根据上面的推导，我们发现我们不需要关心子树内部的具体结构，只需要知道每棵子树的最小值和最大值即可。

**我们考虑把每棵子树压缩成一个区间来表示。**

设以 $v$ 为根的子树，节点权值的最小值为 $mn[v]$，最大值为 $mx[v]$。对于 $u$ 的所有子节点 $c_i$，我们相当于得到了一个个区间 $[mn[c_i], mx[c_i]]$。

为了满足“前一棵子树的最大值 $\le$ 后一棵子树的最小值”，我们要将这些区间进行排序。显然，**只有按 $mn[v]$ 从小到大升序排序，才“有可能”满足条件**。

排序后，我们只需要检查一遍相邻区间：**如果存在某个 $mx[c_i] > mn[c_{i+1}]$，说明这棵树排不出合法的顺序，合法概率为 0**。

**我们考虑如何计算概率。**

假设在节点 $u$ 处有 $k$ 个子节点，那么一共有 $k!$ 种打乱方式，合法排列并不唯一。如果存在完全相同的“单点区间”（比如 $[X, X]$ 和 $[X, X]$），这两棵子树的顺序不影响单调不降的性质，假设有 $C$ 个一模一样的区间，它们之间就有 $C!$ 种合法的排列组合。所以节点 $u$ 的局部合法概率为 $\frac{\prod (C_X!)}{k!}$，把所有节点的概率相乘即为正确答案。

> [!NOTE]
>
> 总结：从单调不降的性质入手，这道题的关键在于将每个子树压缩成一个 `[min, max]` 区间来处理，在统计合法方案时要用到组合数学知识。

## Code

```c++
// Problem: 小苯的DFS
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133790/F
// Time: 2026-05-03 19:55:54
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
const int N = 2e5 + 10;
const ll mod = 998244353;

vector<int> adj[N];
ll w[N], mn[N], mx[N];
ll fact[N], infact[N];
bool flag;
ll res;

ll qmi(ll a, ll k)
{
    ll res = 1;
    while (k)
    {
        if (k & 1)
            res = (ll) res * a % mod;

        a = (ll) a * a % mod;
        k >>= 1;
    }
    return res;
}

void init()
{
    fact[0] = 1, infact[0] = 1;
    for (int i = 1; i < N; i++)
        fact[i] = fact[i - 1] * i % mod;

    infact[N - 1] = qmi(fact[N - 1], mod - 2);

    for (int i = N - 2; i >= 1; i--)
        infact[i] = infact[i + 1] * (i + 1) % mod;
}

void dfs(int u, int p)
{
    mn[u] = w[u], mx[u] = w[u];

    vector<pll> segs; // 将子树压缩成区间
    int cnt = 0; // 子节点个数

    for (int v: adj[u])
    {
        if (v == p)
            continue;

        dfs(v, u);

        if (!flag)
            return; // 可行性剪枝

        mn[u] = min(mn[u], mn[v]);
        mx[u] = max(mx[u], mx[v]);

        segs.push_back({mn[v], mx[v]});
        cnt++;
    }

    // 父节点不能大于子树中的最小值
    if (w[u] > mn[u])
    {
        flag = false;
        return;
    }

    if (cnt > 0)
    {
        sort(segs.begin(), segs.end());

        // 前一个子树的最大值必须小于等于后一个子树的最小值
        for (int i = 0; i < cnt - 1; i++)
            if (segs[i].second > segs[i + 1].first)
            {
                flag = false;
                return;
            }

        ll valid = 1;
        for (int i = 0; i < cnt;)
        {
            int j = i;
            while (j < cnt && segs[j] == segs[i])
                j++;

            valid = valid * fact[j - i] % mod;
            i = j;
        }

        res = ((res * valid) % mod) * infact[cnt] % mod;
    }
}

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
    {
        cin >> w[i];
        adj[i].clear();
    }

    for (int i = 0; i < n - 1; i++)
    {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v), adj[v].push_back(u);
    }

    flag = true;
    res = 1;

    dfs(1, 0);

    if (!flag)
        cout << 0 << endl;
    else
        cout << res << endl;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    init();

    int T;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

