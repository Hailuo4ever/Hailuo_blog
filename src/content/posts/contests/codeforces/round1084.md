---
title: cf 2200 (Div.3)
published: 2026-04-29
description: 'Codeforces Round 1084 (Div.3) 补题A-E'
image: 'https://img.hailuo4ever.com/cover/codeforces.png'
tags: [算法题解, Codeforces]
category: 'Algorithm'
draft: false 
lang: ''
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1084 (Div. 3)](https://codeforces.com/contest/2200)

# A - Eating Game

> 关键词：签到，贪心

## 思路

可能成为获胜者的玩家数量，也就是初始时菜最多的玩家，在给定数组中找出所有值最大的元素，记录数量即为答案。

## Code

```cpp
// Problem: CF 2200 A
// Contest: Codeforces - Codeforces Round 1084 (Div. 3)
// URL: https://codeforces.com/contest/2200/problem/A
// Time: 2026-04-27 13:43:40
#include <bits/stdc++.h>
using namespace std;

const int inf = 0x3f3f3f3f;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n + 1);

    int mx = -1;
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        mx = max(mx, a[i]);
    }

    int res = 0;
    for (int i = 1; i <= n; i++)
    {
        if (a[i] == mx)
        {
            res++;
        }
    }

    cout << res << '\n';
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

# B - Deletion Sort

> 关键词：思维，贪心

## 思路

假如给定数组直接是单调不降的，那么游戏直接结束，输出`n`即可。

否则一定存在某个$i$，使得$a_i>a_{i+1}$，我们可以删除这两个数之外的所有元素，然后删除$a_i$，最后只会剩下一个元素，因此答案为`1`

## Code

```cpp
// Problem: CF 2200 B
// Contest: Codeforces - Codeforces Round 1084 (Div. 3)
// URL: https://codeforces.com/contest/2200/problem/B
// Time: 2026-04-27 13:43:41
#include <bits/stdc++.h>
using namespace std;

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n), b(n);
    for (int i = 0; i < n; i++)
        cin >> a[i];

    b = a;
    sort(b.begin(), b.end());

    if (b == a)
        cout << a.size() << endl;
    else
        cout << 1 << endl;
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



# C - Specialty String

> 关键词：思维

## 思路

题目要求将相同的字符替换为`*`，实际上就是删除这些字符，假如字符串变为空就可以获胜。由于删除一对字符不会干扰另一对字符，因此操作顺序无所谓。

遍历数组$\frac{n}{2}$次，每找到一对相等元素就删掉它，最后只需要输出字符串是否为空即可。

也可以用栈来模拟。

## Code

### stack

```c++
// Problem: CF 2200 C
// Contest: Codeforces - Codeforces Round 1084 (Div. 3)
// URL: https://codeforces.com/contest/2200/problem/C
// Time: 2026-04-27 13:43:42
#include <bits/stdc++.h>
using namespace std;

void solve()
{
    int n;
    string s;
    cin >> n >> s;

    stack<char> stk;

    for (int i = 0; i < n; i++)
    {
        if (stk.empty())
        {
            stk.push(s[i]);
            continue;
        }

        if (s[i] == stk.top())
        {
            stk.pop();
        }
        else
            stk.push(s[i]);
    }

    if (stk.empty())
        cout << "YES" << endl;
    else
        cout << "NO" << endl;
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

### normal

```c++
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

void solve()
{
    int n;
    string s;
    cin >> n >> s;

    for (int i = 0; i * 2 < n; i++)
        for (int j = 1; j < s.size(); j++)
            if (s[j] == s[j - 1])
                s.erase(j - 1, 2);

    cout << (s.empty() ? "YES" : "NO") << endl;
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

# D - Portal

> 关键词：思维、排序

## 思路

不要把整个数组看成一个数组，而是看成两个部分：在传送门里的和在传送门外的。

假设$A$表示两个传送门间的子数组，$B$表示剩余的元素，进行传送操作，实际上就是对传送门里面的数组$A$进行循环移位。

考虑经过传送操作后，整个数组的情况：实际上就是将$A$内部的元素不断循环移位，将$A$在整个数组中的位置不断改变，并且不改变$B$中元素及其顺序。换句话说，传送门之间的元素不能跑出去。

要得到字典序最小的排列，我们从两个方面考虑，$A$数组的内部情况和它在数组中的位置：

1. 内部：贪心地移动$A$数组，直到它最左端的元素最小

2. 外部：将内部排好序的$A$接在第一个大于$A$的最小值的元素左侧。假如不存在这样的元素，就插到$B$的后面

> [!NOTE]
>
> 注意循环移位操作的写法：
>
> `if (!b.empty())  rotate(b.begin(), min_element(b.begin(), b.end()), b.end());`
>
> `rotate()`函数有三个参数：`first`，`middle`，`last`，均为迭代器。它会交换范围 `[first, last)` 中的元素，使得 `[first, middle)` 中的元素被放置在 `[middle, last)` 中的元素之后，同时保持两个范围中元素的顺序。
>
> `min_element()`函数可以自定义比较规则，格式为`min_element(first, last, comp)`，传入两个迭代器。

## Code

```c++
// Problem: CF 2200 D
// Contest: Codeforces - Codeforces Round 1084 (Div. 3)
// URL: https://codeforces.com/contest/2200/problem/D
// Time: 2026-04-27 13:43:43
#include <bits/stdc++.h>
using namespace std;

void solve()
{
    int n, x, y;
    cin >> n >> x >> y;

    vector<int> a, b;
    for (int i = 1; i <= n; i++)
    {
        int t;
        cin >> t;

        if (i > x && i <= y)
            b.push_back(t);
        else
            a.push_back(t);
    }

    if (!b.empty()) // 循环移位
        rotate(b.begin(), min_element(b.begin(), b.end()), b.end());

    int idx = (int) a.size(); // 应该默认插在最后
    for (int i = 0; i < (int) a.size(); i++)
    {
        if (a[i] > b[0])
        {
            idx = i;
            break;
        }
    }

    for (int i = 0; i < idx; i++)
        cout << a[i] << " ";

    for (auto i: b)
        cout << i << " ";

    for (int i = idx; i < (int) a.size(); i++)
        cout << a[i] << " ";

    cout << endl;
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

# E - Divisise Battle

> 关键词：博弈论、数论

## 思路

首先考虑在什么情况下可以对某个数进行操作：**我们要把一个数拆成两个大于$1$并小于这个数的两个数，当且仅当这个数不是$1$和质数。**

然后考虑我们要怎么操作这个数：

我们首先假设$x$能被两个质数$p,q$整除，其中$p<q$，那么先手的那个人可以将$x$替换为$\frac{x}{p}$和$p$。由于$\frac{x}{p}$是$q$的倍数，总会在$p$之前出现一个大于$p$的$q$的倍数，因此该数组永远不会成为单调不降序列，所以**只要给定数组存在这样的一个数，先手采取这种拆分策略是必胜的**。

我们考虑，假如数组中不存在符合这样条件的$x$怎么办？那么数组中所有元素要么是$1$，要么都是某一个质数的幂，我们考虑找出这些数对应的那个唯一质因子并存储到另一个数组$b$里（对数字$1$特判）

> [!TIP]
>
> 这里转化的思路要多想一步，实际上假如这个数是质数的幂，这个数的唯一质因子在这道题目里就可以”代表“这个数，因为不管如何拆分，最后都只能拆成很多个质因子。

我们**考察$b$是否是单调不降的**。如果$b$已经是单调不降的，那么无论如何拆分，它仍然是升序的，所以此时后手必胜。

假如$b$存在逆序对（不是单调不降的），显然整个数组不可能变成单调不降的，此时先手必胜。

> [!NOTE]
>
> 总结：对于这种将数拆分成两个数的乘积的问题，要从**质数**上下手，因为质数是不可以被拆分的。
>
> 首先考虑什么样的数不可以被拆分，再考虑最优的拆分策略。这道题中需要确认所有数的质因子数量情况，基于这个结果进行分类讨论。

## Code

```c++
// Problem: CF 2200 E
// Contest: Codeforces - Codeforces Round 1084 (Div. 3)
// URL: https://codeforces.com/contest/2200/problem/E
// Time: 2026-04-27 13:43:44
#include <bits/stdc++.h>
using namespace std;

#define endl '\n'

typedef long long ll;
typedef unsigned long long ull;
typedef pair<int, int> pii;
typedef pair<double, double> pdd;
typedef pair<long long, long long> pll;

const int dx[] = {-1, 0, 1, 0, -1, 1, 1, -1};
const int dy[] = {0, 1, 0, -1, 1, 1, -1, -1};
const int inf = 0x3f3f3f3f;
const int N = 0;

int get_prime(int x)
{
    set<int> s;
    for (int i = 2; i * i <= x; i++)
    {
        while (x % i == 0)
        {
            s.insert(i);
            x /= i;
        }
    }

    if (x > 1)
        s.insert(x);

    if (s.size() > 1) // 含有不同的质因子
        return -1;

    if (s.size() == 0) // 传入的是1
        return 1;

    return *s.begin(); // 只有一种质因子
}

void solve()
{
    int n;
    cin >> n;

    vector<int> a(n), b(n);

    for (int i = 0; i < n; i++)
        cin >> a[i];

    for (int i = 0; i < n; i++)
        b[i] = get_prime(a[i]);

    // 开始前如果单调不降，后手必胜
    if (is_sorted(a.begin(), a.end()))
        cout << "Bob" << endl;

    // 只要原数组中有一个有不同质因子的数，先手必胜
    else if (*min_element(b.begin(), b.end()) == -1)
        cout << "Alice" << endl;

    // b如果是单调不降的，后手必胜
    else if (is_sorted(b.begin(), b.end()))
        cout << "Bob" << endl;

    // b如果不是单调不降的，先手必胜
    else
        cout << "Alice" << endl;
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



