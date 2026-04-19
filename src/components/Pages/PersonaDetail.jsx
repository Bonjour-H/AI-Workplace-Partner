import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

function PersonaDetail() {
  const { personaId } = useParams();
  const { personas } = useApp();
  
  const persona = personas.find(p => p.id === personaId);
  
  if (!persona) {
    return (
      <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
        <p className="text-slate-500">人员不存在</p>
      </div>
    );
  }

  return <Outlet context={{ persona }} />;
}

export default PersonaDetail; 