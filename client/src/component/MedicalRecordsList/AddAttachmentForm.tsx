import * as Yup from "yup";
import { Form, Formik } from "formik";
import { InputField } from "../Inputs";
import { useStoreContext } from "../../store";
import { format } from "date-fns";

interface Props {
  recordIndex: number;
}

export const AddAttachmentForm = ({ recordIndex }: Props) => {
  const {
    contractStore: { addAttachmentToRecord },
  } = useStoreContext();
  const initialValues = {
    url: "",
    hash: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        url: Yup.string().required("Required field").url("Invalid url"),
        hash: Yup.string()
          .required("Required field")
          .matches(/\b[0-9a-f]{5,40}\b/, "Invalid SHA-1 hash"),
      })}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          await addAttachmentToRecord(recordIndex, {
            fileUrl: values.url,
            fileHash: values.hash,
            timestamp: format(new Date(), "dd.mm.yyyy"),
          });
        } finally {
          setSubmitting(false);
          resetForm();
        }
      }}
    >
      <Form className="mt-4 flex flex-col space-y-2">
        <div className="flex flex-row space-x-2">
          <InputField type="text" label="Attachment URL" name="url" />
          <InputField type="text" label="SHA-1 hash" name="hash" />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Attachment
        </button>
      </Form>
    </Formik>
  );
};
