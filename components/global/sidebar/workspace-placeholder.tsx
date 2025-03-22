import React from "react"

type Props = {
  children: React.ReactNode
}

const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <div className="bg-[#545454] flex items-center font-bold justify-center w-8 px-2 h-7 rounded-sm text-[#1D1D1D]">
      {children}
    </div>
  )
}

export default WorkspacePlaceholder
