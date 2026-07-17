---
title: cf round 1109
published: 2026-07-14
description: "Codeforces Round 1109 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1109.(Div. 3)](https://codeforces.com/contest/2244)

# A - Iskander and Drawings

> 关键词：双指针

## 思路

对于长度为 $n$ 的线段，擦除时间为 $\lceil \frac {l}{2} \rceil$。用双指针找出字符串中最长连续的井号子串，更新答案即可。

## Code

```c++
// Problem: CF 2244 A
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/A
// Time: 2026-07-14 22:35:22
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

void solve()
{
    int n;
    string s;

    cin >> n >> s;

    int res = 0;
    for (int i = 0; i < n; i++)
    {
        if (s[i] == '#')
        {
            int j = i;
            while (j < n && s[j] == '#')
                j++;

            res = max(res, j - i);
            i = j - 1;
        }
    }

    cout << (res + 1) / 2 << endl;
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

# B - Nikita and Books

> 关键词：前缀和

## 思路

书籍只能向右移动，因此对于每个位置，它的前缀的书籍总数只能减小或不变。

因此对于每个位置的前缀，都检查是否满足当前的前缀和大于等于等差数列的和即可。

## Code

```c++
// Problem: CF 2244 B
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/B
// Time: 2026-07-14 22:35:30
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

void solve()
{
    ll n;
    cin >> n;

    ll sum = 0;
    bool flag = true;

    for (ll i = 1; i <= n; i++)
    {
        ll x;
        cin >> x;
        sum += x;
        if (sum < i * (i + 1) / 2)
            flag = false;
    }

    cout << (flag ? "YES" : "NO") << endl;
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

# C - Stepan and Permutation

> 关键词：并查集，裴蜀定理

## 思路

### 做法一

可以直接用并查集模拟，最后对每个下标 $i$，检查 $i$ 与 $a[i]$ 是否联通。

### 做法二

令 $g=\gcd (x, y)$。显然有 $g\mid x,\quad g\mid y$。

假设一个元素当前在位置 $i$，经过一次操作后移动到了位置 $j$，那么有 $j=i\pm x$ 或 $j=i\pm y$，而无论哪种情况，都有 $j\equiv i\pmod g$。

也就是说，每次移动都不会改变位置模 $g$ 的余数。

**一个元素无论如何交换，都只能在满足 $i\equiv j\pmod g$ 的位置间移动。 **

因此对所有 $i$ 检查 $i\bmod g=p_i\bmod g$，如果全部满足，答案为 `YES`，否则为 `NO`。

> [!NOTE]
>
> 注：出现 $\gcd$ 的根本原因是，经过多次操作的总位移一定形如 $ax+by$，而根据裴蜀定理，所有形如 $ax+by$ 的整数恰好是 $gcd(x,y)$ 的整数倍。也就是所有可能的总位移构成 $\{\ldots,-2g,-g,0,g,2g,\ldots\}$。
>
> 因此从位置 $i$ 出发，只可能到达 $i+kg$ 的位置，也就是所有满足 $j\equiv i\pmod g$ 的位置。

## Code

### 做法1（并查集）

```c++
// Problem: CF 2244 C
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/C
// Time: 2026-07-14 22:35:31
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

struct DSU
{
    vector<int> fa;
    vector<int> sz;

    DSU()
    {
    }

    DSU(int n)
    {
        init(n);
    }

    void init(int n)
    {
        fa.resize(n + 1);
        sz.assign(n + 1, 1);

        iota(fa.begin(), fa.end(), 0);
    }

    int find(int x)
    {
        if (fa[x] == x)
            return x;

        return fa[x] = find(fa[x]);
    }

    bool merge(int x, int y)
    {
        x = find(x);
        y = find(y);

        if (x == y)
            return false;

        if (sz[x] < sz[y])
            swap(x, y);

        fa[y] = x;
        sz[x] += sz[y];

        return true;
    }

    bool connected(int x, int y)
    {
        return find(x) == find(y);
    }

    int sze(int x)
    {
        return sz[find(x)];
    }
};

void solve()
{
    int n, x, y;
    cin >> n >> x >> y;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    DSU dsu(n);
    for (int i = 1; i + x <= n; i++)
        dsu.merge(i, i + x);

    for (int i = 1; i + y <= n; i++)
        dsu.merge(i, i + y);

    for (int i = 1; i <= n; i++)
    {
        if (!dsu.connected(i, a[i]))
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

### 做法2（gcd）


```c++
// Problem: CF 2244 C
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/C
// Time: 2026-07-14 22:35:31
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

void solve()
{
    int n, x, y;
    cin >> n >> x >> y;

    vector<int> a(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    int g = gcd(x, y);
    for (int i = 1; i <= n; i++)
    {
        if (i % g != a[i] % g)
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



# D - Yaroslav and Productivity

> 关键词：前缀操作，区间

## 思路

多个前缀操作之间存在嵌套关系，首先将 $b$ 从小到大排序，这些位置将数组划分成了 $[1,b_1],\ [b_1+1,b_2],\ \ldots,\ [b_{m-1}+1,b_m],\ [b_m+1,n]$。其中前 $m$ 个区间的整体符号可以被自由控制，而最后一个区间 $[b_m+1,n]$ 不会被任何操作影响。

> 为什么每个区间的符号可以独立选择？
>
> 假设 $b=[2,5,7]$，数组被划分为 $[1,2],\quad [3,5],\quad [6,7],\quad [8,n]$。
>
> 对于区间 $[6,7]$，只有操作 $[1,7]$ 可以改变它。
>
> 对于区间 $[3,5]$，决定 $[6,7]$ 后，可以使用操作 $[1,5]$，这个操作不影响 $[6,7]$。
>
> 因此，可以像从右向左拨动开关一样，让每个区间最终保持原符号，或者整体乘上 $-1$。

所以对于前面的所有区间，贡献就是绝对值。而最后一个区间的贡献是它本身。

## Code

```c++
// Problem: CF 2244 D
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/D
// Time: 2026-07-14 23:11:01
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

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<ll> a(n + 1), b(m + 1), s(n + 1, 0);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        s[i] = s[i - 1] + a[i];
    }

    for (int i = 1; i <= m; i++)
        cin >> b[i];

    sort(all(b));

    ll res = 0;

    for (int i = 1; i <= m; i++)
        res += abs(s[b[i]] - s[b[i - 1]]);

    res += s[n] - s[b[m]];
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

# E - Masha and the Garland

> 关键词：前缀和

## 思路

一个字符串是交替串，当且仅当每一对相邻字符都不同，即 $s_i\ne s_{i+1}$。

因此，对于询问区间 $[l,r]$，我们只需要考虑其中的相邻位置：$(l,l+1),(l+1,l+2),\ldots,(r-1,r)$。

定义一个相邻位置 $i$ 是坏位置，当且仅当 $s_i=s_{i+1}$，问题转化为：**区间 $[l,r]$ 中有若干个坏位置，一次区间翻转最多能消灭多少个坏位置？最少需要多少次操作？**

假设翻转区间为 $[x,y]$。对于任意 $x\le i<y$，si 和 $s_{i+1}$ 会同时翻转。因此区间内部的相邻关系不变，而左边界处 $(s_{x-1},s_x)$ 和右边界处 $(s_y,s_{y+1})$ 的情况会被改变。因此一次翻转操作，最多只会改变两个相邻关系： $x-1$ 和 $y$。

假设询问区间中一共有 $c$ 个坏位置。因为一次操作最多修复两个坏位置，所以至少需要 $\left\lceil \frac{c}{2}\right\rceil$ 次操作。

定义 $bad_i=
\begin{cases}
1,&s_i=s_{i+1}\\
0,&s_i\ne s_{i+1}
\end{cases}$，其中 $1\le i \le n$，再使用前缀和来记录前 $i$ 个字符中坏位置的总数。

对于询问 $[l,r]$，需要检查的相邻位置范围是 $[l,r-1]$，坏位置数量为 $c=pre_{r-1}-pre_{l-1}$，最小操作次数为 $need=\frac{c+1}{2}$。

## Code

```c++
// Problem: CF 2244 E
// Contest: Codeforces - Codeforces Round 1109 (Div. 3)
// URL: https://codeforces.com/contest/2244/problem/E
// Time: 2026-07-15 14:11:36
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

void solve()
{
    int n, q;
    cin >> n >> q;

    string s;
    cin >> s;

    s = " " + s;
    vector<int> pre(n + 1);

    for (int i = 1; i < n; i++)
        pre[i] = pre[i - 1] + (s[i] == s[i + 1]);
    pre[n] = pre[n - 1];

    while (q--)
    {
        int l, r, k;
        cin >> l >> r >> k;

        if (k >= (pre[r - 1] - pre[l - 1] + 1) / 2)
            cout << "YES" << endl;
        else
            cout << "NO" << endl;
    }
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

