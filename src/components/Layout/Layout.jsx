import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames';
import Sidebar from './Sidebar';
import PersonaToolbar from './PersonaToolbar';
import PersonaModal from '../Modals/PersonaModal';

function Layout() {
  const location = useLocation();
  const { personaId } = useParams();

  const isDashboard =
    location.pathname === '/' || location.pathname === '/dashboard';
  const showPersonaToolbar = Boolean(personaId && !isDashboard);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex min-h-0">
        <aside className="w-60 bg-white border-r border-slate-200 flex-shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 min-w-0 flex flex-col min-h-0 bg-slate-50">
          {showPersonaToolbar && (
            <div className="flex-shrink-0 px-4 pt-4">
              <PersonaToolbar />
            </div>
          )}

          <div
            className={classNames('flex-1 min-h-0 overflow-y-auto', {
              'p-8 md:p-12': isDashboard,
              'p-4': !isDashboard
            })}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <PersonaModal />
    </div>
  );
}

export default Layout;
