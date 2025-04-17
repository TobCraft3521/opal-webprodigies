"use client"
import FolderDuotone from "@/components/icons/folder-duotone"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import React from "react"
import Folder from "./folder"
import { useQueryData } from "@/hooks/useQueryData"
import { getWorkspaceFolders } from "@/lib/actions/workspace"
import { useMutationDataState } from "@/hooks/useMutationData"

type Props = {
  workspaceId: string
}

export type FoldersProps = {
  status: number
  data: ({
    _count: {
      videos: number
    }
  } & {
    id: string
    name: string
    createdAt: Date
    workSpaceId: string | null
  })[]
}

const Folders = ({ workspaceId }: Props) => {
  // Get folders
  const { data, isFetched, isPending } = useQueryData(
    ["workspace-folders"],
    async () => {
      return await getWorkspaceFolders(workspaceId)
    }
  )

  const { data: folders = [], status } = (data || {}) as FoldersProps

  const { latestVariables } = useMutationDataState(["create-folder"])
  // if (isFetched && folders) {
  // }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FolderDuotone />
          <h2 className="text-[#BDBDBD] text-xl">Folders</h2>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[#BDBDBD]">See all</p>
          <ArrowRight color="#707070" />
        </div>
      </div>
      <section
        className={cn(
          status !== 200 && "justify-center",
          "flex items-center gap-4 overflow-x-auto w-full"
        )}
      >
        {status !== 200 ? (
          <p className="text-neutral-300">No folders in workspace</p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic={true}
              />
            )}
            {folders?.map((folder) => (
              <Folder
                key={folder.id}
                name={folder.name}
                id={folder.id}
                count={folder._count.videos}
              />
            ))}
          </>
        )}
      </section>
    </div>
  )
}

export default Folders
