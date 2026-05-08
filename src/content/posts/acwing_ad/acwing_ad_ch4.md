---
title: 提高课-数据结构
status: "editing"
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

[视频讲解：Bilibili 左程云](https://www.bilibili.com/video/BV12i421X76h/)

## 线段树概述

线段树可以维护的信息类型：父范围上的某个信息，是可以用 $O(1)$ 的时间，从子范围的信息加工得到的。

例如：累加和，最大值，最小值是可以维护的；某范围上出现次数最多的数是不可以维护的。

> 举一个例子，假设我们要求一个数组所有元素的最大值，如果知道左半部分的最大值和右半部分的最大值，也就可以知道所有元素的最大值。
>
> 而“某范围上出现次数最多的数”这样的信息，是无法通过这种方式知道的，我们只能考察整个数组来计算。

线段树的经典功能是**范围查询和范围修改**。

1. 范围查询：包括范围内累加和、最大值、最小值等信息。

2. 范围修改：包括范围内每个数增加、重置等操作（如果这个修改功能可以通过 $O(1)$ 的时间计算出整体维护的信息，就可以实现 $O(\log n)$ 地单次调用）

> 例如：对 `[5, 8]` 这个区间的数整体都加上 `5`，可以直接算出来一共加了 `20`，而假如要对这个区间的数进行“逆序”，即 `180 -> 81`，就不能在 $O(1)$ 的时间内计算了，此时修改操作就不能是对数时间的。

## 建树与更新信息

线段树的组织，以最经典的累加和举例

1，线段树开始下标可以为 `1`，也可以为 `0`，下标从 `1` 开始是最经典的设定

2，线段树需要在初始化时，就指定范围的规模 `[1 ~ n]`，一旦确定不能更改

3，任何一个大范围 `[l ~ r]`，严格从中点 `mid`，拆分成左范围 `[l ~ mid]`、右范围 `[mid + 1 ~ r]`

4，每个范围的信息，填写在独立的、连续数组 `sum` 中，最大的范围 `[1 ~ n]`，把信息填写在 `sum[1]`

5，如果父范围把信息填写在 `sum[i]`，那么左范围填写在`sum[2 * i]`，右范围填写在 `sum[2 * i + 1]`

6，范围 `[l ~ r]` 和 `i` 值的对应，是由公式限制死的，由递归参数维护，无需去记录对应关系

> [!TIP]
>
> 最好使用位运算，会更快！

### Code

根据上述的组织信息的原理，有线段树建树的模板（建树的时间复杂度为 $O(n)$）

```c++
void up(int u)
{
    sum[u] = sum[u << 1] + sum[u << 1 | 1]; // 某个节点的和就是左右两边的和相加
}

void build(int l, int r, int u) // 当前正在下标为 u 的点，这个点表示的区间是 [l, r]
{
    if (l == r)
        sum[u] = a[l];
    else
    {
        int mid = (l + r) >> 1;
        build(l, mid, u << 1); // u * 2
        build(mid + 1, r, u << 1 | 1); // u * 2 + 1
        up(u); // up的意义在于把某一个节点的信息通过它的子节点算出来
    }
}
```

> 有关空间：
>
> 线段树实际上是一棵某些位置空缺的满二叉树，对于任意的 `n`，这棵树的高度可能到达 $\log_2^n+2$ 层（考虑对数向上取整+1）。我们假设这棵树的高度为 `h`，由于它是一棵满二叉树，它的节点数量即为 $2^h-1$。将 $h=\log_2^n+2$ 代入节点数量，可以得到节点数量最大为 $4n-1$， 又因为下标 `0` 不使用，所以综上所述，线段树的空间需要开到 `4n`。

## 范围查询

我们从“下发”的角度从上到下考虑问题：

为什么线段树会更快？是因为它的基本思想是将一个总任务，下发到子节点作为子任务去处理。

比如说线段树支持维护原数组 `1 - 64` 位置上的信息，现在任务查询 `10 - 55`，它实际上经历了一个递归分治的过程。

![](https://img.hailuo4ever.com/notebook_data_structure/1.png)

**当我们发现某个子区间是任务要求的真子集（例如图中 `17 - 32` 的情况），我们就没必要下发了，直接返回即可，这其实就是线段树速度快的原理。**

这个操作的时间复杂度可以这样考虑：为了处理这个任务，一开始往两边分叉，中间会遇到很多“毛刺”，也就是下发给子节点处理的过程，但也很快就返回了，时间是可以忽略不计的，我们实际上就走了完整的一左一右两个区域（当然下面的部分是利用分治思想计算的），由于树的深度是对数的，因此这个操作的复杂度是 $O(\log n)$。

> [!NOTE]
>
> 查询操作时不需要 `up()`，查询时遇到懒信息同样需要下发，但由于是查询，不会实际更新到每个数上，因此不需要 `up()`

### Code

```c++
ll query(int jobl, int jobr, int l, int r, int u) // jobl 和 jobr 为任务的边界，永远不变
{
    if (jobl <= l && jobr >= r) // 遇到任务区间的真子集，直接返回
        return sum[u];

    int mid = (l + r) >> 1;
    down(u, mid - l + 1, r - mid);
    ll res = 0;

    if (jobl <= mid)
        res += query(jobl, jobr, l, mid, u << 1);

    if (jobr > mid)
        res += query(jobl, jobr, mid + 1, r, u << 1 | 1);

    return res;
}

```

## 范围增加——懒标记体系

> [!NOTE]
>
> 对懒标记的理解：懒标记可以理解为修改标记，因为修改到的节点那么多，事实上以后用到的节点没有那么多。只有真正用到某一个节点的时候，才进行修改。如果一个点打上了一个懒标记，那么表示这个点的所有子节点都要变化这个懒标记。
>
> 注：如果是单点修改，直接捅到底，是不需要懒标记体系的。

### 原理与示例

在线段树中实现范围增加，需要维护两个数组：

1. `sum[]` 用于维护对应区间的累加和
2. `lazy_add[]`（图中为 `add[]`） 用于维护增加数量的懒信息

和范围查询的思想类似，假如我们要将 `1 - 8` 内所有的元素都 `+ 5`（对应图片操作 `1`），这个任务区间全部命中了线段树中第一个元素所表示的区间，因此可以直接将 `sum` 值修改为 `5 * 8 = 40`，并在 `add` 数组中“懒”住这个信息，直到迫不得已时再去更新下面节点的信息。

![](https://img.hailuo4ever.com/notebook_data_structure/2.png)

假设我们现在要将 `5 - 6` 内所有的元素都 `+ 3`（对应图片操作 `2`），此时应该首先处理上一个还在“懒”状态下的任务，把“懒信息”下发给**下一层的子节点**（懒标记遵循“能懒就懒”的原则，所以只下发一层），并把原来点上的任务清除（恢复不懒的状态），在下发的过程中更新 `sum` 的信息，直到上一个“懒”任务下发完成，我们执行当次的任务，并向上更新。

![](https://img.hailuo4ever.com/notebook_data_structure/3.png)

第三次操作类似于第二次操作，按照之前的思路进行更新即可。

![](https://img.hailuo4ever.com/notebook_data_structure/4.png)

> [!NOTE]
>
> 如果某天发现无法理解了，就回去看视频！

### 思路总结

以最经典的范围内每个数字都增加来举例

数组与函数的定义：

sum数组 : 范围累加和(查询信息)  add数组 : 范围上每个数的增加值(懒信息)

范围内每个数字都增加 : `void add(jobl, jobr, jobv, l, r, u)`

前三个是任务参数，表示 `jobl ~ jobr` 范围上，每个数增加 `jobv`，递归过程中这三个参数永远固定

后三个是范围参数，表示当前来到线段树的 `l ~ r` 范围上，信息存储位置是 `u`，递归过程中这三个参数可变

代码实现逻辑：

开始时调用 `add(jobl, jobr, jobv, 1, n, 1)`，范围增加的递归过程，懒更新机制！课上重点图解

1. 如果发现任务范围 `(jobl, jobr)` 把当前范围 `(l,r)` 全覆盖了，不再向下传递任务，懒住！

 	 `lazy_add[i] += jobv; sum[i] += jobv * (r - l + 1);`

2. 如果任务范围不能把当前来到的范围全包，把该范围上积攒的懒信息，往下只下发一层（`down` 过程）

  	然后决定当前任务是否要去往左范围、右范围，继续调用子递归过程

 	 子递归完成后，利用左右范围的 `sum` 信息，把当前范围的 `sum[u]` 信息修改正确（`up` 过程）

3. 退出当前递归过程

### Code

```c++
// 懒信息的下发，u表示大范围的信息，ln表示左侧有多少个数，rn表示右侧有多少个数
void down(int u, int ln, int rn)
{
    if (lazy_add[u] != 0) // 当前不为0，表示有懒信息需要下发
    {
        lazy(u << 1, lazy_add[u], ln); // 下发给左侧
        lazy(u << 1, lazy_add[u], rn); // 下发给右侧
        lazy_add[u] = 0; // 在下发完成后，父亲的懒信息清空
    }
}

// 当前来到范围 l ~ r，对应的信息下标是 u，范围上数字的个数是 n = r - l + 1
// 现在收到一个懒更新任务：l ~ r 范围上每个数字增加 v，此时sum和add调整的方法，在lazy函数中实现
// 这个懒更新任务可能是任务范围把当前线段树范围全覆盖导致的，也可能是由父范围的懒信息下发下来的
void lazy(int u, ll v, int n)
{
    sum[i] += v * n;
    lazy_add[i] += v;
}

void add(int jobl, int jobr, ll jobv, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        lazy(u, jobv, r - l + 1);
    else
    {
        int mid = (l + r) >> 1;
        down(u, mid - l + 1, r - mid); // 下发任务

        if (jobl <= mid)
            add(jobl, jobr, jobv, l, mid, u << 1);
        if (jobr > mid)
            add(jobl, jobr, jobv, mid + 1, r, u << 1 | 1);

        up(u);
    }
}
```

## 范围重置

在线段树中实现范围重置，我们需要维护三个数组：

1. `sum[]`：维护对应区间的累加和
2. `lazy_change[]`：重置标记的值（Lazy Tag），记录当前区间被统一修改成了什么值
3. `has_update[]`：重置标记的开关（`bool` 值），记录当前区间是否存在还未下放的重置操作

> [!NOTE]
>
> **注意范围重置操作的懒标记有两个！**
>
> 需要 `has_update[]` 这个数组的原因是：假如我们把某个区间重置成 `0`，那么 `lazy_change[i] == 0`，我们无法区分这里的 `0` 代表“有没有重置操作”还是“需要把区间内的所有数重置为 `0`”，因此必须再引入一个数组来作标记。

### Code

```c++
void up(int u)
{
    sum[u] = sum[u << 1] + sum[u << 1 | 1];
}

void lazy(int u, ll v, int n)
{
    sum[u] = v * n;
    lazy_change[u] = v;
    has_update[u] = true;
}

void down(int u, int ln, int rn)
{
    if (has_update[u])
    {
        lazy(u << 1, lazy_change[u], ln); // 标记下放给左孩子
        lazy(u << 1 | 1, lazy_change[u], rn); // 标记下放给右孩子
        has_update[u] = false; // 清空自身
    }
}

void update(int jobl, int jobr, ll jobv, int l, int r, int u)
{
    if (jobl <= l && jobr >= r) // 如果当前区间被完全包围，直接打懒标记
        lazy(u, jobv, r - l + 1);
    else
    {
        int mid = (l + r) >> 1;
        down(u, mid - l + 1, r - mid); // 去子树之前需要下放标记

        if (jobl <= mid)
            update(jobl, jobr, jobv, l, mid, u << 1);

        if (jobr > mid)
            update(jobl, jobr, jobv, mid + 1, r, u << 1 | 1);

        up(u); // 向上更新，重新计算sum
    }
}
```

> `query()` 方法与前文相同。

## 范围增加 + 范围重置

如果想同时实现这两个功能，需要处理**懒标记的优先级问题**，也就是我们该如何处理两种任务。

在线段树节点上，我们现在有两个懒标记：

1. **重置标记** (`lazy_change[]` 和 `has_update[]`)：代表“我这个区间要全部变成某个数”。
2. **增加标记** (`lazy_add[]`)：代表“我这个区间要在现有的基础上加上某个数”。

- 假如重置的时候前面有增加操作，这个增加操作就没有意义了：如果你昨天给区间加了 5，今天又给区间加了 3（此时 `add = 8`），但突然来了一个指令说“把区间重置为 10”。那么之前的 `+8` 就毫无意义了。 

​	代码体现：在 `updateLazy` 中，必须有一句 `lazy_add[i] = 0;`。只要进行了重置，身上的加法标记立刻清零。

- 假如增加的时候前面有重置操作，这时两种操作互不影响，直接累加即可。

​	代码体现：`addLazy` 里只有 `sum[i] += v * n;` 和 `lazy_add[i] += v;`，不用管 `update[]` 数组。

既然一个节点身上可能同时存在重置标记和增加标记（比如先被重置为 10，然后又被加了 3），那么当下放标记给左右孩子时，应该先下放哪个？ 应该**先下放“重置”，再下放“增加”。**

代码体现：`down` 方法中，先写 `if (update[i])` 的逻辑，后写 `if (lazy_add[i] != 0)` 的逻辑。顺序不能换！

## 完整代码

### 范围修改+范围查询，维护累加和

```c++
// Problem: Luogu P3372
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P3372
// Time: 2026-05-07 16:15:09
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
// clang-format on

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 1e5 + 10;

ll sum[N << 2], info[N << 2], a[N];

void lazy(int u, ll v, int n)
{
    sum[u] += v * n;
    info[u] += v;
}

void up(int u)
{
    sum[u] = sum[u << 1] + sum[u << 1 | 1];
}

void down(int u, int ln, int rn)
{
    if (info[u] != 0)
    {
        lazy(u << 1, info[u], ln);
        lazy(u << 1 | 1, info[u], rn);
        info[u] = 0;
    }
}

void build(int l, int r, int u)
{
    if (l == r)
        sum[u] = a[l];
    else
    {
        int mid = (l + r) >> 1;
        build(l, mid, u << 1);
        build(mid + 1, r, u << 1 | 1);
        up(u);
    }
}

ll query(int jobl, int jobr, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        return sum[u];

    int mid = (l + r) >> 1;
    down(u, mid - l + 1, r - mid);
    ll res = 0;

    if (jobl <= mid)
        res += query(jobl, jobr, l, mid, u << 1);

    if (jobr > mid)
        res += query(jobl, jobr, mid + 1, r, u << 1 | 1);

    return res;
}

void add(int jobl, int jobr, ll jobv, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        lazy(u, jobv, r - l + 1);
    else
    {
        int mid = (l + r) >> 1;
        down(u, mid - l + 1, r - mid);

        if (jobl <= mid)
            add(jobl, jobr, jobv, l, mid, u << 1);
        if (jobr > mid)
            add(jobl, jobr, jobv, mid + 1, r, u << 1 | 1);

        up(u);
    }
}

void solve()
{
    int n, m;
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        cin >> a[i];

    build(1, n, 1);

    while (m--)
    {
        int op;
        cin >> op;

        if (op == 1)
        {
            int x, y;
            ll k;
            cin >> x >> y >> k;
            add(x, y, k, 1, n, 1);
        }
        else
        {
            int x, y;
            cin >> x >> y;
            cout << query(x, y, 1, n, 1) << endl;
        }
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

### 范围重置 + 范围增加 + 范围查询（维护最大值）

```c++
// Problem: Luogu P1253
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P1253
// Time: 2026-05-07 19:43:59
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
// clang-format on

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const ll inf = 1e18;
const int N = 1e6 + 1;

ll arr[N], tree_max[N << 2], lazy_add[N << 2], lazy_change[N << 2];
bool has_update[N << 2];

void up(int u)
{
    tree_max[u] = max(tree_max[u << 1], tree_max[u << 1 | 1]);
}

void updateLazy(int u, ll v)
{
    tree_max[u] = v;
    lazy_add[u] = 0;
    lazy_change[u] = v;
    has_update[u] = true;
}

void addLazy(int u, ll v)
{
    tree_max[u] += v;
    lazy_add[u] += v;
}

void down(int u)
{
    if (has_update[u])
    {
        updateLazy(u << 1, lazy_change[u]);
        updateLazy(u << 1 | 1, lazy_change[u]);
        has_update[u] = false;
    }
    if (lazy_add[u] != 0)
    {
        addLazy(u << 1, lazy_add[u]);
        addLazy(u << 1 | 1, lazy_add[u]);
        lazy_add[u] = 0;
    }
}

void build(int l, int r, int u)
{
    if (l == r)
        tree_max[u] = arr[l];
    else
    {
        int mid = (l + r) >> 1;
        build(l, mid, u << 1);
        build(mid + 1, r, u << 1 | 1);
        up(u);
    }

    lazy_add[u] = 0;
    lazy_change[u] = 0;
    has_update[u] = false;
}

void update_tree(int jobl, int jobr, ll jobv, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        updateLazy(u, jobv);
    else
    {
        int mid = (l + r) >> 1;

        down(u);
        if (jobl <= mid)
            update_tree(jobl, jobr, jobv, l, mid, u << 1);
        if (jobr > mid)
            update_tree(jobl, jobr, jobv, mid + 1, r, u << 1 | 1);

        up(u);
    }
}

void add_tree(int jobl, int jobr, ll jobv, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        addLazy(u, jobv);
    else
    {
        int mid = (l + r) >> 1;

        down(u);
        if (jobl <= mid)
            add_tree(jobl, jobr, jobv, l, mid, u << 1);
        if (jobr > mid)
            add_tree(jobl, jobr, jobv, mid + 1, r, u << 1 | 1);

        up(u);
    }
}

ll query_tree(int jobl, int jobr, int l, int r, int u)
{
    if (jobl <= l && jobr >= r)
        return tree_max[u];

    int mid = (l + r) >> 1;
    down(u);

    ll res = -inf;
    if (jobl <= mid)
        res = max(res, query_tree(jobl, jobr, l, mid, u << 1));
    if (jobr > mid)
        res = max(res, query_tree(jobl, jobr, mid + 1, r, u << 1 | 1));

    return res;
}

void solve()
{
    int n, m;
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        cin >> arr[i];

    build(1, n, 1);

    while (m--)
    {
        int op, jobl, jobr;
        ll jobv;
        cin >> op >> jobl >> jobr;

        if (op == 1)
        {
            cin >> jobv;
            update_tree(jobl, jobr, jobv, 1, n, 1);
        }
        else if (op == 2)
        {
            cin >> jobv;
            add_tree(jobl, jobr, jobv, 1, n, 1);
        }
        else
            cout << query_tree(jobl, jobr, 1, n, 1) << endl;
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
