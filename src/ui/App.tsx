import Home from './components/Home';
import React, { createContext, useEffect, useState } from 'react';
import { PageContext } from './components/Contexts';
import { Preferences } from './components/Preferences';
// export react component
export default function App() {
  const [page, setPage] = useState<'home' | 'setting'>('home');

  useEffect(() => {
    window.electronAPI.onOpenSettings(() => {
      setPage('setting');
    });
  }, []);

  return (
    <>
      <PageContext.Provider value={{ page, setPage }}>
        {page === 'setting' ? (
          <Preferences />
        ) : page === 'home' ? (
          <Home />
        ) : null}
      </PageContext.Provider>
    </>
  );
}
