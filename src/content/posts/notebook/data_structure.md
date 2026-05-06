---
title: Data Structure (Notebook)
published: 2026-05-05
description: "自己整理的一些数据结构相关知识"
image: https://img.hailuo4ever.com/cover/acwing.png
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

### 指针+结构体存树（待补）

[L2-006 树的遍历 - 团体程序设计天梯赛-练习集](https://pintia.cn/problem-sets/994805046380707840/exam/problems/type/7?problemSetProblemId=994805069361299456&page=1)

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

## 线段树组织信息的方法

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

根据上述的组织信息的原理，有线段树建树的模板

```c++
void pushup(int u)
{
    sum[u] = sum[u << 1] + sum[u << 1 | 1]; // 某个节点的和就是左右两边的和相加
}

void build(int l, int r, int u) // 当前正在下标为 u 的点，这个点表示的区间是 [l, r]
{
    if (l == r)
        sum[u] = a[u];
    else
    {
        int mid = (l + r) >> 1;
        build(l, mid, u << 1); // u * 2
        build(mid + 1, r, u << 1 | 1); // u * 2 + 1
        pushup(u); // pushup的意义在于把某一个节点的信息通过它的子节点算出来
    }
}
```

> 有关空间：
>
> 线段树实际上是一棵某些位置空缺的满二叉树，对于任意的 `n`，这棵树的高度可能到达 $\log_2^n+2$ 层（考虑对数向上取整+1）。我们假设这棵树的高度为 `h`，由于它是一棵满二叉树，它的节点数量即为 $2^h-1$。将 $h=\log_2^n+2$ 代入节点数量，可以得到节点数量最大为 $4n-1$， 又因为下标 `0` 不使用，所以综上所述，线段树的空间需要开到 `4n`。

## 线段树范围查询的过程

为什么线段树会更快？是因为它的基本思想是将一个总任务，下发到子节点作为子任务去处理。

比如说线段树支持维护原数组 `1 - 64` 位置上的信息，现在任务查询 `10 - 55`，它实际上经历了一个递归分治的过程。

![](https://img.hailuo4ever.com/notebook_data_structure/1.png)

**当我们发现某个子区间是任务要求的真子集（例如图中 `17 - 32` 的情况），我们就没必要下发了，直接返回即可，这其实就是线段树速度快的原理。**

这个操作的时间复杂度可以这样考虑：为了处理这个任务，一开始往两边分叉，中间会遇到很多“毛刺”，也就是下发给子节点处理的过程，但也很快就返回了，时间是可以忽略不计的，我们实际上就走了完整的一左一右两个区域（当然下面的部分是利用分治思想计算的），由于树的深度是对数的，因此这个操作的复杂度是 $O(\log n)$。
