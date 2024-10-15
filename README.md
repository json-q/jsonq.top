# Introduction

- [gitee](https://gitee.com/jsonqi)
- [github](https://github.com/json-q)
- [博客园](https://www.cnblogs.com/jsonq)，部分认为有用的会同步至博客园

该静态站点部署在 [Vercel](https://vercel.com/) 和服务器两处，并基于 GIthub Action 实现 CI/CD 自动化部署的功能（未使用 Docker）。

图床为 Nest + ali-oss 搭建部署的简约后端服务。

SSL 证书是基于 acme 的自动续签的泛域名证书。

- [Vercel 地址](https://jsonq-top.vercel.app)
- [域名 地址](https://jsonq.top)
- [图床](https://draw-bed.jsonq.top/client/)

# Why not xxx ？

- 为什么不是 Vuepress 、Docusaurus、Dumi 等？
  - docsify 简约轻量，运行时渲染，响应速度快。
  - 同样部署在 Vercel，dumi 的响应速度远远慢于 docsify，加载内容同样，在有缓存的情况下也不如 docsify。
  - 为什么拿这两个作比较？因为仅用过这两个部署测试过，其它 vuepress、Docusaurus 没试过。
- 为什么不使用 Docker 部署？
  - 下次一定（其实是有点玩不转 Docker）
- 为什么不使用 Github Pages 或者 Vercel 而选择自建服务器？
  - 访问太慢，经常 404，就算 CNAME 做了 DNS 解析，访问速度还是慢。
- 为什么不使用 github 作为图床？
  - 同上，之前搞过，GitHub 图床就算有 jsdelivr 加速也不行，因为 jsdelivr 本身访问都不稳定

> 由于 Docsify 是运行时文档渲染，SEO 能力差，优化 SEO 需使用 SSR 渲染

# Changelog

- Fix: 内容区域断点和 toc 目录不一致导致布局错乱
- Fix: toc 目录在侧边收缩状态下无法固定（主题和 toc 样式冲突）
- Fix: 优化内容区域的宽度占比
- Feature: 新增代码高亮样式，调整整体字号，优化侧边及文本间距，保持主题紧凑
- Feature: 优化首页样式
