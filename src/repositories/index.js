import { personaService, analysisService, userService } from '../services/api';
import { storageManager } from '../services/storage';
import { mockPersonas, mockTags, baseAnalysisResponse } from '../data/mockData';

// 基础仓库类
class BaseRepository {
  constructor(apiService, storageKey) {
    this.apiService = apiService;
    this.storageKey = storageKey;
    this.isOnline = navigator.onLine;
    
    // 监听网络状态
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // 同步离线数据（子类实现）
  async syncOfflineData() {
    // 基类默认实现为空
  }

  // 通用错误处理
  handleError(error, fallbackData = null) {
    console.error('Repository error:', error);
    
    if (!this.isOnline && fallbackData) {
      return { data: fallbackData, fromCache: true };
    }
    
    throw error;
  }
}

// 人员数据仓库
export class PersonaRepository extends BaseRepository {
  constructor() {
    super(personaService, 'personas');
  }

  // 获取所有人员
  async getPersonas() {
    try {
      if (this.isOnline) {
        const response = await this.apiService.getPersonas();
        // 缓存到本地存储
        storageManager.setPersonas(response.data);
        return response;
      } else {
        // 离线时从本地存储读取
        const cachedData = storageManager.getPersonas();
        return { 
          data: cachedData.length > 0 ? cachedData : mockPersonas, 
          fromCache: true 
        };
      }
    } catch (error) {
      return this.handleError(error, storageManager.getPersonas() || mockPersonas);
    }
  }

  // 获取单个人员
  async getPersona(personaId) {
    try {
      if (this.isOnline) {
        const response = await this.apiService.getPersona(personaId);
        // 更新本地缓存中的单个人员数据
        this.updatePersonaInCache(response.data);
        return response;
      } else {
        const cachedPersonas = storageManager.getPersonas();
        const persona = cachedPersonas.find(p => p.id === personaId) || 
                       mockPersonas.find(p => p.id === personaId);
        
        if (!persona) {
          throw new Error('Persona not found');
        }
        
        return { data: persona, fromCache: true };
      }
    } catch (error) {
      const cachedPersonas = storageManager.getPersonas();
      const fallbackPersona = cachedPersonas.find(p => p.id === personaId) || 
                             mockPersonas.find(p => p.id === personaId);
      return this.handleError(error, fallbackPersona);
    }
  }

  // 创建人员
  async createPersona(personaData) {
    try {
      if (this.isOnline) {
        const response = await this.apiService.createPersona(personaData);
        // 添加到本地存储
        this.addPersonaToCache(response.data);
        return response;
      } else {
        // 离线模式：生成临时ID并保存到本地
        const newPersona = {
          ...personaData,
          id: `temp_${Date.now()}`,
          _isOfflineCreated: true,
          _createdAt: new Date().toISOString()
        };
        
        this.addPersonaToCache(newPersona);
        return { data: newPersona, fromCache: true };
      }
    } catch (error) {
      throw error;
    }
  }

  // 更新人员
  async updatePersona(personaId, updates) {
    try {
      if (this.isOnline) {
        const response = await this.apiService.updatePersona(personaId, updates);
        this.updatePersonaInCache(response.data);
        return response;
      } else {
        // 离线模式：直接更新本地缓存
        const updatedPersona = this.updatePersonaInCacheOffline(personaId, updates);
        return { data: updatedPersona, fromCache: true };
      }
    } catch (error) {
      // 尝试离线更新
      const updatedPersona = this.updatePersonaInCacheOffline(personaId, updates);
      return this.handleError(error, updatedPersona);
    }
  }

  // 删除人员
  async deletePersona(personaId) {
    try {
      if (this.isOnline) {
        await this.apiService.deletePersona(personaId);
      }
      // 无论在线离线都从本地删除
      this.removePersonaFromCache(personaId);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  // 缓存操作方法
  updatePersonaInCache(persona) {
    const personas = storageManager.getPersonas();
    const index = personas.findIndex(p => p.id === persona.id);
    
    if (index !== -1) {
      personas[index] = persona;
    } else {
      personas.push(persona);
    }
    
    storageManager.setPersonas(personas);
  }

  addPersonaToCache(persona) {
    const personas = storageManager.getPersonas();
    personas.unshift(persona);
    storageManager.setPersonas(personas);
  }

  updatePersonaInCacheOffline(personaId, updates) {
    const personas = storageManager.getPersonas();
    const index = personas.findIndex(p => p.id === personaId);
    
    if (index !== -1) {
      personas[index] = { 
        ...personas[index], 
        ...updates,
        _lastModified: new Date().toISOString(),
        _isOfflineModified: true
      };
      storageManager.setPersonas(personas);
      return personas[index];
    }
    
    throw new Error('Persona not found in cache');
  }

  removePersonaFromCache(personaId) {
    const personas = storageManager.getPersonas();
    const filteredPersonas = personas.filter(p => p.id !== personaId);
    storageManager.setPersonas(filteredPersonas);
  }

  // 同步离线数据
  async syncOfflineData() {
    const personas = storageManager.getPersonas();
    const offlinePersonas = personas.filter(p => p._isOfflineCreated || p._isOfflineModified);
    
    for (const persona of offlinePersonas) {
      try {
        if (persona._isOfflineCreated) {
          // 创建新人员
          const { _isOfflineCreated, _createdAt, ...personaData } = persona;
          const response = await this.apiService.createPersona(personaData);
          // 替换临时ID
          this.replacePersonaInCache(persona.id, response.data);
        } else if (persona._isOfflineModified) {
          // 更新人员
          const { _isOfflineModified, _lastModified, ...personaData } = persona;
          const response = await this.apiService.updatePersona(persona.id, personaData);
          this.updatePersonaInCache(response.data);
        }
      } catch (error) {
        console.error(`Failed to sync persona ${persona.id}:`, error);
      }
    }
  }

  replacePersonaInCache(oldId, newPersona) {
    const personas = storageManager.getPersonas();
    const index = personas.findIndex(p => p.id === oldId);
    
    if (index !== -1) {
      personas[index] = newPersona;
      storageManager.setPersonas(personas);
    }
  }
}

// 分析仓库
export class AnalysisRepository extends BaseRepository {
  constructor() {
    super(analysisService, 'analysis');
  }

  // 分析对话
  async analyzeConversation(analysisData) {
    const cacheKey = this.generateCacheKey(analysisData);
    
    // 先检查缓存
    const cachedResult = storageManager.getAnalysisCache(cacheKey);
    if (cachedResult) {
      return { data: cachedResult, fromCache: true };
    }

    try {
      if (this.isOnline) {
        const response = await this.apiService.analyzeConversation(analysisData);
        // 缓存结果
        storageManager.setAnalysisCache(cacheKey, response.data);
        return response;
      } else {
        // 离线模式：使用mock数据
        const mockResult = { ...baseAnalysisResponse };
        storageManager.setAnalysisCache(cacheKey, mockResult);
        return { data: mockResult, fromCache: true };
      }
    } catch (error) {
      return this.handleError(error, baseAnalysisResponse);
    }
  }

  // 生成缓存键
  generateCacheKey(data) {
    const str = JSON.stringify(data);
    return btoa(str).replace(/[+/=]/g, ''); // 简单hash
  }

  // 生成洞察报告
  async generateInsightReport(personaId) {
    try {
      if (this.isOnline) {
        return await this.apiService.generateInsightReport(personaId);
      } else {
        // 离线模式：从本地人员数据生成基础报告
        const persona = await new PersonaRepository().getPersona(personaId);
        const mockInsights = this.generateMockInsights(persona.data);
        return { data: mockInsights, fromCache: true };
      }
    } catch (error) {
      throw error;
    }
  }

  generateMockInsights(persona) {
    return {
      communicationStyle: {
        title: '沟通风格画像', 
        points: ['基于有限数据生成的基础分析']
      },
      // ... 其他mock洞察数据
    };
  }
}

// 用户仓库
export class UserRepository extends BaseRepository {
  constructor() {
    super(userService, 'user');
  }

  // 获取用户设置
  getUserSettings() {
    return storageManager.getUserSettings();
  }

  // 更新用户设置
  async updateUserSettings(settings) {
    try {
      // 先更新本地
      storageManager.setUserSettings(settings);
      
      if (this.isOnline) {
        await this.apiService.updateSettings(settings);
      }
      
      return { data: settings, success: true };
    } catch (error) {
      console.error('Failed to sync settings to server:', error);
      return { data: settings, success: true, fromCache: true };
    }
  }

  // 获取成长数据
  async getGrowthData() {
    try {
      if (this.isOnline) {
        const response = await this.apiService.getGrowthData();
        storageManager.updateGrowthData(response.data);
        return response;
      } else {
        const cachedData = storageManager.getGrowthData();
        return { data: cachedData, fromCache: true };
      }
    } catch (error) {
      return this.handleError(error, storageManager.getGrowthData());
    }
  }
}

// 标签仓库
export class TagRepository {
  getTags() {
    // 标签数据比较静态，优先使用本地mock数据
    return mockTags;
  }
}

// 创建仓库实例
export const personaRepository = new PersonaRepository();
export const analysisRepository = new AnalysisRepository();
export const userRepository = new UserRepository();
export const tagRepository = new TagRepository();

// 导出所有仓库
export default {
  persona: personaRepository,
  analysis: analysisRepository,
  user: userRepository,
  tag: tagRepository
}; 