const AUTH_STORAGE_KEY = "userInfo";
const listeners = new Set();

const notifyAuthChange = (nextUserInfo) => {
  listeners.forEach((listener) => {
    listener(nextUserInfo);
  });
};

export const getStoredUserInfo = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedUserInfo = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  } catch (_error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getAuthToken = () => getStoredUserInfo()?.token || "";

export const setStoredUserInfo = (nextUserInfo) => {
  if (typeof window !== "undefined") {
    if (nextUserInfo) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUserInfo));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  notifyAuthChange(nextUserInfo || null);
};

export const clearStoredUserInfo = () => {
  setStoredUserInfo(null);
};

export const subscribeToAuthChange = (listener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};
