import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-300">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mt-4">页面未找到</h2>
          <p className="text-slate-500 mt-2">
            抱歉，您访问的页面不存在。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
          
          {error && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                技术详情
              </summary>
              <pre className="mt-2 p-4 bg-slate-100 rounded text-xs text-slate-600 overflow-auto">
                {error.statusText || error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorPage; 