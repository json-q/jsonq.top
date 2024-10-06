使用 Github Action 的原因是，jekins 占用的服务器资源较多，低配置服务器 jekins 很容易把服务器打满。

# 了解 Github Action

什么是 GitHub Action？其实也很容易理解，如果你用过 github pages 或者 vercel 的话就不陌生，就是一个 CI/CD 服务。提交代码自动触发部署。那么如何让 github action 连接远程服务器触发部署呢？

网上大部分的教程都是基于 ssh + docker 部署的，说实在，目前有点玩不转 docker，所以已有的思路是：

- 本地代码提交
- 触发 GitHub Action
- 执行构建脚本（git pull、install、build 等）

> 其实脚本构建这一步和 Dockerfile 是一样的思路。

# SSH 连接服务器

## GitHub 需要的配置

使用 ssh 连接 服务器，需要 ssh 私钥，但是私钥不能直接写入配置文件，GitHub 提供了相关功能，可以理解为 `env`。

点击项目仓库的 Settings -> Secrets and variables -> Actions -> new repository secret，填入 key 和 value，多个 secret 需要多次创建，在 GitHub Action 中访问时以 object 对象格式访问。跟 js 的对象语法类似。key 就是对象 key，value 就是 对应的值。

## 生成 SSH

ssh 公私钥在 `~/.ssh` 下，可以 cd 到该目录下 `ls` 查看。

如果只有一个 `authorized_keys`，则需要使用 `ssh-keygen` 生成公私钥对。具体步骤如下

- `ssh-keygen -t rsa -C "github action"` 生成公私钥对
  - 其中 `-C "github action"` 类似备注，可以省略
- 生成成功后 `ls` 查看，此时应该有三个文件 `id_rsa`、`id_rsa.pub`、`authorized_keys`
- `cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys`，设置公钥内容为 `authorized_keys` 文件的内容，
- `cat ~/.ssh/id_rsa` 将私钥内容添加到 GitHub 仓库的 Secret 中。
