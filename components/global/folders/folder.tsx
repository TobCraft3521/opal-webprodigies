"use client"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import React, { FocusEvent, useRef, useState } from "react"
import Loader from "../loader"
import FolderDuotone from "@/components/icons/folder-duotone"
import { useMutationData } from "@/hooks/useMutationData"
import { renameFolders } from "@/lib/actions/workspace"
import { Input } from "@/components/ui/input"
import { useQueryClient } from "@tanstack/react-query"

type Props = {
  name: string
  id: string
  optimistic?: boolean
  count?: number
}

const Folder = ({ name, id, optimistic, count }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const folderCardRef = useRef<HTMLDivElement | null>(null)

  const pathName = usePathname()
  const router = useRouter()
  const [onRename, setOnRename] = useState(false)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutationData(
    ["rename-folders"],
    (data: { name: string }) => {
     queryClient.setQueryData(
      ["workspace-folders"],
      (oldData: any) => {
        if (!oldData) return oldData
        const newData = oldData.map((folder: any) => {
          if (folder.id === id) {
            return { ...folder, name: data.name }
          }
          return folder
        })
        return newData
      }
     )
     return renameFolders(id, data.name)
    },
    "workspace-folders",
    () => {
      setOnRename(false)
    }
  )

  const handleFolderClick = () => {
    router.push(`${pathName}/folder/${id}`)
  }

  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation()
    setOnRename(true)
  }

  const updateFolderName = (e: FocusEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      if (inputRef.current.value) {
        mutate({ name: inputRef.current.value })
      } else {
        setOnRename(false)
      }
    }
  }
  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        optimistic && "opacity-60",
        "flex hover:bg-neutral-800 cursor-pointer transition duration-150 items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg border-[1px]"
      )}
    >
      <Loader state={false}>
        <div className="flex flex-col gap-[1px]">
          {onRename ? (
            <Input
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onBlur={(e) => updateFolderName(e)}
              placeholder="Folder name"
              className="border-none text-base w-full ring-transparent text-neutral-300 bg-transparent p-0 cursor-default"
              ref={inputRef}
            />
          ) : (
            <p
              onDoubleClick={handleNameDoubleClick}
              onClick={(e) => e.stopPropagation()}
              className="text-neutral-300 cursor-auto"
            >
              {name}
            </p>
          )}
          <span className="text-sm text-neutral-500">{count || 0} videos</span>
        </div>
      </Loader>
      <FolderDuotone />
    </div>
  )
}

export default Folder
