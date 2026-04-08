import type { GridCategory } from '@/types/pet'

export type Ecosystem = 'soe' | 'private' | 'mnc' | 'tech'

export interface LeaderArchetype {
  id: number
  nameZh: string
  nameEn: string
  ecosystem: Ecosystem
  ecosystemLabel: string
  ageRange: [number, number]
  coreMotivation: string
  communicationStyle: string
  techAttitude: string
  aiAttitude: string
  aiAttitudeLevel: number // 1-5
  faceSensitivity: string
  faceSensitivityLevel: number // 1-5
  weaknesses: string[]
  strategies: string[]
  programmerLeverage: string
  programmerLeverageLevel: number // 1-5
  keywords: string[]
  emoji: string
  dramaticIntro: string
  gridCategory: GridCategory
  portraitImage: string
}

export const ECOSYSTEMS: Record<Ecosystem, { label: string; color: string }> = {
  soe: { label: '国企体系', color: 'soe' },
  private: { label: '民企体系', color: 'private' },
  mnc: { label: '外企体系', color: 'mnc' },
  tech: { label: '互联网大厂', color: 'tech' },
}

export const ARCHETYPES: LeaderArchetype[] = [
  {
    id: 1, nameZh: '官僚型处长', nameEn: 'Bureaucratic Division Chief',
    ecosystem: 'soe', ecosystemLabel: '国企体系',
    ageRange: [45, 58], emoji: '🏛️',
    coreMotivation: '稳定、向上汇报质量、零事故',
    communicationStyle: '正式、间接、重流程。偏好书面汇报，会议用于宣布决定而非讨论',
    techAttitude: '技术应该"不出事就好"，对技术细节毫无兴趣',
    aiAttitude: '谨慎型', aiAttitudeLevel: 2,
    faceSensitivity: '极高', faceSensitivityLevel: 5,
    weaknesses: ['无法验证技术复杂度', '恐惧技术事故', '完全依赖信任关系做技术判断'],
    strategies: ['汇报时强调"稳定可控"', '把请求包装成"确保上级满意"', '公开场合大力给面子', '永远不要让他在会上被突袭提问'],
    programmerLeverage: '最低', programmerLeverageLevel: 1,
    keywords: ['处长', '科长', '国企', '体制内', '编制', '流程'],
    dramaticIntro: '此乃国企经典款处长，修炼多年的面子功夫已臻化境。在他的字典里，"没有问题"才是最好的汇报。',
    gridCategory: 'system', portraitImage: '/images/portraits/soe-system.png',
  },
  {
    id: 2, nameZh: '技术转行政型领导', nameEn: 'Technical-Turned-Administrative',
    ecosystem: 'soe', ecosystemLabel: '国企体系',
    ageRange: [40, 55], emoji: '🔧',
    coreMotivation: '被认可为"懂技术的领导"',
    communicationStyle: '行政正式与技术非正式之间切换，偶尔深入代码评审以证明自己',
    techAttitude: '高估自己当前的技术相关性，坚持可能落后十年的做法',
    aiAttitude: '谨慎型', aiAttitudeLevel: 2,
    faceSensitivity: '高（尤其技术层面）', faceSensitivityLevel: 4,
    weaknesses: ['技术知识可能落后十年', '技术自尊心既是弱点也是入口'],
    strategies: ['把新技术包装成他过去工作的延伸', '偶尔请教他的"技术视角"', '永远不要直接否定他的技术建议，用"在您的基础上…"'],
    programmerLeverage: '中等', programmerLeverageLevel: 3,
    keywords: ['以前搞技术', '技术出身', '转管理'],
    dramaticIntro: '曾经也是键盘上的战士，如今虽执掌行政大权，却始终怀念那段与代码共舞的岁月。请注意：他的技术自尊是你的通关密钥。',
    gridCategory: 'crosser', portraitImage: '/images/portraits/soe-crosser.png',
  },
  {
    id: 3, nameZh: '政治型领导', nameEn: 'Political Operator',
    ecosystem: 'soe', ecosystemLabel: '国企体系',
    ageRange: [38, 52], emoji: '🎭',
    coreMotivation: '职业晋升和影响力扩张',
    communicationStyle: '高度自适应，善于说出看似有意义却不承诺的话，信息即货币',
    techAttitude: '对技术本身无兴趣，但深谙技术的政治价值',
    aiAttitude: '热情型（作为政治叙事）', aiAttitudeLevel: 4,
    faceSensitivity: '中等（战略性的）', faceSensitivityLevel: 3,
    weaknesses: ['缺乏对运营现实的深入理解', '急需能把事做成的人'],
    strategies: ['成为他的"能力保险"', '用他的政治语言包装你的工作', '帮他向上看好，他会保护你', '小心分享信息——他会战略性使用一切'],
    programmerLeverage: '最低', programmerLeverageLevel: 1,
    keywords: ['关系户', '善于经营', '会来事', '政治敏感'],
    dramaticIntro: '万花丛中过，片叶不沾身。每句话都是精心设计的棋子，每个决定都经过政治利弊计算。与他共事，你需要的不是代码能力，而是读懂空气的能力。',
    gridCategory: 'power', portraitImage: '/images/portraits/soe-power.png',
  },
  {
    id: 4, nameZh: '混日子型领导', nameEn: 'Coasting Leader',
    ecosystem: 'soe', ecosystemLabel: '国企体系',
    ageRange: [50, 60], emoji: '🍵',
    coreMotivation: '平安退休、零风险、维持现状',
    communicationStyle: '非对抗性、回避型，常委托他人处理棘手谈话',
    techAttitude: '完全无所谓，只要不出大事',
    aiAttitude: '抵触型', aiAttitudeLevel: 1,
    faceSensitivity: '低', faceSensitivityLevel: 1,
    weaknesses: ['回避创造权力真空', '不会为你出头或争取资源'],
    strategies: ['利用他缺位创造的自主空间，但建立自己的保护网', '把所有请求包装成"维持现状"', '适合试验新技术——他不会干预'],
    programmerLeverage: '最低', programmerLeverageLevel: 1,
    keywords: ['快退休了', '不管事', '随便', '你们定'],
    dramaticIntro: '一杯茶，一份报，等着退休的日子慢慢到。他不是你的对手，也不是你的盟友——他是一片你可以自由生长的荒地。但记住：当暴风雨来临时，他不会为你撑伞。',
    gridCategory: 'wildcard', portraitImage: '/images/portraits/soe-wildcard.png',
  },
  {
    id: 5, nameZh: '创始人/老板', nameEn: 'Founder-Boss',
    ecosystem: 'private', ecosystemLabel: '民企体系',
    ageRange: [35, 65], emoji: '👑',
    coreMotivation: '公司存亡=个人存亡，愿景、掌控、证明质疑者错误',
    communicationStyle: '直接、情绪化、不可预测，可能凌晨发消息推翻白天的决定',
    techAttitude: '以业务结果判断技术，不关心技术优雅',
    aiAttitude: '热情型', aiAttitudeLevel: 4,
    faceSensitivity: '中等（挑战他的商业判断最危险）', faceSensitivityLevel: 3,
    weaknesses: ['情绪化决策', '创始人偏见', '难以授权'],
    strategies: ['展示对公司使命的真诚热情', '用公司愿景包装技术决策', '用数据直接但不对抗地推回', '理解他的情绪周期'],
    programmerLeverage: '最高', programmerLeverageLevel: 5,
    keywords: ['老板', '创始人', 'CEO', '自己的公司'],
    dramaticIntro: '这家公司就是他的孩子，他的战场，他的一切。在他面前，逻辑让位于热情，流程让位于直觉。你要做的不是说服他，而是让他觉得你们在同一条船上。',
    gridCategory: 'power', portraitImage: '/images/portraits/private-power.png',
  },
  {
    id: 6, nameZh: '职业经理人', nameEn: 'Professional Manager',
    ecosystem: 'private', ecosystemLabel: '民企体系',
    ageRange: [35, 50], emoji: '📊',
    coreMotivation: '个人简历增值、KPI达成、2-3年换更大平台',
    communicationStyle: '结构化、数据驱动、PPT导向，每次沟通都是表演',
    techAttitude: '技术=达成KPI的手段，技术债是别人的问题',
    aiAttitude: '激进型', aiAttitudeLevel: 5,
    faceSensitivity: '中等', faceSensitivityLevel: 3,
    weaknesses: ['短期主义', '不承担技术债后果', '任期有限'],
    strategies: ['把一切转化为指标和ROI', '帮他积累"成就组合"', '用数据反驳不可持续的要求', '与长期留任的同事建立关系'],
    programmerLeverage: '高', programmerLeverageLevel: 4,
    keywords: ['KPI', 'OKR', '职业经理人', 'MBA'],
    dramaticIntro: '他带着MBA的光环和一套精美的PPT模板来到这里。在他眼中，你是一个产出机器，技术债是Excel表上可以被粉饰的数字。记住——他是过客，你才是主人。',
    gridCategory: 'system', portraitImage: '/images/portraits/private-system.png',
  },
  {
    id: 7, nameZh: '家族企业接班人', nameEn: 'Family Business Heir',
    ecosystem: 'private', ecosystemLabel: '民企体系',
    ageRange: [28, 45], emoji: '🎓',
    coreMotivation: '证明自己配得上这个位置，现代化家族企业',
    communicationStyle: '西式直接与中式间接之间摇摆，依赖外部顾问',
    techAttitude: '积极——技术代表"现代化"',
    aiAttitude: '热情型', aiAttitudeLevel: 4,
    faceSensitivity: '高（尤其在能力和合法性方面）', faceSensitivityLevel: 4,
    weaknesses: ['经验不足但资源丰富', '新老势力忠诚冲突', '决策需要家族审批'],
    strategies: ['成为他急需的可信赖顾问', '帮他建立合法性的可见成果', '用"现代化"包装你的技术提案', '尊重老臣同时助力革新'],
    programmerLeverage: '中等', programmerLeverageLevel: 3,
    keywords: ['接班', '二代', '家族企业', '少东家'],
    dramaticIntro: '含着金钥匙出生，留学归来意气风发，却发现老臣们的目光比代码Review还犀利。他需要一个战友——一个能帮他用技术证明"我不是靠爹"的盟友。',
    gridCategory: 'crosser', portraitImage: '/images/portraits/private-crosser.png',
  },
  {
    id: 8, nameZh: '草根创业者', nameEn: 'Grassroots Entrepreneur',
    ecosystem: 'private', ecosystemLabel: '民企体系',
    ageRange: [35, 55], emoji: '💪',
    coreMotivation: '生存、增长、忠诚至上',
    communicationStyle: '直接、非正式、微信语音消息为主，厌恶PPT和书面报告',
    techAttitude: '尊重但完全不懂，全靠信任的人做技术判断',
    aiAttitude: '务实型', aiAttitudeLevel: 3,
    faceSensitivity: '高（尤其关于学历）', faceSensitivityLevel: 4,
    weaknesses: ['过度依赖信任网络', '抵制流程和文档'],
    strategies: ['用交付赢得信任，不靠PPT', '说具体数字："省20万/年"', '忠诚且直接——他能闻到政治操弄', '逐步引入流程，包装为"保护生意"'],
    programmerLeverage: '最高', programmerLeverageLevel: 5,
    keywords: ['白手起家', '实干', '没读过什么书', '靠谱'],
    dramaticIntro: '从摆地摊到盖大楼，他靠的不是学历而是那双看透人心的眼睛。在他面前，千行PPT不如一次靠谱的交付。获得他的信任，你就获得了铁壁般的保护。',
    gridCategory: 'wildcard', portraitImage: '/images/portraits/private-wildcard.png',
  },
  {
    id: 9, nameZh: '海归型VP', nameEn: 'Returnee VP',
    ecosystem: 'mnc', ecosystemLabel: '外企体系',
    ageRange: [35, 50], emoji: '🌏',
    coreMotivation: '证明国际经验的独特价值，C-suite路径',
    communicationStyle: '中英双语切换，正式场合用英语，关系维护用中文',
    techAttitude: '尊重技术，期望国际标准（Agile、CI/CD）',
    aiAttitude: '热情型', aiAttitudeLevel: 4,
    faceSensitivity: '中等（双文化标准）', faceSensitivityLevel: 3,
    weaknesses: ['两头都不完全融入', '可能推不切实际的HQ方法论'],
    strategies: ['成为他的技术执行锚', '帮他桥接HQ方法论和本地现实', '用结构化、指标驱动的方式沟通'],
    programmerLeverage: '高', programmerLeverageLevel: 4,
    keywords: ['海归', '留学', 'VP', '国际化'],
    dramaticIntro: '在硅谷镀过金，在陆家嘴扎过根。他是两个世界之间的桥梁，也是两个世界之间的夹心饼干。帮他做好这座桥，你就站在了桥的最佳位置。',
    gridCategory: 'crosser', portraitImage: '/images/portraits/mnc-crosser.png',
  },
  {
    id: 10, nameZh: '外籍高管', nameEn: 'Expat Executive',
    ecosystem: 'mnc', ecosystemLabel: '外企体系',
    ageRange: [40, 55], emoji: '🗺️',
    coreMotivation: 'HQ指标、轮岗履历上的中国经验',
    communicationStyle: '西方标准：直接、会议密集、邮件导向',
    techAttitude: '期望全球标准和流程',
    aiAttitude: '务实型', aiAttitudeLevel: 3,
    faceSensitivity: '低（按中国标准）', faceSensitivityLevel: 2,
    weaknesses: ['文化盲区严重', '过度信任帮他导航的人'],
    strategies: ['成为他需要的"文化翻译"', '用英语和结构化指标沟通', '帮他避免文化地雷'],
    programmerLeverage: '中等', programmerLeverageLevel: 3,
    keywords: ['老外', '外籍', 'expat', '不懂中文'],
    dramaticIntro: '他带着一份全球模板和满腔"China is fascinating"的热情降落在这里。看不懂微信群里的暗流涌动，读不懂会议室里的欲言又止。谁能做他的解码器，谁就握住了通向核心圈子的钥匙。',
    gridCategory: 'wildcard', portraitImage: '/images/portraits/mnc-wildcard.png',
  },
  {
    id: 11, nameZh: '本土化高管', nameEn: 'Localized Executive',
    ecosystem: 'mnc', ecosystemLabel: '外企体系',
    ageRange: [40, 55], emoji: '🎯',
    coreMotivation: '在MNC中不可替代——让中国业务离不开自己',
    communicationStyle: '完美双语，按受众精准切换风格',
    techAttitude: '务实——技术必须同时服务总部标准和中国市场',
    aiAttitude: '务实型（战略性采纳）', aiAttitudeLevel: 3,
    faceSensitivity: '高（双重体系下都高）', faceSensitivityLevel: 4,
    weaknesses: ['可能为保护组织牺牲个人', '最精明的领导类型'],
    strategies: ['深化让本地运营不可替代的技术护城河', '帮他构建"中国特殊论"叙事', '不要成为可有可无的人'],
    programmerLeverage: '中等', programmerLeverageLevel: 3,
    keywords: ['外企老人', '本土化', '双语', 'bridge'],
    dramaticIntro: '他是MNC体系里进化最完美的物种——在总部会议上谈数据，在本地饭局上拼酒量。不要低估他，这可能是你遇到的最难对付也最值得追随的领导类型。',
    gridCategory: 'power', portraitImage: '/images/portraits/mnc-power.png',
  },
  {
    id: 12, nameZh: '矩阵型汇报线领导', nameEn: 'Matrix Reporting Leader',
    ecosystem: 'mnc', ecosystemLabel: '外企体系',
    ageRange: [35, 50], emoji: '🔀',
    coreMotivation: '让所有老板同时满意',
    communicationStyle: '外交型、共识导向、文档为证',
    techAttitude: '取所有利益相关者要求的交集',
    aiAttitude: '谨慎型', aiAttitudeLevel: 2,
    faceSensitivity: '中等（多方面分散）', faceSensitivityLevel: 3,
    weaknesses: ['决策缓慢', '回避可能引起冲突的技术选择'],
    strategies: ['你的请求必须能服务所有利益相关者', '帮他建共识："我已经和XX对齐过了"', '不要逼他在冲突中选边'],
    programmerLeverage: '中等', programmerLeverageLevel: 3,
    keywords: ['矩阵', '双线汇报', 'dotted line', 'solid line'],
    dramaticIntro: '三个老板，五条汇报线，每天在对齐中度过。他不是在做决定，而是在找到让所有人都不反对的方案。在他手下工作，耐心是你最重要的装备。',
    gridCategory: 'system', portraitImage: '/images/portraits/mnc-system.png',
  },
  {
    id: 13, nameZh: '技术VP/CTO', nameEn: 'Tech Executive',
    ecosystem: 'tech', ecosystemLabel: '互联网大厂',
    ageRange: [35, 50], emoji: '⚡',
    coreMotivation: '技术影响力和架构控制权',
    communicationStyle: '技术化、直接、反官僚，可能通过Code Review沟通',
    techAttitude: '深入、固执、可能微管理架构决策',
    aiAttitude: '激进型', aiAttitudeLevel: 5,
    faceSensitivity: '低（社交面子低，技术声誉极高）', faceSensitivityLevel: 2,
    weaknesses: ['技术声誉是唯一软肋', '可能因技术偏好而决策失衡'],
    strategies: ['用技术卓越赢得尊重——这是唯一货币', '用数据和原型挑战他的想法', '展示AI采纳的主动性', '准备充分的技术异议能赢得尊重'],
    programmerLeverage: '最高', programmerLeverageLevel: 5,
    keywords: ['CTO', '技术VP', '架构', '技术驱动'],
    dramaticIntro: '从IC一路杀到C-level，他的GitHub还在保持绿色。在他面前，PPT是垃圾，Working Code是圣经。你的代码质量就是你的名片，你的架构理解就是你的通行证。',
    gridCategory: 'power', portraitImage: '/images/portraits/tech-power.png',
  },
  {
    id: 14, nameZh: '产品型领导', nameEn: 'Product Leader',
    ecosystem: 'tech', ecosystemLabel: '互联网大厂',
    ageRange: [30, 45], emoji: '📱',
    coreMotivation: '产品指标——DAU、留存、转化',
    communicationStyle: '围绕Sprint和路线图，频繁Demo和状态更新',
    techAttitude: '重交付速度轻技术质量，技术债是明天的事',
    aiAttitude: '热情型', aiAttitudeLevel: 4,
    faceSensitivity: '低', faceSensitivityLevel: 2,
    weaknesses: ['为了季度数据牺牲技术质量', '可能在不了解复杂度的情况下承诺AI功能'],
    strategies: ['用产品影响力翻译技术工作："重构让功能上线快30%"', '推回排期时提议缩减范围而非延长时间', '帮他理解AI的真实成本'],
    programmerLeverage: '最高', programmerLeverageLevel: 5,
    keywords: ['产品', 'PM', 'DAU', 'sprint', '迭代'],
    dramaticIntro: '他的脑子里装着一个永远在倒计时的Sprint看板。对他来说，完美的代码不如按时上线的代码，99%的测试覆盖率不如1%的DAU增长。学会用他的语言——数据——来争取你需要的东西。',
    gridCategory: 'system', portraitImage: '/images/portraits/tech-system.png',
  },
  {
    id: 15, nameZh: '空降型高管', nameEn: 'Parachuted Executive',
    ecosystem: 'tech', ecosystemLabel: '互联网大厂',
    ageRange: [35, 50], emoji: '🪂',
    coreMotivation: '两个季度内制造可见成果',
    communicationStyle: '变革导向、愿景驱动，"在我前公司…"是口头禅',
    techAttitude: '倾向导入前公司的技术栈和实践',
    aiAttitude: '热情型', aiAttitudeLevel: 4,
    faceSensitivity: '中等', faceSensitivityLevel: 3,
    weaknesses: ['忽视历史背景', '为变革而变革', '有12-18个月蜜月期'],
    strategies: ['早期识别他的变革议程并对齐', '把可行性评估包装为"如何实现您的愿景"', '保护关键系统免受破坏性变革', '成为早期支持者获得有利位置'],
    programmerLeverage: '高', programmerLeverageLevel: 4,
    keywords: ['空降', '新来的', '在XX的时候', '新官上任'],
    dramaticIntro: '带着前东家的荣光和一套"已被证明的方法论"从天而降。他急需证明自己的价值，而你的代码库是他的实验田。在他翻地之前，确保你的根扎得够深。',
    gridCategory: 'crosser', portraitImage: '/images/portraits/tech-crosser.png',
  },
  {
    id: 16, nameZh: '内卷推动者', nameEn: 'Involution Driver',
    ecosystem: 'tech', ecosystemLabel: '互联网大厂',
    ageRange: [30, 45], emoji: '🔥',
    coreMotivation: '产出量、可见活动、团队利用率指标',
    communicationStyle: '高频、高紧迫感、周末消息、"什么时候能完？"',
    techAttitude: '可见产出 > 一切，bug多但上线快 > 完美但慢',
    aiAttitude: '激进型', aiAttitudeLevel: 5,
    faceSensitivity: '低', faceSensitivityLevel: 2,
    weaknesses: ['质量指标是他的盲区', '燃烧团队导致人才流失'],
    strategies: ['可见地使用AI展示生产力', '用选择题代替开放题："做A还是B？"', '记录一切——高压环境甩锅概率极高', '准备退出策略——这种模式必然导致burnout'],
    programmerLeverage: '最低', programmerLeverageLevel: 1,
    keywords: ['996', '卷', '又加班', '什么时候能完'],
    dramaticIntro: '他是内卷的化身，996的代言人。在他的字典里，"高效"意味着更多加班，"优化"意味着砍人。面对他，你的AI武器不是用来写代码的——是用来保命的。',
    gridCategory: 'wildcard', portraitImage: '/images/portraits/tech-wildcard.png',
  },
]

export function matchArchetypes(
  orgType?: Ecosystem,
  keywords?: string[],
  leaderAge?: number
): { archetype: LeaderArchetype; score: number }[] {
  const results: { archetype: LeaderArchetype; score: number }[] = []

  for (const archetype of ARCHETYPES) {
    let score = 0

    if (orgType && archetype.ecosystem === orgType) {
      score += 0.4
    }

    if (keywords && keywords.length > 0) {
      const matched = keywords.filter(kw =>
        archetype.keywords.some(ak => ak.includes(kw) || kw.includes(ak))
      ).length
      if (matched > 0) {
        score += Math.min(0.4, matched * 0.15)
      }
      const textMatch = keywords.filter(kw =>
        archetype.nameZh.includes(kw) || archetype.coreMotivation.includes(kw)
      ).length
      if (textMatch > 0) {
        score += Math.min(0.2, textMatch * 0.1)
      }
    }

    if (leaderAge) {
      const [low, high] = archetype.ageRange
      if (leaderAge >= low && leaderAge <= high) {
        score += 0.2
      } else if (Math.abs(leaderAge - low) <= 5 || Math.abs(leaderAge - high) <= 5) {
        score += 0.1
      }
    }

    if (score > 0) {
      results.push({ archetype, score: Math.round(score * 100) })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results
}
