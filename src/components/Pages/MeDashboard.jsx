import React from 'react';
import { useNavigate } from 'react-router-dom';
import MindsetTrendChart from '../Charts/MindsetTrendChart';
import CommunicationStyleRadar from '../Charts/CommunicationStyleRadar';
import { ROUTES } from '../../router';

function MeDashboard() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header>
        <button
          type="button"
          onClick={handleBack}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
          返回
        </button>
        <h1 className="text-3xl font-bold text-slate-800">成长足迹</h1>
        <p className="text-slate-500 mt-2">你好，AI职场搭子将在这里陪伴你，见证你的每一步成长。</p>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-serif font-bold text-slate-700 mb-4">心态稳定性</h2>
        <p className="text-sm text-slate-500 mb-4">基于你的情绪记录和求助内容分析，反映你近期的心态波动情况。曲线越平稳，代表心态越稳定。</p>
        <MindsetTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-serif font-bold text-slate-700 mb-4">沟通风格进化</h2>
          <p className="text-sm text-slate-500 mb-4">基于你采纳的沟通方案，分析你的沟通风格转变。图形面积越大、越均衡，代表沟通能力越全面。</p>
          <CommunicationStyleRadar />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-xl font-serif font-bold text-slate-700 mb-4">AI的成长建议</h2>
          <div className="flex-grow p-4 bg-slate-50 rounded-lg text-slate-700 space-y-3 text-sm leading-relaxed">
            <p>AI职场搭子发现，最近一个月，你在处理<strong className="text-blue-600">【向上汇报】</strong>类问题时越来越自信了，选择「积极主动」风格的次数提升了30%。这是一个巨大的进步！</p>
            <p>同时，我注意到你在面对<strong className="text-amber-600">【跨部门沟通】</strong>时，似乎还是有些犹豫。或许可以多练习几次沟通场景预演，帮你找到更舒适的沟通节奏？</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeDashboard;
