import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ROUTES } from '../../router';

function InsightReport() {
  const { personaId } = useParams();
  const navigate = useNavigate();
  const { persona } = useOutletContext();

  if (!persona) {
    return (
      <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
        <p className="text-slate-500">请选择一个分析对象</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(ROUTES.PERSONA_ANALYSIS(personaId))}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            返回快捷分析
          </button>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-3xl font-bold text-slate-800">{persona.name}的AI洞察报告</h1>
        </div>
      </header>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-serif font-bold text-slate-700 mb-4">深度档案功能</h2>
        <p className="text-slate-500">洞察报告页面正在开发中...</p>
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-700">沟通风格画像</h3>
            <p className="text-sm text-slate-500 mt-1">待实现</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-700">核心驱动力与目标</h3>
            <p className="text-sm text-slate-500 mt-1">待实现</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-700">雷区与甜点区</h3>
            <p className="text-sm text-slate-500 mt-1">待实现</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InsightReport; 