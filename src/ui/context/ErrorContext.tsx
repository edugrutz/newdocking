import { createContext, useContext, useState } from 'react';
import ErrorPopup from '../pages/ErrorPopup';
import { ReactNode } from 'react';

const ErrorContext = createContext<{ showError: (message: string) => void; clearError: () => void } | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && <ErrorPopup message={error} onClose={clearError} />}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};