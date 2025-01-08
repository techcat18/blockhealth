import { useField } from "formik";
import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

interface Props extends Omit<InputProps, "name" | "className"> {
  name: string;
  label: string;
}

export const InputField = ({ name, label, ...props }: Props) => {
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
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...props}
          {...field}
        />
      </div>
    </div>
  );
};
