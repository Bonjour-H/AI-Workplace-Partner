// 人员头像配置
export const createAvatar = (initial, bgColor = '#E0E7FF', textColor = '#4338CA') => ({
  initial,
  bgColor,
  textColor
});

// 关系状态
export const RelationshipStatus = {
  STABLE: '稳定区',
  ATTENTION_NEEDED: '需关注',
  INSUFFICIENT_DATA: '数据不足'
};

// 关系趋势
export const RelationshipTrend = {
  UP: 'up',
  DOWN: 'down',
  NONE: 'none'
};

// 关系类型
export const RelationshipType = {
  BOSS: '老板',
  COLLEAGUE: '同事',
  CLIENT: '客户'
};

// 应用视图类型
export const ViewType = {
  ME_DASHBOARD: 'me_dashboard',
  QUICK_ANALYSIS: 'quick_analysis',
  INSIGHT_REPORT: 'insight_report',
  ANALYSIS_RESULT: 'analysis_result'
};

// 洞察标签类型
export const InsightTabType = {
  REPORT: 'report',
  MEMO: 'memo'
};

// 聊天说话者类型
export const SpeakerType = {
  USER: 'user',
  AI: 'ai',
  COACH: 'coach'
};

// 创建新人员的工厂函数
export const createPersona = (name, relationshipType, title = '', tags = []) => ({
  id: `persona_${Date.now()}`,
  name,
  title: title || relationshipType,
  avatar: createAvatar(name.charAt(0)),
  tags: [relationshipType, ...tags],
  relationship: {
    score: 0,
    status: RelationshipStatus.INSUFFICIENT_DATA,
    trend: RelationshipTrend.NONE
  },
  summary: '需要更多互动来建立档案。',
  insights: {},
  sessions: [],
  memo: ''
});

// 创建新会话的工厂函数
export const createSession = (title = "新建的分析会话") => ({
  sessionId: `session_${Date.now()}`,
  sessionDate: new Date().toISOString().split('T')[0],
  sessionTitle: title,
  rounds: []
});

// 创建新轮次的工厂函数
// analysis：mock 时为 baseAnalysisResponse 结构（含 suggestedReplies 等）；真实模型为 bigmodelChat 返回的 { version: 2, intro, suggestedReply, situationAnalysis, ... }
export const createRound = (userInput, userContext = [], analysis = null, screenshotDataUrl = null) => ({
  roundId: `round_${Date.now()}`,
  userInput,
  userContext,
  analysis,
  screenshotDataUrl
});
