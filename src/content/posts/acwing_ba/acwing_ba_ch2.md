---
title: 基础课-数据结构
published: 2026-01-06
description: "Acwing算法基础课-Ch2-数据结构"
image: https://img.hailuo4ever.com/cover/acwing.png
tags: [算法笔记, Acwing]
category: "Algorithm"
draft: false
lang: ""
---

> [!TIP]
> 解决一道题的方法有很多，思路灵活点，不一定非照着给定的模板写

# 单链表

> 单链表只有向后的指针，不能找到某个节点前的点

## 结构体

> 使用结构体实现链表时，需要大量使用关键字 new，但 new 的时间复杂度很高，所以在比赛中容易 TLE。

### 构造

> 单向链表中，包含数据域和指针域
> 其中数据域用于存放数据，指针域用来连接当前节点和下一节点。

```cpp
struct Node
{
    int value;
    Node *next;

    Node(int _val) : val(_val), next(NULL){}
};
```

### 插入

在 p 后插入 node 节点的步骤：

1. new 出待插入的节点 node
2. 将 node 的 next 指针指向 p 的下一个节点
3. 将 p 的 next 指针指向 node

```cpp
void insertNode(int i, Node *p)
{
  Node *node = new Node; // new会开辟新的内存空间存放新结构体，并返回这个空间的指针
  node->value = i;
  node->next = p->next;
  p->next = node;
}
```

### 删除

设待删除节点为 p

由于单链表无法找到前驱节点，所以思路是用后面的覆盖前面的

1. 将 p 下一个节点的值赋给 p，即抹掉了 p->value
2. 将 p 的 next 指针指向 p 的下下个节点，即抹掉了 p->next

```cpp
void deleteNode(ListNode* node)
{
    auto p = node->next;

    node->val = p->val;
    node->next = p->next;
    // 将 *(node->next) 赋值给 *node

    delete p; // 回收内存
}
```

### 遍历

`for (Node* i = head; i; i = i->next)`

`cout << i->value << endl;`

## 数组

### 构造

1. 定义数组 `e[]` 存放每个节点的值
2. 定义数组 `ne[]` 存放每个节点的 next 指针
3. 定义 `idx`， 记录当前操作的位置，可以理解为节点。**注意不要定义成 index，因为 index 在万能头里被定义过了**
4. 定义 `head`，表示头节点下标

> 数组下标所联系的是 e 与 ne 的关系，所以前后的节点的数组下标不需要连续。因此 idx 只负责记录当前操作的位置

```cpp
定义链表构成：
int head, e[N], ne[N], idx;

初始化头节点和idx：
void init()
{
    head = -1;
    idx = 0;
}

初始化新的节点：e[idx] = x;
准备初始化下个节点：idx++;
```

### 插入

#### 将 x 插到头结点

```cpp
void add_to_head(int x)
{
    e[idx] = x, ne[idx] = head, head = idx, idx ++ ;
}
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/1.png)

#### 将 x 插到下标是 k 的点后面

```cpp
void add(int k, int x)
{
    e[idx] = x, ne[idx] = ne[k], ne[k] = idx ++ ;
}
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/2.png)

### 删除

**将下标是 k 的点后面的点删掉:**

```cpp
void remove(int k)
{
    ne[k] = ne[ne[k]];
}
//ne[k]为第k个点的next指针，再ne一遍，即为k的下一个节点的next指针
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/3.png)

### 遍历

`for (int i = head; i != -1; i = ne[i]) cout << e[i]`

i 首先指向头结点，遍历过程中每次都让 i 指向 next，i 遍历到 null 时停止

# 双链表

> 双链表有指向两侧的指针，可以找到某节点前后的节点

## 结构体

### 构造

> 双向链表中，包含数据域和指针域
> 其中数据域用于存放数据，指针域分为左指针和右指针，连接着左节点和右节点

```cpp
struct Node
{
  int value;
  Node *left;
  Node *right;
};
```

### 插入

**在给定节点 p 后插入 node**

首先，new 出待插入的节点 node，判断给定链表 p 是否为空

- 若为空，将 node 的左右指针都指向自己
- 若不为空：
  1. 将 node 的左指针指向 p
  2. 将 node 的右指针指向 p 的右节点
  3. 将 p 的右节点的左指针指向 node
  4. 将 p 的右指针指向 node

```cpp
void insertNode(int i, Node *p)
{
  Node *node = new Node;
  node->value = i;
  if (p == NULL)
  {
    p = node;
    node->left = node;
    node->right = node;
  }
  else
  {
    node->left = p;
    node->right = p->right;
    p->right->left = node;
    p->right = node;
  }
}
```

### 删除

**删除给定节点 p**

1. 将 `p` 左结点的右指针指向 `p` 的右节点；
2. 将 `p` 右结点的左指针指向 `p` 的左节点；
3. 新建一个临时结点 `t` 存放 `p` 的地址；
4. 将 `p` 的右节点地址赋给 `p`，以避免 `p` 变成悬垂指针；
5. 删除 `t`。

```cpp
void deleteNode(Node *&p)
{
  p->left->right = p->right;
  p->right->left = p->left;
  Node *t = p;
  p = p->right;
  delete t;
}
```

### 遍历

`for (Node* i = head; i; i = i->right)`

`cout << i->value << endl;`

## 数组

### 构造

1. 定义数组 `e[]`，存放每个节点的值
2. 定义数组 `l[],r[]` 存放每个节点的左右指针
3. 定义 `idx`，记录当前操作的位置，可以理解为节点。**注意不要定义成 index，因为用万能头时 index 是个库函数**
4. 定义 `idx=0` 为头节点，`idx=1` 为尾节点

```cpp
定义双链表构成：
int e[N], l[N], r[N], idx;

初始化头节点和尾节点：
void init()
{
    r[0] = 1, l[1] = 0;//头节点的右指针指向尾节点，尾节点的左指针指向头节点
    idx = 2;//idx从2开始操作
}

初始化新的节点：e[idx] = x
准备初始化下个节点：idx++;
```

### 插入

#### 插到节点 k 的右边

```cpp
void add(int k, int x)
{
    e[idx] = x;

    r[idx] = r[k];
    l[idx] = k;

    l[r[k]] = idx; //一定要先改r[k]的左指针，再改r[k]
    r[k] = idx;

    idx ++;
}
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/4.png)

#### 插到节点 k 的左边

相当于在 k 左边的点的右边插入，直接调用 `add(l[k], x)` 即可

#### 头插与尾插

头插相当于在左端点的右侧插入，即 `add(0, x)`

尾插相当于在右端点的左侧插入，即 `add(l[1], x)`

### 删除

**删除第 k 个节点：**

```cpp
void remove(int k)
{
    r[l[k]] = r[k];
    l[r[k]] = l[k];
}
// 先改左或改右都可以
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/5.png)

### 遍历

`for (int i = r[0]; i != 1; i = r[i]) cout << e[i] << ' ';`

从头节点的右侧（即 r[0]）开始遍历，遍历到尾节点（即 1 的时候）

# 栈

> 栈是常用的一种线性数据结构。
> 栈的修改与访问是按照后进先出的原则进行的，且仅维护栈顶元素。因此被称为是后进先出（last in first out）表，简称 LIFO 表。

## 数组模拟

> 手写栈相对 stl 的优点：速度快、可遍历

```cpp
int stk[N], tt = 0; //tt为栈顶下标，下标1作为栈底

//插入
stk[++tt] = x;

// 弹出
tt--;

// 判空
tt != 0 not empty
else empty

//访问栈顶元素
stk[tt]
```

## STL-stack

> `#include <stack>`

### 初始化

`stack<int> stk;` //创建一个空栈，且不允许列表初始化或填充相同元素
`stack<int> stk2(stk)`
`stack<int> stk3 = stk2` //允许从已有的栈拷贝构造

### 入栈

`stk.push(10); `//stk = {10(top)}
`stk.push(20); `//stk = {10, 20(top)}
`stk.push(50); `//stk = {10, 20, 50(top)}

### 读取栈顶元素

`stk.top()`
`//{10,20,50(top)} 仅取出栈顶元素，不会pop掉`

### 出栈

> [!TIP]
> 注意 pop 前先判空！！！

`if(!stk.empty()) stk.pop();`
`//{10,20(top),` ~~50~~ `}`

### 获取栈的大小与判空

`stk.size()`
`stk.empty()`

### 清空栈

`stk.clear()`

## 单调栈（栈 + 单调性）

> 适用题型：[找出每个数左边离它最近的比它大/小的数](https://www.acwing.com/problem/content/832/)
> 如果在栈中，有 x<y 并且 a[x]>=a[y],那么 a[x]一定不会作为答案输出，因为 a[y]在 a[x]的右边，且离 a[i]最近，那么我们就可以把 a[x]从栈中删除，最后，栈中的元素一定是单调的。
> 先想清楚暴力做法，再考虑使用数据结构优化
> 暴力做法：O(n2) ---> 单调栈：O(n)

### 数组模拟

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5+10;
int n,stk[N],tt;
int main()
{
    cin >> n;
    for(int i = 0; i < n; i++)
    {
        int x;
        cin >> x;

        while(tt && stk[tt] >= x) tt-- //当栈非空且栈顶元素 >= 输入新元素时弹出，对于相同的数，保留左侧即可
        if(tt) cout << stk[tt] //当整个栈单调时，栈顶即为答案
        else cout << "-1" //若栈为空，则说明不存在比输入数小的数

        stk[++tt] = x; //记录输入数（入栈）
    }

    return 0;
}
//记录输入的数字之前，会把所有<=x的数据丢掉，因此不会出现上大下小的情况
```

### STL

```cpp
#include <bits/stdc++.h>
using namespace std;
stack<int> stk;
int main()
{
    int n, x;
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        cin >> x;
        while (stk.size() && stk.top() >= x)
            stk.pop();

        if (stk.empty())
            cout << "-1 ";
        else
            cout << stk.top() << " ";
        stk.push(x);
    }
    return 0;
}
// 用STL时，一定要先判空再取栈顶，防止越界！！！
```

# 队列

> 队列（queue）是一种具有「先进入队列的元素一定先出队列」性质的表。
> 由于该性质，队列通常也被称为先进先出（first in first out）表，简称 FIFO 表。

## 数组模拟

> [!TIP]
> 通过操作 hh 和 tt 来表达 入队 / 出队

```cpp
int q[N], hh, tt = -1; // hh为队头，tt为队尾，初始化时队列为空，所以tt=-1

// 只允许在最后面添加元素，只允许在最前面删除元素。

// 插入
q[++tt] = x;

// 弹出
hh ++;

// 判空
if(tt >= hh) not empty
else empty

//取队头、队尾
q[hh]、q[tt]
```

## STL-queue

> #include <queue>

**不可访问内部元素！！！**

`queue<int> que;` //构造
`que.push() `// 入队
`que.pop()` // 出队
`que.front()` // 取队首
`que.back()` // 取队尾
`que.empty()` // 判空
`que.clear()` // 清空
`que.size()` // 查看大小

# 双端队列

> 双端队列是指一个可以在队首/队尾插入或删除元素的队列。相当于是栈与队列功能的结合。

## [滑动窗口问题](https://www.acwing.com/problem/content/156/)--单调队列

> 分为以下几步：
>
> 1. 解决队首已经出窗口的问题;
> 2. 解决队尾的加入是否影响单调性的问题;
> 3. 将当前元素下标加入队尾;
> 4. 如果形成“窗口”则输出结果;

```cpp
#include <bits/stdc++.h>
using namespace std;

const int N = 1000010;

int a[N], q[N]; // q为双端队列，里面存的是下标！

int main()
{
    int n, k;
    scanf("%d%d", &n, &k);
    for (int i = 0; i < n; i++)
        scanf("%d", &a[i]);

    // 找每个窗口的最小值，过程中队列q下标指向的元素严格单增
    int hh = 0, tt = -1;
    for (int i = 0; i < n; i++)
    {
        if (hh <= tt && i - k + 1 > q[hh]) // i-k+1为滑动窗口第一个元素的下标！！
            hh++; // 队列非空且q[hh]已经出窗口，hh++

        while (hh <= tt && a[i] <= a[q[tt]])
            tt--; // 维护队列单调性，即a[q[hh]]永远在窗口中最小

        q[++tt] = i; // 把下标入队

        if (i - k + 1 >= 0) // 窗口的最小下标>=0
            printf("%d ", a[q[hh]]); // 当窗口形成时，输出队头
    }

    printf("\n");
    memset(q, 0, sizeof(q));

    // 找每个窗口的最大值，过程中队列q下标指向的元素严格单减
    hh = 0, tt = -1;
    for (int i = 0; i < n; i++)
    {
        if (hh <= tt && i - k + 1 > q[hh])
            hh++; // 同上

        while (hh <= tt && a[q[tt]] <= a[i])
            tt--; // 维护队列单调性，即a[q[hh]]永远在窗口中最大
        q[++tt] = i;

        if (i >= k - 1)
            printf("%d ", a[q[hh]]);
    }

    printf("\n");
    return 0;
}
```

## STL-deque

> `#include <deque>`

![](https://img.hailuo4ever.com/acwing_ba_ch2/6.png)

# KMP

> 给定一个字符串 S，以及一个模式串 P，求出模式串 P 在字符串 S 中所有出现的位置的起始下标。
> 在暴力匹配算法中，经常需要回退主串的指针，而 kmp 算法利用了模式串和主串有部分相同的情况，通过不断回退模式串，大量减少了枚举次数，允许主串指针只遍历一次，即可完成整个求解过程。
> 故 kmp 的时间复杂度为 O(n)。
> KMP 动画演示：[https://www.bilibili.com/video/BV1AY4y157yL/](https://www.bilibili.com/video/BV1AY4y157yL/)

## 基本定义

前缀：包含首位字符但不包含末位字符的子串（从前看）

后缀：包含末位字符但不包含首位字符的子串（从后看）

next 数组的定义：当主串与模式串不匹配时，模式串需要回退的位置

next[i]的定义：以 i 为终点的后缀和从 1 为起点的前缀相同，且长度最长（为了保证模式串移动的距离最小）。

## 匹配的过程

模式串与主串不断进行匹配：

- 假如当前字符匹配成功，就接着匹配下一个。
- 假如当前字符匹配失败，模式串就往后“退一步”，把 j 指针退到 ne[j]。

假如模式串已经退无可退，即 S 的后缀和 P 的前缀完全不匹配了，i ++ 匹配主串的下一个字符

## next 数组的求解

本质上讲，求解 next 数组，是模式串自己和自己“匹配”的过程。

注意每次移动 i 前，将 i 前面已经匹配的长度记录到 next 数组中。

```cpp
for (int i = 2, j = 0; i <= n; i++)
    {
        while (j && p[i] != p[j + 1])
            j = ne[j];
        if (p[i] == p[j + 1])
            j++;
        ne[i] = j; // 记录答案
    }
```

## 完整代码

> [!TIP]
> 在解决 kmp 问题时，我们通常让主串和模式串数组的下标从 1 开始
> 注意在整个过程中，位置 i 对应的是 j+1，因为要调用 next[j]

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 100010, M = 1000010;

int n, m;
int ne[N];
char s[M], p[N];

int main()
{
    cin >> n >> p + 1 >> m >> s + 1; // p+1和s+1相当于起始输入位置

    // 预处理出next数组，注意next[1]一定为0，不需要计算
    for (int i = 2, j = 0; i <= n; i++)
    {
        while (j && p[i] != p[j + 1])
            j = ne[j];
        if (p[i] == p[j + 1])
            j++;
        ne[i] = j; // 记录答案
    }

    for (int i = 1, j = 0; i <= m; i++) // 匹配i和j+1
    {
        while (j && s[i] != p[j + 1])
            j = ne[j];
        // j不断尝试向前走，当匹配不到的时候就“退一步”，相当于跳过了相同的前后缀部分，继续匹配
        // 当j退回到最开头，或者匹配成功，跳出while
        // 如果j退回到最开头，就去匹配i的下一个位置

        if (s[i] == p[j + 1])
            j++; // 如果本字符匹配成功，j++

        if (j == n) // S串和P串匹配成功
        {
            printf("%d ", i - n);
            j = ne[j]; // 接着配，准备下一轮i++
        }
    }

    return 0;
}
```

## next 数组的应用（[洛谷 P4391](https://www.luogu.com.cn/problem/P4391)）

> 给你一个字符串 \_s_1，它是由某个字符串 \_s_2 不断自我连接形成的（保证至少重复 2 次）。但是字符串 \_s_2 是不确定的，现在只想知道它的最短长度是多少。

![](https://img.hailuo4ever.com/acwing_ba_ch2/7.png)

# Trie 树

> Trie 是一种高效地存储和查找字符串集合的数据结构。
> 用空间换时间，利用字符串的公共前缀来减少无谓的字符串比较以达到提高查询效率的目的。
> Trie 树是一种多叉树的结构，每个节点保存一个字符，一条完整路径表示一个字符串。

## 结构示意图

![](https://img.hailuo4ever.com/acwing_ba_ch2/8.png)

## 构造

1. 根据题目给定的数据类型，确定树分支的最大数目。假如均为小写字母，则最大枝数为 26
2. 定义 Trie 树本身：`int son[N][26]` N 为题目给定的全部字符串总长度。
3. 定义计数数组 `cnt[N]`，表示以某个节点为结尾的单词一共有多少个
4. 定义 `str[N]`，处理输入输出、传递询问串
5. 定义 `idx`，记录创建树时，当前操作的节点编号

**注意下标为 0 的点既是 root 节点，也是空节点（如果一个点没有子节点了，它就指向 0）**

**son[x][0]代表 x 的第 0 个儿子，son[x][1]代表 x 的第 1 个儿子，以此类推**

## 插入/存储

```java
void insert(char str[]) // 向集合中插入一个字符串
{
    int p = 0; // root节点

    for (int i = 0; str[i]; i++)
    {
        int u = str[i] - 'a'; // 每个字母对应的子节点编号（相当于把a-z映射到0-25）

        if (!son[p][u]) // p节点没有u这个儿子
            son[p][u] = ++idx; // 创建子节点

        // 此时当前的节点一定存在下一个节点，让p走到下一个点
        p = son[p][u];
    }
    // 出for以后，p 等于字符串 s 的尾字符所对应的 idx
    // 此时p已经走完了，所以以p节点为结尾的单词多了一个，把cnt[p] ++
    cnt[p]++;
}
```

## 查找

```java
int query(char str[]) // 询问一个字符串在集合中出现了多少次
{
    int p = 0;
    for (int i = 0; str[i]; i++)
    {
        int u = str[i] - 'a';
        if (!son[p][u]) // 找不到str中的某个字符
            return 0;
        else
            p = son[p][u]; // 找到了就往下走一步
    }
    return cnt[p];
}
```

## 完整代码

**例题-Acwing835**/**Luogu-P2580**

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 10;

int son[N][26], cnt[N], idx;
char str[N];

void insert(char str[]) // 向集合中插入一个字符串
{
    int p = 0; // root节点

    for (int i = 0; str[i]; i++)
    {
        int u = str[i] - 'a'; // 每个字母对应的子节点编号（相当于把a-z映射到0-25）

        if (!son[p][u]) // p节点没有u这个儿子
            son[p][u] = ++idx; // 创建子节点

        // 此时当前的节点一定存在下一个节点，让p走到下一个点
        p = son[p][u];
    }
    // 这个时候，p 等于字符串 s 的尾字符所对应的 idx
    // 此时p已经走完了，所以以p节点为结尾的单词多了一个
    cnt[p]++;
}

int query(char str[]) // 询问一个字符串在集合中出现了多少次
{
    int p = 0;
    for (int i = 0; str[i]; i++)
    {
        int u = str[i] - 'a';
        if (!son[p][u]) // 找不到str中的某个字符
            return 0;
        else
            p = son[p][u]; // 找到了就往下走一步
    }
    return cnt[p];
}
int main()
{
    int n;
    cin >> n;
    while (n--)
    {
        char op[2];
        scanf("%s%s", op, str);
        if (op[0] == 'I')
            insert(str);
        else
            printf("%d\n", query(str));
    }
}
```

## 01 Trie

> 将一个数的二进制表示看作一个字符串，就可以得到 **01 Trie 树**
> 获取每一位二进制数的方法（从高位开始）：
> ` for (int i = 30; i >= 0; i--)  int u = x >> 1 & 1;`

```cpp
// Problem: 最大异或对
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/145/
/*
    把每个数都以二进制存储在Trie树中，
    在第一个数字固定的情况下，尽可能地让第二个数的每一位都与第一个数的对应位相反，
    这样最终确定的第二个数与第一个数的异或值就最大
*/
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 10;

int n, a[N], son[31 * N][2], idx;

void insert(int x)
{
    int p = 0;
    for (int i = 30; i >= 0; i--)
    {
        int u = x >> i & 1; // 从最高位开始获取u的每一位二进制数

        if (!son[p][u]) // 存入树中
            son[p][u] = ++idx;
        p = son[p][u];
    }
}

int query(int x)
{
    int p = 0, res = 0;
    for (int i = 30; i >= 0; i--)
    {
        int u = x >> 1 & 1;

        if (son[p][!u]) // 每次尽可能走到与当前位的值相反的结点
        {
            p = son[p][!u];
            res = res * 2 + !u; // 边走边计算res，多了一个二进制位，相当于给前面的结果*2，再加上2的0次方乘以多的那个0/1
        }
        else
        {
            p = son[p][u];
            res = res * 2 + u;
        }
    }
    return res; // res存储的是路径上所表示的数
}
int main()
{
    int res = 0;
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = 0; i < n; i++)
    {
        insert(a[i]); // 先插入再查询，不用特判空集
        int t = query(a[i]);
        res = max(res, a[i] ^ t); // 异或
    }
    cout << res << endl;
    return 0;
}
```

# 并查集

> 并查集可以高效进行下列操作：
>
> - 合并两个集合
> - 询问两个元素是否在同一个集合当中

## 基本原理与思路

> [!TIP]
> 原理：每个集合用一棵树来表示，树根的编号即为整个集合的编号
> 每个节点 `x` 存储它的父节点 `p[x]`

### 初始化

`for (int i = 1; i <= n; i++) p[i] = i;`

### 判断树根

`if(p[x] == x)`

### 求 x 的所在集合编号（原始思路）

`while(p[x] != x)  x = p[x];` 向上遍历到根节点

#### 优化思路：路径压缩

查询过程中，经过的每个元素都属于该集合，我们可以将其直接连到根节点以加快后续查询。

优化后，并查集查询的速度近似 `O(1)`。

![](https://img.hailuo4ever.com/acwing_ba_ch2/9.png)

### 合并两个集合

若 `p[x]` 是 `x` 的集合编号，`p[y]` 是 `y` 的集合编号，合并操作为 `p[x] = y`

即将一棵树的根节点连接到另一棵树的根节点：

![](https://img.hailuo4ever.com/acwing_ba_ch2/10.png)

## 并查集的核心：查找根节点

> [!TIP]
> 如果 `x` 不是集合的根节点，首先不断递推，直到找到它的祖宗节点。之后回归，不断将祖宗节点的值赋给 `p[x]`，即查询过程中经过的每个元素。实现了路径压缩

```cpp
int find(int x)
{
    if (p[x] != x) // 若x不是根节点
        p[x] = find(p[x]); // 路径压缩。此处是递归调用，所以不需要写while
    return p[x]; // 返回x的祖宗节点
}
```

# 堆

> 堆是维护一个数据集合的数据结构。支持以下操作：
>
> 1. 向集合中插入一个数
> 2. 求集合当中的最小值
> 3. 删除集合当中的最小值
>    注：每个节点的键值都大于等于其父亲键值的堆叫做小根堆，否则叫做大根堆。

## 基本结构

> 堆是一棵完全二叉树，即除最后一层是**尽可能从左向右连续排列**之外，每一层都是满的

![](https://img.hailuo4ever.com/acwing_ba_ch2/11.png)

## 手写堆

> 手写堆支持**直接实现**以下操作：
>
> 1. 删除任意一个元素
> 2. 修改任意一个元素
>    插入、删除、上下移元素的时间复杂度为 O(logn)

### 堆的存储方式

![](https://img.hailuo4ever.com/acwing_ba_ch2/12.png)

使用一维数组，令 `heap[1]` 为树的起始点（也是最大值/最小值）

> 注：一定要**从 1 开始**，否则下面的计算公式就失效了

在整棵树中，都有：**x**的左儿子为**heap[2x]**，右儿子为**heap[2x+1]**

### 维护堆性质的基本操作：上移和下移元素

以**小根堆**为例：

上移时，比较该节点和它的根节点，若该节点更小就 swap，swap 到不能交换为止

下移时，找该节点和它的两个儿子中的最小值，swap 到不能交换为止

```cpp
void up(int u)
{
    while (u / 2 && h[u] < h[u / 2])
    {
        swap(h[u], h[u / 2]);
        u /= 2;
    }
}
```

```cpp
void down(int u)
{
    int t = u; // t为父亲和两个儿子中的最小值

    if (u * 2 <= size && h[u * 2] < h[t]) // 先判断有没有左儿子，再判断大小关系
        t = u * 2;
    if (u * 2 + 1 <= size && h[u * 2 + 1] < h[t]) // 先判断有没有右儿子，再判断大小关系
        t = u * 2 + 1;

    if (u != t) // 需要交换的时候
    {
        swap(h[u], h[t]);
        down(t); // 交换后继续递归处理
    }
}
```

### 建堆

> 本方法的时间复杂度为 O(n)，也可以直接插入全部数据，复杂度为 O(nlogn)

**从叶子开始，逐个向下调整。每次合并两个已经调整好的堆**

> 从 `(n/2)` 开始调整即可，因为对于最后一层的每个点，它位于倒数第二层的父亲都是 `(n/2)`，所以从 `(n/2)` 开始一直 down 到根节点 1 即可，可以减少部分调整次数

`for(int i = n / 2; i >= 1; i--) down(i)`

#### 时间复杂度为 O(n)的分析

![](https://img.hailuo4ever.com/acwing_ba_ch2/13.png)

### 插入数据

> 在整个堆的**最后一个地方**插入 x，并 up 到对应的位置

`heap[++size] = x, up(size); `

### 删除堆头（根节点）

1. 用最后一个数据覆盖掉第一个数据：`heap[1] = heap[size]`
2. 把最后一个点删掉：`size--`
3. 让第一个数据回到它该在的位置：`down(1)`

### 删除任意元素

1. 用最后一个数据覆盖掉删除的数据：`heap[k] = heap[size]`
2. 把最后一个点删掉：`size--`
3. 由于不知道 `heap[size]` 和原来 `heap[k]` 的大小关系，直接写 `down(k);up(k);`

> 只会执行正确的那一步操作（即需要 down 的时候，up 操作无作用）

### 修改任意元素

直接修改，并调整位置：`heap[k] = x; down(k); up(k);`

> 只会执行正确的那一步操作（即需要 down 的时候，up 操作无作用）

## STL-priority \_queue

`#include <queue>`

> 提供常数时间的最大元素查找，对数时间的插入与提取，底层原理是二叉堆。

### 构造

> 大根堆/小根堆可以理解为越大/越小的元素，优先级越高，越先出队

`priority_queue<类型, 容器, 比较器> pque`

- 类型：要储存的数据类型
- 容器：储存数据的底层容器，默认为 `vector<类型>`，竞赛中保持默认即可
- 比较器：比较大小使用的比较器，默认为 `less<类型>`，可自定义

```cpp
priority_queue<int> pque1;                            // 储存int的大顶堆
priority_queue<int, vector<int>, greater<int>> pque2; // 储存int的小顶堆
```

### 其他操作

`pque.push()`

`pque.pop()`

`pque.top()`

`pque.empty() / size()`

### 注意事项

**仅可读取堆顶、所有元素不可修改（堆顶例外）**

# Hash

> 哈希表又称散列表，一种以「key-value」形式存储数据的数据结构。所谓以「key-value」形式存储数据，是指任意的键值 key 都唯一对应到内存中的某个位置。只需要输入查找的键值，就可以快速地找到其对应的 value。可以把哈希表理解为一种高级的数组，这种数组的下标可以是很大的整数，浮点数，字符串甚至结构体。——OI wiki
> 一般情况下，哈希表的时间复杂度可以看作 O(1)

## 哈希函数

> 要让键值对应到内存中的位置，就要为键值计算索引，也就是计算这个数据应该放到哪里。这个根据键值计算索引的函数就叫做哈希函数，也称散列函数。

哈希函数应当计算便捷，且尽量有相对均匀的映射关系

一般情况下，哈希函数可以通过**直接对原数据取模**实现。

**为保证冲突概率最小，取模的数应当是质数，且距离 2 的 n 次幂范围尽可能远**

## 拉链法（开散列法）

1. 开一个一维数组，存放所有的哈希值（Key）
2. 把每个 Key 值看作单链表的开头，把数据链在下方，防止哈希冲突
3. 查找的时候遍历对应键值的单链表即可

> 一般不进行删除操作，若需要删除，可以开 bool 数组打标记

#### 插入与查找函数

```cpp
void insert(int m)
{
	int k = (m % N + N) % N; // 映射，保证 k 映射后是正数，所以有 +N
	// 单链表的存储，相当于插在头结点（h[k]）后面
	e[idx] = m;
	ne[idx] = h[k]; // idx的next指针指向下一个点
	h[k] = idx++;
}
bool find(int x)
{
	int k = (x % N + N) % N;
	for (int i = h[k]; i != -1; i = ne[i])
		if (e[i] == x)
			return true;
	return false;
}
```

![](https://img.hailuo4ever.com/acwing_ba_ch2/14.png)

## 开放寻址法（闭散列法）

> 开放寻址法把所有记录直接存储在哈希表中，如果发生冲突则根据某种方式继续进行探查。

1. 开一个一维数组，大小一般是题目数据范围的2-3倍

2. 定义一个题目数据范围外的数，表示null

3. 映射数据，以每个映射值为起点，向下一格一格的填充

```java
int find(int m) // 返回一个位置
{
    int k = (m % N + N) % N;

    while (h[k] != null && h[k] != m)
    {
        k++;
        if (k == N) // 如果检查完了最后一个数，就要循环去看第一个
            k = 0;
    }
    return k;
}

如果m不在哈希表中，则find()会返回它应该被存储的位置（存储之前，这个位置上的值是null）。
如果m在哈希表中，则find()会返回它在的位置。
```

# 字符串哈希

> 此方法假定不存在哈希冲突！

## 求哈希值的思路

> [!TIP]
> 经验上，取 `P=131 or 13131`，`Q=2^64`，可尽可能规避哈希冲突
> 开 `unsigned long long` 存储哈希值等同于 `mod 2^64`

例：`str = "ABCD"`

1. 把 `str` 看作一个共有四位的 p 进制数，并映射每一位字母**（不能映射为 0！）**

> `ABCD --> (1234)p`

1. 使用多项式法计算哈希值，由于结果可能很大，所以对其模上一个比较小的数 Q

> `(1234)p = (1*p^3+2*p^2+3*p^1+4*p^0) mod Q`

## 前缀哈希法

定义 `unsigned long long h[]` 数组，存放一个字符串每一位的哈希值

> 例：`str="ABCD"`
> `h[0] = 0`, `h[1] = Hash "A"`, `h[2] = Hash "AB"`,`h[3] = Hash "ABC"`

### 求一个字符串中间某段的哈希值

`h[L~R] = h[R] - h[L - 1] * p^(R-L+1)`

> 区间和公式的理解: ABCDE 与 ABC 的前三个字符值是一样，只差两位，
> 乘上 P 的二次方把 ABC 变为 ABC00，再用 ABCDE - ABC00 得到 DE 的哈希值。

![](https://img.hailuo4ever.com/acwing_ba_ch2/15.png)

### 预处理前缀哈希值的公式

`p[i] = p[i - 1] * P;` **同时预处理出 p 的 n 次方**

`h[i] = h[i-1] * P + str[i]`
