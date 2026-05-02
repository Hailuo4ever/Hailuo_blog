---
title: 基础课-数论
published: 2026-02-16
description: "Acwing算法基础课-Ch4-数论"
image: https://img.hailuo4ever.com/cover/acwing.png
tags: [算法笔记, Acwing]
category: "Algorithm"
draft: false
lang: ""
---

# 格雷码

格雷码是一个二进制数字系统, 其中两个相邻数的二进制位只有一位不同
例如：3 位二进制数的格雷码序列为：
`000,001,011,010,110,111,101,100`
对应十进制数 `0,1,3,2,6,7,5,4`

> 对应十进制数 `0,1,3,2,6,7,5,4`

## 构造方式

### 手动构造

**k 位的格雷码**可通过执行下列策略 $2^{k-1}$ 次来进行构造：

1. 翻转最低位，得到下一个格雷码（例如 `000->001`）
2. 把最右边的 1 的左边的位翻转，得到下一个格雷码（例如 `001->011`）

### 镜像构造

k 位的格雷码可以从 k-1 位的格雷码上下镜面反射后加上新位的方式快速得到

![](https://img.hailuo4ever.com/acwing_ba_ch4/1.png)

## 计算方法

### 分治法（基于镜像构造）

将序列的最高位按照 0 和 1 分成左右两部分, 往下分治递归

![](https://img.hailuo4ever.com/acwing_ba_ch4/2.png)

```cpp
//求出n位格雷码中的k号二进制串。
#include <bits/stdc++.h>
using namespace std;

typedef unsigned long long ull;

string f(int n, int k)
{
    if (n == 0) // 位数是0的边界情况
        return "";

    if (k < (1ull << n - 1))
        return "0" + f(n - 1, k);

    else
    {
        ull t = (1ull << n) - 1;

        if (n == 64) // 特判n=64的情况
            t = -1; // t的二进制表示是64个1
        return "1" + f(n - 1, t - k);
    }
}

int main()
{
    int n;
    ull k;
    cin >> n >> k;

    cout << f(n, k) << endl;
    return 0;
}
```

### 公式法

设第 n 个格雷码序列的十进制表示为$G(n)$, 如果$G(n)$的二进制第 i 位为 1, 仅当 n 的二进制第 i 位为 1, 第 i+1 位为 0, 或者第 i 位为 0, 第 i+1 位为 1, 所以可以看成异或运算

$$
G(n) = n \oplus \left\lfloor \frac{n}{2} \right\rfloor
$$

将 `n` 与 `n/2` 的下取整按位异或, 得到对应的格雷码值

```cpp
int grey(int n) { return n ^ (n >> 1); }
```

## 格雷码的逆变换

已知格雷码 g，求原数 n。从二进制最高位（下标为 k）遍历到最低位（个位，下标为 1）

则 n 的二进制第 i 位与 g 的二进制第 i 位$g_i$的关系如下

![](https://img.hailuo4ever.com/acwing_ba_ch4/3.png)

```cpp
int rev_g(int g)
{
  int n = 0;
  for (; g; g >>= 1) n ^= g;
  return n;
}
```

## 格雷码的应用

[牛客 2026 寒假集训营 4-C](https://ac.nowcoder.com/acm/contest/120564/C)：构造相邻两项异或值之和最小的排列

> 要想相邻两项异或值之和最小, 那就要尽量让相邻两项的二进制表示尽可能的相似, 并且不一致的地方位置越低越好。这就想到了用格雷码。

k 位二进制数的格雷码序列可以当作 k 维空间中的一个超立方体（二维里的正方形，一维里的单位向量）顶点的 Hamilton 回路，其中格雷码的每一位代表一个维度的坐标。

# 基础数论知识

> 处理数论题目时，需要特别关注时间复杂度！

## 模运算

> 定义：$a \bmod m = r \quad \text{当且仅当} \quad a = mq + r,\ 0 \le r < m$

### 基本性质

1. 模的加法：$(a + b) \bmod m = [(a \bmod m) + (b \bmod m)] \bmod m$
2. 模的减法：$(a - b) \bmod m = [(a \bmod m) - (b \bmod m) + m] \bmod m$
3. 模的乘法：$(ab) \bmod m = [(a \bmod m) \times (b \bmod m)] \bmod m$
4. 模的幂运算：$a^k \bmod m = (a \bmod m)^k \bmod m$

### 运算律

1. 加法分配：$(a + b) \bmod m = (a \bmod m + b \bmod m) \bmod m$
2. 乘法分配：$(ab) \bmod m = [(a \bmod m)(b \bmod m)] \bmod m$
3. 同样符合结合律、交换律
4. 模的加法逆元：$(-a) \bmod m = (m - a) \bmod m$
5. 模的乘法逆元：若$gcd(a,m)=1$, 则存在$a^{-1}$使得$a \cdot a^{-1} \equiv 1 \pmod{m}$

## 同余

### 同余的定义

![](https://img.hailuo4ever.com/acwing_ba_ch4/4.png)

![](https://img.hailuo4ever.com/acwing_ba_ch4/5.png)

### 同余的性质

1. 自反性：$a \equiv a \pmod{m}$
2. 对称性：若$a \equiv b \pmod{m}$, 则$b \equiv a \pmod{m}$
3. 传递性：若$a \equiv b \pmod{m}$,$b \equiv c \pmod{m}$, 则$a \equiv c \pmod{m}$
4. 线性运算：$a \pm c \equiv b \pm d \pmod{m}$,$a \times c \equiv b \times d \pmod{m}$
5. 同余式约分法则：若$a \equiv b \pmod{m}$, 且$d$是$a,b,m$的公因数, 则$\frac{a}{d} \equiv \frac{b}{d} \pmod{\frac{m}{d}}$
6. 约分的特殊情况（模与除数互质）：若$a \equiv b \pmod{m}$, 且$gcd(k,m)=1$, 则$\frac{a}{k} \equiv \frac{b}{k} \pmod{m}$**欧拉定理的证明过程使用了该性质**

## 线性同余方程

>

设$a,b,n$为整数,$x$为未知数, 那么形如$ax \equiv b\pmod m$的方程称为**线性同余方程**。

求解线性同余方程, 需要找到区间 $[0,n-1]$中$x$的全部解．当然, 将它们加减$n$的任意倍数, 依然是方程的解。在模$n$的意义下, 这些解就是该方程的全部解。

### 解法：扩展欧几里得算法

> 前置知识：

![](https://img.hailuo4ever.com/acwing_ba_ch4/6.png)

```cpp
// Problem: 线性同余方程
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/880/
// Time: 2026-02-12 21:35:01
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int exgcd(int a, int b, int &x, int &y)
{
    if (b == 0) // 边界情况
    {
        x = 1, y = 0;
        return a;
    }

    int d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

int main()
{
    int n;
    cin >> n;

    while (n--)
    {
        int a, b, m;
        cin >> a >> b >> m;

        int x, y;
        int d = exgcd(a, m, x, y);

        if (b % d)
            puts("impossible");
        else
            cout << (long long) b / d * x % m << endl;
    }
    return 0;
}
```

## 逆元

>

### 乘法逆元的定义

若整数$b,m$互质, 并且对于任意的整数$a$, 如果满足$b\mid a$, 则存在一个整数$x$, 使得$a/b \equiv a*x \pmod m$, 则称$x$为$b$的模$m$乘法逆元, 记作$b^{-1} \pmod m$

### 逆元的性质

1. 模的加法逆元：$(-a) \bmod m = (m - a) \bmod m$
2. 模的乘法逆元：若$gcd(a,m)=1$, 则存在$a^{-1}$使得$a \cdot a^{-1} \equiv 1 \pmod{m}$

### 逆元的求法

根据费马小定理，当模数为质数时，可以使用

否则，只能使用扩展欧几里得算法

## 取整函数及其表示

1. 向下取整（Floor）：$\lfloor x \rfloor$表示不大于$x$的最大整数
2. 向上取整（Ceil）：$\lceil x \rceil$表示不小于$x$的最小整数
3. 四舍五入（Round）：$[x]$需根据具体情况判断

## 算术基本定理（唯一分解定理）

>

任何一个大于 1 的自然数 N，如果 N 不为质数，那么 N 可以**唯一分解**成有限个质数的乘积

$N = P_1^{a_1} P_2^{a_2} P_3^{a_3} \cdots P_n^{a_n}$，P 均为质数，a 均为正整数。

## 欧拉定理

> 欧拉定理可以简化幂的模运算。

对于整数$n>0$和整数$a$，且$\gcd(a, n) = 1$，有$a^{\varphi(n)} \equiv 1 \pmod{n}$

即如果$a$与$n$互质，那么$a$的$\varphi(n)$次方模$n$同余于 $1$

### 欧拉定理的证明

## 费马小定理

> 当欧拉定理中的 n 为素数时，欧拉定理加强为费马小定理

设$p$是素数，对于任意素数$a$且$p \nmid a$，都有$a^{p-1} \equiv 1 \pmod{p}$

设$p$是素数，对于任意整数$a$，都有$a^p \equiv a \pmod p$

注：费马小定理的逆命题不一定成立

## 裴蜀定理

> 裴蜀定理给出了一个整数能够表示为两个整数的整系数线性组合的充分必要条件．

设$a,b$是一对正整数，那么一定存在非 0 整数$x,y$，使得$ax+by=\gcd (a,b)$

关于$x,y$的存在性的证明是构造性的，使用。

## 中国剩余定理

>

中国剩余定理可以求解如下形式的一元线性同余方程组（其中$n_1,n_2\cdots n_k$两两互质）

$$
\begin{cases}
x \equiv a_1 \pmod{n_1} \\
x \equiv a_2 \pmod{n_2} \\
\vdots \\
x \equiv a_k \pmod{n_k}
\end{cases}
$$

### 求解思路

对于方程组中的每两个式子，我们考虑将他们合并。

即存在 **k1** 与 **k2**，满足 $k_1 n_1 * k_2 n_2 = a_2 - a_1$

我们需要找到一个**最小的** k1，k2（防止中间结果溢出）使得等式成立（因为要求 `x` 最小，而 `a` 和 `m` 都是正数）。

我们已知 a1，m1，a2，m2，可以使用求解一组可行解，使得$k_1' * a_1 + k_2' * (-a_2) = \gcd(a_1, -a_2)$。如果$\gcd(a_1, -a_2) \nmid m_2 - m_1$，则无解。根据上文，我们只需要把$k_1',k_2'$扩大 `y` 倍，就可以找到满足最开始式子的 k1，k2

现在，我们需要找到**最小正整数解**

有如下可被证明的性质：$k_1 = k_1 + k \cdot \frac{a_2}{d}$，$k_2 = k_2 + k \cdot \frac{a_1}{d}$，其中 `k` 为任意整数

要找一个最小的正整数解，我们需要让$k_1 = k_1\%\operatorname{abs}\left(\frac{a_2}{d}\right)$，$k_2 = k_2\%\operatorname{abs}\left(\frac{a_1}{d}\right)$，此情况下 k 为 0

取绝对值的原因：因为不知道$\frac{a_2}{d}$的正负，所以在原基础上要尽量减多个$\operatorname{abs}(\frac{a_2}{d})$，使其为正整数且最小

### OI-wiki 的求解过程

1. 计算所有模数的积$n=n_1n_2\cdots n_k$
2. 对于第$i$个方程
   1. 计算$m_i= \frac {n} n_i$
   2. 计算$m_i$在模$n_i$意义下的逆元$m_i^{-1}$
   3. 计算$c_i=m_i m_i^{-1}$，注意这里不要对$n_i$取模

3. 方程组在模$n$意义下的唯一解为：$x = \sum_{i=1}^k a_i c_i \pmod{n}$

### 代码

```cpp
// Problem: 表达整数的奇怪方式
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/206/
// Time: 2026-03-19 23:02:27
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

LL exgcd(LL a, LL b, LL &x, LL &y)
{
    if (!b)
    {
        x = 1, y = 0;
        return a;
    }

    LL d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}


int main()
{
    int n;
    cin >> n;

    LL x = 0, m1, a1;
    cin >> m1 >> a1;
    for (int i = 0; i < n - 1; i++)
    {
        LL m2, a2;
        cin >> m2 >> a2;
        LL k1, k2;
        LL d = exgcd(m1, m2, k1, k2);
        if ((a2 - a1) % d)
        {
            x = -1;
            break;
        }

        k1 *= (a2 - a1) / d;
        k1 = (k1 % (m2 / d) + m2 / d) % (m2 / d);

        x = k1 * m1 + a1;

        LL m = abs(m1 / d * m2);
        a1 = k1 * m1 + a1;
        m1 = m;
    }

    if (x != -1)
        x = (a1 % m1 + m1) % m1;

    cout << x << endl;

    return 0;
}
```

## 卢卡斯定理

卢卡斯定理：$C_n^k \equiv C_{\lfloor n/p \rfloor}^{\lfloor k/p \rfloor} \cdot C_{n \bmod p}^{k \bmod p} \pmod{p}$

定理指出：模数为素数$p$时，大组合数的计算可以转化为规模更小的组合数的计算，即转换为$p$进制来算。

### 证明（利用生成函数）

![](https://img.hailuo4ever.com/acwing_ba_ch4/7.png)

## 杨辉三角

杨辉三角的本质是组合数的一种特殊排列形式，具体如下：

![](https://img.hailuo4ever.com/acwing_ba_ch4/8.png)

根据二项式的相关知识，杨辉三角具有如下性质：

1. 第$n$行的数字和为 $2^{n-1}$
2. $$
   C_n^r=C_{n-1}^{r-1}+C_{n-1}^r
   $$
3. 斜线上的数字个数为斐波那契数列

# 质数

> 在大于 1 的整数中，如果只包含 1 和本身这两个约数，就被称作质数，也叫素数
> 素数定理：$\pi(x) \sim \frac{x}{\ln x} \quad (x \to \infty)$
> $\pi(x)$为不超过 x 的质数的个数

## 质数的判定（试除法）

> 存在这样一个性质：假设 `d` 能整除 n，那么 `(n/d)` 也能整除 n，那么在判断时，可以减少枚举次数。
> 注意：使用 `sqrt()` 和 `i*i<=n` 这两种方法都不是最优，前者速度慢，后者容易爆数据

**最优的写法：**`i <= n / i`，时间复杂度一定是 `O(√n)`

```cpp
bool is_prime(int n)
{
    if (n < 2)
        return false;
    for (int i = 2; i <= n / i; i++)
        if (n % i == 0)
            return false;
    return true;
}
```

## 分解质因数（试除法）

> 从小到大枚举质因数，枚举策略与判定质数相同
> 最好时间复杂度：O(logn)，最坏时间复杂度：O(√n)

注意事项：

1. x 的质因子中，最多只包含一个大于 `√x` 的质数 如果有两个，他们的乘积就大于 n 了，这样矛盾
2. `i` 从 2 遍历到 `√x`，用 `x/i`，如果余数为 0，则 `i` 一定是一个质因子
3. `s` 表示质因子 i 的指数（有多少个这样的因子）
4. 最后要检查一下：是否有大于 `√x` 的因子

```cpp
// Problem: 分解质因数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/869/
// Time: 2026-02-06 17:58:57
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

void divide(int n)
{
    for (int i = 2; i <= n / i; i++)
    {
        if (n % i == 0)
        {
            int s = 0;
            while (n % i == 0)
            {
                n /= i;
                s++;
            }
            cout << i << " " << s << endl;
        }
    }

    if (n > 1) // 如果n还有剩余，说明有大于√x的质数
        cout << n << " 1" << endl;
    cout << endl;
}
int main()
{
    int n;
    scanf("%d", &n);
    while (n--)
    {
        int x;
        cin >> x;
        divide(x);
    }
    return 0;
}
```

## 质数筛

>

### 朴素筛法

> 时间复杂度$O(n \ln n)$

思路：从 2 到 n 枚举所有的数，把 2 的倍数、3 的倍数、4 的倍数、5 的倍数...都删掉，以此类推

```cpp
#include <algorithm>
#include <iostream>
using namespace std;
const int N = 1000010;

int primes[N], cnt; // primes数组用来存放质数
bool st[N]; // st[i] = true表示被筛了

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
            primes[cnt++] = i;

        for (int j = i + i; j <= n; j += i)
            st[j] = true;
    }
}

int main()
{
    int n;
    cin >> n;

    get_primes(n);

    cout << cnt << endl;

    return 0;
}
```

### 埃拉托斯特尼筛法（埃氏筛法）

> 时间复杂度$O(n \log \log n)$，近似等同于$O(n)$

思路：相比于朴素算法，减少了枚举次数，只删掉所有质数的倍数即可。

```cpp
// Problem: 筛质数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/870/
// Time: 2026-02-06 20:36:05
// Powered by CP Editor (https://cpeditor.org)
#include <algorithm>
#include <iostream>
using namespace std;
const int N = 1000010;

int primes[N], cnt; // primes数组用来存放质数
bool st[N]; // st[i] = true表示被筛了

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
        {
            primes[cnt++] = i;
            for (int j = i + i; j <= n; j += i)
                st[j] = true;
        }
    }
}

int main()
{
    int n;
    cin >> n;

    get_primes(n);

    cout << cnt << endl;

    return 0;
}
```

### 线性筛法（欧拉筛法）

> 时间复杂度$O(n)$
> 埃氏筛法仍有优化空间，它会将一个合数重复多次标记，我们可以让每个合数都只被标记一次，即为 Euler 筛法
> 此种筛法下，每个合数都只会被它的最小质因子筛掉

思路：`i` 是质数，就筛掉 `i` 与 `primes` 中所有质数的乘积；

`i` 是非质数，筛掉 `i` 与 `primes` 中所有 `<=i` 的最小质因子的乘积。

```cpp
// Problem: 筛质数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/870/
// Time: 2026-02-06 20:36:05
// Powered by CP Editor (https://cpeditor.org)
#include <algorithm>
#include <iostream>
using namespace std;
const int N = 1000010;

int primes[N], cnt; // primes数组用来存放质数
bool st[N]; // st[i] = true表示被筛了

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
            primes[cnt++] = i;

        for (int j = 0; primes[j] <= n / i; j++) // primes[j] * i <= n，此处防止爆数据
        {
            st[primes[j] * i] = true;
            // 把当前的所有质数和i的乘积都筛掉
            // 因为primes[j]是从小到大枚举的
            // 所以primes[j]一定是i的最小质因子

            if (i % primes[j] == 0)
                break;
            // i乘上其他质数的结果一定会在后面被primes[j]的倍数通过乘上最小质因子的方式筛掉
            // 就不需要在这里先筛一次了，直接break
        }
    }
}

int main()
{
    int n;
    cin >> n;

    get_primes(n);

    cout << cnt << endl;

    return 0;
}
```

# 约数

## 试除法求约数

> 存在这样一个性质：假设 `d` 能整除 n，那么 `(n/d)` 也能整除 n，即**约数是成对出现的**
> 所以我们只要枚举到 √n，然后把一对约数加到结果里即可
> 注意：存在一个边界情况，即 `d == n / d`，所以我们需要判断这对约数是否相同
> 时间复杂度：$O(n\sqrt a)$，大约要算 400-500 万次，不会超时

```cpp
// Problem: 试除法求约数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/871/
// Time: 2026-02-06 23:19:15
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

vector<int> get_divisors(int n)
{
    vector<int> res;

    for (int i = 1; i <= n / i; i++)
    {
        if (n % i == 0)
        {
            res.push_back(i);
            if (i != n / i)
                res.push_back(n / i);
        }
    }

    sort(res.begin(), res.end());
    return res;
}
int main()
{
    int n;
    cin >> n;

    while (n--)
    {
        int x;
        cin >> x;
        auto res = get_divisors(x);

        for (auto t: res)
            cout << t << " ";
        cout << endl;
    }
    return 0;
}
```

## 约数个数

> 前置知识：
> 任何一个大于 1 的自然数 N，如果 N 不为质数，那么 N 可以**唯一分解**成有限个质数的乘积
> $N = P_1^{a_1} P_2^{a_2} P_3^{a_3} \cdots P_n^{a_n}$，P 均为质数，a 均为正整数。
> 那么，对于$P_1$，可以取 $0\sim a_1$个，有$a_1+1$ 种取法，以此类推。
> **则约数的个数为**$(a_1 + 1)(a_2 + 1) \cdots (a_n + 1)$

![](https://img.hailuo4ever.com/acwing_ba_ch4/9.png)

```cpp
// Problem: 约数个数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/872/
// Time: 2026-02-07 21:38:16
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int mod = 1e9 + 7;

unordered_map<int, int> mp;

int main()
{
    int T;
    cin >> T;

    while (T--)
    {
        int n;
        cin >> n;

        for (int i = 2; i <= n / i; i++)
        {
            while (n % i == 0)
            {
                n /= i;
                mp[i]++;
            }
        }

        if (n > 1) // 可能存在比√n大的质因数
            mp[n]++;
    }

    long long res = 1;

        // 计算公式：(a1+1)(a2+1)...(an+1)
    for (auto it = mp.begin(); it != mp.end(); ++it)
        res = res * (it->second + 1) % mod;

    cout << res << endl;
    return 0;
}
```

## 约数之和

> 前置知识：
> 任何一个大于 1 的自然数 N，如果 N 不为质数，那么 N 可以**唯一分解**成有限个质数的乘积
> $N = P_1^{a_1} P_2^{a_2} P_3^{a_3} \cdots P_n^{a_n}$，P 均为质数，a 均为正整数。
> 那么，对于$P_1$，可以取 $0\sim a_1$个，有$a_1+1$ 种取法，以此类推。
> **约数之和即为**$(P_1^0 + P_1^1 + \dots + P_1^{a_1}) \cdots (P_n^0 + P_n^1 + \dots + P_n^{a_n})$
> 要计算$(P_1^0 + P_1^1 + \dots + P_1^{a_1})$，首先令 `t=1`，执行 `a1` 次 `t*p+1` 即可

```cpp
// Problem: 约数之和
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/873/
// Time: 2026-02-10 15:16:23
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int mod = 1e9 + 7;

unordered_map<int, int> mp;

int main()
{
    int T;
    cin >> T;

    while (T--)
    {
        int n;
        cin >> n;

        for (int i = 2; i <= n / i; i++)
        {
            while (n % i == 0)
            {
                n /= i;
                mp[i]++;
            }
        }

        if (n > 1) // 可能存在比√n大的质因数
            mp[n]++;
    }

    long long res = 1;

    // 计算公式：(P1^0+P1^1+...+P1^a1)...(Pn^0+Pn^1+...+Pn^an)
    for (auto it = mp.begin(); it != mp.end(); ++it)
    {
        int p = it->first, a = it->second;

        long long t = 1;
        while (a--)
            t = (t * p + 1) % mod;

        res = (res * t) % mod;
    }

    cout << res << endl;
    return 0;
}
```

## 欧几里得算法

> 欧几里得算法，也称辗转相除法，用于求解最大公因数（gcd）

存在已被证明的定理：假如 d 能整除 a 和 b，那么 d 也能整除 a+b，也能整除 xa+yb

基于以上性质，可以推出辗转相除法：`gcd(a, b) = gcd(b, a % b)`

不断辗转相除，直到括号右边数字为 0，括号左边的数就是最大公约数（a 和 0 的 gcd 一定是 a）

```cpp
while (b)
{
    int c = a % b;
    a = b;
    b = c;
}

cout << a << endl;
```

```cpp
int gcd(int a, int b)
{
    return b ? gcd(b, a % b) : a;
}
```

还可以使用 STL：`__gcd(a, b)`，注意传入的两个数据类型必须一致

# 欧拉函数

> 欧拉函数的定义为：**1~n 中与 n 互质的数的个数**
> 表示如下：$\varphi(n) = \#\{ k \in \mathbb{N}^+ : 1 \le k \le n, \gcd(k, n) = 1 \}$

## 公式求欧拉函数

首先对 `n` 分解质因数，$n = P_1^{a_1} P_2^{a_2} P_3^{a_3} \cdots P_k^{a_k}$

则欧拉函数的求解公式可以表示为：$\varphi(n) = n* \prod_{i=1}^k \left(1 - \frac{1}{p_i}\right)$

写代码时，注意初始化 `res = n`，每次执行 `res = res / i * (i - 1);`

先除后乘，防止溢出；且不要写成几分之一的形式，以规避分数下取整的问题

### 求解公式的推导（容斥原理）

![](https://img.hailuo4ever.com/acwing_ba_ch4/10.png)

### 代码

```cpp
// Problem: 欧拉函数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/875/
// Time: 2026-02-10 17:34:30
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin >> n;

    while (n--)
    {
        int a;
        cin >> a;

        int res = a; // 求解公式前面的n

        for (int i = 2; i <= a / i; i++) // 分解质因数
        {
            if (a % i == 0)
            {
                // 求解公式的等价写法，防止运算的时候出现小数
                res = res / i * (i - 1);
                while (a % i == 0)
                    a /= i;
            }
        }

        if (a > 1) // 剩余的那个因数
            res = res / a * (a - 1);

        cout << res << endl;
    }

    return 0;
}
```

## 欧拉筛求欧拉函数

> 假如需要求 1~n 每一个数的欧拉函数，公式法的时间复杂度是$O(n\sqrt n)$
> 而如果使用欧拉筛法，就可以在$O(n)$的复杂度下解决问题。

根据欧拉函数的定义，`phi[1] = 1`

质数 `i` 的欧拉函数即为 `phi[i] = i - 1`：`1 ~ i−1` 均与 `i` 互质，共 `i−1` 个。

`phi[primes[j] * i]` 分为两种情况：

1. `i % primes[j] == 0`：`primes[j]` 是 `i` 的最小质因子，也是 `primes[j] * i` 的最小质因子，因此 `1 - 1 / primes[j]` 这一项在 `phi[i]` 中计算过了，只需将基数 `N` 修正为 `primes[j]` 倍，最终结果为 `phi[i] * primes[j]`。
2. `i % primes[j] != 0`：`primes[j]` 不是 `i` 的质因子，只是 `primes[j] * i` 的最小质因子，因此不仅需要将基数 `N` 修正为 `primes[j]` 倍，还需要补上 `1 - 1 / primes[j]` 这一项，因此最终结果 `phi[i] * (primes[j] - 1)`。

```cpp
// Problem: 筛法求欧拉函数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/876/
// Time: 2026-02-10 17:51:15
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 1000010;
typedef long long ll;

bool st[N];
int primes[N], cnt;
int eular[N];

ll get_eulars(int n)
{
    eular[1] = 1;

    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
        {
            primes[cnt++] = i;
            eular[i] = i - 1; // 如果i是质数，那么2~i-1都和它互质
        }

        for (int j = 0; primes[j] <= n / i; j++)
        {
            st[primes[j] * i] = true;

            if (i % primes[j] == 0) // primes[j]是i的一个质因子
            {
                eular[primes[j] * i] = primes[j] * eular[i];
                break;
            }

            eular[primes[j] * i] = eular[i] * (primes[j] - 1);
        }
    }

    ll res = 0;

    for (int i = 1; i <= n; i++)
        res += eular[i];

    return res;
}

int main()
{
    int n;
    cin >> n;

    cout << get_eulars(n) << endl;
    return 0;
}
```

## 综合例题-洛谷 P2568

> [https://www.luogu.com.cn/problem/P2568](https://www.luogu.com.cn/problem/P2568)
> 给定正整数 _n_，求 1≤*x*,*y*≤*n* 且 gcd(_x_,_y_) 为素数的数对 (_x_,_y_) 有多少对。
> 应用知识：

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch4/11.png)

### 代码

```cpp
// Problem: Luogu P2568
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P2568
// Time: 2026-02-11 10:13:42
// 先用筛法求1~n的所有欧拉函数，再处理前缀和，计算时枚举所有质数
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 10000100;
typedef long long ll;

bool st[N];
int primes[N], cnt;
int eular[N];
ll sum_eular[N];

ll get_eulars(int n)
{
    eular[1] = 1;

    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
        {
            primes[cnt++] = i;
            eular[i] = i - 1; // 如果i是质数，那么2~i-1都和它互质
        }

        for (int j = 0; primes[j] <= n / i; j++)
        {
            st[primes[j] * i] = true;

            if (i % primes[j] == 0) // primes[j]是i的一个质因子
            {
                eular[primes[j] * i] = primes[j] * eular[i];
                break;
            }

            eular[primes[j] * i] = eular[i] * (primes[j] - 1);
        }
    }

    ll res = 0;

    for (int i = 1; i <= n; i++)
        sum_eular[i] = sum_eular[i - 1] + eular[i];

    for (int i = 0; i < cnt && primes[i] <= n; i++)
        res += 2 * sum_eular[n / primes[i]] - 1;

    return res;
}

int main()
{
    int n;
    cin >> n;

    cout << get_eulars(n) << endl;
    return 0;
}
```

# 快速幂

> 快速幂，也称二进制取幂或平方取幂法
> 给定任意的$a,k$，可以在$O(\log k)$的时间复杂度下求出$a^k$

## 快速幂的基本思想

计算$a^n$表示将$n$个$a$承在一起，但在$n$过大的时候就需要考虑优化。

快速幂（二进制取幂）的想法是，将取幂的任务按照**指数的二进制**表示，划分成更小的任务

具体步骤如下：

1. 预处理出$a^{2^0},\ a^{2^1} ,\ a^{2^2},\ \ldots,\ a^{2^{\lfloor \log_2 k \rfloor}}$，一共$\log_2 k$个数
2. 因为二进制可以表示任何一个数，所以可以把$a^k$用预处理的这些数来表示，也就是把$k$用二进制的方法表示。$a^k=a^{2^{x_1}}*a^{2^{x_2}}*\dots *a^{2^{x_t}}$，即$a^k=a^{2^{x_1}+{2^{x_2}}+\cdots+{2^{x_t}}}$

## 模意义下取幂

> 给定$a,k,p$，求出$a^k\pmod p$的值
> 由于取模运算并不干涉乘法运算，所以只要在计算过程中取模即可
> 可以采用递归或迭代法，后者更快一些。
> 思路：在循环过程中将二进制位为 1 时对应的幂累乘到答案中

```java
long long qmi(int a, int k, int p)
{
    ll res = 1 % p; // 特判p=1的情况

    while (k) // 将k看作二进制
    {
        if (k & 1) // 如果二进制表示的第0位为1，就乘上当前的a
            res = res * a % p;

        k >>= 1; // 不断右移

        a = a * (long long) a % p;
        // 更新a，a依次为a^{2^0},a^{2^1},a^{2^2},....,a^{2^logb}
    }
    return res;
}
```

## 快速幂求逆元

> 前置知识：
> 给定 n 组$a_i$，$p_i$，其中$p_i$是质数，求$a_i$模$p_i$ 的乘法逆元，若逆元不存在则输出 `impossible`。
> 快速幂法求逆元主要适用于模数$m$是质数的情形：
> $b$存在乘法逆元的充要条件是$b$与模数$m$互质，当$m$为质数时，$b^{m-2}$即为$b$的乘法逆元

### 推导过程

![](https://img.hailuo4ever.com/acwing_ba_ch4/12.png)

### 代码

```cpp
// Problem: 快速幂求逆元
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/878/
// Time: 2026-02-12 10:00:21
//
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n;

ll qmi(int a, int k, int p)
{
    ll res = 1 % p;

    while (k)
    {
        if (k & 1)
            res = res * a % p;

        k >>= 1;

        a = a * (ll) a % p;
    }
    return res;
}

int main()
{
    ios::sync_with_stdio(0);
    cin.tie(0);

    cin >> n;
    while (n--)
    {
        int a, p;
        cin >> a >> p;

        int res = qmi(a, p - 2, p);

        if (a % p)
            cout << res << endl;
        else
            cout << "impossible" << endl;
    }
    return 0;
}
```

# 扩展欧几里得算法

> 前置知识：根据，$ax+by=\gcd (a,b)$有可行解
> 扩展欧几里得算法（EXGCD）可以在给出$gcd(a,b)$的同时求出上述方程的**一组**可行解$x,y$
> 同样，可以用扩展欧几里得算法求解

## 迭代过程的推导

![](https://img.hailuo4ever.com/acwing_ba_ch4/13.png)

![](https://img.hailuo4ever.com/acwing_ba_ch4/14.png)

## 代码

```cpp
// Problem: 扩展欧几里得算法
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/879/
// Time: 2026-02-12 20:09:12
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int exgcd(int a, int b, int &x, int &y)
{
    if (b == 0) // 边界情况
    {
        x = 1, y = 0;
        return a;
    }

    int d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);

    int n;
    cin >> n;

    while (n--)
    {
        int a, b, x, y;
        cin >> a >> b;

        exgcd(a, b, x, y);
        cout << x << " " << y << endl;
    }
    return 0;
}
```

# 高斯消元

> 高斯消元法是求解线性方程组的经典算法。还可以用于行列式计算、求矩阵的逆

## 解线性方程组

> 包含$m$个方程，$n$个未知数的线性方程组：$\begin{cases}
> a_{11}x_1 + a_{12}x_2 + \cdots + a_{1n}x_n = b_1 \\
> a_{21}x_1 + a_{22}x_2 + \cdots + a_{2n}x_n = b_2 \\
> \quad \vdots \\
> a_{m1}x_1 + a_{m2}x_2 + \cdots + a_{mn}x_n = b_m
> \end{cases}$
> 高斯消元可以$O(n^3)$地求解$n$个方程和$n$个未知数的线性方程组。
> 解的情况可能出现：无解、无穷多组解、唯一解

### 线性代数知识解线性方程组

1. 倍乘：把某一行乘上一个非零的数
2. 对换：交换某两行
3. 倍加：把某行乘若干倍，再加到另一行上

**高斯消元基于以下思想：初等行列变换并不影响线性方程组解的情况。**

经过初等行列变换后，如果是完美阶梯型，代表有唯一解；若推出 0=非 0，代表有矛盾，无解；若推出很多组 0=0，代表有无穷多组解

### 高斯消元法的基本思路

**枚举每一列 C（从第一列枚举到第 n 列），对于每一列做如下操作：**

1. 找到第 C 列绝对值最大的一行
2. 将该行换到最上面
3. 将该行第一个数变成 1
4. 将下面所有行的第 c 列消成 0

#### 样例模拟

![](https://img.hailuo4ever.com/acwing_ba_ch4/15.png)

### Code

```cpp
// Problem: 高斯消元解线性方程组
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/885/
// Time: 2026-03-11 09:50:47
#include <bits/stdc++.h>
using namespace std;
const int N = 110;
const double eps = 1e-6;

int n;
double a[N][N]; // 存储增广矩阵

int gauss()
{
    int c, r; // Col & Row

    // 进行n次循环，将矩阵化为行阶梯
    for (c = 0, r = 0; c < n; c++)
    {
        int t = r;

        // 第一步：找绝对值最大的数，可以避免系数变得太大，精度较高
        for (int i = r; i < n; i++)
            if (fabs(a[i][c]) > fabs(a[t][c]))
                t = i;

        // 如果绝对值最大是0，代表这一列已被处理，直接跳过
        if (fabs(a[t][c]) < eps)
            continue;

        // 第二步：找到绝对值最大的数后，将这一行交换到最上面
        for (int i = c; i <= n; i++)
            swap(a[t][i], a[r][i]);

        // 第三步：将当前行第一个数变成1
        // 注意从第n位倒序开始变化，否则会影响后面的数
        for (int i = n; i >= c; i--)
            a[r][i] /= a[r][c];

        // 第四步：将下面所有行的第c列消成0
        for (int i = r + 1; i < n; i++)
            if (fabs(a[i][c]) > eps) // 如果当前行上的数为0，不用进行操作
                for (int j = n; j >= c; j--)
                    a[i][j] -= a[r][j] * a[i][c];

        r++;
    }

    if (r < n) // 方程数 < n，可能无解或有无数解
    {
        for (int i = r; i < n; i++)
            if (fabs(a[i][n]) > eps)
                return 2; // 无解

        return 1; // 无穷组解
    }

    // 有唯一解，从下往上回代
    for (int i = n - 1; i >= 0; i--)
        for (int j = i + 1; j < n; j++)
            a[i][n] -= a[i][j] * a[j][n];

    return 0;
}

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n + 1; j++)
            cin >> a[i][j];

    int ret = gauss();

    if (ret == 0)
    {
        for (int i = 0; i < n; i++)
            cout << fixed << setprecision(2) << a[i][n] << endl;
    }

    else if (ret == 1)
        puts("Infinite group solutions");
    else
        puts("No solution");

    return 0;
}
```

## 解异或线性方程组

> 异或线性方程组：$\begin{cases}
> M_{1,1} x_1 \oplus M_{1,2} x_2 \oplus \cdots \oplus M_{1,n} x_n = B_1 \\
> M_{2,1} x_1 \oplus M_{2,2} x_2 \oplus \cdots \oplus M_{2,n} x_n = B_2 \\
> \quad \vdots \\
> M_{n,1} x_1 \oplus M_{n,2} x_2 \oplus \cdots \oplus M_{n,n} x_n = B_n
> \end{cases}$
> 其中，`^` 表示异或（XOR），`M[i][j]` 表示第 `i` 个式子中 `x[j]` 的系数，`B[i]` 是第 `i` 个方程右端的常数，整个增广矩阵的数，取值均为 `0` 或 `1`

### 求解思路

1. 把原矩阵通过高斯消元消成上三角形矩阵（做异或操作）
   - 枚举矩阵的每一列
   - 找出第一个非零行
   - 交换非零行到最上方
   - 将该列下面的行通过异或操作清零

2. 判断解的情况确定返回值（唯一解、无解、无穷组解）
3. 反推回代，解出整个方程组

### Code

```java
// Problem: 高斯消元解异或线性方程组
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/886/
// Time: 2026-03-19 23:21:42
#include <bits/stdc++.h>
using namespace std;
const int N = 110;

int n;
int a[N][N];

int gauss()
{
    int r, c;
    for (r = c = 0; c < n; c++) // 枚举矩阵每一列
    {
        int t = r;
        for (int i = r; i < n; i++) // 找出第一个非零行
            if (a[i][c] != 0)
            {
                t = i;
                break;
            }
        if (a[t][c] == 0) // 不存在非零行，continue
            continue;

        for (int i = c; i <= n; i++) // 交换非零行到最上方
            swap(a[t][i], a[r][i]);

        for (int i = r + 1; i < n; i++) // 将该列下面的行通过异或操作清零
            if (a[i][c])
                for (int j = c; j <= n; j++)
                    a[i][j] ^= a[r][j];
        r++;
    }

    if (r < n)
    {
        for (int i = r; i < n; i++)
        {
            if (a[i][n] != 0) // 有矛盾
                return 2;
        }
        return 1; // 有无穷组解
    }

    for (int i = n - 1; i >= 0; i--)
        for (int j = i + 1; j <= n; j++)
            a[i][n] ^= a[i][j] & a[j][n]; // 计算唯一解

    return 0;
}

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n + 1; j++)
            cin >> a[i][j];

    int res = gauss();

    if (res == 0)
    {
        for (int i = 0; i < n; i++)
            cout << a[i][n] << endl;
    }
    else if (res == 1)
        puts("Multiple sets of solutions");
    else
        puts("No solution");
    return 0;
}
```

# 求组合数

> 组合数基本公式：$C_a^b= \frac{a!}{b!(a-b)!}$
> 注意：$a<b$时，规定组合数$C_a^b=0$
> 根据不同的数据范围，选用不同的解法。

## 递推法

> 询问数 $1 \leqslant n \leqslant 10000$，$1 \leqslant b \leqslant a \leqslant 2000$，对 $10^9 +7$ 取模

> [!TIP]
> 通过类似于 01 背包的动态规划法，递推出所有组合数的结果
> 时间复杂度：$O(ab)$

### 递推公式推导

设$C_a^b$表示需要从$a$个苹果中选出$b$个苹果。

对$a$个苹果中的一个苹果进行分析，一定有**选或不选这个苹果**两种情况：

1. 选：已经选了一个苹果，剩下只要从$a-1$个苹果中选$b-1$个
2. 不选：还要从$a-1$个苹果中选$b$个

**即可得到如下递推公式：**$C_a^b=C_{a-1}^b+C_{a-1}^{b-1}$

### 代码

```cpp
// Problem: 求组合数 I
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/887/
// Time: 2026-02-15 12:53:54
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 2010, mod = 1e9 + 7;

int c[N][N]; // 全局变量初始化了i>j的情况都为0

int main()
{
    for (int i = 0; i < N; i++)
        for (int j = 0; j <= i; j++)
            if (j == 0)
                c[i][j] = 1; // 初始化：C(i, 0) = 1，注意C(0, 0) = 1！
            else
                c[i][j] = (c[i - 1][j] + c[i - 1][j - 1]) % mod;

    int n;
    cin >> n;

    while (n--)
    {
        int a, b;
        cin >> a >> b;
        cout << c[a][b] << endl;
    }

    return 0;
}
```

## 快速幂法

> 询问数 $1 \leqslant n \leqslant 10000$，$1 \leqslant b \leqslant a \leqslant 10^5$，对 $10^9 +7$ 取模
> 前置知识：

> [!TIP]
> 根据费马小定理，可以用快速幂预处理出所有阶乘和逆元
> 时间复杂度：$O(a)$

![](https://img.hailuo4ever.com/acwing_ba_ch4/16.png)

```cpp
// Problem: 求组合数 II
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/description/888/
// Time: 2026-02-15 13:32:19
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 100010, mod = 1e9 + 7;

int fact[N], infact[N];

int qmi(int a, int k, int p)
{
    int res = 1;
    while (k)
    {
        if (k & 1)
            res = (ll) res * a % p;

        a = (ll) a * a % p;
        k >>= 1;
    }
    return res;
}
int main()
{
    fact[0] = infact[0] = 1;

    for (int i = 1; i <= N; i++)
    {
        fact[i] = (ll) fact[i - 1] * i % mod;
        infact[i] = (ll) infact[i - 1] * qmi(i, mod - 2, mod) % mod;
    }

    int n;
    cin >> n;

    while (n--)
    {
        int a, b;
        cin >> a >> b;

        ll res = (ll) fact[a] * infact[b] % mod * infact[a - b] % mod;

        cout << res << endl;
    }

    return 0;
}
```

## 卢卡斯定理

> 询问数 $1 \leqslant n \leqslant 10000$，$1 \leqslant b \leqslant a \leqslant 10^{18}$，$1 \leqslant p \leqslant 10^5，\text{p 是质数}$，对$p $ 取模
> 前置知识：

> [!TIP]
> 卢卡斯定理：$C_n^k \equiv C_{\lfloor n/p \rfloor}^{\lfloor k/p \rfloor} \cdot C_{n \bmod p}^{k \bmod p} \pmod{p}$
> 卢卡斯定理缩小了组合数计算的规模，仍然需要通过求阶乘和逆元来求组合数

```cpp
// Problem: 求组合数 III
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/889/
// Time: 2026-02-15 18:23:39
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int p;

ll qmi(ll a, ll k) // 根据费马小定理用快速幂求逆元
{
    ll res = 1;
    while (k)
    {
        if (k & 1)
            res = res * a % p;

        a = a * a % p;
        k >>= 1;
    }
    return res;
}

ll C(ll a, ll b) // 求解组合数C(a, b)
{
    ll res = 1;
    for (int i = 1, j = a; i <= b; i++, j--)
    {
        res = res * j % p;
        res = res * qmi(i, p - 2) % p;
    }
    return res;
}

ll lucas(ll a, ll b) // 缩小计算规模
{
    if (a < p && b < p)
        return C(a, b);

    return C(a % p, b % p) * lucas(a / p, b / p) % p;
}

int main()
{
    int n;
    cin >> n;

    while (n--)
    {
        ll a, b;
        cin >> a >> b >> p;
        cout << lucas(a, b) << endl;
    }
    return 0;
}
```

## 高精度

> 前置知识：

![](https://img.hailuo4ever.com/acwing_ba_ch4/17.png)

```cpp
// Problem: 求组合数 IV
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/890/
// Time: 2026-02-15 18:38:58
// Powered by CP Editor (https://cpeditor.org)
#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;
const int N = 5010;

int primes[N], cnt;
int sum[N];
bool st[N];

void get_primes(int n)
{
    for (int i = 2; i <= n; i++)
    {
        if (!st[i])
        {
            primes[cnt++] = i;

            for (int j = i + i; j <= n; j += i)
                st[j] = true;
        }
    }
    return;
}

int getcnt(int n, int p) // 求n中包含p的个数
{
    int res = 0;
    while (n)
    {
        res += n / p;
        n /= p;
    }
    return res;
}

vector<int> mul(vector<int> a, int b)
{
    vector<int> c;

    int t = 0;
    for (int i = 0; i < a.size(); i++)
    {
        t += a[i] * b;
        c.push_back(t % 10);
        t /= 10;
    }

    while (t)
    {
        c.push_back(t % 10);
        t /= 10;
    }

    return c;
}

int main()
{
    int a, b;
    cin >> a >> b;

    get_primes(a);

    for (int i = 0; i < cnt; i++)
    {
        int p = primes[i];
        sum[i] = getcnt(a, p) - getcnt(b, p) - getcnt(a - b, p);
    }

    vector<int> res;
    res.push_back(1);

    for (int i = 0; i < cnt; i++)
    {
        for (int j = 0; j < sum[i]; j++)
        {
            res = mul(res, primes[i]);
        }
    }

    for (int i = res.size() - 1; i >= 0; i--)
        cout << res[i];

    cout << endl;
    return 0;
}
```

# 卡特兰数

> 前置知识：
> 卡特兰数经常出现在各类计数问题中，有着天然的递归结构。
> 规模为$n$的计数问题$C_n$，可以通过枚举分界点，分拆成两个规模为$i$和$n-1-i$的子问题

卡特兰数满足如下递推关系：$C_n =
\begin{cases}
1, & n = 0, \\
\sum_{i=0}^{n-1} C_i C_{n-1-i}, & n > 0.
\end{cases}$

常见表达式如下：

$$
C_n = \frac{1}{n+1} \binom{2n}{n} = \frac{(2n)!}{n!(n+1)!}, \quad n \geq 0.
$$

$$
C_n = \binom{2n}{n} - \binom{2n}{n+1}, \quad n \geq 0.
$$

数列的前几项为：$1,1,2,5,14,42,132,429,1430,\cdots$

## 卡特兰数的应用

> 包括路径计数问题、圆内不相交弦计数问题、三角剖分计数问题、二叉树计数问题、括号序列计数问题、出栈序列计数问题、数列计数问题

### 路径计数问题

> 前置知识：

**结论**：有一个大小为$n*n$的方格图，左下角为$(0,0)$，右上角为$(n,n)$，从左下角开始，每次都只能向右或者向上走一个单位，不走到对角线$y=x$上方（但可以触碰）的情况下，到达右上角的路径数为$C_n$

![](https://img.hailuo4ever.com/acwing_ba_ch4/18.png)

```cpp
// Problem: 满足条件的01序列
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/891/
// Time: 2026-02-21 17:15:35
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;
const int N = 200010, mod = 1e9 + 7;

int n;
int fact[N], infact[N];

int qmi(int a, int k)
{
    int res = 1;
    while (k)
    {
        if (k & 1)
            res = (LL) res * a % mod;
        a = (LL) a * a % mod;
        k >>= 1;
    }
    return res;
}

void init()
{
    fact[0] = infact[0] = 1;

    for (int i = 1; i < N; i++)
    {
        fact[i] = (LL) fact[i - 1] * i % mod;
        infact[i] = (LL) infact[i - 1] * qmi(i, mod - 2) % mod;
    }
}

int main()
{
    init();
    cin >> n;
    int res = (LL) fact[2 * n] * infact[n] % mod * infact[n] % mod * qmi(n + 1, mod - 2) % mod;
    cout << res << endl;
    return 0;
}
```

# 容斥原理

> 容斥原理的定义如下：
> 设集合$U$中有$n$种不同的属性，第$i$种属性称为$P_i$，拥有属性$P_i$的元素构成集合$S_i$
>
> $$
> \left| \bigcup_{i=1}^n S_i \right| = \sum_{m=1}^n (-1)^{m-1} \sum_{a_k < a_{k+1}} \left| \bigcap_{i=1}^m S_{a_i} \right|
> $$

## 容斥原理的证明（组合恒等式）

![](https://img.hailuo4ever.com/acwing_ba_ch4/19.png)

## 例题-能被整除的数

> 暴力做法的时间复杂度是$O(nm)$，会超时。只能使用容斥原理，时间复杂度$O(m*2^m)$

### 思路

![](https://img.hailuo4ever.com/acwing_ba_ch4/20.png)

### 代码

```cpp
// Problem: 能被整除的数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/description/892/
// Time: 2026-02-21 22:22:39
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 20;

int n, m;
int p[N];

int main()
{
    cin >> n >> m;

    for (int i = 0; i < m; i++)
        cin >> p[i];

    int res = 0;

    // 枚举从1到 1111...(m个1)的每一个集合状态(至少选中一个集合)
    for (int i = 1; i < 1 << m; i++)
    {
        int t = 1; // 选中的集合对应质数的乘积
        int cnt = 0; // 选中的集合数量

        // 枚举当前状态的每一位
        for (int j = 0; j < m; j++)
        {
            if (i >> j & 1)
            {
                if ((ll) t * p[j] > n) // 乘积大于n, 则n/t = 0, 跳出这轮循环
                {
                    t = -1;
                    break;
                }
                cnt++; // 有一个1，集合数量+1
                t *= p[j];
            }
        }

        if (t != -1)
        {
            if (cnt % 2) // 选中奇数个集合, n/t为当前这种状态的集合数量
                res += n / t; // 根据容斥原理，应该相加
            else
                res -= n / t; // 根据容斥原理，应该相减
        }
    }

    cout << res << endl;
    return 0;
}
```

# Nim 游戏

>

## 博弈论相关概念

### 公平组合游戏

若一个游戏满足：

1. 由两名玩家交替行动
2. 在游戏进行的任意时刻，可以执行的合法行动与轮到哪位玩家无关
3. 不能行动的玩家判负

则称该游戏为一个**公平组合游戏**。

**Nim 游戏属于公平组合游戏**，但常见的棋类游戏，比如围棋就不是公平组合游戏，因为围棋交战双方分别只能落黑子和白子，胜负判定也比较复杂，不满足条件 2 和 3。

### 有向图游戏

给定一个有向无环图，图中有一个唯一的起点，在起点上放有一枚棋子。两名玩家交替地把这枚棋子沿有向边进行移动，每次可以移动一步，无法移动者判负。该游戏是有向图游戏。

任何一个公平组合游戏都可以转化为有向图游戏。具体方法是，把每个局面看成图中的一个节点，并且从每个局面向沿着合法行动能够到达的下一个局面连有向边。

### 有向图游戏的和

设 G1, G2, ..., Gm 是 m 个有向图游戏。定义有向图游戏 G，它的行动规则是任选某个有向图游戏 Gi，并在 Gi 上行动一步。G 被称为有向图游戏 G1, G2, ..., Gm 的和。

有向图游戏的和的 SG 函数值等于它包含的各个子游戏 SG 函数值的异或和，即：

```
            SG(G) = SG(G1) ^ SG(G2) ^ ... ^ SG(Gm)
```

### 必胜状态与必败状态

必胜状态，先手进行某一个操作，留给后手是一个必败状态时，对于先手来说是一个必胜状态。即**先手可以走到（后手的）某一个必败状态**。

必败状态，先手无论如何操作，留给后手都是一个必胜状态时，对于先手来说是一个必败状态。即**先手走不到（后手的）任何一个必败状态**。

### Nim 和（异或）

根据经典 Nim 游戏，可以发现：Nim 游戏的状态是否先手必胜，只与当前局面的石子数目的 Nim 和有关。

自然数$a_1,a_2,\cdots,a_n$的 Nim 和定义为$a_1 \oplus a_2 \oplus \ldots \oplus a_n$

### Mex 运算

设 S 表示一个非负整数集合。定义 mex(S)为求出不属于集合 S 的最小非负整数的运算，即：

```
            mex(S) = min{x}, x属于自然数，且x不属于S
```

## Sprague-Grundy 理论

> Sprague–Grundy 理论指出，所有公平组合游戏都等价于单堆 Nim 游戏．这一结论主要应用的场景，就是游戏由多个相互独立的子游戏组成的情形．
> 此时，**游戏的状态判定可以通过计算子游戏的 SG 函数值的 Nim 和来完成。**

### 游戏的记法

所有公平组合游戏都可以通过绘制博弈图来描述，

由于博弈图中，每个状态的性质只由它的后继状态决定，所以，可以将博弈图中的一个状态 𝑆 用它的后继状态的集合来表示．

一个游戏可以用它的初始状态表示.

### 游戏的和

游戏的和，可以理解为由两个同时进行且互不干扰的子游戏组成的游戏，玩家在每一步能且只能选择其中一个子游戏移动一步，且游戏在两个子游戏都无法移动时结束．

游戏的和的概念，可以推广到任意多个游戏的情形，且满足结合律和交换律——也就是说，多个游戏组合的结果，和组合进行的次序以及游戏的顺序都无关．Nim 游戏就是多个单堆 Nim 游戏的和．

一个观察是，尽管单堆 Nim 游戏中，除了没有石子的情形，都是先手必胜状态，但是这些不同的单堆 Nim 游戏在和其他的单堆 Nim 游戏组合起来时，得到的游戏并不相同．

### Sprague-Grundy 函数

对 Nim 游戏的分析说明，不同的单堆 Nim 游戏互不等价．但是，所有的公平游戏都等价于某个单堆 Nim 游戏．由此，可以给每个公平游戏都分配一个数字，这就是 Sprague–Grundy 函数。

SG 函数的定义如下：$\mathrm{SG}(G) = \mathrm{mex} \{ \mathrm{SG}(G_1), \mathrm{SG}(G_2), \dots, \mathrm{SG}(G_k) \}$

**整张图的 SG 值被定义为起点的 SG 值**

![](https://img.hailuo4ever.com/acwing_ba_ch4/21.png)

### 定理与性质

SG 函数具有以下性质：

1. SG(i)=k，那么 i 一定能走到 0~k-1 的所有状态，且 i 走不到 k 这个状态
2. 非 0 可以走向 0
3. 0 只能走向非 0

根据 SG 函数可得如下定理（类似于经典 Nim 游戏）：

1. 对于一个图 G，如果 SG(G)!=0，则先手必胜，反之必败
2. 对于 n 个图，如果 SG(G1)^ SG(G2)^ … SG(Gn)!=0，则先手必胜，反之必败

## 经典 Nim 游戏

> 给定 n 堆石子，两位玩家轮流操作，每次操作可以从任意一堆石子中拿走任意数量的石子（可以拿完，但不能不拿），最后无法进行操作的人视为失败。
> 问如果两人都采用最优策略，先手是否必胜。
> 例如，有两堆石子，第一堆两个，第二堆三个。
> 先手只需要从第二堆拿走一个，此时两堆的数目相同，不管后手怎么拿，先手都镜像即可，此时先手必胜。

结论：给定$n$堆石子，石子数目为$a_1,a_2,\cdots,a_n$，如果$a_1 \oplus a_2 \oplus \ldots \oplus a_n \neq 0$，先手必胜，否则先手必败

### 证明

![](https://img.hailuo4ever.com/acwing_ba_ch4/22.png)

基于以上证明：

1. 如果先手面对的局面是$a_1 \oplus a_2 \oplus \ldots \oplus a_n \neq 0$，那么先手总可以通过拿走某一堆若干个石子，将局面变为$a_1 \oplus a_2 \oplus \ldots \oplus a_n = 0$。如此重复，最后一定是后手面临没有石子可拿的状态。因此这种情况下先手必胜。
2. 如果先手面对的局面是$a_1 \oplus a_2 \oplus \ldots \oplus a_n = 0$，那么先手无论怎么拿，都会把局面变成$a_1 \oplus a_2 \oplus \ldots \oplus a_n \neq 0$。如此重复，最后一定是先手面临没有石子可拿的状态。因此这种情况下后手必胜。

### 代码

```cpp
// Problem: Nim游戏
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/893/
// Time: 2026-02-23 21:36:17
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    int res = 0;

    cin >> n;

    while (n--)
    {
        int x;
        cin >> x;
        res ^= x;
    }

    if (res)
        puts("Yes");
    else
        puts("No");
    return 0;
}
```

## 台阶 Nim 游戏

> 现在，有一个 n 级台阶的楼梯，每级台阶上都有若干个石子，其中第 i 级台阶上有 ai 个石子(i≥1)。
> 两位玩家轮流操作，每次操作可以从任意一级台阶上拿若干个石子放到下一级台阶中（不能不拿）。
> 已经拿到地面上的石子不能再拿，最后无法进行操作的人视为失败。
> 问如果两人都采用最优策略，先手是否必胜。

结论：台阶上的石子数目为$a_1,a_2,\cdots,a_n$，如果$a_1 \oplus a_3 \oplus \ldots \oplus a_n \neq 0 $（n 为奇数），先手必胜

### 证明

![](https://img.hailuo4ever.com/acwing_ba_ch4/23.png)

### 代码

```cpp
// Problem: 台阶-Nim游戏
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/894/
// Time: 2026-02-24 21:06:19
// 考察所有奇数台阶上石子异或的结果
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    int res = 0;

    cin >> n;

    for (int i = 1; i <= n; i++)
    {
        int x;
        cin >> x;

        if (i % 2 == 1)
            res ^= x;
    }

    if (res)
        puts("Yes");
    else
        puts("No");
    return 0;
}
```

## 集合 Nim 游戏

> 前置知识：SG 函数
> 给定 n 堆石子以及一个由 k 个不同正整数构成的数字集合 S。
> 现在有两位玩家轮流操作，每次操作可以从任意一堆石子中拿取石子，每次拿取的石子数量必须包含于集合 S，最后无法进行操作的人视为失败。
> 问如果两人都采用最优策略，先手是否必胜。

注意：本题的 0 这个值可以被映射多次，这意味着有很多可能的值$x_i$作为叶子节点，满足$f[x_i] = 0$，而如果将 S 开成全局，则其中只能有一个值映射到 0，其它的值都将映射到大于 0 的值，**所以 S 要开成局部变量**

![](https://img.hailuo4ever.com/acwing_ba_ch4/24.png)

```cpp
// Problem: 集合-Nim游戏
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/description/895/
// Time: 2026-02-24 20:01:29
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 110, M = 10010;

int n, m;
int s[N], f[M]; // f数组用于记忆化地存储所有计算好的SG值

int sg(int x)
{
    if (f[x] != -1)
        return f[x]; // 记忆化搜索，如果f[x]已经被计算过，则直接返回

    // 用一个无序集合来存储每一个局面可能到达的情况，便于求mex()
    // 由于较大堆的拆分情况独立于较小堆，所以S必须开成局部变量
    unordered_set<int> S;

    for (int i = 0; i < m; i++)
    {
        if (x >= s[i])
            S.insert(sg(x - s[i]));
    }

    for (int i = 0;; i++) // 求mex()
        if (!S.count(i))
            return f[x] = i;
}
int main()
{
    cin >> m;
    for (int i = 0; i < m; i++)
        cin >> s[i];

    cin >> n;

    memset(f, -1, sizeof f);

    int res = 0;
    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;
        res ^= sg(x);
    }

    if (res)
        puts("Yes");
    else
        puts("No");

    return 0;
}
```

## 拆分 Nim 游戏

> 给定 n 堆石子，两位玩家轮流操作，每次操作可以取走其中的一堆石子，然后放入两堆**规模更小**的石子（新堆规模可以为 0，且两个新堆的石子总数可以大于取走的那堆石子数，也就是石子可以越来越多），最后无法进行操作的人视为失败。
> 问如果两人都采用最优策略，先手是否必胜。

拆分 Nim 游戏一定可以结束，因为石子总数的最大值在不断减小

抽象的说，`a[i]` 可以拆成 `(b[i], b[j])`

**根据 SG 理论，多个独立局面的 SG 函数值等于这些局面 SG 值的 Nim 和**

因此需要存储的状态就是 `SG(b[i] ^ SG(b[j])`

另外，该题中 0 这个值只能由 0 映射得到，并且除了叶子结点以外的其他节点的映射都满足一一映射的条件，所以将 S 作为全局变量是可行的

```cpp
// Problem: 拆分-Nim游戏
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/896/
// Time: 2026-02-24 21:10:18
// Powered by CP Editor (https://cpeditor.org)
#include <bits/stdc++.h>
using namespace std;
const int N = 110;

int f[N];

int sg(int x)
{
    if (f[x] != -1)
        return f[x];

    unordered_set<int> S;

    for (int i = 0; i < x; i++)
        for (int j = 0; j <= i; j++) // 规定j不大于i，第二堆避免重复
            S.insert(sg(i) ^ sg(j)); // 把一个局面拆分成了两个局面

    for (int i = 0;; i++)
        if (!S.count(i))
            return f[x] = i;
}

int main()
{
    int n;
    cin >> n;

    memset(f, -1, sizeof f);

    int res = 0;
    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;

        res ^= sg(x);
    }

    if (res)
        puts("Yes");
    else
        puts("No");

    return 0;
}
```
