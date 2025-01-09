import { Formik, Form } from "formik";
import { Gender } from "../types/Gender";
import { DateField, InputField, SelectField } from "../component/Inputs";
import { patientFormValidation } from "./vallidators/PatientFormValidation";
import { doctorFormValidation } from "./vallidators/DoctorFormValidation";
import { observer } from "mobx-react";
import { useStoreContext } from "../store";
import { Spinner } from "../component/Loaders";

interface Props {
  mode: "patient" | "doctor";
}

export const RegisterForm = observer(({ mode }: Props) => {
  const {
    contractStore: {
      registerDoctor,
      registerPatient,
      registrationError,
      isRegistrationRequested,
    },
  } = useStoreContext();
  const initialValues = {
    name: "",
    gender: Gender.Male,
    birthdate: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        mode === "patient" ? patientFormValidation : doctorFormValidation
      }
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (mode == "doctor") {
            await registerDoctor({ name: values.name });
            return;
          }
          await registerPatient({
            addr: "",
            ...values,
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <Form className="space-y-3">
        <InputField label="Name" type="text" name="name" />

        {mode == "patient" && (
          <>
            <SelectField
              label="Gender"
              name="gender"
              selectOptions={[
                { label: "Male", value: Gender.Male },
                { label: "Female", value: Gender.Female },
                { label: "Other", value: Gender.Other },
              ]}
            />
            <DateField label="Birth Date" name="birthdate" />
          </>
        )}

        {!isRegistrationRequested && registrationError && (
          <h1 className="text-red-600">{registrationError}</h1>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isRegistrationRequested ? <Spinner /> : "Register"}
        </button>
      </Form>
    </Formik>
  );
});
