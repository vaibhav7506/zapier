

export const Feature = ({title, subtitle}: {
    title: string,
    subtitle: string
}) => {
    return <div className="flex pl-4 sm:pl-8 items-center">
        <Check />
        <div className="flex flex-col justify-center pl-2">
            <div className="flex flex-wrap">
                <span className="font-bold text-sm">{title}</span>
                <span className="pl-1 text-sm">{subtitle}</span>
            </div>
        </div>
    </div>
}

function Check () {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
  
}