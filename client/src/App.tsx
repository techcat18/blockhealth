import { observer } from "mobx-react";
import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { useStoreContext } from "./store";

import { Index } from "./pages/Index";
import { Register } from "./pages/Register";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { PatientDashboard } from "./pages/PatientDashboard";

import { Dots } from "./component/Loaders";
import { PrivateRoute } from "./component/PrivateRoute";
import { SnackBar } from "./component/SnackBar";
import { PatientDetails } from "./pages/PatientDetails";
import { DoctorIndex } from "./pages/DoctorIndex";

export const App = observer(() => {
  const location = useLocation();
  const {
    contractStore: { loadBlockchainData, account, state, error, userRole },
  } = useStoreContext();

  useEffect(() => {
    loadBlockchainData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state == "error" && error) {
    return (
      <div className="flex items-center">
        <h1 className="text-6xl text-red-600">{error}</h1>
      </div>
    );
  }

  if (state == "done" && !account) {
    return (
      <div className="flex flex-col  items-center">
        <h1 className="text-6xl">Cryptocurrency wallet not found!</h1>
        <h2 className="mt-4 text-4xl">
          Please consider using <a href="https://metamask.io/">MetaMask</a>
        </h2>
      </div>
    );
  }

  if (state != "done") {
    return <Dots />;
  }

  return (
    <Suspense fallback={<Dots />}>
      <Routes>
        <Route index element={<Index userRole={userRole} />} />
        <Route
          path="register"
          element={
            <PrivateRoute isAllowed={userRole == "unregistered"} redirect="/">
              <Register />
            </PrivateRoute>
          }
        />

        <Route
          path="doctor"
          element={
            <PrivateRoute
              isAllowed={userRole == "doctor"}
              redirect={location.state?.from || "/"}
            >
              <DoctorIndex />
            </PrivateRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path=":address" element={<PatientDetails />} />
        </Route>
        <Route
          path="patient"
          element={
            <PrivateRoute
              isAllowed={userRole == "patient"}
              redirect={location.state?.from || "/"}
            >
              <PatientDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      <SnackBar />
    </Suspense>
  );
});
