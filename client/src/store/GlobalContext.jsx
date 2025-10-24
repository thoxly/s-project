// contexts/GlobalStateContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

// Начальное состояние
const initialState = {
  sidebarOpen: false,
  sidebarData: null,
};

// Редюсер
function globalReducer(state, action) {
  switch (action.type) {
    case 'OPEN_SIDEBAR':
      return {
        ...state,
        sidebarOpen: true,
        sidebarData: action.payload,
      };
    case 'CLOSE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: false,
        sidebarData: null,
      };
    default:
      return state;
  }
}

// Создаём контекст
const GlobalStateContext = createContext(undefined);

// Хук для удобного использования
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within GlobalStateProvider');
  }
  return context;
};

// Провайдер
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};