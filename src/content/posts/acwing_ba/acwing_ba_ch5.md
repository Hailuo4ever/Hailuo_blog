---
title: 基础课-动态规划
published: 2026-03-06
description: "Acwing算法基础课-Ch5-动态规划"
image: https://img.hailuo4ever.com/cover/acwing.png
tags: [算法笔记, Acwing]
category: "Algorithm"
draft: false
lang: ""
---

> [!TIP]
> DP 问题的本质：有限集中的最优解
> DP 问题的时间复杂度分析方法：状态数量 \* 转移计算量
> 注意：方程中需要计算下标 i-1 的时候，输入需要从 1 开始，否则从 0 开始

![](https://img.hailuo4ever.com/acwing_ba_ch5/1.png)

1. 表示集合及集合的状态
2. 划分集合：寻找最后一个不同点
3. 状态计算：把集合分成若干个子集，先求解若干个子集的解，再加起来
4. 考虑状态转移：
   - 先考虑：如果没有进行这个操作应该是什么状态
   - 然后考虑：进行这一步操作之后会对你下一个状态造成什么影响
   - 然后再加上之前状态表示中，决策出来的那个 DP 属性，写出状态转移方程

5. 考虑状态数据的初始化

# 背包问题

> 在二维优化到一维的过程中，如果二维的转移方程用到了上一次计算的数据，在优化到一维时，应该从大到小枚举，否则从小到大枚举。详见 **01 背包的一维优化**

## 01 背包

> 有 N 件物品和一个容量是 V 的背包。**每件物品最多只能使用一次。**
> 第 i 件物品的体积是 vi，价值是 wi。
> 求解将哪些物品装入背包，可使这些物品的总体积不超过背包容量，且总价值最大。
> 输出最大价值。

### 思路

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/2.png)

#### 状态计算部分

设状态 `f(i, j)` 代表前 i 个物品，背包容量 j 下的最大价值，以是否包含第 i 件物品，划分整个集合

![](https://img.hailuo4ever.com/acwing_ba_ch5/3.png)

#### 状态转移方程及其优化

##### 朴素的状态转移方程（二维）

![](https://img.hailuo4ever.com/acwing_ba_ch5/4.png)

$$
f[i][j] =
\begin{cases}
f[i - 1][j] & \text{} v_i \geq j \\
\max\{f[i - 1][j], f[i - 1][j - v_i]\} + w_i & \text{} v_i < j
\end{cases}
$$

从计算公式可以看出，`f[i][j]` 是由 `f[i - 1][j -vi] ` 和 `w[i]` 计算出来的。也就是 `f[i][j]` 的值是可以从前面已经计算出的 f 值求出来。如果我们能确定 `f[i][j]` 的一部分初始值，就能通过该公式，一步步计算得出 `f[N][V]`，也就是我们要找的答案。显然，初始值为 `f[0][0~m] = 0`

##### 优化的状态转移方程（一维）

如果空间压缩成一维，对于 01 背包问题，更新 `f[i][j]` 需要上一轮的 `j - v[i]`，对应的是 `i-1`

如果 `j` 从小到大遍历，由于先计算 `j - v[i]` 再计算 `j`，上一轮的值会被覆盖

![](https://img.hailuo4ever.com/acwing_ba_ch5/5.png)

### 代码

写代码时，判断从 0 还是从 1 开始循环的方法：检查 `f[i][j]` 的合法性

```cpp
// Problem: 01背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/2/
// Time: 2026-01-28 13:02:37
// 注意初始化时需要计算所有状态
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i]; // 读入所有物品

    // 根据题意，f[0][0~m] = 0

    for (int i = 1; i <= n; i++)
    {
        for (int j = 0; j <= m; j++)
        {
            f[i][j] = f[i - 1][j]; // 左侧集合

            if (j >= v[i]) // 右侧集合
                f[i][j] = max(f[i][j], f[i - 1][j - v[i]] + w[i]);
        }
    }

    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 01背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/2/
// Time: 2026-01-28 13:02:37
// 注意初始化时需要计算所有状态
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i]; // 读入所有物品


    for (int i = 1; i <= n; i++)
        for (int j = m; j >= v[i]; j--)
            f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[m] << endl;
    return 0;
}
```

## 完全背包

> 有 N 种物品和一个容量是 V 的背包，每种物品都有无限件可用。
> 第 i 种物品的体积是 vi，价值是 wi。
> 求解将哪些物品装入背包，可使这些物品的总体积不超过背包容量，且总价值最大。
> 输出最大价值。

### 思路

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/6.png)

#### 状态计算部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/7.png)

#### 状态转移方程及其优化

##### 朴素的状态转移方程

$$
f[i][j] = \max\big( f[i][j],\; f[i-1][j - k \cdot v[i]] + k \cdot w[i] \big)
$$

##### 优化的状态转移方程

把 k 展开，进行枚举：

$$
\footnotesize f[i,j] = \max \scriptsize( f[i-1,j],\; f[i-1,j-v]+w,\; f[i-1,j-2v]+2w,\; f[i-1,j-3v]+3w,\; \dots \big)
$$

$$
\footnotesize f[i,j-v] = \max \footnotesize( f[i-1,j-v],\; f[i-1,j-2v]+w,\; f[i-1,j-3v]+2w,\; \dots \big)
$$

也就是说，`f[i][j]` 最大值的时候，只需要将 `f[i][j-v]` 的最大值直接 `+w` 即可

由上两式，可得出如下递推关系：

$$
f[i][j] = \max\big( f[i,j-v] + w,\; f[i-1][j] \big)
$$

即有状态转移方程：

$$
f[i][j] = \max\big( f[i][j],\; f[i][j - v[i]] + w[i] \big)
$$

可以再变成更优化的状态转移方程（一维）：

$$
f[j] = \max\big( f[j],\; f[j - v[i]] + w[i] \big)
$$

注：对于完全背包，更新 `f[i][j]` 需要的是本轮的 `j - v[i]`，所以需要从小到大遍历

### 代码

```cpp
// Problem: 完全背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/3/
// Time: 2026-01-29 14:41:38
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];

    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= m; j++)
            for (int k = 0; k * v[i] <= j; k++) // 注意k的大小受体积j的约束
                f[i][j] = max(f[i][j], f[i - 1][j - v[i] * k] + k * w[i]);

    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 完全背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/3/
// Time: 2026-01-29 14:41:38
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N][N];

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];

    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= m; j++)
        {
            f[i][j] = f[i - 1][j];

            if (j >= v[i])
                f[i][j] = max(f[i][j], f[i][j - v[i]] + w[i]);
        }

    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 完全背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/3/
// Time: 2026-01-29 14:41:38
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

const int N = 1010;

int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i];

    for (int i = 1; i <= n; i++)
        for (int j = v[i]; j <= m; j++)
        {
            f[j] = max(f[j], f[j - v[i]] + w[i]);
        }

    cout << f[m] << endl;
    return 0;
}
```

## 多重背包

> 有 N 种物品和一个容量是 V 的背包。
> 第 i 种物品最多有 si 件，每件体积是 vi，价值是 wi。
> 求解将哪些物品装入背包，可使物品体积总和不超过背包容量，且价值总和最大。
> 输出最大价值。
> **完全背包只有背包体积够不够用，而多重背包既要考虑背包体积，又要考虑背包体积够了，但物品数量不够的情况**

### 思路

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/8.png)

#### 状态计算部分

和完全背包问题高度相似，只是把“完全”的条件改了一下

![](https://img.hailuo4ever.com/acwing_ba_ch5/9.png)

#### 状态转移方程及其优化

##### 朴素的状态转移方程

注意枚举 `k` 的时候有以下限制：`k <= s[i] && k * v[i] <= j`

$$
f[i][j] = \max\big( f[i][j],\; f[i-1][j - k \cdot v[i]] + k \cdot w[i] \big)
$$

##### 优化技巧：二进制分组优化 +01 背包一维优化

> 存在如下定理：任意一个实数都可以用二进制数来表示

二进制优化是一种减少枚举次数的策略：

假如要拿 1001 次苹果，暴力枚举方式就是拿 1001 次，而二进制优化的思维是把 1001 个苹果分成装有 512,256,128,64,32,8,1 的七个箱子，这样一来，1001 次操作就变成了 7 次操作。时间复杂度由$O(n^3)$变为了$O(n^2 \log S)$

二进制优化后，多重背包就转换成了一个 01 背包问题，也就是对于每一堆，我们都尝试取或不取两种情况，其实等价于枚举 1001 次，因为 DP 问题只考虑最优解，通过这种方法，大大减小了计算的次数

### 代码

```cpp
// Problem: 多重背包问题 I
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/4/
// Time: 2026-01-29 20:37:20
// 数据范围比较小，直接打暴力即可
// Powered by CP Editor (https://cpeditor.org)
#include <iostream>
using namespace std;
const int N = 110;

int n, m;
int v[N], w[N], s[N];
int f[N][N];

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i] >> s[i];

    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= m; j++)
            for (int k = 0; k <= s[i] && k * v[i] <= j; k++)
                f[i][j] = max(f[i][j], f[i - 1][j - k * v[i]] + k * w[i]);

    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 多重背包问题 II
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/5/
// Time: 2026-01-31 09:13:09
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

const int N = 25000, M = 2010;

int n, m;
int v[N], w[N];
int f[N];

int main()
{
    cin >> n >> m;

    int cnt = 0; // 分组的组别
    for (int i = 1; i <= n; i++) // n种物品，对于每一种物品，我们都要把它二进制分堆
    {
        int a, b, s;
        cin >> a >> b >> s;

        int k = 1; // 组别里面的个数，从1也就是2的0次方开始
        while (k <= s)
        {
            cnt++; // 增加组别数
            v[cnt] = a * k; // 整体的体积
            w[cnt] = b * k; // 整体的价值
            s -= k; // s减小
            k *= 2; // 组别里的个数增加（乘2）
        }

        if (s > 0) // 二进制分完后，剩下的那一组
        {
            cnt++;
            v[cnt] = a * s;
            w[cnt] = b * s;
        }
    }

    n = cnt; // 枚举的次数从原来的个数，变为组别数

    // 01背包的一维做法
    for (int i = 1; i <= n; i++)
        for (int j = m; j >= v[i]; j--)
            f[j] = max(f[j], f[j - v[i]] + w[i]);

    cout << f[m] << endl;
    return 0;
}
```

## 分组背包

> 有 N 组物品和一个容量是 V 的背包。
> 每组物品有若干个，同一组内的物品最多只能选一个。
> 每件物品的体积是 vij，价值是 wij，其中 i 是组号，j 是组内编号。
> 求解将哪些物品装入背包，可使物品总体积不超过背包容量，且总价值最大。
> 输出最大价值。

### 思路

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/10.png)

#### 状态计算部分

分组背包问题，是枚举第 i 组物品中选哪个（或不选）

![](https://img.hailuo4ever.com/acwing_ba_ch5/11.png)

#### 状态转移方程及其优化

##### 朴素的状态转移方程

$$
f[i][j] =
\begin{cases}
f[i - 1][j] & \text{} v[i][k] > j \\
\max\{f[i][j], f[i - 1][j - v[i][k]] + w[i][k] & \text{} v[i][k] \leqslant j
\end{cases}
$$

##### 一维优化的状态转移方程

注意体积 `j` 需要从大到小枚举

$$
f[j] = \max\big( f[j],\; f[j - v[i][k]] + w[i][k] \big) \quad v[i][k] \leq j
$$

### 代码

```cpp
// Problem: 分组背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/9/
// Time: 2026-01-31 11:03:12
//
// Powered by CP Editor (https://cpeditor.org)
#include <algorithm>
#include <iostream>
using namespace std;

const int N = 110;

int n, m;
int v[N][N], w[N][N], s[N];
int f[N][N];

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
    {
        cin >> s[i];
        for (int j = 0; j < s[i]; j++)
            cin >> v[i][j] >> w[i][j];
    }

    for (int i = 1; i <= n; i++)
    {
        for (int j = 0; j <= m; j++)
        {
            f[i][j] = f[i - 1][j]; // 不选
            for (int k = 0; k < s[i]; k++)
            {
                if (j >= v[i][k])
                    f[i][j] = max(f[i][j], f[i - 1][j - v[i][k]] + w[i][k]);
            }
        }
    }
    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 分组背包问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/9/
// Time: 2026-01-31 11:03:12
//
// Powered by CP Editor (https://cpeditor.org)
#include <algorithm>
#include <iostream>
using namespace std;

const int N = 110;

int n, m;
int v[N][N], w[N][N], s[N];
int f[N];

int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
    {
        cin >> s[i];
        for (int j = 0; j < s[i]; j++)
            cin >> v[i][j] >> w[i][j];
    }

    for (int i = 1; i <= n; i++)
        for (int j = m; j >= 0; j--)
            for (int k = 0; k < s[i]; k++)
                if (v[i][k] <= j)
                    f[j] = max(f[j], f[j - v[i][k]] + w[i][k]);

    cout << f[m] << endl;
    return 0;
}
```

# 线性 DP

> 此类问题的递推方程存在一个线性关系。可能是一维线性，也可能是多维线性，求解问题时，有一个“线性”的顺序

## 数字三角形

### 思路

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/12.png)

#### 状态转移方程

$$
f[i][j] = \max\big( f[i - 1][j - 1] + a[i][j],\; f[i - 1][j] + a[i][j] \big)
$$

### 代码

> 注意：由于状态转移方程中的 max，为了规避边界问题，我们把所有的边界都设置成负无穷
> 在初始化 `f[][]` 为负无穷时，第二维应当初始化到 `j+1`

```cpp
// Problem: 数字三角形
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/900/
// Time: 2026-01-31 20:51:31
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 510, INF = 0x3f3f3f3f;

int n;
int a[N][N];
int f[N][N];

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= i; j++)
            cin >> a[i][j];

    for (int i = 0; i <= n; i++)
        for (int j = 0; j <= i + 1; j++)
            f[i][j] = -INF; // 初始化成负无穷，规避max带来的边界问题

    f[1][1] = a[1][1];

    for (int i = 2; i <= n; i++)
        for (int j = 1; j <= i; j++)
            f[i][j] = max(f[i - 1][j - 1] + a[i][j], f[i - 1][j] + a[i][j]);

    int res = -INF; // 遍历尾部的点时，可能会出现到不了的情况，所以初始化成负无穷
    for (int i = 1; i <= n; i++) // 遍历三角形最后一行
        res = max(res, f[n][i]);

    cout << res << endl;
    return 0;
}
```

## 最长上升子序列

### 思路（动态规划）

#### 分析部分

![](https://img.hailuo4ever.com/acwing_ba_ch5/13.png)

#### 状态转移方程

> 时间复杂度$O(n^2)$

$$
f[i] = \max\big( f[i],\; f[j] + 1 \big), \quad \text{} a[i] > a[j]
$$

### 思路（贪心 + 二分）

> [https://www.acwing.com/solution/content/6525/](https://www.acwing.com/solution/content/6525/)
> 适用于数据范围比较大的情况，由于动态规划比较暴力，会 TLE

### 代码

```cpp
// Problem: 最长上升子序列
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/897/
// Time: 2026-02-01 10:51:11
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int n;
int a[N], f[N];

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];

    for (int i = 1; i <= n; i++)
    {
        f[i] = 1; // 初始化只有a[i]一个数的情况

        for (int j = 1; j <= i; j++) // 从1开始枚举，第i个数的上一个数是哪个数
        {
            if (a[i] > a[j]) // 如果a[i]更大，显然是上升的
                f[i] = max(f[i], f[j] + 1);
        }
    }

    int res = 0;
    for (int i = 1; i <= n; i++) // 遍历所有的“第i个点”
        res = max(res, f[i]);

    cout << res << endl;
    return 0;
}
```

```cpp
// Problem: 最长上升子序列 II
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/898/
// Time: 2026-02-02 13:22:39
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 100010;

int n;
int a[N];
int q[N]; // 存储长度为i的上升子序列中末尾元素最小的数

int main()
{
    cin >> n;

    for (int i = 0; i < n; i++)
        cin >> a[i];

    int len = 0; // 记录q数组元素个数

    for (int i = 0; i < n; i++)
    {
        int l = 0, r = len;
        while (l < r)
        {
            int mid = l + r + 1 >> 1;
            if (q[mid] < a[i])
                l = mid;
            else
                r = mid - 1;
        }

        q[r + 1] = a[i];
        if (r + 1 > len)
            len++;
    }

    cout << len << endl;
    return 0;
}
```

## 最长公共子序列

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/14.png)

### 代码

```cpp
// Problem: 最长公共子序列
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/899/
// Time: 2026-02-01 15:52:03
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int f[N][N];
char a[N], b[N];
int n, m;

int main()
{
    cin >> n >> m >> a + 1 >> b + 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            if (a[i] == b[j])
                f[i][j] = max(f[i][j], f[i - 1][j - 1] + 1);
            else
                f[i][j] = max(f[i - 1][j], f[i][j - 1]);
        }

    cout << f[n][m] << endl;
    return 0;
}
```

## 编辑距离

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/15.png)

### 代码

```cpp
// Problem: 最短编辑距离
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/904/
// Time: 2026-02-01 17:27:13
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int n, m;
char a[N], b[N];
int f[N][N];

int main()
{
    cin >> n >> a + 1 >> m >> b + 1;

    // 初始化
    for (int i = 0; i <= m; i++)
        f[0][i] = i;
    for (int i = 0; i <= n; i++)
        f[i][0] = i;

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
        {
            f[i][j] = min(f[i - 1][j] + 1, f[i][j - 1] + 1);
            if (a[i] == b[j])
                f[i][j] = min(f[i][j], f[i - 1][j - 1]);
            else
                f[i][j] = min(f[i][j], f[i - 1][j - 1] + 1);
        }

    cout << f[n][m] << endl;
    return 0;
}
```

```cpp
// Problem: 编辑距离
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/901/
// Time: 2026-02-02 10:03:54
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 15, M = 1010;

int n, m;
int f[N][N];
char str[M][N];

int edit_distance(char a[], char b[])
{
    int la = strlen(a + 1), lb = strlen(b + 1);

    for (int i = 0; i <= lb; i++)
        f[0][i] = i;
    for (int i = 0; i <= la; i++)
        f[i][0] = i;

    for (int i = 1; i <= la; i++)
        for (int j = 1; j <= lb; j++)
        {
            f[i][j] = min(f[i - 1][j] + 1, f[i][j - 1] + 1);
            if (a[i] == b[j])
                f[i][j] = min(f[i][j], f[i - 1][j - 1]);
            else
                f[i][j] = min(f[i][j], f[i - 1][j - 1] + 1);
        }

    return f[la][lb];
}
int main()
{
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        cin >> str[i] + 1;

    while (m--)
    {
        char s[N];
        int limit;
        cin >> s + 1 >> limit;

        int res = 0;
        for (int i = 0; i < n; i++)
            if (edit_distance(str[i], s) <= limit)
                res++;

        cout << res << endl;
    }
    return 0;
}
```

# 区间 DP

> 所有的区间 dp 问题枚举时，第一维通常是枚举区间长度，并且一般 len = 1 时用来初始化，枚举从 len = 2 开始；第二维枚举起点 i （右端点 j 通过计算获得，j = i + len - 1），最后枚举分割点，构造状态转移方程

## 例题：石子合并

![](https://img.hailuo4ever.com/acwing_ba_ch5/16.png)

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/17.png)

### 代码

```cpp
// Problem: 石子合并
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/284/
// Time: 2026-02-02 10:16:14
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 310;

int n;
int s[N]; // 前缀和
int f[N][N]; // 表示将i到j这一段石子合并成一堆的方案的集合，属性 Min

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
    {
        cin >> s[i];
        s[i] += s[i - 1];
    }

    memset(f, 0x3f, sizeof f); // 初始化成无穷大

    for (int len = 1; len <= n; len++) // 从小到大枚举长度
        for (int i = 1; i + len - 1 <= n; i++) // 枚举区间左端点
        {
            int l = i;
            int r = l + len - 1; // 计算区间右端点
            if (len == 1) // 合并一堆石子的代价为0
            {
                f[l][r] = 0;
                continue;
            }

            for (int k = l; k <= r - 1; k++) // 枚举分界点
                f[l][r] = min(f[l][r], f[l][k] + f[k + 1][r] + s[r] - s[l - 1]);
        }

    cout << f[1][n] << endl;
    return 0;
}
```

# 计数类 DP

## 例题：整数划分

> 一个正整数 n 可以表示成若干个正整数之和，形如：n=n1+n2+…+nk，其中 n1≥n2≥…≥nk,k≥1。
> 我们将这样的一种表示称为正整数 n 的一种划分。
> 现在给定一个正整数 n，请你求出 n 共有多少种不同的划分方法。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/18.png)

![](https://img.hailuo4ever.com/acwing_ba_ch5/19.png)

### 代码

```cpp
// Problem: 整数划分
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/902/
// Time: 2026-02-02 21:09:58
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010, mod = 1e9 + 7;

int n;
int f[N];

int main()
{
    cin >> n;
    f[0] = 1; // 除f[0]之外其余都是0

    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j++)
            f[j] = (f[j] + f[j - i]) % mod;

    cout << f[n] << endl;
    return 0;
}
```

```cpp
// Problem: 整数划分
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/902/
// Time: 2026-02-02 21:09:58
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1010, mod = 1e9 + 7;

int n;
int f[N][N];

int main()
{
    cin >> n;
    f[0][0] = 1; // 除f[0]之外其余都是0

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= i; j++)
            f[i][j] = (f[i - 1][j - 1] + f[i - j][j]) % mod;

    int res = 0;
    for (int i = 1; i <= n; i++)
        res = (res + f[n][i]) % mod;

    cout << res << endl;
    return 0;
}
```

# 数位统计 DP

## 例题：数位统计

> 给定两个整数 a 和 b，求 a 和 b 之间的所有数字中 0∼9 的出现次数。
> 例如，a=1024，b=1032，则 a 和 b 之间共有 9 个数如下：
> `1024 1025 1026 1027 1028 1029 1030 1031 1032`
> 其中 `0` 出现 10 次，`1` 出现 10 次，`2` 出现 7 次，`3` 出现 3 次等等…

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/20.png)

### 代码

```cpp
// Problem: 计数问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/340/
// Time: 2026-02-03 21:58:49
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int get(vector<int> num, int l, int r) // 求num里第l位到第r位的数字
{
    int res = 0;
    for (int i = l; i >= r; i--)
        res = res * 10 + num[i];

    return res;
}

int power10(int x) // 求10的i次方
{
    int res = 1;
    while (x--)
        res *= 10;
    return res;
}

int count(int n, int x)
{
    if (n == 0)
        return 0;

    vector<int> num; // 存储数字n的每位数（倒着放进vector）
    while (n)
    {
        num.push_back(n % 10);
        n /= 10;
    }

    n = num.size(); // 把每位数都放进vector以后，n可以表示数的长度

    int res = 0; // 答案（出现次数）
    for (int i = n - 1 - !x; i >= 0; i--) // 从num的最高位开始枚举（把数字正过来）
    {
        if (i < n - 1)
        {
            res += get(num, n - 1, i + 1) * power10(i);
            if (x == 0)
                res -= power10(i); // 不能出现前导0，减掉一个power10
        }

        if (num[i] == x)
            res += get(num, i - 1, 0) + 1;

        else if (num[i] > x)
            res += power10(i);
    }

    return res;
}
int main()
{
    int a, b;
    while (cin >> a >> b, a || b)
    {
        if (a > b)
            swap(a, b);

        // 分别统计从0到9的次数
        for (int i = 0; i < 10; i++)
            cout << count(b, i) - count(a - 1, i) << " ";

        cout << endl;
    }

    return 0;
}
```

# 状压 DP

> 状压 DP 是动态规划的一种，通过将状态集合转化为整数记录在 DP 状态中来实现状态转移的目的．
> 为了达到更低的时间复杂度，通常需要寻找更低状态数的状态．大部分题目中会利用二元状态，用 n 位二进制数表示 n 个独立二元状态的情况．
> 状压 DP 的时间复杂度为$O(n^22^n)$，通常可以过$n \leqslant 21$的数据范围

## 例题：蒙德里安的梦想

> 求把 N×M 的棋盘分割成若干个 1×2 的长方形，有多少种方案。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/21.png)

### 代码

```cpp
// Problem: 蒙德里安的梦想
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/293/
// Time: 2026-02-06 09:12:12
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 12, M = 1 << N; // 2^12

int n, m;
long long f[N][M];
vector<vector<int>> state(M); // 预处理出所有合法状态
bool st[M]; // 判断当前这一列是不是可以被竖着的方格填满

int main()
{
    while (cin >> n >> m, n || m)
    {
        for (int i = 0; i < (1 << n); i++) // 预处理st数组
        {
            int cnt = 0; // 表示0的个数
            bool is_valid = true;

            for (int j = 0; j < n; j++)
            {
                if ((i >> j) & 1)
                // i >> j位运算，表示i（i在此处是一种状态）的二进制数的第j位；
                //  &1为判断该位是否为1，如果为1进入if
                {
                    if (cnt & 1) // 这一位为1，看前面连续的0的个数，如果是奇数（cnt &1为真）则该状态不合法
                    {
                        is_valid = false;
                        break;
                    }
                    cnt = 0;
                    // 既然该位是1，并且前面不是奇数个0（经过上面的if判断），计数器清零。
                }
                else
                    cnt++;
            }

            if (cnt & 1) // 判断连续个0的个数，如果是奇数就是false
                is_valid = false;

            st[i] = is_valid;
        }

        // 第二部分：预处理2
        // 经过上面每种状态 连续0的判断，已经筛掉一些状态。
        // 下面来看进一步的判断：看第i-2列伸出来的和第i-1列伸出去的是否冲突
        for (int j = 0; j < (1 << n); j++) // 枚举所有合法状态
        {
            state[j].clear();
            for (int k = 0; k < (1 << n); k++)
                if ((j & k) == 0 && st[j | k])
                    // j|k是考虑第i-1列到底有几个1，包含了第i-2列伸过来和第i-1列伸出去的两种情况
                    state[j].push_back(k);
        }


        // 第三部分：开始dp
        memset(f, 0, sizeof f);
        f[0][0] = 1;

        for (int i = 1; i <= m; i++) // 遍历每一列
        {
            for (int j = 0; j < (1 << n); j++) // 遍历当前列（第i列）的所有状态j
            {
                for (auto k: state[j]) // 遍历第i-1列的状态k
                {
                    f[i][j] += f[i - 1][k];
                }
            }
        }

        cout << f[m][0] << endl;
    }

    return 0;
}
```

## 例题：最短 Hamilton 路径（旅行商问题）

> 给定一张 n 个点的带权无向图，点从 0∼n−1 标号，求起点 0 到终点 n−1 的最短 Hamilton 路径。
> Hamilton 路径的定义是从 0 到 n−1 不重不漏地经过每个点恰好一次。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/22.png)

### 代码

```cpp
// Problem: 最短Hamilton路径
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/93/
// Time: 2026-02-06 10:44:06
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 20, M = 1 << 20;

int n;
int f[M][N]; // M代表状态
int w[N][N]; // 边权

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> w[i][j];

    memset(f, 0x3f, sizeof f);
    f[1][0] = 0;

    for (int i = 0; i < (1 << n); i++)
        for (int j = 0; j < n; j++)
            if (i >> j & 1)
                for (int k = 0; k < n; k++)
                    if ((i - (1 << j)) >> k & 1)
                        f[i][j] = min(f[i][j], f[i - (1 << j)][k] + w[k][j]);

    cout << f[(1 << n) - 1][n - 1] << endl;
    return 0;
}
```

# 树形 DP

## 例题：没有上司的舞会

> Ural 大学有 N 名职员，编号为 `1∼N`。
> 他们的关系就像一棵以校长为根的树，父节点就是子节点的直接上司。
> 每个职员有一个快乐指数，用整数 Hi 给出，其中 `1 ≤ i ≤ N`。
> 现在要召开一场周年庆宴会，不过，没有职员愿意和直接上司一起参会。
> 在满足这个条件的前提下，主办方希望邀请一部分职员参会，使得所有参会职员的快乐指数总和最大，求这个最大值。

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/23.png)

### 代码

```cpp
// Problem: 没有上司的舞会
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/287/
// Time: 2026-02-03 17:49:16
// 时间复杂度O(n)，n-1条边
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 6010;

int n;
int happy[N];
int h[N], e[N], ne[N], idx; // 邻接表
int f[N][2]; // 状态
bool has_father[N]; // 需要自己找根节点，即判断有没有父亲

void add(int a, int b)
{
    e[idx] = b;
    ne[idx] = h[a];
    h[a] = idx++;
}

void dfs(int u)
{
    f[u][1] = happy[u]; // 递归到第u层，就先把选上的情况赋值

    for (int i = h[u]; i != -1; i = ne[i])
    {
        int j = e[i];
        dfs(j); // 递归处理

        f[u][0] += max(f[j][0], f[j][1]);
        f[u][1] += f[j][0];
    }
}

int main()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        cin >> happy[i];

    memset(h, -1, sizeof h);

    for (int i = 0; i < n - 1; i++)
    {
        int a, b;
        cin >> a >> b;
        has_father[a] = true;
        add(b, a);
    }

    int root = 1;
    while (has_father[root])
        root++;

    dfs(root); // 从根节点开始搜索

    cout << max(f[root][0], f[root][1]); // 输出不选根节点和选根节点的最大值

    return 0;
}
```

# 记忆化搜索

## 基本思想

记忆化搜索就是 `dfs`+ 记忆化数组 `f[i][j]`。

先初始化整个 `f[][]` 为 `-1`，在算某一个位置时，把它的所有路径上所有算过的位置状态保存在数组 `f[i][j]` 里。`if (f[x][y] != -1) return f[x][y];`，下次求某个被算过的位置的状态时，无需重新计算，直接返回。是数组 `f[i][j]` 起到了记忆的作用。

## 例题：滑雪

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch5/24.png)

### 代码

```java
// Problem: 滑雪
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/903/
// Time: 2026-02-03 20:46:34
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 310;

int n, m;
int h[N][N]; // 高度
int f[N][N]; // 状态

int dx[4] = {-1, 0, 1, 0};
int dy[4] = {0, -1, 0, 1};

int dp(int x, int y)
{
    int &v = f[x][y]; // 取引用简化代码

    if (v != -1) // 如果这个状态已经算过了，就直接return回去
        return v;

    v = 1; // 初始化v，假如在原地不动，走不了，路径就是1

    for (int i = 0; i < 4; i++)
    {
        int a = x + dx[i], b = y + dy[i];

        // 满足这些条件，才能从(x, y)走到(a, b)
        if (a >= 1 && a <= n && b >= 1 && b <= m && h[a][b] < h[x][y])
            v = max(v, dp(a, b) + 1); // 记忆化搜索
    }

    return v;
}
int main()
{
    cin >> n >> m;

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cin >> h[i][j];

    memset(f, -1, sizeof f);

    int res = 0;

    // 枚举滑雪场里的每个点作为起点
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            res = max(res, dp(i, j));

    cout << res << endl;
    return 0;
}
```
