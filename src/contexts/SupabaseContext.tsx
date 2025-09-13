"use client";

import React, { createContext, useContext } from 'react';
import { useSupabase } from '@/hooks/useSupabase';

const SupabaseContext = createContext<ReturnType<typeof useSupabase> | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabaseContext must be used within SupabaseProvider');
  }
  return context;
}