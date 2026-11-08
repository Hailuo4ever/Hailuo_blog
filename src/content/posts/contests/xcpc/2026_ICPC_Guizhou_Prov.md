---
title: 2026 icpc 贵州省赛
published: 2026-11-04
description: "The 2026 ICPC China Guizhou Provincial Programming Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, icpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 2026 ICPC Guizhou Provincial Contest - 比赛主页 - 比赛 - QOJ.ac](https://qoj.ac/contest/4121)

# A - Guizhou Historic Cities

> 关键词：签到

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define int long long

void solve()
{
    string s;
    getline(cin, s);

    if (s == "fu quan" || s == "an shun" || s == "zhi jin" || s == "si nan" || s == "an long" || s == "da fang" || s == "pu ding" || s == "li ping" || s == "shi qian" || s == "zhen feng")
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
}

signed main()
{
    int T = 1;
    // cin >> T;
    
    while (T--)
        solve();

    return 0;
}
```

# B - Aquarium Bubble Lights

> 关键词：模拟

## 思路

题目有两个操作：每个夜晚，所有灯的亮度减 \(1\)，最低为 \(0\)，选择一盏灯，把亮度更新为 \(\max(a_x,v)\)。

每次输出当前亮着的灯的数量，最后还要输出所有灯的亮度。

维护 $cnt[t]$ 表示恰好在第 $t$ 秒熄灭的灯的数量。这样每次灭灯就是直接将 $cnt[t]$ 清零。再维护 $a[i]$ 表示每盏灯的熄灭时间。考虑添油操作对这两个数值产生的影响。

如果添油比当前的油还少，啥也不用做。

如果添油的时候灯还没灭，相当于单纯延长了灭灯的时间，如果添油后灭的时间比 $q$ 长就不用管，否则需要更新一下对应 $cnt$。

如果添油的时候灯灭了，需要增加一下 $res$，然后根据是否越界 $q$ 来更新对应 $cnt$，注意判一下添油量为 $0$ 的情况，此时不应该加 $res$。

最后输出答案时，实际亮度即为 $a[i]-k$。

## Code

```c++
// Problem: B
// Contest: QOJ - Guizhou Provincial 2026
// URL: https://qoj.ac/contest/4121/problem/20285/statement/zh_cn
// Time: 2026-11-05 23:35:16
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
    int n, q;
    cin >> n >> q;

    // 维护 cnt[t] 表示恰好在第 t 秒熄灭的灯的数量，a[i] 表示熄灭时间
    vector<ll> a(n + 1), cnt(q + 1);
    ll res = 0;

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];

        if (a[i] != 0)
        {
            res++;
            if (a[i] <= q)
                cnt[a[i]]++;
        }
    }

    for (int i = 1; i <= q; i++)
    {
        ll x, v;
        cin >> x >> v;

        res -= cnt[i], cnt[i] = 0;

        if (x == 0)
            cout << res << endl;
        else
        {
            if (v > 0 && i + v > a[x])
            {
                if (a[x] > i)
                {
                    if (a[x] <= q)
                        cnt[a[x]]--;

                    a[x] = max(a[x], i + v);
                }
                else
                    res++, a[x] = max(a[x], i + v);

                if (a[x] <= q)
                    cnt[a[x]]++;
            }
            cout << res << endl;
        }
    }

    for (int i = 1; i <= n; i++)
        cout << max(0ll, a[i] - q) << " \n"[i == n];
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



# C - Aquarium Feeding

> 关键词：思维

## 思路

如果存在一个无限长的巡逻路线，那么左右端点必须同时满足限制要求。现在任选一个水渠 $x_i$，它到左端点至少需要 $2(x_i-x_1)$，也就是必须有 ${2(x_i-x_1)\le t_i}$，考虑最右端同理有 ${2(x_n-x_i)\le t_i}$。不难发现这两种情况是下界，直接判断能否达到下界即可。

## Code

```c++
// Problem: C
// Contest: QOJ - Guizhou Provincial 2026
// URL: https://qoj.ac/contest/4121/problem/20286/statement/zh_cn
// Time: 2026-11-05 22:18:58
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
    int n;
    cin >> n;

    vector<int> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        cin >> b[i];

    for (int i = 1; i <= n; i++)
    {
        if ((a[i] - a[1]) * 2 > b[i] || (a[n] - a[i]) * 2 > b[i])
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

    int T = 1;
    // cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# D - Bacteria Culture

> 关键词：模拟，双指针

## 思路

首先判一下无解。考虑到操作的数量不会太多，我们不妨直接 $O(30n)$ 地来模拟这个过程。

每次模拟的时候，把位置分为三类：不能再修改的，可以修改也可以不修改的，必须要修改的。然后双指针一下即可。

## Code

```c++
#include <bits/stdc++.h>
using namespace std;
#define int long long

void solve()
{
    int n, m;
    cin >> n >> m;

    vector<int> a(n + 1), b(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        cin >> b[i];

    bool fl = true;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] == b[i] || (a[i] != 0 && b[i] == m))
            continue;
    
        if (a[i] == 0 && b[i] != 0)
        {
            fl = false;
            break;
        }

        int k = b[i] / a[i];
        if (k == 0 || b[i] % a[i] || ((k & (k - 1)) != 0))
        {
            // cout << "qwq" << endl;
            fl = false;
            break;
        }
    }
    
    if (!fl)
    {
        cout << "-1" << endl;
        return;
    }

    int res = 0;
    for (int jj = 1; jj <= 30; jj++)
    {
        vector<int> st(n + 1, 2);
        for (int i = 1; i <= n; i++)
        {
            if (a[i] == b[i])
            {
                if (b[i] != m && b[i] != 0)
                    st[i] = 0;
                else
                    st[i] = -1;
            }
            else
            {
                a[i] = min(2 * a[i], m);
                st[i] = 1;
            }
        }
        
        // for (int i = 1; i <= n; i++)
        //     cerr << st[i] << " \n"[i == n];

        for (int i = 1; i <= n; )
        {
            if (st[i] == 1)
            {
                int j = i;
                while (j <= n && st[j] != 0)
                    j++;

                res++, i = j;
            }
            else
                i++;
        }

        // cout << jj << ' ' << res << endl;
    }

    cout << res << endl;
}

signed main()
{
    ios::sync_with_stdio(0);cin.tie(0);cout.tie(0);
    int T = 1;
    cin >> T;
    
    while (T--)
        solve();

    return 0;
}
```

# E - Charging Adapters

> 关键词：图论建模，最短路

## 思路

对于状态 $(i,c)$，题目有两种操作：

1. 乘坐型号为 $c$ 的船前往左侧或右侧最近的码头 $j$，费用为两个码头之间的距离
2. 在码头 $i$，把船的型号更换成 $d$，费用为 $w_{i,d}$

考虑如何处理换船的操作，我们显然不能对所有船型建边，这样的边数是 $O(m_i^2)$ 的。考虑给每一个码头拆点，对于一个码头，每读入一个船型，就新增一个点，表示对应的状态 $(i,c)$。最开始的 $1\to n$ 节点是码头的虚拟节点，可以理解成一个公共的换船区。假设码头 $i$ 支持 $A,B$ 两种型号，对应的装船费用分别为 $w_A$，$w_B$。`g[i].eb(id, w);` 表示货物在码头上，现在需要装到型号为 $c$ 的船上，所以建边 $P_i\xrightarrow{w_{i,c}}(i,c)$。从船型节点到虚拟节点的边权为 $0$，表示货物从船型为 $c$ 的这个状态切换到了公共换乘状态。

考虑如何处理航行的操作，对于每个船型 $c$，维护 `lst[c]` 表示上一个支持型号 $c$ 的船型状态节点编号，`pos[c]` 表示上一个支持型号 $c$ 的码头编号，建双向边即可。

由于我们将 $1 \to n$ 设置成了虚拟节点，所以直接从 $s \to t$ 跑一遍 `Dijkstra` 即可。

## Code

```c++
// Problem: E
// Contest: QOJ - Guizhou Provincial 2026
// URL: https://qoj.ac/contest/4121/problem/20288/statement/zh_cn
// Time: 2026-11-07 13:57:38
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
    int n, k, s, t;
    cin >> n >> k >> s >> t;

    vector<ll> x(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> x[i];

    vector<vector<pll>> g(n + 1);
    vector<int> lst(k + 1), pos(k + 1);

    for (int i = 1; i <= n; i++)
    {
        int m;
        cin >> m;

        for (int j = 1; j <= m; j++)
        {
            int c, w;
            cin >> c >> w;

            // switch boat
            int id = g.size();
            g.eb();

            g[i].eb(id, w), g[id].eb(i, 0);

            // switch port
            if (lst[c])
            {
                ll d = abs(x[i] - x[pos[c]]);
                g[lst[c]].eb(id, d), g[id].eb(lst[c], d);
            }

            lst[c] = id, pos[c] = i;
        }
    }

    auto dijkstra = [&](int st, int ed) -> ll
    {
        vector<ll> dis(g.size() + 1, INF);
        priority_queue<pll, vector<pll>, greater<pll>> pq;

        pq.emplace(0, st), dis[st] = 0;
        while (!pq.empty())
        {
            auto [d, u] = pq.top();
            pq.pop();

            for (auto [v, w]: g[u])
            {
                if (dis[v] > d + w)
                    dis[v] = d + w, pq.emplace(dis[v], v);
            }
        }

        return dis[ed] == INF ? -1 : dis[ed];
    };

    cout << dijkstra(s, t) << endl;
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



# K - Two-Tone Palindromes

> 关键词：马拉车，预处理

## 思路

考虑对于一个回文中心 $i$，我们需要知道两个信息：

1. 这个中心的最长回文半径，这个信息可以通过套马拉车板子直接得到
2. 这个中心在至多包含两种字符的条件下，可以达到的最远长度，这个信息可以通过预处理得到

那么，这两个限制的最小值，就是该中心的合法回文子串数量。

我们先跑一遍马拉车，然后预处理出 $len[i]$ 为：以 $i$ 为中心向右，最多包含两种字符的最长子串长度。对于原串下标 $i$，设马拉车返回的数组为 $a$。它作为奇数回文串中心的情况是 $a[2*i+1]$，偶数回文串中心的情况是 $a[2*i]$，两种限制取最小值累加贡献即可。

## Code

```c++
// Problem: K
// Contest: QOJ - Guizhou Provincial 2026
// URL: https://qoj.ac/contest/4121/problem/20294/statement/zh_cn
// Time: 2026-11-05 22:44:08
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

vector<int> manacher(string s)
{
    string t = "#";
    for (auto c: s)
        t += c, t += '#';

    int n = t.size();
    vector<int> r(n);

    for (int i = 0, j = 0; i < n; i++)
    {
        if (2 * j - i >= 0 && j + r[j] > i)
            r[i] = min(r[2 * j - i], j + r[j] - i);

        while (i - r[i] >= 0 && i + r[i] < n && t[i - r[i]] == t[i + r[i]])
            r[i]++;

        if (i + r[i] > j + r[j])
            j = i;
    }

    return r;
}

void solve()
{
    int n;
    cin >> n;

    string s;
    cin >> s;

    auto a = manacher(s);

    map<char, int> mp;
    vector<int> len(n);

    for (int l = 0, r = 0; l < n; l++)
    {
        while (r < n && (mp.size() < 2 || mp.count(s[r])))
            mp[s[r++]]++;

        len[l] = r - l;
        if (--mp[s[l]] == 0)
            mp.erase(s[l]);
    }

    ll res = 0;
    for (int i = 0; i < n; i++)
        res += min(a[2 * i + 1] / 2, len[i]), res += min(a[2 * i] / 2, len[i]);

    cout << res << endl;
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



