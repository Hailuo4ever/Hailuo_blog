---
title: 2026 杭电多校5
published: 2026-08-04
description: "HDU Multi-University Training Contest 5"
image: https://img.hailuo4ever.com/cover/hdu.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营5](https://acm.hdu.edu.cn/contest/problems?cid=1233)

# 1005 - indigo 究竟是谁？

> 关键词：模拟

## 思路

我们需要维护三种信息：某句话是否已经被连续复读过 $k$ 次，某句话被说出的第一个位置，某句话的出现次数。

我们可以在读入的时候计算某句话被说出的第一个位置。在计算答案时，对于每个位置上的字符串 $t$，他首先需要被人说过，对应 `mp.count(t)`；已经被连续复读了 $k$ 次，对应 `st[t]`；距离第一次出现的位置要大于等于 $m$，对应 `i - pos[t] - 1 >= m`；不能被说出过 $q$ 次以上，对应 `mp[t] < q`。满足这些条件以后，它可以被复读。

判断完后，我们将这个字符串加入聊天记录。由于 $k$ 很小，我们直接从这个位置双指针往前扫一遍即可，如果算上这次，它已经被复读了 $k$ 次，就标记这个字符串为 `true`。

## Code

```c++
// Problem: indigo 究竟是谁？
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1233&pid=1005
// Time: 2026-08-04 12:21:07
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
    int n, k, m, q;
    cin >> n >> k >> m >> q;

    unordered_map<string, int> mp;
    unordered_map<string, bool> st;
    unordered_map<string, int> pos;

    vector<string> str(n + 1);

    for (int i = 1; i <= n; i++)
    {
        string s;
        cin >> s;

        str[i] = s;

        if (!pos.count(s))
            pos[s] = i;
    }

    vector<int> res;
    for (int i = 1; i <= n; i++)
    {
        string &t = str[i];

        if (mp.count(t) && st[t] && i - pos[t] - 1 >= m && mp[t] < q)
            res.eb(i);

        mp[t]++;

        int j = i;
        while (j - 1 >= 1 && str[j - 1] == str[i])
            j--;

        if (i - j + 1 >= k)
            st[t] = true;
    }

    if (res.size() == 0)
        cout << "empty";
    else
        for (auto x: res)
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

# 1008 - 病毒片段

> 关键词：离线处理，树状数组

## 思路

[P10814 【模板】离线二维数点 - 洛谷](https://www.luogu.com.cn/problem/P10814)

将每个病毒片段 $[l_i,r_i]$ 看作一个二维点 $(l_i,r_i)$，点权为 $w_i=r_i-l_i+1$。询问要求寻找满足 $l_i\ge L$ 且 $r_i\le R$ 的最大点权。

对于二维限制，考虑离线处理。用排序消掉一维，再用数据结构处理另一个限制。

首先处理限制 $l_i\ge L$，我们按左端点降序排列所有病毒片段和询问。从大到小处理询问的 $L$，假设当前询问为 $[L,R]$，将所有满足 $l_i\ge L$ 的点加入树状数组。而由于处理更小的 $L$ 时，更大的 $L$ 始终符合条件，因此不需要删除。

现在树状数组中存着满足 $l_i\ge L$ 的片段，我们需要选出这些片段中满足 $r_i\le R$ 的片段并求最大长度。问题变成了：**从已经加入的片段中，查询右端点不超过 $R$ 的最大长度**。

将病毒片段的右端点 $r_i$ 作为树状数组下标，将区间长度 $w_i$ 作为权值。树状数组维护前缀最大值。另外由于 $r$ 坐标太大，进行离散化处理。设当前处理的坐标为 $r$，插入树状数组时，获取离散化后的位置并 $+1$，查询时需要找到所有满足 $r_i\le R$ 的离散化位置有几个，使用 `upper_bound` 即可。注意这里用 `lower_bound + 1` 是错的。

## Code

```c++
// Problem: 病毒片段
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1233&pid=1008
// Time: 2026-08-04 16:28:47
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

struct Seg
{
    int l, r, w;
    bool operator<(const Seg &other) const
    {
        return l > other.l;
    }
};

struct Query
{
    int l, r, id;
    bool operator<(const Query &other) const
    {
        return l > other.l;
    }
};

struct Fenwick
{
    int n;
    vector<ll> tr;

    Fenwick() {}

    Fenwick(int n)
    {
        init(n);
    }

    void init(int n_)
    {
        n = n_;
        tr.assign(n + 1, 0);
    }

    int lowbit(int x)
    {
        return x & -x;
    }

    void add(int x, ll val)
    {
        for (int i = x; i <= n; i += lowbit(i))
            tr[i] = max(tr[i], val);
    }

    ll query(int x)
    {
        ll res = 0;

        for (int i = x; i > 0; i -= lowbit(i))
            res = max(tr[i], res);

        return res;
    }

    ll query(int l, int r)
    {
        if (l > r)
            return 0;

        return query(r) - query(l - 1);
    }
};

void solve()
{
    int n, q;
    cin >> n >> q;

    vector<Seg> seg(n);
    vector<Query> query(q);

    vector<int> val;

    for (int i = 0; i < n; i++)
    {
        int l, r;
        cin >> l >> r;
        seg[i] = {l, r, r - l + 1};
        val.eb(r);
    }

    for (int i = 0; i < q; i++)
    {
        int l, r;
        cin >> l >> r;
        query[i] = {l, r, i};
    }

    sort(all(seg)), sort(all(query));
    sort(all(val)), val.erase(unique(all(val)), val.end());

    Fenwick bit(val.size());
    vector<ll> res(q);

    int idx = 0;
    for (auto &[L, R, id]: query)
    {
        while (idx < n && seg[idx].l >= L)
        {
            int p = lower_bound(all(val), seg[idx].r) - val.begin() + 1;
            bit.add(p, seg[idx].w);
            idx++;
        }

        int pos = upper_bound(all(val), R) - val.begin();
        res[id] = bit.query(pos);
    }

    for (auto x: res)
        cout << x << endl;
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

# 1010 - 链上 Nim

> 关键词：权值线性基，线性代数

## 思路

已知若干个关于 $G_1,G_2,\ldots,G_{100}$ 的异或方程，判断一个新的异或表达式能否由这些方程唯一推出。这实际上是一个异或线性方程组，考虑线性基处理。用历史异或方程构建线性基，判断询问向量是否位于这些方程左侧向量张成的线性空间中，并同步算出右侧答案。

把一个方程编码成一个二进制向量。由于链长只可能在 $1$ 到 $100$ 之间，因此 `int128` 可以存下。对于重复的链只看奇偶性即可，偶数的贡献会变成 $0$，奇数次相当于出现 $1$ 次。所以构造时不能用 `|=`，而应该用 `^=`。

普通的线性基只存储每一位 $i$ 的对应基向量，这道题还需要存储这个基向量所对应的 $SG$ 值，我们记作 $v[i]$。

例如：$e[i]=10110$，$v[i]=7$ 表示 $G_1\oplus G_2\oplus G_4=7$。

后面的事情就不难了，修改线性基模板，让它变成一个带权的线性基。在用基向量消去询问状态的时候，同步异或上权值即可，如果基向量无法消去就返回无解。

## Code

```c++
// Problem: 链上 Nim
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1233&pid=1010
// Time: 2026-08-04 13:49:43
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
struct Basis
{
    constexpr static int K = 101;
    std::vector<T> e, v;

    Basis()
    {
        e.assign(K, 0);
        v.assign(K, 0);
    }

    bool add(T x, T val)
    {
        for (int i = K - 1; i >= 0 && x; i--)
        {
            if (x >> i & 1)
            {
                if (e[i])
                {
                    x ^= e[i];
                    val ^= v[i];
                }
                else
                {
                    e[i] = x;
                    v[i] = val;
                    return true;
                }
            }
        }
        return false;
    }

    int query(T x)
    {
        int res = 0;
        for (int i = K - 1; i >= 0; i--)
        {
            if (x >> i & 1)
            {
                if (e[i])
                    x ^= e[i], res ^= v[i];
                else
                    return -1;
            }
        }
        return res;
    }

    T max(T x = 0)
    {
        for (int i = K - 1; i >= 0; i--)
        {
            x = std::max(x, x ^ e[i]);
        }
        return x;
    }

    T min(T x)
    {
        for (int i = K - 1; i >= 0; i--)
        {
            x = std::min(x, x ^ e[i]);
        }
        return x;
    }

    void work()
    {
        for (int i = 0; i < K; i++)
        {
            for (int j = i + 1; j < K; j++)
            {
                if (e[j] >> i & 1)
                {
                    e[j] ^= e[i];
                }
            }
        }
    }

    constexpr Basis &operator|=(const Basis &rhs) &
    {
        for (int i = 0; i < rhs.K; i++)
        {
            add(rhs.e[i]);
        }
        return *this;
    }

    constexpr Basis &operator&=(const Basis &rhs) &
    {
        Basis ans;
        std::vector<T> b(rhs.K);
        for (int i = rhs.K - 1; i >= 0; i--)
        {
            T x = rhs.e[i], v = x;
            for (int k = i; k >= 0 && x; k--)
            {
                if (x >> k & 1)
                {
                    if (!e[k])
                    {
                        e[k] = x;
                        b[k] = v;
                    }
                    x ^= e[k];
                    v ^= b[k];
                }
            }
            ans.add(v);
        }

        *this = std::move(ans);
        return *this;
    }

    constexpr friend Basis operator|(Basis lhs, const Basis &rhs)
    {
        lhs |= rhs;
        return lhs;
    }

    constexpr friend Basis operator&(Basis lhs, const Basis &rhs)
    {
        lhs &= rhs;
        return lhs;
    }
};

void solve()
{
    int k;
    cin >> k;

    Basis<i128> basis;

    while (k--)
    {
        int c, s;
        cin >> c >> s;

        i128 t = 0;
        for (int i = 1; i <= c; i++)
        {
            int x;
            cin >> x;
            t ^= ((i128) 1 << x);
        }
        basis.add(t, s);
    }

    int q;
    cin >> q;

    while (q--)
    {
        int d;
        cin >> d;

        i128 t = 0;
        for (int i = 1; i <= d; i++)
        {
            int x;
            cin >> x;
            t ^= ((i128) 1 << x);
        }
        cout << basis.query(t) << endl;
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

