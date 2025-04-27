"use client"
import { useQueryData } from "@/hooks/useQueryData"
import { queryFolderInfo } from "@/lib/actions/folder"
import React from "react"
import { FoldersProps } from "."
import { FolderProps } from "@/lib/types/index.type"

type Props = {
  folderId: string
}

const FolderInfo = ({ folderId }: Props) => {
  const { data } = useQueryData(["folder-info"], () =>
    queryFolderInfo(folderId)
  )
  const { data: folder } = data as FolderProps

  return (
    <div className="flex items-center">
      <h2 className="text-[#bdbdbd] text-2xl">{folder.name}</h2>
    </div>
  )
}

export default FolderInfo
