import { useEffect, useState } from "react";
import { useStoreContext } from "../store";
import { observer } from "mobx-react";
import { MedicalRecordsList } from "../component/MedicalRecordsList/MedicalRecordsList";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import arrow from "../img/arrow.png";
import { MedicalReportModal } from "../domain/MedicalReportModal";
import { Dots } from "../component/Loaders";
import { MedicalRecord } from "../types/MedicalRecord";

export const PatientDetails = observer(() => {
  const navigate = useNavigate();
  const { address } = useParams();
  const {
    contractStore: {
      patients,
      contract,
      selectedRecord,
      clearSelectedRecord,
      onMedicalRecordCreated,
      onMedicalRecordUpdated,
      isFetchingPatients,
    },
  } = useStoreContext();
  const selectedPatient = patients.find((p) => p.addr == address);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("effect");
    const onCreateSubscription = contract?.events["MedicalRecordCreated"]({});
    onCreateSubscription?.on("data", (data) => {
      onMedicalRecordCreated({
        ...(data.returnValues as MedicalRecord),
        recordId: Number(data.returnValues["recordId"]),
      });
    });
    const onUpdateSubscription = contract?.events["MedicalRecordUpdated"]({});
    onUpdateSubscription?.on("data", (data) => {
      onMedicalRecordUpdated({
        ...(data.returnValues as MedicalRecord),
        recordId: Number(data.returnValues["recordId"]),
        description: data.returnValues["newDescription"] as string,
      });
    });

    return () => {
      onCreateSubscription?.removeAllListeners();
      onUpdateSubscription?.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      setIsModalOpen(true);
    }
  }, [selectedRecord]);

  if (isFetchingPatients) {
    return <Dots />;
  }
  if (!selectedPatient) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen">
      <main className="p-6 w-full flex flex-col">
        <div className="flex flex-row items-center justify-between px-4 mt-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center p-2 rounded-full shadow-sm hover:bg-zinc-50 duration-100"
          >
            <img src={arrow} alt="Go Back" width={42} height={42} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white w-40 px-4 py-2 rounded hover:bg-blue-800"
          >
            Add Record
          </button>
        </div>

        <h1 className="text-4xl text-center font-bold mb-6">
          {selectedPatient.name} Medical Records
        </h1>

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
