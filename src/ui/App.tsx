import Home from "./components/Home";
import React, { useEffect, useState } from "react";
import { PageContext } from "./components/Contexts";
import { Preferences } from "./components/Preferences";
import { TPages } from "../lib/types";
// export react component
export default function App() {
  const [page, setPage] = useState<TPages>("home");

  useEffect(() => {
    window.electronAPI.onOpenSettings(() => {
      setPage("setting");
    });
  }, []);

  return (
    <>
      <PageContext.Provider value={{ page, setPage }}>
        <div className="relative h-[100vh] w-[100vw] overflow-hidden">
          <Home />
          <Preferences />
        </div>
      </PageContext.Provider>
    </>
  );
}
