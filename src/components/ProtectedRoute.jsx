import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children
}) {

  const session =
    localStorage.getItem(
      "healthpal_session"
    );

  if (!session) {

    return (
      <Navigate
        to="/"
      />
    );
  }

  return children;
}