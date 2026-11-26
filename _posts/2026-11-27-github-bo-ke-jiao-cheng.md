---
title: 用 GitHub Pages 从零搭建个人博客（详细教程）
date: 2026-11-27 21:00:00 +0800
categories: 教程
tags:
  - GitHub Pages
  - Jekyll
  - 教程
  - 博客
---

这篇教程记录如何不花钱、不买服务器，用 GitHub Pages 搭一个属于自己的博客，从注册账号到文章上线，全程照着做即可。

## 一、先搞清楚原理

GitHub Pages 是 GitHub 提供的静态网站托管服务。你把网页文件推送到一个指定仓库，GitHub 会自动用 **Jekyll** 把它们构建成网站，并给你一个可直接访问的地址：

```text
https://你的用户名.github.io
```

几个要点：

- 完全免费，公开仓库在合理使用范围内不限流量
- 托管的是静态网站，不能直接跑 PHP、数据库这类后端
- 默认支持 Jekyll，但处于安全模式，只能用官方允许的插件，自定义布局和样式不受影响
- 以后还能绑定自己的域名

## 二、准备工作

1. 注册一个 GitHub 账号：<https://github.com>
2. 用户名要想清楚，它会直接成为你博客域名的一部分，改名后旧域名不会自动跳转
3. 不需要在本地装任何东西也能完成，网页端就能新建和编辑文件

## 三、创建仓库

1. 登录后点右上角 **+** → **New repository**
2. Repository name 必须严格填：

```text
你的用户名.github.io
```

比如用户名为 `xiaowu-fox`，仓库名就是 `xiaowu-fox.github.io`，一个字母都不能错，否则不会被识别为个人主页。

3. 选择 **Public**（公开）
4. 可以勾选 Add a README file，也可以不勾
5. 点 **Create repository**

## 四、先放一个页面，看到效果

先不碰 Jekyll，用最简单的 HTML 验证流程通不通。

1. 进入刚建的仓库，点 **Add file** → **Create new file**
2. 文件名填 `index.html`，内容写：

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>我的博客</title></head>
<body><h1>Hello, world.</h1></body>
</html>
```

3. 拉到页面底部，点 **Commit changes**
4. 进入仓库 **Settings** → 左侧 **Pages**
5. Source 选择 **Deploy from a branch**，Branch 选 `main`、目录选 `/ (root)`，点 **Save**
6. 等 1～2 分钟，刷新这个 Pages 页面，顶部会出现站点地址，点进去就能看到刚才的页面

如果显示 404，先确认仓库名是否完全正确、分支是否选对，然后多等一会儿。

## 五、改用 Jekyll 管理博客

纯 HTML 能显示，但写文章不方便。Jekyll 让你用 Markdown 写正文，自动套上统一的排版。

### 目录结构

一个最小的 Jekyll 博客结构如下：

```text
用户名.github.io/
├── _config.yml        # 站点配置
├── index.md          # 首页
├── _layouts/         # 布局模板
│   └── default.html
└── _posts/           # 文章都放这里
    └── 2026-11-27-hello.md
```

### 1. 配置文件 _config.yml

新建文件 `_config.yml`：

```yaml
title: 我的博客
description: 记录学习和折腾
url: "https://你的用户名.github.io"
baseurl: ""
markdown: kramdown
permalink: /posts/:year/:month/:day/:title.html
future: true
```

`permalink` 决定文章网址格式，`future: true` 允许发布日期稍晚的文章，避免时区差导致文章不显示。

### 2. 布局模板 _layouts/default.html

新建 `_layouts/default.html`，照抄下面的内容即可：

{% raw %}
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title }} · {{ site.title }}</title>
  <style>
    body { font-family: sans-serif; max-width: 720px; margin: 40px auto; padding: 0 20px; line-height: 1.8; }
  </style>
</head>
<body>
  {{ content }}
</body>
</html>
```
{% endraw %}

正文会被填到内容占位符的位置。

### 3. 首页 index.md

把之前的 `index.html` 删掉（点进文件后用右上角垃圾桶删除并 Commit），新建 `index.md`：

{% raw %}
```markdown
---
title: 首页
layout: default
---

## 最新文章

{% for post in site.posts %}
- [{{ post.title }}]({{ post.url }}) — {{ post.date | date: "%Y-%m-%d" }}
{% endfor %}
```
{% endraw %}

顶部两条横线之间的部分叫 **front matter**，用来指定布局、标题等信息，循环会自动列出所有文章。

### 4. 写第一篇文章

在 `_posts` 目录新建文件，文件名必须符合格式：

```text
YYYY-MM-DD-文章英文或拼音名.md
```

例如 `2026-11-27-hello.md`，内容：

```markdown
---
title: 我的第一篇文章
date: 2026-11-27
layout: default
---

这是正文，支持 **加粗**、*斜体*、`行内代码`。

## 二级标题

- 列表项一
- 列表项二

[这是一个链接](https://github.com)
```

提交后等 1～2 分钟，回到首页就能看到这篇文章，点进去排版已经自动套好了。

## 六、在本地预览（可选，推荐）

每次都推到线上等构建比较慢，可以在电脑本地实时预览。

1. 先安装 Ruby：<https://www.ruby-lang.org>，Windows 推荐用 RubyInstaller
2. 在仓库根目录新建 `Gemfile`，内容：

```ruby
source "https://rubygems.org"
gem "github-pages", group: :jekyll_plugins
```

3. 打开终端，进入仓库目录，依次执行：

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

4. 浏览器打开 `http://localhost:4000`，改动文件后会自动刷新，效果和线上一致

## 七、日常写文章的流程

搭好之后，发新文章只有三步：

1. 在 `_posts` 里新建 `日期-名字.md`
2. 写好 front matter 和 Markdown 正文
3. Commit，等构建完成自动上线

Markdown 常用语法速查：

```markdown
# 一级标题  ## 二级标题
**加粗**  *斜体*  `代码`
> 引用
- 无序列表  1. 有序列表
[文字](链接)  ![图片说明](图片地址)
```

图片可以放在 `assets/images/` 目录，用相对路径引用。

## 八、进阶方向

基础博客跑通后，可以按需加功能，这些都不依赖后端：

- **评论**：用 Giscus，基于 GitHub Discussions，访客登录 GitHub 即可留言
- **浏览量、点赞**：用 Vercount、iine 这类轻量前端服务
- **搜索、标签**：用 Jekyll 生成 JSON 索引，前端 JS 实现
- **自定义域名**：在 Pages 设置里填入域名，并在域名服务商处加 CNAME 记录
- **手机写作**：iOS 可用 Hiyd，配置仓库和令牌后直接在手机上发文章

## 九、常见问题

**打开地址是 404**
检查仓库名是否为 `用户名.github.io`、Pages 里分支是否选了 main，然后等待构建，首次通常需要几分钟。

**改了内容但线上没变**
先到 Settings → Pages 或 Actions 看构建是否成功、有没有报错；浏览器可能有缓存，强制刷新（Ctrl+F5）再看。

**文章没出现在首页**
确认文件在 `_posts` 目录、文件名日期格式正确、front matter 两条横线完整；日期在未来的文章需要在配置里开 `future: true`。

**想用插件但不生效**
GitHub Pages 安全模式只允许官方插件清单内的插件。绝大多数需求（标签、目录、搜索）都能用原生模板和前端 JS 实现，不必依赖插件。

**构建报模板语法错误**
如果文章里要展示 Jekyll 的模板指令（双花括号、百分号花括号那类符号），需要用 raw 标签把这段代码包起来，让 Jekyll 原样输出、不要解析。具体写法如下，外层的 raw 标签负责保护，里面的内容会原样显示：

{% raw %}
```text
{% raw %}
这里放含有双花括号变量的代码
{% endraw %}
```
{% endraw %}

---

整套流程不需要任何服务器费用，学会之后完全掌握在自己手里。先把第四节的最小页面跑通，再逐步加布局和文章，是最稳的路径。
