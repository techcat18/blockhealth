export const AddAttachmentModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h3 className="text-lg font-bold mb-4">Add Attachment</h3>
        <input
          type="text"
          placeholder="File URL"
          className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
        />
        <input
          type="text"
          placeholder="File Hash"
          className="w-full border border-gray-300 rounded px-2 py-1 mb-4"
        />
        <div className="flex justify-end gap-4">
          <button className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
