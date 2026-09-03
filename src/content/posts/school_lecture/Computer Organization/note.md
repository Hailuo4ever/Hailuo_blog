---
title: Ch1 计算机系统概论
published: 2026-09-01
description: "Principles of Computer Organization"
image: https://img.hailuo4ever.com/cover/notebook.png
tags: [计组]
category: "school_lecture"
draft: false
lang: ""
---

# Ch1 - 计算机系统概论

## 1.1 - 计算机系统简介

计算机系统由硬件和软件组成。

计算机系统的层次结构：高级语言 -> 汇编语言 -> 机器语言 -> 硬件

> [!NOTE]
>
> 计算机体系结构和计算机组成的区别：程序员能看到什么，或者能使用什么功能，对应计算机体系结构；这些功能内部具体怎么实现，对应计算机组成。

## 1.2 - 计算机的基本组成

### 冯诺依曼计算机

冯诺依曼计算机是现代通用计算机的基本工作原理。它的思想是**存储程序思想**。也就是先把程序和数据放到存储器里，然后计算机自动逐条执行程序。运算器完成算术、逻辑运算；存储器保存程序和数据；控制器指挥程序执行；输入设备把外部信息转换成机器可识别的信息；输出设备负责把计算结果转换成人能理解的信息。

```c++
                    ┌─────────┐
                    │  输入设备 │
                    └────┬────┘
                         ↓
┌─────────┐       ┌─────────┐       ┌─────────┐
│  存储器  │ ←──→ │  运算器  │       │ 输出设备 │
└─────────┘       └─────────┘       └─────────┘
      ↑                 ↑
      └────────┬────────┘
               │
           ┌───┴───┐
           │ 控制器 │
           └───────┘
```

> [!NOTE]
>
> CPU = 运算器 + 控制器，主机 = CPU + 主存（内存）
>
> 主存可以理解成一个巨大的数组，每一个位置叫存储单元，每个存储单元都有自己的地址。
>
> 所以访问内存本质上就是：**给地址 -> 找到对应存储单元 ->读取 / 写入数据**。这就引出了下面的两个寄存器。

### 存储器的组成结构：MAR 和 MDR

MAR 和 MDR 是两个重要的寄存器，他们物理上位于 CPU 中，但逻辑上归内存管。

MAR: Memory Address Register，中文是存储器地址寄存器。它的作用是告诉主存，我要访问哪个地址。例如 `MAR = 100` 相当于访问 `Memory[100]`。

MDR: Memory Data Register，中文是存储器数据寄存器。它的作用是保存从主存读出的数据，或者准备写入主存的数据。

读写内存的操作示意如下：

```c++
// Read: 
地址 → MAR
M[MAR] → MDR

// Write: 
地址 → MAR
数据 → MDR
MDR → M[MAR]
```

**概括：MAR 负责地址，MDR 负责数据**。

### 运算器的组成结构

第一章涉及的运算器包括：$ACC,\ MQ,\ X,\ ALU$。

| 部件 | 全称                         | 名称         | 主要作用                   |
| ---- | ---------------------------- | ------------ | -------------------------- |
| ALU  | Arithmetic and Logic Unit    | 算术逻辑单元 | 真正完成加减乘除、逻辑运算 |
| ACC  | Accumulator                  | 累加器       | 保存操作数和运算结果       |
| MQ   | Multiplier-Quotient Register | 乘商寄存器   | 乘法、除法使用             |
| X    | -                            | 操作数寄存器 | 暂存另一个操作数           |

### 控制器的组成结构

包括 $PC,LR,CU$。

| 部件 | 全称                 | 名称       | 主要作用                                                     |
| ---- | -------------------- | ---------- | ------------------------------------------------------------ |
| PC   | Program Counter      | 程序计数器 | PC = 下一条要执行的指令地址，取完之后通常有 $PC\leftarrow PC+1$。 |
| IR   | Instruction Register | 指令寄存器 | IR = 当前正在执行的指令，例如 `IR = ADD 100` 表示把地址 $100$ 中的数据加到 $ACC$。 |
| CU   | Control Unit         | 控制单元   | 查看 $OP(IR)$，即 $IR$ 中的操作码，然后决定执行什么命令并发出信号。 |

### 计算机执行程序的流程

对于每一条指令，$CPU$ 基本都经历：取指，分析，执行这三个阶段。

> [!NOTE]
>
> CPU 是根据当前操作过程区分指令和数据的，如果是 `PC → MAR`，`MDR → IR`，CPU 就把它当作指令；如果是 `Ad(IR) → MAR`，`M[MAR] → MDR → ACC`，CPU 就把它当操作数。

#### Step 1 - 取指

假设 $PC=5$，代表 $CPU$ 要取主存地址 $5$ 的指令。

首先 $PC \to MAR$，于是 $MAR=5$。$CPU$ 首先告诉主存，我需要地址 $5$。然后 $MAR$ 读取数据放到 $MDR$ 里面，即 $M[MAR]\rightarrow MDR$。

假设 `Memory[5] = ADD 100`，于是 `MDR = ADD 100`。再让 $MDR\rightarrow IR$，也就是把当前正在执行的指令传给 $CPU$。于是 `IR = ADD 100`。

同时，$PC$ 读取下一条指令，即 $PC+1\rightarrow PC$。

因此完整的取指过程为：$\boxed{PC\rightarrow MAR}$，$\boxed{M[MAR]\rightarrow MDR}$，$\boxed{MDR\rightarrow IR}$，$\boxed{PC+1\rightarrow PC}$。

#### Step2 - 分析

假设 `IR = ADD 100`。一条指令通常可以看作操作码 + 地址码，分析过程就是把 $IR$ 中的指令发给 $CU$，即 $OP(IR)\rightarrow CU$。

#### Step3 - 执行

不同指令的执行阶段不同。

取数指令（`LOAD M`）：含义为 $\boxed{ACC\leftarrow M[100]}$

加法指令（`ADD M`）：含义为 $\boxed{ACC\leftarrow ACC+M[101]}$

存数指令（`STORE M`）：含义为 $\boxed{M[102]\leftarrow ACC}$

## 1.3 - 计算机硬件的主要技术指标

机器字长：CPU 一次能够处理的二进制数据位数。通常是 $32$ 位或 $64$ 位。通常与 $ACC,ALU$ 等位数密切相关。

存储容量：存储单元的数量乘以每个存储单元的位数，例如 $64K\times32bit$。

主频：例如 $3GHz=3\times10^9Hz$，表示一秒钟有 $3 \times 10^9$ 个时钟周期。

$CPI$：Cycle Per Instruction，表示平均执行一条指令需要多少个时钟周期。

$MIPS$：Million Instructions Per Second，表示每秒执行多少百万条指令。例如 $200MIPS=200 \times 10^6$。

$FLOPS$：每秒执行多少次浮点运算。

$\boxed{T=\frac{\text{指令数}\times CPI}{\text{主频}}}$，$\boxed{MIPS=\frac{\text{主频}}{CPI\times10^6}}$。

#### 求 MAR 和 MDR 位数

$\boxed{MAR位数=\log_2(\text{存储单元数})}$，$\boxed{MDR位数=\text{存储字长}}$

