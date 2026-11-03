---
title: 2024 icpc 四川省赛
published: 2026-11-03
description: "The 2025 ICPC China Sichuan Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2024 ICPC China Sichuan Provincial Programming Contest - Dashboard - Contest - QOJ.ac](https://qoj.ac/contest/1862)

# E - L-Covering Checker

> 关键词：模拟

## 思路

没啥技巧，直接模拟就行，两重循环枚举四个方向，过掉方向相同和相反的情况。然后在方向已经合法的前提下，再去检查对应的格子的字母是否满足指向中心的 $C$。我们给每个 $C$ 及其组成部分赋上一个编号。同时注意，不能有超过 $1$ 个未被覆盖的点，不能有出现次数不为 $3$ 的点。

## Code

```c++
// Problem: E
// Contest: QOJ - The 2024 ICPC China Sichuan Provincial Programming Contest
// URL: https://qoj.ac/contest/1862/problem/9667/statement/zh_cn
// Time: 2026-11-03 14:18:06
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

map<int, char> pos;

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<vector<char>> g(n + 1, vector<char>(m + 1));
    vector<vector<int>> g2(n + 1, vector<int>(m + 1));
    vector<pii> idxx;

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
        {
            cin >> g[i][j];
            if (g[i][j] == '.')
                idxx.eb(i, j);
        }
    }

    if (idxx.size() != 1 || idxx[0] != make_pair(1, m))
    {
        cout << "No" << endl;
        return;
    }

    int idx = 1;

    auto modify = [&](int x, int y) -> void
    {
        for (int i = 0; i < 4; i++)
        {
            int nx = x + dx[i], ny = y + dy[i];
            if (nx < 1 || nx > n || ny < 1 || ny > m || g[nx][ny] != pos[i])
                continue;

            if (i == 1 || i == 3)
            {
                if (g[nx][ny] != 'L' && g[nx][ny] != 'R')
                    continue;
            }

            for (int j = 0; j < 4; j++)
            {
                if (j == i)
                    continue;

                int nx2 = x + dx[j], ny2 = y + dy[j];
                if (nx2 < 1 || nx2 > n || ny2 < 1 || ny2 > m || g[nx2][ny2] != pos[j])
                    continue;

                if (j == 1 || j == 3)
                {
                    if (g[nx2][ny2] != 'L' && g[nx2][ny2] != 'R')
                        continue;
                }

                string s = {g[nx][ny], g[nx2][ny2]};
                vector<pii> vec = {{nx, ny}, {nx2, ny2}};
                assert(s.size() == 2);

                if (s[0] > s[1])
                    swap(s[0], s[1]), swap(vec[0], vec[1]);

                if (s == "LU" || s == "RU" || s == "DL" || s == "DR")
                {
                    if (!g2[nx][ny] && !g2[nx2][ny2])
                        g2[x][y] = idx, g2[nx][ny] = idx, g2[nx2][ny2] = idx, ++idx;
                }
            }
        }
    };

    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= m; j++)
            if (g[i][j] == 'C')
                modify(i, j);
    }

    vector<int> cnt(idx + 1);
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            cnt[g2[i][j]]++;

    if (cnt[0] > 1)
    {
        cout << "No" << endl;
        return;
    }

    for (int i = 1; i <= idx - 1; i++)
    {
        if (cnt[i] != 3)
        {
            cout << "No" << endl;
            return;
        }
    }

    cout << "Yes" << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    pos[0] = 'D', pos[1] = 'L', pos[2] = 'U', pos[3] = 'R';

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# F - 小球进洞：平面版

> 关键词：计算几何

## 思路

要求整个圆在某个时刻位于矩形内部，假设当前圆心为 $P=(p_x,p_y)$，要让整个圆进入矩形，就需要上下左右四个方向都不超出矩形，整理四个式子，可以得到两个不等式：$\boxed{l_x+r\le p_x\le r_x-r}$，$\boxed{l_y+r\le p_y\le r_y-r}$。也就是圆心坐标必须满足这两个不等式。

实际上这个限制是一个矩形，我们可以把原来的矩形缩小一下。在这里可以首先检验这个矩形的合法性。

然后可以发现，圆心可能的坐标取值是一条射线，从给定圆心开始，沿着给定向量，经过参数时间 $t$ 后，圆心的位置为 $\begin{cases} p_x=x+tv_x\\ p_y=y+tv_y \end{cases} \qquad t\ge 0$。



# H - GG and YY's Stone Game

> 关键词：博弈论

## 思路

枚举从 $1 \to 10$ 的全部 $n$，可以发现当 $n=3$ 的时候是必败态，因为不管取 $1$ 还是取 $2$ 都会进入对面的必胜态。

由于两位玩家都想赢并拿取更多的石子，考虑两种情况。

$n=3k$ 时，由于 $GG$ 无法获胜，他会拿取更多的石子，即每次取两个。$YY$ 为了赢只能一次取一个。

$n=3k+1$ 时，$GG$ 的策略是：为了赢，第一次取 $1$ 个石子，然后让 $YY$ 来取，$YY$ 因为已经必输，所以每次会拿两个，此时 $GG$ 每次再取一个。

$n=3k+2$ 时，$GG$ 第一次要取 $2$ 个石子，才能让剩下的石子变成 $3$ 的倍数，然后跟上述情况相同。

## Code

```c++
// Problem: H
// Contest: QOJ - The 2024 ICPC China Sichuan Provincial Programming Contest
// URL: https://qoj.ac/contest/1862/problem/9670
// Time: 2026-11-03 13:53:28
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

void solve()
{
    ll n;
    cin >> n;

    if (n % 3 == 0)
        cout << 1 << ' ' << n / 3 << endl;
    else
        cout << 0 << ' ' << n % 3 + n / 3 << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# L - 毛肚下清汤？

> 关键词：模拟

## Code

```c++
// Problem: L
// Contest: QOJ - The 2024 ICPC China Sichuan Provincial Programming Contest
// URL: https://qoj.ac/contest/1862/problem/9674/statement/zh_cn
// Time: 2026-11-03 14:01:47
#include <bits/stdc++.h>
#include <cassert>
using namespace std;

#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define eb emplace_back

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

mt19937 rnd(chrono::steady_clock::now().time_since_epoch().count());
int rand(int l, int r)
{
    return uniform_int_distribution<int>(l, r)(rnd);
}

struct Dish
{
    int a, b, c, d, id;
};

void solve()
{
    int n;
    cin >> n;

    vector<Dish> a(n + 1);
    vector<pii> rd, wt;

    for (int i = 1, aa, b, c, d; i <= n; i++)
    {
        cin >> aa >> b >> c >> d;
        a[i] = {aa, b, c, d, i};
    }

    for (int i = 1; i <= n; i++)
    {
        auto [aa, b, c, d, id] = a[i];
        if (c && d)
            aa < b ? rd.eb(aa, id) : wt.eb(b, id);
        else if (c)
            rd.eb(aa, id);
        else
            wt.eb(b, id);
    }

    sort(all(rd)), sort(all(wt));

    cout << rd.size() << " ";
    for (auto [x, y]: rd)
        cout << y << ' ';
    cout << endl;

    cout << wt.size() << " ";
    for (auto [x, y]: wt)
        cout << y << ' ';
    cout << endl;
}

int main()
{
    ios::sync_with_stdio(0), cin.tie(0);

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

