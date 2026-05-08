---
title: 提高课-数学
status: "editing"
published: 2026-05-08
description: "Acwing算法提高课-Ch5-数学"
image: "https://img.hailuo4ever.com/cover/acwing.png"
tags: [算法笔记, Acwing]
category: "Algorithm"
draft: false
lang: ""
---

# 矩阵快速幂

> 矩阵快速幂是算法竞赛中一个非常实用的工具，它的核心价值在于：把 $O(n)$ 的线性递推优化到 $O(\log n)$，从而解决 `n` 极大（比如 $10^{18}$ 量级）的问题。
>
> 常见用途有以下几种：
>
> 1. 快速求解线性递推数列
> 2. 图论中的路径计数
> 3. 状态压缩DP的加速

## 前置线性代数知识

### 矩阵乘法

> [!NOTE]
>
> 注意矩阵快速幂中的矩阵一定是一个方阵，这样才有“幂”的概念。
>
> 下面的代码是通用的矩阵乘法形式，在矩阵快速幂中有 `m == n`。

```c++
 for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            for (int k = 1; k <= n; k++)
                c[i][j] += a[i][k] * b[k][j];
```

### 单位矩阵

主对角线全是 `1`，其他地方全是 `0` 的矩阵是单位矩阵，它乘任意矩阵的结果都等于任意矩阵本身。

## 矩阵快速幂

由于矩阵乘法满足结合律，一个单位矩阵用快速幂乘上 `n` 次就是矩阵快速幂了。

特殊地，定义 $A^0$ 为单位矩阵 $I = \begin{bmatrix} 1 & 0 & \cdots & 0 \\ 0 & 1 & \cdots & 0 \\ \vdots & \vdots & \ddots & \vdots \\ 0 & 0 & \cdots & 1 \end{bmatrix}$。

### Code

```c++
// Problem: Luogu P3390
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P3390
// Time: 2026-05-08 12:56:14
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 101;
const ll mod = 1e9 + 7;

auto matrix_mul(const vector<vector<ll>> &a, const vector<vector<ll>> &b)
{
    int n = (int) a.size() - 1;
    vector<vector<ll>> res(n + 1, vector<ll>(n + 1, 0));

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            for (int k = 1; k <= n; k++)
                res[i][j] = (res[i][j] + a[i][k] * b[k][j]) % mod;

    return res;
}

auto matrix_power(vector<vector<ll>> m, ll k)
{
    int n = m.size() - 1;

    vector<vector<ll>> res(n + 1, vector<ll>(n + 1, 0)); // 注意一开始res是单位矩阵

    for (int i = 1; i <= n; i++)
        res[i][i] = 1;

    while (k) // 和快速幂相同
    {
        if (k & 1)
            res = matrix_mul(res, m);

        m = matrix_mul(m, m);

        k >>= 1;
    }

    return res;
}

void solve()
{
    int n;
    ll k;
    cin >> n >> k;

    vector<vector<ll>> a(n + 1, vector<ll>(n + 1));

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cin >> a[i][j];

    auto res = matrix_power(a, k);

    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            cout << res[i][j] << " \n"[j == n];
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

## 矩阵加速

了解了矩阵快速幂的基本算法以后，我们可以在很多情况下利用矩阵快速幂实现矩阵加速。

矩阵加速只适用于**固定关系**的递推式，也就是说不适用于存在条件转移的情况。

**固定关系**的一维一阶递推表达式，可以用基本的乘法快速幂解决，时间复杂度 $O(\log n)$，可以推广到一维 $k$ 阶。

> 例如有一个递推表达式为 $f(n)=3 \times f(n-1)$，我们在求每一项时只要知道前一项的值就可以了，这样的表达式称作一维一阶的递推式。

**固定关系**的一维 $k$ 阶递推表达式，可以用矩阵快速幂解决，时间复杂度 $O(\log n \times k^3)$。

> 例如，`Fibonacci` 数列的递推表达式是 $f(n)=f(n-1)+f(n-2)$，这就是一个一维二阶的递推式。一维二阶的递推式一定存在一个 `2x2` 的关系矩阵。

使用矩阵加速的难点在于构造初始的关系矩阵（也就是“单位矩阵”），关系矩阵的第1列直接由递推表达式的系数决定，剩下的项可以通过前面的初始项代入求解。

### 矩阵加速模板

将矩阵乘法和矩阵快速幂封装在一个结构体里，方便调用模板。

使用重载运算符的方式进行矩阵乘法，下面进行一些代码实现的说明：

1. 当写下 `A * B` 时，实际上是 `A.operator*(B)`，左参数会通过一个隐藏的指针 `this` 进行隐式调用，可以使用 `this -> mat` 来访问。右参数是显式传入的。
2. 矩阵乘法中循环顺序为 `i, k, j` 可以加快计算速度。
3. `assert()`用于断言表达式，如果表达式错误，程序会输出错误信息并终止，否则正常运行。详见：[assert - cppreference.cn - C++参考手册](https://cppreference.cn/w/cpp/error/assert)

```c++
struct Matrix
{
    int r, c;
    vector<vector<ll>> mat;

    // 构造函数：初始化为 r 行 c 列的零矩阵
    Matrix(int r, int c) : r(r), c(c), mat(r, vector<ll>(c, 0)){}

    // 重载乘法运算符
    Matrix operator*(const Matrix &other) const
    {
        // 结果矩阵的行数等于左矩阵的行数，列数等于右矩阵的列数
        Matrix res(r, other.c);

        for (int i = 0; i < r; i++)
        {
            for (int k = 0; k < c; k++)
            {
                // 如果乘数为 0，直接跳过内层循环
                if (mat[i][k] == 0)
                    continue;
                for (int j = 0; j < other.c; j++)
                    res.mat[i][j] = (res.mat[i][j] + mat[i][k] * other.mat[k][j]) % mod;
            }
        }
        return res;
    }

    Matrix power(ll k) const // 矩阵快速幂
    {
        assert(r == c);
        Matrix res(r, c);

        for (int i = 0; i < r; i++) // 初始化单位矩阵
            res.mat[i][i] = 1;

        Matrix base = *this;
        while (k > 0)
        {
            if (k & 1)
                res = res * base;
            base = base * base;
            k >>= 1;
        }
        return res;
    }
};
```



### Fibonacci

例题链接：[P1962 斐波那契数列 - 洛谷](https://www.luogu.com.cn/problem/P1962)

我们首先假设关系矩阵是 $\begin{bmatrix} a & c \\ b & d \end{bmatrix}$，由于关系式 $f(n)=f(n-1)+f(n-2)$，等号右侧的两个数系数都是 `1`，直接确定 `a = 1, b = 1`。由于初始矩阵是 $\begin{bmatrix} 1 & 0 \end{bmatrix}$，也就是 `Fibonacci` 数列的第 `1` 项和第 `0` 项，我们已知它乘上关系矩阵以后，一定可以得到 `Fibonacci` 数列的第 `2` 项和第 `1` 项，因此直接模拟一次矩阵乘法求出 `c` 和 `d`。

最终的矩阵递推式：$\begin{bmatrix} f_i \\ f_{i-1} \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} \cdot \begin{bmatrix} f_{i-1} \\ f_{i-2} \end{bmatrix}$，注意特判边界情况：求前两项直接输出 `1` 即可。

#### Code

```c++
// Problem: Luogu P1962
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P1962
// Time: 2026-05-08 13:36:52
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

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;
const ll mod = 1e9 + 7;

struct Matrix
{
    int r, c;
    vector<vector<ll>> mat;

    Matrix(int r, int c) : r(r), c(c), mat(r, vector<ll>(c, 0))
    {
    }

    Matrix operator*(const Matrix &other) const
    {
        Matrix res(r, other.c);

        for (int i = 0; i < r; i++)
        {
            for (int k = 0; k < c; k++)
            {
                if (mat[i][k] == 0)
                    continue;
                for (int j = 0; j < other.c; j++)
                {
                    res.mat[i][j] = (res.mat[i][j] + mat[i][k] * other.mat[k][j]) % mod;
                }
            }
        }
        return res;
    }

    Matrix power(ll k) const
    {
        assert(r == c);
        Matrix res(r, c);

        for (int i = 0; i < r; i++)
            res.mat[i][i] = 1;

        Matrix base = *this;
        while (k > 0)
        {
            if (k & 1)
                res = res * base;
            base = base * base;
            k >>= 1;
        }
        return res;
    }
};

void solve()
{
    ll n;
    cin >> n;

    if (n <= 2)
    {
        cout << 1 << endl;
        return;
    }

    // 构造转移矩阵（关系矩阵）
    Matrix base(2, 2);
    base.mat[0][0] = 1;
    base.mat[0][1] = 1;
    base.mat[1][0] = 1;
    base.mat[1][1] = 0;

    Matrix res = base.power(n - 1);

    cout << res.mat[0][0] << endl;
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

