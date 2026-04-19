import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ROUTES } from '../../router';

function buildLegacySituationText(situationAnalysis) {
  if (!situationAnalysis?.sections?.length) return '';
  return situationAnalysis.sections
    .map((sec) => {
      const lines = [sec.subtitle, ...(sec.points || [])].filter(Boolean);
      return lines.join('\n');
    })
    .join('\n\n');
}

function AnalysisResultBody({ analysis }) {
  if (!analysis) {
    return <p className="text-slate-500 text-sm">暂无分析数据</p>;
  }

  if (Array.isArray(analysis.suggestedReplies) && analysis.suggestedReplies.length > 0) {
    const first = analysis.suggestedReplies[0];
    const situationText = buildLegacySituationText(analysis.situationAnalysis);
    return (
      <>
        {analysis.thinkingProcess ? (
          <p className="text-slate-600 text-sm mb-4 whitespace-pre-wrap">{analysis.thinkingProcess}</p>
        ) : null}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2">建议话术方案</h4>
            <div className="p-3 bg-white rounded border text-sm whitespace-pre-wrap">{first.text}</div>
            {first.style ? <p className="text-xs text-slate-500 mt-2">{first.style}</p> : null}
          </div>
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2">
              {analysis.situationAnalysis?.title || '当前情况分析'}
            </h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{situationText || '—'}</p>
          </div>
        </div>
      </>
    );
  }

  if (analysis.fallbackText) {
    return (
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-sm text-amber-900 font-medium mb-2">模型返回未能解析为结构化 JSON，原文如下：</p>
        <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans overflow-x-auto max-h-96 overflow-y-auto">
          {analysis.fallbackText}
        </pre>
      </div>
    );
  }

  const intro = typeof analysis.intro === 'string' ? analysis.intro.trim() : '';
  const suggestedReply = typeof analysis.suggestedReply === 'string' ? analysis.suggestedReply.trim() : '';
  const situationAnalysis =
    typeof analysis.situationAnalysis === 'string' ? analysis.situationAnalysis.trim() : '';

  if (!intro && !suggestedReply && !situationAnalysis) {
    return <p className="text-slate-500 text-sm">暂无有效分析内容</p>;
  }

  return (
    <>
      {intro ? <p className="text-slate-600 mb-4 whitespace-pre-wrap">{intro}</p> : null}
      <div className="space-y-4">
        {suggestedReply ? (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2">建议话术方案</h4>
            <div className="p-3 bg-white rounded border text-sm whitespace-pre-wrap">{suggestedReply}</div>
          </div>
        ) : null}
        {situationAnalysis ? (
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700 mb-2">当前情况分析</h4>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{situationAnalysis}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}

function AnalysisResult() {
  const { personaId, sessionId, roundId } = useParams();
  const navigate = useNavigate();
  const { personas } = useApp();
  
  const persona = personas.find(p => p.id === personaId);
  const session = persona?.sessions?.find(s => s.sessionId === sessionId);
  const round = session?.rounds?.find(r => r.roundId === roundId);

  if (!persona || !session || !round) {
    return (
      <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
        <p className="text-slate-500">没有找到分析数据</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex bg-slate-100">
      <div className="w-72 h-full bg-white border-r border-slate-200 p-2 flex flex-col">
        <div className="p-3 mb-2 flex-shrink-0">
          <button 
            onClick={() => navigate(ROUTES.PERSONA_ANALYSIS(personaId))}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            返回
          </button>
          <h1 className="text-xl font-bold text-slate-800 mt-4">关于「{persona.name}」的咨询记录</h1>
        </div>
                  <div className="flex-grow overflow-y-auto space-y-1">
            <div className="p-3 rounded-lg cursor-pointer transition-colors bg-blue-600 text-white">
              <p className="text-sm font-semibold truncate">{session.sessionTitle}</p>
              <p className="text-xs text-blue-200">{session.sessionDate}</p>
            </div>
          </div>
      </div>

      <div className="flex-grow h-full flex flex-col relative bg-slate-100">
        <div className="flex-grow overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8 md:p-12 space-y-6">
            <div className="text-center text-sm text-slate-400 font-semibold">
              {session.sessionTitle} ( 1 / 1 )
            </div>
            
            <div className="flex justify-end pr-16 md:pr-0">
              <div className="max-w-[85%]">
                <div className="bg-blue-100 text-blue-900 p-4 rounded-xl w-fit max-w-full text-left">
                  {round.screenshotDataUrl && (
                    <div className="mb-3">
                      <img
                        src={round.screenshotDataUrl}
                        alt="咨询截图"
                        className="max-w-full max-h-64 rounded-lg border border-blue-200 object-contain"
                      />
                    </div>
                  )}
                  {round.userInput?.trim() ? (
                    <p className="whitespace-pre-wrap">{round.userInput}</p>
                  ) : !round.screenshotDataUrl ? (
                    <p className="text-blue-800/70 text-sm">（无文字说明）</p>
                  ) : null}
                  {(round.userContext || []).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-blue-200 flex flex-wrap gap-2">
                      {(round.userContext || []).map(tag => (
                        <span key={tag} className="text-xs font-semibold px-2 py-1 bg-blue-200 text-blue-800 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ml-16 md:ml-0">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-serif font-bold text-slate-800 mb-4">分析结果</h3>
                <AnalysisResultBody analysis={round.analysis} />
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

export default AnalysisResult; 