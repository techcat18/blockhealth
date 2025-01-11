import * as Yup from "yup";
import { parse } from "date-fns";
import { Gender } from "../../types/Gender";

export const patientFormValidation = Yup.object({
  name: Yup.string().required("Required field"),
  gender: Yup.mixed<Gender>().oneOf(Object.values(Gender) as Gender[]),
  birthDate: Yup.date()
    .required("Required field")
    .transform(function (value, originalValue) {
      if (this.isType(value)) {
        return value;
      }
      const result = parse(originalValue, "dd.MM.yyyy", new Date());
      return result;
    })
    .typeError("Please enter a valid date")
    .min("1969-11-13", "Date is too early"),
});
