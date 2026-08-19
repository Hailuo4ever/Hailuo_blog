---
title: 2026 杭电多校9
published: 2026-08-18
description: "HDU Multi-University Training Contest 9"
image: https://img.hailuo4ever.com/cover/hdu.png
tags: [算法题解, HDUOJ, 暑假多校]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> 比赛链接：[2026 杭电暑期多校训练营9](https://acm.hdu.edu.cn/contest/problems?cid=1237)

# 1001 - 歪歪巧克力

> 关键词：思维

## 思路

题目的关键在于：布布不知道歪歪什么时候买巧克力。容易想到，对于每一块巧克力，我们都要考虑钱数为：前面已经花掉的钱+当前价格的 $2$ 倍。最坏情况就是把最贵的巧克力放到最后买。因此答案为 $sum+mx$。

## Code

```c++
// Problem: 歪歪巧克力
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1237&pid=1001
// Time: 2026-08-18 12:02:02
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
    int n;
    cin >> n;

    vector<ll> a(n + 1);
    ll mx = 0, sum = 0;

    for (int i = 1; i <= n; i++)
        cin >> a[i], mx = max(mx, a[i]), sum += a[i];

    cout << sum + mx << endl;
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

# 1004 - 歪歪01串

> 关键词：线性基

## 思路

首先注意到，对于所有长度恰好为 $len$ 的区间，求出他们在数组 $a$ 上的区间异或和 $c_i=a_i\oplus a_{i+1}\oplus\cdots\oplus a_{i+len-1}$，题目所有的操作等价于 ${W\leftarrow W\oplus c_i}$。因此所有能够得到的权值 $W$，就是所有 $c_i$ 的任意异或组合。我们使用前缀异或和、滑动窗口来求出所有的 $c_i$，放进线性基里后，对于每个询问求最大值即可。

## Code

```c++
// Problem: 歪歪01串
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1237&pid=1004
// Time: 2026-08-18 20:23:45
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
    constexpr static int K = 60;
    std::vector<T> e;

    Basis()
    {
        e.assign(K, 0);
    }

    bool add(T x)
    {
        for (int i = K - 1; i >= 0 && x; i--)
        {
            if (x >> i & 1)
            {
                if (e[i])
                {
                    x ^= e[i];
                }
                else
                {
                    e[i] = x;
                    return true;
                }
            }
        }
        return false;
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
    int n, len, q;
    cin >> n >> len >> q;

    vector<ll> a(n + 1), pre(n + 1);
    for (int i = 1; i <= n; i++)
        cin >> a[i], pre[i] = pre[i - 1] ^ a[i];

    Basis<ll> basis;
    for (int l = 1; l + len - 1 <= n; l++)
    {
        int r = l + len - 1;
        ll x = pre[r] ^ pre[l - 1];
        basis.add(x);
    }

    while (q--)
    {
        ll x;
        cin >> x;
        cout << basis.max(x) << endl;
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

# 1010 - 合法括号

> 关键词：构造

## 思路

题目保证所有 $?$ 连续，因此字符串一定长成 `固定前缀 + ???????? + 固定后缀`。

首先注意到，问号中左括号和右括号的数量其实是固定的。合法括号串长度为 $n$，所以一定有 $\frac n2$ 个左括号和 $\frac n2$ 个右括号。假设固定部分已经有 $cnt_1$ 个左括号，那么 $?$ 中必须放 ${x=\frac n2-cnt_1}$ 个左括号，设 $?$ 区间长度为 $len=r-l+1$，那么其中右括号数量就是 ${y=len-x}$。所以现在问题变成，有 $x$ 个 $($ 和 $y$ 个 $)$，应该按照什么顺序放进去。

先不考虑 $m$，显然先放全部左括号，后放全部右括号会使排列的总层数最大。然后我们考虑怎么从这个最大值降到 $m$。

观察一下可以发现，把一对 $()$ 变成 $)($，会使总层数恰好减少 $1$。更一般地，一个左括号向右跨过几个右括号，总层数就减少几。

把问号区间中的 $x$ 个左括号，从左到右编号成 $1,2,\dots,x$，定义 $a_i$ 为第 $i$ 个左括号前面有多少个右括号。我们的目标是 ${\sum_{i=1}^{x}a_i=d}$，可以转化成逆序对。**但由于合法括号的限制，第 $i$ 个左括号前最多允许 $h+i-1$ 个右括号，因此 ${a_i\le\min(y,h+i-1)}$**。

现在重新整理题意：我们需要构造 $a_1,a_2,\dots,a_x$，满足 $0\le a_1\le a_2\le\cdots\le a_x$ 且每个 $a_i\le\min(y,h+i-1)$ 且 ${\sum a_i=d}$。保证存在答案，所以接下来只需要考虑如何分配这个 $d$。实际上应该从后往前贪心，因为更靠后的左括号有更大的可移动空间。所以我们优先让右边的左括号尽可能往右移动。

## Code

```c++
// Problem: 合法括号
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1237&pid=1010
// Time: 2026-08-19 00:17:08
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
    int n, m;
    string s;

    cin >> n >> m >> s;
    s = ' ' + s;

    if (s.find('?') == string::npos)
    {
        for (int i = 1; i <= n; i++)
            cout << s[i] << (i == n ? "\n" : "");
        return;
    }

    int pos1 = s.find('?'), pos2 = s.rfind('?');
    int cnt1 = 0, len = pos2 - pos1 + 1;

    for (int i = 1; i <= n; i++)
        if (s[i] == '(')
            cnt1++;

    int x = n / 2 - cnt1, y = len - x, h = 0;

    // 统计 ? 前的深度
    for (int i = 1; i < pos1; i++)
        s[i] == '(' ? h++ : h--;

    string t = s;

    // 构造总层数最大的方案
    for (int i = pos1; i < pos1 + x; i++)
        s[i] = '(';
    for (int i = pos1 + x; i <= pos2; i++)
        s[i] = ')';

    // 计算最大总层数
    ll cur = 0, tmp = 0;
    for (int i = 1; i <= n; i++)
    {
        if (s[i] == '(')
            tmp++;
        else
            cur += tmp, tmp--;
    }

    ll d = cur - m;

    // a[i]: 第 i 个左括号前有多少个右括号
    vector<ll> a(x + 1);
    for (int i = x; i >= 1; i--)
    {
        ll t = h + i - 1, tt = min((ll) y, t);
        a[i] = min(d, tt), d -= a[i];
    }

    for (int i = pos1; i <= pos2; i++)
        t[i] = ')';

    for (int i = 1; i <= x; i++)
    {
        int p = pos1 - 1 + i + a[i];
        t[p] = '(';
    }

    for (int i = 1; i <= n; i++)
        cout << t[i] << (i == n ? "\n" : "");
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



# 1012 - Grand Swap Master

> 关键词：二维偏序，树状数组

## 思路

交换两个位置，只会影响他们附近的边。显然没必要每次重新计算 $f(A)$。

考虑最主要的情况：两个内部位置且不相邻。记 $x=a_i,\quad y=a_j$，并定义 $s_i=a_{i-1}+a_{i+1}$，$s_j=a_{j-1}+a_{j+1}$。计算贡献差异并化简后，有 ${\Delta=2(a_j-a_i)(s_j-s_i)}$。因此交换后权值变大的条件就是 $\Delta >0$。

这个式子要求两者同号，我们将每个 $i$ 看作二维平面上的一个点 $(a_i,s_i)$。我们需要统计有多少对点在第一维和第二维上的大小关系完全相同。这是一个**二维偏序问题**。

我们现在有很多的 $(a_i,s_i)$，先按照 $a_i$ 从小到大排序。假设当前处理 $(a_i,s_i)$，之前处理的点都满足 $a_j<a_i$。那么只需要统计其中有多少 $s_j<s_i$ 即可。$\text{query}(s_i-1)$ 表示之前有多少个 $s$ 小于 $s_i$。但注意相同的 $a_i$ 不能直接加进树状数组，此时 $a_j-a_i=0$。因此需要按照相同的 $a$ 分组，先把这一组全部查询，再全部加入树状数组。

考虑处理相邻的两个内部位置的情况。如果交换两个相邻位置，经过推导可以得到判定条件为 ${(a_{i+1}-a_i)(a_{i+2}-a_{i-1})>0}$。

对于每个 $2\le i\le n-2$，我们先判断它是不是被树状数组计入了，即 $(a_{i+1}-a_i)(s_{i+1}-s_i)>0$。如果是就减掉答案，再根据 $(a_{i+1}-a_i)(a_{i+2}-a_{i-1})>0$，让答案增加。

再 $O(1)$ 处理两个端点的情况即可。

## Code

```c++
// Problem: Grand Swap Master
// Contest: HDOJ
// URL: https://acm.hdu.edu.cn/contest/problem?cid=1237&pid=1012
// Time: 2026-08-18 21:42:18
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
const int N = 2e5 + 10;
const ll INF = 4e18;
const ll mod = 1;

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
            tr[i] += val;
    }

    ll query(int x)
    {
        ll res = 0;

        for (int i = x; i > 0; i -= lowbit(i))
            res += tr[i];

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
    int n;
    cin >> n;

    vector<ll> a(n + 1), s(n + 1);
    vector<pll> p;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 2; i <= n - 1; i++)
    {
        s[i] = a[i - 1] + a[i + 1];
        p.eb(a[i], s[i]);
    }

    if (n == 1)
    {
        cout << 0 << endl;
        return;
    }

    // swap(x, y)
    auto check = [&](int x, int y)
    {
        int e[4] = {x - 1, x, y - 1, y};

        ll pre = 0, suf = 0;

        for (int t = 0; t < 4; t++)
        {
            int k = e[t];
            if (k == 0 || k >= n)
                continue;

            bool flag = false;

            for (int j = 0; j < t; j++)
                if (e[j] == k)
                    flag = true;

            if (flag)
                continue;

            pre += (a[k] - a[k + 1]) * (a[k] - a[k + 1]);
        }

        swap(a[x], a[y]);

        for (int t = 0; t < 4; t++)
        {
            int k = e[t];

            if (k == 0 || k >= n)
                continue;

            bool flag = false;

            for (int j = 0; j < t; j++)
                if (e[j] == k)
                    flag = true;

            if (flag)
                continue;

            suf += (a[k] - a[k + 1]) * (a[k] - a[k + 1]);
        }

        swap(a[x], a[y]);
        return suf > pre;
    };

    ll ans = 0;
    sort(all(p));

    Fenwick bit(N);

    for (int l = 0; l < p.size();)
    {
        int r = l;

        while (r < p.size() && p[r].first == p[l].first)
            r++;

        for (int i = l; i < r; i++)
            ans += bit.query(p[i].second - 1);

        for (int i = l; i < r; i++)
            bit.add(p[i].second, 1);

        l = r;
    }

    for (int i = 2; i <= n - 2; i++)
    {
        if ((a[i + 1] - a[i]) * (s[i + 1] - s[i]) > 0)
            ans--;

        if (check(i, i + 1))
            ans++;
    }

    for (int j = 2; j <= n; j++)
        if (check(1, j))
            ans++;

    for (int i = 2; i <= n - 1; i++)
        if (check(i, n))
            ans++;

    cout << ans << endl;
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

