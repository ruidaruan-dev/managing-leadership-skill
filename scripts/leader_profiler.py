"""
Leader Profiler (领导画像生成器)

A reference implementation demonstrating the data model and matching logic
for generating leader profiles based on the 16-archetype taxonomy.

This script is a structural reference for the AI skill — it defines the
profile schema, archetype matching algorithm, and output format that the
AI should follow when generating leader analyses.

Usage:
    python leader_profiler.py

No external dependencies required.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class OrgEcosystem(Enum):
    SOE = "国企体系"
    PRIVATE = "民企体系"
    MNC = "外企体系"
    BIG_TECH = "互联网大厂体系"


class FaceSensitivity(Enum):
    VERY_HIGH = "极高"
    HIGH = "高"
    MODERATE = "中等"
    LOW = "低"


class AIAttitude(Enum):
    RESISTANT = "抵触型"
    CAUTIOUS = "谨慎型"
    PRAGMATIC = "务实型"
    ENTHUSIASTIC = "热情型"
    AGGRESSIVE = "激进型"


@dataclass
class LeaderArchetype:
    """Core data model for a leader archetype profile."""

    id: int
    name_zh: str
    name_en: str
    ecosystem: OrgEcosystem
    typical_age_range: tuple[int, int]
    core_motivation: str
    communication_style: str
    tech_attitude: str
    ai_attitude: AIAttitude
    face_sensitivity: FaceSensitivity
    weaknesses: list[str]
    management_strategies: list[str]
    programmer_leverage: str  # "highest" | "high" | "moderate" | "lowest"
    keywords: list[str] = field(default_factory=list)


# ── Archetype Registry ────────────────────────────────────────────

ARCHETYPES: list[LeaderArchetype] = [
    LeaderArchetype(
        id=1,
        name_zh="官僚型处长",
        name_en="Bureaucratic Division Chief",
        ecosystem=OrgEcosystem.SOE,
        typical_age_range=(45, 58),
        core_motivation="稳定、向上汇报、零事故",
        communication_style="正式、间接、注重流程",
        tech_attitude="技术应该'不出事就好'",
        ai_attitude=AIAttitude.CAUTIOUS,
        face_sensitivity=FaceSensitivity.VERY_HIGH,
        weaknesses=["无法验证技术复杂度", "害怕技术事故", "依赖信任关系做技术判断"],
        management_strategies=[
            "汇报时强调'稳定可控'",
            "把请求包装成'确保上级满意'",
            "公开给足面子",
            "永远不要让他在会上被突然提问",
        ],
        programmer_leverage="lowest",
        keywords=["处长", "科长", "国企", "体制内", "编制", "流程"],
    ),
    LeaderArchetype(
        id=2,
        name_zh="技术转行政型领导",
        name_en="Technical-Turned-Administrative",
        ecosystem=OrgEcosystem.SOE,
        typical_age_range=(40, 55),
        core_motivation="被认可为'懂技术的领导'",
        communication_style="行政正式与技术非正式之间切换",
        tech_attitude="高估自己当前的技术相关性",
        ai_attitude=AIAttitude.CAUTIOUS,
        face_sensitivity=FaceSensitivity.HIGH,
        weaknesses=["技术知识可能落后十年", "技术自尊心是弱点也是入口"],
        management_strategies=[
            "把新技术包装成他过去工作的延伸",
            "偶尔请教他的'技术视角'",
            "永远不要直接否定他的技术建议",
        ],
        programmer_leverage="moderate",
        keywords=["以前也是搞技术的", "技术出身", "转管理"],
    ),
    LeaderArchetype(
        id=3,
        name_zh="政治型领导",
        name_en="Political Operator",
        ecosystem=OrgEcosystem.SOE,
        typical_age_range=(38, 52),
        core_motivation="职业晋升和影响力扩张",
        communication_style="高度自适应、模糊承诺、信息即货币",
        tech_attitude="对技术本身无兴趣，但重视技术的政治价值",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["缺乏对运营现实的深入理解", "需要能把事做成的人"],
        management_strategies=[
            "成为他的'能力保险'",
            "用他的政治语言包装你的工作",
            "帮他向上看好，他会横向和向下保护你",
        ],
        programmer_leverage="lowest",
        keywords=["关系户", "善于经营", "会来事", "政治敏感"],
    ),
    LeaderArchetype(
        id=4,
        name_zh="混日子型领导",
        name_en="Coasting Leader",
        ecosystem=OrgEcosystem.SOE,
        typical_age_range=(50, 60),
        core_motivation="平安退休、零风险",
        communication_style="回避冲突、不做决定",
        tech_attitude="完全无所谓",
        ai_attitude=AIAttitude.RESISTANT,
        face_sensitivity=FaceSensitivity.LOW,
        weaknesses=["回避创造权力真空", "不会为你出头"],
        management_strategies=[
            "利用他不在创造的自主空间",
            "不要期望他为你争取资源",
            "把所有请求包装成'维持现状'",
        ],
        programmer_leverage="lowest",
        keywords=["快退休了", "不管事", "随便", "你们定"],
    ),
    LeaderArchetype(
        id=5,
        name_zh="创始人/老板",
        name_en="Founder-Boss",
        ecosystem=OrgEcosystem.PRIVATE,
        typical_age_range=(35, 65),
        core_motivation="公司存亡=个人存亡",
        communication_style="直接、情绪化、不可预测",
        tech_attitude="看业务结果，不看技术优雅",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["情绪化决策", "创始人偏见", "难以授权"],
        management_strategies=[
            "展示对公司使命的真诚热情",
            "用公司愿景包装技术决策",
            "直接但不对抗，用数据说话",
        ],
        programmer_leverage="highest",
        keywords=["老板", "创始人", "CEO", "自己的公司"],
    ),
    LeaderArchetype(
        id=6,
        name_zh="职业经理人",
        name_en="Professional Manager",
        ecosystem=OrgEcosystem.PRIVATE,
        typical_age_range=(35, 50),
        core_motivation="个人简历增值、KPI达成",
        communication_style="结构化、数据驱动、PPT导向",
        tech_attitude="技术是达成KPI的手段",
        ai_attitude=AIAttitude.AGGRESSIVE,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["短期主义", "不承担技术债后果"],
        management_strategies=[
            "把一切转化为指标和ROI",
            "帮他积累'成就组合'",
            "用数据反驳不可持续的要求",
        ],
        programmer_leverage="high",
        keywords=["KPI", "OKR", "职业经理人", "MBA"],
    ),
    LeaderArchetype(
        id=7,
        name_zh="家族企业接班人",
        name_en="Family Business Heir",
        ecosystem=OrgEcosystem.PRIVATE,
        typical_age_range=(28, 45),
        core_motivation="证明自己配得上这个位置",
        communication_style="西式直接与中式间接之间摇摆",
        tech_attitude="积极——技术代表'现代化'",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.VERY_HIGH,
        weaknesses=["经验不足但资源丰富", "新老势力忠诚冲突"],
        management_strategies=[
            "成为他急需的可信赖顾问",
            "帮他建立合法性的可见成果",
            "用'现代化'包装你的技术提案",
        ],
        programmer_leverage="moderate",
        keywords=["接班", "二代", "家族企业", "少东家"],
    ),
    LeaderArchetype(
        id=8,
        name_zh="草根创业者",
        name_en="Grassroots Entrepreneur",
        ecosystem=OrgEcosystem.PRIVATE,
        typical_age_range=(35, 55),
        core_motivation="生存、增长、忠诚",
        communication_style="直接、非正式、关系导向",
        tech_attitude="尊重但困惑",
        ai_attitude=AIAttitude.PRAGMATIC,
        face_sensitivity=FaceSensitivity.HIGH,
        weaknesses=["过度依赖信任网络", "抵制流程和文档"],
        management_strategies=[
            "用交付赢得信任，不靠PPT",
            "说具体数字：'省20万/年'",
            "忠诚且直接——他能闻到政治操弄",
        ],
        programmer_leverage="highest",
        keywords=["白手起家", "实干", "没读过什么书", "靠谱"],
    ),
    LeaderArchetype(
        id=9,
        name_zh="海归型VP",
        name_en="Returnee VP",
        ecosystem=OrgEcosystem.MNC,
        typical_age_range=(35, 50),
        core_motivation="证明国际经验的独特价值",
        communication_style="中英双语切换",
        tech_attitude="尊重技术，期望国际标准",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["两头都不完全融入", "可能推不实际的HQ方法论"],
        management_strategies=[
            "成为他的技术执行锚",
            "帮他桥接HQ方法论和本地现实",
        ],
        programmer_leverage="high",
        keywords=["海归", "留学", "VP", "国际化"],
    ),
    LeaderArchetype(
        id=10,
        name_zh="外籍高管",
        name_en="Expat Executive",
        ecosystem=OrgEcosystem.MNC,
        typical_age_range=(40, 55),
        core_motivation="HQ指标和轮岗履历",
        communication_style="西方标准：直接、邮件为主",
        tech_attitude="期望全球标准",
        ai_attitude=AIAttitude.PRAGMATIC,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["文化盲区", "过度信任帮他导航的人"],
        management_strategies=[
            "成为他需要的'文化翻译'",
            "用英语和结构化指标沟通",
            "帮他避免文化地雷",
        ],
        programmer_leverage="moderate",
        keywords=["老外", "外籍", "expat", "不懂中文"],
    ),
    LeaderArchetype(
        id=11,
        name_zh="本土化高管",
        name_en="Localized Executive",
        ecosystem=OrgEcosystem.MNC,
        typical_age_range=(40, 55),
        core_motivation="在MNC中不可替代",
        communication_style="完美双语，按受众切换风格",
        tech_attitude="务实——技术必须服务双重目的",
        ai_attitude=AIAttitude.PRAGMATIC,
        face_sensitivity=FaceSensitivity.HIGH,
        weaknesses=["可能为保护组织牺牲个人"],
        management_strategies=[
            "深化让本地运营不可替代的技术护城河",
            "不要变成可有可无的人",
        ],
        programmer_leverage="moderate",
        keywords=["外企老人", "本土化", "双语", "bridge"],
    ),
    LeaderArchetype(
        id=12,
        name_zh="矩阵型汇报线领导",
        name_en="Matrix Reporting Leader",
        ecosystem=OrgEcosystem.MNC,
        typical_age_range=(35, 50),
        core_motivation="所有老板都满意",
        communication_style="外交型、共识导向、重文档",
        tech_attitude="取所有利益相关者要求的交集",
        ai_attitude=AIAttitude.CAUTIOUS,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["决策缓慢", "回避可能引起冲突的技术选择"],
        management_strategies=[
            "你的请求必须能被包装成服务所有利益相关者",
            "帮他建共识：'我已经和XX对齐过了'",
        ],
        programmer_leverage="moderate",
        keywords=["矩阵", "双线汇报", "dotted line", "solid line"],
    ),
    LeaderArchetype(
        id=13,
        name_zh="技术VP/CTO",
        name_en="Tech Executive",
        ecosystem=OrgEcosystem.BIG_TECH,
        typical_age_range=(35, 50),
        core_motivation="技术影响力和架构控制",
        communication_style="技术化、直接、反官僚",
        tech_attitude="深入、固执、可能微管理架构",
        ai_attitude=AIAttitude.AGGRESSIVE,
        face_sensitivity=FaceSensitivity.LOW,
        weaknesses=["社交面子低敏感但技术声誉高敏感"],
        management_strategies=[
            "用技术卓越赢得尊重",
            "用数据和原型挑战他的想法",
            "展示AI采纳的主动性",
        ],
        programmer_leverage="highest",
        keywords=["CTO", "技术VP", "架构", "技术驱动"],
    ),
    LeaderArchetype(
        id=14,
        name_zh="产品型领导",
        name_en="Product Leader",
        ecosystem=OrgEcosystem.BIG_TECH,
        typical_age_range=(30, 45),
        core_motivation="产品指标——DAU、留存、转化",
        communication_style="围绕sprint和路线图",
        tech_attitude="重交付速度轻技术质量",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.LOW,
        weaknesses=["接受技术债换取上线速度"],
        management_strategies=[
            "用产品影响力翻译技术工作",
            "用用户故事和A/B测试结果说话",
            "推回不合理排期时提议缩减范围",
        ],
        programmer_leverage="highest",
        keywords=["产品", "PM", "DAU", "sprint", "迭代"],
    ),
    LeaderArchetype(
        id=15,
        name_zh="空降型高管",
        name_en="Parachuted Executive",
        ecosystem=OrgEcosystem.BIG_TECH,
        typical_age_range=(35, 50),
        core_motivation="两个季度内可见成果",
        communication_style="变革导向、愿景驱动",
        tech_attitude="倾向于导入前公司的技术栈",
        ai_attitude=AIAttitude.ENTHUSIASTIC,
        face_sensitivity=FaceSensitivity.MODERATE,
        weaknesses=["忽视历史背景", "变革为变革而变革"],
        management_strategies=[
            "早期识别他的变革议程并对齐",
            "把可行性评估包装成'如何实现你的愿景'",
            "保护关键系统免受破坏性变革",
        ],
        programmer_leverage="high",
        keywords=["空降", "新来的", "在XX的时候", "新官上任"],
    ),
    LeaderArchetype(
        id=16,
        name_zh="内卷推动者",
        name_en="Involution Driver",
        ecosystem=OrgEcosystem.BIG_TECH,
        typical_age_range=(30, 45),
        core_motivation="产出量、可见活动、团队利用率",
        communication_style="高频、高紧迫感、周末消息",
        tech_attitude="重可见产出轻质量",
        ai_attitude=AIAttitude.AGGRESSIVE,
        face_sensitivity=FaceSensitivity.LOW,
        weaknesses=["质量指标是他的盲区"],
        management_strategies=[
            "可见地使用AI展示生产力",
            "用选择题代替开放题：'做A还是B？'",
            "记录一切——高压环境甩锅风险高",
            "准备好退出策略",
        ],
        programmer_leverage="lowest",
        keywords=["996", "卷", "又加班", "什么时候能完"],
    ),
]


def match_archetype(
    org_type: Optional[str] = None,
    keywords: Optional[list[str]] = None,
    leader_age: Optional[int] = None,
) -> list[tuple[LeaderArchetype, float]]:
    """
    Match user-provided leader description against archetypes.
    Returns list of (archetype, confidence_score) sorted by score.
    """
    results = []

    for archetype in ARCHETYPES:
        score = 0.0

        # Organization type matching
        if org_type:
            org_map = {
                "国企": OrgEcosystem.SOE,
                "民企": OrgEcosystem.PRIVATE,
                "外企": OrgEcosystem.MNC,
                "大厂": OrgEcosystem.BIG_TECH,
                "互联网": OrgEcosystem.BIG_TECH,
            }
            for key, ecosystem in org_map.items():
                if key in org_type and archetype.ecosystem == ecosystem:
                    score += 0.4
                    break

        # Keyword matching
        if keywords:
            matched = sum(
                1 for kw in keywords if any(kw in ak for ak in archetype.keywords)
            )
            if matched > 0:
                score += min(0.4, matched * 0.15)

        # Age range matching
        if leader_age:
            low, high = archetype.typical_age_range
            if low <= leader_age <= high:
                score += 0.2
            elif abs(leader_age - low) <= 5 or abs(leader_age - high) <= 5:
                score += 0.1

        if score > 0:
            results.append((archetype, round(score, 2)))

    results.sort(key=lambda x: x[1], reverse=True)
    return results


def format_profile(archetype: LeaderArchetype) -> str:
    """Format an archetype profile for display."""
    lines = [
        f"{'=' * 60}",
        f"  领导画像：{archetype.name_zh} ({archetype.name_en})",
        f"  所属体系：{archetype.ecosystem.value}",
        f"{'=' * 60}",
        "",
        f"  典型年龄：{archetype.typical_age_range[0]}-{archetype.typical_age_range[1]}岁",
        f"  核心动机：{archetype.core_motivation}",
        f"  沟通风格：{archetype.communication_style}",
        f"  技术态度：{archetype.tech_attitude}",
        f"  AI态度：{archetype.ai_attitude.value}",
        f"  面子敏感度：{archetype.face_sensitivity.value}",
        "",
        "  弱点与盲区：",
    ]
    for w in archetype.weaknesses:
        lines.append(f"    - {w}")
    lines.append("")
    lines.append("  管理策略：")
    for s in archetype.management_strategies:
        lines.append(f"    - {s}")
    lines.append(f"\n  程序员杠杆等级：{archetype.programmer_leverage}")
    return "\n".join(lines)


# ── Demo ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  领导画像匹配引擎 v1.0")
    print("  Managing Leadership — Leader Profiler")
    print("=" * 60)

    # Example: User describes their leader
    print("\n[场景] 用户输入：'我在国企，领导是个处长，50多岁，很注重流程'\n")

    matches = match_archetype(
        org_type="国企",
        keywords=["处长", "流程"],
        leader_age=52,
    )

    if matches:
        print(f"匹配到 {len(matches)} 个可能的画像：\n")
        for archetype, score in matches[:3]:
            print(f"  [{score:.0%} 匹配度] {archetype.name_zh}")

        print(f"\n最佳匹配画像详情：\n")
        print(format_profile(matches[0][0]))
    else:
        print("未找到匹配的画像，需要更多信息。")

    # Example 2: Big tech leader
    print("\n" + "-" * 60)
    print("\n[场景] 用户输入：'大厂的，CTO，技术驱动，喜欢review代码'\n")

    matches2 = match_archetype(
        org_type="大厂",
        keywords=["CTO", "技术驱动"],
        leader_age=42,
    )

    if matches2:
        print(f"匹配到 {len(matches2)} 个可能的画像：\n")
        for archetype, score in matches2[:3]:
            print(f"  [{score:.0%} 匹配度] {archetype.name_zh}")

        print(f"\n最佳匹配画像详情：\n")
        print(format_profile(matches2[0][0]))
