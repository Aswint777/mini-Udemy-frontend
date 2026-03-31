import { useEffect, useState } from "react";
import { checkAuth } from "../checkAuth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await checkAuth();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  if (loading) return <h2>Checking authentication...</h2>;

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
