---
title: 第17届蓝桥杯省赛C/C++ B组
published: 2026-04-24
description: '补题总结的题解'
image: 'https://img.hailuo4ever.com/cover/lanqiao.png'
tags: [算法题解, 蓝桥杯]
category: 'Algorithm'
draft: false 
lang: ''
---
## A-青春常数

除以 2 即可。注意由于 `x` 可以取到 0，所以要 `+1`

## Code

```cpp
// Problem: Luogu P16232
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16232
// Time: 2026-04-12 20:29:57
#include <iostream>
using namespace std;

int main()
{
    cout << "1013101260121012" << endl;
    return 0;
}
```

## B-双碳战略

首先考虑打表来观察规律，用一个数组来存储状态，使用 `bfs` 来打表，每种状态对应一个数组。

打表代码如下：

```cpp
// Problem: Luogu P16233
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16233
// Time: 2026-04-12 20:32:24
#include <bits/stdc++.h>
using namespace std;

int n;
queue<vector<int>> q;
map<vector<int>, int> mp;

int main()
{
    cin >> n;
    vector<int> s(n);
    q.push(s);
    mp[s] = 0;

    while (q.size())
    {
        auto u = q.front();
        q.pop();

        for (int i = 0; i < n; i++) // 选定任意一个位置
        {
            auto v = u; // 下一个状态
            if (mp[u] % 2 == 0) // 上一次操作的步数是偶数，则当前是奇数步
            {
                for (int j = i; j < n; j++)
                    v[j] ^= 1; // 反转
            }

            else // 上一次操作的步数是奇数，则当前是偶数步
            {
                for (int j = 0; j <= i; j++)
                    v[j] ^= 1; // 反转
            }

            if (!mp.count(v))
            {
                q.push(v);
                mp[v] = mp[u] + 1;
            }
        }
    }

    int res = 0;
    for (auto &[v, dist]: mp)
    {
        for (auto &x: v)
            cerr << x << " ";
        cerr << "步数：" << dist << endl;
        res += dist;
    }
    cout << res << endl;
    return 0;
}
```

`n = 3` 时，结果为 `0 1 3 1 2 2 2 1`，总数为 `12`

0 有 1 个，1 有 3 个，2 有 3 个，3 有 1 个

`n = 4` 时，结果为 `0 1 3 1 3 4 3 1 2 2 3 2 2 2 2 1`，总数为 `32`

0 有 1 个，1 有 4 个，2 有 6 个，3 有 4 个，4 有 1 个

观察到规律是杨辉三角，下面考虑每个数对答案的贡献。

以 `n = 4` 的情况为例，显然 `1` 的贡献是 `1*4`，`2` 的贡献是 `2*6`，以此类推

则答案为$\sum_{i=0}^{n} i \cdot C_n^i$，其中 `n = 2026`

根据组合数学恒等式$\sum_{k=0}^{n} k \binom{n}{k} = n \cdot 2^{n-1}$，答案可进一步简化为 $2026 \cdot 2^{2025} \pmod{998244353}$

最终解得答案为 $792264670$

```cpp
// Problem: Luogu P16233
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16233
// Time: 2026-04-12 20:32:24
#include <bits/stdc++.h>
using namespace std;
const int mod = 998244353;
typedef long long LL;

LL qmi(LL a, LL k)
{
    LL res = 1;
    while (k)
    {
        if (k & 1)
            res = res * a % mod;
        a = a * a % mod;
        k >>= 1;
    }
    return res;
}

void solve()
{
    int n = 2026;
    vector<LL> f(n + 1, 1), g(n + 1, 1);

    for (int i = 1; i <= n; i++)
    {
        f[i] = f[i - 1] * i % mod;
        g[i] = g[i - 1] * qmi(i, mod - 2) % mod;
    }

    int res = 0;
    for (int i = 0; i <= n; i++)
    {
        LL C = f[n] * g[i] % mod * g[n - i] % mod;
        res = (res + C * i % mod) % mod;
    }
    cout << res << endl;
}


int main()
{
    // solve();
    LL res = (2026 * qmi(2, 2025) % mod) % mod;
    cout << res << endl;
    return 0;
}
```

## C-循环右移

抽象成一个比大小问题，一个数组满足“循环右移”的条件，当且仅当所有数都相同。

### Code

```cpp
// Problem: Luogu P16234
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16234
// Time: 2026-04-12 21:19:54
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
void solve()
{
    LL n, x, y;
    cin >> n >> x >> y;

    LL res = y - x + 1;
    if (res <= 0)
        cout << 0 << '\n';
    else
        cout << res << '\n';
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

## D-蓝桥竞技

首先发现 `sum % 5` 必须等于 `0`，且一定要有 `sum / 5` 支队伍。

我们发现，假如一共有 `3` 支队伍，那么每个位置上不能超过 `3` 个人，否则没办法分配

则我们得到了**必要条件 1：**$\sum a_i \bmod 5 = 0$

**必要条件 2：**$\forall i,\ a_i \leqslant \frac{\sum a_i}{5}$，也就是说给定数组的最大值不能大过 `sum / 5`

根据**摩尔投票算法**，可以推导出一个结论：必要条件 1 + 必要条件 2 -> 充要条件

### Code

```cpp
// Problem: Luogu P16235
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16235
// Time: 2026-04-12 21:20:41
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
void solve()
{
    int n;
    cin >> n;
    LL mx = 0, sum = 0;
    for (int i = 0; i < n; i++)
    {
        LL x;
        cin >> x;
        sum += x;
        mx = max(mx, x);
    }

    if (sum % 5 || (sum / 5 < mx))
        cout << "F" << endl;
    else
        cout << "T" << endl;
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

## E-LQ 聚合

### 做法 1-贪心 + 讨论

根据贪心，我们把靠前的问号尽可能改成 `L`，靠后的问号尽可能改成 `Q`

也就是说，存在一个最优的分界点，在分界点前面的问号都改成 `L`，后面都改成 `Q`

字符串总长为 `n`，可以$O(n)$的枚举每一个位置作分界点

下面考虑分界点左右的贡献计算。

![1-1.png](https://img.hailuo4ever.com/%E8%93%9D%E6%A1%A5%E6%9D%AF2026%E9%A2%98%E8%A7%A3/1-1.png)

#### Code

```cpp
// Problem: Luogu P16236
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16236
// Time: 2026-04-12 21:43:17
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

int main()
{
    int n;
    string s;
    cin >> n >> s;

    s = " " + s;
    vector<int> L(n + 1), Q(n + 1), X(n + 1);
    vector<LL> sq(n + 1), sl(n + 2);
    // sq统计左半部分的?Q，sl统计右半部分的L?

    int sum = 0; // 贡献6
    for (int i = 1; i <= n; i++)
    {
        // 预处理区间数量
        L[i] = L[i - 1];
        Q[i] = Q[i - 1];
        X[i] = X[i - 1];
        sq[i] = sq[i - 1];

        if (s[i] == 'L')
            L[i]++;
        else if (s[i] == 'Q')
        {
            Q[i]++;
            sq[i] += X[i];
            sum += L[i];
        }
        else
            X[i]++;
    }

    for (int i = n; i > 0; i--)
    {
        sl[i] = sl[i + 1];
        if (s[i] == 'L')
            sl[i] += (X[n] - X[i]);
    }

    LL res = 0;

    for (int i = 0; i <= n; i++)
    {
        LL add = 0;
        add += 1LL * X[i] * (X[n] - X[i]); // 左问号乘右问号
        add += 1LL * X[i] * (Q[n] - Q[i]); // 左问号乘右Q
        add += 1LL * L[i] * (X[n] - X[i]); // 左L乘左问号
        add += 1LL * sq[i] + sl[i + 1]; // 左L和左？and 右？和右Q
        res = max(res, add);
    }
    cout << res + sum << endl;
    return 0;
}
```

### 做法 2-DP

根据题意，对于每个 `Q`，它前面有多少个 `L`，就做出多少的贡献，所以问题可以转化为：在每个？处决定填 `L` 还是填 `Q`，使得所有 `Q` 前面的 L 总数之和最大。

我们可以采取简单 DP 的思维，因为 `L`、`Q` 的选择只会影响后续的值，所以只需要逐步递推，维护三个变量去记录它们在递推中的数量变化即可。

状态表示（以单变量的形式）：

- $f_i$：处理完前$i$个字符后，当前已获得的最大 LQ 聚合数。
- $l$：当前已经确定（包括已经决定填 `L`）的 `L` 的个数。
- $q$：尚未扫描到的原始 `Q` 的数量。
- $r$：尚未扫描到的 `?` 的数量。

状态转移：

- 遇到 `L` 时：$l = l + 1, f_i = f_{i -1 }$（最大值不变）
- 遇到 `Q` 时：$q=q-1,f_i=f_{i-1}+l$（当前的 `Q` 与前面所有的 `L` 形成$l$个新对）
- 遇到 `?` 时：先令$r=r-1$（`?` 被消耗一个），然后比较选择 `L` 时未来最多能匹配的 `Q` 数量（$r+q$）与当前选择 `Q` 时能和先前已有的 `L` 能产生的匹配数量（$l$）：

  - 若$r+q > l$，则当前把 `?` 变成 `L` 更优，即$l = l + 1, f_i = f_{i -1 }$
  - 否则，当前把 `?` 变成 `Q` 更优，即$f_i=f_{i-1}+l$

#### Code

```cpp
// Problem: Luogu P16236
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16236
// Time: 2026-04-16 22:55:44
#include <iostream>
using namespace std;
typedef long long LL;
const int N = 1e5 + 10;
int a[N];
LL f[N];

int main()
{
    int n;
    cin >> n;

    LL l = 0, q = 0, r = 0;

    for (int i = 1; i <= n; i++)
    {
        char x;
        cin >> x;
        if (x == '?')
            a[i] = 2, r++;
        if (x == 'L')
            a[i] = 0;
        if (x == 'Q')
            a[i] = 1, q++;
    }

    for (int i = 1; i <= n; i++)
    {
        if (a[i] == 0) // L
        {
            l++;
            f[i] = f[i - 1];
        }
        else if (a[i] == 1) // Q
        {
            q--;
            f[i] = f[i - 1] + l;
        }
        else // ?
        {
            r--;
            if (r + q > l)
            {
                l++;
                f[i] = f[i - 1];
            }
            else
            {
                f[i] = f[i - 1] + l;
            }
        }
    }
    cout << f[n] << endl;
    return 0;
}
```

## F-应急布线

考虑使用**并查集**来解决联通块问题。一开始会形成若干连通块，题目就是求把若干连通块变成一个的最小花费。那么答案一定是连通块的数量减一。

注意到每次连边会将两个机子连上，一共要连 `cnt` 次，`n` 台机器总共连 `2 * cnt` 次，最好的情况是给 `n` 个机器均摊，答案为$\lceil \frac{2cnt}{n} \rceil$

### Code

```cpp
// Problem: Luogu P16237
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16237
// Time: 2026-04-14 19:31:29
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 10;

int n, m, cnt;
int p[N];

int find(int x)
{
    if (p[x] != x)
        p[x] = find(p[x]);
    return p[x];
}

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        p[i] = i;

    while (m--)
    {
        int u, v;
        cin >> u >> v;
        p[find(u)] = find(v);
    }

    for (int i = 1; i <= n; i++)
        if (find(i) == i)
            cnt++;

    cout << --cnt << " " << ceil(2.0 * cnt / n);
    return 0;
}
```

## G-理想温度

### 思路

#### Step1 - 转化题意

首先，定义每个传感器的**初始差值**$D_i = B_i - A_i$

- 若$D_i = 0$，说明开始时已满足要求。
- 如果我们对区间 $[l, r]$ 补偿温度 $k$，那么对于区间内的传感器 $i$，其温度变为 $A_i + k$。它达到理想温度的条件是 $A_i + k = B_i$，即 $k = B_i - A_i = D_i$。

对于一次操作（区间 $[l, r]$，补偿值 $k$），最终达到理想温度的传感器数量可以分为两部分：

**区间外：** 原本就满足 $D_i = 0$ 的传感器数量。

**区间内：** 满足 $D_i = k$ 的传感器数量。

当我们选择一个区间时，原本在这个区间里的 0 会因为加上 k 而产生损失。

为了最大化最终数量，我们需要找一个 $k$ 和一个区间 $[l, r]$，使得 **(区间内 k 的个数) - (区间内 0 的个数) 最大**。

设一开始的$D_i$中有$st$个 0，则最终结果为**st + (区间内 k 的个数) - (区间内 0 的个数)**

#### Step2 - 最大子段和 DP 求解

我们可以把这个问题看作：对于每一个出现的非零差值 $k$，将数组中等于 $k$ 的位置看作 $+1$，等于 $0$ 的位置看作 $-1$，其余位置看作 $0$。我们要在这个序列中找一个**最大子段和**。

1. 预处理前缀和：

   1. 计算所有的$D_i = B_i - A_i$
   2. 统计$D_i=0$的位置，并记录前缀和$s[i]$表示前 $i$个元素中有多少个 0
   3. 用一个哈希表记录每个非零值$k$出现的所有下标
2. 贪心计算：

对于每一个唯一的非零值 $k$，假设它出现的下标序列为 $p_1, p_2, \dots, p_m$：

我们要最大化：$(j - i + 1) - (Z[p_j] - Z[p_i - 1])$

> 这里 (j - i + 1) 是区间内 k 的个数，$Z[p_j] - Z[p_i - 1]$ 是区间内 0 的个数。

可得公式$\text{Gain} = (j - Z[p_j]) - (i - 1 - Z[p_i - 1])$

对于固定的 $k$，我们只需要遍历下标序列，维护一个 $(i - 1 - Z[p_i - 1])$ 的**最小值**，即可在 $O(m)$ 时间内算出该 $k$ 值的最大增益。

### Code

```cpp
// Problem: Luogu P16238
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16238
// Time: 2026-04-14 23:38:15
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int n;
    cin >> n;

    vector<LL> a(n + 1), b(n + 1), d(n + 1);
    vector<int> s(n + 1, 0);

    int st = 0;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
        cin >> b[i];

    map<LL, vector<int>> mp;

    for (int i = 1; i <= n; i++)
    {
        d[i] = b[i] - a[i];
        s[i] = s[i - 1] + (d[i] == 0 ? 1 : 0);

        if (d[i] == 0)
            st++;
        else
            mp[d[i]].push_back(i);
    }

    int mxres = 0;

    for (auto const &[v, pos]: mp)
    {
        int mnval = 0;

        for (int j = 0; j < pos.size(); j++)
        {
            int k = pos[j];
            int curv = j + 1 - s[k], curu = j - s[k - 1];

            mnval = min(mnval, curu);
            mxres = max(mxres, curv - mnval);
        }
    }

    cout << st + mxres << endl;
    return 0;
}
```

## H-足球训练

### 思路

#### Step1-贪心

假设我们给第 $i
$ 个队员分配一天的训练时间，这个分配操作对整体乘积的影响（也就是增幅）为

$$
\frac{a_i + (k_i + 1)b_i}{a_i + k_i b_i} = 1 + \frac{b_i}{a_i + k_i b_i} = 1 + \frac{1}{\frac{a_i}{b_i} + k_i}
$$

为了让总乘积最大，我们每次都应该选增幅最大的队员。观察上式，要使增幅最大，就必须让分母最小。

也就是说，我们按照$\frac{a_i}{b_i} + k_i$从小到大贪心。

### Step2-模拟（60pts）

我们考虑直接模拟，观察到对于 60% 的数据有$m \leqslant 3000$，那么可以用一个优先队列直接模拟。

##### Code

```cpp
// Problem: Luogu P16239
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P16239
// Time: 2026-04-12 22:42:32
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
const LL MOD = 998244353;

struct Player
{
    LL a, b;
    LL k; // 已分配的训练天数

    // 增幅 b / (a + kb) 最大的排在堆顶
    bool operator<(const Player &other) const
    {
        // 交叉相乘，代替除法比较
        LL left = b * (other.a + other.k * other.b);
        LL right = other.b * (a + k * b);

        return left < right;
    }
};

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int n;
    LL m;
    cin >> n >> m;

    priority_queue<Player> pq;
    for (int i = 0; i < n; i++)
    {
        LL a, b;
        cin >> a >> b;
        pq.push({a, b, 0}); // 初始天数 k = 0
    }

    for (int i = 0; i < m; i++)
    {
        // 拿出当前增幅最大的队员
        Player top = pq.top();
        pq.pop();

        top.k++;
        pq.push(top);
    }

    LL ans = 1;
    while (!pq.empty())
    {
        Player p = pq.top();
        pq.pop();

        LL strength = (p.a + p.k * p.b) % MOD;
        ans = (ans * strength) % MOD;
    }

    cout << ans << "\n";
    return 0;
}
```

#### Step3-二分答案（100pts）

既然我们每次都是挑选 $\frac{a_i}{b_i} + k_i$ 最小的队员不断往上“填平”，这非常像一个“注水”的过程。我们可以二分最终的水面高度（阈值 V）。

对于一个阈值 V：如果某个队员当前的$\frac{a_i}{b_i} + k_i \leqslant V$，那么他就需要被训练，训练天数为满足$\frac{a_i}{b_i} + k_i - 1 \le V$的最大$k_i$值，即$k_i = \lfloor V - \frac{a_i}{b_i} \rfloor + 1, V \ge \frac{a_i}{b_i}$。

综上，我们可以二分找到一个最小的阈值 V，使得所有队员需要的训练天数总和$\sum k_i \ge m$
