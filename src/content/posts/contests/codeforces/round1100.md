---
title: cf round 1100
published: 2026-05-24
description: "Codeforces Round 1100 (Div.2)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1100.(Div. 2)](https://codeforces.com/contest/2229)

# A - Slimes on a Line

> 关键词：思维

## 思路

我们要选择使得 $\max(y - \mathrm{mn}, \mathrm{mx} - y)$ 最小化的 $y$，也就是最接近最小值和最大值中点的值，即 $\lceil \frac{\mathrm{mx} - \mathrm{mn}}{2} \rceil$。

## Code

```c++
// Problem: CF 2229 A
// Contest: Codeforces - Spectral::Cup 2026 Round 2 (Codeforces Round 1100, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2229/problem/A
// Time: 2026-05-24 15:07:40
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int T;
    cin >> T;

    while (T--)
    {
        int n;
        cin >> n;

        vector<int> a(n);
        for (int i = 0; i < n; i++)
            cin >> a[i];

        sort(a.begin(), a.end());

        cout << (a[n - 1] - a[0] + 1) / 2 << endl;
    }
    return 0;
}

```

# B - Absolute Cinema

> 关键词：贪心

## 思路

首先我们贪心地把大元素分给 $b$ 数组，这样是不会更差的，然后剩下的元素，从所有数对的较小值里面找最大值即可。

## Code

```c++
// Problem: CF 2229 B
// Contest: Codeforces - Spectral::Cup 2026 Round 2 (Codeforces Round 1100, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2229/problem/B
// Time: 2026-05-24 15:21:18
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n), b(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = 0; i < n; i++)
        cin >> b[i];

    ll tmp = 0;
    for (int i = 0; i < n; i++)
        tmp += max(a[i], b[i]);


    ll res = 0;
    for (int i = 0; i < n; i++)
        res = max(res, tmp + min(a[i], b[i]));

    cout << res << endl;
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

# C1 - We Be Flipping (Easy Version)

> 关键词：思维，贪心

## 思路

一次操作可以选择一个当前为正的位置 $i$，然后反转前缀 `1 ~ i`，最优解一定是所有元素都为负的。

我们考虑是否可以让所有元素都变成负的，答案是可以的。这里有一个贪心策略，只要数组里还有正数，就选择最靠右的正数 $i$ 来进行操作。由于 $i$ 是最靠右的正数，所以 $i+1\sim n$ 本来就全是负数。操作后它们仍然全是负数。因此操作后，最靠右的正数位置一定严格向左移动。满足题目最多执行 $n$ 次操作的要求。

代码实现上，我们可以用一个变量 $rev$ 来记录前面的位置是否被反转过奇数次。如果 $rev=0$，当前位置真实符号就是原符号；如果 $rev=1$，当前位置真实符号就是相反符号。每当目前位置真实值为正时，就需要操作当前位置 $i$。执行操作 $i$ 后，对左边所有位置都会产生一次翻转，所以令 $rev \leftarrow rev \oplus 1$。

## Code

```c++
// Problem: CF 2229 C1
// Contest: Codeforces - Spectral::Cup 2026 Round 2 (Codeforces Round 1100, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2229/problem/C1
// Time: 2026-05-25 21:36:34
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

    int rev = 0;
    vector<int> res;
    for (int i = n - 1; i >= 0; i--)
    {
        if (rev == 1 && a[i] < 0)
            res.push_back(i + 1), rev ^= 1;
        else if (rev == 0 && a[i] > 0)
            res.push_back(i + 1), rev ^= 1;
    }

    if (!res.size())
    {
        cout << 0 << endl << endl;
        return;
    }
    else
    {
        cout << res.size() << endl;
        for (auto i: res)
            cout << i << " ";
        cout << endl;
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

# C2 - We Be Flipping (Hard Version)

> 关键词：思维，贪心，构造

## 思路

### Step 1 - 转化操作为表达式

题目要求选择索引 $i$（前提是此时 $a_i > 0$），将 $a_1 \dots a_i$ 全部翻转。 我们尝试不考虑中间过程，**考虑每个元素最终是被翻转了还是没被翻转**。

设 $S$ 为我们选择的操作索引集合，$c_i \in \{0, 1\}$ 表示元素 $a_i$ 最终被翻转的次数的奇偶性（$c_i = 1$ 表示符号改变，$c_i = 0$ 表示符号不变）。因为一次在 $x$ 的操作会翻转所有 $1 \le j \le x$ 的元素，所以 $a_i$ 被翻转的总次数等于 $S$ 中大于等于 $i$ 的元素的个数。

根据第一问，设 $c_{n+1} = 0$，这里有一个递推关系：$c_i = c_{i+1} \oplus [i \in S]$。也就是说，$i \in S$ 当且仅当 $c_i \neq c_{i+1}$。

**如果 $c_i \neq c_{i+1}$（即我们对索引 $i$ 进行了操作），那么 $a_i$ 在最终数组里的符号必然是负号**。

> - 若 $c_i=1, c_{i+1}=0$，说明 $i$ 是翻转区间的右端点，要求原本 $a_i > 0$，翻转 1 次后变负。
> - 若 $c_i=0, c_{i+1}=1$，说明 $i$ 是不翻转区间的右端点，因为之前被翻转了偶数次，操作它时它必须大于 0，意味着它最初 $a_i < 0$，且最终不变号，依然是负。

### Step 2 - 考虑限制条件

我们知道了 $c_i$ 与 $S$ 的关系，那是不是所有组合都能达到呢？

假设我们选定了一个目标集合 $S$，其中最大的索引设为 $m = \max(S)$。 因为没有比 $m$ 更大的操作了，所以在对 $m$ 进行操作时，$a_m$ 从未被前面的操作波及过。因此，要满足操作条件，**最初的 $a_m$ 必须大于 0**。

所以，任何一个最终状态 $c$ 是合法的，当且仅当：

- 所有 $c_i = 0$（不进行任何操作）。
- 或者，**$c$ 中最右边的一个 1 所在的索引 $m$，必须满足初始 $a_m > 0$。** （因为最右边的 1 刚好对应 $c_m=1, c_{m+1}=0$，即 $m = \max(S)$）。

### Step 3 - 考虑如何最大化总和

理想情况下我们希望负数都变正（$c_i=1$），正数都不变（$c_i=0$），这样能得到绝对值之和。

但根据上面的合法性条件，如果 $c$ 中有 $1$，最右边的那个 $1$（设为位置 $m$）必须付出代价：原本 $a_m > 0$，变成 $c_m=1$ 后，最终会变成 $-a_m$。

首先当然要考虑什么都不做，总和为 $\sum_{i=1}^n a_i$，然后枚举最右边的 $1$ 所在的索引 $m$，此时总和为 $\sum_{i=1}^{m-1} |a_i| - a_m + \sum_{i=m+1}^n a_i$，取所有 $m$ 的最大值。同时可以确定最优的 $c$ 数组。

### Step 4 - 构造答案

找到最优的 $c$ 后，我们得到集合 $S = \{i \mid c_i \neq c_{i+1}\}$。现在需要将 $S$ 里的索引排出一个合法的执行顺序。

将 $S$ 从小到大排序，从左到右遍历 $S$ 中的元素 $x$。

如果原本 $a_x < 0$，说明它现在不能直接操作，我们把它**放进一个暂存区**。

如果原本 $a_x > 0$，说明它是合法的，我们直接**输出 $x$**。

注意到当操作了 $x$ 之后，暂存区里所有比 $x$ 小的元素都被翻转了。它们原本都小于 0，现在全部大于 0，所以我们紧接着**把暂存区里的元素按从小到大的顺序输出**，然后清空暂存区。由于最大的 $m \in S$ 必然满足 $a_m > 0$，所以遍历到最后，暂存区一定会被完全清空。

## Code

```c++
// Problem: CF 2229 C2
// Contest: Codeforces - Spectral::Cup 2026 Round 2 (Codeforces Round 1100, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2229/problem/C2
// Time: 2026-05-25 21:47:51
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

    vector<ll> a(n + 1);
    vector<ll> pre(n + 1), suf(n + 2);

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        pre[i] = pre[i - 1] + abs(a[i]);
    }

    for (int i = n; i >= 1; i--)
        suf[i] = suf[i + 1] + a[i];

    ll best = suf[1];
    int pos = -1;

    for (int i = 1; i <= n; i++)
    {
        if (a[i] > 0)
        {
            ll cur = pre[i - 1] - abs(a[i]) + suf[i + 1];

            if (cur > best)
            {
                best = cur;
                pos = i;
            }
        }
    }

    if (pos == -1)
    {
        cout << 0 << endl;
        cout << endl;
        return;
    }

    vector<int> res;

    int rev = 0;

    for (int i = pos - 1; i >= 1; i--)
    {
        bool positive;

        if (rev == 0)
            positive = a[i] > 0;
        else
            positive = a[i] < 0;

        if (positive)
        {
            res.push_back(i);
            rev ^= 1;
        }
    }
    res.push_back(pos);
    cout << res.size() << endl;

    for (int x: res)
        cout << x << ' ';
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



# D -Me When Median Problem

> 关键词：二分答案

## 思路

要求最小值最大，考虑二分答案。

> 如果某个值 $x$ 可以做到：$\min(a_1,b_1)\ge x$，那么对于任意更小的 $y < x$，一定可以做到 $\min(a_1,b_1)\ge y$，所以答案具有单调性。

我们只想知道最终结果能不能 $\ge X$，因此可以抛弃原来的数字。如果我们将数组中所有 $\ge X$ 的数视为 $1$，$< X$ 的数视为 $0$。那么问题就变成了：**在一系列操作后，最终剩下的 $a_1$ 和 $b_1$ 能不能都是 $1$ ？**

每次操作，我们从 $a$ 和 $b$ 的对应位置取出 4 个数 $S = \{a_i, a_{i+1}, b_i, b_{i+1}\}$，排好序后，把第二小给 $a$，第三小给 $b$。

由于我们现在只有 $0$ 和 $1$，对于任意位置 $i$，我们定义它的**能量状态 $C_i$** 为 $a_i$ 和 $b_i$ 的和。显然 $C_i \in \{0, 1, 2\}$：

- **$C_i = 2$**：两个数都是 $1$。
- **$C_i = 1$**：一个 $1$ 一个 $0$。
- **$C_i = 0$**：两个数都是 $0$。

当我们合并位置 $i$ 和 $i+1$ 时，我们拿出了 $4$ 个 $0/1$ 变量，它们的总和就是 $C_i + C_{i+1}$。

排序后取中间两个，考虑如何计算新的状态 $C'$ 。

- 如果总和 $\ge 3$（例如四个数是 $1,1,1,0$），中间两个必然都是 $1$，所以 $C' = 2$。
- 如果总和 $= 2$（例如四个数是 $1,1,0,0$），中间两个必然是一 $0$ 一 $1$，所以 $C' = 1$。
- 如果总和 $\le 1$（例如四个数是 $1,0,0,0$），中间两个必然都是 $0$，所以 $C' = 0$。

可以总结出一个合并法则：$C' = \min(2, \max(0, C_i + C_{i+1} - 1))$

>$2 + 2 \to 2$
>
>$2 + 1 \to 2$
>
>$1 + 1 \to 1$
>
>$2 + 0 \to 1$
>
>$1 + 0 \to 0$
>
>$0 + 0 \to 0$

形象的来看，可以把 $2$ 看作正电荷，$1$ 看作中性电荷，$0$ 看作异性电荷，合并操作可以视作电荷相加，有以下几条规律：

1. 中性电荷不影响答案的计算，意味着可以删掉所有的 $C_i=1$。
2. 同性电荷不叠加：相邻的两个负电荷可以压缩成一个，正电荷也可以，但我们不希望压缩正电荷，因为希望它尽可能多。
3. 异性电荷相抵消：一个 $+1$ 遇到一个 $-1$，合并结果是 $0$。

我们的目标是：经过所有操作后，最终只剩下一个元素，且它的状态必须是 $2$（即**最终留下一个正电荷**）。

为了让最后留下来的是 $2$，我们手中的筹码（$2$ 的总个数）必须**严格大于**连续 $0$ 的块数。 因为每次用一个 $2$ 去碰一个 $0$ 的块，它们就会消失。只要我们的 $2$ 比 $0$ 的块数多，不管怎么操作，最后一定能剩下一个 $2$。

**综上，判断某个答案 $x$ 合法的条件为：在忽略所有 $1$ 的情况下，数组中 $2$ 的总个数 $>$ 连续 $0$ 的块数。**

> [!NOTE]
>
> 总结：对于这种只关心“大小关系”的题目，可以抽象成 $0$ 和 $1$ 来做，并忽略原数字。

## Code

```c++
// Problem: CF 2229 D
// Contest: Codeforces - Spectral::Cup 2026 Round 2 (Codeforces Round 1100, Div. 1 + Div. 2)
// URL: https://codeforces.com/contest/2229/problem/D
// Time: 2026-05-26 22:49:34
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

    auto check = [&](int mid) -> bool
    {
        vector<int> c(n + 1);
        int cnt = 0;
        for (int i = 1; i <= n; i++)
            c[i] = (a[i] >= mid) + (b[i] >= mid);

        for (int i = 1; i <= n; i++)
        {
            if (c[i] == 0)
            {
                while (i + 1 <= n && c[i + 1] != 2)
                    i++;
                cnt--;
            }
            else if (c[i] == 2)
                cnt++;
        }

        return cnt > 0;
    };

    int l = 0, r = 2 * n + 1;
    while (l + 1 < r)
    {
        int mid = (l + r) >> 1;
        if (check(mid))
            l = mid;
        else
            r = mid;
    }

    cout << l << endl;
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

