---
title: 计算几何 (Notebook)
published: 2024-01-01
description: "Geometry"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [算法笔记, Notebook]
category: "Algorithm"
draft: false
lang: ""
---

# 基础平面几何

## 点和线的定义

> [!NOTE]
>
> **点和向量都用 `Point` 表示，线段和直线也都用 `Line` 结构体表示**。不同的函数会将他们看作不同的用途。
>
> 直线 `Line` 中装着两个 `Point`，它可以表示线段或直线，直线实际上就是无限长的线段而已。
>
> 直线的方向向量即为 $b-a$，对于直线外的一点 $P$，我们往往关注向量 $p-a$。

```c++
template<class T>
struct Point
{
    T x;
    T y;
    Point(const T &x_ = 0, const T &y_ = 0) : x(x_), y(y_) {}

    template<class U>
    operator Point<U>()
    {
        return Point<U>(U(x), U(y));
    }
    Point &operator+=(const Point &p) &
    {
        x += p.x;
        y += p.y;
        return *this;
    }
    Point &operator-=(const Point &p) &
    {
        x -= p.x;
        y -= p.y;
        return *this;
    }
    Point &operator*=(const T &v) &
    {
        x *= v;
        y *= v;
        return *this;
    }
    Point &operator/=(const T &v) &
    {
        x /= v;
        y /= v;
        return *this;
    }
    Point operator-() const
    {
        return Point(-x, -y);
    }
    friend Point operator+(Point a, const Point &b)
    {
        return a += b;
    }
    friend Point operator-(Point a, const Point &b)
    {
        return a -= b;
    }
    friend Point operator*(Point a, const T &b)
    {
        return a *= b;
    }
    friend Point operator/(Point a, const T &b)
    {
        return a /= b;
    }
    friend Point operator*(const T &a, Point b)
    {
        return b *= a;
    }
    friend bool operator==(const Point &a, const Point &b)
    {
        return a.x == b.x && a.y == b.y;
    }
    friend std::istream &operator>>(std::istream &is, Point &p)
    {
        return is >> p.x >> p.y;
    }
    friend std::ostream &operator<<(std::ostream &os, const Point &p)
    {
        return os << "(" << p.x << ", " << p.y << ")";
    }
};

template<class T>
struct Line
{
    Point<T> a;
    Point<T> b;
    Line(const Point<T> &a_ = Point<T>(), const Point<T> &b_ = Point<T>()) : a(a_), b(b_) {}
};
```

## 点积

```c++
template<class T>
T dot(const Point<T> &a, const Point<T> &b)
{
    return a.x * b.x + a.y * b.y;
}
```

点积可以判断两个向量的夹角、计算向量长度（点积平方为距离平方）

## 叉积

```c++
template<class T>
T cross(const Point<T> &a, const Point<T> &b)
{
    return a.x * b.y - a.y * b.x;
}
```

二维叉积定义为 $\vec a\times\vec b=x_1y_2-y_1x_2$，对于三个点一般是 $\overrightarrow{AB}\times\overrightarrow{AC}$。**注意，二维叉积的结果是一个数，而不是二维向量**。

叉积可用于判断转向，即判断某点位于直线的哪一侧。通过计算 $S=\overrightarrow{AB}\times\overrightarrow{AC}$，若 $S>0$，说明 $C$ 在有向直线 $A\rightarrow B$ 的左侧，即逆时针；若 $S<0$，说明 $C$ 在有向直线 $A\rightarrow B$ 的右侧，即顺时针；若 $S=0$，说明三点共线。

**叉积的第二个用途是计算有向面积**。有向面积是既有大小又有正负的面积，顶点逆时针排列时为正，顺时针排列时为负，共线时为 $0$。

平行四边形的有向面积为 $\vec a\times\vec b$，可以看作是对应三角形的面积的 $2$ 倍，由于精度问题，代码一般只保存三角形的两倍面积，而不是除以 $2$。

```c++
template<class T>
auto area2(const Point<T> &a, const Point<T> &b, const Point<T> &c)
{
    auto val = cross(a, b, c);
    return val >= 0 ? val : -val;
}
```

## 点线关系

### 判断点是否在线段上

```c++
// k 是否位于线段l上
template<class T>
bool pointOnSegment(const Point<T> &p, const Line<T> &l)
{
    return cross(p - l.a, l.b - l.a) == 0 && min(l.a.x, l.b.x) <= p.x && p.x <= max(l.a.x, l.b.x) &&
           min(l.a.y, l.b.y) <= p.y && p.y <= max(l.a.y, l.b.y);
}
```

点 $P$ 在线段 $AB$ 上，需要同时满足两个条件：

1. 三点共线，即 $\overrightarrow{AB}\times\overrightarrow{AP}=0$；
2. 点位于两个端点之间：$\overrightarrow{PA}\cdot\overrightarrow{PB}\leq 0$。

注：$\overrightarrow{PA}\cdot\overrightarrow{PB}= 0$ 是 $P$ 位于端点上的情况。

### 判断两条直线平行或重合

```c++
// 两直线是否平行
template<class T>
bool parallel(const Line<T> &l1, const Line<T> &l2)
{
    return cross(l1.b - l1.a, l2.b - l2.a) == 0;
}

bool sameLine(Point<T> a, Point<T> b, Point<T> c, Point<T> d)
{
    return cross(b - a, d - c) == 0 && cross(b - a, c - a) == 0;
}
```

两条直线 $AB$，$CD$ 的方向向量分别是 $\vec u=B-A$，$\vec v=D-C$。判断平行的方法是两个方向向量的叉积是否为 $0$，即 $(B-A)\times(D-C)=0$；判断重合就验证一下 $C$ 在不在直线 $AB$ 上，即 $(B-A)\times(C-A)=0$。

### 线段与直线是否相交

```c++
int d1 = sgn(cross(d - c, a - c));
int d2 = sgn(cross(d - c, b - c));

if (d1 == 0 || d2 == 0 || d1 != d2) // d1 * d2 <= 0
	return true;
else
    return false;
```

分别判断 $A,B$ 位于直线 $CD$ 的哪一侧，计算 $d_1=\operatorname{cross}(C,D,A)$，$d_2=\operatorname{cross}(C,D,B)$。

两个叉乘异号，代表 $A,B$ 两点位于 $CD$ 的两侧，如果有至少一个等于 $0$，代表位于 $CD$ 上，自然也相交。

### 两条线段相交

```c++
// 两线段严格相交
template<class T>
bool properIntersect(const Point<T> &a, const Point<T> &b, const Point<T> &c, const Point<T> &d)
{
    auto cp1 = cross(c - a, d - a);
    auto cp2 = cross(c - b, d - b);
    auto cp3 = cross(a - c, b - c);
    auto cp4 = cross(a - d, b - d);

    return cp1 != 0 && cp2 != 0 && cp3 != 0 && cp4 != 0 && sgn(cp1) != sgn(cp2) && sgn(cp3) != sgn(cp4);
}

// 0: 不相交
// 1: 严格相交
// 2: 共线重叠
// 3: 端点相交
// 求交点坐标，要求 T 用浮点
template<class T>
tuple<int, Point<T>, Point<T>> segmentIntersection(const Line<T> &l1, const Line<T> &l2)
{
    if (l1.a == l1.b)
    {
        if (pointOnSegment(l1.a, l2))
            return {3, l1.a, l1.a};

        return {0, Point<T>(), Point<T>()};
    }

    if (l2.a == l2.b)
    {
        if (pointOnSegment(l2.a, l1))
            return {3, l2.a, l2.a};

        return {0, Point<T>(), Point<T>()};
    }

    if (max(l1.a.x, l1.b.x) < min(l2.a.x, l2.b.x))
        return {0, Point<T>(), Point<T>()};
    if (min(l1.a.x, l1.b.x) > max(l2.a.x, l2.b.x))
        return {0, Point<T>(), Point<T>()};
    if (max(l1.a.y, l1.b.y) < min(l2.a.y, l2.b.y))
        return {0, Point<T>(), Point<T>()};
    if (min(l1.a.y, l1.b.y) > max(l2.a.y, l2.b.y))
        return {0, Point<T>(), Point<T>()};

    auto d1 = l1.b - l1.a;
    auto d2 = l2.b - l2.a;

    // 平行
    if (cross(d1, d2) == 0)
    {
        // 平行但不共线
        if (cross(d1, l2.a - l1.a) != 0)
            return {0, Point<T>(), Point<T>()};

        // 共线：求重叠部分
        auto maxx1 = max(l1.a.x, l1.b.x);
        auto minx1 = min(l1.a.x, l1.b.x);
        auto maxy1 = max(l1.a.y, l1.b.y);
        auto miny1 = min(l1.a.y, l1.b.y);
        auto maxx2 = max(l2.a.x, l2.b.x);
        auto minx2 = min(l2.a.x, l2.b.x);
        auto maxy2 = max(l2.a.y, l2.b.y);
        auto miny2 = min(l2.a.y, l2.b.y);

        Point<T> p1(max(minx1, minx2), max(miny1, miny2));
        Point<T> p2(min(maxx1, maxx2), min(maxy1, maxy2));

        if (!pointOnSegment(p1, l1))
            swap(p1.y, p2.y);

        if (p1 == p2)
            return {3, p1, p2};

        return {2, p1, p2};
    }

    auto cp1 = cross(l2.a - l1.a, l2.b - l1.a);
    auto cp2 = cross(l2.a - l1.b, l2.b - l1.b);
    auto cp3 = cross(l1.a - l2.a, l1.b - l2.a);
    auto cp4 = cross(l1.a - l2.b, l1.b - l2.b);

    if ((cp1 > 0 && cp2 > 0) || (cp1 < 0 && cp2 < 0) || (cp3 > 0 && cp4 > 0) || (cp3 < 0 && cp4 < 0))
        return {0, Point<T>(), Point<T>()};

    Point<T> p = lineIntersection(l1, l2);

    if (cp1 != 0 && cp2 != 0 && cp3 != 0 && cp4 != 0)
        return {1, p, p};

    return {3, p, p};
}

// 两线段是否相交，包含端点和共线重叠
// 该 bool 版本只做判定，不计算交点，适合整数坐标
template<class T>
bool segmentIntersect(const Point<T> &a, const Point<T> &b, const Point<T> &c, const Point<T> &d)
{
    if (max(a.x, b.x) < min(c.x, d.x) || min(a.x, b.x) > max(c.x, d.x) || max(a.y, b.y) < min(c.y, d.y) ||
        min(a.y, b.y) > max(c.y, d.y))
        return false;

    auto c1 = cross(b - a, c - a);
    auto c2 = cross(b - a, d - a);
    auto c3 = cross(d - c, a - c);
    auto c4 = cross(d - c, b - c);

    return sgn(c1) * sgn(c2) <= 0 && sgn(c3) * sgn(c4) <= 0;
}
```

[二维计算几何基础 - 快速排斥实验与跨立实验 - OI Wiki](https://oi-wiki.org/geometry/2d/#快速排斥实验与跨立实验)

`jiangly` 的代码模板中，首先使用了快速排斥，即判断两条线段的公共区域有没有重合。然后再使用跨立实验，以下是跨立实验的思想描述。

先检查 $C,D$ 是否位于直线 $AB$ 的两侧，即 $d1=\operatorname{cross}(A,B,C)$ 是否异号于 $d2=\operatorname{cross}(A,B,D)$，但只判断这一个条件是不够的，因为有可能出现这种情况，即 $CD$ 穿过了 $AB$ 所在的直线，交点位于延长线上。

```c++
C
 \
  \
   X
    \
     D

             A ----- B
```

所以还必须反过来，判断 $A,B$ 是否位于直线 $CD$ 的两侧。计算 $d_3=\operatorname{cross}(C,D,A)$，$d_4=\operatorname{cross}(C,D,B)$。$d3$ 与 $d4$ 也应该异号。

因此**严格相交（交点必须位于两条线段内部，且两直线不共线）**的判定为：`d1 * d2 < 0 && d3 * d4 < 0`。

> [!NOTE]
>
> 注意：这里不能直接写成 `d1 * d2 <= 0 && d3 * d4 <= 0`。会把形如 `A ----- B       C ----- D` 的情况判成 `true`，原因是共线但分离的这种情况，所有的叉积都等于 $0$，但显然是不相交的，因此用 `pointOnSegment` 来筛掉。

如果题目要求，相交在端点也算相交，就依次判断一下每个点在不在线段上。

## 投影点和对称点

### 投影点

```c++
// 求投影点坐标，p投影到直线l，要求T为浮点，l.a != l.b
template<class T>
Point<T> projection(const Point<T> &p, const Line<T> &l)
{
    auto v = l.b - l.a;
    return l.a + v * (dot(p - l.a, v) / dot(v, v));
}
```

设 $H$ 是点 $P$ 在直线 $AB$ 上的投影点。由于直线上的所有点都可以写成 $a+t(b-a)$，我们只需要关注这个 $t$ 是多少。

下文约定 $\vec v=b-a,\quad \vec w=p-a$。

考虑使用点积求 $t$。由于 $PH\perp AB$，有 $(H-p)\cdot \vec v=0$，整理有 $t=
\frac{(p-a)\cdot(b-a)}
{(b-a)\cdot(b-a)}$。

**看到投影点，思考方向应该是 $p-a$ 向 $b-a$ 投影**。 

参数 $t$ 是很重要的，它指出了一个点位于直线的哪里。$t<0$ 说明投影点在 $a$ 的外侧，$t>1$ 说明投影点在 $b$ 的外侧，$0 \le t \le 1$ 说明投影点在线段 $AB$ 上。

### 对称点

```c++
// 求点p关于直线l的对称点，要求T为浮点，l.a != l.b
template<class T>
Point<T> reflection(Point<T> p, Line<T> l)
{
    auto h = projection(p, l);
    return h * T(2) - p;
}
```

求出投影点后，显然投影点 $H$ 是 $PP'$ 的中点，因此有 `P' = 2H - p`。

## 距离

### 点到直线距离

```c++
// 点 p 到直线 l 的距离
template<class T>
long double distancePL(const Point<T> &p, const Line<T> &l)
{
    return fabsl((long double) cross(l.a - l.b, l.a - p)) / length(l);
}
```

求点到直线距离，实际上是求一个三角形的高。同样设直线为 $AB$，点为 $P$，显然有 ${S_{\triangle ABP}
=
\frac12
\left|
\overrightarrow{AB}
\times
\overrightarrow{AP}
\right|}$。所以点到直线距离公式即为 ${
d=
\frac{
|\operatorname{cross}(b-a,p-a)|
}
{|b-a|}
}$。

### 点到线段距离

```c++
// 点p 到线段 AB 的距离
template<class T>
long double distancePS(const Point<T> &p, const Line<T> &l)
{
    if (dot(p - l.a, l.b - l.a) < 0)
    {
        return distance(p, l.a);
    }
    if (dot(p - l.b, l.a - l.b) < 0)
    {
        return distance(p, l.b);
    }
    return distancePL(p, l);
}
```

点到线段距离，需要使用点积判断点 $P$ 的投影和线段的位置关系。

如果 $(p-a)\cdot(b-a)<0$，说明 $P$ 的投影落在 $A$ 的外侧；如果 $(p-b)\cdot(a-b)<0$，说明 $P$ 的投影落在 $B$ 的外侧。否则投影在线段中间，直接返回距离即可。

### 两线段间距离

```c++
// 两线段距离
template<class T>
long double distanceSS(const Line<T> &l1, const Line<T> &l2)
{
    if (segmentIntersect(l1.a, l1.b, l2.a, l2.b))
        return 0.0L;

    return min({distancePS(l1.a, l2), distancePS(l1.b, l2), distancePS(l2.a, l1), distancePS(l2.b, l1)});
}
```



## 多边形

### 多边形的表示方法

一般使用 `vector<Point<T>> p;`，即顶点的集合来表示多边形。

顶点一般按照多边形边界顺序排列，也就是逆时针或顺时针。方向会影响叉积的符号。

### 周长

```c++
template<class T>
long double polygonPerimeter(const vector<Point<T>> &p)
{
    int n = p.size();
    long double res = 0;

    for (int i = 0; i < n; i++)
        res += distance(p[i], p[(i + 1) % n]);

    return res;
}
```

知道了所有顶点以后，多边形的周长就是每条边的和，而由于顶点已经按照边界顺序排列好，所以直接就是相邻点的距离之和。

$L
=
\sum_{i=0}^{n-1}|P_iP_{i+1}|$，其中 $P_n=P_0$。

### 面积

```c++
// 计算2倍的有向面积，如果多边形点按照逆时针排列结果为正，否则为负
template<class T>
T polygonArea2(const vector<Point<T>> &p)
{
    int n = p.size();
    T res = 0;

    for (int i = 0; i < n; i++)
        res += cross(p[i], p[(i + 1) % n]);

    return res;
}
```

考虑求三角形的面积，用的是叉积，可以推广到多边形中。假设有多边形 $P_0,P_1,\dots,P_{n-1}$，从顶点 $O$ 向每一条边连接三角形，每个三角形的有向面积为 $\frac12(P_i\times P_{i+1})$，总和 ${S
=
\frac12
\sum_{i=0}^{n-1}
P_i\times P_{i+1}}$ 即为多边形的有向面积，真实面积取绝对值即可。

> [!NOTE]
>
> 注意这里不要对每个有向面积取绝对值。理解了有向面积的概念后应该不会犯这种错误。
>
> 注意这个辅助点实际上是一个思想，用于推导公式，但计算时不会用到。并且这个辅助点不一定位于多边形内部，因为叉积的有向性，会出现不同符号间抵消的情况。

根据以上的推导，我们使用**鞋带公式**求解多边形的面积。**鞋带公式：${
\sum cross(p[i],p[i+1])
}$**。

### 重心(useless)

```c++
// 计算多边形的重心，返回重心点坐标
template<class T>
Point<long double> centroid(const vector<Point<T>> &p)
{
    int n = p.size();

    long double sx = 0;
    long double sy = 0;
    long double s = 0;

    for (int i = 0; i < n; i++)
    {
        auto a = p[i];
        auto b = p[(i + 1) % n];

        long double c = cross(a, b);

        s += c;
        sx += (a.x + b.x) * c;
        sy += (a.y + b.y) * c;
    }

    return {
        sx / (3 * s),
        sy / (3 * s)
    };
}
```

没啥用。但还是放在板子里吧。

三角形的重心有一个结论，是三个点的向量和并取平均。即 ${G_x=
\frac{x_A+x_B+x_C}{3}}$，${G_y=
\frac{y_A+y_B+y_C}{3}}$。

利用和求面积时相同的推广方式，将多边形拆成三角形，整个图形的重心就是各个小三角形重心按照面积加权。

${G
=
\frac{\sum S_iG_i}{\sum S_i}}$，代入 ${G
=
\frac{
\sum
\frac12(P_i\times P_{i+1})
\cdot
\frac{P_i+P_{i+1}}3
}{
\sum
\frac12(P_i\times P_{i+1})
}}$。消去上下的 $\frac12$ 后，可以得到多边形重心公式：${\boxed{
G=
\frac{
\sum_{i=0}^{n-1}
(P_i+P_{i+1})
(P_i\times P_{i+1})
}{
3
\sum_{i=0}^{n-1}
(P_i\times P_{i+1})
}
}}$。

写成坐标的形式，即为 ${G_x=
\frac1{6A}
\sum
(x_i+x_{i+1})c_i}$，${G_y=
\frac1{6A}
\sum
(y_i+y_{i+1})c_i}$。

> [!NOTE]
>
> 注意，多边形的重心并不能看作对所有三角形的重心取平均。例如两个三角形 $S_1=100$，$S_2=1$。显然 $S1$ 的重心会对整个多边形的重心影响更大。

### 点在多边形内

这部分要解决的问题是：给定一个简单多边形 $P$ 和一个点 $q$，判断 $q$ 在多边形内部、外部还是边界上。

在边界的情况比较好处理，枚举所有边 $O(n)$ 的判断即可。

#### 射线法

```c++
template<class T>
bool pointInPolygon(const Point<T> &a, const std::vector<Point<T>> &p)
{
    int n = p.size();
    for (int i = 0; i < n; i++)
    {
        if (pointOnSegment(a, Line(p[i], p[(i + 1) % n])))
            return true;
    }

    int t = 0;
    for (int i = 0; i < n; i++)
    {
        auto u = p[i];
        auto v = p[(i + 1) % n];
        if (u.x < a.x && v.x >= a.x && pointOnLineLeft(a, Line(v, u)))
            t ^= 1;

        if (u.x >= a.x && v.x < a.x && pointOnLineLeft(a, Line(u, v)))
            t ^= 1;
    }

    return t == 1;
}
```

射线法的基本思想是：从询问点 $q$ 向右发射一条水平射线，统计这条射线和多边形相交多少次。奇数次在内部，偶数次在外部。

奇偶性可以判断内外是比较好理解的，考虑一个位于多边形左侧外面的点，它不断向右移动，每穿过一次多边形边界都会切换它在多边形的内外状态。最后显然是偶数的。

但射线法实现中有一个细节，如果这条射线经过了顶点怎么办？肯定不能认定和两条边都相交。**解决方案是半开区间**。对于边 $A(a_x,a_y)\rightarrow B(b_x,b_y)$，我们检查 `a.y <= q.y && q.y < b.y`，即 $[a_y,b_y)$ （另一边开也是一样的，开哪边都可以）。这种半闭半开的处理方式会使一个顶点只会被其中一条相邻边计算。

由于我们是射线，所以还需要判断，这个交点在不在 $q$ 的右侧？这里不必计算交点，使用叉积判断即可。

由于叉积的正负性，我们讨论两种边。一种是向上的边 $A \to B$，$q$ 需要在 $AB$ 的左边，即 `cross(b - a, q - a) > 0`。一种是向下的边 $B \to A$，由于方向变反，所以叉积符号也相反，即 `cross(b - a, q - a) < 0`。

#### 绕数法

```c++
template<class T>
int pointInPolygon(Point<T> q, const vector<Point<T>> &p)
{
    int n = p.size();
    int wn = 0;

    for (int i = 0; i < n; i++)
    {
        Point<T> a = p[i];
        Point<T> b = p[(i + 1) % n];

        if (onSegment(a, b, q))
            return 0;

        if (a.y <= q.y && q.y < b.y)
        {
            if (cross(b - a, q - a) > 0)
                wn++;
        }

        if (b.y <= q.y && q.y < a.y)
        {
            if (cross(b - a, q - a) < 0)
                wn--;
        }
    }

    return wn != 0 ? 1 : -1;
}
```

绕数法的基本思想是，多边形沿着边界走一圈，围绕 $q$ 总共转了多少圈。答案是：外部为 $0$，内部顺时针为 $-1$，逆时针为 $1$。

> [!NOTE]
>
> 因为绕数法虽然不是只看奇偶性，但它同样是在统计“水平射线穿过多边形边界”的次数，只不过给穿越加了方向 $+1/-1$。

扫描每一条边 $A\to B$。分两种穿过情况，同样检查半开半闭区间。一种是边向上经过 $q$，一种是边向下经过 $q$，与射线法同理。

## 圆

### 圆的表示方法

```c++
template<class T>
struct Circle
{
    Point<T> c;
    T r;
};
```

一个圆只需要两个信息：圆心和半径。

### 点与圆的关系

```c++
template<class T>
int pointCircleRelation(const Point<T> &p, const Circle<T> &c)
{
    T d = distance(p, c.c);

    if (sgn(d - c.r) < 0)
        return -1;
    if (sgn(d - c.r) == 0)
        return 0;
    return 1;
}
```

判定点与圆的位置关系，比较点到圆心的距离 $d$ 和半径 $r$ 即可。由于浮点误差，别直接写 `d == c.r`。

# 极角与极角排序

## 极角

对于给定向量 $\vec v=(x,y)$，规定从 $x$ 轴正方向开始，逆时针旋转到这个向量的方向，旋转的角度称作这个向量的极角。严格来说，极角是向量的属性。但一般把 $(0,0)$ 视作原点，此时点 $P$ 的极角就是向量 $OP$ 的极角。

## 极角排序

固定原点（极点）后，把所有向量按照极角大小的顺序排序，实际上就是一条扫描线逆时针扫一圈。

一种直观的方法是，先真正求出每个向量的角度，然后按照角度排序。C++ 提供了一个库函数 `atan2(y, x)` 用于求出一个向量 $(x,y)$ 的角度，本质上是计算 `tan = y / x` 的反正切。

```c++
sort(p.begin(), p.end(), [](auto a, auto b)
{
    return atan2(a.y, a.x) < atan2(b.y, b.x);
});
```

但这种方法比较慢，而且丢精度。其实我们不需要知道具体角度是多少。只需要判断 $a$ 和 $b$ 谁的角度更小，这其实可以使用叉积解决。但这里还要注意，不能直接用 `cross(a, b) > 0` 来转 $360^\circ$，原因是叉积只能判断两个向量间的相对旋转方向，$cross(a,b)>0$ 只能说明 $b$ 在 $a$ 逆时针不到 $180^\circ$ 的方向上。

因此正确的极角排序要先分半平面。把向量以 $x$ 轴为界，分成上下两部分，负 $x$ 轴划入第二部分。这样角度顺序就是 $0^\circ
\to
180^\circ
\to
360^\circ$。对于共线向量，即极角完全相同时，一般使用第二关键字，到极点的距离来排序。

```c++
template<class T>
bool polarCmp(const Point<T> &a, const Point<T> &b)
{
    int ha = half(a);
    int hb = half(b);

    if (ha != hb)
        return ha < hb;

    T c = cross(a, b);

    if (c != 0)
        return c > 0;

    return square(a) < square(b);
}
```

# 凸包

## 思路

以下求凸包的方法为 [Andrew 算法 - OI Wiki](https://oi-wiki.org/geometry/convex-hull/#andrew-算法求凸包)

首先把所有点以横坐标为第一关键字，纵坐标为第二关键字排序，然后构造下凸壳和上凸壳，最后拼起来。

一个凸多边形的边界可以拆成如下的两部分：

```c++
                 上凸壳
              ↗---------↘
            /             \
           L               R
            \             /
              ↘---------↗
                 下凸壳
```

`Andrew` 算法本质上是在维护一个单调栈。假设当前已经维护了一条凸链 `A → B → C → D`，现在加入一个新点 `E`，我们只需要看最后三个点 $C,D,E$。如果 $D$ 破坏了凸性就弹出，继续检查 $B,C,E$，如果 $C$ 也不合法就接着删。

```c++
while (当前最后三个点不满足凸性)
    pop_back();

push_back(新点);
```

考虑如何判断三个点是否满足凸性。假设依次经过 $A\to B\to C$，我们判断 `cross(B - A, C - A)`，大于 $0$ 左转，小于 $0$ 右转，等于 $0$ 共线。

下凸壳从左到右，连续三个点应该严格左转，即保证 $cross(B-A,C-A)>0$。

假设当前 $A,B$ 已经在下凸壳上，现在加入 $C$，这里 $B$ 在 $AC$ 上方，显然不可能继续作为当前下凸壳的顶点。此时 $cross(B-A,C-A)<0$，将 $B$ 弹出栈。

```c++
        B
       /
      /
A----------------C
```

如果三点共线，一般凸包只保留拐点，所以默认也弹出，根据题目要求也可以保留。

上凸壳与下凸壳反过来，和上面同理。有两种写法，一种是先正着求下凸壳，然后倒着求上凸壳，这样的好处是全程左转，判断条件固定。还有一种是 `jiangly` 的写法，从最左点开始同时维护上下凸壳，一个左转一个右转。

## Code

> [!NOTE]
>
> 注意，虽然返回上下两个凸壳，但他们并不共享边，但可能有重复点。
>
> $hi$ 和 $lo$ 都按 $x$ 递增方向排列，在同一个横坐标 $x$ 上，$hi$ 保留最高点，$lo$ 保留最低点。$hi$ 和 $lo$ 不是一个闭合多边形，而是两条开的链。一般有 `hi.front() != lo.front()`，`hi.back() != lo.back()`。
>
> 求完整凸包，拼接起来两部分即可，即 `lo + reverse(hi)`。拼接时先避免相邻的点有重复，然后再判首尾点是否有重复。

模板题链接：[二维凸包 - 题目 - QOJ.ac](https://qoj.ac/contest/3936/problem/218)

```c++
// 返回上下两条链
template<class T>
auto getHull(vector<Point<T>> p)
{
    sort(p.begin(), p.end(), [](const auto &a, const auto &b) { return a.x < b.x || (a.x == b.x && a.y < b.y); });

    vector<Point<T>> hi, lo;

    for (const auto &p: p)
    {
        while (hi.size() > 1 && cross(hi.back() - hi[hi.size() - 2], p - hi.back()) >= 0)
            hi.pop_back();

        while (!hi.empty() && hi.back().x == p.x)
            hi.pop_back();

        hi.push_back(p);

        while (lo.size() > 1 && cross(lo.back() - lo[lo.size() - 2], p - lo.back()) <= 0)
            lo.pop_back();

        if (lo.empty() || lo.back().x < p.x)
            lo.push_back(p);
    }

    return make_pair(hi, lo);
}

// 求完整凸包
template<class T>
vector<Point<T>> convexHull(vector<Point<T>> p)
{
    auto [hi, lo] = getHull(p);

    reverse(hi.begin(), hi.end());

    for (const auto &p: hi)
    {
        if (lo.empty() || p != lo.back())
            lo.push_back(p);
    }

    if (lo.size() > 1 && lo.front() == lo.back())
        lo.pop_back();

    return lo;
}

```

# 旋转卡壳

旋转卡壳在凸包算法的基础上，通过枚举凸包上某一条边的同时维护其他需要的点，能够在线性时间内求解如凸包直径、最小矩形覆盖等和凸包性质相关的问题。

## 平面最远点对（凸包直径）

首先要理解一个结论：**平面点集的最远点对一定出现在凸包顶点上**。

> ```c++
>        A
>       / \
>      / P \
>     /     \
>    B-------C
> ```
>
> 假设某个点 $P$ 在凸包内部，如果最远点对的一端是点 $P$，另一端为 $Q$（$Q$ 也在凸包内或凸包边界上），显然从 $Q$ 到 $P$ 的方向继续延伸，一定能碰到凸包边界上的点 $R$，所以 $P$ 不可能是最远点对的一端。
>
> 因此所有凸包内部点都没有必要作为最远点对的端点。
