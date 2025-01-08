import { useState } from "react";
import { Gender } from "../types/Gender";
import { Formik, Form } from "formik";
import { InputField, SelectField } from "../component/Inputs";

type SwitchValue = "patient" | "doctor";

export const Register = () => {
  const [role, setRole] = useState<SwitchValue>("patient");
  const initialValues = {
    name: "",
    gender: Gender.Male,
    birthDate: new Date(),
  };

  return (
    <div className="h-screen flex items-center">
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole("patient")}
            className={`px-4 py-2 rounded-l-lg ${
              role == "patient" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setRole("doctor")}
            className={`px-4 py-2 rounded-r-lg ${
              role == "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Doctor
          </button>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              console.log(values);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Form>
            <div className="mb-4">
              <InputField label="Name" type="text" name="name" />
            </div>

            {role == "patient" && (
              <>
                <div className="mb-4">
                  <SelectField
                    label="Gender"
                    name="gender"
                    selectOptions={[
                      { label: "Male", value: Gender.Male },
                      { label: "Female", value: Gender.Female },
                      { label: "Other", value: Gender.Other },
                    ]}
                  />
                </div>
                <div className="mb-4">
                  <InputField label="Birth Date" type="date" name="birthdate" />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
