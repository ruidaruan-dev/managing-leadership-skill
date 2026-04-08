import type { PetDialogue } from '@/types/pet'

export const PET_DIALOGUES: Record<number, PetDialogue> = {
  1: { // 官僚型处长
    catchphrase: '这不合流程！',
    painReaction: 'shake',
    defeatLines: [
      '呜…你这样做不符合流程…', '我要向上级反映！…算了还是别了…',
      '我的面子…我的面子全没了…', '年轻人不讲武德！',
      '我在体制内三十年…竟输给一个程序员…', '你等着，等我开完会再说！',
      '这个…需要研究研究…', '我的茶杯都被你震翻了…',
      '稳定！稳定才是第一位的！', '你这是在挑战组织！',
    ],
  },
  2: { // 技术转行政
    catchphrase: '我当年写代码的时候…',
    painReaction: 'spin',
    defeatLines: [
      '我当年写的代码比你优雅多了！', '这个…那个…技术上我是懂的…',
      '你用的这个框架，我十年前就研究过了…', '不要以为我不懂技术！',
      '我承认，可能稍微落后了一点点…', '等等，让我查一下Stack Overflow…',
      '我的技术威严！', '这个bug我当年也遇到过…真的…',
      '好吧好吧，新技术确实厉害…', '你赢了…但我曾经也很强的…',
    ],
  },
  3: { // 政治型领导
    catchphrase: '这件事要从大局来看…',
    painReaction: 'shrink',
    defeatLines: [
      '你…你怎么不按套路出牌…', '这在政治上是不正确的！',
      '我的关系网…全碎了…', '信息就是权力，可我的信息被截胡了…',
      '要从大局…啊不，别打了…', '我需要重新评估利益相关者…',
      '你这个人…太不好控制了…', '我的政治资本！归零！',
      '棋局被掀翻了…', '让我缓缓…我需要重新布局…',
    ],
  },
  4: { // 混日子型
    catchphrase: '随便吧…',
    painReaction: 'bounce',
    defeatLines: [
      '唉…打就打吧…反正快退休了…', '别打了…我签字还不行吗…',
      '你说啥就是啥吧…', '我的茶…我的报纸…都飞了…',
      'zzZ…啊？打我了？', '退休金不会受影响吧…',
      '年轻人真有精力…', '好好好，你说了算，我不管了…',
      '岁月不饶人啊…', '我没意见…从来没有意见…',
    ],
  },
  5: { // 创始人/老板
    catchphrase: '这是我的公司！',
    painReaction: 'shake',
    defeatLines: [
      '我白手起家…竟被自己的兵打了…', '这个公司没有我能行吗！',
      '我凌晨三点还在工作！你居然打我！', '反了反了！都反了！',
      '我的愿景…我的使命…呜…', '你这是在挑战创始人权威！',
      '等等，这笔打人的成本谁出？', '好吧，我承认技术确实很重要…',
      '投资人看到了怎么办…', '我需要融一轮来治伤…',
    ],
  },
  6: { // 职业经理人
    catchphrase: 'Show me the KPI!',
    painReaction: 'spin',
    defeatLines: [
      '我的PPT！我精心准备的PPT！', '这不在我的KPI里面！',
      'ROI为负…不可接受…', '我的LinkedIn profile…要更新了…',
      '这个季度的业绩…全毁了…', '让我做个复盘…',
      'MBA白读了…', '我需要一个体面的exit…',
      '数据不会说谎…但数据救不了我…', '下个平台…我去下个平台…',
    ],
  },
  7: { // 家族接班人
    catchphrase: '我不是靠爹的！',
    painReaction: 'bounce',
    defeatLines: [
      '我爸知道了会怎么想…', '老臣们肯定在笑我…',
      '我留学回来是为了被打的吗…', '现代化管理…啊…好疼…',
      '我的MBA学位！我的海归光环！', '顾问们都没教过我应对这个…',
      '家族的脸…全丢了…', '也许…老一辈的方法确实有道理…',
      '我需要打电话给我的executive coach…', '二代的命也是命啊…',
    ],
  },
  8: { // 草根创业者
    catchphrase: '我信你个鬼！',
    painReaction: 'shake',
    defeatLines: [
      '我从摆地摊一路拼过来！不怕你！…好吧有点怕…', '你这小子…够狠…',
      '我闻到了危险的味道…', '说具体点！到底要多少钱！',
      '别整虚的！有话直说！', '我不懂技术…但我懂人心…唉…',
      '打工人打打工人…', '这比创业还难…',
      '行吧…你靠谱的话我服…', '别用PPT糊弄我！',
    ],
  },
  9: { // 海归型VP
    catchphrase: 'This is unacceptable!',
    painReaction: 'spin',
    defeatLines: [
      '在硅谷不是这样的！', '我的international perspective！',
      'Let me…让我缓缓…', '这不符合best practice…',
      '我两边都不讨好了…', '总部知道了怎么办…',
      'Agile也救不了我了…', '文化冲击…物理意义上的…',
      '我的双语能力…在此刻毫无用处…', '需要align一下…和自己…',
    ],
  },
  10: { // 外籍高管
    catchphrase: 'But the global template!',
    painReaction: 'bounce',
    defeatLines: [
      'China is…not so fascinating anymore…', '这不在global template里…',
      '文化差异…太大了…', 'I need a translator…for pain…',
      'HQ told me China would be easy…', '轮岗结束让我回去吧…',
      'My expense report for medical…', '微信群里到底在说什么…',
      'This is a cultural learning moment…ouch…', '要给总部写incident report…',
    ],
  },
  11: { // 本土化高管
    catchphrase: '这个情况比较复杂…',
    painReaction: 'shrink',
    defeatLines: [
      '我在两个体系间周旋二十年…竟翻车了…', '你这一招…总部和本地都没见过…',
      '我的不可替代性…受到了威胁…', '需要重新构建narrative…',
      '我太精明了…没算到这一步…', '中国特殊论…救不了我了…',
      '双语切换切不过来了…', '我的酒量…也挡不住这一鞭…',
      '要重新evaluate我的战略…', '最难对付的…原来是程序员…',
    ],
  },
  12: { // 矩阵型汇报线
    catchphrase: '我需要和所有stakeholder对齐…',
    painReaction: 'shake',
    defeatLines: [
      '三个老板…五条线…现在全断了…', '需要对齐的人太多…来不及了…',
      '共识！我需要共识！', '谁批准了这次打击…',
      '我的文档呢…我需要记录这个…', '所有stakeholder都不会同意的…',
      'dotted line和solid line全乱了…', '让我开个会讨论一下…',
      '这个decision matrix…不适用了…', '会议纪要…要记上…啊…',
    ],
  },
  13: { // 技术VP/CTO
    catchphrase: 'Show me the code!',
    painReaction: 'spin',
    defeatLines: [
      '你的代码…确实比我想象的强…', '我的GitHub连续streak…断了…',
      '这个架构…我服…', '等等让我Review一下你的攻击代码…',
      '技术信仰…动摇了…', 'Working code wins…你赢了…',
      '我需要refactor我的人生…', '这个technical debt…还不起了…',
      'PR approved…对你的实力…', '让我merge一下这个defeat…',
    ],
  },
  14: { // 产品型领导
    catchphrase: '这个feature优先级是P0！',
    painReaction: 'bounce',
    defeatLines: [
      '我的Sprint全乱了！', '这个不在roadmap里啊！',
      'DAU暴跌…是因为我被打了吗…', '让我做个A/B test…挨打vs不挨打…',
      '需求变更太快了…', '你的攻击速度比我催需求还快…',
      'Backlog里没有"被打"这个story…', '产品经理的命也是命…',
      'Iteration…被迫iteration了…', '用户体验…我的体验呢…',
    ],
  },
  15: { // 空降型高管
    catchphrase: '在我前东家…',
    painReaction: 'shrink',
    defeatLines: [
      '在我前公司…不是这样的…', '蜜月期…提前结束了…',
      '我的变革议程…被物理终结了…', '落地也太快了…不是这种落地…',
      '新官上任的火…被浇灭了…', '历史背景…我确实不了解…',
      '我的方法论…在这里失效了…', '前东家的光环…碎了…',
      '两个季度的成果…变成两个包…', '我需要一个新的降落伞…',
    ],
  },
  16: { // 内卷推动者
    catchphrase: '什么时候能完？',
    painReaction: 'shake',
    defeatLines: [
      '加班…也挡不住…', '996也救不了我了…',
      '可见产出…变成了可见伤口…', '什么时候能…停止打我…',
      '利用率指标…被打到0%了…', '团队burnout…我先burnout了…',
      '这个攻击需要写周报吗…', '效率！我要求效率！…啊…',
      '选A还是选B…我选C：投降…', '被卷到了…真正的意义上…',
    ],
  },
}
