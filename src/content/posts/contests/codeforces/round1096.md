---
title: cf 2227 (Div.3)
published: 2026-05-03
description: "Codeforces Round 1096 (Div.3)"
image: "https://img.hailuo4ever.com/cover/codeforces.png"
tags: [算法题解, Codeforces]
category: "Algorithm"
draft: false
lang: ""
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
> 思考过程：选择一个子串删除，然后将里面的字符任意插入到剩余的部分中。 这个操作的本质，其实是将选中的子串里的字符“解锁”，让它们获得了“自由移动”的权利；而那些没有被选中的字符，则被“锁定”了，它们的相对顺序是不能改变的。
>
> 自然可以发现，选择整个串作为子串，带来的自由度是最高的。**大子串能生成的最终字符串集合，必然包含小子串能生成的最终字符串集合**。

因此我们检查整个字符串中是否可以括号匹配即可，我们希望每一个`(`都能与`)`匹配，且不留下未配对的括号，等价于检查字符串中`(`和`)`的出现次数是否相同。

## Code（赛时做法）

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

一个子数组的乘积能被6整除，充要条件是：**这个子数组内至少包含一个因子2，且至少包含一个因子3** _（或者直接包含一个6）_。

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

# E - It All Went Sideways

> 关键词：思维

## 思路

### Step1 - 推导公式

如果考虑“哪些方块会动”，需要考虑右边哪里有坑，较为繁琐。我们先考虑“哪些方块不会动”：

假设我们在第 $i$ 列，高度为 $h$ 的位置有一个方块，当重力向右改变后，只有当它的右侧（包含它自己）在高度 $h$ 这一层已经被方块填满了，它才可以静止在原地。

形式化地，有 $h \le \min(a_i, a_{i+1}, \dots, a_n)$ ，我们需要找到每个位置**包含自身的后缀最小值**。

定义数组 $s_i = \min(a_i, a_{i+1}, \dots, a_n)$ ，代表在第 $i$ 列，高度从 1 到 $S_i$ 的这 $S_i$ 个方块是不会动的。

**在初始状态下，全部会动的方块总数就是 $\sum_{i=1}^{n} a_i - \sum_{i=1}^{n} s_i$**  

我们考察 $S$ 数组的性质，容易发现，$S$ 数组一定是单调不降的。

> 模拟一组数据：设 $a = [3, 4, 2, 3]$：
>
> - $s_4 = \min(a_4) = 3$
> - $s_3 = \min(a_3, s_4) = \min(2, 3) = 2$
> - $s_2 = \min(a_2, s_3) = \min(4, 2) = 2$
> - $s_1 = \min(a_1, s_2) = \min(3, 2) = 2$
>
> 所以 $s = [2, 2, 2, 3]$。因为 $s$ 数组只能越来越大，所以相等的值一定会连成一片，形成一个个连续的区块。

### Step2 - 进行操作

我们有一次操作机会，将某个 $a_k$ 值减去 1，我们想让 $\sum_{i=1}^{n} a_i - \sum_{i=1}^{n} s_i$ 尽可能大，也就是进行操作后，使 $\sum_{i=1}^{n} s_i$ 尽可能小。

如果操作的 $a_k > s_k$（例子里的 $a_2=4, s_2=2$），把 4 变成 3，不会影响最小值 2，只有操作每个“区块”最右侧的那个瓶颈元素时（此时 $a_k = s_k$）才会造成影响。

>  如果我们把例子中的 $a_3$ 减去 1，那么新的 $s_3, s_2, s_1$ 全部都会因为这个瓶颈的下降而跟着变成 1。

因此，最佳策略是选取后缀最小值数组中相等值的最长块。移动方块数量的最终最大值公式为：

$$\sum a_i - \sum s_i + (\text{最大区块长度}) - 1$$

> [!NOTE]
>
> 总结：现在思考问题的思路过于复杂。其实无非就是正难则反，然后考虑转化题意，用数学公式来表达这些操作和状态。
>
> 现在的问题在于不能用数学公式表示，进而无法推理出正确解法，还要多练思维。

## Code

```c++
// Problem: CF 2227 E
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/E
// Time: 2026-05-01 16:38:49
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

    ll sum_a = 0, sum_mn = 0;

    vector<ll> a(n);
    for (int i = 0; i < n; i++)
    {
        cin >> a[i];
        sum_a += a[i];
    }

    vector<ll> mn(n); // 后缀最小值
    mn[n - 1] = a[n - 1];

    for (int i = n - 2; i >= 0; i--)
        mn[i] = min(a[i], mn[i + 1]);

    for (int i = 0; i < n; i++)
        sum_mn += mn[i];

    ll mx = -1, cnt = 1;
    for (int idx = 1; idx < n; idx++)
    {
        if (mn[idx] == mn[idx - 1])
            cnt++;
        else
        {
            mx = max(mx, cnt);
            cnt = 1;
        }
    }
    mx = max(mx, cnt);

    cout << sum_a - sum_mn + mx - 1 << endl;
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

# F - It Just Keeps Going Sideways

> 关键词：思维

## 思路

> [!NOTE]
>
> [Gemini的模拟程序](https://gemini.google.com/share/1a76efa80288)

**同一个高度的方块只会在这个高度上滑动，并不影响其它层方块的情况**，我们从这个性质下手。

假设我们只关注高度为 $h$ 的这一层，假设这一层有 $cnt[h]$ 个方块，$cnt[h]$ 就是满足 $a_i \ge h$ 的列数。

题目要求计算“所有方块移动的总距离”，对于任意一个方块，它的移动距离为**最终所在的列号 - 初始所在的列号**，我们需要计算所有方块的总和。

首先考虑不进行操作的初始和最终情况：

1. 初始列号的总和**（按列考虑）**：第 $i$ 列做出的贡献为 $i*a_i$，把所有列加起来即可得到初始总和。

2. 最终列号的总和**（按层考虑）**：当重力向右后，所有方块会没有阻挡地被挤到右边去，一共有 $n$ 列，所以它们会紧密堆积在第 $n$ 列，第 $n-1$ 列，$\cdots$。

   他们占据的最左边的位置是 $n-cnt[h]+1$，这是一个等差数列，这一层最终列号的和即为 $\frac{\texttt{cnt}[h](2n - \texttt{cnt}[h] + 1)}{2}$，把所有层加起来即可得到最终总和。

现在我们有一次操作的机会，可以拿掉某列最顶上的一个方块，我们计算它会对原来的结果造成什么影响：

假设我们选了第 $i$ 列，拿掉了高度为 $a_i$ 的那个方块。显然**它会使初始列号总和减少 $i$**，并且高度为 $a_i$ 的这一层，方块数 $cnt[a_i]$ 变成了 $cnt[a_i]-1$，这意味着这一层往右边挤的时候占据的方块少了一个，显然会是之前最靠左（最矮）的那个位置没了，也就是让**最终列号总和减少了 $n-cnt[a_i]+1$**。 

形式化的，减少 $a_i$ 带来的总收益为 $i - (n - \texttt{cnt}[a_i] + 1) = i - n + \texttt{cnt}[a_i] - 1$，对每个索引计算并取最大值，再加到前面的结果上即可。

> [!NOTE]
>
> 这道题感觉其实不是很难，是可以够到的。按层考虑和按列考虑的思想非常好，改天一定要再写一遍。
>
> 代码实现方面，相比于嵌套一个循环不断自增，一定要选择后缀和这种复杂度较低的求法来求 `cnt[i]`。

## Code

```c++
// Problem: CF 2227 F
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/F
// Time: 2026-05-02 20:56:16
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
    ll n;
    cin >> n;

    vector<ll> a(n + 1), h(n + 1);
    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        h[a[i]]++; // 初始高度恰好等于a[i]的列数
    }

    vector<ll> cnt(n + 1);
    cnt[n] = h[n];

    for (int i = n - 1; i >= 1; i--) // 后缀和计算每一层有多少个方块
        cnt[i] = cnt[i + 1] + h[i];

    ll st = 0, ed = 0, res = 0;
    for (int i = 1; i <= n; i++)
    {
        st += i * a[i];
        ed += cnt[i] * (2 * n - cnt[i] + 1) / 2;
    }

    res = ed - st;

    ll mx = 0;
    for (int i = 1; i <= n; i++)
        mx = max(mx, i - n + cnt[a[i]] - 1);

    res += mx;

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

# G - Drowning

> 关键词：思维，树状数组

## 思路

### Step1 - 寻找不变量

每次操作后数组长度减少 2，因此只有奇数长度的数组可能是好的。

我们需要寻找消除操作中的不变量，实际上是**数组的交替和**。

定义 $S(c) = c_1 - c_2 + c_3 - c_4 + \dots + (-1)^{|c|-1}c_{|c|}$ 为数组 $c$ 的交替和，奇数位置的数的符号为正，偶数位置的符号为负。在合并操作后，容易证明被合并的部分贡献不变，后面的部分符号也不变，所以**整个数组的交替和始终不变**。

证明过程如下：

![](https://img.hailuo4ever.com/codeforces/round_1096_img1.png)

对于每个数的位置，一个数的位置减去 2，它的奇偶性显然不会改变，那么在交替和里的正负号情况也不会改变。

> [!NOTE]
>
> 这个思路是如何想到的呢？题目要求把 $A,B,C$ 变成 $A-B+C$，这种要求带有明确的指向性，所以要往这个式子上思考。
>
> 此外，每次操作数组长度从 $L$ 变成 $L - 2$。它意味着元素的移动是“跳跃式”的，不会改变元素的下标奇偶性。这里就要考虑对奇偶分类讨论，构造一个区分奇偶的特征值，也就是本题中的交替和。

### Step2 - 证明正确性

根据第一步的推理，我们猜想**好数组必须长度为奇数且交错和为正**。我们尝试证明这个结论。

1. 必要性
   - 奇数长度：每次操作删掉两个元素，如果最后要变成长度为 1 的数组，一开始的长度一定是奇数。
   - 交替和不变且为正：因为最后只剩下一个元素，而题目保证在操作过程前后，所有的数都是正整数，因此最后一个数一定是正数，初始数组的交替和也一定是正数。

2. 充分性（反证法）

   假设一个奇数长度的数组，交替和为正，但找不到任何满足 $c_{i-1} + c_{i+1} > c_i$ 的位置。 那么对于所有偶数位置，必定都有 $-(c_{i-1} + c_{i+1}) \ge -c_i$。 我们把交替和里的所有 $-c_i$（偶数项）全部用 $-(c_{i-1} + c_{i+1})$ 替换（放缩），会发现所有正数项全被抵消了，最后算出来的交替和 $\le 0$。 这与“交替和为正”相矛盾。所以，只要交替和为正，就必定存在合法的消除步骤，直到长度变为 1。

## Code

> [!NOTE]
>
> 由于数据范围给到了 `2e5`，我们需要在 $O(n\log n)$ 的复杂度下解决这个问题，我们需要分两种情况（奇数和偶数）进行处理，并使用树状数组（Fenwick Tree）高效地处理这个二维偏序（动态逆序对）问题。
>
> 并且由于前缀和的值可能很大甚至是负数，所以我们需要进行离散化。
>
> 详见[Gemini对话记录](https://gemini.google.com/share/f09f5ae24d02)

```c++
// Problem: CF 2227 G
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/G
// Time: 2026-05-03 09:53:14
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

struct FenwickTree
{
    ll n;
    vector<ll> tr;

    void init(ll m)
    {
        n = m;
        tr.assign(n + 1, 0);
    }

    void add(ll x, ll v)
    {
        while (x <= n)
        {
            tr[x] += v;
            x += x & -x;
        }
    }

    ll qry(ll x)
    {
        ll res = 0;
        while (x)
        {
            res += tr[x];
            x -= x & -x;
        }
        return res;
    }
};

void solve()
{
    int n;
    cin >> n;

    vector<ll> a(n + 1), pre(n + 1, 0);
    vector<ll> vals; // 离散化

    vals.push_back(0);

    for (int i = 1; i <= n; i++)
    {
        cin >> a[i];
        if (i & 1)
            pre[i] = pre[i - 1] + a[i];
        else
            pre[i] = pre[i - 1] - a[i];
        vals.push_back(pre[i]);
    }

    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());

    auto get_id = [&](ll x) { return lower_bound(vals.begin(), vals.end(), x) - vals.begin() + 1; };

    ll m = vals.size(); // 离散化后的值域上限

    FenwickTree bit_odd, bit_even;

    bit_odd.init(m), bit_even.init(m);

    ll res = 0;

    // 初始状态：位置 0 是偶数位置，前缀和为 0
    bit_even.add(get_id(0), 1);

    for (int i = 1; i <= n; i++)
    {
        ll id = get_id(pre[i]);

        if (i & 1)
        {
            // i 为奇数：找前面的偶数位置中，满足 pre[j] < pre[i] 的个数
            // 也就是在 bit_even 中查询区间 [1, id - 1] 的和
            res += bit_even.qry(id - 1);

            // 将自己加入到奇数树状数组中，供后面的偶数位置查询
            bit_odd.add(id, 1);
        }
        else
        {
            // i 为偶数：找前面的奇数位置中，满足 pre[j] > pre[i] 的个数
            // 也就是在 bit_odd 中查询区间 [id + 1, m] 的和
            // 转换为：总数 - 小于等于 pre[i] 的数量
            res += bit_odd.qry(m) - bit_odd.qry(id);

            // 将自己加入到偶数树状数组中，供后面的奇数位置查询
            bit_even.add(id, 1);
        }
    }

    cout << res << endl;
}

int main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(0);

    int T;
    cin >> T;

    while (T--)
        solve();

    return 0;
}

```

# H - Fallen Leaves

> 关键词：树上DP，DFS

## 思路

题目要求选两个叶子节点配对，并加上它们之间的距离（边数）。我们要让总距离**最小**。

想象如果不要求最小，有些边可能会被穿过 2 次，3 次甚至更多次，但是在最优的配对方案里，树上的任何一条边最多只会被穿过 1 次。

> 解释：我们把一条边想象成一座桥，如果一条边被穿过了 2 次，意味着左边有两人去了右边，右边有两人去了左边。我们完全可以让他们在各自的一侧内部配对，这样可以直接省掉穿过这条边的代价，总距离会变得更小。
>
> ![](https://img.hailuo4ever.com/codeforces/round_1096_img2.png)
>
> ![](https://img.hailuo4ever.com/codeforces/round_1096_img3.png)

既然每条边最多只提供 1 的代价，问题就变成了：**哪些边会被穿过？**

假设我们将节点 1 视作整棵树的根（Root）。

考虑任意一个节点 $u$ 连向它父亲的那条边。这条边到底会不会被穿过，取决于 **节点 $u$ 的子树里有多少个叶子节点**（即代码中的 `cnt[u]`）：

1. 如果 `cnt[u]` 是偶数：这说明 $u$ 的子树里的叶子节点可以在内部“完美配对”，谁也不需要出圈。所以，这条边不需要被穿过，代价贡献为 0。

**结论：如果总叶子数是偶数，所有叶子都能配对**。总代价就等于子树的叶子数为奇数的节点个数（不包含根节点）。

2. 如果 `cnt[u]` 是奇数：这说明 $u$ 的子树在内部配对后，必然会多出一个落单的叶子。这个叶子要想脱单，必须穿过这条边去上面找别人配对。所以，这条边必须被穿过，代价贡献为 1。

现在我们考虑，当 `cnt[u]` 为奇数时，该抛弃哪个叶子 $x$，才能让总代价降得最多？

当我们决定抛弃叶子 $x$ 时，会导致从根节点 1 到 $x$ 的路径上，所有经过的子树的 `cnt` 都会减 1，这意味着奇偶性会发生反转：如果一条边原来的子树是奇数，现在变成了偶数，这条边就不需要经过了，总代价减少 1，反之总代价增加 1。

因此我们要找一个叶子 $x$，使得从 $u$ 到 $x$ 的路径上，**（奇数边数量 - 偶数边数量）的值最大**。这需要用一次 `DFS` 和树上 `DP` 来实现。

## Code

```C++
// Problem: CF 2227 H
// Contest: Codeforces - Codeforces Round 1096 (Div. 3)
// URL: https://codeforces.com/contest/2227/problem/H
// Time: 2026-05-03 11:01:15
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

ll n;
vector<ll> adj[N];
ll mx[N], cnt[N];

void dfs(int u, int p) // 表示当前节点和它的父亲
{
    // 初始化叶子数量：如果度数为1，它本身就是个叶子，cnt = 1
    cnt[u] = (adj[u].size() == 1);

    // 统计子树总叶子数
    for (int v: adj[u])
    {
        if (v == p)
            continue;
        dfs(v, u);
        cnt[u] += cnt[v];
    }

    // 树形 DP，计算最大收益 mx[u]
    ll cur = 0; // 记录抛弃当前子树内某个叶子，能获得的最大收益
    for (int v: adj[u])
    {
        if (v == p)
            continue;

        // 反转奇偶
        ll w = (cnt[v] & 1) ? 1 : -1;

        cur = max(cur, mx[v] + w);
    }

    mx[u] = cur; // 记录答案
}

void solve()
{
    cin >> n;
    for (int i = 1; i <= n; i++)
        adj[i].clear();

    for (int i = 0; i < n - 1; i++)
    {
        int u, v;
        cin >> u >> v;
        adj[u].push_back(v), adj[v].push_back(u);
    }

    dfs(1, 0);

    ll res = 0;

    for (int u = 2; u <= n; u++)
        if (cnt[u] & 1)
            res++;

    if (cnt[1] % 2 == 0)
        cout << res << endl;
    else
        cout << res - mx[1] << endl;
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

