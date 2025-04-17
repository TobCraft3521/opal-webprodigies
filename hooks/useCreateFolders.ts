import { createFolder } from "@/lib/actions/workspace"
import { useMutationData } from "./useMutationData"

export const useCreateFolders = (workspaceId: string) => {
  const { mutate } = useMutationData(
    ["create-folder"],
    () => createFolder(workspaceId),
    "workspace-folders"
  )

  const onCreateNewFolder = () =>
    mutate({ name: "New Folder", id: "optimistic-ui" })

  return {
    onCreateNewFolder,
  }
}
