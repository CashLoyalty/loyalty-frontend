import React, { createContext, useEffect, useState, ReactNode } from "react";
import { Platform } from "react-native";

interface GlobalContextType {
  toastHeight: number;
}

const defaultValue: GlobalContextType = {
  toastHeight: 0,
};

export const GlobalContext = createContext<GlobalContextType>(defaultValue);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [toastHeight, setToastHeight] = useState<number>(0);

  useEffect(() => {
    if (Platform.OS === "android") {
      setToastHeight(40);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ toastHeight: toastHeight }}>
      {children}
    </GlobalContext.Provider>
  );
};
