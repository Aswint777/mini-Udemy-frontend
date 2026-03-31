import { useEffect, useState } from "react";
import { checkAuth } from "../checkAuth";
import { Navigate, Outlet } from "react-router-dom";

function PublicRoute() {
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

  if (loading) return <h2>Loading...</h2>;

  return isAuth ? <Navigate to="/home" replace /> : <Outlet />;
}

export default PublicRoute;
