export const ZapCell = ({
  name,
  index,
  onClick,
}: {
  name?: string;
  index: number;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="border-2 border-black rounded-lg py-6 sm:py-8 px-4 sm:px-8 flex w-full sm:w-[280px] md:w-[300px] max-w-[300px] justify-center cursor-pointer min-h-[60px] active:bg-slate-100 hover:bg-slate-50 transition-colors bg-white shadow-sm"
    >
      <div className="flex text-base sm:text-lg md:text-xl items-center">
        <span className="font-bold">{index}.</span>
        <span className="ml-2">{name}</span>
      </div>
    </div>
  );
};
