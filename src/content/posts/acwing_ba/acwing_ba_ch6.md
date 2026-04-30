---
title: 基础课-贪心
published: 2026-02-26
description: 'Acwing算法基础课-Ch6-贪心'
image: https://img.hailuo4ever.com/cover/acwing.png
tags: [算法笔记, Acwing]
category: 'Algorithm'
draft: false
lang: ''
---

> [!TIP]
> 贪心是一种比较短视的思想，即只在当前状态考虑最优解，最终就能取得全局最优解
> 处理贪心问题，如果没有思路时，可以先尝试排序一下，考虑贪心做法有没有问题

# 区间问题

## 区间选点

> 给定 N 个闭区间 [ai,bi]，请你在数轴上选择尽量少的点，使得每个区间内至少包含一个选出的点。
> 输出选择的点的最小数量。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/1.png)

1. 将每个区间按右端点从小到大排序
2. 从前往后依次枚举每个区间，如果当前区间已经包含点，就跳过。否则选择当前区间的右端点

### 代码

```cpp
// Problem: 区间选点
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/907/
// Time: 2026-02-04 10:00:19
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int n;
pair<int, int> section[N];
bool cmp(pair<int, int> &A, pair<int, int> &B) { return A.second < B.second; }

int main()
{
    cin >> n;

    for (int i = 0; i < n; i++)
    {
        int l, r;
        cin >> l >> r;
        section[i] = {l, r};
    }

    sort(section, section + n, cmp);

    int res = 0, ed = -2e9;
    for (int i = 0; i < n; i++)
    {
        if (section[i].first > ed)
        {
            res++;
            ed = section[i].second;
        }
    }

    cout << res << endl;
    return 0;
}
```

## 最大不相交区间数量

> 给定 N 个闭区间 [ai,bi]，请你在数轴上选择若干区间，使得选中的区间之间互不相交（包括端点）。
> 输出可选取区间的最大数量。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/2.png)

1. 将每个区间按右端点从小到大排序
2. 从前往后依次枚举每个区间，如果当前区间已经包含点，就跳过。否则选择当前区间的右端点
3. 答案即为最大不相交区间数量。因为如果几个区间能被同一个点覆盖，就说明他们相交了，所以有几个选点，就有几个不相交区间

### 代码

和区间选点的代码相同。

## 区间分组

### 思路

> [!TIP]
> 可以理解为：区间当成一个人占用某物品的时间，谁先来(左端点小)谁先上，哪个物品先用完(右端点小)先腾出来哪个

![](https://img.hailuo4ever.com/acwing_ba_ch6/3.png)

1. 将所有区间按左端点从小到大排序
2. 从前往后处理每个区间，依次判断能否将其放到某个现有的组中
3. 用一个小根堆动态维护每个组的最右端点，`heap.top()` 即对应最小的最右端点

![](https://img.hailuo4ever.com/acwing_ba_ch6/4.png)

### 代码

```cpp
// Problem: 区间分组
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/908/
// Time: 2026-02-04 16:37:39
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int n;
pair<int, int> s[N];

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        int l, r;
        cin >> l >> r;
        s[i] = {l, r};
    }

    sort(s, s + n);

    priority_queue<int, vector<int>, greater<int>> heap;
    // 存储的是每个组的最右的端点，为了快速找出右侧端点最小的集合

    for (int i = 0; i < n; i++)
    {
        if (heap.empty() || heap.top() >= s[i].first) // 开一个新组，把这个区间放在新组的情况
            heap.push(s[i].second);

        else // 把这个区间放在组里的情况，只需要判断和右侧端点最小的那个组是否相交即可
        {
            heap.pop();
            heap.push(s[i].second);
        }
    }

    cout << heap.size() << endl;
    return 0;
}
```

## 区间覆盖

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/5.png)

1. 将所有区间按左端点从小到大排序
2. 从小到大枚举所有区间，在所有可以覆盖到 `start` 的区间里，选择右端点最大的区间
3. 将 `start` 更新成右端点的最大值

### 代码

```cpp
// Problem: 区间覆盖
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/909/
// Time: 2026-02-04 21:55:00
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int n, st, ed;
pair<int, int> s[N];

int main()
{
    cin >> st >> ed >> n;

    for (int i = 0; i < n; i++)
    {
        int l, r;
        cin >> l >> r;
        s[i] = {l, r};
    }

    sort(s, s + n);

    int res = 0;
    bool success = false;

    for (int i = 0; i < n; i++) // 枚举所有区间，注意左端点不是从0~n遍历，而是跳过了j已经遍历的点
    {
        // right应该在循坏里面定义，否则会把上一次的区间也算进去
        int j = i, r = -2e9;

        // 双指针，找到左端点在st之前的所有区间，并记录最大的右端点
        while (j < n && s[j].first <= st)
        {
            r = max(r, s[j].second);
            j++;
        }

        if (r < st) // 右端点在st之前，说明无法覆盖
        {
            res = -1;
            break;
        }

        res++; // 到这里还没跳出的话，说明找到了一个区间

        if (r >= ed) // 如果有个区间能覆盖end，说明能覆盖给定区间
        {
            success = true;
            break;
        }

        st = r;
        i = j - 1;
    }

    if (!success) // 遍历所有区间还没有覆盖到end的话，就没答案
        res = -1;

    cout << res << endl;

    return 0;
}
```

# Huffman 树

> 设二叉树具有 n 个带权叶结点，从根结点到各叶结点的路径长度与相应叶节点权值的乘积之和称为**树的带权路径长度。**设 wi 为二叉树第 i 个叶节点的权值，li 为从根节点到第 i 个叶节点的路径长度，
> 则树的带权路径长度为：$WPL = \sum_{i=1}^n w_i l_i$
> 对于给定一组具有确定权值的叶结点，可以构造出不同的二叉树，其中，**WPL 最小的二叉树**称为**霍夫曼树（Huffman Tree）**
> 对于霍夫曼树来说，其叶结点权值越小，离根越远，叶结点权值越大，离根越近，此外整棵树中仅有叶结点的度为 0，其他结点度均为 2

## 合并果子

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/6.png)

### 代码

```cpp
// Problem: 合并果子
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/150/
// Time: 2026-02-04 22:33:13
// 注意本题允许合并不连续的各堆果子，而区间dp的合并石子是连续的
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
int main()
{
    int n;
    cin >> n;

    priority_queue<int, vector<int>, greater<int>> heap;

    while (n--)
    {
        int x;
        cin >> x;
        heap.push(x);
    }

    int res = 0;
    while (heap.size() > 1)
    {
        int a = heap.top();
        heap.pop();
        int b = heap.top();
        heap.pop();

        res += (a + b);
        heap.push(a + b);
    }

    cout << res << endl;
    return 0;
}
```

## 合并果子加强版

> [2026 牛客寒假集训营 5-D](https://ac.nowcoder.com/acm/contest/120565/D)
> 本题思路：每次找出重量的最小值，先在这堆内部合并，如果最后剩一堆，就尝试和次小值合并，用 map 维护整个过程

```cpp
#include <bits/stdc++.h>
using namespace std;
const int mod = 1e9 + 7;
const int N = 1e5 + 10;
typedef long long ll;

map<ll, ll> mp; // weight - count
ll res;

int main()
{
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++)
    {
        ll c, w;
        cin >> c >> w;

        mp[w] += c;
    }

    while (mp.size() > 1 || (mp.size() == 1 && mp.begin()->second > 1))
    {
        auto it = mp.begin();

        ll wgt = it->first, cnt = it->second;
        if (cnt >= 2)
        {
            ll merge_times = cnt / 2;

            ll tmp = ((wgt % mod) * 2) % mod;
            tmp = tmp * (merge_times % mod) % mod;
            res = (res + tmp) % mod;

            mp[2 * wgt] += merge_times;

            if (cnt % 2 == 0)
                mp.erase(it);
            else
                it->second = 1;
        }

        else // cnt == 1
        {
            auto ne = next(it);

            ll wgt2 = ne->first, cnt2 = ne->second;

            ll tmp = (wgt2 % mod + wgt % mod) % mod;
            res = (res + tmp) % mod;

            mp[wgt2 + wgt] += 1;

            mp.erase(it);
            if (cnt2 == 1)
                mp.erase(ne);
            else
                ne->second -= 1;
        }
    }

    cout << res << endl;
    return 0;
}
```

# 排序不等式

## 排队打水

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/7.png)

### 代码

```cpp
// Problem: 排队打水
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/description/915/
// Time: 2026-02-05 16:37:52
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int a[N];
int n;
long long res;

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    sort(a + 1, a + n + 1);

    for (int i = 1; i <= n; i++)
    {
        int j = n - i;
        res += a[i] * j;
    }

    cout << res << endl;
    return 0;
}
```

# 绝对值不等式

## 货仓选址

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/8.png)

### 代码

```cpp
// Problem: 货仓选址
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/106/
// Time: 2026-02-05 17:30:03
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int n;
int a[N];
int res;

int main()
{
    cin >> n;

    for (int i = 0; i < n; i++)
        cin >> a[i];

    sort(a, a + n);

    for (int i = 0; i < n; i++)
    {
        res += abs(a[n >> 1] - a[i]);
    }

    cout << res << endl;
    return 0;
}
```

# 贪心递推公式

## 耍杂技的牛

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch6/9.png)

### 代码

```cpp
// Problem: 耍杂技的牛
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/127/
// Time: 2026-02-05 17:53:05
// 存在结论：按照w[i] + s[i]从小到大的顺序排，最大的危险系数一定最小
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 50010;

int n;
PII cow[N];

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
    {
        int w, s;
        cin >> w >> s;
        cow[i] = {w + s, w}; // 存储每头牛的w+s的总和
    }

    sort(cow, cow + n);
    int res = -2e9, sum = 0;
    for (int i = 0; i < n; i++)
    {
        int w = cow[i].second, s = cow[i].first - w;
        res = max(res, sum - s); // 计算每头牛的风险值并取最大
        sum += w; // 总重量
    }

    cout << res << endl;
    return 0;
}
```
