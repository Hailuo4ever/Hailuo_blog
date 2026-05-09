---
title: Miscellaneous (Notebook)
published: 2025-11-09
description: "杂项整理"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 杂项整理

## 取整函数（cmath）

1. 向上取整：`ceil(x)`

​	注意：使用小数计算 `ceil` 可能会丢精度，最好使用整数。`ceil(a / b) == (a + b - 1) / b`

1. 向下取整：`floor(x)`
2. 四舍五入：`round(x)`
3. 向零取整：`trunk(x)`

## 字符串输入（读入整行，包括空格）

1. `getline(cin,s)` s 为 string 类
2. `fgets(s,100,stdin)` s 为字符型数组

## 大小写相关

1. 判断大小写：`isupper()`, `islower()`
2. 大小写转换：`tolower()`, `toupper()`

## 字符串与数字转换

### 字符串转数字

1. `atoi()`：[ASCII](https://c.biancheng.net/c/ascii/) to Integer，会忽略字符串开头的空白字符，然后尝试将后续字符解析为整数。如果遇到非数字字符，函数就会停止解析。
2. `atol()`：ASCII to Long，返回 long 类型的数

### 数字转字符串

1. `to_string()`：转成 string 类
2. `stringstream`：把 string 转成输入流，再按需读取

### isdigit()

`isdigit` 是 C 语言标准输入输出库（更准确地说，是字符处理库）中定义的一个函数，用于检查一个字符是否为十进制数字字符（'0' 到 '9'）。

满足条件返回非 0 值，否则返回 0

## 内存相关

1. `memset(arr, 0, sizeof(arr))` 将整个数组重置为 0

> 注：memset 是按字节来初始化的！

1. `new ``/ delete` 动态分配堆内存

## vector 去重

第一步：`sort(arr.begin(), arr.end());`

第二步：`arr.erase(unique(arr), alls.end());`

注：unique()的去重原理是找出有序数组里的重复数，并把他们放在数组的尾部，返回第一个重复数的地址

## 关同步流

```cpp
ios::sync_with_stdio(0);
cin.tie(0);
```

## 曼哈顿距离

> 在二维空间里，两个点的曼哈顿距离为他们的横坐标之差的绝对值与纵坐标之差的绝对值之和，即：$d(A, B) = |x_1 - x_2| + |y_1 - y_2|$

曼哈顿距离有以下数学性质：

![](https://img.hailuo4ever.com/miscellaneous/1.png)

## 计算以 2 为底的对数

`__lg()`：GCC 编译器可用，输出是整数，表示输入参数的二进制表示中最高位 1 的位置（最低位为 0）

`log2()`：C++11 标准库的函数，输出是浮点数

## 日期问题模板

```cpp
int is_leap(int year)
{
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
        return 1;

    return 0;
}

int get_days(int y, int m)
{
    if (m == 2)
        return 28 + is_leap(y);

    return months[m];
}

void next_day(int &y, int &m, int &d)
{
    d++;

    if (d > get_days(y, m))
    {
        d = 1, m++;

        if (m > 12)
        {
            m = 1, y++;
        }
    }
}
```

## sprintf()

[https://cppreference.cn/w/cpp/io/c/fprintf](https://cppreference.cn/w/cpp/io/c/fprintf)

`int sprintf( char* buffer, const char* format, ... );`

用于将格式化后的数据写入字符串 `buffer`

![](https://img.hailuo4ever.com/miscellaneous/2.png)

## 给浮点数组初始化最大值

`double arr[]`

`memset(arr, 127, sizeof arr)`

## 摩尔投票算法

> 摩尔投票算法（Boyer-Moore Majority Vote Algorithm）用于在时间复杂度 $\mathcal{O}(N)$、空间复杂度 $\mathcal{O}(1)$ 的情况下，找出一个数组中出现次数超过一半（即绝对众数）的元素。

前提：保证数组中必定存在众数

基于抵消机制，每次从序列中选择两个不同的元素删除（抵消），最后剩下的元素即为可能的多数元素

因为“绝对众数”的兵力比其他所有阵营的总和还要多，所以即使全场被针对（最坏情况下的极限一换一），最后活下来的也**一定是**绝对众数阵营的人。

![](https://img.hailuo4ever.com/miscellaneous/3.png)

```cpp
int majorityElement(vector<int>& nums) {
    int candidate = 0;
    int count = 0;

    for (int num : nums) {
        if (count == 0) {
            candidate = num; // 擂台空了，换新阵营上去
            count = 1;
        } else if (num == candidate) {
            count++; // 自己人，增加兵力
        } else {
            count--; // 敌人，同归于尽
        }
    }

    return candidate; // 活到最后的阵营
}
```

## __int128

`__int128`（注意有两个下划线）是第三方编译器提供的128位整数类型，支持在 `GCC` 和 `Clang` 上使用。

常用于大数乘法取模，作为中间变量使用，防止溢出。

```c++
ll mul(ll a, ll b, ll p) {
    return (ll)((__int128)a * b % p);
}
```

但它无法直接输入输出，必须手写快读和快写模板，按照字符处理。

```c++
inline int128 read() {
    int128 x = 0, f = 1;
    char ch = getchar();
    while (ch < '0' || ch > '9') {
        if (ch == '-') f = -1;
        ch = getchar();
    }
    while (ch >= '0' && ch <= '9') {
        x = x * 10 + ch - '0';
        ch = getchar();
    }
    return x * f;
}

inline void print(int128 x) {
    if (x < 0) {
        putchar('-');
        x = -x;
    }
    if (x > 9) print(x / 10);
    putchar(x % 10 + '0');
}
```





# 根据数据范围选择算法

![](https://img.hailuo4ever.com/miscellaneous/4.png)

# vector

[https://oi-wiki.org/lang/csl/sequence-container/](https://oi-wiki.org/lang/csl/sequence-container/)

### 常用方法

#### 构造

**vector< 类型 > arr(长度, [初值])**

> 时间复杂度：$O(n)$

```cpp
vector<int> arr;         // 构造int数组
vector<int> arr(100);    // 构造初始长100的int数组
vector<int> arr(100, 1); // 构造初始长100的int数组，初值为1

vector<vector<int>> mat(100, vector<int> ());       // 构造初始100行，不指定列数的二维数组
vector<vector<int>> mat(100, vector<int> (666, -1)) // 构造初始100行，初始666列的二维数组，初值为-1
```

#### 尾接 & 尾删

- **.push_back(元素)**：在 vector 尾接一个元素，数组长度 $+1$.
- **.pop_back()**：删除 vector 尾部的一个元素，数组长度 $-1$

  > 时间复杂度：均摊 $O(1)$
  >

```cpp
// init: arr = []
arr.push_back(1);
// after: arr = [1]
arr.push_back(2);
// after: arr = [1, 2]
arr.pop_back();
// after: arr = [1]
arr.pop_back();
// after: arr = []
```

#### 获取长度

**.size()**

> 时间复杂度：$O(1)$

```cpp
for (int i = 0; i < arr.size(); i++)
    cout << a[i] << endl;
```

#### 清空

**.clear()**

> 时间复杂度：$O(n)$

#### 判空

**.empty()**

如果是空返回 `true` 反之返回 `false`.

> 时间复杂度：$O(1)$

#### 改变长度

**.resize(新长度, [默认值])**

修改 vector 的长度

- 如果是缩短，则删除多余的值
- 如果是扩大，且指定了默认值，则新元素均为默认值（旧元素不变）

> 时间复杂度：$O(n)$

#### 去重

第一步：sort(arr.begin(), arr.end());

第二步：arr.erase(unique(arr), alls.end());

注：unique()的去重原理是找出有序数组里的重复数，并把他们放在数组的尾部，返回第一个重复数的地址

### 注意事项

#### 提前指定长度

如果长度已经确定，那么应当直接在构造函数指定长度，而不是一个一个 `.push_back()`. 因为 `vector` 额外内存耗尽后的重分配是有时间开销的，直接指定长度就不会出现重分配了。

```cpp
// 优化前: 522ms
vector<int> a;
for (int i = 0; i < 1e8; i++)
    a.push_back(i);
// 优化后: 259ms
vector<int> a(1e8);
for (int i = 0; i < a.size(); i++)
    a[i] = i;
```

#### 当心 size_t 溢出

vector 获取长度的方法 `.size()` 返回值类型为 `size_t`，通常 OJ 平台使用的是 32 位编译器（有些平台例如 cf 可选 64 位），那么该类型范围为 $[0,2^{32})$.

```cpp
vector<int> a(65536);
long long a = a.size() * a.size(); // 直接溢出变成0了
```

# set

> 提供对数时间的插入、删除、查找的集合数据结构。底层原理是红黑树。

## 常用方法

### 构造

`set<类型, 比较器> st`

- 类型：要储存的数据类型
- 比较器：比较大小使用的比较器，默认为 `less<类型>`，可自定义

`set<int> st1; `              // 储存 int 的集合（从小到大）

`set<int, greater<int>> st2; `// 储存 int 的集合（从大到小）

### 遍历

可使用迭代器进行遍历：

`for (set<int>::iterator it = st.begin(); it != st.end(); ++it)`

`    cout << *it << endl;`

基于范围的循环（C++ 11）：

`for (auto &ele : st)`

`    cout << ele << endl;`

### 各种操作

插入: `st.insert()`

注：`insert()` 的函数有返回值，它返回 `pair<set<int>::iterator,bool>`

第二项的 `bool` 值返回是否插入成功，第一项的迭代器返回它插入在集合中的位置

删除：`st.erase()`

查找：`st.find()` **返回迭代器**

判空：`st.empty()`

大小：`st.size()`

清空：`st.clear()`

判断元素是否存在：`st.count()`

> 增删查时间复杂度均为 $O(\log n)$

### 适用情形

- 元素去重：$[1,1,3,2,4,4]\to[1,2,3,4]$
- 维护顺序：$[1,5,3,7,9]\to[1,3,5,7,9]$
- 元素是否出现过：适用于数据范围较大的情况

## 注意事项

### 不存在下标索引

set 虽说可遍历，但仅可使用迭代器进行遍历，它不存在下标这一概念，无法通过下标访问到数据。下面是错误用法：

~~cout << st[0] << endl;~~

### 元素只读

set 的迭代器取到的元素是只读的（因为是 const 迭代器），不可修改其值。如果要改，需要先 erase 再 insert. 下面是错误用法：

`cout << *st.begin() << endl; `// 正确。可读。

~~*st.begin() = 1;~~       // 错误！不可写！

### 不可用迭代器计算下标

set 的迭代器不能像 vector 一样相减得到下标。下面是错误用法：

`auto it = st.find(2);`      // 正确，返回 2 所在位置的迭代器。

~~int idx = it - st.begin();~~ // 错误！不可相减得到下标。

# map

> 提供对数时间的有序键值对结构，底层原理是红黑树。
> ![](https://img.hailuo4ever.com/miscellaneous/5.png)

## 构造

`map<键类型, 值类型, 比较器> mp`<u>默认从小到大</u>

`map<int, int, greater<int>> mp`

## 遍历

- 使用迭代器：

`for (map<int, int>::iterator it = mp.begin(); it != mp.end(); ++it)`

`    cout << it->first << ' ' << it->second << endl;`

- 基于范围的循环（C++ 11）：

`for (auto &pr : mp)`

`    cout << pr.first << ' ' << pr.second << endl;`

- 结构化绑定 + 基于范围的循环（C++17）：

`for (auto &[key, val] : mp)`

`    cout << key << ' ' << val << endl;`

## 各种操作

增改查: 使用中括号：`mp[1] = 2;`

删除：`mp.erase()`

查找：`mp.find()`** 返回迭代器**

判空：`mp.empty()`

大小：`mp.size()`

清空：`mp.clear()`

判断元素是否存在：`mp.count()`

二分查找：`mp.lower_bound()`

> 增删查时间复杂度均为 $O(\log n)$

## 注意事项

### 中括号访问会影响键的存在性

如果使用中括号访问 map 时对应的键不存在，那么会新增这个键，并且值为默认值，因此中括号会影响键的存在性。

`map<char, int> mp;`

`cout << mp.count('a') << endl;` // 0

`mp['a'];   `                    // 即使什么都没做，此时 mp['a']=0 已经插入了

`cout << mp.count('a') << endl;` // 1

`cout << mp['a'] << endl;`       // 0

### 不可用迭代器计算下标

map 的迭代器不能像 vector 一样相减得到下标。下面是错误用法：

`auto it = mp.find('a');  `    // 正确，返回 2 所在位置的迭代器。

~~int idx = it - mp.begin();~~   // 错误！不可相减得到下标。

# Bitset

`bitset<10000> s`

用于“压位”，例如若需存储 10000x10000 的 bool 矩阵，用 bitset 可以用每个字节来存储 0 和 1，相比于 bool 变量，可以省下八倍空间

## **操作**

支持所有位运算操作：`~ & | ^ >> << `

支持 `[]` 运算符，可取出对应下标的某个数

## **函数**

`count()`，返回有多少个 1

`any()`, 判断是否至少有一个 1

`none()`, 判断是否全为 0

`set()`, 把所有位重置成 1

`set(k, v)`, 将第 k 位变成 v

`reset()`, 把所有位变成 0

`flip()`, 等价于~

`flip(k)`, 取反第 k 位

# Lambda 表达式

语法：`[capture] (parameters) mutable -> return-type {statement}`
