---
title: 2026 牛客多校10
published: 2026-08-19
description: "Nowcoder Multi-University Training Contest 10"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营10](https://ac.nowcoder.com/acm/contest/133885)

# A - Natsuhikage

> 关键词：计算几何

## 思路

![](https://img.hailuo4ever.com/nowcoder/summer_2026_10_img1.jpg)

## Code

```c++
// Problem: Natsuhikage
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133885/A
// Time: 2026-08-19 18:53:21
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
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
const int N = 0;
const ll INF = 4e18;
const ll mod = 1;

template<class T>
struct Point
{
    T x, y;

    Point(const T &x = 0, const T &y = 0) : x(x), y(y) {}

    template<class U>
    operator Point<U>() const
    {
        return Point<U>(U(x), U(y));
    }

    Point &operator+=(const Point &other)
    {
        x += other.x;
        y += other.y;
        return *this;
    }

    Point &operator-=(const Point &other)
    {
        x -= other.x;
        y -= other.y;
        return *this;
    }

    Point &operator*=(const T &k)
    {
        x *= k;
        y *= k;
        return *this;
    }

    Point &operator/=(const T &k)
    {
        x /= k;
        y /= k;
        return *this;
    }

    Point operator-() const
    {
        return {-x, -y};
    }

    friend Point operator+(Point a, const Point &b)
    {
        return a += b;
    }

    friend Point operator-(Point a, const Point &b)
    {
        return a -= b;
    }

    friend Point operator*(Point a, const T &k)
    {
        return a *= k;
    }

    friend Point operator*(const T &k, Point a)
    {
        return a *= k;
    }

    friend Point operator/(Point a, const T &k)
    {
        return a /= k;
    }

    friend bool operator==(const Point &a, const Point &b)
    {
        return a.x == b.x && a.y == b.y;
    }

    friend bool operator!=(const Point &a, const Point &b)
    {
        return !(a == b);
    }

    friend istream &operator>>(istream &is, Point &p)
    {
        return is >> p.x >> p.y;
    }

    friend ostream &operator<<(ostream &os, const Point &p)
    {
        return os << "(" << p.x << ", " << p.y << ")";
    }
};

template<class T>
struct Line
{
    Point<T> a, b;

    Line(const Point<T> &a = Point<T>(), const Point<T> &b = Point<T>()) : a(a), b(b) {}
};

template<class T>
T dot(const Point<T> &a, const Point<T> &b)
{
    return a.x * b.x + a.y * b.y;
}

template<class T>
T cross(const Point<T> &a, const Point<T> &b)
{
    return a.x * b.y - a.y * b.x;
}
template<class T>
T square(const Point<T> &p)
{
    return dot(p, p);
}

template<class T>
long double length(const Point<T> &p)
{
    return sqrtl((long double) square(p));
}

const ld pi = acos(-1);

void solve()
{
    Point<ld> s, a, b;
    cin >> s >> a >> b;

    ld phi = atan2(s.y, s.x), coef = length(a) / sin(phi);
    ld mn = INF, mx = 0;

    auto calc = [&](ld theta) -> void
    {
        ld res = coef * abs(sin(theta - phi));
        mx = max(res, mx), mn = min(res, mn);
    };

    ld l = atan2(a.y, a.x), r = atan2(b.y, b.x);
    calc(l), calc(r);

    if (phi + pi / 2 >= l && phi + pi / 2 <= r)
        calc(phi + pi / 2);

    if (phi - pi / 2 >= l && phi - pi / 2 <= r)
        calc(phi - pi / 2);

    if (phi >= l && phi <= r)
        calc(phi);

    cout << fixed << setprecision(15) << mn << ' ' << mx << endl;
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

# B - Slot Machine

> 关键词：期望，Ad-hoc

## 思路

我们把所有随机数想象出来，考虑每次操作。第一次操作为从 $n$ 个随机数中取最大值，再重新生成一个。第二次操作前，总共已经生成过 $n+1$ 个随机数，到了第 $k$ 次操作前，总共已经生成了 $n+k-1$ 个随机数。因此需要考虑的是 $N=n+k-1$ 个独立均匀随机变量。

一个关键的结论是，取出的数就是前 $k$ 大的数。假设我们操作前，已经出现了 $n$ 个随机数。我们取走最大值，接下来插入一个新的随机数。这个新的随机数不管是比较大还是比较小，我们都会取前 $k$ 大的数。因此我们得到结论：**进行 $k$ 次操作后，取出的是 $N$ 个随机变量中的前 $k$ 大**。

考虑如何计算均匀分布的第 $i$ 大期望。这里用一种几何的方式理解。

我们先研究第 $j$ 小的期望。把 $N$ 个随机点放进区间  $[0,m]$，然后从小到大排序，并把 $0$ 和 $m$ 放在两端。

```c++
0 ---- X1 ---- X2 ---- X3 ---- ... ---- XN ---- m
```

总共切出来了 $N+1$ 段。由于所有随机点完全对称，这些间隔的期望长度相同，总长度是 $m$，因此每一段的长度是 $\frac{m}{N+1}$。于是第 $j$ 个点距离 $0$ 跨越了 $j$ 个间隔，所以 $E[X_{(j)}]=\frac{jm}{N+1}$。

第 $i$ 大等价于第 $N-i+1$ 小。代入 $N=n+k-1$，得到 $N-i+1=n+k-i$，且 $N+1=n+k$。因此 ${E[\text{第 }i\text{ 大}]=\frac{n+k-i}{n+k}m}$。

我们需要前 $k$ 大的期望总和，利用期望的线性性，即 $E[X_1+\cdots+X_k]=E[X_1]+\cdots+E[X_k]$。得到答案为 $\sum_{i=1}^{k}\frac{n+k-i}{n+k}m$。

还可以提取系数，利用等差数列优化到 $O(1)$。

## Code

```c++
// Problem: Slot Machine
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133885/B
// Time: 2026-08-20 00:11:55
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
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
const int N = 0;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    ld n, m, k;
    cin >> n >> m >> k;

    ld res = 0;
    for (int i = 1; i <= k; i++)
        res += (n + k - i) / (n + k) * m;
    cout << fixed << setprecision(10) << res << endl;
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



# L - Reaper

> 关键词：思维

## 思路

首先观察到，在每次使用技能前，把当前弹夹打空一定不劣。我们定义 $k$ 表示：两次技能之间一共打空多少个弹夹。一个弹夹有 $m$ 发，因此总共射出了 $km$ 发子弹。由于最后一次打完弹夹以后就开技能了，因此换弹次数为 $k-1$。所以总共花的时间是 $km+(k-1)r$。

考虑技能的 $c$ 秒冷却。如果 $km+(k-1)r<c$，那么只能等到第 $c$ 秒，所以周期长度是 $c$。否则打完以后技能早就转好了，因此应该马上用。所以平均射速为 ${v_k=\frac{km}{\max\left(c,\;km+(k-1)r\right)}}$。

这个函数是一个单峰函数。考虑它的实数解为 ${k^*=\frac{c+r}{m+r}}$，即 $k$ 取到这个实数时，射速理论最大。但由于 $k$ 是整数，所以检查这个分数的下取整和上取整即可。

## Code

```c++
// Problem: Reaper
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133885/L
// Time: 2026-08-19 13:32:26
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
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
const int N = 0;
const ll INF = 4e18;
const ll mod = 1;

void solve()
{
    int m, r, c;
    cin >> m >> r >> c;

    cout << fixed << setprecision(12);

    int k = c / (m + r) + 1;

    auto calc = [&](int k) -> ld
    {
        ld res = (ld) k * m / max((ld) c, (ld) k * m + (k - 1) * r);
        return res;
    };

    // cerr << "k = " << k << endl;
    // cerr << "k * m + (k - 1) * r = " << k * m + (k - 1) * r << endl;
    cout << max(calc(k), calc(k + 1)) << endl;
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

