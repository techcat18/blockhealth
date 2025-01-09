import { useField } from "formik";
import { TextareaHTMLAttributes } from "react";

type InputProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

interface Props extends Omit<InputProps, "name" | "className"> {
  name: string;
}

export const TextAreaField = ({ name, ...props }: Props) => {
  const [field, meta] = useField(name);

  return (
    <div className="relative">
      {meta.touched && meta.error && (
        <div className="text-lg absolute text-red-600 -top-7 right-1">
          {meta.error}
        </div>
      )}
      <div className="mt-2">
        <textarea
          {...props}
          {...field}
          className="block w-full rounded-md border-0 py-2 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
        />
      </div>
    </div>
  );
};
