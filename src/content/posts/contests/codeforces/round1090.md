---
title: cf round 1090
published: 2026-05-10
description: "Codeforces Round 1090 (Div.4)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[Codeforces Round 1090 (Div. 4)](https://codeforces.com/contest/2218)

# A The 67th Integer Problem

> 关键词：签到

## Code

```c++
// Problem: CF 2218 A
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/A
// Time: 2026-05-10 09:12:17
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

    cout << 67 << endl;
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

# B - The 67th 6-7 Integer Problem

> 关键词：签到

## Code

```c++
// Problem: CF 2218 B
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/B
// Time: 2026-05-10 09:13:35
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
    vector<int> a(7);
    for (int i = 0; i < 7; i++)
        cin >> a[i];

    sort(all(a));

    int res = a[6] - a[0] - a[1] - a[2] - a[3] - a[4] - a[5];
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

# C - The 67th Permutation Problem

> 关键词：思维，贪心

## 思路

元素的具体位置不重要，我们只关心某个元素在它所在的三元组中里中位数，大元素，还是小元素。

考虑边界元素的情况：由于没有比 `3n` 更大的元素，它必然是三元组中的大元素，同理 `1` 一定是三元组中的小元素。

为了最大化中位数的和，我们应该选取当前可用的最大数作为中位数，也就是 `3n - 1`，因此 `{1, 3n - 1, 3n}` 构成了一个有效的三元组。

那么我们可以在其他子集上重复此过程，构造方案如下：$\{1, 3n-1, 3n\}, \{2, 3n-2, 3n-3\}, \cdots , \{n, 2n-1, 2n\}$

> 贪心正确性的证明如下：
>
> ![](https://img.hailuo4ever.com/codeforces/round_1090_img1.png)

## Code

```c++
// Problem: CF 2218 C
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/C
// Time: 2026-05-10 09:17:49
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

    int l = 1, r = 3 * n;
    for (int i = 0; i < n; i++)
    {
        cout << l << " " << r - 1 << " " << r << " ";
        l++, r -= 2;
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

# D - The 67th OEIS Problem

> 关键词：构造，质数

## 思路

题目要求：每个相邻数的最大公约数都不一样，遇到这种最大公约数的问题，我们考虑质数。

假设现在有一个全是质数的数组（可以把1也算进去）：`1, 2, 3, 5, 7, 11...`，直接相邻两项相乘即可构造出 `gcd` 不同的数组。每次的 `gcd` 都是右边的那个数。

题目要构造 `n` 项，我们直接预处理出给定数据范围内的所有质数，保证不会下标越界。

## Code

```c++
// Problem: CF 2218 D
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/D
// Time: 2026-05-10 09:44:42
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
const int N = 1e6 + 10;

vector<ll> primes;

void init()
{
    vector<bool> st(N + 1, false);
    primes.push_back(1);

    for (int i = 2; i <= N; i++)
    {
        if (!st[i])
        {
            primes.push_back(i);
            for (int j = i + i; j <= N; j += i)
                st[j] = true;
        }
    }
}

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
        cout << primes[i] * primes[i - 1] << " ";

    cout << endl;
}

int main()
{
    fastio();

    init();

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# E - The 67th XOR Problem

> 关键词；思维，位运算，枚举

## 思路

原数组为 $a = [a_1, a_2, a_3, \ldots, a_n]$，假设我们按顺序进行操作。

第一次操作后，数组变为 $a = [a_2 \oplus a_1, a_3 \oplus a_1, \ldots, a_n \oplus a_1]$，注意第一个元素 $a_1$ 被移除了。

第二次操作后，数组变为 $a = [(a_3 \oplus a_1) \oplus (a_2 \oplus a_1), \ldots, (a_n \oplus a_1) \oplus (a_2 \oplus a_1)]$，这等价于 $a = [a_3 \oplus a_2, \ldots, a_n \oplus a_2]$。

模拟这两次操作后，我们发现每次操作所选的元素并不影响最终结果。唯一影响最终结果的只有最后一次操作所选择的元素和那个一直没被选的元素。

由于 $n$ 的范围不大，直接暴力枚举所有可能的数对 $(x, y)$，答案是所有数对中 $a_x \oplus a_y$ 的最大值。

## Code

```c++
// Problem: CF 2218 E
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/E
// Time: 2026-05-10 10:11:11
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

    ll res = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            res = max(res, a[i] ^ a[j]);

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

# F - The 67th Tree Problem

> 关键词：构造

## 思路

我们首先考虑，**为什么会出现无解的情况**。

由于每产生一个大小为偶数的子树，它的内部必定至少包含一个大小为奇数的子树。因此**整棵树里的奇数子树数量 $y$ 永远不可能小于偶数子树数量 $x$**。

如果 $x=0$，那么总节点数 $N=y$ 必须是奇数，因为如果 $y$ 是偶数，根节点的子树大小就是偶数，意味着 $x$ 至少为 $1$。

**结论：当 $y < x$ 或者（$x = 0$ 且 $y$ 为偶数）时，必然输出 `NO`。其他情况全部都有解。**

下面我们**考虑构造策略。**

我们可以通过将以下两种类型的“组件”直接连接到根节点（节点 $1$）来构建整棵树：

- 长度为 2 的链：由两个节点组成的路径（例如 $1 \rightarrow u \rightarrow v$）。节点 $v$ 是叶子节点（奇数大小，为 $1$），节点 $u$ 拥有一个叶子节点（偶数大小，为 $2$）。每条这样的链能为我们提供刚好 $1$ 个偶数节点和 $1$ 个奇数节点。
- 孤立的叶子节点：直接连在根节点上的单个节点（例如 $1 \rightarrow w$）。节点 $w$ 是叶子节点，能为我们提供刚好 $1$ 个奇数节点。

> [!NOTE] 
>
> 这个思路是怎么想出来的？
>
> 实际上是一个化繁为简的过程，假如随便连，节点 $A$ 的子树大小会影响它的父节点 $B$，进而影响爷爷节点 $C$，所以我们考虑最简单的拓扑结构，也就是**所有的分支都直接连接在同一个“中心点”**，也就是根节点上，这样一来每个分支之间都是独立的，互不影响。
>
> 我们需要设计两种组件，一种能稳定产出奇数节点，一种能稳定产出偶数节点。
>
> 显然单独的叶子节点能产出一个奇数节点，而一个长度为 2 的链可以稳定提供 1 个偶数节点和 1 个奇数节点（因为有偶必有奇，所以不存在只产出 1 个偶数节点的组件）。

设 $c_2$ 为长度为 2 的链的数量，$c_1$ 为孤立叶子节点的数量。

情况 1：根节点的子树大小 $n$ 是偶数，既然我们总共需要 $x$ 个偶数节点，而根节点本身已经占了一个名额，所以我们需要用链来构造剩下的 $x - 1$ 个。

- 我们使用 **$c_2 = x - 1$** 条长度为 2 的链。
- 剩下的节点作为孤立叶子节点：$c_1 = n - 1 - 2c_2 = (x + y) - 1 - 2(x - 1) = y - x + 1$。
- 因为 $n$ 是偶数，说明 $x$ 和 $y$ 奇偶性相同，所以 $y - x$ 必定是偶数。又因为 $y \ge x$，得出 $c_1 \ge 1$。

情况 2：根节点的子树大小 $n$ 是奇数，我们需要全部依靠链来生成所需的 $x$ 个偶数节点。

- 我们使用 **$c_2 = x$** 条长度为 2 的链。
- 需要的孤立叶子节点数量为：$c_1 = n - 1 - 2c_2 = (x + y) - 1 - 2x = y - x - 1$。
- 因为 $n$ 是奇数，说明 $x$ 和 $y$ 奇偶性不同，所以 $y - x$ 是奇数。又因为 $y \ge x$ 且它们不相等，即 $y > x$，可以得出 $c_1 \ge 0$。

> [!NOTE]
>
> 总结：这道题的思考逻辑很有教育意义。我们先考虑哪些是不合法的，然后考虑化繁为简。

## Code

```c++
// Problem: CF 2218 F
// Contest: Codeforces - Codeforces Round 1090 (Div. 4)
// URL: https://codeforces.com/contest/2218/problem/F
// Time: 2026-05-10 10:56:03
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
    int x, y;
    cin >> x >> y;

    int n = x + y;

    if (x > y || (x == 0 && n % 2 == 0))
    {
        cout << "NO" << endl;
        return;
    }

    cout << "YES" << endl;

    int c2, c1;
    if (n % 2 == 0)
        c2 = x - 1, c1 = y - x + 1;
    else
        c2 = x, c1 = y - x - 1;

    int idx = 2;

    for (int i = 0; i < c2; i++)
    {
        cout << 1 << " " << idx << endl;
        cout << idx << " " << idx + 1 << endl;
        idx += 2;
    }

    for (int i = 0; i < c1; i++)
    {
        cout << 1 << " " << idx << endl;
        idx++;
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

