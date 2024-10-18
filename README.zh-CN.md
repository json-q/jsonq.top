# 介绍

这是一个基于 Nestjs 的简易 OSS 图床。

# Features

- 请求频率限制
- 日志输出记录
- Github OAuth2 登录
- 双 token 无感知刷新
- 文件快捷上传
- 文件类型及大小限制
- 可识别图片地址上传至 oss（搭配 `auto-transfer-imgurl` 项目更快速迁移）
- 基于 Github Action 自动部署到服务器

> `.env` 文件为示例，本地优先读取 `.env.local`。在服务器上，你必须手动上传 `.env.local`
