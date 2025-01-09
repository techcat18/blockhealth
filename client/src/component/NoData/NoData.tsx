interface Props {
  message: string;
}

export const NoData = ({ message }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-gray-500 text-xl font-semibold">{message}</p>
      </div>
    </div>
  );
};
