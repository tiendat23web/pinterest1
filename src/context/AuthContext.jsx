import { createContext, useContext, useEffect, useState } from "react";
import { readTokensFromUrl } from "../services/readTokensFromUrl";
import { getProfileAPI, refreshTokenAPI } from "../services/api.services";

const contextCre = createContext();

export const AuthProvider = ({ children }) => {
  const [infoUser, setInfoUser] = useState();
  const [isLoading, setIsloading] = useState(true);
  const [isLogined, setIsLogined] = useState(false);
  const [userID, setUserID] = useState();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    // đăng nhập google
    const urlTokens = readTokensFromUrl();
    if (urlTokens?.access_token) {
      localStorage.setItem("access_token", urlTokens.access_token);
      if (urlTokens.refresh_token) {
        localStorage.setItem("refresh_token", urlTokens.refresh_token);
      }
    }

    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const UID = getSupabaseUid(accessToken);
      if (UID) {
        try {
          setUserID(UID);
          const res = await getProfileAPI(UID);
          setInfoUser(res[0]);
          setIsLogined(true);
          setIsloading(false);
        } catch (error) {
          console.log("dang chay refetoken");
          await refetTokent();
        }
      }
    } else {
      setIsLogined(false);
      setIsloading(false);
    }
  };

  const refetTokent = async () => {
    const refetToken = localStorage.getItem("refresh_token");
    if (refetToken) {
      try {
        const res = await refreshTokenAPI(refetToken);

        if (res) {
          localStorage.setItem("access_token", res.access_token);
          localStorage.setItem("refresh_token", res.refresh_token);
          await getUserInfo();
        }
      } catch (error) {
        setIsLogined(false);
        setIsloading(false);
      }
    } else {
      setIsLogined(false);
      setIsloading(false);
    }
  };

  const getSupabaseUid = (tokenStr) => {
    if (!tokenStr) return null;
    try {
      const payload = JSON.parse(atob(tokenStr.split(".")[1]));
      return payload.sub;
    } catch (error) {
      return null;
    }
  };

  const value = {
    infoUser,
    isLoading,
    isLogined,
    getUserInfo,
    userID,
  };
  return <contextCre.Provider value={value}>{children}</contextCre.Provider>;
};

export const useAuthContex = () => {
  const context = useContext(contextCre);
  if (!context) {
    console.log("error authContext");
  }
  return context;
};
