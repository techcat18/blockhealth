import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  onClose: () => void;
}

const Modal = ({ children, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-4xl rounded-full hover:bg-slate-200 w-10 h-10"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
