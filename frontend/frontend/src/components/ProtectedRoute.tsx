import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const isAuth = localStorage.getItem("token"); // guardado tras login

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

