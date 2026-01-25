import { createContext, useContext, useState, useEffect } from "react";

const CursorContext = createContext({
  customCursor: true,
  setCustomCursor: () => {},
  toggleCursor: () => {},
});

const STORAGE_KEY = "tigger-custom-cursor";

export function CursorProvider({ children }) {
  const [customCursor, setCustomCursor] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(customCursor));
    } catch {}
  }, [customCursor]);

  const toggleCursor = () => setCustomCursor((prev) => !prev);

  return (
    <CursorContext.Provider
      value={{ customCursor, setCustomCursor, toggleCursor }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) {
    throw new Error("useCursor must be used within a CursorProvider");
  }
  return context;
}
