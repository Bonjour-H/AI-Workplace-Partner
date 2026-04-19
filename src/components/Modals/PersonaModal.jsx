import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useApp } from '../../contexts/AppContext';
import { createPersona, RelationshipType } from '../../types';
import { showToast } from '../Common/Toast';
import { ROUTES } from '../../router';

function PersonaModal() {
  const navigate = useNavigate();
  const { isNewPersonaModalOpen, actions } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    relationshipType: '',
    customRelationType: '',
    personalityTags: [],
    coreDemands: [],
    keyEvents: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [coreDemandInput, setCoreDemandInput] = useState('');
  const [isCustomRelationType, setIsCustomRelationType] = useState(false);

  const handleClose = () => {
    actions.toggleNewPersonaModal();
    // 重置表单
    setFormData({
      name: '',
      relationshipType: '',
      customRelationType: '',
      personalityTags: [],
      coreDemands: [],
      keyEvents: ''
    });
    setTagInput('');
    setCoreDemandInput('');
    setIsCustomRelationType(false);
  };

  const handleRelationshipTypeClick = (type) => {
    setFormData(prev => ({ ...prev, relationshipType: type }));
    setIsCustomRelationType(false);
  };

  const handleCustomRelationTypeClick = () => {
    setIsCustomRelationType(true);
    setFormData(prev => ({ ...prev, relationshipType: 'custom' }));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.personalityTags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          personalityTags: [...prev.personalityTags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleCoreDemandInputKeyPress = (e) => {
    if (e.key === 'Enter' && coreDemandInput.trim()) {
      e.preventDefault();
      if (!formData.coreDemands.includes(coreDemandInput.trim())) {
        setFormData(prev => ({
          ...prev,
          coreDemands: [...prev.coreDemands, coreDemandInput.trim()]
        }));
      }
      setCoreDemandInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      personalityTags: prev.personalityTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const removeCoreDemand = (demandToRemove) => {
    setFormData(prev => ({
      ...prev,
      coreDemands: prev.coreDemands.filter(demand => demand !== demandToRemove)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showToast('请输入称呼。', 'error');
      return;
    }
    
    if (!formData.relationshipType) {
      showToast('请选择关系类型。', 'error');
      return;
    }

    if (formData.relationshipType === 'custom' && !formData.customRelationType.trim()) {
      showToast('请输入自定义关系类型。', 'error');
      return;
    }

    const finalRelationType = formData.relationshipType === 'custom'
      ? formData.customRelationType.trim()
      : formData.relationshipType;

    const newPersona = createPersona(
      formData.name.trim(),
      finalRelationType,
      finalRelationType,
      formData.personalityTags,
      formData.coreDemands,
      formData.keyEvents
    );

    // 1. 首先添加新对象
    actions.addPersona(newPersona);

    // 2. 先关闭模态框
    handleClose();

    // 3. 使用短暂延时确保模态框关闭后再执行导航和显示提示
    setTimeout(() => {
      navigate(ROUTES.PERSONA_ANALYSIS(newPersona.id));
      showToast(`已成功创建对象：${formData.name}`, 'success');
    }, 100);
  };

  if (!isNewPersonaModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-slate-800">新建分析对象</h2>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-5">
          {/* 名称输入 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              通讯软件中的称呼 <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
              placeholder="例如：李总"
            />
          </div>
          
          {/* 关系类型 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              关系类型 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              {Object.values(RelationshipType).map(type => (
                <button
                  key={type}
                  onClick={() => handleRelationshipTypeClick(type)}
                  className={classNames(
                    "py-2 px-4 text-sm border rounded-md transition",
                    {
                      'bg-blue-100 border-blue-300 text-blue-800 font-medium': formData.relationshipType === type,
                      'border-slate-200 bg-white text-slate-700 hover:bg-slate-50': formData.relationshipType !== type
                    }
                  )}
                >
                  {type}
                </button>
              ))}
              <button
                onClick={handleCustomRelationTypeClick}
                className={classNames(
                  "py-2 px-4 text-sm border rounded-md transition",
                  {
                    'bg-blue-100 border-blue-300 text-blue-800 font-medium': isCustomRelationType,
                    'border-slate-200 bg-white text-slate-700 hover:bg-slate-50': !isCustomRelationType
                  }
                )}
              >
                自定义
              </button>
            </div>

            {isCustomRelationType && (
              <input
                type="text"
                value={formData.customRelationType}
                onChange={(e) => setFormData(prev => ({ ...prev, customRelationType: e.target.value }))}
                className="mt-2 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="请输入自定义关系类型"
                autoFocus
              />
            )}
          </div>
          
          {/* 性格标签 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              性格标签 (可选)
            </label>
            <div className="mt-1 w-full min-h-[44px] flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 cursor-text">
              {formData.personalityTags.map(tag => (
                <span
                  key={tag} 
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded"
                >
                  <span>{tag}</span>
                  <button 
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 rounded-full hover:bg-blue-200 flex items-center justify-center"
                    type="button"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                className="flex-grow bg-transparent outline-none text-sm p-1" 
                placeholder="输入标签后按回车，如：爱甩锅"
              />
            </div>
          </div>

          {/* 核心诉求 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              核心诉求 (选填)
            </label>
            <div className="mt-1 w-full min-h-[44px] flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 cursor-text">
              {formData.coreDemands.map(demand => (
                <span
                  key={demand}
                  className="flex items-center gap-1 bg-sky-100 text-sky-800 text-sm font-semibold px-2 py-1 rounded"
                >
                  <span>{demand}</span>
                  <button
                    onClick={() => removeCoreDemand(demand)}
                    className="w-4 h-4 rounded-full hover:bg-sky-200 flex items-center justify-center"
                    type="button"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={coreDemandInput}
                onChange={(e) => setCoreDemandInput(e.target.value)}
                onKeyPress={handleCoreDemandInputKeyPress}
                className="flex-grow bg-transparent outline-none text-sm p-1"
                placeholder="输入核心诉求后按回车，如：追求业绩增长"
              />
            </div>
          </div>

          {/* 过往关键事件 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              过往关键事件 (选填)
            </label>
            <textarea
              value={formData.keyEvents}
              onChange={(e) => setFormData(prev => ({ ...prev, keyEvents: e.target.value }))}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="例如：去年年会上公开表扬了我的项目成果"
            ></textarea>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonaModal;
