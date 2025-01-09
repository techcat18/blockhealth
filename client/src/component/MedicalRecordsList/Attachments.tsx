import { MedicalRecordWithIndex } from "../../types/MedicalRecord";
import { observer } from "mobx-react";
import { useStoreContext } from "../../store";
import { Spinner } from "../Loaders";
import { useState } from "react";
import { AddAttachmentForm } from "./AddAttachmentForm";

interface Props {
  canModify: boolean;
  patientAddress: string;
  record: MedicalRecordWithIndex;
}

export const Attachments = observer(
  ({ patientAddress, record, canModify = false }: Props) => {
    const {
      contractStore: { fetchRecordAttachments, isFetchingAttachments },
    } = useStoreContext();
    const [isFetched, setIsFetched] = useState(false);

    if (isFetchingAttachments) {
      return (
        <div className="p-4 mt-2 flex justify-center w-full">
          <Spinner />
        </div>
      );
    }

    if (!isFetched) {
      return (
        <button
          onClick={() => {
            fetchRecordAttachments(record.index, patientAddress);
            setIsFetched(true);
          }}
          className="text-xl w-full uppercase p-4 mt-2 rounded-lg hover:bg-stone-200 hover:underline"
        >
          Load Attachments
        </button>
      );
    }

    return (
      <div className="p-4 mt-2 flex flex-col items-center w-full">
        {record.attachments.length ? (
          <>
            <h2 className="mt-4 text-lg font-semibold">Attachments</h2>
            <ul className="list-disc ml-6">
              {(record.attachments ?? []).map((attachment) => (
                <li key={attachment.fileHash}>
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {attachment.fileUrl}
                  </a>
                  <br />
                  <span className="text-gray-500">({attachment.fileHash})</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h3 className="text-2xl">No attachments found</h3>
        )}

        {canModify && <AddAttachmentForm recordIndex={record.index} />}
      </div>
    );
  }
);
