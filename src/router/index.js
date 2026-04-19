import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import MeDashboard from '../components/Pages/MeDashboard';
import PersonaDetail from '../components/Pages/PersonaDetail';
import QuickAnalysis from '../components/Pages/QuickAnalysis';
import InsightReport from '../components/Pages/InsightReport';
import AnalysisResult from '../components/Pages/AnalysisResult';
import ErrorPage from '../components/Pages/ErrorPage';

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MeDashboard />
      },
      {
        path: 'dashboard',
        element: <MeDashboard />
      },
      {
        path: 'persona/:personaId',
        element: <PersonaDetail />,
        children: [
          {
            index: true,
            element: <QuickAnalysis />
          },
          {
            path: 'analysis',
            element: <QuickAnalysis />
          },
          {
            path: 'insights',
            element: <InsightReport />
          },
          {
            path: 'session/:sessionId/round/:roundId',
            element: <AnalysisResult />
          }
        ]
      }
    ]
  }
]);

// 路由路径常量
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PERSONA: (personaId) => `/persona/${personaId}`,
  PERSONA_ANALYSIS: (personaId) => `/persona/${personaId}/analysis`,
  PERSONA_INSIGHTS: (personaId) => `/persona/${personaId}/insights`,
  ANALYSIS_RESULT: (personaId, sessionId, roundId) => `/persona/${personaId}/session/${sessionId}/round/${roundId}`
};
