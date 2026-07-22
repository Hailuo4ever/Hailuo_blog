---
title: Data Structure (Notebook)
published: 2024-01-01
description: "Data Structure"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

> [!NOTE]
>
> `notebook/` 路径下的文件均为自己整理的内容，按照知识点类别归纳整理。

# 二叉树

## 二叉树的遍历

### 数组存树

[Luogu - B3642 二叉树的遍历]([B3642 二叉树的遍历 - 洛谷](https://www.luogu.com.cn/problem/B3642))

二叉树的三种主要遍历方式都依赖于深度优先搜索（DFS），唯一的区别在于访问当前结点的时机：

1. 前序遍历 (Preorder)：先访问根结点，再遍历左子树，最后遍历右子树。（根-左-右）
2. 中序遍历 (Inorder)：先遍历左子树，再访问根结点，最后遍历右子树。（左-根-右）
3. 后序遍历 (Postorder)：先遍历左子树，再遍历右子树，最后访问根结点。（左-右-根）

在这道题里我们使用两个数组存储每个节点的左右孩子节点编号即可，由于时限宽松，使用标准递归即可通过。

#### Code

```c++
// Problem: Luogu B3642
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/B3642
// Time: 2026-05-05 09:59:29
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
const int N = 1e6 + 10;

int l[N], r[N];

void preorder(int u)
{
    if (u == 0) // 0表示空节点
        return;

    cout << u << " ";
    preorder(l[u]);
    preorder(r[u]);
}

void inorder(int u)
{
    if (u == 0)
        return;

    inorder(l[u]);
    cout << u << " ";
    inorder(r[u]);
}

void postorder(int u)
{
    if (u == 0)
        return;

    postorder(l[u]);
    postorder(r[u]);
    cout << u << " ";
}

void solve()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
        cin >> l[i] >> r[i];

    preorder(1);
    cout << endl;

    inorder(1);
    cout << endl;

    postorder(1);
    cout << endl;
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

# 树状数组

## 维护信息的思路

树状数组的本质是动态维护一维序列的前缀信息。动态指序列中的信息会修改；前缀指可以快速询问前 $x$ 个位置的信息。

常见的询问是 $\operatorname{query}(x)=a_1+a_2+\cdots+a_x$，这里的 $a_i$ 有很多含义：

1. 某个值出现了多少次
2. 某个位置被加了多少
3. 某种状态的数量
4. 某个离散化后的权值是否出现
5. 差分数组中的变化量

所以维护信息时需要明确：树状数组的下标和值都表示什么。

树状数组最擅长处理一维下标：数组位置、时间顺序、离散化后的数值大小、排名、坐标等。例如下标可能表示 $1,2,\ldots,n$，也可能表示离散化后的值域 $\operatorname{rank}(a_i)$。

树状数组适合处理存在动态修改的问题，如修改某个位置，插入/删除某个值，某个区间整体增加等。并且适用于查询可以转化为前缀信息的情况，例如查询小于等于 $x$ 的数量、前 $x$ 个位置的和、值域在 $[l,r]$ 中的出现次数、时间不超过 $x$ 的事件数等。

树状数组最常见的是维护加法信息。例如区间和、出现次数、频率、权值和等。也可以维护异或信息，因其具有前缀性质。

## 模型

| 操作类型             | 维护方式                 |
| -------------------- | ------------------------ |
| 单点增加，前缀求和   | 一个普通树状数组         |
| 单点增加，区间求和   | 两个前缀相减             |
| 区间增加，单点查询   | 维护差分数组             |
| 区间增加，区间求和   | 两个树状数组             |
| 动态统计某值出现次数 | 下标表示离散化后的值     |
| 逆序对               | 维护已出现元素的频率     |
| 动态排名             | 维护每个值的出现次数     |
| 第 (k) 小            | 频率树状数组上二分或倍增 |

## 离线二维数点

> [!NOTE]
>
> 前置知识：树状数组，离线与在线

模板链接：[Luogu - P10814 【模板】离线二维数点](https://www.luogu.com.cn/problem/P10814)

## 思路

我们可以把原数组 $a$ 中的每一个元素 $a[i] = v$，看作是二维平面上的一个点 **$(X, Y) = (i, v)$**，即**横坐标是数组下标，纵坐标是元素大小**。

那么，对于查询 `l, r, x`，它实际上是在问：

**“在二维平面中，横坐标满足 $l \le X \le r$，且纵坐标满足 $Y \le x$ 的点，一共有多少个？”**

这就是一个二维数点问题，也叫二维正交范围查询问题。

对于可以离线的二维数点问题，我们可以通过排序消掉一个维度。

我们考虑按照限制元素 $x$ 的大小从小到大排序，同时将数组中的所有元素按照数值大小从小到大排序。

既然现在查询的 $x$ 是递增的，我们把所有**值 $\le x$ 的数组元素**对应的下标 $i$，“激活”并加入到一个数据结构中。这个数据结构只需要维护一个信息：**在 $[l, r]$ 这个区间里，当前一共激活了多少个下标。**

对应的操作为**单点增加（激活下标）**和**区间求和（统计个数）**，使用树状数组维护。

`add(a[idx].id, 1);` 的含义是将 `id` 号的元素标记为 $1$，表示满足条件，树状数组维护的是某个区间有多少个 $1$。

## Code

```c++
// Problem: Luogu P10814
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P10814
// Time: 2026-05-13 18:40:11
#include <bits/stdc++.h>
using namespace std;

// clang-format off
#define endl '\n'
#define all(x) (x).begin(), (x).end()
#define fastio() ios::sync_with_stdio(0); cin.tie(0); cout.tie(0);
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
const int N = 2e6 + 5;

struct Element
{
    int id, val;
    bool operator<(const Element &other) const
    {
        return val < other.val;
    }
} a[N];

struct Query
{
    int id, l, r, x;
    bool operator<(const Query &other) const
    {
        return x < other.x;
    }
} q[N];

int tr[N], res[N], n, m;

int lowbit(int x)
{
    return x & -x;
}

void add(int i, int k)
{
    for (; i <= n; i += lowbit(i))
        tr[i] += k;
}

int query(int i)
{
    int res = 0;
    for (; i > 0; i -= lowbit(i))
        res += tr[i];
    return res;
}

void solve()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
    {
        int x;
        cin >> x;
        a[i] = {i, x};
    }

    for (int i = 1; i <= m; i++)
    {
        int l, r, x;
        cin >> l >> r >> x;
        q[i] = {i, l, r, x};
    }

    sort(a + 1, a + n + 1), sort(q + 1, q + m + 1);

    int idx = 1; // 未加入树状数组的最小元素
    for (int i = 1; i <= m; i++)
    {
        while (idx <= n && a[idx].val <= q[i].x) // 将所有<=当前查询x的元素加入树状数组
        {
            add(a[idx].id, 1);
            idx++;
        }

        // 此时树状数组所有的点都满足 val <= q[i].x
        // 直接查即可
        res[q[i].id] = query(q[i].r) - query(q[i].l - 1);
    }

    for (int i = 1; i <= m; i++)
        cout << res[i] << '\n';
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

