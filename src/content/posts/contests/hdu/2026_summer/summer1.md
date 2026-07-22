---
title: 2026 杭电多校1
published: 2026-07-21
description: "HDU Multi-University Training Contest 1"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营1](https://acm.hdu.edu.cn/contest/problems?cid=1229)

# 1001 - 小丑牌

> 关键词：枚举

## 思路

设 $x+a_i$ 的最小/最大值分别为 $x^-$ 和 $x^+$，$y+b_i$ 的最小/最大值分别为 $y^-$ 和 $y^+$。

答案一定是 $x^-y^+$，$x^-y^-$，$x^+y^-$，$x^+y^+$ 中的最大值。**为了处理不选的情况，向数组 $a,b$ 中手动加一个 $0$ 即可。**

然后枚举两个数组即可。

## Code

```c++
// Problem: 小丑牌
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1229&pid=1001
// Time: 2026-07-21 12:21:40
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
    ll x, y, n, m;
    cin >> x >> y >> n >> m;

    vector<ll> a(n + 1), b(m + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    for (int i = 1; i <= m; i++)
        cin >> b[i];

    a[0] = 0, b[0] = 0;

    ll xmin = INF, xmax = -INF, ymin = INF, ymax = -INF;
    for (int i = 0; i <= n; i++)
    {
        ll s = x + a[i];
        xmin = min(xmin, s), xmax = max(xmax, s);
    }

    for (int i = 0; i <= m; i++)
    {
        ll s = y + b[i];
        ymin = min(ymin, s), ymax = max(ymax, s);
    }

    ll res = max({xmin * ymin, xmin * ymax, xmax * ymin, xmax * ymax});
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

# 1006 - 开关灯

> 关键词：概率论、条件期望

## 思路



# 1010 - 游戏

> 关键词：博弈论，前后缀

## 思路

考虑 $n=1$ 的情况。此时只有一堆，`Alice` 无法操作，必输。

考虑 $n=2$ 的情况。此时 `Alice` 可以全部把第一堆移到第二堆，必胜。

考虑 $n=3$ 的情况。设初始为 $[x_1,x_2,x_3]$，`Alice` 只能不断操作 $x_1$，`Bob` 只能不断操作 $x_2$。因为每次最少移动一颗，`Alice` 最多可以让自己的外侧堆坚持 $x_1$ 回合，`Bob` 最多可以让自己的外侧堆坚持 $x_3$ 回合。因此 $n=3$ 时答案为 $x_1>x_3$。**如果 $x_1=x_3$，`Alice` 反而会先遇到无法操作的局面。**

`Alice` 从左向右操作，当她已经搬空前 $i-1$ 堆石子后，这些石子全部被放到了第 $i$ 堆中。因此 `Alice` 从左向右每一层能够操作的石子总数即为前缀和，`Bob` 从右向左为后缀和。

> [!NOTE]
>
> 赛时想的是前缀和的前缀和，也就是把这些石子逐颗向中间移动所需要的总距离。但玩家一次可以移动任意多颗石子，而不是每次只能移动一颗，因此总移动距离不能决定胜负。
>
> 实际上，**最靠近中心的石子是最重要的。**

设我们选定某一堆作为最后汇合的中间堆。`Alice` 最终要把左边所有石子向中间搬，`Bob` 最终要把右边所有石子向中间搬。真正首先决定胜负的是 `Alice` 和 `Bob` 在最靠近中间的位置，谁能多操作一次。因此要先比较最靠近中间的累计石子数。

我们将 $a[mid]$ 看作最后汇合的位置，第一层比较 $pre_{mid-1},suf_{mid+1}$，如果 $pre_{mid-1}>suf_{mid+1}$，说明 `Alice` 在靠近中间这一层能比 `Bob` 坚持的多，如果 $pre_{mid-1}<suf_{mid+1}$，说明 `Bob` 多。只有二者相等时，才需要继续向外比较，直到找到第一对不同的数。

假如匹配到最后全部相等，考虑将 $n$ 分奇偶讨论。$n$ 为奇数时，`Bob` 可以和 `Alice` 对称，最终 `Alice` 会遇到无法操作的状态。$n$ 为偶数时，如 $[1,1,1,1]$，取 $mid=2$，中间堆是第三堆（因为 `Alice` 先手，并且 `Alice` 从左向右移动，因此应该选右边的中间位置，也就是第三堆）。`Alice` 左边有两层，`Bob` 右边只有一层。如果前面所有能够配对的位置都相等，`Alice` 左边还会额外剩下一层，所以答案仍然是 $YES$。

## Code

```c++
// Problem: 游戏
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1229&pid=1010
// Time: 2026-07-21 12:00:49
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
    cin >> n;

    vector<ll> a(n), pre(n), suf(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        pre[i] = a[i];

        if (i > 0)
            pre[i] += pre[i - 1];
    }

    for (int i = n - 1; i >= 0; i--)
    {
        suf[i] = a[i];

        if (i + 1 < n)
            suf[i] += suf[i + 1];
    }

    int mid = n / 2;
    int l = mid - 1, r = mid + 1;

    while (l >= 0 && r < n && pre[l] == suf[r])
        l--, r++;

    if (l < 0)
        cout << "NO" << endl;
    else if (r >= n)
        cout << "YES" << endl;
    else
        cout << (pre[l] > suf[r] ? "YES" : "NO") << endl;
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

