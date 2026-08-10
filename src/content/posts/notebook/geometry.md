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

# 二维计算几何基础

## 点和向量

```c++
template<class T>
struct Point
{
    T x, y;

    Point operator+(const Point &other) const
    {
        return {x + other.x, y + other.y};
    }

    Point operator-(const Point &other) const
    {
        return {x - other.x, y - other.y};
    }

    bool operator==(const Point &other) const
    {
        return x == other.x && y == other.y;
    }
};
```

## 点积

```c++
template<class T>
auto dot(Point<T> a, Point<T> b)
{
    return a.x * b.x + a.y * b.y;
}
```

点积可以判断两个向量的夹角、计算向量长度（点积平方为距离平方）

## 叉积

```c++
template<class T>
auto cross(Point<T> a, Point<T> b)
{
    return a.x * b.y - a.y * b.x;
}

// AB x AC
template<class T>
auto cross(Point<T> a, Point<T> b, Point<T> c)
{
    return cross(b - a, c - a);
}
```

二维叉积定义为 $\vec a\times\vec b=x_1y_2-y_1x_2$，对于三个点一般是 $\overrightarrow{AB}\times\overrightarrow{AC}$。**注意，二维叉积的结果是一个数，而不是二维向量**。

叉积可用于判断转向，即判断某点位于直线的哪一侧。通过计算 $S=\overrightarrow{AB}\times\overrightarrow{AC}$，若 $S>0$，说明 $C$ 在有向直线 $A\rightarrow B$ 的左侧，即逆时针；若 $S<0$，说明 $C$ 在有向直线 $A\rightarrow B$ 的右侧，即顺时针；若 $S=0$，说明三点共线。

叉积的第二个用途是计算有向面积。平行四边形的有向面积为 $\vec a\times\vec b$，可以看作是对应三角形的面积的 $2$ 倍，由于精度问题，代码一般只保存三角形的两倍面积，而不是除以 $2$。

```c++
template<class T>
auto area2(Point<T> a, Point<T> b, Point<T> c)
{
    auto val = cross(a, b, c);
    return val >= 0 ? val : -val;
}
```

## 点积与叉积的应用

### 判断点是否在线段上

```c++
template<class T>
bool onSegment(Point<T> a, Point<T> b, Point<T> k)
{
    return cross(a, b, k) == 0 && dot(k - a, k - b) <= 0;
}
```

点 $P$ 在线段 $AB$ 上，需要同时满足两个条件：

1. 三点共线，即 $\overrightarrow{AB}\times\overrightarrow{AP}=0$；
2. 点位于两个端点之间：$\overrightarrow{PA}\cdot\overrightarrow{PB}\leq 0$。

注：$\overrightarrow{PA}\cdot\overrightarrow{PB}= 0$ 是 $P$ 位于端点上的情况。

### 判断两条直线平行或重合

```c++
bool parallel(Point<T> a, Point<T> b, Point<T> c, Point<T> d)
{
    return cross(b - a, d - c) == 0;
}

bool sameLine(Point<T> a, Point<T> b, Point<T> c, Point<T> d)
{
    return cross(b - a, d - c) == 0 && cross(a, b, c) == 0;
}
```

两条直线 $AB$，$CD$ 的方向向量分别是 $\vec u=B-A$，$\vec v=D-C$。判断平行的方法是两个方向向量的叉积是否为 $0$，即 $(B-A)\times(D-C)=0$；判断重合就验证一下 $C$ 在不在直线 $AB$ 上，即 $(B-A)\times(C-A)=0$。

### 线段与直线是否相交

```c++
int d1 = sgn(cross(c, d, a));
int d2 = sgn(cross(c, d, b));

if (d1 == 0 || d2 == 0 || d1 != d2) // d1 * d2 <= 0
	return true;
else
    return false;
```

分别判断 $A,B$ 位于直线 $CD$ 的哪一侧，计算 $d_1=\operatorname{cross}(C,D,A)$，$d_2=\operatorname{cross}(C,D,B)$。

两个叉乘异号，代表 $A,B$ 两点位于 $CD$ 的两侧，如果有至少一个等于 $0$，代表位于 $CD$ 上，自然也相交。

### 两条线段相交

```c++
bool onSegment(Point a, Point b, Point k)
{
    return cross(a, b, k) == 0 && dot(k - a, k - b) <= 0;
}

bool properIntersect(Point a, Point b, Point c, Point d)
{
    int d1 = sgn(cross(a, b, c));
    int d2 = sgn(cross(a, b, d));
    int d3 = sgn(cross(c, d, a));
    int d4 = sgn(cross(c, d, b));

    return d1 * d2 < 0 && d3 * d4 < 0;
}

bool segmentIntersect(Point a, Point b, Point c, Point d)
{
    if (properIntersect(a, b, c, d))
        return true;

    if (onSegment(a, b, c))
        return true;

    if (onSegment(a, b, d))
        return true;

    if (onSegment(c, d, a))
        return true;

    if (onSegment(c, d, b))
        return true;

    return false;
}
```

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
> 注意：这里不能直接写成 `d1 * d2 <= 0 && d3 * d4 <= 0`。会把形如 `A ----- B       C ----- D` 的情况判成 `true`，原因是共线但分离的这种情况，所有的叉积都等于 $0$，但显然是不相交的，因此用 `onSegment` 来筛掉。

如果题目要求，相交在端点也算相交，就依次判断一下每个点在不在线段上。
