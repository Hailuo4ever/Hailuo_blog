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

