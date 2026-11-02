---
title: 2024 ccpc 河北省赛
published: 2026-11-1
description: "2024 CCPC Hebei Provincial Contest"
image: https://img.hailuo4ever.com/cover/xcpc.png
tags: [算法题解, ccpc, 省赛]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[The 8th Hebei Collegiate Programming Contest (CCPC 2024 河北省赛) - QOJ.ac](https://qoj.ac/contest/2628)

# A - Update

> 关键词：签到

## 思路

统计 $26$ 个字母的出现次数即可。

## Code

```c++
// Problem: A
// Contest: QOJ - CCPC 2024 河北省赛
// URL: https://qoj.ac/contest/2628/problem/15219/statement/en
// Time: 2026-11-01 14:31:38
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
    string s;
    cin >> s;

    vector<int> cnt(26);
    for (auto c: s)
        cnt[c - 'a']++;

    int res = 0;
    for (int i = 0; i < 26; i++)
    {
        if ('a' + i == 'i')
            continue;

        if (cnt[i])
            res++;
    }

    cout << res << endl;
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

# C - Goose Goose Duck

> 关键词：贪心，优先队列

## 思路

首先可能会想到按左端点排序并直接取区间，但这其实是错的。

考虑如下例子：`0, 2`, `0, 2`, `1 1`，如果按照初始的贪心，会取不到第三个。

考虑另外的一种贪心方式，对于所有满足 $l \le cur, r \ge cur$ 的左端点，我们每次都取限制最大，也就是最小的右端点来。类似于滑动窗口的形式，我们维护一个小根堆，里面所有的区间都合法，然后动态的加入并删除即可。

## Code

```c++
// Problem: C
// Contest: QOJ - CCPC 2024 河北省赛
// URL: https://qoj.ac/contest/2628/problem/15221/statement/en
// Time: 2026-11-01 14:33:45
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

struct Seg
{
    int l, r, id;
    bool operator<(const auto &other) const
    {
        if (l == other.l)
            return r < other.r;

        return l < other.l;
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<Seg> a(n + 1);
    for (int i = 1; i <= n; i++)
    {
        int x, y;
        cin >> x >> y;
        a[i] = {x, y, i};
    }

    sort(a.begin() + 1, a.end());

    vector<int> res;
    int cur = 0, ptr = 1;

    priority_queue<pii, vector<pii>, greater<pii>> pq;
    while (1)
    {
        while (ptr <= n && a[ptr].l <= cur)
            pq.emplace(a[ptr].r, a[ptr].id), ptr++;

        while (!pq.empty() && pq.top().first < cur)
            pq.pop();

        if (!pq.empty())
            res.eb(pq.top().second), cur++, pq.pop();
        else
            break;
    }

    cout << cur << endl;
    for (int i = 0; i < res.size(); i++)
        cout << res[i] << " \n"[i == res.size() - 1];
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

# G - Bracelet

> 关键词：滑动窗口

## 思路

首先容易想到复制一份，把环变成链。考虑以步长为 $2$ 为单位滑动窗口，但容易发现这样枚举不完起点，于是考虑分奇偶枚举两次。固定左端点，尽可能向右扩展，设 $[l,r)$ 表示当前已经成功匹配的区间，首先不断尝试向右扩展 $r$，如果加入后不符合条件就撤销最后一步，并更新答案。

如果窗口非空，就删掉左边的珠子，接着移动窗口。否则把 $l,r$ 都向右移动，进入下一轮。

## Code

```c++
// Problem: G
// Contest: QOJ - CCPC 2024 河北省赛
// URL: https://qoj.ac/contest/2628/problem/15225/statement/en
// Time: 2026-11-02 09:47:18
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
    int n, m, k;
    cin >> n >> m >> k;

    string s;
    cin >> s;

    int sz = s.size(), res = 0;
    s = ' ' + s + s + ' ';

    auto slide = [&](int st) -> void
    {
        int a = 0, b = 0, c = 0;
        for (int l = st, r = st; l <= sz; l += 2)
        {
            while (r + 1 <= 2 * sz && r - l + 2 <= sz)
            {
                string t = s.substr(r, 2);
                if (t == "01" || t == "10")
                    b++;
                else if (t == "00")
                    a++;
                else
                    c++;

                if (a > n || b > m || c > k)
                {
                    if (t == "10" || t == "01")
                        b--;
                    else if (t == "00")
                        a--;
                    else
                        c--;

                    break;
                }

                r += 2;
            }
            res = max(res, r - l);

            if (r == l)
            {
                r += 2;
                continue;
            }

            string t = s.substr(l, 2);
            if (t == "01" || t == "10")
                b--;
            else if (t == "00")
                a--;
            else
                c--;
        }
    };

    slide(1), slide(2);
    cout << res << endl;
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

# I - Subnet

> 关键词：模拟

## Code

```c++
// Problem: I
// Contest: QOJ - CCPC 2024 河北省赛
// URL: https://qoj.ac/contest/2628/problem/15227/statement/en
// Time: 2026-11-01 14:42:14
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
    string s;
    cin >> s;

    string num;
    while (s.back() != '/')
        num += s.back(), s.pop_back();
    reverse(all(num)), s.pop_back();

    int dig = stoi(num);
    cerr << dig << endl;

    auto process = [&](int k) -> string
    {
        string ret;
        string tmp = string(32, '0');
        // cerr << tmp << endl;

        for (int i = 0; i < k; i++)
            tmp[i] = '1';

        for (int i = 0; i < 32; i += 8)
        {
            string sub = tmp.substr(i, 8);
            bitset<8> bits(sub);
            ret += to_string(bits.to_ullong());

            if (i != 24)
                ret += ".";
        }

        return ret;
    };

    auto get = [&](string ip) -> vector<int>
    {
        stringstream ss(ip);
        vector<int> ret(4);
        char c;

        for (int i = 0; i < 4; i++)
        {
            ss >> ret[i];
            if (i < 3)
                ss >> c;
        }

        return ret;
    };

    string mask = process(dig);
    // cerr << mask << endl;
    vector<int> a = get(s), b = get(mask);

    int n;
    cin >> n;

    while (n--)
    {
        string t;
        cin >> t;

        auto c = get(t);

        bool fl = true;
        for (int i = 0; i < 4; i++)
        {
            if ((a[i] & b[i]) != (c[i] & b[i]))
            {
                fl = false;
                break;
            }
        }

        cout << (fl ? "YES" : "NO") << endl;
    }
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

# K - Welcome

> 关键词：签到

## Code

```c++
// Problem: K
// Contest: QOJ - CCPC 2024 河北省赛
// URL: https://qoj.ac/contest/2628/problem/15229/statement/en
// Time: 2026-11-01 14:39:32
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
    cout << "HBCPC2024" << endl;
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

