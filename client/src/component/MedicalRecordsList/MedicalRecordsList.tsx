import { useEffect } from "react";
import { useStoreContext } from "../../store";
import { Dots } from "../Loaders";
import { DashboardError } from "../DashboardError";
import { NoData } from "../NoData";
import { observer } from "mobx-react";
import { Patient } from "../../types/Patient";

import editIcon from "../../img/edit.png";
import { Attachments } from "./Attachments";

interface Props {
  patient?: Patient;
}

export const MedicalRecordsList = observer(({ patient }: Props) => {
  const {
    contractStore: {
      medicalRecords,
      fetchOwnMedicalRecords,
      fetchPatientMedicalRecords,
      isFetching,
      dashboardError,
      setSelectedRecord,
      account,
    },
  } = useStoreContext();

  useEffect(() => {
    if (patient) {
      fetchPatientMedicalRecords(patient.addr);
    } else {
      fetchOwnMedicalRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient]);

  if (isFetching) {
    return <Dots />;
  }
  if (dashboardError) {
    return <DashboardError message={dashboardError} />;
  }
  if (!medicalRecords.length) {
    return <NoData message="No medical record found!" />;
  }

  return (
    <ul className="container mt-4 mx-auto">
      {medicalRecords.map((record, index) => (
        <li
          key={record.recordId}
          className="border p-4 mb-4 bg-slate-50 shadow-md rounded-md"
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-3xl font-bold ">Record #{record.recordId}</h2>
            {patient && (
              <button
                onClick={() => setSelectedRecord(record, index)}
                className="text-blue-500 p-2 rounded-xl hover:shadow-md hover:shadow-slate-700"
              >
                <img src={editIcon} alt="Edit" width={30} height={30} />
              </button>
            )}
          </div>
          <div className="mt-3">
            <p className="text-xl font-medium">{record.description}</p>
          </div>

          <Attachments
            record={{ ...record, index: index }}
            patientAddress={patient?.addr ?? account}
            canModify={!patient}
          />
        </li>
      ))}
    </ul>
  );
});
