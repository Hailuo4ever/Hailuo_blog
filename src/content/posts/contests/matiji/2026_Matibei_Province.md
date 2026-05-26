---
title: 2026 码蹄杯省赛第三场
published: 2026-05-23
description: "MatiCup Province III"
image: "https://img.hailuo4ever.com/cover/cry.png"
tags: [算法题解, 码蹄杯]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 题库补题链接：[码蹄集](https://www.matiji.net/exam/ojquestionlist?questionBankId=C98C14523F069FECB0DEED64F00CEAB0)

# A - 侠累擅权韩

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;

int main()
{
    string s;
    cin >> s;

    reverse(s.begin(), s.end());

    cout << s << endl;
    return 0;
}

```

# B - 仲子受辱恨

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;

const int N = 1010;
string s[N];
int res[N];

int main()
{
    int n, m;
    cin >> n >> m;

    for (int i = 0; i < n; i++)
        cin >> s[i];

    while (m--)
    {
        string t;
        cin >> t;

        for (int i = 0; i < n; i++)
        {
            // cout << s[i].find(t) << endl;
            if (s[i].find(t) == 0)
                res[i]++;
        }
    }

    for (int i = 0; i < n; i++)
        cout << res[i] << " ";
    return 0;
}

```

# C - 重金求死士

> 关键词：暴力

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1010;

ll n, m, t1, t2;
ll g[N][N];
ll res;

ll quer(int lx, int ly, int rx, int ry)
{
    ll res = 0;
    for (int i = lx; i <= rx; i++)
    {
        for (int j = ly; j <= ry; j++)
            res ^= g[i][j];
    }
    return res;
}

int main()
{
    cin >> n >> m >> t1 >> t2;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cin >> g[i][j];

    for (int lx = 1, ly = 1;;)
    {
        if (ly > m)
        {
            lx += t1, ly = 1;
            continue;
        }

        if (lx > n)
            break;

        int rx = lx + t1 - 1, ry = ly + t2 - 1;

        res += quer(lx, ly, rx, ry);
        ly += t2;
    }
    cout << res << endl;

    return 0;
}

```

# D - 屠肆会聂政

> 关键词：贪心

## 思路

> 赛时要是想到就能金牌了，唉唉。不知道自己练了这么半天有什么用。——2026.5.25 23:55

由于传统上升子序列的模板时间复杂度太大，所以考虑贪心做。

为了找出一个长度至少为 3 的递增子序列，我们在遍历查询区间 `[l, r]` 时，只需要维护两个变量：

1. `min1`：目前遇到的最小元素。
2. `min2`：目前遇到的、排在 `min1` 后面且大于 `min1` 的最小元素。

初始化两个变量为无穷大，在遍历过程中如果当前元素 `<= min1`，就更新 `min1`，否则如果 `<= min2` 就更新 `min2`，否则（比 `min2` 还大，我们就找到了一个大于 `min1` 且大于 `min2` 的元素，这就意味着一定存在一个长度至少为 $3$ 的上升序列。

时间复杂度 $O(n)$。

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
const int N = 1e4 + 10;

int a[N], n, q;

bool query(int l, int r)
{
    int min1 = 2e9, min2 = 2e9;
    for (int i = l; i <= r; i++)
    {
        if (a[i] <= min1)
            min1 = a[i];
        else if (a[i] <= min2)
            min2 = a[i];
        else
            return true;
    }
    return false;
}

int main()
{
    cin >> n >> q;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    while (q--)
    {
        int l, r;
        cin >> l >> r;
        cout << (query(l, r) ? "Yes" : "No") << endl;
    }
    return 0;
}

```

# E - 母终诺赴义

> 关键词：线性DP

## 思路

题目给了一个 $2 \times n$ 的网格（只有 0 和 1 两行，列是从 1 到 $n$）。假设我们有两个黑色的落脚点，分别在 $(r_1, c_1)$ 和 $(r_2, c_2)$。它们之间的曼哈顿距离是 $|r_1 - r_2| + |c_1 - c_2|$。

题目要求这个距离必须 $\ge d$。我们分两种情况讨论：

- 如果在同一行 ($r_1 = r_2$)：距离为 $|c_1 - c_2|$。这就要求两列的跨度 $\ge d$。
- 如果在不同行 ($r_1 \neq r_2$)：距离变成 $1 + |c_1 - c_2|$。这就要求两列的跨度 $\ge d - 1$。

题目要求任意两格黑色记号之间的曼哈顿距离都不小于 $d$，实际上有一个更强的性质：**当 $d \ge 2$ 时，只要相邻的两个黑格子满足这个性质，所有的黑格子就都可以满足**。

> 推导：假设有三个黑格子从左到右按列排开，列号是 $c_1 < c_2 < c_3$。 如果 $c_2$ 和 $c_1$ 满足条件，说明 $c_2 - c_1 \ge d - 1$。 如果 $c_3$ 和 $c_2$ 满足条件，说明 $c_3 - c_2 \ge d - 1$。 那么 $c_3$ 和 $c_1$ 的跨度就是 $c_3 - c_1 \ge 2d - 2$。 只要 $d \ge 2$，必有 $2d - 2 \ge d$，这说明首尾格子的距离直接就是合法的。

这意味着我们只需要关心每一步操作的“上一个黑格子”在哪里，考虑线性DP。

状态表示：定义 $f[i]$ 表示**以第 $i$ 列的第 0 行**作为最后一个黑格子，且合法的染色方案数。由于网格只有两行，是完全对称的，因此以第 $i$ 列第 1 行结尾的方案数也是 $f[i]$。

考虑对于第 $i$ 列第 0 行的这颗新棋子，它的上一步可以从哪里转移过来：

1. **上一步在同行（第 0 行）：** 列数 $j$ 必须满足 $i - j \ge d \implies j \le i - d$。

2. **上一步在不同行（第 1 行）：** 列数 $j$ 必须满足 $i - j \ge d - 1 \implies j \le i - d + 1$。

3. **没有上一步：** 这颗棋子是第一个黑点（1 种情况）。

状态转移方程：$f[i] = 1 + \sum_{j=1}^{i-d} f[j] + \sum_{j=1}^{i-d+1} f[j]$，这里使用了 $f[j]$ 替代第 $1$ 行的方案数，因为他们对称相等。

对于方程中的两个求和式子，可以通过维护前缀和来 $O(1)$ 计算。

最终答案为第 $0$ 行的所有结尾方案 + 第 $1$ 行的所有结尾方案，再加上一种“一个格子都不涂”的方案。

注意特判 $d = 1$ 的情况，只要是两个不一样的格子，曼哈顿距离肯定 $\ge 1$，因此一共 $2n$ 个格子，答案为 $2^{2n}=4^n$。

## Code

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
const ll mod = 1e9 + 7;

ll qmi(ll a, ll k)
{
    ll res = 1;
    while (k)
    {
        if (k & 1)
            res = (res * a) % mod;
        a = (a * a) % mod;
        k >>= 1;
    }
    return res;
}

void solve()
{
    int n, d;
    cin >> n >> d;

    if (d == 1)
    {
        cout << qmi(4, (ll) n) << endl;
        return;
    }

    vector<ll> dp(n + 1, 0), sum(n + 1, 0);

    for (int i = 1; i <= n; i++)
    {
        ll dp0 = (i - d >= 0) ? sum[i - d] : 0;
        ll dp1 = (i - d + 1 >= 0) ? sum[i - d + 1] : 0;

        dp[i] = (1 + dp0 + dp1) % mod;

        sum[i] = (sum[i - 1] + dp[i]) % mod;
    }

    ll res = (2 * sum[n] + 1) % mod;
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

