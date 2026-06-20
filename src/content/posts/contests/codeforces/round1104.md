---
title: cf round 1104
published: 2026-06-18
description: "Codeforces Round 1104 (Div.1 + 2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1104.(Div. 1 + 2)](https://codeforces.com/contest/2237)

# A - Destroying Towers

> 关键词：签到

## 思路

直接模拟，维护出现的最小值即可。

## Code

```c++
// Problem: CF 2237 A
// Contest: Codeforces - Order Capital Round 2 (Codeforces Round 1104, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2237/problem/A
// Time: 2026-06-18 22:35:07
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

    int mn = inf;
    for (int i = 0; i < n; i++)
    {
        if (a[i] < mn)
            mn = a[i];
        else
            a[i] = mn;
    }

    int res = accumulate(all(a), 0);
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

# B - Annoying the Ghost

> 关键词：枚举，贪心

## 思路

要求找到第二阶段可能执行的最小操作次数，我们首先考虑让第一阶段尽可能多。这里用一个“匹配”的方式。

对于每个在 $a$ 数组里的数，我们贪心地去 $b$ 中找第一个不小于它的数来匹配并记录下标。在这个过程中，如果找不到，说明不存在有效过程，直接输出 $-1$。

匹配后统计逆序对的数量，由于 $n$ 较小，可以 $O(n^2)$ 地暴力即可。

## Code

```c++
// Problem: CF 2237 B
// Contest: Codeforces - Order Capital Round 2 (Codeforces Round 1104, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2237/problem/B
// Time: 2026-06-18 22:38:45
// O(n^2)?
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

    vector<ll> a(n), b(n);
    for (auto &x: a)
        cin >> x;
    for (auto &x: b)
        cin >> x;

    vector<int> c(n);
    vector<bool> st(n, false);

    for (int i = 0; i < n; i++)
    {
        int t = -1;
        for (int j = 0; j < n; j++)
        {
            if (!st[j] && b[j] >= a[i])
            {
                t = j;
                break;
            }
        }

        if (t == -1)
        {
            cout << -1 << endl;
            return;
        }

        c[i] = t, st[t] = true;
    }

    ll res = 0;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            if (c[i] > c[j])
                res++;

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

# C - Duck Surplus

> 关键词：贪心

## 思路

如果有相邻两堆满足 $(x,y) \quad x>y$，就一定要执行操作。操作后变为 $(y,x+y)$，可以理解成：小的 $y$ 往左钻过去，大的 $x$ 被挤到右边，并且吸收了 $y$。

**一个比较小的数往左移动时，它本身不变；被它跨过的那些更大的数都会加上它。**

因此，可以证明每次都操作最左边的逆序对是最优的。

假设前面已经处理好的序列是不降的，现在加入一个新数 $x$，如果当前最大值 $mx \le x$，直接把 $x$ 接在后面即可，更新最大值。如果当前最大值大于 $x$，说明新来的 $x$ 比前面某些数小。那么 $x$ 会像插入排序一样，不断往左移动，跨过大于它的数，每跨过一个数，那个数就会加上 $x$。显然当前的最大值也会被 $x$ 跨过去，所以新最大值就变成了 $mx+x$。

## Code

```c++
// Problem: CF 2237 C
// Contest: Codeforces - Order Capital Round 2 (Codeforces Round 1104, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2237/problem/C
// Time: 2026-06-18 23:07:42
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

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    ll mx = a[0];

    for (int i = 1; i < n; i++)
    {
        if (mx > a[i])
            mx += a[i];
        else
            mx = a[i];
    }

    cout << mx << endl;
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

# D - Fullmetal Bitchemist

> 关键词：找性质，思维

## 思路

直接模拟删除会很乱，因为不同操作顺序会导致不同中间串。关键是**找一个不变量。**

首先我们给 $0,1$ 赋权值，定义 $w(0)=1,\quad w(1)=2$，然后来看操作。

操作 $1$：$00 \to 1$，原来的权值和 $w(0)+w(0)=1+1=2$，新字符的权值 $w(1)=2$，所以模 $3$ 意义下不变。

操作 $2$：$11 \to 0$，原来的权值和 $w(1)+w(1)=2+2=4\equiv 1 \pmod 3$，新字符的权值 $w(0)=1$，所以模 $3$ 意义下也不变。

**因此每次操作都会保持 $\sum w(t_i)\pmod 3$ 不变。**

由于长度为 $1$ 的字符串只可能是 $0$ 或 $1$，权值为 $1$ 或 $2$，这时就能发现一个条件，$\sum w(t_i)\not\equiv 0\pmod 3$

但这个条件以外，还必须有相邻相等的字符才可以操作，因此还需要排除**长度大于 $1$ 的交替串**这种情况。例如 $01,10,101,0101$。

**结论：一个非空二进制串 $t$ 是美丽的，当且仅当：$\sum w(t_i)\not\equiv 0\pmod 3$，并且 $t$ 不是长度大于 $1$ 的交替串。**

**答案即为：权值和不为 $0$ 的子串数量减去奇数长度且长度至少为 $3$ 的交替子串数量（偶数长度的交替子串权值和为 $0$）**

统计权值和不为 $0$ 的子串数量：

使用前缀和来统计权值。定义前缀和：$pre_i=\sum_{j=1}^{i} w(s_j)\pmod 3$，那么子串 $s_l\sim s_r$ 的权值和为：$pre_r-pre_{l-1}\pmod 3$，如果这个值为 $0$，说明：$pre_r=pre_{l-1}$。所以，对于每个右端点 $r$，我们只需要知道之前有多少个前缀和等于当前 $pre_r$。

设 $cnt[x]$ 表示之前出现过多少个前缀和模 $3$ 等于 $x$。对于位置 $i$，所有以 $i$ 结尾的子串有 $i$ 个。其中权值和为 $0$ 的有：$cnt[pre_i]$，所以权值和不为 $0$ 的有：$i-cnt[pre_i]$。

计算交替子串数量：

维护一个以 $i$ 结尾的最长交替后缀长度，记为 $len$，如果 $s_i \ne s_{i+1}$，说明可以继续交替，$len++$，否则 $len=1$。现在以 $i$ 结尾的交替子串长度可以是 $1,2,3, \cdots , len$，我们要排除的是奇数长度且至少为 $3$ 的子串，也就是 $3,5,7,\dots$，数量为 $\left\lfloor \frac{len-1}{2}\right\rfloor$。

> [!NOTE]
>
> 总结：优先考虑不变量，直接的量（如长度、数量）都不是不变量，所以考虑给字符串赋权值，看看权值和是不是不变的。

## Code

```c++
// Problem: CF 2237 D
// Contest: Codeforces - Order Capital Round 2 (Codeforces Round 1104, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2237/problem/D
// Time: 2026-06-19 11:06:36
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
    string s;
    cin >> n >> s;

    vector<ll> cnt(3, 0);
    cnt[0] = 1;

    ll pre = 0, len = 0, a = 0, b = 0;

    for (int i = 1; i <= n; i++)
    {
        int v = 0;
        if (s[i - 1] == '0')
            v = 1;
        else
            v = 2;

        pre = (pre + v) % 3;

        a += i - cnt[pre];
        cnt[pre]++;

        if (i == 1 || s[i - 1] == s[i - 2])
            len = 1;
        else
            len++;

        b += (len - 1) / 2;
    }

    cout << a - b << endl;
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

# E - Permutation Commutation

> 关键词：贪心匹配，思维

## 思路

给定的式子 $a_{b_i}=b_{a_i}$ 可以看作一个递推式，如果我们知道 $b_i$，就直接可以递推出 $b_{a_i},b_{a_{a_i}},\dots$，它会沿着 $a$ 的环一路传下去。

由于 $a$ 是一个排列，每个点都有唯一出边，也有唯一入边，因此 $a$ 一定可以拆解成若干个环。例如：$a=[2,3,1,5,4]$，代表的两个环为 $(1,2,3) \quad (4,5)$。

而由于存在递推关系，知道任意一个点就可以推出整个环。假设 $a$ 有一个环：$1 \rightarrow 3 \rightarrow 5 \rightarrow 1$。如果现在已知：$b_1 = 2$，那么根据：$b_{a_i} = a_{b_i}$，对 $i = 1$：$b_{a_1} = a_{b_1}$。因为：$a_1 = 3, b_1 = 2$，所以：$b_3 = a_2$。如果 $a_2 = 4$，那么：$b_3 = 4$。继续对 $i = 3$：$b_{a_3} = a_{b_3}$。如果：$a_3 = 5, b_3 = 4$，那么：$b_5 = a_4$。于是：$b_1 \Rightarrow b_3 \Rightarrow b_5$，整个环都会被推出。**且可以证明，对于 $b$ 上所确定的所有环，都是可以一一对应的，它们长度相同，路径走法也相同，且不存在重复或漏项。**

因此可以分成两类环。

1. 已经有给定 $b_i$ 的环：如果一个 $a$-环里面有某个 $b_i\neq -1$，那么这个环不能自由选择了。它会被公式 $b_{a_i}=a_{b_i}$ 直接推出。推导过程中如果发现矛盾，就无解。
2. 没有给定 $b_i$ 的环：如果一个 $a$-环里面所有 $b_i=-1$，那么它还没有任何限制。它需要找一个还没被用过且长度相同的环进行匹配，为了字典序最小，按照编号从小到大配。

## Code

```c++
// Problem: CF 2237 E
// Contest: Codeforces - Order Capital Round 2 (Codeforces Round 1104, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2237/problem/E
// Time: 2026-06-19 16:45:00
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

    vector<int> a(n + 1), b(n + 1);

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        cin >> b[i];

    vector<bool> vis(n + 1, false);

    // 递推
    for (int i = 1; i <= n; i++)
    {
        if (!vis[i] && b[i] != -1)
        {
            int j = i;

            while (!vis[j])
            {
                vis[j] = true;

                int x = a[b[j]];
                int y = b[a[j]];

                if (y == -1)
                {
                    b[a[j]] = x;
                }
                else if (x != y)
                {
                    cout << "NO" << endl;
                    return;
                }

                j = a[j];
            }
        }
    }

    // 统计已经被确定的部分
    vector<int> cnt(n + 1);

    for (int i = 1; i <= n; i++)
    {
        if (b[i] != -1 && vis[i])
            cnt[b[i]]++;
    }

    for (int i = 1; i <= n; i++)
    {
        if (cnt[i] > 1)
        {
            cout << "NO" << endl;
            return;
        }
    }

    vector<int> vis1(n + 1), vis2(n + 1);
    vector<vector<int>> c1(n + 1), c2(n + 1);

    // 收集还没有填的源环
    for (int i = 1; i <= n; i++)
    {
        if (!vis1[i] && b[i] == -1)
        {
            int j = i, len = 0;

            while (!vis1[j])
            {
                vis1[j] = 1;
                len++;
                j = a[j];
            }

            c1[len].push_back(i);
        }
    }

    // 收集还没有被使用的目标环
    for (int i = 1; i <= n; i++)
    {
        if (!vis2[i] && cnt[i] == 0)
        {
            int j = i, len = 0;

            while (!vis2[j])
            {
                vis2[j] = 1;
                len++;
                j = a[j];
            }

            c2[len].push_back(i);
        }
    }

    // 同长度环配对，并填充 b
    for (int i = 1; i <= n; i++)
    {
        if (c1[i].size() != c2[i].size())
        {
            cout << "NO" << endl;
            return;
        }

        for (int j = 0; j < (int) c1[i].size(); j++)
        {
            int x = c1[i][j];
            int y = c2[i][j];

            while (b[x] == -1)
            {
                b[x] = y;
                x = a[x];
                y = a[y];
            }
        }
    }

    cout << "YES" << endl;

    for (int i = 1; i <= n; i++)
        cout << b[i] << " \n"[i == n];
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

