---
title: 2026 牛客多校1
published: 2026-07-17
description: "Nowcoder Multi-University Training Contest 1"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 牛客暑期多校训练营1](https://ac.nowcoder.com/acm/contest/133876)

# A - 2090 Virus

> 关键词：签到

## Code

```c++
// Problem: 2090 Virus
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133876/A
// Time: 2026-07-17 12:02:02
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
    string s;
    cin >> s;

    s = ' ' + s;

    bool flag = true;

    if (s.size() != 9)
    {
        flag = false;
        goto end;
    }

    for (int i = 1; i <= 8; i += 2)
        if (s[i] == 'a' || s[i] == 'e' || s[i] == 'i' || s[i] == 'o' || s[i] == 'u')
            flag = false;

    for (int i = 2; i <= 8; i += 2)
        if (s[i] != 'a' && s[i] != 'e' && s[i] != 'i' && s[i] != 'o' && s[i] != 'u')
            flag = false;

end:
    cout << (!flag ? "Well-Being" : "Suspected Virus") << endl;
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

# C - Fish Eating

> 关键词：带权并查集

## 思路

题目有两类操作：

1. 加入一条新鱼，且它的体型不小于之前所有鱼，询问它最多能吃多少条鱼
2. 对已有鱼增加初始体型，求吃完整个连通块所需的最小增加量

所有吃鱼过程都只是“假设”，不会改变网格。

首先考虑最多能吃多少鱼，一条鱼无论变得多大，也只能在它所在的**连通块**中移动。假设当前鱼所在连通块大小为 $s$，如果允许任意增加初始体型，它一定能吃掉连通块中的所有其他鱼，因此最多吃 $s-1$ 条。所以两种操作的“最多吃多少条”本质上都与连通块大小有关。

下面考虑操作。对于操作 $1$，新加入的鱼体型为 $v$，题目保证新鱼可以吃掉旧鱼，体型还会继续增加。因此新鱼能够吃掉它加入后所在连通块的全部其他鱼。若合并后的连通块大小为 $s$，操作 $1$ 的答案就是 $s-1$。这部分直接用并查集维护联通块大小即可。

对于操作 $2$，考虑一条鱼 $x$，原始体型为 $w_x$，我们将它增加到初始体型 $P$，假设它目前可以吃完整个旧连通块，旧连通块大小为 $s$。吃完旧连通块其他鱼后，一共吃了 $s-1$，此时体型变成 $P+s-1$。后来有一条体型为 $v$ 的新鱼，将这个旧连通块与其他区域连接起来。要想吃掉这条新鱼，必须满足 $P+s-1\ge v$，即 $P\ge v-s+1$。

> 解释一下这个式子：假设旧连通块有 $s=3$ 条鱼，后来加入一条体型为 $v=8$ 的鱼。从旧连通块中的某条鱼出发，初始体型为 $P$，它最多先吃掉旧连通块中的另外两条鱼，体型变为 $P+2$，要继续吃掉体型为 $8$ 的新鱼，就需要 $P+2 \ge 8$，因此 $P \ge 6$。也就是说，旧连通块中的每条鱼，要跨过这次合并，初始体型至少为 $6$。

考虑**连通块的合并过程**，我们让新来的鱼成为新连通块的根（因为它不需要增加体型就能吃掉所有的旧连通块），这是为了记录连通块的合并历史。从一条旧鱼不断向父亲走，就能看到它所在连通块后来经历的所有扩张情况。

```c++
          新鱼 u                                   
         /      \
    连通块 A   连通块 B
              
                                                                鱼 1      鱼 2
                                                                  \       /
                                                                   体型 2 的鱼
                                                                         \
                                                                        体型 8 的鱼
                                                                             \
                                                                            体型 9 的鱼
```

考虑**树边上记录什么** 。假设旧连通块根为 $r$，大小为 $s_r$，新加入的鱼体型为 $v$，新鱼节点为 $u$。令 $fa_r=u$，并在这条边上记录 $tag_r=v-s_r+1$，表示从旧连通块 $r$ 中的任意鱼出发，为了突破这次合并，初始体型至少需要达到 $v-s_r+1$。如果一条鱼经历了多次合并，就必须同时满足每一次合并的要求。所以它所需的最小初始体型，是路径上所有要求的最大值。

## Code

我们使用带权并查集。维护 `fa[x]` 表示 $x$ 当前在合并历史树中的父节点。维护 `mx[x]` 表示 $x$ 到 `fa[x]` 这段路径上的最大初始体型限制。

当旧连通块根 $r$ 被新鱼 $u$ 合并时：

```c++
fa[r] = u;
mx[r] = v - sz[r] + 1;
```

在路径压缩时维护父亲路径上的最大限制：

```c++
int find(int x)
{
    if (fa[x] == x)
        return x;

    int p = fa[x];
    fa[x] = find(p);
    mx[x] = max(mx[x], mx[p]);

    return fa[x];
}

// 压缩前，x -> p -> ... -> root
// mx[x] 保存从 x 到 p 的限制，递归执行 find(p) 后，mx[p] 保存从 p 到根的最大限制
// 从 x 到根的最大限制就是 max(mx[x], mx[p])
```

合并相邻格子时要去重，防止多个相邻格子属于同一个连通块时重复计数。先收集相邻格子的根，再排序去重，逐个挂到新节点下面。

# E - Permutation Evaluation

> 关键词：数学

## 思路

模拟样例，会发现得到 $p_1+2p_2+3p_3-3p_0-2p_1-p_2$，通解为 $ip_i-(n-i-1)p_i$。

因此，每个 $p_i$ 对答案的贡献是 $p_i \times (2i-n+1)$。

## Code

```c++
// Problem: Permutation Evaluation
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133876/E
// Time: 2026-07-17 18:45:03
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

    vector<ll> a(n);
    for (auto &x: a)
        cin >> x;

    ll res = 0;
    for (int i = 0; i < n; i++)
        res += (2 * i - n + 1) * a[i];

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

# F - Permutation Generation

> 关键词：构造

## 思路

考虑给所有元素加上一个数。假设我们选择一个整数 $d$，对排列中所有元素执行 $P'_i=(P_i+d)\bmod n$，也就是把每个数都在模 $n$ 意义下平移 $d$。例如 $n=5,d=2$，变换为 $0\to2,\quad1\to3,\quad2\to4,\quad3\to0,\quad4\to1$。

这样的变换有两个性质：

1. 变换后仍然是排列。对于两个不同的数 $a,b$，假如 $(a+d)\bmod n=(b+d)\bmod n$，那么 $a\equiv b\pmod n.$。而 $a, b$ 都在 $0 \to n-1$ 内，因此只能有 $a=b$。
2. 排列的权值在模 $n$ 意义下不变。由于 $P'_i=(P_i+d)\bmod n$，所以在模 $n$ 意义下有 $P'_i\equiv P_i+d\pmod n$。对于任意一对 $i<j$，有 $P'_j-P'_i\equiv (P_j+d)-(P_i+d)\equiv P_j-P_i\pmod n$。也就是说，每一项 $P_j-P_i$ 在模 $n$ 意义下都没有发生改变。因此这样的整体循环移位，始终保持权值不变。

综上，我们将 $k$ 位置换成 $x$，找出偏移量 $d$，对其余元素修改即可。

## Code

```c++
// Problem: Permutation Generation
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133876/F
// Time: 2026-07-17 18:51:53
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
    int n, k, x;
    cin >> n >> k >> x;

    vector<int> a(n);

    int d = 0;
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];

        if (i == k)
            d = (x - a[i] + n) % n;
    }

    for (int i = 0; i < n; i++)
    {
        int res = (a[i] + d) % n;
        cout << res << " \n"[i == n - 1];
    }
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

# G - Precision Error?!

> 关键词：构造，思维

## 思路

观察到题目要求的距离精度很低，我们考虑把整个点集构造为如下的类似二分图的形式：

```
z = 0 平面                  z = 1 平面

A0  A1  A2 ...             B0  B1  B2 ...
A10 A11 A12...             B10 B11 B12...
...                         ...

组内距离很小                组内距离很小
组间距离约为 1              组间距离约为 1
```

其中每个点都恰好和另一侧的 $n$ 个点建立距离为 $1$ 的关系。

考虑每组内如何构造。首先点不能距离太近，因为题目要求 $\operatorname{dis}(P,Q)>0.01$；并且整组点不能拉的太长。如果 $n=100$，那么第一个点和最后一个点相差 $99d$。即使取一个很小的合法值 $d=0.0101$，也有 $99d=0.9999$，这个距离太大了。

考虑把这个长直线压缩成一个二维网格。对于第 $i$ 个点，令 $\text{row}=\left\lfloor\frac{i}{10}\right\rfloor,
\quad
\text{col}=i\bmod 10$，取网格间距 $d=0.0105$。点在 $x,y$ 平面上的坐标为 $x=\text{col}\cdot d,
\quad
y=\text{row}\cdot d.$。

这样，同层最小距离为 $d=0.0105$，满足严格大于 $0.01$ 的要求；同层最大距离为 $\sqrt{(9d)^2+(9d)^2}
=9\sqrt2\,d$，$9\sqrt2\times0.0105\approx0.13364$，远小于 $0.99$。

## Code

```c++
// Problem: Precision Error?!
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133876/G
// Time: 2026-07-17 19:19:24
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
using ld = long double;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const ll INF = 4e18;
const int N = 0;

void solve()
{
    int n;
    cin >> n;

    const ld d = 0.0105;

    cout << 2 * n << endl;
    cout << fixed << setprecision(10);

    for (int i = 0; i < n; i++)
    {
        ld x = (i % 10) * d;
        ld y = (i / 10) * d;

        cout << x << ' ' << y << ' ' << 0.0 << endl;
    }

    for (int i = 0; i < n; i++)
    {
        ld x = (i % 10) * d;
        ld y = (i / 10) * d;

        cout << x << ' ' << y << ' ' << 1.0 << endl;
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

# J - Show Hand

> 关键词：模拟

## 思路

纯大模拟。首先使用 `using Score = array<int, 6>;` 表示一个牌型。其中 `score[0]` 为牌型编号，后面为相同牌型下，需要比较的信息。

对于每一个牌型函数，他们都需要知道：每个点数出现多少次、所有点数从小到大排列的情况、是否是同花、是否是顺子。

构造如下的 `Info`：

```c++
struct Info
{
    array<int, 15> cnt{}; // cnt[x] 表示点数x的出现次数
    vector<int> val; // 五个点数从大到小的排列
    bool flush; // 是否同花
    int straight; // 记录顺子的最高位置牌，不是顺子为0
};
```

对于每一个牌型函数，输入和输出相同：

```c++
bool 函数名(const Info &x, Score &res)
// 如果当前牌属于这个牌型，填写res并返回true
```

按照从强到弱来判断牌型。例如一副同花顺不应该被先判断为普通同花或普通顺子。

## Code

```c++
// Problem: Show Hand
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/133876/J
// Time: 2026-07-17 21:28:00
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

struct card
{
    int v, s;
};

struct info
{
    array<int, 15> cnt{};
    vector<int> val;
    bool flush = false;
    int straight = 0;
};

using score = array<int, 6>;

int get_val(char c)
{
    if (c >= '2' && c <= '9')
        return c - '0';
    if (c == 'T')
        return 10;
    if (c == 'J')
        return 11;
    if (c == 'Q')
        return 12;
    if (c == 'K')
        return 13;
    if (c == 'A')
        return 14;

    return -1;
}

int get_suit(char c)
{
    if (c == 'C')
        return 0;
    if (c == 'D')
        return 1;
    if (c == 'H')
        return 2;
    if (c == 'S')
        return 3;

    return -1;
}

card get_card(string s)
{
    return {get_val(s[0]), get_suit(s[1])};
}

int get_id(card c)
{
    return c.s * 13 + c.v - 2;
}

info get_info(vector<card> h)
{
    info x;

    for (auto [v, s]: h)
    {
        x.cnt[v]++;
        x.val.eb(v);
    }

    sort(x.val.rbegin(), x.val.rend());

    x.flush = true;

    for (int i = 1; i < 5; i++)
    {
        if (h[i].s != h[0].s)
            x.flush = false;
    }

    bool continuee = true;

    for (int i = 1; i < 5; i++)
    {
        if (x.val[i - 1] - 1 != x.val[i])
            continuee = false;
    }

    if (continuee)
        x.straight = x.val[0];
    else if (x.val == vector<int>{14, 5, 4, 3, 2})
        x.straight = 5;
    else
        x.straight = 0;

    return x;
}

bool royal(const info x, score &res)
{
    if (x.flush && x.straight == 14)
    {
        res = {9, 0, 0, 0, 0, 0};
        return true;
    }
    return false;
}

bool straight_flush(const info x, score &res)
{
    if (x.flush && x.straight)
    {
        res = {8, x.straight, 0, 0, 0, 0};
        return true;
    }

    return false;
}

bool four_kind(const info &x, score &res)
{
    int four = 0, one = 0;

    for (int v = 14; v >= 2; v--)
    {
        if (x.cnt[v] == 4)
            four = v;
        else if (x.cnt[v] == 1)
            one = v;
    }

    if (four)
    {
        res = {7, four, one, 0, 0, 0};
        return true;
    }

    return false;
}

bool full_house(const info &x, score &res)
{
    int three = 0, two = 0;

    for (int v = 14; v >= 2; v--)
    {
        if (x.cnt[v] == 3)
            three = v;
        else if (x.cnt[v] == 2)
            two = v;
    }

    if (three && two)
    {
        res = {6, three, two, 0, 0, 0};
        return true;
    }

    return false;
}

bool flush(const info &x, score &res)
{
    if (!x.flush)
        return false;

    res[0] = 5;

    for (int i = 0; i < 5; i++)
        res[i + 1] = x.val[i];

    return true;
}

bool straight(const info &x, score &res)
{
    if (!x.straight)
        return false;

    res = {4, x.straight, 0, 0, 0, 0};
    return true;
}

bool three_kind(const info &x, score &res)
{
    int three = 0;
    vector<int> one;

    for (int v = 14; v >= 2; v--)
    {
        if (x.cnt[v] == 3)
            three = v;
        else if (x.cnt[v] == 1)
            one.eb(v);
    }

    if (three)
    {
        res = {3, three, one[0], one[1], 0, 0};
        return true;
    }

    return false;
}

bool two_pair(const info &x, score &res)
{
    vector<int> two;
    int one = 0;

    for (int v = 14; v >= 2; v--)
    {
        if (x.cnt[v] == 2)
            two.eb(v);
        else if (x.cnt[v] == 1)
            one = v;
    }

    if (two.size() == 2)
    {
        res = {2, two[0], two[1], one, 0, 0};
        return true;
    }

    return false;
}

bool one_pair(const info &x, score &res)
{
    int two = 0;
    vector<int> one;

    for (int v = 14; v >= 2; v--)
    {
        if (x.cnt[v] == 2)
            two = v;
        else if (x.cnt[v] == 1)
            one.eb(v);
    }

    if (two)
    {
        res = {1, two, one[0], one[1], one[2], 0};
        return true;
    }

    return false;
}

bool high_card(const info &x, score &res)
{
    res[0] = 0;

    for (int i = 0; i < 5; i++)
        res[i + 1] = x.val[i];

    return true;
}

score get_score(const vector<card> &h)
{
    info x = get_info(h);
    score res{};

    if (royal(x, res))
        return res;

    if (straight_flush(x, res))
        return res;

    if (four_kind(x, res))
        return res;

    if (full_house(x, res))
        return res;

    if (flush(x, res))
        return res;

    if (straight(x, res))
        return res;

    if (three_kind(x, res))
        return res;

    if (two_pair(x, res))
        return res;

    if (one_pair(x, res))
        return res;

    high_card(x, res);
    return res;
}

void solve()
{
    vector<card> a(4), b(4);
    vector<int> used(52);

    for (int i = 0; i < 4; i++)
    {
        string s;
        cin >> s;

        a[i] = get_card(s);
        used[get_id(a[i])] = true;
    }

    for (int i = 0; i < 4; i++)
    {
        string s;
        cin >> s;

        b[i] = get_card(s);
        used[get_id(b[i])] = true;
    }

    vector<card> c;

    for (int s = 0; s < 4; s++)
    {
        for (int v = 2; v <= 14; v++)
        {
            card nc{v, s};

            if (!used[get_id(nc)])
                c.eb(nc);
        }
    }

    int m = c.size();

    vector<score> sa(m), sb(m);

    for (int i = 0; i < m; i++)
    {
        vector<card> h = a;
        h.eb(c[i]);
        sa[i] = get_score(h);

        h = b;
        h.eb(c[i]);
        sb[i] = get_score(h);
    }

    int ans = 1;

    for (int j = 0; j < m; j++)
    {
        int cur = -1;

        for (int i = 0; i < m; i++)
        {
            if (i == j)
                continue;

            int res = 0;

            if (sa[i] > sb[j])
                res = 1;
            else if (sa[i] < sb[j])
                res = -1;

            cur = max(cur, res);
        }

        ans = min(ans, cur);
    }

    if (ans == 1)
        cout << "WoYaoYanPai" << endl;
    else if (ans == -1)
        cout << "GeiWoCaPiXie" << endl;
    else
        cout << "PaiMeiYouWenTi" << endl;
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

