# GitHub Pages 发布仓库说明

## 项目定位

本目录是 `oppphantom/noetix-robotics-dashboard` 的 GitHub Pages 发布包，用于公开展示“松延动力 AI 数据工厂”复赛方案。

## 怎么运行

这是静态网站，不需要构建步骤。可直接打开 `index.html` 预览，也可以用任意静态服务器查看：

```bash
python3 -m http.server 8000
```

## 技术栈

- HTML / CSS / JavaScript
- GSAP CDN 动效
- GitHub Pages 托管

## 目录约定

- `index.html`：公开网站主页。
- `loop.html`：闭环流程页。
- `dashboard.html`：运行看板页。
- `architecture.html`：技术架构与未来演进页。
- `robots.html`：机器人能力图谱页。
- `approval.html`：高风险复采审批门禁页。
- `experience.html`：体验入口与 Demo 视频页。
- `assets/noetix/`：Bumi、N2、E1 机器人抠图素材。
- `assets/demo-media/`：Demo 视频和封面。

## 当前状态

截至 2026-08-15，主页和体验入口页均已嵌入压缩后的 Demo 视频。所有展示数据均为 `DEMO` 合成数据或公开资料推导，不代表松延动力内部实测数据。

