import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  isAllowed: boolean;
  redirect?: string;
}

export const PrivateRoute = ({
  isAllowed,
  redirect = "/login",
  children,
}: PropsWithChildren<Props>) => {
  if (!isAllowed) {
    return <Navigate to={redirect} replace />;
  }

  return children || <Outlet />;
};
