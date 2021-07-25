---
title: Git Flow模型
date: 2017-11-06 18:09:01
category: Git
tags:
  - Git
  - Git Flow
---

git-flow 是在 git branch 和 git tag 基础上封装出来的代码分支管理模型，把实际开发模拟称 master develop feature release hotfix support 几种场景，其中 master 对应发布上线，develop 对应开发，其他几个在不同的情况下出现。通过封装，git-flow 屏蔽了 git branch 等相对来说比较复杂生硬的命令（git branch 还是比较复杂的，尤其是在多分支情况下），简单而且规范的解决了代码分支管理问题。

<!--more-->

Git Flow 将 branch 分成2个主要分支和3个临时的辅助分支。

![git-flow](/images/GitFlow模型/git-flow.png)

主要分支：

- master：永远处在即将发布（production-ready）状态。
- develop：最新的开发状态。

辅助分支：

- feature：开发新功能的分支，基于 develop，完成后 merge 回 develop。
- release：准备要发布版本的分支，用来修复 bug。基于 develop，完成后 merge 回 develop 和 master。
- hotfix：修复 master 上的问题，等不及 release 版本就必须马上上线。基于 master，完成后 merge 回 master 和 develop。