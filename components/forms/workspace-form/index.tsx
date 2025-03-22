import { useCreateWorkspace } from "@/hooks/useCreateWorkspace"
import React from "react"

type Props = {}

const WorkspaceForm = (props: Props) => {
  const { errors, onFormSubmit, isPending, register } = useCreateWorkspace()
  return <form onSubmit={onFormSubmit} className="flex flex-col gap-y-3"></form>
}

export default WorkspaceForm
