import { RelationshipStatus, RelationshipTrend } from '../types';

// 基础分析响应模板
export const baseAnalysisResponse = {
  thinkingProcess: "1. **识别关键词**: 用户输入包含相关时间和任务信息，表明这是一个有时限的任务...",
  situationAnalysis: {
    title: "当前情况分析",
    sections: [
      {
        subtitle: "对方的意图和状态",
        points: [
          "**目标明确**: 他需要一份结果，并且有明确的时间要求。这是一个明确的、带有时间压力的指令。",
          "**典型压力测试**: 这是一个典型的压力测试，用于观察你的反应、责任心和抗压能力。"
        ]
      },
      {
        subtitle: "你的机会点",
        points: [
          "**展现可靠性**: 即使有压力，也能积极响应并给出解决方案，是建立信任的关键。",
          "**管理预期**: 学会不直接说不，而是通过沟通来管理对方的预期。"
        ]
      }
    ]
  },
  replyStrategy: {
    title: "回复策略",
    description: "你的回复应该像一个三明治，层层递进：",
    points: [
      "**顶层面包（肯定和承接）**: 积极响应，表示你收到了任务并理解其重要性。",
      "**中间馅料（说明情况+提供方案）**: 合理地说明你当前的困难，然后立刻给出建设性的替代方案。",
      "**底层面包（确认和闭环）**: 将选择权交还给对方，并等待对方确认，形成沟通闭环。"
    ]
  },
  suggestedReplies: [
    {
      id: 'style_1',
      style: '积极主动(推荐)',
      text: "收到李总！报告的核心部分我已经完成了，数据和初步结论都有了。我现在正在对内容的结构和措辞做最终的打磨，希望呈现给您的版本是逻辑清晰、结论明确的。您看这样行吗，我先把现有结论和数据亮点整理一份摘要，10分钟内发给您预览。这样您心里有底。完整的终版报告，我保证明天上午10点前肯定发到您邮箱。",
      analysis: "* **积极反馈**: 开篇就说核心部分完成，传递出积极和尽责的信号。\n* **展现价值**: 强调打磨、逻辑清晰，说明你追求高质量。\n* **提供替代方案**: 先发摘要是一个非常好的做法。\n* **明确承诺**: 明天上午10点前给出了一个确切的时间点。"
    },
    {
      id: 'style_2',
      style: '高效务实',
      text: "收到李总。报告的主要数据分析已经好了。只是还有几个细节想再确认下，保证万无一失。我今晚加把劲，争取11点前发给您。如果中间有任何问题，我再随时跟您同步。",
      analysis: "* **直奔主题**: 直接告知进度和预计完成时间。\n* **展现责任心**: 保证万无一失体现了你的责任感。"
    }
  ]
};

// Mock人员数据
export const mockPersonas = [
  {
    id: 'li_zong',
    name: '李总',
    title: '产品总监 | 老板',
    avatar: { initial: '李', bgColor: '#DBEAFE', textColor: '#1E40AF' },
    tags: ['老板', 'PUA', '情绪不稳定', '注重细节'],
    relationship: { score: 78, status: RelationshipStatus.STABLE, trend: RelationshipTrend.UP },
    summary: '一个注重细节、以数据为准绳、不喜意外的实干派管理者。',
    insights: {
      communicationStyle: {
        title: '沟通风格画像',
        points: [
          '渠道偏好: 邮件 > 即时通讯',
          '语言风格: 正式、书面化、结论先行',
          '反馈模式: 沉默不代表不满意，而是默认通过。'
        ]
      },
      coreDrivers: {
        title: '核心驱动力与目标',
        points: [
          '最在乎: [KPI达成] [风险控制] [向上汇报质量]',
          '当前压力源(AI推测): Q3部门预算审批'
        ]
      },
      perception: {
        title: '他眼中的我',
        summary: '定位: 可靠但略显被动的执行者',
        chartData: {
          labels: ['技术能力', '沟通能力', '主动性', '大局观', '责任心', '效率'],
          values: [9, 6, 4, 5, 8, 7]
        }
      },
      dosAndDonts: {
        title: '雷区与甜点区',
        donts: ['公开场合质疑他的决定', '汇报时隐藏问题', '越级汇报'],
        dos: ['主动提供备选方案', '用图表和数据说话', '量化工作成果']
      }
    },
    sessions: [
      {
        sessionId: 'session_001',
        sessionDate: '2025-01-13',
        sessionTitle: '关于项目进度的沟通',
        rounds: [
          {
            roundId: 'round_001',
            userInput: '李总，关于那个XX项目的报告，今晚能给我吗？',
            userContext: ['任务紧急', '我压力很大'],
            analysis: baseAnalysisResponse
          }
        ]
      }
    ],
    memo: '上次团建时提到他喜欢喝单枞茶。\n是XX球队的铁杆球迷。',
  }
];

// 标签数据
export const mockTags = {
  all: ['主动推进', '礼貌拒绝', '澄清疑虑', '任务紧急', '事关重大', '对方情绪激动', '私下沟通']
}; 