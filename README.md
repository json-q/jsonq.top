# Docsify Note

- [gitee](https://gitee.com/jsonqi)
- [github](https://github.com/json-q)
- [博客园](https://www.cnblogs.com/jsonq)，部分认为有用的会同步至博客园

该静态站点部署在 [Vercel](https://vercel.com/) 和云服务器两处，基于 GIthub Action 实现 CI/CD 自动化部署的功能。[图床](https://draw-bed.jsonq.top/client/)为 OSS + Nest 搭建部署的简约后端服务。

- [Vercel 站点](https://jsonq-top.vercel.app)
- [服务器 站点](https://jsonq.top)

# 为什么不是 xxx ？

docsify 简约轻量，且无任何依赖包袱 `node_modules`，仅需一个命令即可快速运行，同样部署在 Vercel，dumi 的打开速度远远慢于 docsify，加载内容同样，在有缓存的情况下也不如 docsify 响应快。

> - 为什么拿这两个作比较？因为仅用过这两个部署测试过，其它 vuepress、Docusaurus 没试过。
> - 为什么不使用 Docker 在云服务器部署？下次一定（其实是有点玩不转 Docker）

# Changelog

- Fix: 内容区域的断点和 toc 目录不一致导致的布局错乱
- Fix: toc 目录在侧边收缩状态下无法固定（主题和 toc 样式冲突）
- Fix: 优化内容区域的宽度占比
- Feature: 新增代码高亮样式，调整整体字号，优化侧边及文本间距，保持主题紧凑
- Feature: 优化首页样式
