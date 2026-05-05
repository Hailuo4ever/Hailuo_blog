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
> `notebook/` 路径下的文件均为自己整理的杂项，按照知识点类别归纳整理。

# 树形数据结构

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

### 指针+结构体存树

[L2-006 树的遍历 - 团体程序设计天梯赛-练习集](https://pintia.cn/problem-sets/994805046380707840/exam/problems/type/7?problemSetProblemId=994805069361299456&page=1)