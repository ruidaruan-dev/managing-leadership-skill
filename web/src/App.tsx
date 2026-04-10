import { useState, useEffect } from 'react'
import LeaderProfiler from '@/components/LeaderProfiler'
import ScenarioAnalyzer from '@/components/ScenarioAnalyzer'
import CommunicationDrafter from '@/components/CommunicationDrafter'
import PetSystem from '@/components/PetSystem'
import RelationshipNetwork from '@/components/RelationshipNetwork'
import { useLeaderNetwork } from '@/hooks/useLeaderNetwork'

type Tab = 'profiler' | 'scenario' | 'drafter' | 'pet' | 'network'

// 跨模块上下文：用于模块间传递状态
export interface CrossModuleContext {
  // 从关系网络跳转到沟通起草的上下文
  draftContext?: {
    archetypeId: number
    leaderName: string
    scenarioId?: string // CommunicationDrafter的场景ID
  }
  // 从领导画像跳转到关系网络的上下文
  preselectedArchetypeId?: number
}

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: 'network',   label: '关系网络', icon: '🗂️', desc: '人员关系管理' },
  { id: 'profiler',  label: '领导画像', icon: '🎭', desc: '4×4原型矩阵' },
  { id: 'scenario',  label: '场景分析', icon: '⚔️', desc: '10大职场困境策略' },
  { id: 'drafter',   label: '沟通起草', icon: '✍️', desc: '定制化话术生成' },
  { id: 'pet',       label: '养宠物',   icon: '🐾', desc: '驯化你的领导灵宠' },
]

export default function App() {
  // Tab状态持久化到localStorage
  const [activeTab, setActiveTabState] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('app-active-tab') as Tab) || 'network'
    }
    return 'network'
  })
  const [petPreSelectedId, setPetPreSelectedId] = useState<number | null>(null)
  const [crossContext, setCrossContext] = useState<CrossModuleContext>({})

  // 切换Tab时保存到localStorage
  const setActiveTab = (tab: Tab) => {
    localStorage.setItem('app-active-tab', tab)
    setActiveTabState(tab)
  }

  // 监听新用户引导的导航事件
  useEffect(() => {
    const handleNavigate = (e: CustomEvent<string>) => {
      const targetTab = e.detail as Tab
      if (['profiler', 'scenario', 'drafter', 'pet', 'network'].includes(targetTab)) {
        setActiveTab(targetTab)
      }
    }
    window.addEventListener('navigate-to-tab', handleNavigate as EventListener)
    return () => window.removeEventListener('navigate-to-tab', handleNavigate as EventListener)
  }, [])

  const handleNavigateToPet = (archetypeId: number) => {
    setPetPreSelectedId(archetypeId)
    setActiveTab('pet')
  }

  // 从关系网络跳转到沟通起草
  const handleNavigateToDrafter = (archetypeId: number, leaderName: string, scenarioId?: string) => {
    setCrossContext({
      draftContext: { archetypeId, leaderName, scenarioId }
    })
    setActiveTab('drafter')
  }

  // 从领导画像跳转到关系网络建档
  const handleNavigateToNetwork = (archetypeId: number) => {
    setCrossContext({
      preselectedArchetypeId: archetypeId
    })
    setActiveTab('network')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/hero-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />

        <div className="relative container mx-auto px-4 pt-10 pb-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyber">Managing Leadership v2.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-glow-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
              <span className="text-gradient-gold">管领导</span>
              <span className="text-foreground"> — AI时代反向管理指挥部</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
              在AI不断夺走人类工作的时代，聪明的程序员不是被AI替代的那个，而是用AI来管理自己领导的那个。
              <span className="text-secondary-foreground">16种领导原型 × 10种职场困境 × 灵宠养成系统</span>，
              让你的职场博弈从直觉升级为系统。
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative container mx-auto px-4">
          <nav className="flex gap-1 overflow-x-auto" role="tablist">
            {TABS.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-4 sm:px-5 py-3 rounded-t-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-card text-foreground border border-border border-b-transparent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                  {tab.desc}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {activeTab === 'profiler' && <LeaderProfiler onNavigateToPet={handleNavigateToPet} onNavigateToNetwork={handleNavigateToNetwork} />}
        {activeTab === 'scenario' && <ScenarioAnalyzer leaders={useLeaderNetwork().leaders} />}
        {activeTab === 'drafter' && <CommunicationDrafter prefillContext={crossContext.draftContext} />}
        {activeTab === 'pet' && <PetSystem preSelectedId={petPreSelectedId} />}
        {activeTab === 'network' && <RelationshipNetwork onNavigateToDrafter={handleNavigateToDrafter} preselectedArchetypeId={crossContext.preselectedArchetypeId} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            管领导 — Managing Leadership Skill &nbsp;|&nbsp; 
            本工具仅供职场策略参考，不鼓励任何不道德行为 &nbsp;|&nbsp;
            <span className="text-gold-dim">用AI管理领导，用智慧掌控职场</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
