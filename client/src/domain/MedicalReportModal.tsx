import { Formik, Form } from "formik";
import Modal from "../component/Modal/Modal";
import { MedicalRecordWithIndex } from "../types/MedicalRecord";
import { useStoreContext } from "../store";
import { TextAreaField } from "../component/Inputs/TextAreaField";
import { Patient } from "../types/Patient";

interface Props {
  onClose: () => void;
  patient: Patient;
  record?: MedicalRecordWithIndex;
}

export const MedicalReportModal = ({ onClose, patient, record }: Props) => {
  const {
    contractStore: { createMedicalRecord, updateMedicalRecord },
  } = useStoreContext();

  return (
    <Modal onClose={onClose}>
      <h3 className="text-4xl text-center font-semibold mb-4">
        Medical Report for {patient.name}
      </h3>
      <Formik
        initialValues={{ description: record?.description ?? "" }}
        validate={(values) =>
          values.description ? {} : { description: "Required field!" }
        }
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (record) {
              await updateMedicalRecord(patient.addr, values.description);
            } else {
              await createMedicalRecord(patient.addr, values.description);
            }
          } finally {
            setSubmitting(false);
            onClose();
          }
        }}
      >
        <Form className="flex flex-col content-center">
          <div className="my-5">
            <TextAreaField
              placeholder="Describe here patient symptoms, diagnosis and treatment..."
              name="description"
              rows={7}
            />
          </div>
          <button
            type="submit"
            className="mx-auto text-2xl w-1/2 bg-green-500 hover:bg-green-900 text-white px-4 py-2 rounded-md"
          >
            {record ? "SAVE" : "CREATE"}
          </button>
        </Form>
      </Formik>
    </Modal>
  );
};
