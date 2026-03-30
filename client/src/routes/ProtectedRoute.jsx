import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { userInfo } = useAuth();

  if (!userInfo?.token) {
    const redirectPath = `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
