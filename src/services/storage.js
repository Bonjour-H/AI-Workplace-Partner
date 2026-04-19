// 存储键常量
export const STORAGE_KEYS = {
  PERSONAS: 'aicareer_buddy_personas',
  USER_SETTINGS: 'aicareer_buddy_user_settings',
  ANALYSIS_CACHE: 'aicareer_buddy_analysis_cache',
  GROWTH_DATA: 'aicareer_buddy_growth_data',
  LAST_ACTIVE_PERSONA: 'aicareer_buddy_last_active_persona',
  DRAFT_DATA: 'aicareer_buddy_draft_data',
};

// 本地存储抽象类
class BaseStorage {
  constructor(storage) {
    this.storage = storage;
  }

  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return defaultValue;
    }
  }

  set(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  has(key) {
    return this.storage.getItem(key) !== null;
  }

  // 批量操作
  setMultiple(items) {
    const results = {};
    Object.entries(items).forEach(([key, value]) => {
      results[key] = this.set(key, value);
    });
    return results;
  }

  getMultiple(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.get(key);
    });
    return results;
  }
}

// 本地存储服务
export class LocalStorageService extends BaseStorage {
  constructor() {
    super(localStorage);
  }

  // 获取存储大小
  getSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  // 检查存储容量
  checkCapacity() {
    const used = this.getSize();
    const limit = 5 * 1024 * 1024; // 5MB (大概的localStorage限制)
    return {
      used,
      limit,
      remaining: limit - used,
      percentage: (used / limit) * 100
    };
  }
}

// 会话存储服务
export class SessionStorageService extends BaseStorage {
  constructor() {
    super(sessionStorage);
  }
}

// 内存缓存服务
export class MemoryCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 默认5分钟过期
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = ttl;
  }

  set(key, value, ttl = this.defaultTTL) {
    // 如果达到最大容量，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const item = {
      value,
      expiry: Date.now() + ttl,
      accessCount: 0,
      createdAt: Date.now()
    };

    this.cache.set(key, item);
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    // 更新访问统计
    item.accessCount++;
    
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  remove(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // 获取缓存统计
  getStats() {
    const items = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      totalAccess: items.reduce((sum, item) => sum + item.accessCount, 0),
      avgAccess: items.length > 0 ? items.reduce((sum, item) => sum + item.accessCount, 0) / items.length : 0
    };
  }

  // 清理过期项
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// 数据存储管理器
export class DataStorageManager {
  constructor() {
    this.localStorage = new LocalStorageService();
    this.sessionStorage = new SessionStorageService();
    this.memoryCache = new MemoryCache();
    
    // 定期清理过期缓存
    setInterval(() => {
      this.memoryCache.cleanup();
    }, 60000); // 每分钟清理一次
  }

  // 人员数据管理
  getPersonas() {
    return this.localStorage.get(STORAGE_KEYS.PERSONAS, []);
  }

  setPersonas(personas) {
    return this.localStorage.set(STORAGE_KEYS.PERSONAS, personas);
  }

  // 用户设置管理
  getUserSettings() {
    return this.localStorage.get(STORAGE_KEYS.USER_SETTINGS, {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      autoSave: true
    });
  }

  setUserSettings(settings) {
    return this.localStorage.set(STORAGE_KEYS.USER_SETTINGS, settings);
  }

  // 分析缓存管理
  getAnalysisCache(key) {
    return this.memoryCache.get(`analysis_${key}`);
  }

  setAnalysisCache(key, data, ttl = 10 * 60 * 1000) { // 10分钟缓存
    return this.memoryCache.set(`analysis_${key}`, data, ttl);
  }

  // 草稿数据管理 (会话级别)
  getDraftData(key) {
    return this.sessionStorage.get(`${STORAGE_KEYS.DRAFT_DATA}_${key}`);
  }

  setDraftData(key, data) {
    return this.sessionStorage.set(`${STORAGE_KEYS.DRAFT_DATA}_${key}`, data);
  }

  removeDraftData(key) {
    return this.sessionStorage.remove(`${STORAGE_KEYS.DRAFT_DATA}_${key}`);
  }

  // 最后活跃人员
  getLastActivePersona() {
    return this.localStorage.get(STORAGE_KEYS.LAST_ACTIVE_PERSONA);
  }

  setLastActivePersona(personaId) {
    return this.localStorage.set(STORAGE_KEYS.LAST_ACTIVE_PERSONA, personaId);
  }

  // 成长数据
  getGrowthData() {
    return this.localStorage.get(STORAGE_KEYS.GROWTH_DATA, {
      communicationSkills: [],
      emotionalStability: [],
      achievements: []
    });
  }

  updateGrowthData(growthData) {
    return this.localStorage.set(STORAGE_KEYS.GROWTH_DATA, growthData);
  }

  // 存储健康检查
  healthCheck() {
    const localStorageHealth = this.localStorage.checkCapacity();
    const memoryCache = this.memoryCache.getStats();
    
    return {
      localStorage: localStorageHealth,
      memoryCache,
      timestamp: new Date().toISOString()
    };
  }

  // 数据导出
  exportData() {
    const data = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = this.localStorage.get(key);
    });
    return data;
  }

  // 数据导入
  importData(data) {
    const results = {};
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key)) {
        results[key] = this.localStorage.set(key, value);
      }
    });
    return results;
  }

  // 清理所有数据
  clearAllData() {
    this.localStorage.clear();
    this.sessionStorage.clear();
    this.memoryCache.clear();
  }
}

// 创建全局存储管理器实例
export const storageManager = new DataStorageManager();
export default storageManager; 