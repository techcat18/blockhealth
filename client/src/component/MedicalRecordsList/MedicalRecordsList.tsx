import { useEffect } from "react";
import { useStoreContext } from "../../store";
import { Dots } from "../Loaders";
import { DashboardError } from "../DashboardError";
import { NoData } from "../NoData";
import { observer } from "mobx-react";

export const MedicalRecordsList = observer(() => {
  const {
    contractStore: {
      medicalRecords,
      selectedPatient,
      fetchOwnMedicalRecords,
      fetchPatientMedicalRecords,
      isFetching,
      dashboardError,
    },
  } = useStoreContext();

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientMedicalRecords(selectedPatient.addr);
    } else {
      fetchOwnMedicalRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

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
    <ul>
      {medicalRecords.map((record) => (
        <li key={record.recordId} className="mb-4 border-b pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Record #{record.recordId}</h3>
              <p className="text-sm text-gray-500">{record.description}</p>
            </div>
            <button className="text-blue-500 underline">Expand</button>
          </div>
          {true && (
            <div className="mt-4">
              <h4 className="font-medium">Attachments:</h4>
              <ul className="mt-2 mb-4">
                {(attachments[record.recordId] || []).map(
                  (attachment, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.fileHash}
                      </a>
                    </li>
                  )
                )}
              </ul>
              {!selectedPatient && (
                <button className="bg-green-500 text-white px-4 py-1 rounded">
                  Add Attachment
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
});
