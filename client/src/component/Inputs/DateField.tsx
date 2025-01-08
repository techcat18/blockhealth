import { useField } from "formik";
import InputMask from "react-input-mask";

interface Props {
  name: string;
  label: string;
}

export const DateField = ({ name, label }: Props) => {
  const [field, meta] = useField(name);

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      {meta.touched && meta.error && (
        <div className="text-sm absolute text-red-600 top-2 right-0">
          {meta.error}
        </div>
      )}
      <div className="mt-2">
        <InputMask
          {...field}
          mask="99.99.9999"
          placeholder="DD/MM/YYYY"
          className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
};
