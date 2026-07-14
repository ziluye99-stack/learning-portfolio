# 个人学习作品展示站

Next.js + 本地 JSON / GitHub 同步版。

## 功能

- 前台公开展示：介绍页、成长路径、里程碑、产品进展、教程链接
- 后台密码登录：`/admin`
- 后台可新增/删除：个人资料、月目标、日期、任务、里程碑、产品、教程链接
- 公开页默认读取仓库里的 `data/portfolio.json`
- 数据默认写入本地 `data/portfolio.json`
- 配置 GitHub 后，后台保存会提交更新 GitHub 仓库里的 JSON 文件，随后自动触发重新部署
- 旧入口 `/learning` 和 `/projects` 会重定向到新页面

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

首页：

```bash
http://localhost:3000/
```

成长路径：

```bash
http://localhost:3000/growth
```

产品进展：

```bash
http://localhost:3000/product-progress
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

公开页不再直接请求 GitHub API，所以会比之前更快，也更稳定。

## 验证

```bash
npm run lint
npm run build
npm run smoke
```

`npm run smoke` 会自动验证页面、后台登录、写入共享 JSON、前台读取。
如果本地配置了 GitHub 环境变量，建议先临时关闭后再跑 smoke，避免把测试写入同步到远端仓库。

## 取舍

GitHub JSON 适合你现在这种少量维护者、内容以文字和链接为主的阶段。它不适合高并发多人同时编辑。如果后面真的多人频繁写入，再迁移到数据库。
