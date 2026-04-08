export interface Scenario {
  id: number
  title: string
  subtitle: string
  icon: string
  description: string
  stakeholders: string
  riskLevel: 'low' | 'medium' | 'high'
  strategies: {
    name: string
    risk: string
    description: string
    dialogue: string
  }[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1, title: '领导让你做非技术工作', subtitle: '边界谈判', icon: '📋',
    description: '领导安排你做PPT、写报告、组织活动等非技术工作。你想专注技术成长，但拒绝可能被贴上"不配合"的标签。',
    stakeholders: '你（技术成长） / 领导（需要靠谱的人） / 同事（观察你是否成为"杂务专员"）',
    riskLevel: 'medium',
    strategies: [
      { name: '策略性接受', risk: '低风险', description: '接受任务但创造系统化方案，防止重复指派', dialogue: '"领导好，这个我来处理。我顺便整理一套模板，以后类似的事情团队任何人都能快速产出，您看可以吗？"' },
      { name: '价值重定向', risk: '中风险', description: '表达意愿但引导到你能创造更大价值的方向', dialogue: '"我可以提供所有技术数据和内容支撑。设计排版方面，XX同事更专业，我们配合效率会更高。"' },
      { name: '边界设定', risk: '较高风险', description: '用项目冲突迫使领导做取舍', dialogue: '"我目前XX项目满负荷。如果接这个，项目会延期X天。您希望我怎么排优先级？"' },
    ]
  },
  {
    id: 2, title: '领导要用AI替代团队成员', subtitle: '核心危机', icon: '🤖',
    description: '领导要求你评估用AI工具替代2-3个同事的可能性。这是AI时代的终极政治地雷——做好了证明团队可裁，做差了自己也保不住。',
    stakeholders: '领导（降本汇报） / 你（可能成为下一个被替代的） / 同事（工作受威胁） / 领导的上级（效率叙事）',
    riskLevel: 'high',
    strategies: [
      { name: 'AI冠军重构法（推荐）', risk: '低风险', description: '热情拥抱AI，但把"替代"重构为"增强"', dialogue: '"AI确实能自动化约40%的重复工作。但有意思的是，剩下60%恰好是最容易出事故的复杂场景。我建议让AI接管重复性工作，团队专攻复杂场景——产出翻倍，而且\'让团队效率翻倍\'比\'裁了三个人\'更能展示技术领导力。"' },
      { name: '数据驱动延缓法', risk: '中风险', description: '以专业评估为由争取缓冲时间', dialogue: '"好主意。让我做一个4-6周的严谨评估，对比AI工具和我们实际工作负荷，出一份可以向上汇报的数据报告。"' },
      { name: '范围扩张法', risk: '中风险', description: '把"缩减"叙事转为"扩张"叙事', dialogue: '"如果集成AI，我们可以承接3倍的工作量。与其减人，不如拿下XX项目——不用增加HC就能扩大版图。"' },
    ]
  },
  {
    id: 3, title: '汇报项目延期', subtitle: '坏消息管理', icon: '⏰',
    description: '项目铁定要延期了。怎么说这个消息，决定了你被视为"负责的专业人士"还是"无能的失败者"。',
    stakeholders: '你（声誉） / 领导（对上交代） / 团队（连带影响） / 客户/用户（期望管理）',
    riskLevel: 'medium',
    strategies: [
      { name: '早期预警法', risk: '低风险', description: '越早说越好，带着解决方案而不是借口', dialogue: '"领导，XX项目有一个情况需要同步。核心功能正常推进，但第三方接口对接比预期复杂。我准备了两个方案：A) 核心功能按时上线，其余两周后补上；B) 整体延期两周一次性交付。您倾向哪个？"' },
      { name: '主动重构法', risk: '低风险', description: '在延期暴露之前主动提出分期交付', dialogue: '"基于进展，我建议拆分为Phase 1（核心功能，按时）和Phase 2（完整功能，延后两周）。这样确保按时交付价值。"' },
    ]
  },
  {
    id: 4, title: '争取资源/HC', subtitle: '资源博弈', icon: '👥',
    description: '团队人手不够，需要加人或加资源，但领导对成本敏感。如何让"花钱"变成"投资"？',
    stakeholders: '你（工作负荷） / 领导（预算压力） / 团队（超负荷运转） / 业务方（需求堆积）',
    riskLevel: 'medium',
    strategies: [
      { name: '商业价值法', risk: '低风险', description: '把资源需求包装为投资回报', dialogue: '"增加一个高级工程师，XX项目能提前6周交付。市场窗口在Q3关闭，这是ROI最高的投入。"' },
      { name: '风险缓释法', risk: '低风险', description: '用风险语言触发领导的危机意识', dialogue: '"目前XX系统的Bus Factor是1——如果我出问题，没人能维护。加一个人是业务连续性保障。"' },
    ]
  },
  {
    id: 5, title: '薪资/晋升谈判', subtitle: '利益博弈', icon: '💰',
    description: '你觉得自己的贡献配得上更高的薪资或更高的级别，但不知道怎么开口，也担心适得其反。',
    stakeholders: '你（收入和职级） / 领导（团队预算和稳定） / HR（薪酬体系） / 潜在竞争者',
    riskLevel: 'high',
    strategies: [
      { name: '成就锚定法', risk: '低风险', description: '在重大交付后切入，以价值为锚', dialogue: '"过去一年我主导了XX重构，可用性从99.5%提到99.95%。我对照晋升标准，认为已达到下一级要求。您觉得我还需要在哪些方面补强？希望下个窗口期能得到您的提名。"' },
      { name: '市场参照法', risk: '中风险', description: '用外部薪资数据作为参照系', dialogue: '"最近有猎头接触，我没有在看机会。但这让我意识到我的薪资可能低于市场水平。能否讨论一下调整的可能性？"' },
    ]
  },
  {
    id: 6, title: '领导抢功', subtitle: '信用管理', icon: '🏆',
    description: '你辛苦完成的项目，汇报时领导把功劳全揽了。直接对抗太危险，默默接受太憋屈。',
    stakeholders: '你（工作认可） / 领导（业绩展示） / 关键观众（高层/跨部门）',
    riskLevel: 'medium',
    strategies: [
      { name: '战略性接受', risk: '低风险', description: '让领导拿面子，但通过非正式渠道确保真相传播', dialogue: '（对其他关键人物）"听说领导的汇报反响很好。我很高兴能提供全部的技术方案和实现——效果能落地我就满足了。"' },
      { name: '痕迹工程法', risk: '低风险', description: '创造可见的贡献记录：邮件总结、技术博客、团队分享', dialogue: '主动发送项目总结邮件，在技术周报里记录你的核心贡献，做一次技术分享。这些记录比任何一次汇报都持久。' },
    ]
  },
  {
    id: 7, title: '多线领导之间周旋', subtitle: '多头博弈', icon: '🔄',
    description: '你同时向两个或多个领导汇报，他们的优先级互相冲突。做了A的事，B就不满意。',
    stakeholders: '你（被夹在中间） / 领导A（优先级X） / 领导B（优先级Y）',
    riskLevel: 'high',
    strategies: [
      { name: '透明桥梁法', risk: '中风险', description: '主动暴露冲突，引导领导们对齐', dialogue: '"我想确保和您以及XX领导的方向一致。目前您的优先级是X，他那边是Y。这是我建议的精力分配——您看是否合适？"' },
      { name: '升级触发法', risk: '较高风险', description: '当冲突无法调和时，礼貌地把球踢回领导层', dialogue: '"我收到了不同方向的优先级指引。为了不做错误判断，能否三方一起对齐一下？"' },
    ]
  },
  {
    id: 8, title: '新领导到任建立关系', subtitle: '关系重启', icon: '🤝',
    description: '新领导上任，一切关系从零开始。前任领导的关系资产全部清零，你需要快速建立信任。',
    stakeholders: '你（重新定位） / 新领导（了解情况） / 前任领导的"嫡系"（可能失势）',
    riskLevel: 'medium',
    strategies: [
      { name: '主动简报法', risk: '低风险', description: '请求早期1对1，提供有价值的信息', dialogue: '"领导好，我想给您做一个技术体系和当前项目的概览，帮您快速了解全貌。也想请教一下您的工作重点和偏好的沟通方式。"' },
    ]
  },
  {
    id: 9, title: '绩效评审准备', subtitle: '年终决战', icon: '📝',
    description: '年度绩效评估来了。这不是一场考试，而是一场提前4-6周就该开始准备的战役。',
    stakeholders: '你（评级和奖金） / 领导（打分权） / HR（制度执行） / 同级竞争者',
    riskLevel: 'medium',
    strategies: [
      { name: '预评审战役法', risk: '低风险', description: '提前6周开始系统性准备', dialogue: '1) 整理带数据的成绩单；2) 收集利益相关者的书面好评；3) 非正式预沟通："想确认我们对今年表现的看法一致"；4) 准备对潜在批评的反驳；5) 带着明年的成长计划进入评审。' },
    ]
  },
  {
    id: 10, title: '被要求评价同事', subtitle: '信任测试', icon: '🎯',
    description: '领导问你对某个同事的看法。这既是信任测试，也是政治陷阱——说多了得罪同事，说少了辜负信任。',
    stakeholders: '你（信任度和人品评价） / 领导（已有倾向，想找确认） / 被评价同事（可能知道你说了什么）',
    riskLevel: 'high',
    strategies: [
      { name: '平衡外交法', risk: '低风险', description: '给出真实但建设性的评价，永远不要踩人', dialogue: '"张工的技术功底很扎实，特别是在XX方面。我觉得如果能在YY方面再多积累，他的成长空间会很大。我们在团队里其实很互补。"' },
    ]
  },
]