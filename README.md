# 个人学习作品展示站

Next.js + GitHub JSON 数据版。

## 功能

- 前台公开展示：学习路径、进度、里程碑、实战项目、教程链接
- 后台密码登录：`/admin`
- 后台可新增/删除：个人资料、学习记录、里程碑、项目、教程链接
- 数据默认写入本地 `data/portfolio.json`
- 配置 GitHub 后，后台保存会提交更新 GitHub 仓库里的 JSON 文件

## 本地运行

```bash
export PATH=/home/yezilu/.local/node-v24.18.0-linux-x64/bin:$PATH
npm install
npm run dev
```

访问：

```bash
http://localhost:3000
```

后台：

```bash
http://localhost:3000/admin
```

管理员密码在 `.env.local`：

```bash
ADMIN_PASSWORD=你的后台密码
```

## GitHub 数据配置

不配置 GitHub 时，后台会直接写本地文件：

```bash
data/portfolio.json
```

要让部署后也能多人看到同一份数据，需要创建 GitHub token，并在 `.env.local` 或 Vercel 环境变量里填写：

```bash
ADMIN_PASSWORD=你的后台密码
GITHUB_TOKEN=你的 GitHub fine-grained token
GITHUB_OWNER=你的 GitHub 用户名或组织名
GITHUB_REPO=仓库名
GITHUB_BRANCH=main
GITHUB_DATA_PATH=data/portfolio.json
```

GitHub token 权限：

- Repository access：选择这个项目仓库
- Permissions：Contents -> Read and write

注意：`GITHUB_TOKEN` 只放在 `.env.local` 或 Vercel 环境变量里，不要提交到 Git。

## 验证

```bash
npm run lint
npm run build
npm run smoke
```

`npm run smoke` 会自动验证页面、后台登录、写入共享 JSON、前台读取。

## 取舍

GitHub JSON 适合你现在这种少量维护者、内容以文字和链接为主的阶段。它不适合高并发多人同时编辑。如果后面真的多人频繁写入，再迁移到数据库。
