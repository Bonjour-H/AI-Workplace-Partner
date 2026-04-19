import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';
import { useApp } from '../../contexts/AppContext';
import { ROUTES } from '../../router';
import DeletePersonaConfirmModal from '../Modals/DeletePersonaConfirmModal';

function AppBrand() {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 pb-4 mb-3 border-b border-slate-200">
      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">职</span>
      </div>
      <span className="font-semibold text-slate-800 leading-tight">AI职场搭子</span>
    </div>
  );
}

function Sidebar() {
  const { personas, actions } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const { personaId: activePersonaId } = useParams();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const isGrowthActive =
    location.pathname === '/' || location.pathname === '/dashboard';

  const pendingPersona = pendingDeleteId
    ? personas.find((p) => p.id === pendingDeleteId)
    : null;

  const openDeleteModal = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    const remaining = personas.filter((p) => p.id !== id);
    actions.removePersona(id);
    setPendingDeleteId(null);
    if (activePersonaId === id) {
      if (remaining.length > 0) {
        navigate(ROUTES.PERSONA(remaining[0].id));
      } else {
        navigate(ROUTES.HOME);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-4 min-h-0">
      <AppBrand />

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
        {personas.map((persona) => {
          const { initial, bgColor, textColor } = persona.avatar;
          const personaPath = ROUTES.PERSONA(persona.id);
          const isActive = location.pathname.startsWith(personaPath);

          return (
            <div
              key={persona.id}
              className={classNames(
                'group flex items-stretch gap-1 rounded-lg border transition-colors',
                {
                  'bg-blue-50 border-blue-200': isActive,
                  'border-transparent hover:bg-slate-50': !isActive
                }
              )}
            >
              <Link
                to={personaPath}
                className="p-3 flex flex-1 min-w-0 items-center gap-3 rounded-lg"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  {initial}
                </div>
                <div className="flex-grow overflow-hidden text-left">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {persona.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {persona.title}
                    {persona.tags?.[0] ? ` · ${persona.tags[0]}` : ''}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                title="删除人物"
                onClick={(e) => openDeleteModal(e, persona.id)}
                className="flex-shrink-0 px-2 my-2 mr-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => actions.toggleNewPersonaModal()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 p-3 text-slate-600 transition-colors hover:bg-slate-50"
        >
          <span className="text-lg">+</span>
          <span className="text-sm font-medium">添加人物</span>
        </button>
      </div>

      <div className="flex-shrink-0 mt-4 pt-2 border-t border-slate-100">
        <Link
          to={ROUTES.DASHBOARD}
          className={classNames(
            'group flex w-full items-center gap-3 rounded-xl border border-slate-200 border-l-4 border-l-blue-600 bg-white py-3 px-4 shadow-md transition-all',
            'hover:border-blue-300 hover:bg-blue-50/90 hover:shadow-lg',
            {
              'ring-2 ring-blue-400 ring-offset-2 ring-offset-white bg-blue-50/80 border-l-blue-600 border-blue-300':
                isGrowthActive
            }
          )}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg text-white shadow-sm group-hover:bg-blue-700">
            👣
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-bold text-slate-900">成长足迹</p>
            <p className="truncate text-xs text-slate-500 group-hover:text-slate-600">
              查看成长趋势与建议
            </p>
          </div>
          <span className="flex-shrink-0 text-slate-400 transition group-hover:text-blue-600">
            ›
          </span>
        </Link>
      </div>

      <DeletePersonaConfirmModal
        open={Boolean(pendingDeleteId)}
        personaName={pendingPersona?.name}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Sidebar;
