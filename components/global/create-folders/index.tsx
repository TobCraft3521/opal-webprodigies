"use client"
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone"
import { Button } from "@/components/ui/button"
import { useCreateFolders } from "@/hooks/useCreateFolders"
import React from "react"

type Props = {
  workspaceId: string
}

const CreateFolders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId)

  return (
    <Button
      className="bg-[#1d1d1d] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl"
      onClick={onCreateNewFolder}
    >
      <FolderPlusDuotine />
      Create A Folder
    </Button>
  )
}

export default CreateFolders
