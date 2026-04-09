# 📸 功能截图指南

本文档说明如何为 README.md 生成功能截图。

## 需要准备的环境

1. 确保开发服务器正在运行：`npm run dev`
2. 访问 `http://localhost:5173` 或 `http://localhost:5174`
3. 使用浏览器截图工具或系统截图功能

## 需要截取的页面

### 1. 任务看板界面 (`dashboard-kanban.png`)

**操作步骤：**
1. 打开应用，点击顶部导航栏「🗂️ 关系网络」标签
2. 默认显示「📊 任务看板」子标签
3. 确保有以下元素可见：
   - 顶部统计面板（关系人数/待办/逾期/已完成）
   - 已逾期任务列表（红色高亮）
   - 待执行任务列表
   - 任务优先级标签和时间显示

**截图要求：**
- 分辨率：1920x1080 或更高
- 确保统计面板和至少2-3个任务可见
- 如有需要，先添加一些测试数据

**测试数据建议：**
```
领导档案：
- 张总（技术总监，关系状态：谨慎相处）
- 李经理（部门经理，关系状态：正常同事）

任务：
- Q2资源申请（紧急，今天，逾期）
- 项目进度汇报（重要，3天后）
- 技术方案对齐（普通，下周）
```

### 2. 领导档案管理界面 (`leader-profiles.png`)

**操作步骤：**
1. 在「关系网络」页面，点击「👥 我的领导」子标签
2. 显示领导卡片列表
3. 确保有以下元素可见：
   - 领导卡片（头像/姓名/职位/关系状态/待办数量）
   - 「+ 建立新档案」按钮
   - 至少2-3个领导档案

**截图要求：**
- 分辨率：1920x1080 或更高
- 显示网格布局的领导卡片
- 悬停在一个卡片上，显示"查看详情 →"提示

**测试数据建议：**
创建3-4个不同类型的领导档案：
- 张总（技术总监，匹配"技术转行政型领导"原型）
- 李经理（部门经理，匹配"职业经理人"原型）
- 王处长（跨部门协作，匹配"官僚型处长"原型）

### 3. 预设档案快速创建界面 (`preset-templates.png`)

**操作步骤：**
1. 在「我的领导」页面，点击「+ 建立新档案」按钮
2. 显示新建档案表单
3. 确保有以下元素可见：
   - 顶部6个预设模板卡片（2×3网格）
   - 预设卡片包含图标/名称/描述
   - 「或手动填写」分割线
   - 表单字段（姓名/职位/部门等）

**截图要求：**
- 分辨率：1920x1080 或更高
- 确保6个预设模板全部可见
- 可以悬停在某个预设卡片上显示高亮效果

**预设模板列表：**
- 👔 直属领导
- 🏢 部门负责人
- 🤝 跨部门协作者
- 💻 技术型领导
- 💰 项目赞助人
- 🔀 虚线汇报领导

### 4. 领导详情面板（可选，用于演示文档）

**操作步骤：**
1. 点击任意领导卡片
2. 弹出详情面板
3. 确保有以下元素可见：
   - 领导基本信息
   - 性格特征/行为模式/偏好/禁忌
   - AI推荐互动策略
   - 互动任务看板

## 截图工具推荐

### Windows 系统
- **Win + Shift + S**：系统自带截图工具
- **Snipping Tool**：Windows 截图工具
- **浏览器开发者工具**：F12 → Ctrl+Shift+P → "Capture full size screenshot"

### 浏览器扩展
- **GoFullPage**：完整页面截图
- **Fireshot**：网页截图工具

### 在线工具
- 访问 `https://www.awesomescreenshot.com/`

## 截图后处理

1. 将截图保存到 `screenshots/` 目录
2. 命名规范：
   - `dashboard-kanban.png` - 任务看板
   - `leader-profiles.png` - 领导档案
   - `preset-templates.png` - 预设模板
3. 优化图片大小（建议 < 500KB/张）
4. 更新 README.md 中的图片链接（如需要）

## 添加测试数据的快速方法

打开浏览器控制台（F12），运行以下代码快速添加测试数据：

```javascript
// 添加测试领导档案
const testLeaders = [
  {
    id: crypto.randomUUID(),
    name: '张总',
    title: '技术总监',
    department: '研发中心',
    archetypeId: 2,
    relationshipLevel: 'cautious',
    personalityNotes: '技术出身，40多岁，喜欢在开会时展示AI见解',
    behaviorPatterns: '喜欢看数据，开会前先问结论，不喜欢被突袭提问',
    preferences: '喜欢简洁的一页纸汇报，喜欢听到主动承担',
    avoidances: '不喜欢被公开质疑，避免提及上一任团队',
    customTraits: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: '李经理',
    title: '部门经理',
    department: '产品部',
    archetypeId: 6,
    relationshipLevel: 'normal',
    personalityNotes: '职业经理人，KPI驱动',
    behaviorPatterns: '关注季度指标，定期需要进度汇报',
    preferences: '喜欢数据支撑的结论，重视ROI',
    avoidances: '不喜欢 surprises，避免延期不报备',
    customTraits: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
localStorage.setItem('leader-network-nodes', JSON.stringify(testLeaders));

// 添加测试任务
const testTasks = [
  {
    id: crypto.randomUUID(),
    leaderId: testLeaders[0].id,
    title: 'Q2 AI项目资源申请',
    goal: 'request',
    description: '申请3名额外开发资源支持AI流程自动化项目',
    strategy: '1. 将资源需求包装为对他核心目标的支持\n2. 准备ROI数据，量化不批准的代价',
    scheduledAt: new Date(Date.now() - 86400000).toISOString(), // 昨天（逾期）
    status: 'pending',
    priority: 'high',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    leaderId: testLeaders[0].id,
    title: '4月项目进度汇报',
    goal: 'report',
    description: '汇报AI流程自动化项目第一阶段进展',
    strategy: '1. 以影响和结论开头\n2. 准备一句话摘要',
    scheduledAt: new Date(Date.now() + 3 * 86400000).toISOString(), // 3天后
    status: 'pending',
    priority: 'medium',
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    leaderId: testLeaders[1].id,
    title: '产品需求对齐会议',
    goal: 'align',
    description: '与产品部对齐Q2 AI功能需求优先级',
    strategy: '1. 先询问对方核心关切\n2. 准备2-3个可选方案',
    scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString(), // 下周
    status: 'pending',
    priority: 'low',
    createdAt: new Date().toISOString(),
  }
];
localStorage.setItem('leader-network-tasks', JSON.stringify(testTasks));

console.log('✅ 测试数据已添加，刷新页面查看效果');
location.reload();
```

## 更新 README

截图完成后，确保 README.md 中的图片路径正确：

```markdown
![任务看板](./screenshots/dashboard-kanban.png)
![领导档案](./screenshots/leader-profiles.png)
![预设模板](./screenshots/preset-templates.png)
```

## 提交截图到 Git

```bash
git add screenshots/
git commit -m "docs: 添加功能截图到 README"
git push
```
