---
title: Acwing算法提高课-Ch2-进阶搜索笔记
published: 2026-04-24
description: '学习笔记'
image: ''
tags: [Algorithm]
category: '算法题解'
draft: false 
lang: ''
---

# 进阶搜索思路

## 启发式搜索

> 启发式搜索（英文：heuristic search）是一种在普通搜索算法的基础上引入了启发式函数的搜索算法．
> 启发式函数的作用是基于已有的信息对搜索的每一个分支选择都做估价，进而选择分支．简单来说，启发式搜索就是对取和不取都做分析，从中选取更优解或删去无效解

通过一个估价函数，我们可以有效减少搜索时枚举的状态，进行有效剪枝。

设当前点为 `u`，已经走了 `f(u)` 步，估价函数为 `h(u)`，`u` 到终点的实际距离为 `g(u)`，则根据启发式搜索的思想，需要满足$h(u)\leqslant g(u)$，所以我们要以$f(u)+h(u)$为关键字进行排序（类似于）

## BFS

BFS 可以解决的问题可大致分为两类：最短距离（类似走迷宫）和最小步数（类似八数码）

BFS 具有两个性质：路径最短（第一次走到的点一定最短）和“基于迭代”（不会爆栈）

四联通一般用 `dx[]`，即偏移量数组

八连通一般用两重循环，枚举一个 `3*3` 的矩阵（注意忽略中心点）

# BFS

## Flood Fill

> 将一张图上的点抽象为“洼地”和“凸起”，每一次任选一个“洼地”点，想象有一个无限多的水源向里注水，直到所有的“洼地”都被灌满水源，该算法被命名为 **Flood Fill**
> **Flood Fill** 可以在**线性**的时间复杂度内，找到某个点所在的**连通块**
> 扩展格子的过程，可以使用 DFS 或 BFS，但 DFS 可能爆栈，且在数据规模大的时候复杂度很高，所以尽可能使用 BFS 实现。

### 池塘计数（Flood Fill 裸题）

> 注意：本题为八联通的情况。

从前往后扫描，如果某个点是水而且没有被覆盖过，就从该点开始执行 `Flood Fill`

在 BFS 过程中，如果发生越界/该点不是水/该点被遍历过，就 `continue` 这个坐标

#### Code

```cpp
// Problem: 池塘计数
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1099/
// Time: 2026-03-22 22:34:17
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;
typedef pair<int, int> PII;

int n, m;
char g[N][N];
bool vis[N][N]; // 加入判重，保证每个点只会入队一次，保证线性的复杂度
int dx[8] = {1, 1, 1, 0, 0, -1, -1, -1};
int dy[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

void bfs(int stx, int sty)
{
    queue<PII> q;
    q.push({stx, sty});
    vis[stx][sty] = true;

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        int a = t.first, b = t.second;

        for (int i = 0; i < 8; i++)
        {
            int x = a + dx[i], y = b + dy[i];

            if (x < 0 || x >= n || y < 0 || y >= m) // 出界
                continue;
            if (g[x][y] == '.' || vis[x][y]) // 不是水或者已被遍历过
                continue;

            q.push({x, y});
            vis[x][y] = true;
        }
    }
}

int main()
{
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> g[i][j];

    int cnt = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == 'W' && !vis[i][j])
            {
                bfs(i, j);
                cnt++;
            }

    cout << cnt << endl;
    return 0;
}
```

### 城堡问题（二进制枚举 + 统计联通块面积）

> 注意：本题为四联通的情况。

本题输入比较特别，对于每个格子表示的“墙”的情况，可以使用二进制编码的方式处理

也就是说，整个城堡的地形图是以数字的形式给出的。

在 bfs 过程中，如果遇到出界/该点被搜过/某个方向上有墙，则 `continue` 这个点/这个方向

可以在出队或入队时统计 `area`

#### Code

```cpp
// Problem: 城堡问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1100/
// Time: 2026-03-22 23:22:13
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 55;

int n, m;
int g[N][N];
bool st[N][N];

int dx[4] = {0, -1, 0, 1};
int dy[4] = {-1, 0, 1, 0};

int bfs(int stx, int sty)
{
    int area = 0;
    queue<PII> q;
    q.push({stx, sty});
    st[stx][sty] = true;

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        area++;

        int a = t.first, b = t.second;

        // 此处同时枚举了四个运动方向和二进制数的每一位
        for (int i = 0; i < 4; i++)
        {
            int x = a + dx[i], y = b + dy[i];
            if (st[x][y] || x < 0 || x >= n || y < 0 || y >= m)
                continue;

            if (g[a][b] >> i & 1) // 二进制上第i位为1，即有墙
                continue;

            q.push({x, y});
            st[x][y] = true;
        }
    }
    return area;
}

int main()
{
    cin >> n >> m;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> g[i][j];

    int cnt = 0, mx_area = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (!st[i][j])
            {
                int ret = bfs(i, j);
                mx_area = max(mx_area, ret);
                cnt++;
            }
    cout << cnt << '\n' << mx_area << endl;
    return 0;
}
```

### 山峰和山谷（判断联通块类型）

> 注意：本题为八联通的情况。是否 `continue` 中心的那个格子对答案没有影响

首先用 Flood Fill 把整张图的联通块统计出来，在统计联通块的同时，统计每一个点周围有没有比他高/比他矮的点，根据这两个条件判断是山峰还是山谷。

如果一个联通块周围既有比他高的，也有比他矮的，这个联通块就什么都不是。

#### Code

```cpp
// Problem: 山峰和山谷
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1108/
// Time: 2026-03-23 13:46:03
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 1010;

int n;
int g[N][N];
bool st[N][N];

void bfs(int stx, int sty, bool &high, bool &low)
{
    queue<PII> q;
    q.push({stx, sty});
    st[stx][sty] = true;

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        int a = t.first, b = t.second;

        // 注：(x, y) == (a, b)的情况不管考虑还是不考虑都是对的
        for (int x = a - 1; x <= a + 1; x++)
            for (int y = b - 1; y <= b + 1; y++)
            {
                if (x == a && y == b)
                    continue;
                if (x < 0 || x >= n || y < 0 || y >= n)
                    continue;

                if (g[x][y] != g[a][b]) // 此时(a, b)是山脉的边界
                {
                    if (g[x][y] > g[a][b])
                        high = true;
                    else
                        low = true;
                }
                else if (!st[x][y]) // 不是边界且还没被搜过的时候，才要继续搜
                {
                    q.push({x, y});
                    st[x][y] = true;
                }
            }
    }
}

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> g[i][j];

    int peak = 0, valley = 0;

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
        {
            if (!st[i][j])
            {
                bool high = false, low = false;
                bfs(i, j, high, low);

                if (!high) // 联通块周围没有更高的
                    peak++;
                if (!low) // 联通块周围没有更矮的
                    valley++;
            }
        }
    cout << peak << " " << valley << endl;
    return 0;
}
```

## 最短路模型

> 在整张图的边权均为 1 的时候，可以使用 BFS 按层遍历的特性来求最短路
> BFS 中的队列相当于 Dijkstra 的优先队列，且保证队头的距离最小的性质

### 走迷宫（BFS 过程中记录路径）

在最简单的 bfs 走迷宫问题的基础上，要求输出任意一条最短路径。

开一个 `pre` 数组记录所有点的前驱，初始化为 `{-1, -1}` 表示未访问，并把起点的前驱标作 `{0, 0}`

最后从终点倒着搜到起点，别忘了 `push` 进起点的坐标

#### Code

```cpp
// Problem: 迷宫问题
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1078/
// Time: 2026-03-23 15:18:49
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;
typedef pair<int, int> PII;

int n;
int g[N][N];
int dx[4] = {0, 0, -1, 1};
int dy[4] = {-1, 1, 0, 0};
PII pre[N][N];
vector<PII> res;

void bfs(int stx, int sty)
{
    queue<PII> q;
    q.push({stx, sty});
    pre[stx][sty] = {0, 0};

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        int a = t.first, b = t.second;

        for (int i = 0; i < 4; i++)
        {
            int x = a + dx[i], y = b + dy[i];
            if (x >= 0 && x < n && y >= 0 && y < n && g[x][y] == 0 && pre[x][y].first == -1)
            {
                q.push({x, y});
                pre[x][y] = {a, b};
            }
        }
    }
}

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> g[i][j];

    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            pre[i][j] = {-1, -1};

    bfs(0, 0);

    PII pos = {n - 1, n - 1};
    while (pos != make_pair(0, 0))
    {
        res.push_back(pos);
        pos = pre[pos.first][pos.second];
    }
    res.push_back({0, 0});

    reverse(res.begin(), res.end());

    for (auto t: res)
        cout << t.first << " " << t.second << endl;
    return 0;
}
```

### 武士风度的牛（按日字形 BFS）

> 注意：相比于传统的四联通和八连通，本题的八连通比较特殊，按照“日”字的规则来写偏移量即可

由于每个边的权重都一样，所以可以使用 BFS 来求最短路，和走迷宫的原理完全相同

#### Code

```cpp
// Problem: 武士风度的牛
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/190/
// Time: 2026-03-23 22:43:35
#include <bits/stdc++.h>
using namespace std;
const int N = 155;
typedef pair<int, int> PII;

int n, m, dist[N][N];
char g[N][N];

int dx[8] = {-2, -1, 1, 2, 2, 1, -1, -2};
int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};

int bfs(int stx, int sty)
{
    memset(dist, -1, sizeof dist);

    queue<PII> q;
    q.push({stx, sty});
    dist[0][0] = 0;

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        int a = t.first, b = t.second;
        for (int i = 0; i < 8; i++)
        {
            int x = a + dx[i], y = b + dy[i];

            if (x >= 0 && x < n && y >= 0 && y < m && g[x][y] != '*' && dist[x][y] == -1)
            {
                q.push({x, y});
                dist[x][y] = dist[a][b] + 1;

                // 此时第一次搜到H，但还没有走到H，还需要走一步，所以return +1
                if (g[x][y] == 'H')
                    return dist[x][y] + 1;
            }
        }
    }
    return -1;
}

int main()
{
    cin >> m >> n;

    int stx, sty;

    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
        {
            cin >> g[i][j];
            if (g[i][j] == 'K')
                stx = i, sty = j;
        }

    cout << bfs(stx, sty) << endl;
    return 0;
}
```

### 抓住那头牛（一维 BFS）

根据题意，我们不应该走到数轴上小于 0 的点，因为这样会浪费步数

另外我们可以发现先乘 2 再减，不如先减再乘 2，所以空间只需要开到 `1e5` 级别

在符合条件的状况下，使用 BFS 暴搜每种情况即可，枚举的情况是有限的，且都在 `[0,10000]` 里，所以最多搜索 `100000` 次，不会 TLE

#### Code

```cpp
// Problem: 抓住那头牛
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1102/
// Time: 2026-03-23 23:41:24
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 100010;

int n, k;
int dist[N];

int bfs()
{
    memset(dist, -1, sizeof dist);

    queue<int> q;
    q.push(n);

    dist[n] = 0;

    while (q.size())
    {
        int t = q.front();
        q.pop();

        if (t == k)
            return dist[k];

        if (t + 1 < N && dist[t + 1] == -1)
        {
            dist[t + 1] = dist[t] + 1;
            q.push(t + 1);
        }

        if (t - 1 < N && dist[t - 1] == -1)
        {
            dist[t - 1] = dist[t] + 1;
            q.push(t - 1);
        }

        if (t * 2 < N && dist[t * 2] == -1)
        {
            dist[t * 2] = dist[t] + 1;
            q.push(t * 2);
        }
    }

    return -1;
}

int main()
{
    cin >> n >> k;
    cout << bfs() << endl;
    return 0;
}
```

## 多源 BFS

> 在这种具有多个等价的起始状态的问题中，只需要在 BFS 之前把所有起始状态全部插入队列。根据 BFS 搜索的性质，这个过程就相当于每个起点都向外扩展 1 层，再扩展 2 层、3 层，以此类推。
> 这种做法被称为多源 BFS，即多起点的 BFS

### 矩阵距离

#### 思路

本题可看作一个有多个起始状态的 Flood Fill，把矩阵中的每一个 1 都看作起点，整个矩阵的所有位置都可以通行，对于每个位置，在从任何一个起点出发都可以的情况下，求到达该位置所需要的最小步数。

同理，每个点第一次被访问的时候，就相当于距离他最近的那个起点扩展到了它。

#### Code

```cpp
// Problem: 矩阵距离
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/175/
// Time: 2026-03-24 13:04:12
#include <bits/stdc++.h>
using namespace std;
const int N = 1010;

int n, m;
char g[N][N];
int dist[N][N];
int dx[4] = {0, 0, 1, -1};
int dy[4] = {1, -1, 0, 0};

void bfs()
{
    memset(dist, -1, sizeof dist);

    queue<pair<int, int>> q;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
        {
            if (g[i][j] == '1')
            {
                q.push({i, j});
                dist[i][j] = 0;
            }
        }

    while (q.size())
    {
        auto t = q.front();
        q.pop();

        int a = t.first, b = t.second;
        for (int i = 0; i < 4; i++)
        {
            int x = a + dx[i], y = b + dy[i];
            if (x >= 0 && x < n && y >= 0 && y < m && dist[x][y] == -1)
            {
                q.push({x, y});
                dist[x][y] = dist[a][b] + 1;
            }
        }
    }
}

int main()
{
    cin >> n >> m;

    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> g[i][j];

    bfs();

    for (int i = 0; i < n; i++)
    {
        for (int j = 0; j < m; j++)
        {
            cout << dist[i][j] << " ";
        }
        cout << '\n';
    }

    return 0;
}
```

## 最小步数模型

> 最小步数模型往往关注整张图，把它作为 bfs 的对象，所有状态可以构成一张有向图。一般通过哈希的方式，将每种状态存下来，然后进行 BFS，直到发现终点状态为止
> 例如在八数码中，就是通过交换，从起点图走到终点图

### 八数码-基础 BFS 解法

### 魔板

#### 思路

本题需要记录方案，类似于

由于要求按字典序输出，所以调整搜索方式即可。

题目给定如下三种操作，不一定需要把它转成二维，找规律在一维上直接操作即可：

1. 交换上下两行【把一维表示整个倒过来】
2. 将最右边的一列插入到最左边【把字符串第 3 位（从 0 开始）挪到最前面，把第 4 位挪到最后面】
3. 中央的四个数顺时针旋转【交换第 1 位和第 2 位，交换第 1 位和第 5 位，交换第 1 位和第 6 位（第一位实时更新）】

#### Code

```cpp
// Problem: 魔板
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1109/
// Time: 2026-03-24 13:39:45
#include <bits/stdc++.h>
using namespace std;
unordered_map<string, string> mp; // now - pre

string opA(string s)
{
    reverse(s.begin(), s.end());
    return s;
}

string opB(string s)
{
    for (int i = 3; i > 0; i--)
    {
        swap(s[i], s[i - 1]);
        swap(s[7 - i], s[8 - i]);
    }
    return s;
}

string opC(string s)
{
    swap(s[1], s[2]);
    swap(s[1], s[5]);
    swap(s[1], s[6]);
    return s;
}

void bfs(string begin, string end)
{
    queue<string> q;
    q.push(begin);
    mp[begin] = "";

    while (q.size())
    {
        string t = q.front();
        q.pop();

        string res[3] = {opA(t), opB(t), opC(t)};

        for (int i = 0; i < 3; i++)
        {
            string s = res[i];
            if (!mp.count(s))
            {
                mp[s] = mp[t] + char('A' + i);
                if (mp[s] == end)
                    return;
                q.push(s);
            }
        }
    }
}

int main()
{
    string begin = "12345678", end;
    for (int i = 0; i < 8; i++)
    {
        int x;
        cin >> x;
        end = end + char(x + '0');
    }

    if (begin != end)
        bfs(begin, end);

    cout << mp[end].size() << '\n' << mp[end];
    return 0;
}
```

## 双端队列 BFS

> 双端队列 BFS 通常用于解决**图中边的权值只有 0 或者 1 的最短路问题**
> 具体地说，如果入队的格点具有两段性，就要用双端队列维护。
> 一般情况下，我们把没有权值的边扩展到的点放到队首，有权值的边扩展到的点放到队尾．这样即可保证像普通 BFS 一样整个队列队首到队尾权值单调不下降。
> 具体来讲，每次都需要队头取出点，但在入队时更优的从队头入队，不优的从队尾入队，这就保证了更优的先出队，先扩展。

注意：更新其他点的时候，并不是最短距离，这个点出队的时候才是最短距离。也就是和一样，必须在出队时才知道每个点最终的最小值。

### 电路维修

#### 思路

首先把电路板上每一个格子点(交叉点)看作无向图中的节点，我们认为两个节点 x 和 y 是某个小方格的两个对角，那么如果说 x 和 y 的线段是\，那么我们可以认为边权为 0，反之如果 x 和 y 线段是’/’，那么我们的边权视为 1，说明要旋转一次才能够连上。

每个格点周围有 4 个对角格点，出界的不走，不能更优的不走。可走的分两类：连通的和不连通的，且连通的一定比不连通的更优（因为不消耗代价）。因此，入队的格点具有两段性（0 或 1），这就需要用双端队列维护。更优的从队头入队，不优的从队尾入队，这就保证了更优的先出队，先扩展。

注意：每个状态可能入队多次，但只会扩展一次。第一次出队时即该状态的最小代价。

![board1](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-board-1.png)

#### Code

```cpp
// Problem: 电路维修
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/177/
// Time: 2026-03-24 16:20:07
#include <bits/stdc++.h>
using namespace std;
typedef pair<int, int> PII;
const int N = 510;

int n, m;
char g[N][N]; // 存储格内斜边
int dist[N][N]; // 存储操作步数
bool st[N][N]; // 判重

int dx[4] = {-1, -1, 1, 1};
int dy[4] = {-1, 1, 1, -1};

int ix[4] = {-1, -1, 0, 0};
int iy[4] = {-1, 0, 0, -1};

char cs[5] = "\\/\\/"; // 格内斜边的状态

int bfs()
{
    deque<PII> q;
    q.push_back({0, 0});

    memset(st, 0, sizeof st);
    memset(dist, 0x3f, sizeof dist);

    dist[0][0] = 0;

    while (q.size())
    {
        auto t = q.front();
        q.pop_front();

        int a = t.first, b = t.second;

        if (a == n && b == m)
            return dist[a][b];

        if (st[a][b])
            continue;
        st[a][b] = true;


        for (int i = 0; i < 4; i++) // 枚举四个方向
        {
            int x = a + dx[i], y = b + dy[i]; // 枚举格点周围的四个格点
            int ga = a + ix[i], gb = b + iy[i]; // 枚举格子坐标

            int w = g[ga][gb] != cs[i]; // 当不连通的时候w为1
            int d = dist[a][b] + w;

            if (x < 0 || x > n || y < 0 || y > m) // 跳过格点越界
                continue;
            if (ga < 0 || ga >= n || gb < 0 || gb >= m)
                continue;

            if (d < dist[x][y])
            {
                dist[x][y] = d;
                if (w == 0)
                    q.push_front({x, y});
                else
                    q.push_back({x, y});
            }
        }
    }
    return 0x3f3f3f3f;
}

void solve()
{
    cin >> n >> m;

    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            cin >> g[i][j];

    int res = bfs();
    if (res == 0x3f3f3f3f)
        puts("NO SOLUTION");
    else
        cout << res << endl;
    return;
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

## 双向 BFS

> 双向 BFS 是 BFS 优化的一种策略，在给定起点和终点状态，且暴力 BFS 的状态情况很多时可以使用。
> **核心搜索与剪枝策略：搜索过程中，以起点和终点为搜索树的树根进行搜索，每次选择当前搜索分支较少的一段进行扩展，这样可以有效避免搜索很多无用状态。**

### 字串变换

#### 思路

题目要求最小的变换步数，可以想到 BFS，而给定起点和终点，可以想到使用双向 BFS

具体做法如下：

1. 建立两个队列 `qa`，`qb`，分别从起点和终点开始搜索（起点和终点作为两棵搜索树的两个根），两边轮流向外进行扩展，每次扩展一整层（扩展单点容易 TLE，也有可能搜不到答案）

![image1](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-img-1.png)

1. 每次扩展后，比较两棵 BFS 树，优先扩展当前层状态数量较少的那一棵，以便于控制每棵树长得不会太胖（让搜索情况少一些）
2. 还需要开两个哈希表 `mpa`，`mpb`，存储从树根到当前串的操作步数。同时哈希表还可以判重，避免相同的状态重复入队。
3. 在 BFS 搜索过程中，如果发现新串同时出现在另一个哈希表里，说明两棵树回合了，此时返回操作步数。根据题目要求，如果搜完 10 步（即向下扩展 10 层）以后还没有汇合，则无答案

#### Code

```cpp
// Problem: 字串变换
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/192/
// Time: 2026-03-25 21:14:18
#include <bits/stdc++.h>
using namespace std;
const int N = 7; // 至多6个规则

string A, B, a[N], b[N];
int n;

int extend(queue<string> &q, unordered_map<string, int> &mpa, unordered_map<string, int> &mpb, string a[], string b[])
{
    int sz = q.size();

    while (sz--) // 每次扩展一层
    {
        auto t = q.front(); // 父串出队
        q.pop();

        // 对取出的字符串t，枚举所有的规则和所有的位置
        // 如果发现可以匹配规则a[i]，就生成一个新的字符串s
        for (int i = 0; i < n; i++) // 枚举规则
        {
            for (int j = 0; j < t.size(); j++) // 枚举父串的每个位置
            {
                if (t.substr(j, a[i].size()) == a[i])
                {
                    string s = t.substr(0, j) + b[i] + t.substr(j + a[i].size());

                    // 如果当前方向已经搜过这个字符串了，为防止死循环，直接跳过
                    if (mpa.count(s))
                        continue;

                    if (mpb.count(s)) // 正向和逆向的搜索在此处相遇，此时的总步数即为两端相加，再加上当前这一步
                        return mpa[t] + mpb[s] + 1;

                    mpa[s] = mpa[t] + 1;
                    q.push(s);
                }
            }
        }
    }

    return 11; // extend过程中如果没相遇就返回11
}

int bfs()
{
    if (A == B)
        return 0;

    queue<string> qa, qb; // 存储每个字符串状态
    unordered_map<string, int> mpa, mpb;
    // mpa存储从起点到当前串的操作步数，mpb存储从终点到当前串的操作步数

    qa.push(A), qb.push(B);
    mpa[A] = mpb[B] = 0;

    int step = 10, res;
    while (step--)
    {
        if (qa.size() <= qb.size()) // 每次选当前搜索分支较少的一段进行扩展
            res = extend(qa, mpa, mpb, a, b);
        else
            res = extend(qb, mpb, mpa, b, a); // 注意从b开始搜的时候要反着传参

        if (res <= 10)
            return res;
    }
    return 11; // 10步以内搜不到
}

int main()
{
    cin >> A >> B;
    while (cin >> a[n] >> b[n]) // 记录规则数
        n++;

    int res = bfs();
    if (res == 11)
        puts("NO ANSWER!");
    else
        cout << res << endl;

    return 0;
}
```

## A*

> A*搜索算法（A* search algorithm，A*读作 A-star），简称 A* 算法，是一种在带权有向图上，找到给定起点与终点之间的最短路径的算法．它属于图遍历（graph traversal）和最佳优先搜索算法（best-first search），亦是 BFS 的改进，适用于搜索状态比较庞大的情况，可有效进行优化。

### 基本搜索流程

前置知识：

首先将 BFS 中的队列改为优先队列（小根堆），根据启发式搜索的思路，我们需要存储从起点到当前点的实际距离和从当前点走到终点的估计距离，每次扩展时我们挑一个估计距离最小的点来扩展。注意：当终点**第一次出队**的时候 `break` 掉。

![image2](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-img-2.png)

### 性质

![image3](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-img-3.png)

# DFS

> DFS 的回溯是由系统栈实现的，在代码里并不体现：

![board2](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-board-2.png)

## 连通性模型

> DFS 可以判断连通性，但不保证路径最短。但 DFS 的码速比较快，且逻辑更清晰。
> 注意：在内部进行 dfs 搜索不需要恢复现场。

### 走迷宫

注意：在走迷宫问题中，当我们以一个点向四个方向进行**内部搜索**的时候，是不需要“还原现场”的，因为不管怎么搜，都不会影响这个中心点的情况。

#### Code

```cpp
// Problem: 迷宫
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1114/
// Time: 2026-03-29 22:32:50
#include <bits/stdc++.h>
using namespace std;
const int N = 110;

int n, m, xa, ya, xb, yb;
char g[N][N];
bool st[N][N];
int dx[4] = {-1, 0, 1, 0}, dy[4] = {0, 1, 0, -1};

bool dfs(int a, int b)
{
    if (g[a][b] == '#')
        return false;
    if (a == xb && b == yb)
        return true;

    st[a][b] = true;

    for (int i = 0; i < 4; i++)
    {
        int x = a + dx[i], y = b + dy[i];
        if (x >= 0 && x < n && y >= 0 && y < n && !st[x][y] && dfs(x, y))
            return true;
    }
    return false;
}

void solve()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            cin >> g[i][j];
    cin >> xa >> ya >> xb >> yb;

    memset(st, false, sizeof st);

    if (dfs(xa, ya))
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

### 红与黑-Flood Fill

由于搜索的所有点都在棋盘内，因此不需要恢复现场。注意本题的特殊输入，每次输入图后需要重置 `st` 数组为 0

#### Code

```cpp
// Problem: 红与黑
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1115/
// Time: 2026-03-31 21:15:15
#include <bits/stdc++.h>
using namespace std;
const int N = 25;

int n, m;
char g[N][N];
bool st[N][N];

int dx[4] = {-1, 0, 0, 1};
int dy[4] = {0, -1, 1, 0};

int dfs(int a, int b)
{
    int res = 1;
    st[a][b] = true;
    for (int i = 0; i < 4; i++)
    {
        int x = a + dx[i], y = b + dy[i];
        if (x < 0 || x >= n || y < 0 || y >= m)
            continue;
        if (g[x][y] != '.')
            continue;
        if (st[x][y])
            continue;

        res += dfs(x, y);
    }
    return res;
}

int main()
{
    while (cin >> m >> n, n || m)
    {
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                cin >> g[i][j];

        int stx, sty;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                if (g[i][j] == '@')
                    stx = i, sty = j;

        memset(st, 0, sizeof st);
        cout << dfs(stx, sty) << endl;
    }
    return 0;
}
```

## 搜索顺序

> 搜索顺序主要是递归搜索树的扩展方式，通过不同的顺序规划完成不重不漏或优化的效果。

### 马走日

dfs 模板题，注意处理多组输入和搜索时恢复现场。

#### Code

```cpp
// Problem: 马走日
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1118/
// Time: 2026-03-31 21:39:29
#include <bits/stdc++.h>
using namespace std;
const int N = 10;

int n, m;
bool st[N][N];
int res;
int dx[8] = {-2, -1, 1, 2, 2, 1, -1, -2};
int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};

void dfs(int x, int y, int cnt)
{
    if (cnt == n * m)
    {
        res++;
        return;
    }

    st[x][y] = true;

    for (int i = 0; i < 8; i++)
    {
        int a = x + dx[i], b = y + dy[i];
        if (a < 0 || a >= n || b < 0 || b >= m)
            continue;
        if (st[a][b])
            continue;
        dfs(a, b, cnt + 1);
    }

    st[x][y] = false;
}

int main()
{
    int T;
    cin >> T;
    while (T--)
    {
        int x, y;
        cin >> n >> m >> x >> y;

        memset(st, false, sizeof st);
        res = 0;

        dfs(x, y, 1);
        cout << res << endl;
    }
    return 0;
}
```

### 单词接龙

#### Code

```java
// Problem: 单词接龙
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1119/
// Time: 2026-04-02 12:51:16
#include <bits/stdc++.h>
using namespace std;
const int N = 21;

int n, res;
string word[N];
int g[N][N]; // 若单词之间可以拼接，存储他们前缀和后缀公共部分的最小值
int used[N]; // 记录某个单词被使用的次数

void dfs(string dragon, int last) // dfs传入当前的龙和上一次使用的单词
{
    res = max((int) dragon.size(), res);
    used[last]++;

    for (int i = 0; i < n; i++)
        if (g[last][i] && used[i] < 2)
            dfs(dragon + word[i].substr(g[last][i]), i);

    used[last]--; // 恢复现场
}

int main()
{
    cin >> n;
    for (int i = 0; i < n; i++)
        cin >> word[i];

    char start;
    cin >> start;

    // 枚举所有单词对，判断是否可以拼接
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
        {
            string a = word[i], b = word[j];
            for (int k = 1; k < (int) min(a.size(), b.size()); k++)
            {
                if (a.substr(a.size() - k) == b.substr(0, k))
                {
                    g[i][j] = k;
                    break;
                }
            }
        }

    for (int i = 0; i < n; i++)
    {
        if (word[i][0] == start)
            dfs(word[i], i);
    }

    cout << res << endl;
    return 0;
}
```

### 分成互质组

#### 思路

为了保证搜索树的分支较小，所以我们按组枚举。按照下标从小到大的顺序搜索每个数且 `st[]` 判重，以达到不重不漏的搜索效果（按照组合型枚举的顺序）。

那么对于每个数，只有两种选择：放入此时的最后一组或新开一个组放入

根据**贪心思想**，如果一个数可以放进最后一组内，那么一定不用新开一个组来放

#### Code

```cpp
// Problem: 分成互质组
// Contest: AcWing
// URL: https://www.acwing.com/problem/content/1120/
// Time: 2026-04-02 15:21:02
#include <bits/stdc++.h>
using namespace std;
const int N = 10;

int n, res; // res为当前所存在的最优解
int p[N]; // 存放数
int group[N][N]; // 存放每个组
bool st[N]; // 标记每个数是否被放进了组内

bool check(int g[], int gc, int num)
{
    for (int i = 0; i < gc; i++)
    {
        if (gcd(g[i], p[num]) > 1) // 只要组内有数和该数不互质了，就 return false
            return false;
    }
    return true;
}

void dfs(int g, int gc, int tc, int start)
// g为当前的最后一组的组的序号, gc为当前组内搜索到的数的序号；
// tc为当前搜索过的数的数量, start为当前组开始搜索的数的序号。
{
    if (g >= res) // 如果有比当前最优解所需的组数更多的解法，说明此解不为最优解
        return;

    if (tc == n) // 如果搜完了所有点,说明此解为当前的最优解,更新最优解
        res = g;

    bool flag = true; // 标记能否可以新开一组

    for (int i = start; i < n; i++) // 枚举每个数
    {
        if (!st[i] && check(group[g], gc, i)) // 如果当前数还未被放进组里且与当前的组中的数都互质
        {
            // 将该数放进该组
            st[i] = true;
            group[g][gc] = p[i];

            // 继续搜索该组,组内数的数量gc + 1,总的数的数量tc + 1,搜索的数的序号i + 1
            dfs(g, gc + 1, tc + 1, i + 1);

            // 恢复现场
            st[i] = false;

            // 如果能放进当前最后一组,则不用新开一组,故flag标记为false
            flag = false;
        }
    }

    // 如果无法放进最后一组,则新开一组来搜索
    if (flag)
        dfs(g + 1, 0, tc, 0);
}

int main()
{
    cin >> n;
    res = n; // 还未搜索时,假定最优解为最坏的情况每个数都分一组
    for (int i = 0; i < n; i++)
        cin >> p[i];

    dfs(1, 0, 0, 0);
    cout << res << endl;
    return 0;
}
```

## 剪枝与优化

> 常用的优化策略有以下几种：
>
> 1. 优化搜索顺序：大部分情况下，我们应该优先搜索分支较少的节点
> 2. 排除等效冗余：不考虑顺序的话，尽量用组合式的方式搜索
> 3. 可行性剪枝：搜到一半发现不合法的时候，提前退出
> 4. 最优性剪枝：当前搜索状态比全局的值还差的时候，提前退出
> 5. 记忆化搜索：类似动态规划

### 小猫爬山

从前往后枚举每一个小猫，每一次枚举当前小猫放到哪个车上，`dfs(u, k)` 表示 `u` 只小猫，用 `k` 个车的情况。

如果可以放在已有的车上，就放进去，即 `dfs(u + 1, k)`

否则新开一个车来放猫，即 `dfs(u + 1, k + 1)`

![board3](https://img.hailuo4ever.com/%E6%8F%90%E9%AB%98%E8%AF%BECh2-%E8%BF%9B%E9%98%B6%E6%90%9C%E7%B4%A2/2-board-3.png)

#### Code

```cpp
// Problem: Luogu P10483
// Contest: Luogu
// URL: https://www.luogu.com.cn/problem/P10483
// Time: 2026-04-13 17:19:47
#include <bits/stdc++.h>
using namespace std;
const int N = 20;

int n, m, ans = 20;
int w[N], sum[N];

void dfs(int u, int k)
{
    if (k >= ans)
        return;

    if (u == n)
    {
        ans = k;
        return;
    }

    for (int i = 0; i < k; i++)
    {
        if (sum[i] + w[u] <= m)
        {
            sum[i] += w[u];
            dfs(u + 1, k);
            sum[i] -= w[u];
        }
    }

    sum[k] = w[u];
    dfs(u + 1, k + 1);
    sum[k] = 0;
}

int main()
{
    cin >> n >> m;

    for (int i = 0; i < n; i++)
        cin >> w[i];

    sort(w, w + n, greater<int>());

    dfs(0, 0);

    cout << ans << endl;
    return 0;
}
```
