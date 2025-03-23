import CreateFolders from "@/components/global/create-folders"
import CreateWorkpsace from "@/components/global/create-workspace"
import Folders from "@/components/global/folders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react"

type Props = {
  params: {
    workspaceId: string
  }
}

const Page = ({ params }: Props) => {
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent gap-2 pl-0">
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              className="p-[13px] px-6 rounded-full data-[state=active]:bg-[#252525]"
              value="archieve"
            >
              Archieve
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-x-3">
            <CreateWorkpsace />
            <CreateFolders workspaceId={params.workspaceId} />
          </div>
        </div>
        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={params.workspaceId} />
          </TabsContent>
        </section>
      </Tabs>
    </div>
  )
}

export default Page
