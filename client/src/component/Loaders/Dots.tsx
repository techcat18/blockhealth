export const Dots = () => {
  return (
    <div className="flex space-x-2 justify-center mt-12 bg-white">
      <span className="sr-only">Loading...</span>
      <div className="h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
      <div className="h-5 w-5 bg-black rounded-full animate-bounce [animation-delay:-0.1s]"></div>
      <div className="h-5 w-5 bg-black rounded-full animate-bounce"></div>
    </div>
  );
};
