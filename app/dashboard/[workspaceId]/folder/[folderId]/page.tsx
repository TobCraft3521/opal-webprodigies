import FolderInfo from "@/components/global/folders/folder-info"
import { queryFolderInfo } from "@/lib/actions/folder"
import { getAllUserVideos } from "@/lib/actions/user"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import React from "react"

type Props = {
  params: {
    workspaceId: string
    folderId: string
  }
}

const FolderPage = async ({ params: { workspaceId, folderId } }: Props) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["folder-videos"],
    queryFn: () => getAllUserVideos(folderId),
  })
  await queryClient.prefetchQuery({
    queryKey: ["folder-info"],
    queryFn: () => queryFolderInfo(folderId),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FolderInfo folderId={folderId} />
      {/* <Videos /> */}
    </HydrationBoundary>
  )
}

export default FolderPage
