---
title: 提高课-数据结构
published: 2026-04-30
description: "Acwing算法提高课-Ch4-数据结构"
image: "https://img.hailuo4ever.com/cover/acwing.png"
tags: [算法笔记, Acwing]
category: "Algorithm"
draft: false
lang: ""
---

# 并查集

> 算法基础课的内容：
> 并查集可以在$O(\log n)$的时间复杂度下进行合并两个集合、查询某个元素的祖宗节点的操作。
> 并查集有两个扩展功能：
>
> 1. 记录每个集合的大小（绑定到根节点）
> 2. 记录每个点到根节点的距离（绑定到每个元素上）

## 格子游戏（裸并查集）

转换为图论问题，采用并查集处理连通性问题。

![](https://img.hailuo4ever.com/acwing_ad_ch4/1.png)

需要将二维坐标转化为一维，存在以下公式：$g[i][j]=l[n*i+j]$，$i, j$从零开始。

### Code

```cpp
// Problem: 格子游戏
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1252/
// Time: 2026-04-19 17:25:55
#include <iostream>
using namespace std;
const int N = 40010;

int n, m, p[N];

int find(int x)
{
    if (p[x] != x)
        p[x] = find(p[x]);
    return p[x];
}

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n * n; i++)
        p[i] = i;

    int res = 0;
    for (int i = 1; i <= m; i++)
    {
        int x, y;
        char c;
        cin >> x >> y >> c;

        x--, y--;

        auto get = [&](int x, int y) -> int { return x * n + y; }; // 一维坐标

        int a = get(x, y);
        int b;

        if (c == 'D')
            b = get(x + 1, y);
        else
            b = get(x, y + 1);

        int pa = find(a), pb = find(b);
        if (pa == pb)
        {
            res = i;
            break;
        }
        p[pa] = pb;
    }

    if (!res)
        puts("draw");
    else
        cout << res << endl;

    return 0;
}
```

## 搭配购买（并查集 +01 背包）

解题思路：

1. 使用并查集，维护搭配的物品组，并在根节点上维护每堆云的总体积、总价值
2. 遍历所有 `p[x] = x` 的根节点，用 01 背包板子即可

### Code

```cpp
// Problem: 搭配购买
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1254/
// Time: 2026-04-19 17:40:22
#include <bits/stdc++.h>
using namespace std;
const int N = 10010;

int n, m, val;
int v[N], w[N], p[N], f[N];

int find(int x)
{
    if (p[x] != x)
        p[x] = find(p[x]);
    return p[x];
}

int main()
{
    cin >> n >> m >> val;

    for (int i = 1; i <= n; i++)
        p[i] = i;

    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];

    while (m--)
    {
        int a, b;
        cin >> a >> b;
        int pa = find(a), pb = find(b);

        if (pa != pb)
        {
            v[pb] += v[pa];
            w[pb] += w[pa];
            p[pa] = pb;
        }
    }

    for (int i = 1; i <= n; i++)
        if (p[i] == i)
            for (int j = val; j >= v[i]; j--)
                f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[val] << endl;
    return 0;
}
```

## 程序自动分析（并查集 + 离散化）

要合并的数非常大，但只用到 $2*10^5$ 个，因此考虑离散化。

对于给定的所有约束条件，我们作以下的讨论：

1. 对于相等的约束，我们合并到几个集合里，在这个过程中一定不会出现矛盾
2. 对于不等的约束，如果他们已经在一个集合里，就出现矛盾了

注意不能边读边做，应该先处理相等约束，再判断不等约束的矛盾性

### Code

```cpp
// Problem: 程序自动分析
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/239/
// Time: 2026-04-20 22:56:28
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 2e5 + 10;

int p[N];
int n, m;
unordered_map<int, int> mp;

struct Query
{
    int x, y, e;
} query[N];

int get(int x) // 如果x之前没有出现过，就分配一个唯一的值
{
    if (mp.count(x) == 0)
        mp[x] = ++n;
    return mp[x];
}

int find(int x)
{
    if (p[x] != x)
        p[x] = find(p[x]);
    return p[x];
}

void solve()
{
    n = 0;
    mp.clear();
    cin >> m;

    for (int i = 0; i < m; i++) // 读入所有约束条件
    {
        int x, y, e;
        cin >> x >> y >> e;
        query[i] = {get(x), get(y), e};
    }

    for (int i = 1; i <= n; i++)
        p[i] = i;

    for (int i = 0; i < m; i++) // 合并相等约束条件
        if (query[i].e == 1)
        {
            int pa = find(query[i].x), pb = find(query[i].y);
            p[pa] = pb;
        }

    bool flag = false;
    for (int i = 0; i < m; i++)
        if (query[i].e == 0)
        {
            int pa = find(query[i].x), pb = find(query[i].y);
            if (pa == pb)
            {
                flag = true;
                break;
            }
        }
    if (flag)
        cout << "NO" << endl;
    else
        cout << "YES" << endl;
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

## 银河英雄传说（带权并查集）

由于题目询问间隔多少战舰，我们需要在表示集合关系的并查集的基础上引入“权值”

我们考虑记录每一个点到根节点的距离，使用前缀和来维护

根据询问“间隔多少战舰”，我们需要把距离的绝对值减去 1，当 `x == y` 时，特判返回 `-1`

### 维护思路

1. 将每个集合的大小绑定在根节点上，每个点到根节点的距离绑定到每个元素上
   `size[x]` 表示集合的大小，`d[x]` 表示 `x` 到 `p[x]` 的距离
2. 将第 `a` 列的船接在第 `b` 列的末尾，相当于让每个点到 `pb` 的距离都加上 `size[pb]`，由于路径压缩，只需要将 `pa` 到 `pb` 的距离更新成 `size[pb]` 即可，即 `d[pa] = size[pb]`

### 路径压缩思路

1. 首先找到根节点 `root`
2. 计算父节点到上一个父节点的距离 `d[p[x]]`，并进行路径压缩，压缩后，上一个父节点即为 `root`
3. `d[x]` 的初始值是 `x` 到 `p[x]` 的距离，更新 `d[x]`，即 `d[x] = d[x] + d[p[x]]`

### Code

```cpp
// Problem: 银河英雄传说
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/240/
// Time: 2026-04-21 13:18:46
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 30010;

int m;
int p[N], sz[N], d[N];

int find(int x)
{
    if (p[x] != x)
    {
        int root = find(p[x]);
        d[x] += d[p[x]];
        p[x] = root;
    }
    return p[x];
}

int main()
{
    cin >> m;

    for (int i = 1; i < N; i++)
    {
        p[i] = i;
        sz[i] = 1;
    }

    while (m--)
    {
        char op;
        int a, b;
        cin >> op >> a >> b;

        if (op == 'M')
        {
            int pa = find(a), pb = find(b);
            if (pa != pb)
            {
                d[pa] = sz[pb];
                sz[pb] += sz[pa];
                p[pa] = pb;
            }
        }
        if (op == 'C')
        {
            int pa = find(a), pb = find(b);
            if (pa != pb)
                cout << "-1" << endl;
            else
                cout << max(0, abs(d[a] - d[b]) - 1) << endl;
        }
    }
    return 0;
}
```

# 树状数组

> 树状数组是一种支持**单点修改**和**区间查询**的，短小精悍的数据结构。
> 可以在$O(logn)$的时间复杂度下同时实现：**快速求前缀和、修改某一个数。**
> 有时，在差分数组和辅助数组的帮助下，树状数组还可解决更强的**区间加单点值**和**区间加区间和**问题，但树状数组只能解决区间和相关问题。
> 前置知识：
> 题目导航：

## 基本思想

### 用二进制拆分区间

对于长度为$x$的数组，它可以用二进制来拆分：

$x = 2^{i_k} + 2^{i_{k-1}} + \dots + 2^{i_1}$，其中$i_k$也表示长度

$i_k \geq i_{k-1} \geq i_{k-2} \geq \dots \geq i_1$，可知即使最坏情况下，$k \leqslant logx$

那么原来长度为$x$的数组可以被划分多个区间：

$(x - 2^{i_1}, x]$，其中包含 $2^{i_1}$ 个数

$(x - 2^{i_1} - 2^{i_{2}}, x - 2^{i_1}]$，其中包含 $2^{i_2}$ 个数

$(0, x - 2^{i_1} - 2^{i_{2}} - 2^{i_{k-1}}]$，其中包含 $2^{i_k}$ 个数

则有如下规律：对于任意区间 `(L,R]`，它的长度一定是 R 的二进制表示的最后一位 1 所对应的次幂，即$(R-lowbit(R)+1,R]$

### 用数组表示区间

定义数组 `c[x] = a[x - lowbit(x) + 1, x]` 表示原数组 `a[]` 中以 `x` 为右端点，长度是 `lowbit(x)` 的区间的所有数的和。

不难发现，对于每一个数 `x`，`1~x` 所有数的和在数组 `c[]` 中可以拆成 `logx` 个数的和

不同的 `c[x]` 之间的关系如下图所示

![](https://img.hailuo4ever.com/acwing_ad_ch4/2.png)

### 抽象出树结构

![](https://img.hailuo4ever.com/acwing_ad_ch4/3.png)

解释：

1. 每个结点 `c[x]` 保存以 x 为根的子树中叶结点值的和
2. 每个结点覆盖的长度为 `lowbit(x)`
3. `c[x]` 结点的父结点为 `c[x + lowbit(x)]`
4. 树的深度为 `log2n+1`

基本功能：单点修改、区间查询

使用差分树状数组可以实现：区间修改、单点查询

## 初始化

1. 基于下文**单点修改**的初始化方案，时间复杂度$O(nlogn)$，**最常用**

```cpp
for (int i = 1; i <= n; i++)
    add(i, a[i]);
```

1. 对于每一个节点 x，寻找它的所有子节点，不断添加树边

```cpp
for (int i = x - 1; i; i -= lowbit(i))
{
    tr[i] += a[i];
    tr[x] += tr[i];
}
```

1. 预处理出前缀和数组

由于 `tr[i]` 表示的区间为$[i-lowbit(i)+1,i]$

那么可以预处理出前缀和数组再计算 `tr` 数组

```cpp
for (int i = 1; i <= n; i++)
    tr[i] = sum[i] - sum[i - lowbit(i)];
```

## 单点修改（自下而上）

单点修改操作，对应**从子节点找到父节点**，即找到包含点 `x` 的所有区间，并修改

**根据树状数组的性质，每一个点修改后，所直接影响的节点是唯一的**

设节点 `x` 的父节点为 `p`，则 `p = x + lowbit(x)`，修改时从下往上迭代，最多影响 `log2x` 个节点

```cpp
void add(int x, int k)
{
    for(int i = x; i <= n; i += lowbit(i))
        t[i] += k;
}
```

![](https://img.hailuo4ever.com/acwing_ad_ch4/4.png)

## 区间查询（从上到下）

区间查询操作，对应从父节点找到子节点，即查询原数组中 `a[1]~a[x]` 的和

```cpp
int sum(int x)
{
    int res = 0;
    for(int i = x; i; i -= lowbit(i))
        res += t[i];
    return res;
}
```

可以使用前缀和思想求出任意区间 `a[l] ~ a[r]` 的和：`sum[r] - sum[l + 1]`

## 题目

### 单点修改、区间查询

本题要求进行两种操作：将某一个数加上 x，求某区间的区间和

**裸树状数组即可实现**

```cpp
// Problem: Luogu P3374
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P3374
// Time: 2026-02-26 19:31:02
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 500010;

int a[N], tr[N];
int n, m;

int lowbit(int x)
{
    return x & (-x);
}

void add(int x, int k)
{
    for (int i = x; i <= n; i += lowbit(i))
        tr[i] += k;
}

long long query(int x)
{
    long long sum = 0;

    for (int i = x; i; i -= lowbit(i))
        sum += tr[i];

    return sum;
}

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        add(i, a[i]);
    }

    while (m--)
    {
        int op;
        cin >> op;

        if (op == 1)
        {
            int x, k;
            cin >> x >> k;
            add(x, k);
        }

        if (op == 2)
        {
            int x, y;
            cin >> x >> y;
            cout << query(y) - query(x - 1) << endl;
        }
    }
    return 0;
}
```

### 区间修改、单点查询

前置知识：

本题需要进行两种操作：将某区间每一个数加上 x，求出某一个数的值

即：区间加单点值问题

**根据差分的思想，建立并维护一个存储差分信息的树状数组即可**

```cpp
// Problem: Luogu P3368
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P3368
// Time: 2026-02-26 22:05:33
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 500010;

int n, m;
int a[N], tr[N];

int lowbit(int x)
{
    return x & -x;
}

void add(int x, int c)
{
    for (int i = x; i <= n; i += lowbit(i))
        tr[i] += c;
}

long long query(int x)
{
    long long res = 0;
    for (int i = x; i; i -= lowbit(i))
        res += tr[i];

    return res;
}

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        add(i, a[i] - a[i - 1]);
    }

    while (m--)
    {
        int op;
        cin >> op;

        if (op == 1)
        {
            int l, r, k;
            cin >> l >> r >> k;

            add(l, k);
            add(r + 1, -k);
        }

        if (op == 2)
        {
            int x;
            cin >> x;
            cout << query(x) << endl;
        }
    }
    return 0;
}
```

### 区间修改、区间查询

区间修改问题依然使用差分的思想做：

`a[l ~ r] += c` 等价于 `b[l] += c && b[r + 1] -= c`

**对于区间求和问题，需要使用树状数组维护两个前缀和数组**：`b[i]` 和 `i * b[i]`

推导如下：

![](https://img.hailuo4ever.com/acwing_ad_ch4/5.png)

```java
// Problem: 一个简单的整数问题2
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/description/244/
// Time: 2026-02-27 06:11:08
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
const int N = 100010;

int n, m;
int a[N];
LL tr1[N]; // 差分数组b[i]的前缀和
LL tr2[N]; // 差分数组b[i] * i的前缀和

int lowbit(int x)
{
    return x & -x;
}

void add(LL tr[], int x, LL c)
{
    for (int i = x; i <= n; i += lowbit(i))
        tr[i] += c;
}

LL sum(LL tr[], int x)
{
    LL res = 0;

    for (int i = x; i; i -= lowbit(i))
        res += tr[i];

    return res;
}

LL prefix_sum(int x)
{
    return sum(tr1, x) * (x + 1) - sum(tr2, x);
}

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
    {
        int b = a[i] - a[i - 1];
        add(tr1, i, b);
        add(tr2, i, (LL) b * i);
    }

    while (m--)
    {
        char op;
        cin >> op;

        if (op == 'Q')
        {
            int l, r;
            cin >> l >> r;
            cout << prefix_sum(r) - prefix_sum(l - 1) << endl;
        }

        if (op == 'C')
        {
            int l, r, d;
            cin >> l >> r >> d;

            // a[l] += d
            add(tr1, l, d), add(tr2, l, l * d);

            // a[r + 1] -= d
            add(tr1, r + 1, -d), add(tr2, r + 1, (r + 1) * -d);
        }
    }
    return 0;
}
```

### 应用-楼兰图腾

#### 思路

思考这种问题时，可以从树状数组功能的角度思考：本题需要进行区间查询和单点修改两种操作，自然想到了使用树状数组

![](https://img.hailuo4ever.com/acwing_ad_ch4/6.png)

#### 代码

```cpp
// Problem: 楼兰图腾
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/243/
// Time: 2026-02-26 20:14:56
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 200010;
typedef long long ll;

int n;
int a[N]; // 原数组
int tr[N]; // 树状数组
int Greater[N], lower[N]; // 用于存储某个位置左侧大于/小于它的数的个数，右侧的不用存，直接算就可以

int lowbit(int x)
{
    return x & -x;
}

void add(int x, int c)
{
    for (int i = x; i <= n; i += lowbit(i))
        tr[i] += c;
}

int sum(int x)
{
    int res = 0;
    for (int i = x; i; i -= lowbit(i))
        res += tr[i];

    return res;
}

int main()
{
    cin >> n;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    // 从左向右，依次统计每个位置左边比第i个数y小的数的个数、以及大的数的个数
    for (int i = 1; i <= n; i++)
    {
        int y = a[i];

        // 在前面已加入树状数组的所有数中统计在区间[y + 1, n]的数字的出现次数
        Greater[i] = sum(n) - sum(y);

        // 在前面已加入树状数组的所有数中统计在区间[1, y - 1]的数字的出现次数
        lower[i] = sum(y - 1);

        // 将y加入树状数组，即数字y在位置y出现1次
        add(y, 1);
    }

    // 清空树状数组，准备从右向左开始计算
    memset(tr, 0, sizeof tr);

    ll res1 = 0, res2 = 0;

    // 从右向左统计每个位置右边比第i个数y小的数的个数、以及大的数的个数
    for (int i = n; i; i--)
    {
        int y = a[i];

        res1 += Greater[i] * (ll) (sum(n) - sum(y));
        res2 += lower[i] * (ll) (sum(y - 1));

        add(y, 1);
    }

    cout << res1 << " " << res2 << endl;
    return 0;
}
```

# 线段树

> 线段树是算法竞赛中常用的用来维护**区间信息**的数据结构．
> 线段树可以在$O(logn)$的时间复杂度内实现单点修改、区间修改、区间查询（区间求和，求区间最大值，求区间最小值）等操作

## 支持的操作

1. `pushup(u)`，一般 u 为节点编号，把某一个节点所需的信息算出来
2. `build()`，将一段区间初始化成线段树
3. `modify()`，修改
   - 单点修改：easy
   - 区间修改：`pushdown()`，懒标记（Hard）

4. `query()`，区间查询

## 基本概念

### 结构图

线段树其实是把一个线性的区间构造成一个二叉树，除了最后一层之外，是一棵满二叉树

![](https://img.hailuo4ever.com/acwing_ad_ch4/7.png)

### 存储方式

根据线段树结构的性质，可以使用堆式存储，即用一个一维数组存下整棵树

**堆式存储**：对于一个编号为 `x` 的节点（假定它有父亲和儿子）

1. 它的父节点为$\lfloor \frac{x}{2} \rfloor$，即 `x >> 1`
2. 左儿子为 `2x`，即 `x << 1`
3. 右儿子 `2x+1`，即 `x << 1 | 1`

**一般来说，线段树的空间要开到`4n`**

因为一颗线段树最多是一棵满二叉树，而满二叉树的最后一层是 n 个点，前面是 n - 1 个点，所以一共需要 `2n-1` 的空间，但由于线段树有可能最后一层节点还有子节点，最多 `2n` 个点，最坏情况下只有最右边两个节点（此时所需的空间最大），最右下角的一个节点的编号为 `2n-1+2n=4n-1`，所以线段树一般开 `4n` 的空间

### 基本特点

1. 线段树的每一个节点表示一个区间
2. 线段树有唯一根，这个根表示所有会被线段树统计的总区间，一般情况下表示 `[1, n]`
3. 线段树的叶子节点表示区间 `[x, x]`，且长度为 1
4. 线段树中如果一个节点表示的区间是 `[l, r]`，则这个点一定不是叶子节点，那么这个节点的左子树的根表示的区间即为 `[l, mid]`，右子树的根表示的区间即为 `[mid + 1, r]`，其中$mid=\lfloor \frac{l+r} {2} \rfloor$

## 操作模板

### 建树-build()

一般传入当前节点的编号 `u`，当前节点代表的区间的左端点 `l`，右端点 `r`

首先判断 `l == r`，相等的话代表到底了，直接 `return`

下面计算 `mid = l + r >>1`，然后递归左儿子和右儿子

即 `build(u << 1, l, mid)`，`build(u << 1 | 1, mid + 1, r)`

**最后 `pushup(u)` ！**

### 查询-query()

用 L 和 R 表示当前查询的区间，TL 和 TR 表示当前查询的树中节点的区间，存在以下几种情况

1. `[TL, TR]` 真包含于 `[L, R]` 时，直接 `return` 即可
2. `[L, R] ∩ [TL, TR] != ∅` 时，如果左儿子代表的区间与询问区间有交集，就递归查询左儿子；右儿子有交集就递归右儿子

**注：根据线段树的特性，不存在 `[L, R] ∩ [TL, TR] == ∅` 的情况，且这种查询方法是对数时间的**
