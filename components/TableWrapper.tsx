import { ReactNode } from "react"

interface TableWrapperProps {
  children: ReactNode;
  currentIndex: number;
}

export const TableWrapper = ({ children, currentIndex }: TableWrapperProps) => {
  return (<div className="flex flex-col gap-2">
    <button
      type="button"
      className="bg-black text-white px-2 py-1 rounded-md"
      onClick={() => console.log(`Table index: ${currentIndex}`)}
    >
      Show Chart
    </button>
    {children}
  </div>
  )
}
