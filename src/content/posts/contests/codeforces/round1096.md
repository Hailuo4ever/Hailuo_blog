---
title: cf 2227 (Div.3)
published: 2026-05-01
description: 'Codeforces Round 1096 (Div.3) 补题（待更新）'
image: 'https://img.hailuo4ever.com/cover/codeforces.png'
tags: [算法题解, Codeforces]
category: 'Algorithm'
draft: false 
lang: ''
---

> [!NOTE]
> 比赛链接：[Codeforces Round 1096 (Div. 3)](https://codeforces.com/contest/2227)

# A - Koshary

> 关键词：签到

## 思路

只能走一步“短步”，意味着目标坐标的 $x,y$ 值不能都是奇数，因为这样需要走两次“短步”。

所以对于横纵坐标都是奇数的值输出`NO`，否则输出`YES`

## Code

```cpp
// Problem: CF 2227 A
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/A
// Time: 2026-04-30 22:35:13
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
    int x, y;
    cin >> x >> y;

    if (x % 2 == 1 && y % 2 == 1)
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

# B - Party Monster

> 关键词：签到，STL，括号匹配

## 思路

选择整个字符串作为操作的子串是始终最优的，假设一个更小的子串能生成有效的括号序列，我们可以直接选择整个字符串，仅移动该较小子串中的字符，因此选择整个字符串始终是最优的。

> [!TIP]
>
> 思考过程：选择一个子串删除，然后将里面的字符任意插入到剩余的部分中。 这个操作的本质，其实是将选中的子串里的字符“解锁”，让它们获得了**“自由移动”**的权利；而那些没有被选中的字符，则被**“锁定”**了，它们的相对顺序是不能改变的。
>
> 自然可以发现，选择整个串作为子串，带来的自由度是最高的。**大子串能生成的最终字符串集合，必然包含小子串能生成的最终字符串集合**。

因此我们检查整个字符串中是否可以括号匹配即可，我们希望每一个`(`都能与`)`匹配，且不留下未配对的括号，等价于检查字符串中`(`和`)`的出现次数是否相同。

## Code

### 赛时做法

```c++
// Problem: CF 2227 B
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/B
// Time: 2026-04-30 22:37:51
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

    stack<char> stk;

    for (int i = 0; i < n; i++)
    {
        if (s[i] == '(')
        {
            if (stk.size() && stk.top() == ')')
                stk.pop();
            else
                stk.push(s[i]);
        }
        else
        {
            if (stk.size() && stk.top() == '(')
                stk.pop();
            else
                stk.push(s[i]);
        }
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

# C - Snowfall

> 关键词：构造，分类讨论

## 思路

一个子数组的乘积能被6整除，充要条件是：**这个子数组内至少包含一个因子2，且至少包含一个因子3** *（或者直接包含一个6）*。

我们的目标是**最小化**乘积被6整除的子数组数量。这等价于**最大化乘积不被6整除**的合法子数组数量。

我们考虑把所有的数归为四类：

1. $S_6$：能直接被$6$整除的元素
2. $S_2$：能被$2$整除但不能被$3$整除的元素
3. $S_3$：能被$3$整除但不能被$2$整除的元素
4. $S_1$：不能被$3$整除也不能被$2$整除的元素

任何包含$S_6$元素的子数组直接就会被6整除。为了把它的破坏力降到最低，我们必须把所有的$S_6$**全部堆积在数组的最边缘**。

如果一个子数组同时跨越了$S_2$和$S_3$，那么它就集齐了2和3，可以被6整除，所以$S_2$和$S_3$必须隔的尽可能远。

我们考虑把$S_1$放在$S_2$和$S_3$的中间，因为$S_1$是最“安全”的元素集合，无论如何它都不可以被6整除。将它们插入任何位置都不会减少能被6整除的子数组数量，但我们可以通过将它们放在$S_2$和$S_3$之间来避免增加数量。

因此一种最优的构造顺序是：$[S_6] + [S_2] + [S_1] + [S_3]$

> [!NOTE]
>
> 总结：考虑构造问题还是要向分类讨论的方向思考。对于本题，不能只考虑2和3作为质因子单独出现的情况，而是要重点考虑他们同时出现（也就是可以被6整除）的情况。本题的构造其实就是安置好不同种类的这些元素。

## Code

```c++
// Problem: CF 2227 C
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/C
// Time: 2026-04-30 22:43:59
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
    cin >> n;

    vector<int> a, b, c, d;
    for (int i = 0; i < n; i++)
    {
        int x;
        cin >> x;

        if (x % 6 == 0)
            a.push_back(x);
        else if (x % 2 == 0)
            b.push_back(x);
        else if (x % 3 == 0)
            c.push_back(x);
        else
            d.push_back(x);
    }

    for (auto i: a)
        cout << i << " ";
    for (auto i: c)
        cout << i << " ";
    for (auto i: d)
        cout << i << " ";
    for (auto i: b)
        cout << i << " ";

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

# D - Palindromex

> 关键词：思维，双指针，mex

## 思路

我们先单独考虑`mex`问题，**有一个重要结论：如果要让一个回文子数组的`mex`至少大于等于1，这个子数组里面必须包含数字 0**。

> [!NOTE]
>
> 为什么要先考虑0呢？因为在这道题里，所有的数字都恰好出现了2次。既然大家的出现次数都是2次，所以当然最小的0是具有决定性的。

考虑0在数组中出现的位置，我们设它们为$L,R$。如果数字0要出现在一个回文串中，只有以下三种情况：

1. $L$位于回文串的正中心
2. $R$位于回文串的正中心
3. $L,R$位于回文串的对称两侧（回文串的正中心在$L,R$的正中央）

我们尝试从这三个中心点向外扩展，找到能延伸到的最长的回文子数组，分别统计这三个最长回文子数组的`mex`，取`max`即可。

> [!TIP]
>
> - 为了同时处理奇数长度和偶数长度的回文串。我们需要向`extend`函数传入一个坐标和，才能求出两种情况下，正确的初始`mid`值。
>
> 初始左指针`l = center_sum / 2;`，右指针`r = (center_sum + 1) / 2;`
>
> - 在求`mex`时，对于一个长度为`len`的数组，`mex`的上界就是`len`。所以我们只需要开一个长度为`len + 1`的`bool`数组`vis`来记录出现情况即可。假如遇到了大于`len`的数字，它对`mex`值的提升并没有贡献，因此在记录的时候就要忽略它。（可以用抽屉原理思考）
>
>   同样在遍历查找最小的未出现的数字时也要遍历到`len`停止，防止`Runtime Error`。

## Code

```c++
// Problem: CF 2227 D
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/D
// Time: 2026-04-30 23:09:01
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
const int N = 2e5 + 10;

int a[N], res, n;

int mex(int l, int r)
{
    int len = r - l + 1;
    vector<bool> vis(len + 1, false);

    for (int i = l; i <= r; i++)
        if (a[i] <= len)
            vis[a[i]] = true;

    for (int i = 0; i <= len; i++)
    {
        if (!vis[i])
            return i;
    }
    return 0;
}

void extend(int x)
{
    int l = x / 2, r = (x + 1) / 2;
    while (l >= 0 && r < 2 * n && a[l] == a[r])
        l--, r++;

    res = max(res, mex(l + 1, r - 1));
}

void solve()
{
    cin >> n;

    // memset(a, 0, sizeof a); // 可以不用memset，因为后面的数据并不会被访问到
    res = 0;

    for (int i = 0; i < 2 * n; i++)
        cin >> a[i];

    int l = -1, r = -1;
    for (int i = 0; i < 2 * n; i++)
    {
        if (a[i] == 0)
        {
            if (l == -1)
                l = i;
            else
                r = i;
        }
    }

    extend(2 * l);
    extend(2 * r);
    extend(l + r);

    cout << res << endl;
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

