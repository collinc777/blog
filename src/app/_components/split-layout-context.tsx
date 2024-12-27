'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type SplitLayoutContextType = {
  rightPaneContent: ReactNode | null;
  setRightPaneContent: (content: ReactNode | null) => void;
};

const SplitLayoutContext = createContext<SplitLayoutContextType | undefined>(undefined);

export function SplitLayoutProvider({ children }: { children: ReactNode }) {
  const [rightPaneContent, setRightPaneContent] = useState<ReactNode | null>(null);

  return (
    <SplitLayoutContext.Provider value={{ rightPaneContent, setRightPaneContent }}>
      {children}
    </SplitLayoutContext.Provider>
  );
}

export function useRightPane() {
  const context = useContext(SplitLayoutContext);
  if (context === undefined) {
    throw new Error('useRightPane must be used within a SplitLayoutProvider');
  }
  return context;
}
