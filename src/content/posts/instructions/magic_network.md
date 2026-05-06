---
title: 魔法上网教程
published: 2026-05-06
description: "Instructions written by Hailuo"
image: "https://img.hailuo4ever.com/cover/instructions.png"
tags: [教程]
category: "Instructions"
draft: false
lang: ""
---

# 前言

在现在的 `2026` 年，魔法上网是提升生产力的一个重要途径。无论是使用表现更优秀的语言大模型，如 `Gemini`，`ChatGPT` 等，还是阅读外文文献，了解前沿资讯，都需要我们掌握最基本的”科学上网“技术，然而大部分人由于信息的闭塞，对这方面的概念知之甚少，甚至计算机专业的同学也是如此。因此我决定写一篇教程，尽量带着大家学会这个技巧。

> [!NOTE]
>
> 科学上网的用途仅限学术，不要去外网键政！！这种行为非常危险！！！
>
> 我的网站托管在 `CloudFlare` 上，不经过国内审查，所以这篇教程文章是安全的，**请勿公开传播此文章**。

# 一些基础概念

要想正确地“科学上网”，我们需要理解并区分以下的概念，这会让大家在操作时明白，我们究竟在干什么。

## 什么是VPN和代理？我要用什么？

**VPN (Virtual Private Network / 虚拟专用网络):**

- 设计初衷是给企业员工远程接入内网办公用的加密通道。
- 特点：全局代理。一旦开启，手机或电脑上所有流量都走这个通道。
- 现状： 因为特征明显，传统的 VPN 协议（如 PPTP, L2TP）在审核面前很容易被阻断。

**Proxy (代理):**

- 原理： 不直接访问目标网站，而是通过一台“中间服务器”转发请求。
- 常用的代理协议：SS (Shadowsocks), SSR, V2Ray (VMess/VLESS), Trojan。这些通常被称为“翻墙协议”。

> [!NOTE]
>
> 因此，我们使用的并不是被称作 `VPN` 的东西，而是使用各个服务商提供的“代理”节点，来实现科学上网的效果。
>
> 为我们提供代理服务的服务商，被称作“机场”。

**机场 (Airport):**  指提供多个翻墙节点订阅服务的商家。因为早期工具 Shadowsocks 的图标是个小飞机，售卖这些配置的地方自然就成了“机场”。这也是普通用户实现科学上网最常见的途径。我们会从商家这里拿到一个订阅链接，就是我们访问外部网络的钥匙。

> 注：如果你是比较老练的选手，想自建一个 `vps`，那么本篇教程并不适合你，因为我也不会 :)

## 什么是客户端？和机场有什么区别？

客户端就是我们链接机场的工具，各个机场商家使用的客户端不尽相同，但本质上都是一个工具。

**只有客户端，没有机场的订阅链接是无法科学上网的！**，就好像你买了张机票，但本地没有机场，你照样坐不上飞机。

不同客户端常用的客户端如下：

Windows端：Clash Verge（原 `Clash For Windows` 停更后出现的替代品，比较稳定，也是我正在使用的），v2rayN等

[Clash Verge 下载链接](https://github.com/clash-verge-rev/clash-verge-rev/releases/tag/v2.4.7)，[v2rayN 下载链接](https://github.com/2dust/v2rayN/releases/tag/7.20.4)

Android端：Clash For Android，很好用的一款客户端，其它还有Surfboard，但我只用过Clash这一款。

[clash for android · clashbk/clash Wiki](https://github.com/clashbk/clash/wiki/clash-for-android)，这是Clash具体的教程，内附Clash For Android的下载方式。

IOS端：IOS端比较麻烦，首先你需要一个外区的 Apple ID，然后再花几美金购买一个叫Shadowrockets的软件，常常被称为“小火箭”，一般来说，机场会免费提供不带双重验证的 Apple ID，用于下载小火箭。

# 我使用的机场

我目前使用的主机场是 TAG，他们的日本家宽节点ip纯净度非常高，基本不易被Google或OpenAI风控掉。

[TAG机场官网（国内ip可访问）](tagxx.vip)

![](https://img.hailuo4ever.com/magic_network/1.png)

同样我也有一个备用机场，用于下载大文件or刷Youtube，名字是泡泡狗。

[泡泡狗官网（国内ip不可访问）](paopao.dog)

这两家都支持按照流量收费，就是你一次性买一两百G，不限使用时间，用完为止。对我这种使用强度没那么大的人很友好。

> [!TIP]
>
> 注意，无论你使用多高级的机场，哪怕是自建vps，都大概率用不了Anthropic的任何服务（Claude Code CLI或调用Claude Code Opus模型），他们对于中国用户的审查非常严格，甚至会根据东八区时区和简体中文的语言习惯来杀，所以老老实实用Codex即可，也不比Claude差很多。

# 怎么看懂一个客户端界面？

![](https://img.hailuo4ever.com/magic_network/2.png)

> [!NOTE]
>
> 你的机场运营商大概率会给一个教程文档，教你如何配置并正常连接，本文章不再赘述此部分内容。
>
> 此部分以 Clash Verge 的界面为例，讲解一下如何看懂客户端界面的文字。

## 系统代理和虚拟网卡

系统代理 (System Proxy)：开启后，浏览器等支持系统代理的软件会自动走代理。

虚拟网卡模式 (TUN Mode)：开启后会接管电脑全局流量，适合那些不吃系统代理的游戏或特定软件。

> 一般只需开启“系统代理”即可；若遇到某些软件无法翻墙，再尝试开启 TUN。
>
> 特别地，如果你使用某些CLI Agent，例如Codex，那么你大概率需要开启TUN。

## 什么是规则/全局连接？我要用哪个？

规则 (Rule) ：软件会根据规则自动判断：上百度走直连（不费流量），上 YouTube 走代理。

全局 (Global)：无论访问什么网站都走代理。通常用于规则失效，或者你需要紧急更换 IP 访问国内网站时。

直连 (Direct)：不走代理。相当于软件只是开着，但不发挥任何翻墙作用。

## 总结

其实只需要很简单的两个步骤就可以使用：

1. 先去“订阅”里粘贴机场链接。

2. 保持模式为 **“规则”**，然后打开 **“系统代理”** 开关即可。
