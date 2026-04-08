import { useState } from 'react'
import { ARCHETYPES, ECOSYSTEMS, type Ecosystem, type LeaderArchetype } from '@/data/archetypes'

const COMM_SCENARIOS = [
  { id: 'delay', label: '汇报项目延期', icon: '⏰' },
  { id: 'resource', label: '争取资源/HC', icon: '👥' },
  { id: 'promotion', label: '谈晋升/加薪', icon: '💰' },
  { id: 'pushback', label: '推回不合理需求', icon: '🛡️' },
  { id: 'bad-news', label: '传递坏消息', icon: '⚠️' },
  { id: 'credit', label: '展示工作成果', icon: '🏆' },
  { id: 'ai-threat', label: 'AI替代威胁应对', icon: '🤖' },
  { id: 'onboard', label: '向新领导自我介绍', icon: '🤝' },
] as const

type CommScenario = typeof COMM_SCENARIOS[number]['id']

function generateDraft(archetype: LeaderArchetype, scenario: CommScenario): { subject: string; body: string; annotations: string[] } {
  const templates: Record<CommScenario, (a: LeaderArchetype) => { subject: string; body: string; annotations: string[] }> = {
    'delay': (a) => ({
      subject: `关于XX项目进展情况的汇报`,
      body: a.ecosystem === 'soe'
        ? `${a.nameZh.includes('处长') ? '处长' : '领导'}好，\n\n关于XX项目，向您汇报一个情况。目前核心功能模块开发进展顺利，整体进度可控。在第三方接口对接环节，我们发现对方的技术规范与实际接口存在差异，需要额外两周完成联调验证。\n\n为确保交付质量达到上级检查标准，建议两个方案供您决策：\n方案一：核心功能按原计划上线，接口功能两周后通过版本更新补充；\n方案二：整体延后两周，一次性完整交付。\n\n两个方案的技术风险已充分评估，均在可控范围内。请您指示。`
        : a.ecosystem === 'tech'
        ? `Hi ${a.nameZh.includes('CTO') || a.nameZh.includes('VP') ? 'Boss' : 'Leader'},\n\nXX项目进度更新：核心功能on track。遇到一个blocker——第三方API文档和实际接口不一致，需要额外2周联调。\n\n两个option：\n1. 核心功能按时ship，API集成下个sprint补上\n2. 整体delay 2周，一次交付\n\n我倾向Option 1（用户核心路径不受影响）。你的preference？`
        : `老板/领导好，\n\nXX项目有个情况需要同步。核心功能正常，但第三方对接比预期复杂，需要多两周。\n\n给您两个选择：\nA) 先上核心功能（按时），其他两周后补上\nB) 推迟两周完整交付\n\n从业务影响看，方案A风险更小。您看怎么定？`,
      annotations: [
        `【开头策略】${a.faceSensitivityLevel >= 4 ? '先铺垫"进展顺利"再引出问题，保护领导的信心面子' : '直接切入主题，不浪费时间'} — 适配${a.nameZh}的沟通偏好`,
        `【框架策略】提供选项而非问题 — 让领导做"选择题"而非"问答题"，降低决策负担`,
        `【收尾策略】${a.ecosystem === 'soe' ? '用"请您指示"表达尊重' : a.ecosystem === 'tech' ? '主动表达倾向，减少沟通轮次' : '简洁收尾，尊重对方时间'}`
      ]
    }),
    'resource': (a) => ({
      subject: '关于团队资源配置的建议',
      body: a.faceSensitivityLevel >= 4
        ? `领导好，\n\n想跟您汇报一下团队目前的工作负荷情况。当前三个人同时支撑A、B、C三个系统，日常运维占了60%精力，新需求排期已到下季度。\n\n上周B系统出了一次小故障，幸好及时发现。但坦率讲，以目前配置，类似风险会持续存在。\n\n如果能增加一个人，计划让新人专责B系统运维，现有团队集中保障A系统升级（这也是上面一直在推的重点项目）。\n\n需要我准备一份详细的岗位需求和人力规划供您审批吗？`
        : `领导好，\n\n团队现状：3人支撑3个系统，运维占60%，新需求排到下季度。\n\n风险：上周B系统出过一次故障，人力不足时这种风险会持续。\n\n建议：加1人专责B系统运维 → 现有团队释放产能聚焦A系统升级（ROI最高的投入）。\n\n可以的话，我准备详细方案给您。`,
      annotations: [
        `【数据先行】用具体数字（60%、3个系统）建立事实基础，而非抽象抱怨`,
        `【风险触发】${a.faceSensitivityLevel >= 4 ? '用已发生的故障作为风险证据，触发领导的风险厌恶本能' : '简洁列出风险点'}`,
        `【收益绑定】把新增人力与领导关心的项目（上面在推的）绑定，让"花钱"变成"投资"`
      ]
    }),
    'promotion': (a) => ({
      subject: '关于职业发展的沟通',
      body: `领导好，\n\n想找个时间跟您聊聊我的职业发展。\n\n过去一年，我主导了XX系统重构（可用性从99.5%提升至99.95%），同时带了两位新人完成独立交付能力培养。\n\n对照${a.ecosystem === 'tech' ? '公司晋升标准' : '岗位要求'}，我认为在技术深度、项目影响力和团队贡献三个维度已经达到下一级要求。\n\n想请教两个问题：\n1. 从您的角度看，我还有哪些方面需要加强？\n2. ${a.ecosystem === 'soe' ? '下一个考评周期' : '下个晋升窗口'}，您觉得我应该怎么准备？\n\n如果您认可的话，希望能得到您的${a.ecosystem === 'soe' ? '推荐' : '提名'}支持。`,
      annotations: [
        `【成就锚定】先摆事实和数据，建立"我配得上"的前提`,
        `【姿态设计】用"请教"而非"要求"的姿态 — ${a.faceSensitivityLevel >= 4 ? '给足领导的主导感和面子' : '既表达诉求又保持专业'}`,
        `【双向请求】请求反馈+请求支持，让领导参与到你的晋升过程中，变成"我们一起推动"而非"我单方面要求"`
      ]
    }),
    'pushback': (a) => ({
      subject: '关于需求优先级的讨论',
      body: a.ecosystem === 'tech'
        ? `领导好，\n\n这个需求我看了，技术上可以做，但当前sprint已经满了。\n\n如果加入这个需求，有两种方案：\nA) 砍掉当前sprint的XX功能，空出排期\nB) 放到下个sprint（2周后启动）\n\n哪个优先级更高，您来定？`
        : `领导好，\n\n新需求已经评估过了，技术方案可行。\n\n不过目前团队在并行推进的项目已经排满。如果加入这个需求，需要在以下选项中做取舍：\nA) 暂停XX项目，优先新需求\nB) 新需求排入下一周期\nC) 两个都做，但需要增加一个临时支援\n\n您看哪个方案更合适？`,
      annotations: [
        `【不说"不"】从不直接拒绝，而是把选择权交给领导 — 让他们感受到的是"选择"而非"被拒绝"`,
        `【资源可视化】让领导直观看到资源限制，用事实而非态度来推回`,
        `【${a.ecosystem === 'tech' ? '直接高效的风格匹配技术领导偏好' : '恭敬但坚定，用选项框定可能性'}】`
      ]
    }),
    'bad-news': (a) => ({
      subject: '紧急情况通报',
      body: `领导好，\n\n有一个紧急情况需要立即同步：${a.ecosystem === 'tech' ? 'XX服务出现性能问题' : 'XX系统出现异常情况'}。\n\n【现状】问题已定位，影响范围已控制，预计X小时内修复。\n【原因】初步判断是第三方服务变更导致，正在确认细节。\n【已采取措施】\n1. 已启动应急预案，核心功能不受影响\n2. 团队正在全力修复\n3. X小时后出修复报告\n\n后续我会每小时更新一次进展。如有任何指示请随时告知。`,
      annotations: [
        `【结论先行】先说"已控制"，再说细节 — ${a.faceSensitivityLevel >= 4 ? '第一句话就缓解领导的焦虑，保护他面对上级时的底气' : '节省领导时间，直达重点'}`,
        `【行动导向】不纠结于解释原因，而是展示"我已经在处理了" — 这才是领导真正想听的`,
        `【节奏感】承诺定期更新 — 让领导有掌控感，避免他因信息真空而焦虑催促`
      ]
    }),
    'credit': (a) => ({
      subject: 'XX项目成果总结',
      body: `领导好，\n\n${a.ecosystem === 'soe' ? '在您的指导下，' : ''}XX项目已顺利完成${a.ecosystem === 'soe' ? '，向您汇报成果' : '，总结如下'}：\n\n【核心成果】\n• 系统性能提升40%，用户体验评分从3.2提至4.5\n• 自动化率从30%提升至75%，每月节省人工XX小时\n• 项目按时交付，零生产事故\n\n【技术亮点】\n• 采用了XX架构方案，为后续扩展奠定基础\n• 引入AI辅助测试，质量保障效率翻倍\n\n${a.ecosystem === 'soe' ? '以上成果离不开您的关键决策和支持。' : ''}如果方便，建议在${a.ecosystem === 'soe' ? '部门会议' : '团队周会'}上做一次简要分享，也为后续类似项目积累经验。`,
      annotations: [
        `【${a.ecosystem === 'soe' ? '归功策略：开头和结尾都把功劳归给领导的"指导"，这不是谄媚而是面子经济的投资' : '数据为王：用量化成果说话，让数字替你邀功'}】`,
        `【展示策略】主动提出分享 — 创造一个公开展示的场合，让更多人知道你的贡献`,
        `【技术品牌】专门列出技术亮点，为你的专业声誉添砖加瓦`
      ]
    }),
    'ai-threat': (_a) => ({
      subject: 'AI工具集成方案建议',
      body: `领导好，\n\n关于AI工具在团队中的应用，我做了一些研究和实验，分享几个发现：\n\n【已验证的价值】\n• 代码Review辅助：Review效率提升60%，发现了人工容易遗漏的3类问题\n• 自动化测试生成：常规测试用例生成速度提升5倍\n• 文档生成：API文档从手写3天缩短到半天\n\n【关键发现】\nAI在重复性工作上表现出色，但在需要业务理解、架构判断和跨系统协调的工作上仍需人工主导。我们团队的核心价值恰好在后者。\n\n【建议方案】\n让AI接管重复性工作，团队聚焦复杂度更高的架构和业务问题。\n效果预测：团队产出提升50-80%，同时覆盖更多关键场景。\n\n如果您认可这个方向，我可以在两周内出一个详细的集成方案。`,
      annotations: [
        `【定位策略】将自己定位为AI应用专家，而非AI的受害者 — 这是AI时代程序员的核心生存策略`,
        `【增强叙事】刻意强调"AI做不到的"与"团队核心价值"的重合 — 构建团队不可替代性`,
        `【主动出击】不等领导提出AI替代，而是主动提出AI增强 — 掌握叙事主动权`
      ]
    }),
    'onboard': (a) => ({
      subject: '技术体系概况介绍',
      body: `领导好，欢迎加入！\n\n我是XX团队的${a.ecosystem === 'tech' ? '高级工程师' : '技术骨干'}，负责XX系统的架构和核心模块开发。\n\n为了帮您快速了解技术全貌，我准备了以下材料：\n1. 系统架构全景图（一页纸版本）\n2. 当前在推项目的进展和风险清单\n3. 技术债务和优化机会的优先级清单\n\n如果方便，希望能约一个30分钟的1对1，当面跟您介绍。同时也想了解一下您的工作重点和偏好的沟通方式，以便更好地配合。\n\n期待合作！`,
      annotations: [
        `【价值先行】不是去"汇报"，而是去"提供价值" — 带着有用的信息去建立第一印象`,
        `【准备周到】准备好了具体材料 — 展示你的专业性和靠谱度`,
        `【双向沟通】不仅给信息，还主动问领导的偏好 — 展示向上管理的意识`
      ]
    }),
  }

  const gen = templates[scenario]
  return gen ? gen(archetype) : { subject: '沟通主题', body: '请选择具体场景', annotations: [] }
}

export default function CommunicationDrafter() {
  const [selectedEco, setSelectedEco] = useState<Ecosystem | null>(null)
  const [selectedArchetype, setSelectedArchetype] = useState<LeaderArchetype | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<CommScenario | null>(null)
  const [draft, setDraft] = useState<{ subject: string; body: string; annotations: string[] } | null>(null)

  const filteredArchetypes = selectedEco
    ? ARCHETYPES.filter(a => a.ecosystem === selectedEco)
    : ARCHETYPES

  function handleGenerate() {
    if (!selectedArchetype || !selectedScenario) return
    setDraft(generateDraft(selectedArchetype, selectedScenario))
  }

  function handleCopy() {
    if (!draft) return
    navigator.clipboard.writeText(`主题：${draft.subject}\n\n${draft.body}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">
          <span className="text-gradient-gold">沟通起草</span>
          <span className="text-gradient-cyber">助手</span>
        </h2>
        <p className="text-sm text-muted-foreground">选择领导类型和沟通场景，生成量身定制的沟通话术</p>
      </div>

      {/* Step 1: Leader Type */}
      <div className="card-dramatic rounded-lg p-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">第一步：选择领导类型</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['soe', 'private', 'mnc', 'tech'] as Ecosystem[]).map(eco => (
              <button
                key={eco}
                onClick={() => { setSelectedEco(selectedEco === eco ? null : eco); setSelectedArchetype(null); setDraft(null) }}
                className={`ecosystem-badge ${ECOSYSTEMS[eco].color} cursor-pointer transition-all ${
                  selectedEco === eco ? 'ring-1 ring-current scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {ECOSYSTEMS[eco].label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredArchetypes.map(a => (
              <button
                key={a.id}
                onClick={() => { setSelectedArchetype(a); setDraft(null) }}
                className={`text-left p-2.5 rounded-md border text-sm transition-all cursor-pointer ${
                  selectedArchetype?.id === a.id
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border hover:border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="mr-1.5">{a.emoji}</span>
                <span className="text-xs">{a.nameZh}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Scenario */}
      {selectedArchetype && (
        <div className="card-dramatic rounded-lg p-5 space-y-4 animate-fade-in">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">第二步：选择沟通场景</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {COMM_SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedScenario(s.id); setDraft(null) }}
                className={`text-left p-2.5 rounded-md border text-sm transition-all cursor-pointer ${
                  selectedScenario === s.id
                    ? 'border-accent bg-accent/5 text-foreground'
                    : 'border-border hover:border-border/80 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="mr-1.5">{s.icon}</span>
                <span className="text-xs">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      {selectedArchetype && selectedScenario && !draft && (
        <div className="flex justify-center animate-fade-in">
          <button onClick={handleGenerate} className="btn-gold text-base px-8 py-3">
            ⚡ 生成定制话术
          </button>
        </div>
      )}

      {/* Draft Output */}
      {draft && (
        <div className="animate-slide-up space-y-4">
          <div className="glow-line" />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              为 <span className="text-primary font-semibold">{selectedArchetype?.emoji} {selectedArchetype?.nameZh}</span> 定制的沟通方案
            </p>
            <button onClick={handleCopy} className="btn-cyber text-xs">
              📋 复制文本
            </button>
          </div>

          <div className="card-dramatic rounded-lg p-5 space-y-3">
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-1">主题</p>
              <p className="text-foreground font-semibold">{draft.subject}</p>
            </div>
            <div className="glow-line" />
            <div>
              <p className="text-[0.625rem] uppercase tracking-wider text-muted-foreground mb-2">正文</p>
              <div className="bg-background/50 rounded-md p-4 border border-border">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{draft.body}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">策略注解</p>
            {draft.annotations.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-primary shrink-0 mt-0.5">💡</span>
                <p className="text-secondary-foreground">{a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}