interface Props {
  message: string;
}

export const NoData = ({ message }: Props) => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center ">
      <div className="text-center">
        <p className="text-gray-500 text-xl font-semibold">{message}</p>
      </div>
    </div>
  );
};
