import { observer } from "mobx-react";
import { useStoreContext } from "../store";
import { Dots } from "../component/Loaders";
import { DashboardError } from "../component/DashboardError";
import { NoData } from "../component/NoData";
import { differenceInCalendarYears, parse } from "date-fns";
import { Link } from "react-router-dom";
import { Gender } from "../types/Gender";

const calculateAge = (birthDate: string) => {
  const birth = parse(birthDate, "dd.mm.yyyy", new Date());
  const age = differenceInCalendarYears(Date.now(), birth);
  return age;
};

export const PatientsList = observer(() => {
  const {
    contractStore: {
      isFetching: isFetchingPatients,
      filteredPatients,
      dashboardError: fetchingPatientsError,
    },
  } = useStoreContext();

  if (isFetchingPatients) {
    return <Dots />;
  }
  if (fetchingPatientsError) {
    return <DashboardError message={fetchingPatientsError} />;
  }
  if (!filteredPatients.length) {
    return <NoData message="No patients found!" />;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {filteredPatients.map((patient) => (
        <Link
          to={patient.addr}
          key={patient.name}
          className="border p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
        >
          <p className="font-bold">{patient.name}</p>
          <p>Age: {calculateAge(patient.birthDate)}</p>
          <p>Gender: {Gender[patient.gender]}</p>
        </Link>
      ))}
    </ul>
  );
});
