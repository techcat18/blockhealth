import { Navigate } from "react-router-dom";
import { UserRole } from "../types/UserRole";

export const Index = ({ userRole }: { userRole: UserRole }) => {
  switch (userRole) {
    case "doctor":
      return <Navigate to="/doctor" />;
    case "patient":
      return <Navigate to="/patient" />;
    default:
      return <Navigate to="/register" />;
  }
};
