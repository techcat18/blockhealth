import { useStoreContext } from "../store";
import { observer } from "mobx-react";
import { MedicalRecordsList } from "../component/MedicalRecordsList/MedicalRecordsList";
import { Field, Form, Formik } from "formik";

export const PatientDashboard = observer(() => {
  const {
    contractStore: { authorizeDoctor },
    snackBarStore: { showSnackBar },
  } = useStoreContext();

  return (
    <div className="flex h-screen">
      <main className="p-6 w-full flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-3xl font-bold mb-6">Medical Records</h2>

          <Formik
            initialValues={{ address: "" }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (!values.address) {
                showSnackBar("Doctor address can't be empty", "warning");
                return;
              }

              await authorizeDoctor(values.address).then(() => {
                resetForm();
                setSubmitting(false);
              });
            }}
          >
            <Form className="flex h-8 w-1/2 ">
              <Field
                type="text"
                name="address"
                placeholder="Doctor Address"
                className="border border-gray-300 border-r-0 px-2 flex-grow focus:border-gray-600 outline-none"
              />
              <button type="submit" className="bg-blue-500 text-white px-2 ">
                Authorize
              </button>
            </Form>
          </Formik>
        </div>

        <MedicalRecordsList />
      </main>
    </div>
  );
});
