// 成长足迹仪表盘图表用 mock 数据（后续可对接真实 API）

/** 心态稳定性：近 8 周综合指数 */
export const mindsetTrendMock = {
  labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
  values: [62, 58, 65, 63, 70, 72, 68, 74]
};

/** 沟通风格雷达：维度与「上月 / 本月」对比 */
export const communicationRadarMock = {
  labels: [
    '向上沟通',
    '跨部门协作',
    '情绪管理',
    '清晰表达',
    '倾听反馈',
    '冲突处理'
  ],
  previousMonth: [52, 48, 55, 60, 58, 45],
  currentMonth: [68, 62, 70, 72, 65, 58]
};
