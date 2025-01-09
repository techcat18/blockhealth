import { useEffect } from "react";
import { useStoreContext } from "../store";
import { observer } from "mobx-react";
import { MedicalRecordsList } from "../component/MedicalRecordsList/MedicalRecordsList";

export const PatientDashboard = observer(() => {
  const {
    contractStore: { fetchOwnMedicalRecords },
  } = useStoreContext();

  useEffect(() => {
    fetchOwnMedicalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen">
      <main className="p-6 w-full">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-6">Medical Records</h2>

          <div className="flex h-8">
            <input
              type="text"
              placeholder="Doctor Address"
              className="border border-gray-300 border-r-0 px-2 flex-grow focus:border-gray-600 outline-none"
            />
            <button className="bg-blue-500 text-white px-2 ">Authorize</button>
          </div>
        </div>

        <MedicalRecordsList />
      </main>
    </div>
  );
});
