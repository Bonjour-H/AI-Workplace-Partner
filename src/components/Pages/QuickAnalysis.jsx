import React, { useState, useRef, useLayoutEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import classNames from 'classnames';
import { useApp } from '../../contexts/AppContext';
import { createSession, createRound } from '../../types';
import { requestCoachAnalysis } from '../../services/bigmodelChat';
import { showToast } from '../Common/Toast';
import { ROUTES } from '../../router';

const TEXTAREA_MIN_PX = 52;
const TEXTAREA_MAX_PX = 160;

function QuickAnalysis() {
  const { personaId } = useParams();
  const navigate = useNavigate();
  const { persona } = useOutletContext();
  const { actions } = useApp();
  const [analysisInput, setAnalysisInput] = useState('');
  const [selectedIntentTag, setSelectedIntentTag] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const MAX_SCREENSHOT_BYTES = 10 * 1024 * 1024;

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(
      Math.max(el.scrollHeight, TEXTAREA_MIN_PX),
      TEXTAREA_MAX_PX
    );
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > TEXTAREA_MAX_PX ? 'auto' : 'hidden';
  }, [analysisInput]);

  if (!persona) {
    return (
      <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
        <p className="text-slate-500">请选择一个分析对象</p>
      </div>
    );
  }

  const intentTags = [
    { id: 'help', label: '话术求助', icon: '💡' },
    { id: 'reflect', label: '复盘反思', icon: '🔄' },
    { id: 'vent', label: '情绪吐槽', icon: '💭' },
    { id: 'consult', label: '向上沟通', icon: '📈' }
  ];

  const handleIntentTagClick = (tagId) => {
    setSelectedIntentTag(selectedIntentTag === tagId ? '' : tagId);
  };

  const readScreenshotFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('请上传图片文件（如 PNG、JPG）。', 'error');
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      showToast('图片不能超过 10MB。', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotPreview(reader.result);
      }
    };
    reader.onerror = () => showToast('读取图片失败，请重试。', 'error');
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) readScreenshotFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readScreenshotFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const clearScreenshot = () => {
    setScreenshotPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    const hasText = !!analysisInput.trim();
    const hasScreenshot = !!screenshotPreview;
    if (!hasText && !hasScreenshot) {
      showToast('请输入内容或上传截图后再分析。', 'error');
      return;
    }

    const apiKey = (process.env.REACT_APP_BIGMODEL_API_KEY || '').trim();
    if (!apiKey) {
      showToast('请先在项目根目录 .env 中配置 REACT_APP_BIGMODEL_API_KEY。', 'error');
      return;
    }

    await handleCreateAnalysisSession();
  };

  const handleCreateAnalysisSession = async () => {
    const allSelectedTags = [];
    if (selectedIntentTag) {
      const intentTag = intentTags.find(t => t.id === selectedIntentTag);
      if (intentTag) {
        allSelectedTags.push(intentTag.label);
      }
    }

    setIsAnalyzing(true);
    try {
      const analysis = await requestCoachAnalysis({
        personaName: persona.name,
        userText: analysisInput.trim(),
        userContextTags: allSelectedTags,
        imageDataUrl: screenshotPreview,
      });

      const newRound = createRound(
        analysisInput.trim(),
        allSelectedTags,
        analysis,
        screenshotPreview
      );
      const newSession = createSession('新建的分析会话');
      newSession.rounds = [newRound];

      actions.addSession(personaId, newSession);
      navigate(ROUTES.ANALYSIS_RESULT(personaId, newSession.sessionId, newRound.roundId));
      showToast('分析完成！', 'success');

      setAnalysisInput('');
      setSelectedIntentTag('');
      setScreenshotPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const msg = err?.message || '分析失败，请稍后重试。';
      showToast(msg, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = !!(analysisInput.trim() || screenshotPreview);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 pb-2">
        <div className="max-w-4xl mx-auto pt-3">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                  <div className="text-3xl">🤔</div>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-200 rounded-full flex items-center justify-center text-xs">
                  💭
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">后来怎样了</h1>
              <p className="text-slate-600 text-base sm:text-lg leading-snug">
                上次你说想申请调组，这件事后来有新的进展吗？别自己扛，随时和我说说...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {intentTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleIntentTagClick(tag.id)}
                className={classNames(
                  "px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
                  {
                    'bg-blue-100 border-blue-300 text-blue-800': selectedIntentTag === tag.id,
                    'bg-white border-slate-300 text-slate-600 hover:bg-slate-50': selectedIntentTag !== tag.id
                  }
                )}
              >
                <span className="mr-1.5">{tag.icon}</span>
                {tag.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={classNames(
                'relative rounded-lg border-2 border-dashed py-3 px-4 text-center transition-colors cursor-pointer select-none',
                dragOver
                  ? 'border-blue-400 bg-blue-50/80'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/80'
              )}
            >
              {screenshotPreview ? (
                <div
                  className="relative inline-block max-w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={screenshotPreview}
                    alt="截图预览"
                    className="max-h-40 max-w-full rounded-lg border border-slate-200 object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearScreenshot();
                    }}
                    className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    移除截图
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-9 h-9 mx-auto mb-1.5 bg-slate-200 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-700">点击或拖拽上传截图</p>
                  <p className="text-xs text-slate-500 mt-0.5">支持常见图片格式，单张不超过 10MB</p>
                </>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={analysisInput}
              onChange={(e) => setAnalysisInput(e.target.value)}
              rows={1}
              className="w-full min-h-[52px] max-h-[160px] text-sm sm:text-base bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none placeholder:text-slate-400 overflow-hidden"
              placeholder="补充对话文字（可选，可与截图同时使用）"
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 pt-1 pb-3">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className={classNames(
              "w-full py-3.5 rounded-xl font-bold text-base sm:text-lg transition-all shadow-md",
              {
                'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg': canAnalyze && !isAnalyzing,
                'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none': !canAnalyze || isAnalyzing
              }
            )}
          >
            <span className="mr-2">{isAnalyzing ? '…' : '▶'}</span>
            {isAnalyzing ? '分析中…' : '开始分析'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickAnalysis;
