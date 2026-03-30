import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearStoredUserInfo,
  getStoredUserInfo,
  setStoredUserInfo,
  subscribeToAuthChange,
} from "../utils/authStorage";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [userInfo, setUserInfoState] = useState(getStoredUserInfo);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChange((nextUserInfo) => {
      setUserInfoState(nextUserInfo);
    });

    const syncFromStorage = () => {
      setUserInfoState(getStoredUserInfo());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", syncFromStorage);
    }

    return () => {
      unsubscribe();

      if (typeof window !== "undefined") {
        window.removeEventListener("storage", syncFromStorage);
      }
    };
  }, []);

  const setUserInfo = (nextUserInfo) => {
    setStoredUserInfo(nextUserInfo);
  };

  const logout = () => {
    clearStoredUserInfo();
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        setUserInfo,
        logout,
        isAuthenticated: Boolean(userInfo?.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
