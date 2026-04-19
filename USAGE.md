# AI职场搭子 — 使用与开发说明

## 快速开始

### 环境

- Node.js ≥ 14.0.0  
- 推荐使用 pnpm；亦可用 npm  

未安装 pnpm：

```bash
npm install -g pnpm
```

### 安装与运行

```bash
git clone <repository-url>
cd <项目目录>

pnpm install
pnpm dev
# 或
npm install
npm run dev
```

浏览器访问开发服务器地址（默认多为 <http://localhost:3000>，以终端输出为准）。

### 智谱 AI 分析（快捷分析）

1. 复制 `.env.example` 为 `.env`，填写 `REACT_APP_BIGMODEL_API_KEY`。  
2. 在侧栏选择一名沟通对象，进入 **快捷分析**（人物默认页）。  
3. 可选：上传截图（点击或拖拽，单张 ≤10MB）、选择 **意图标签**（话术求助、复盘反思、情绪吐槽、向上沟通）。  
4. 在文本框补充情境描述（可与截图同时使用；输入框高度会随内容增加，有上限以免占满屏）。  
5. 点击 **开始分析**：请求智谱模型，完成后跳转 **分析结果** 页查看共情开场、建议话术与情境分析。  

未配置 API Key 时，界面会提示先配置环境变量（具体以页面提示为准）。

## 功能使用指南

### 界面结构（近期版本）

- **左侧栏**：顶部为产品名；中间为沟通对象列表；列表末为 **添加人物**；最下方为 **成长足迹** 入口（进入 `/dashboard` 或首页成长页）。侧栏在快捷分析、分析结果、深度档案、成长足迹等路由下**保持显示**。  
- **人物页主区顶部**：**PersonaToolbar** — 当前对象名称、关系健康度、**查看记录**（跳转最近一次分析结果）、**深度档案**。  
- **成长足迹**（`/`、`/dashboard`）：心态折线图、沟通风格雷达图、成长建议文案；页顶 **返回** 可回到上一页或首页。  

### 成长足迹（仪表盘）

- 从侧栏点击 **成长足迹**，或访问 `/dashboard`。  
- 查看心态稳定性曲线、沟通风格雷达图与 AI 成长建议（图表数据当前多为 Mock，可后续对接接口）。  

### 人员档案

**新建对象**

1. 侧栏 **添加人物**  
2. 填写称呼（必填）、关系类型（老板/同事/客户或自定义）、可选标签等  
3. **完成**  

**删除对象**

- 将鼠标悬停在某一人物行上，出现 **删除（叉号）**；点击后在**页面中央确认弹窗**中确认或取消。若删除的是当前正在查看的对象，会自动跳转到其余对象或首页。  

**快捷分析**（依赖 `.env` 中的智谱 Key，见上文）

**查看记录**

- 在 PersonaToolbar 点击 **查看记录**，进入最近一次会话的分析结果（若无会话则按钮行为以实现为准）。  

**深度档案**

1. 在 PersonaToolbar 点击 **深度档案**  
2. 查看沟通风格、驱动力、雷区与甜点区等（部分内容来自模板/Mock）  
3. 可编辑备忘录（若页面已提供编辑能力）  

## 开发指南

### 目录结构

```
src/
├── components/     # Common、Layout（Sidebar、PersonaToolbar）、Charts、Modals、Pages
├── contexts/
├── data/
├── repositories/
├── router/
├── services/       # bigmodelChat.js、storage.js 等
├── styles/
├── types/
└── utils/          # 若存在
```

### 新增页面

1. 在 `src/components/Pages/` 增加组件  
2. 在 `src/router/index.js` 注册路由  
3. 在 `ROUTES` 中增加路径辅助函数（若需要）  

### 扩展 API / 数据层

1. `src/services/` 中增加或扩展模块（如 HTTP 封装于 `api.js`）  
2. `src/repositories/` 中封装调用  
3. 组件通过 Repository 或 Context 使用数据  

### 智谱对话与解析

- 实现入口：`src/services/bigmodelChat.js`  
- 模型返回期望为 JSON（intro、suggestedReply、situationAnalysis），含解析与兜底逻辑  

### 本地存储

```javascript
import { storageManager } from '../services/storage';

const settings = storageManager.getUserSettings();
```

存储键为 `aicareer_buddy_*` 前缀（见 `src/services/storage.js`）。

### 样式

- 主要使用 Tailwind 工具类  
- 全局与动画见 `src/styles/global.less`  

### 调试

- React DevTools 查看组件树与状态  
- Application → Storage 查看 localStorage / sessionStorage  
- Network 面板排查智谱请求（注意勿在公网环境泄露 Key）  

### 常见问题

**路由 404（生产环境）**  
服务器需将所有路径回退到 `index.html`（见下文 Nginx 示例）。

**分析失败**  
检查 `.env`、Key 是否有效、模型名是否与账号权限一致；大图可缩小后再试。

**数据不见了**  
确认未清除站点数据或更换域名/浏览器配置。

## 部署

```bash
pnpm build
# 或 npm run build
```

### 环境变量

生产构建同样通过 Webpack `DefinePlugin` 注入 `REACT_APP_*`，请在构建机或 CI 中设置与本地一致的变量。

示例：

```env
REACT_APP_BIGMODEL_API_KEY=...
# REACT_APP_BIGMODEL_TEXT_MODEL=...
# REACT_APP_BIGMODEL_VISION_MODEL=...
```

### Nginx（SPA）

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 技术支持

若遇到问题：查看控制台与网络请求、确认智谱控制台配额与 Key 状态，或在仓库提交 Issue。
