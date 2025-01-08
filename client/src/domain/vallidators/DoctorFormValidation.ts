import * as Yup from "yup";

export const doctorFormValidation = Yup.object({
  name: Yup.string().required("Required field"),
});
