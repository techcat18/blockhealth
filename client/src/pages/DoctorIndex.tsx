import { useEffect } from "react";
import { useStoreContext } from "../store";
import { Outlet } from "react-router-dom";

export const DoctorIndex = () => {
  const {
    contractStore: { fetchPatients },
  } = useStoreContext();

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
};
