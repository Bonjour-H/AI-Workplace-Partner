import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { ROUTES } from '../../router';

function PersonaToolbar() {
  const navigate = useNavigate();
  const { personaId } = useParams();
  const { personas } = useApp();

  const currentPersona = personas.find((p) => p.id === personaId);
  if (!currentPersona) {
    return null;
  }

  const healthScore =
    currentPersona.relationship?.score != null
      ? currentPersona.relationship.score
      : 78;

  const hasSessions =
    currentPersona.sessions && currentPersona.sessions.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50/80 px-4 py-3.5 shadow-md flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3 min-w-0">
        <h1 className="text-xl font-bold text-slate-800 truncate">
          {currentPersona.name}
        </h1>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm text-slate-700 border border-blue-100">
          <span className="text-slate-600">关系健康度</span>
          <span className="font-bold text-blue-700 tabular-nums">{healthScore}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled={!hasSessions}
          onClick={() => {
            if (!hasSessions) return;
            const latestSession = currentPersona.sessions[0];
            const latestRound =
              latestSession.rounds[latestSession.rounds.length - 1];
            navigate(
              ROUTES.ANALYSIS_RESULT(
                personaId,
                latestSession.sessionId,
                latestRound.roundId
              )
            );
          }}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-600 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          查看记录
        </button>

        <button
          type="button"
          onClick={() => navigate(ROUTES.PERSONA_INSIGHTS(personaId))}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          深度档案
        </button>
      </div>
    </div>
  );
}

export default PersonaToolbar;
