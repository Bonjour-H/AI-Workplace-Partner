import React, { createContext, useContext, useReducer } from 'react';
import { mockPersonas, mockTags } from '../data/mockData';
import { InsightTabType } from '../types';

// 初始状态 - 简化为只保留必要的状态
const initialState = {
  // 数据
  personas: mockPersonas,
  tags: mockTags,
  
  // UI状态
  currentInsightTab: InsightTabType.REPORT,
  
  // 模态框状态
  isNewPersonaModalOpen: false,
  
  // 编辑状态
  isEditingInsights: false
};

// Action types - 只保留需要的actions
const ActionTypes = {
  SET_INSIGHT_TAB: 'SET_INSIGHT_TAB',
  TOGGLE_NEW_PERSONA_MODAL: 'TOGGLE_NEW_PERSONA_MODAL',
  ADD_PERSONA: 'ADD_PERSONA',
  UPDATE_PERSONA: 'UPDATE_PERSONA',
  ADD_SESSION: 'ADD_SESSION',
  ADD_ROUND: 'ADD_ROUND',
  TOGGLE_EDITING_INSIGHTS: 'TOGGLE_EDITING_INSIGHTS',
  REMOVE_PERSONA: 'REMOVE_PERSONA'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_INSIGHT_TAB:
      return {
        ...state,
        currentInsightTab: action.payload
      };
      
    case ActionTypes.TOGGLE_NEW_PERSONA_MODAL:
      return {
        ...state,
        isNewPersonaModalOpen: !state.isNewPersonaModalOpen
      };
      
    case ActionTypes.ADD_PERSONA:
      return {
        ...state,
        personas: [...state.personas, action.payload],
        isNewPersonaModalOpen: false
      };
      
    case ActionTypes.UPDATE_PERSONA:
      return {
        ...state,
        personas: state.personas.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
      
    case ActionTypes.ADD_SESSION:
      const updatedPersonas = state.personas.map(p => {
        if (p.id === action.payload.personaId) {
          return {
            ...p,
            sessions: [action.payload.session, ...p.sessions]
          };
        }
        return p;
      });
      return {
        ...state,
        personas: updatedPersonas
      };
      
    case ActionTypes.ADD_ROUND:
      const personasWithNewRound = state.personas.map(p => {
        if (p.id === action.payload.personaId) {
          const updatedSessions = p.sessions.map((session) => {
            if (session.sessionId === action.payload.sessionId) {
              return {
                ...session,
                rounds: [...session.rounds, action.payload.round]
              };
            }
            return session;
          });
          return { ...p, sessions: updatedSessions };
        }
        return p;
      });
      return {
        ...state,
        personas: personasWithNewRound
      };
      
    case ActionTypes.TOGGLE_EDITING_INSIGHTS:
      return {
        ...state,
        isEditingInsights: !state.isEditingInsights
      };

    case ActionTypes.REMOVE_PERSONA:
      return {
        ...state,
        personas: state.personas.filter(p => p.id !== action.payload)
      };
        
    default:
      return state;
  }
}

// Context
const AppContext = createContext();

// Provider组件
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Action creators
  const actions = {
    setInsightTab: (tab) => dispatch({ type: ActionTypes.SET_INSIGHT_TAB, payload: tab }),
    toggleNewPersonaModal: () => dispatch({ type: ActionTypes.TOGGLE_NEW_PERSONA_MODAL }),
    addPersona: (persona) => dispatch({ type: ActionTypes.ADD_PERSONA, payload: persona }),
    updatePersona: (id, updates) => dispatch({ type: ActionTypes.UPDATE_PERSONA, payload: { id, updates } }),
    addSession: (personaId, session) => dispatch({ type: ActionTypes.ADD_SESSION, payload: { personaId, session } }),
    addRound: (personaId, sessionId, round) => dispatch({ type: ActionTypes.ADD_ROUND, payload: { personaId, sessionId, round } }),
    toggleEditingInsights: () => dispatch({ type: ActionTypes.TOGGLE_EDITING_INSIGHTS }),
    removePersona: (personaId) => dispatch({ type: ActionTypes.REMOVE_PERSONA, payload: personaId })
  };
  
  const value = {
    ...state,
    actions
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
