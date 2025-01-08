import { useState } from "react";
import { RegisterForm } from "../domain/RegisterForm";

type Mode = "patient" | "doctor";

export const Register = () => {
  const [mode, setMode] = useState<Mode>("patient");

  return (
    <div className="h-screen flex items-center">
      <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setMode("patient")}
            className={`px-4 py-2 rounded-l-lg ${
              mode == "patient" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Patient
          </button>
          <button
            onClick={() => setMode("doctor")}
            className={`px-4 py-2 rounded-r-lg ${
              mode == "doctor" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Doctor
          </button>
        </div>
        <RegisterForm mode={mode} />
      </div>
    </div>
  );
};
