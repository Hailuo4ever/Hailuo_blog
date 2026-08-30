---
title: 牛客周赛 Round 159
published: 2026-08-30
description: "Nowcoder Week Contest 159"
image: https://img.hailuo4ever.com/cover/nowcoder.png
tags: [算法题解, Nowcoder]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[牛客周赛 Round 159](https://ac.nowcoder.com/acm/contest/139660)

# A - 小月的模块

> 关键词：签到

## Code

```c++
// Problem: 小月的模块
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/A
// Time: 2026-08-30 19:00:07
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

void solve()
{
    int s, a, b;
    cin >> s >> a >> b;
    
    if (s == 0)
    	cout << a << endl;
    else
    	cout << b << endl;
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

# B -小月的信号

> 关键词：模拟

## 思路

用 `bitset` 直接模拟即可。

## Code

```c++
// Problem: 小月的信号
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/B
// Time: 2026-08-30 19:00:55
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

void solve()
{
    ll x;
    cin >> x;

    bitset<64> bit(x);

    int mn = inf, mx = -1, cnt = 0;
    for (int i = 0; i < 64; i++)
    {
        if (bit[i] == 1)
            mn = min(mn, i), mx = max(mx, i), cnt++;
    }

    if (cnt == 0)
    {
        cout << "0 -1 -1" << endl;
        return;
    }

    cout << cnt << ' ' << mn << ' ' << mx << endl;
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

# C - 小月的灯带

> 关键词：模拟

## 思路

对于每一个段记录状态，随后做一个前缀和，以判断某个灯在第几段内。

随后直接在前缀和上二分查找即可。

## Code

```c++
// Problem: 小月的灯带
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/C
// Time: 2026-08-30 19:03:13
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

void solve()
{
    int n, q, b;
    cin >> n >> q >> b;

    vector<ll> a(n + 1), st(n + 1, 0), s(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i], st[i] = (i == 1 ? b : st[i - 1] ^ 1), s[i] = s[i - 1] + a[i];

    while (q--)
    {
        ll x;
        cin >> x;
        int pos = lower_bound(all(s), x) - s.begin();

        // cerr << "x = " << x << endl << "pos = " << pos << endl;

        // if (s[pos] > x)
        // pos--;

        cout << st[pos] << ' ' << pos << ' ' << x - s[pos - 1] << endl;
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

# D - 小月的校验码

> 关键词：枚举

## 思路

首先我们把字符串转化成数字，由于字符串长度 $b$ 较小，我们可以把所有数排序，然后对于每个数，直接枚举翻转哪一位，在所有数组成的集合里面二分查找 ` x ^ (1 << j)`，如果可以找到说明在 `b - j - 1` 位上，存在一个单点差分码。

## Code

```c++
// Problem: 小月的校验码
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/D
// Time: 2026-08-30 19:13:42
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

void solve()
{
    // xor == 2^n ?
    int n, b;
    cin >> n >> b;

    vector<int> a(n);
    for (int i = 0; i < n; i++)
    {
        string s;
        cin >> s;

        bitset<32> bit(s);
        a[i] = bit.to_ullong();
    }

    sort(all(a));

    ll res = 0;
    vector<ll> cnt(b);

    for (auto x: a)
    {
        for (int j = 0; j < b; j++)
        {
            if ((x >> j) & 1)
                continue;

            int y = x ^ (1 << j);
            if (binary_search(all(a), y))
                res++, cnt[b - j - 1]++;
        }
    }

    cout << res << endl;
    for (int i = 0; i < b; i++)
        cout << cnt[i] << " \n"[i == b - 1];
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

# E - 小月的前缀集合

> 关键词：字符串哈希，字典树

## 思路

由于对字典树缺乏熟练度，写了一个字符串哈希，没想到直接暴力卡过去了。

**开心！**

## Code

### Hash

```c++
// Problem: 小月的前缀集合
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/E
// Time: 2026-08-30 19:32:57
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

map<ull, int> mp;

struct stringhash
{
    const ull base = 131;

    int n;
    vector<ull> p, h;
    char c;

    stringhash() {}

    stringhash(const string &s, const char &cc)
    {
        c = cc;
        init(s);
    }

    void init(const string &s)
    {
        n = s.size();

        p.assign(n + 1, 1);
        h.assign(n + 1, 0);

        for (int i = 1; i <= n; i++)
        {
            p[i] = p[i - 1] * base;
            h[i] = h[i - 1] * base + s[i - 1];

            c == '+' ? mp[h[i]]++ : mp[h[i]]--;
            if (mp[h[i]] == 0)
                mp.erase(h[i]);
        }
    }

    ull get_hash()
    {
        return h[n];
    }

    ull get(int l, int r)
    {
        return h[r] - h[l - 1] * p[r - l + 1];
    }
};

void solve()
{
    int q;
    cin >> q;

    while (q--)
    {
        char op;
        string s;
        cin >> op >> s;

        stringhash sh(s, op);
        cout << mp.size() << endl;
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

### Trie

```c++
// Problem: 小月的前缀集合
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/E
// Time: 2026-08-30 21:02:25
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

struct Trie
{
    vector<array<int, 2>> son{{}};
    vector<int> cnt{0};

    int ans = 0;

    void add(const string &s)
    {
        int u = 0;

        for (auto ch: s)
        {
            int c = ch - '0';

            if (!son[u][c])
            {
                son[u][c] = son.size();
                son.push_back({});
                cnt.push_back(0);
            }

            u = son[u][c];

            if (cnt[u] == 0)
                ans++;

            cnt[u]++;
        }
    }

    void erase(const string &s)
    {
        int u = 0;

        for (auto ch: s)
        {
            int c = ch - '0';

            u = son[u][c];

            cnt[u]--;

            if (cnt[u] == 0)
                ans--;
        }
    }

    int query()
    {
        return ans;
    }
};

void solve()
{
    int q;
    cin >> q;

    Trie tr;

    while (q--)
    {
        char op;
        string s;

        cin >> op >> s;

        if (op == '+')
            tr.add(s);
        else
            tr.erase(s);

        cout << tr.query() << endl;
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



# F - 小月的路径码

> 关键词：树上差分，dfn序

## 思路

两种操作等价于树上区间修改和单点查询。由于 $dfn$ 序可以将整棵树变为区间，我们使用线段树按照 $dfn$ 序来维护区间和信息。

要注意的是根节点深度为 $0$，然后要预处理出 $2$ 的幂，以便在 $dfs$ 时处理出 $c$ 数组，并快速求修改的贡献。

> [!NOTE]
>
> 注意：不要向区间修改里的 $add$ 传负数，否则会导致负数取模。正确做法是加上一个 $mod$，也就是想减掉 $x$，等于加 $mod - x$。

## Code

```c++
// Problem: 小月的路径码
// Contest: NowCoder
// URL: https://ac.nowcoder.com/acm/contest/139660/F
// Time: 2026-08-30 19:40:25
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
const ll mod = 1e9 + 7;

template<class Info, class Tag>
struct LazySegmentTree
{
    int n;
    vector<Info> info;
    vector<Tag> tag;

    LazySegmentTree() : n(0) {}

    LazySegmentTree(int n_, Info v = Info())
    {
        init(n_, v);
    }

    template<class T>
    LazySegmentTree(const vector<T> &a)
    {
        init(a);
    }

    void init(int n_, Info v = Info())
    {
        vector<Info> a(n_ + 1, v);
        init(a);
    }

    template<class T>
    void init(const vector<T> &a)
    {
        n = (int) a.size() - 1;

        info.assign(n * 4 + 5, Info());
        tag.assign(n * 4 + 5, Tag());

        if (n)
            build(1, 1, n, a);
    }

    template<class T>
    void build(int i, int l, int r, const vector<T> &a)
    {
        if (l == r)
        {
            info[i] = a[l];
            return;
        }

        int mid = (l + r) >> 1;

        build(i << 1, l, mid, a);
        build(i << 1 | 1, mid + 1, r, a);

        pull(i);
    }

    void pull(int i)
    {
        info[i] = info[i << 1] + info[i << 1 | 1];
    }

    void apply(int i, const Tag &v)
    {
        info[i].apply(v);
        tag[i].apply(v);
    }

    void push(int i)
    {
        apply(i << 1, tag[i]);
        apply(i << 1 | 1, tag[i]);

        tag[i] = Tag();
    }

    void modify(int pos, const Info &v)
    {
        modify(1, 1, n, pos, v);
    }

    void modify(int i, int l, int r, int pos, const Info &v)
    {
        if (l == r)
        {
            info[i] = v;
            tag[i] = Tag();
            return;
        }

        push(i);

        int mid = (l + r) >> 1;

        if (pos <= mid)
            modify(i << 1, l, mid, pos, v);
        else
            modify(i << 1 | 1, mid + 1, r, pos, v);

        pull(i);
    }

    void rangeApply(int l, int r, const Tag &v)
    {
        rangeApply(1, 1, n, l, r, v);
    }

    void rangeApply(int i, int l, int r, int ql, int qr, const Tag &v)
    {
        if (ql <= l && r <= qr)
        {
            apply(i, v);
            return;
        }

        push(i);

        int mid = (l + r) >> 1;

        if (ql <= mid)
            rangeApply(i << 1, l, mid, ql, qr, v);

        if (qr > mid)
            rangeApply(i << 1 | 1, mid + 1, r, ql, qr, v);

        pull(i);
    }

    Info query(int l, int r)
    {
        return query(1, 1, n, l, r);
    }

    Info query(int i, int l, int r, int ql, int qr)
    {
        if (ql <= l && r <= qr)
            return info[i];

        push(i);

        int mid = (l + r) >> 1;

        if (qr <= mid)
            return query(i << 1, l, mid, ql, qr);

        if (ql > mid)
            return query(i << 1 | 1, mid + 1, r, ql, qr);

        return query(i << 1, l, mid, ql, qr) + query(i << 1 | 1, mid + 1, r, ql, qr);
    }

    template<class F>
    int findFirst(int l, int r, F &&pred)
    {
        return findFirst(1, 1, n, l, r, pred);
    }

    template<class F>
    int findFirst(int i, int l, int r, int ql, int qr, F &pred)
    {
        if (r < ql || qr < l)
            return -1;

        if (ql <= l && r <= qr && !pred(info[i]))
            return -1;

        if (l == r)
            return l;

        push(i);

        int mid = (l + r) >> 1;

        int res = findFirst(i << 1, l, mid, ql, qr, pred);

        if (res == -1)
            res = findFirst(i << 1 | 1, mid + 1, r, ql, qr, pred);

        return res;
    }

    template<class F>
    int findLast(int l, int r, F &&pred)
    {
        return findLast(1, 1, n, l, r, pred);
    }

    template<class F>
    int findLast(int i, int l, int r, int ql, int qr, F &pred)
    {
        if (r < ql || qr < l)
            return -1;

        if (ql <= l && r <= qr && !pred(info[i]))
            return -1;

        if (l == r)
            return l;

        push(i);

        int mid = (l + r) >> 1;

        int res = findLast(i << 1 | 1, mid + 1, r, ql, qr, pred);

        if (res == -1)
            res = findLast(i << 1, l, mid, ql, qr, pred);

        return res;
    }
};

struct Tag
{
    ll add = 0;
    void apply(const Tag &v)
    {
        add = (add + v.add) % mod;
    }
};

struct Info
{
    ll sum = 0, len = 1;
    void apply(const Tag &v)
    {
        sum = (sum + (v.add * len) % mod) % mod;
    }
};

Info operator+(const Info &a, const Info &b)
{
    Info c;
    c.sum = a.sum + b.sum;
    c.len = a.len + b.len;

    return c;
}

void solve()
{
    int n, q;
    cin >> n >> q;

    string s;
    cin >> s;
    s = ' ' + s;

    vector<vector<int>> g(n + 1);
    for (int i = 1, u, v; i <= n - 1; i++)
        cin >> u >> v, g[u].eb(v), g[v].eb(u);

    vector<ll> mi(n + 1, 1);
    for (int i = 1; i <= n; i++)
        mi[i] = (mi[i - 1] * 2) % mod;

    vector<int> dfn(n + 1), dep(n + 1, 0), sz(n + 1, 1);
    int timer = 0;
    vector<ll> c(n + 1);

    auto dfs = [&](auto &&self, int u, int p) -> void
    {
        dfn[u] = ++timer;

        c[u] = (c[p] + (s[u] == '1' ? mi[dep[u]] : 0)) % mod;

        for (auto v: g[u])
        {
            if (v == p)
                continue;

            dep[v] = dep[u] + 1;
            self(self, v, u);
            sz[u] += sz[v];
        }
    };

    dfs(dfs, 1, 0);

    vector<Info> a(n + 1);

    for (int i = 1; i <= n; i++)
        a[dfn[i]] = Info(c[i], 1);

    LazySegmentTree<Info, Tag> seg(a);
    while (q--)
    {
        char op;
        int u;

        cin >> op >> u;
        if (op == 'F')
        {
            if (s[u] == '1') // 1 -> 0
                seg.rangeApply(dfn[u], dfn[u] + sz[u] - 1, {mod - mi[dep[u]]}), s[u] = '0';
            else
                seg.rangeApply(dfn[u], dfn[u] + sz[u] - 1, {mi[dep[u]]}), s[u] = '1';
        }
        else
            cout << seg.query(dfn[u], dfn[u]).sum << endl;
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

