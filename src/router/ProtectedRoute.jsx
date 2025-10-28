import React, { useEffect } from "react";
import { useAuthContex } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../component/Loading";

function ProtectedRoute({ children }) {
  const { isLogined, isLoading } = useAuthContex();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center w-full">
        <Loading />
      </div>
    );
  }

  if (!isLogined) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
