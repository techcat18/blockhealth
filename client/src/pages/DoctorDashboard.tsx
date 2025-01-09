import { useStoreContext } from "../store";
import { PatientsList } from "../domain/PatientsList";
import { observer } from "mobx-react";

export const DoctorDashboard = observer(() => {
  const {
    contractStore: { setPatientsFilter, patientsFilter },
  } = useStoreContext();

  return (
    <div className="flex h-screen">
      <main className="p-6 w-full flex flex-col">
        <h2 className="text-4xl font-bold mb-6">Patients</h2>

        <div className="mb-6 max-w-xl">
          <input
            value={patientsFilter}
            placeholder="Search patients..."
            onChange={(e) => setPatientsFilter(e.target.value)}
            className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:border-gray-900 outline-none"
          />
        </div>

        <PatientsList />
      </main>
    </div>
  );
});
