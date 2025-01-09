import { useEffect, useState } from "react";
import { useStoreContext } from "../store";
import { observer } from "mobx-react";
import { MedicalRecordsList } from "../component/MedicalRecordsList/MedicalRecordsList";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import arrow from "../img/arrow.png";
import { MedicalReportModal } from "../domain/MedicalReportModal";

export const PatientDetails = observer(() => {
  const navigate = useNavigate();
  const { address } = useParams();
  const {
    contractStore: {
      fetchPatientMedicalRecords,
      getSelectedPatient,
      selectedRecord,
      clearSelectedRecord,
    },
  } = useStoreContext();
  const selectedPatient = getSelectedPatient(address!);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPatientMedicalRecords(address!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!selectedPatient) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen">
      <main className="p-6 w-full flex flex-col">
        <div className="flex flex-row items-center px-4 mt-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-full shadow-sm hover:bg-zinc-50 duration-100"
          >
            <img src={arrow} alt="Go Back" width={42} height={42} />
          </button>

          <h2 className="text-4xl pl-32 mx-auto font-bold">
            Viewing medical records of patient {selectedPatient.name}
          </h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white w-40 px-4 py-2 rounded hover:bg-blue-800"
          >
            Add Report
          </button>
        </div>

        <MedicalRecordsList patient={selectedPatient} />
      </main>

      {isModalOpen && (
        <MedicalReportModal
          onClose={() => {
            setIsModalOpen(false);
            clearSelectedRecord();
          }}
          patient={selectedPatient}
          record={selectedRecord ?? undefined}
        />
      )}
    </div>
  );
});
