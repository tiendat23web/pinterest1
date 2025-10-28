import { createContext, useContext, useState } from "react";

const appContext = createContext();

export const AppProvaider = ({ children }) => {
  const [isLoginModal, setIsLoginModal] = useState(true);
  const value = {
    isLoginModal,
    setIsLoginModal,
  };
  return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(appContext);
  if (!context) {
    console.log("error appContex");
  }
  return context;
};
