# AI职场搭子

基于 React 的职场沟通辅助应用：管理沟通对象档案、用智谱 **BigModel** 做多模态快捷情境分析，并提供成长可视化与本地持久化。

## 功能概览

| 模块 | 说明 |
|------|------|
| **布局与导航** | 左侧栏常驻：品牌「AI职场搭子」、沟通对象列表、「添加人物」、底部 **成长足迹** 入口（白底高对比样式）。进入具体人物后，主区顶部为 **PersonaToolbar** 卡片：姓名、关系健康度、**查看记录**、**深度档案**。 |
| **快捷分析** | 选择对象后输入文字（高度随内容自适应）、可选上传截图（≤10MB，点击或拖拽）；可选意图标签。点击 **开始分析** 调用智谱对话补全，解析 JSON 后跳转 **分析结果**（共情开场、建议话术、情境分析）。底部主按钮区域无额外白条，仅突出操作按钮。 |
| **分析结果** | 展示本轮输入、截图与模型输出；左侧会话列表（与全局侧栏并存时需注意横向空间）。 |
| **深度档案** | 沟通风格、驱动力、雷区与甜点区等洞察（部分为模板/Mock）；可编辑备忘录。 |
| **成长足迹** | 路由 `/` 与 `/dashboard`：心态折线图、沟通风格雷达图、AI 成长建议；页顶 **返回**；侧栏入口始终可回达。 |
| **人员管理** | 新建对象（模态框）；列表项悬停显示删除，**居中弹窗**二次确认后移除；删除当前查看对象时自动跳转其余对象或首页。 |

已移除的能力（历史版本文档若仍提及请忽略）：模拟对话训练、旧版「背景标签」快捷句、个人积分式 UI。

## 技术栈

- React 18、React Router 6  
- 样式：Tailwind CSS（CDN）+ Less 全局样式（蓝色系主题）  
- 构建：Webpack 5、Babel、`dotenv` + `DefinePlugin` 注入 `REACT_APP_*`  
- 状态：React Context + useReducer  
- 图表：Chart.js、react-chartjs-2（成长足迹页）  
- AI：智谱开放平台 [对话补全](https://open.bigmodel.cn/)，实现见 `src/services/bigmodelChat.js`（前端直连，Key 见安全提示）  

## 环境要求

- Node.js ≥ 14  
- 推荐使用 pnpm；亦可用 `npm install` + `npm run dev`（见 `package.json`）

## 环境变量

复制 [`.env.example`](.env.example) 为 `.env`，至少配置：

```env
REACT_APP_BIGMODEL_API_KEY=你的智谱_API_Key
```

可选覆盖默认模型（见 `webpack.config.js` 中 `DefinePlugin`）：

- `REACT_APP_BIGMODEL_TEXT_MODEL` — 纯文本分析  
- `REACT_APP_BIGMODEL_VISION_MODEL` — 含截图时  

修改 `.env` 后需**重启**开发服务。

> **安全提示**：将 Key 写进前端会在打包结果中暴露，仅适合本地或内网演示；正式环境请通过后端代理调用智谱接口。

## 安装与运行

```bash
pnpm install
pnpm dev
# 或
npm install
npm run dev
```

开发服务默认：<http://localhost:3000>（以 webpack-dev-server 配置为准）

```bash
pnpm build
# 或 npm run build
```

产物在 `dist/`，部署静态资源时需 **History fallback** 到 `index.html`。

## 项目结构（节选）

```
├── public/index.html
├── src/
│   ├── components/     # 页面、Layout（Sidebar、PersonaToolbar）、Charts、Modals
│   ├── contexts/       # 全局状态
│   ├── data/           # Mock 与种子数据
│   ├── repositories/   # 数据访问层
│   ├── router/         # 路由与路径常量
│   ├── services/       # bigmodelChat、storage 等
│   ├── styles/
│   └── types/
├── webpack.config.js
├── .env.example
├── README.md
└── USAGE.md
```

## 数据存储

- 人员与设置等使用 **localStorage**，键前缀为 `aicareer_buddy_`（见 `src/services/storage.js`）。  

## 相关文档

- 使用步骤、部署与开发约定见 [`USAGE.md`](USAGE.md)。  

## 开源协议

MIT（若仓库中包含 `LICENSE` 文件则以该文件为准。）
