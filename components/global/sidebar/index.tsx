"use client"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useQueryData } from "@/hooks/useQueryData"
import { getWorkSpaces } from "@/lib/actions/workspace"
import { NotificationProps, WorkspaceProps } from "@/lib/types/index.type"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Modal from "../modal"
import { Menu, PlusCircle } from "lucide-react"
import WorkspaceSearch from "../search"
import Search from "../search"
import { MENU_ITEMS } from "@/lib/constants"
import SidebarItem from "./sidebar-item"
import { getNotifications } from "@/lib/actions/user"
import WorkspacePlaceholder from "./workspace-placeholder"
import GlobalCard from "../global-card"
import { Button } from "@/components/ui/button"
import Loader from "../loader"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import InfoBar from "../info-bar"

type Props = {
  activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()
  const pathName = usePathname()

  const { data, isFetched } = useQueryData(["user-workspaces"], () =>
    getWorkSpaces()
  )
  const { data: notifications } = useQueryData(["user-notifications"], () =>
    getNotifications()
  )
  const menuItems = MENU_ITEMS(activeWorkspaceId)
  const { data: workspace } = data as WorkspaceProps
  const { data: count } = notifications as NotificationProps

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`)
  }

  const currentWorkspace = workspace.workspace.find((s) => {
    s.id === activeWorkspaceId
  })

  const SidebarSection = (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0">
        <Image src="/opal-logo.svg" width={40} height={40} alt="logo" />
        <p className="text-2xl">Opal</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem value={workspace.id} key={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.Workspace && (
                    <SelectItem
                      value={workspace.Workspace.id}
                      key={workspace.Workspace.id}
                    >
                      {workspace.Workspace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspace.subscription?.plan === "PRO" && (
          <Modal
            trigger={
              <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
                <PlusCircle
                  size={15}
                  className="text-neutral-800/90 fill-neutral-500"
                />
                <span className="text-neutral-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              key={item.title}
              href={item.href}
              icon={item.icon}
              title={item.title}
              selected={pathName === item.href}
              notifications={
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notifications) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Workspaces</p>
      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full -mt-[10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No workspaces"}
          </p>
        </div>
      )}
      <nav className="w-full">
        <ul className="h-[100px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    key={item.id}
                    title={item.name}
                    notifications={0}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}
          {/* member of */}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.Workspace.id}`}
                selected={pathName === `/dashboard/${item.Workspace.id}`}
                key={item.Workspace.id}
                title={item.Workspace.name}
                notifications={0}
                icon={
                  <WorkspacePlaceholder>
                    {item.Workspace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>
      <Separator className="w-4/5" />
      {workspace.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI featres like transcription, AI summary and more."
        >
          <Button className="text-sm w-full mt-2">
            <Loader color="#000" state={false}>Upgrade</Loader>
          </Button>
        </GlobalCard>
      )}
    </div>
  )

  return (
    <div className="full">
      {/* infobar */}
      <InfoBar />
      {/* sheet */}
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  )
}

export default Sidebar
