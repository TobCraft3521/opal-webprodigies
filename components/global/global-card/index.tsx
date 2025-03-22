import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import React from "react"

type Props = {
  title: string
  description: string
  children?: React.ReactNode
  footer?: React.ReactNode
}

const GlobalCard = ({ children, description, title, footer }: Props) => {
  return (
    <Card className="bg-transparent mt-4">
      <CardHeader className="p-4">
        <CardTitle className="text-base text-[#9D9D9D]">{title}</CardTitle>
        <CardDescription className="text-[#707070]">
          {description}
        </CardDescription>
      </CardHeader>
      {children && <div className="p-4">{children}</div>}
      {footer && <div className="p-4">{footer}</div>}
    </Card>
  )
}

export default GlobalCard
