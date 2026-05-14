---
title: cf round 1080
published: 2026-05-12
description: "Codeforces Round 1080 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1080 (Div. 3)](https://codeforces.com/contest/2195)

# A - Sieve of Erato67henes

> 关键词：签到

## Code

```c++
// Problem: CF 2195 A
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/A
// Time: 2026-05-08 14:17:57
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
    int n;
    cin >> n;

    bool fl = false;

    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;
        if (x == 67)
            fl = true;
    }

    if (fl)
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# B - Heapify 1

> 关键词：模拟

## 思路

由于只能交换下标为 $2$ 倍关系的数，所以可交换的次数其实不多。暴力即可。

## Code

```c++
// Problem: CF 2195 B
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/B
// Time: 2026-05-08 15:19:19
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
    int n;
    cin >> n;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j *= 2)
            for (int k = i * 2; k <= n; k *= 2)
                if (a[k / 2] > a[k])
                    swap(a[k / 2], a[k]);

    if (is_sorted(all(a)))
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

# C - Dice Roll Sequence

> 关键词：思维，贪心

## 思路

注意到两个整数位于相邻面，当且仅当 $s \neq t$ 并且 $s+t \neq 7$。并且注意到对于任意的两个面，总存在第三个面和两者均相邻。

考虑遍历 $a_i$，如果 $a_i + a_{i + 1} = 7$ 或 $a_i = a_{i + 1}$，就一定要有一个值被修改，如果修改 $a_i$，后续的 $a_{i + 1}$ 和 $a_{i + 2}$ 可能还有问题，根据上面的结论，我们修改中间的 $a_{i + 1}$ 即可。可以把 $a_{i+1}$ 改成 $0$ 表示已修改，也可以 `i++` 跳过。

## Code

```c++
// Problem: CF 2195 C
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/C
// Time: 2026-05-08 16:25:33
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
    int n;
    cin >> n;

    vector<int> a(n);

    for (int i = 0; i < n; i++)
        cin >> a[i];

    int res = 0;
    for (int i = 1; i < n; i++)
    {
        if (a[i - 1] + a[i] == 7 || a[i - 1] == a[i])
            res++, i++;
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

# D - Absolute Cinema

> 关键词：数学，推公式，差分

## 思路

> [!NOTE]
>
> 对于绝对值函数求和的式子，可以从数学的角度看。
>
> 对于这样的函数 $f(x) = \sum a_i \cdot |x - i|$，一阶导数是斜率，在 $x = i$ 处突变。对于 $y = |x - i|$，除了 $x=i$ 这个“拐点”之外，其他所有地方的二阶导数都是 $0$。只有在 $x=i$ 处，斜率从 $-1$ 瞬间跳变到 $1$（变化量为 $2$）。
>
> 既然我们想求 $a_x$，我们只需要对 $f(x)$ 求二阶导数。因为在 $x$ 这个点，其他所有的项 $a_i \cdot |x - i|$ ($i \neq x$) 的二阶导数都是 $0$，只有 $a_x \cdot |x - x|$ 在这里会暴露出 $2a_x$ 的值。
>
> 而**一阶导数对应一维差分，二阶导数对应二维差分**，因此对 $f(x)$ 做两次差分就能提取 $a_x$。
>
> 首尾两项比较特殊，需要单独求解。

![](https://img.hailuo4ever.com/codeforces/round_1080_img1.png)

## Code

```c++
// Problem: CF 2195 D
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/D
// Time: 2026-05-12 17:42:57
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
const int N = 3e5 + 10;

ll a[N], res[N];

void solve()
{
    ll n;
    cin >> n;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n - 2; i++)
        res[i + 1] = (a[i] - a[i + 1] - (a[i + 1] - a[i + 2])) / 2;

    ll sum1 = 0, sum2 = 0;
    for (int i = 2; i < n; i++)
    {
        sum1 = sum1 + (n - i) * res[i];
        sum2 = sum2 + (i - 1) * res[i];
    }

    cout << (a[n] - sum1) / (n - 1) << " ";

    for (int i = 2; i < n; i++)
        cout << res[i] << " ";

    cout << (a[1] - sum2) / (n - 1) << endl;
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

# E - Idiot First Search

> 关键词：树形DP，dfs

## 思路

### Step 1 - 完整遍历一个空子树的代价

首先我们先不考虑起点，假设 Bob 按照规则，从父节点正常进入了一个**完全空白**的子树 $u$，模拟一下他的流程。

1. 他会给 $u$ 写上 'L'，然后进入左子树。

2. 左子树也是空白的，他会把左子树完整遍历一遍，最终退回到 $u$。

3. 此时 $u$ 上是 'L'，他改成 'R'，进入右子树。

4. 右子树完整遍历后，再次退回到 $u$。

5. 此时 $u$ 上是 'R'，他擦除掉，退回到 $u$ 的父节点。

我们发现，当他完整遍历完一个子树并退出时，这个子树里的所有节点都会恢复成初始的空白状态。

那么遍历整个子树 $u$ 并退回父节点，总共需要多少步（秒）？每经过一条边（向下或向上）都需要 1 秒。在一棵大小为 $sz[u]$ 的子树中，共有 $sz[u]-1$ 条边。每条边都会走两遍，再加上最初进入 $u$ 和最后离开 $u$ 的 2 步，总时间为： **$T(u) = 2 \times sz[u]$**

### Step 2 - 从起点第一次到父节点的代价

现在考虑 Bob 的起点是 $k$，它会先遍历完左子树，再遍历完右子树，最后走向父节点。

总代价为：$2 \times sz[k.left] + 2 \times sz[k.right] + 1$。由于 $sz[k] = sz[k.left] + sz[k.right] + 1$，因此对于任意的起点 $k$，Bob 需要消耗 $U(k) = 2 \times sz[k] - 1$ 的代价走到起点 $k$ 的父节点。

> [!TIP]
>
> 注意：当 Bob 离开 $k$ 节点到达父节点时，$k$ 节点和它的整棵子树都恢复到了完全空白的状态。

### Step 3 - 到达父节点后

现在 Bob 从 $k$ 到达了父节点 $p$，父节点此刻是空白的。根据他的运动规则，应该写下 'L'，然后走到左边，遍历完左边整棵子树以后再走到右边，也就是说他会再次走一遍 $k$，考虑在 $p$ 节点花费的时间，就是 $2 \times sz[p.left] + 2 \times sz[p.right] + 1 = 2 \times sz[p] - 1$

### Step 4 - 推公式

对于从任意节点 $k$ 出发，Bob 向上“逃脱”的过程就是：

1. 逃出 $k$ 到达 $p_1$：耗时 $2 \times sz[k] - 1$
2. 逃出 $p_1$ 到达 $p_2$：耗时 $2 \times sz[p_1] - 1$
3. 逃出 $p_2$ 到达 $p_3$：耗时 $2 \times sz[p_2] - 1$
4. 直到到达节点 1，逃出节点 1 到达最终目的地 0：耗时 $2 \times sz[1] - 1$。

所以，如果以 $dp[k]$ 表示从节点 $k$ 到达节点 $0$ 的总时间，公式为：$dp[k] = \sum_{v \in \text{path}(k \to 1)} (2 \times sz[v] - 1)$

## Code

```c++
// Problem: CF 2195 E
// Contest: Codeforces - Codeforces Round 1080 (Div. 3)
// URL: https://codeforces.com/contest/2195/problem/E
// Time: 2026-05-13 13:08:58
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

void solve()
{
    int n;
    cin >> n;

    vector<int> l(n + 1), r(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> l[i] >> r[i];

    vector<ll> sz(n + 1, 0);

    // 计算每个节点子树大小
    auto dfs = [&](auto &self, int u) -> void
    {
        sz[u] = 1;

        if (l[u])
        {
            self(self, l[u]);
            sz[u] += sz[l[u]];
        }

        if (r[u])
        {
            self(self, r[u]);
            sz[u] += sz[r[u]];
        }
    };

    dfs(dfs, 1); // 注意实际能遍历的根节点还是 1

    vector<ll> dp(n + 1, 0);

    // 自顶向下计算路径前缀和 dp[u]
    auto dfss = [&](auto &self, int u, ll cur) -> void
    {
        ll t = (2 * sz[u] - 1) % mod;
        dp[u] = (cur + t) % mod;

        if (l[u])
            self(self, l[u], dp[u]);
        if (r[u])
            self(self, r[u], dp[u]);
    };

    dfss(dfss, 1, 0);

    for (int i = 1; i <= n; i++)
        cout << dp[i] << " ";

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

