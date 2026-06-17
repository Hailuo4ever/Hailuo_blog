---
title: 离散数学期末
published: 2026-06-17
description: "Discrete Mathmatics Final Examination"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [离散数学, Notebook]
category: "school_lecture"
draft: false
lang: ""
---

> [!NOTE]
>
> 本页面由ChatGPT生成。

# 2026 离散数学期末重点：按题型拆分

依据：`2026 考试范围.md`、`2024-2025 离散数学期末试卷.pdf`、往年整理卷、课件第 1--7 章、第 14 章、第 16 章。

这份文件按题型拆开讲“会怎么考”。所有公式尽量用规范 LaTeX 写法，方便直接复制到笔记里。

## 分值结构

| 题型 | 分值 | 核心任务 |
|---|---:|---|
| 填空题 | 20 | 公式、定义、计数、性质判断 |
| 选择题 | 20 | 概念真假、反例、必要条件、关系/图性质 |
| 计算题 | 45 | 主合取范式、前束范式、哈斯图、生成树、最小生成树、矩阵、闭包与划分 |
| 证明题 | 5 | 等价类运算性质 |
| 应用题 | 10 | 一阶逻辑自然推理 |

## 一、填空题考点

### F1. 命题符号化：重点考蕴含方向

常用翻译：

$$
\text{若 }p\text{，则 }q \quad \Longleftrightarrow \quad p\to q
$$

$$
\text{只有 }q\text{，才 }p \quad \Longleftrightarrow \quad p\to q
$$

$$
\text{只要 }p\text{，就 }q \quad \Longleftrightarrow \quad p\to q
$$

易错点：不要把“只有 $q$ 才 $p$”写成 $q\to p$。它的意思是 $p$ 成立必须有 $q$，所以是 $p\to q$。

### F2. 等价关系种类数

等价关系与集合划分一一对应。若集合 $A$ 有 $n$ 个元素，则 $A$ 上等价关系的个数等于 $n$ 元集合的划分数，即 Bell 数 $B_n$。

常用小规模结果：

$$
B_1=1,\quad B_2=2,\quad B_3=5,\quad B_4=15
$$

若题目要求“分成 $k$ 个等价类”，则对应第二类 Stirling 数 $S(n,k)$，常见做法是直接列划分。

### F3. 限制与像

设 $R$ 为二元关系，$B$ 为集合。

$$
R\upharpoonright B=\{\langle x,y\rangle\in R\mid x\in B\}
$$

$$
R[B]=\{y\mid \exists x\in B,\ \langle x,y\rangle\in R\}
$$

做题顺序：先筛第一分量，再取第二分量。

### F4. 余树的边数

连通无向图 $G$ 有 $n$ 个顶点、$m$ 条边，任一生成树 $T$ 有：

$$
|E(T)|=n-1
$$

余树中的边，也就是弦的条数为：

$$
m-(n-1)=m-n+1
$$

### F5. 幂集与对称差

幂集：

$$
\mathcal P(A)=\{X\mid X\subseteq A\}
$$

若 $|A|=n$，则：

$$
|\mathcal P(A)|=2^n
$$

对称差：

$$
A\triangle B=(A-B)\cup(B-A)
$$

易错点：区分 $\emptyset$、$\{\emptyset\}$、$\{\{\emptyset\}\}$。

### F6. 二元关系的种类判断

常见要求：判断 $R$ 是不是等价关系、偏序关系，或者判断它是否自反、对称、传递。

等价关系：

$$
\text{自反}+\text{对称}+\text{传递}
$$

偏序关系：

$$
\text{自反}+\text{反对称}+\text{传递}
$$

### F7. 极小项与极大项数量

含 $n$ 个命题变项的公式共有 $2^n$ 个赋值。

主析取范式中极小项个数：

$$
\text{成真赋值个数}
$$

主合取范式中极大项个数：

$$
\text{成假赋值个数}
$$

### F8. 二元关系项数

若 $|A|=m,\ |B|=n$，则从 $A$ 到 $B$ 的二元关系共有：

$$
2^{mn}
$$

若 $A$ 上有 $n$ 个元素，则 $A$ 上二元关系共有：

$$
2^{n^2}
$$

### F9. 图与补图边数

$n$ 阶无向简单图最多有：

$$
\binom n2=\frac{n(n-1)}2
$$

若 $G$ 有 $m$ 条边，则补图 $\overline G$ 有：

$$
|E(\overline G)|=\binom n2-m
$$

### F10. 简单通路与初级通路

简单通路：边不重复。

初级通路：顶点不重复。

结论：

$$
\text{初级通路}\Rightarrow \text{简单通路}
$$

反过来不一定成立。

## 二、选择题考点

### S1. 判断命题真假

蕴含式 $p\to q$ 只有一种假情况：

$$
p=1,\quad q=0
$$

其余情况都为真。选择题常用“假前件推出任何结论都为真”来设坑。

### S2. 传递闭包元素个数

有限集合 $A$ 上的传递闭包可理解为所有“可达”的有序对：

$$
t(R)=R\cup R^2\cup R^3\cup\cdots
$$

若 $|A|=n$，实际计算到 $R^n$ 已足够。做选择题时不要只补一步，尤其注意环会补出 $\langle x,x\rangle$。

### S3. 一阶命题的解释

一阶公式在解释下才有真值。判断顺序：

1. 看论域。
2. 看谓词含义。
3. 看量词范围。
4. 判断整句真值。

例如：

$$
\forall x(P(x)\to Q(x))
$$

意思是“论域中所有满足 $P$ 的对象都满足 $Q$”。

### S4. 图同构的必要条件

若 $G_1\cong G_2$，则必须满足：

$$
|V(G_1)|=|V(G_2)|,\quad |E(G_1)|=|E(G_2)|
$$

并且度数列相同、连通分支数相同、环和平行边情况一致。

注意：这些通常只是必要条件，不一定充分。

### S5. 自由出现与约束出现

变量 $x$ 在 $\forall x$ 或 $\exists x$ 的辖域内出现，是约束出现；不在对应量词辖域内，是自由出现。

同名变量可以先换名。例如：

$$
\forall xP(x,y)\to Q(x)
$$

左边的 $x$ 是约束出现，右边的 $x$ 是自由出现。

### S6. 正则图边数

$n$ 阶 $k$-正则无向图满足：

$$
2m=nk
$$

因此：

$$
m=\frac{nk}{2}
$$

### S7. 二元关系性质判断

常用定义：

$$
\text{自反：}\forall x\in A,\ \langle x,x\rangle\in R
$$

$$
\text{对称：}\forall x,y\in A,\ xRy\Rightarrow yRx
$$

$$
\text{传递：}\forall x,y,z\in A,\ (xRy\land yRz)\Rightarrow xRz
$$

反对称不是“没有反向边”，而是：

$$
(xRy\land yRx)\Rightarrow x=y
$$

### S8. 有向图连通性

三种连通性强弱关系：

$$
\text{强连通}\Rightarrow \text{单向连通}\Rightarrow \text{弱连通}
$$

反向一般不成立。

### S9. 点连通度与边连通度

对连通无向简单图，常用不等式：

$$
\kappa(G)\le \lambda(G)\le \delta(G)
$$

其中 $\kappa(G)$ 是点连通度，$\lambda(G)$ 是边连通度，$\delta(G)$ 是最小度。

### S10. 树与握手定理

树有 $n$ 个顶点时：

$$
m=n-1
$$

度数和：

$$
\sum_{v\in V}d(v)=2m=2(n-1)
$$

求一度顶点个数时，通常设树叶个数为 $x$，再列度数和方程。

## 三、计算题考点

### C1. 等值演算法求主合取范式

主合取范式由极大项合取而成。步骤：

1. 化简公式。
2. 找成假赋值。
3. 将每个成假赋值写成极大项 $M_i$。
4. 合取得主合取范式。

极大项规则：若某赋值中 $p=0$，极大项中写 $p$；若 $p=1$，极大项中写 $\neg p$。这样该极大项只在该赋值下为假。

例：

$$
M_{101}=(\neg p\vee q\vee \neg r)
$$

### C2. 前束范式

前束范式形式：

$$
Q_1x_1Q_2x_2\cdots Q_nx_n\,B
$$

其中 $Q_i\in\{\forall,\exists\}$，母式 $B$ 不含量词。

步骤：

1. 消去多余联结词，尤其是 $\to$。
2. 换名，避免自由变量与约束变量冲突。
3. 用量词否定公式把否定号推进去。
4. 按条件把量词提到最前面。

蕴含中常用迁移公式，要求 $x$ 不在另一部分自由出现：

$$
(\forall xA(x))\to B\equiv \exists x(A(x)\to B)
$$

$$
(\exists xA(x))\to B\equiv \forall x(A(x)\to B)
$$

$$
B\to \forall xA(x)\equiv \forall x(B\to A(x))
$$

$$
B\to \exists xA(x)\equiv \exists x(B\to A(x))
$$

### C3. 哈斯图、上下界、确界

偏序关系最常见来源：整除关系、包含关系。

画哈斯图步骤：

1. 找偏序集 $A$。
2. 找覆盖关系。
3. 不画自环。
4. 不画可由传递性推出的边。
5. 小元素放下面，大元素放上面。

对 $B\subseteq A$：

$$
\text{上界}=\{a\in A\mid \forall b\in B,\ b\preceq a\}
$$

$$
\text{下界}=\{a\in A\mid \forall b\in B,\ a\preceq b\}
$$

上确界是最小上界，下确界是最大下界。

### C4. 图到树的形变

常考生成树。连通图 $G$ 有生成树当且仅当 $G$ 连通。

生成树必须满足：

$$
|V(T)|=|V(G)|,\quad |E(T)|=|V(G)|-1
$$

并且 $T$ 连通无回路。

常用方法：

- 破圈法：遇到回路就删去一条边，保持连通。
- 避圈法：逐条选边，只要不成圈就选。

### C5. 最小生成树

Kruskal 算法：

1. 按权值从小到大排序。
2. 依次选边。
3. 若加入后成圈，则跳过。
4. 选满 $n-1$ 条边停止。

最后总权值：

$$
w(T)=\sum_{e\in E(T)}w(e)
$$

### C6. 图转矩阵

有向图邻接矩阵：

$$
a_{ij}=\text{从 }v_i\text{ 到 }v_j\text{ 的边数}
$$

可达矩阵：

$$
p_{ij}=
\begin{cases}
1,& v_i\text{ 可达 }v_j,\\
0,& v_i\text{ 不可达 }v_j.
\end{cases}
$$

一般约定每个顶点到自身可达，因此可达矩阵主对角线为 $1$。

关系矩阵：

$$
m_{ij}=
\begin{cases}
1,& \langle a_i,b_j\rangle\in R,\\
0,& \langle a_i,b_j\rangle\notin R.
\end{cases}
$$

### C7. 传递闭包与划分

传递闭包是“补最少有序对使关系传递”。

划分 $\pi=\{A_1,A_2,\dots,A_k\}$ 对应的等价关系：

$$
R_\pi=\bigcup_{i=1}^{k}(A_i\times A_i)
$$

也就是说，同一划分块内的任意两个元素互相关联，不同划分块之间没有关系。

## 四、证明题考点

### P1. 等价类运算性质

最可能考：

$$
[a]_R\cap [b]_R\ne \emptyset \Rightarrow [a]_R=[b]_R
$$

进一步可推出：

$$
[a]_R\cup [b]_R=[a]_R\cap [b]_R
$$

证明模板：

1. 取 $c\in [a]_R\cap [b]_R$。
2. 得到 $aRc$ 且 $bRc$。
3. 由对称性和传递性推出 $aRb$。
4. 证明 $[a]_R\subseteq [b]_R$。
5. 证明 $[b]_R\subseteq [a]_R$。
6. 得 $[a]_R=[b]_R$，再推出并集和交集相等。

## 五、应用题考点

### A1. 命题逻辑推理理论

题目通常给出若干已经符号化的前提和一个结论，要求在自然推理系统 $P$ 中写出证明过程。

常用推理规则：

$$
P,\ P\to Q\Rightarrow Q
$$

$$
P\land Q\Rightarrow P,\quad P\land Q\Rightarrow Q
$$

$$
P,\ Q\Rightarrow P\land Q
$$

$$
P\Rightarrow P\lor Q
$$

$$
P\to Q,\ Q\to R\Rightarrow P\to R
$$

若课程要求写“附加前提法”，常见目标是证明蕴含式：

$$
\Gamma\vdash A\to B
$$

证明模板：

1. 把 $A$ 作为附加前提。
2. 由原前提 $\Gamma$ 和附加前提推出 $B$。
3. 解除附加前提，得到 $A\to B$。

典型结构：

$$
p\to(q\to r),\quad q\to(r\to s)\vdash (p\land q)\to s
$$

做法是附加前提 $p\land q$，由合取消去得 $p,q$；再用假言推理推出 $r$，继续推出 $s$，最后得到 $(p\land q)\to s$。

若题目要求“归谬法”，常见目标是否定式：

$$
\Gamma\vdash \neg A
$$

证明模板：

1. 假设 $A$。
2. 从 $\Gamma$ 和 $A$ 推出矛盾，例如 $B$ 与 $\neg B$。
3. 因此推出 $\neg A$。

复习重点：把每一步写清楚“用了哪个前提、哪个已证公式、哪条规则”。这类题一般不难，扣分主要来自跳步或没有说明附加前提/归谬假设何时解除。
