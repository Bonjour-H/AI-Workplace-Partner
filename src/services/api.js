// API配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const API_TIMEOUT = 10000;

// HTTP请求封装
class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// API服务接口
export class PersonaService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  // 获取所有人员
  async getPersonas() {
    return this.api.get('/personas');
  }

  // 获取单个人员详情
  async getPersona(personaId) {
    return this.api.get(`/personas/${personaId}`);
  }

  // 创建新人员
  async createPersona(personaData) {
    return this.api.post('/personas', personaData);
  }

  // 更新人员信息
  async updatePersona(personaId, updates) {
    return this.api.put(`/personas/${personaId}`, updates);
  }

  // 删除人员
  async deletePersona(personaId) {
    return this.api.delete(`/personas/${personaId}`);
  }

  // 获取人员会话
  async getPersonaSessions(personaId) {
    return this.api.get(`/personas/${personaId}/sessions`);
  }

  // 创建新会话
  async createSession(personaId, sessionData) {
    return this.api.post(`/personas/${personaId}/sessions`, sessionData);
  }

  // 添加会话轮次
  async addRound(personaId, sessionId, roundData) {
    return this.api.post(`/personas/${personaId}/sessions/${sessionId}/rounds`, roundData);
  }
}

export class AnalysisService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  // 分析对话
  async analyzeConversation(analysisData) {
    return this.api.post('/analysis/conversation', analysisData);
  }

  // 生成回复建议
  async generateReplySuggestions(conversationData) {
    return this.api.post('/analysis/reply-suggestions', conversationData);
  }

  // 生成洞察报告
  async generateInsightReport(personaId) {
    return this.api.get(`/analysis/insights/${personaId}`);
  }
}

export class UserService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  // 获取用户成长数据
  async getGrowthData() {
    return this.api.get('/user/growth');
  }

  // 更新用户设置
  async updateSettings(settings) {
    return this.api.put('/user/settings', settings);
  }

  // 获取用户统计数据
  async getStats() {
    return this.api.get('/user/stats');
  }
}

// 创建API实例
const apiClient = new ApiClient();

export const personaService = new PersonaService(apiClient);
export const analysisService = new AnalysisService(apiClient);
export const userService = new UserService(apiClient);

export default apiClient; 