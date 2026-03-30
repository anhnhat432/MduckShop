import { clearStoredUserInfo } from "./authStorage.js";

const AUTH_PAGE_PATHS = new Set(["/login", "/register"]);

export const shouldHandleUnauthorizedError = (error) =>
  error?.response?.status === 401 &&
  Boolean(error?.config?.headers?.Authorization) &&
  !error?.config?.skipAuthHandling;

export const buildLoginRedirectUrl = (locationLike) => {
  const pathname = locationLike?.pathname || "/";
  const search = locationLike?.search || "";

  if (AUTH_PAGE_PATHS.has(pathname)) {
    return null;
  }

  const redirectPath = `${pathname}${search}` || "/";
  return `/login?redirect=${encodeURIComponent(redirectPath)}`;
};

export const handleUnauthorizedError = ({
  error,
  clearAuth = clearStoredUserInfo,
  redirect = (nextUrl) => {
    if (typeof window !== "undefined") {
      window.location.assign(nextUrl);
    }
  },
  locationLike = typeof window !== "undefined" ? window.location : null,
}) => {
  if (!shouldHandleUnauthorizedError(error)) {
    return false;
  }

  clearAuth();

  const loginRedirectUrl = buildLoginRedirectUrl(locationLike);

  if (loginRedirectUrl) {
    redirect(loginRedirectUrl);
  }

  return true;
};
