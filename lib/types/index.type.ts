export type WorkspaceProps = {
  data: {
    subscription: {
      plan: "FREE" | "PRO"
    } | null
    workspace: {
      id: string
      name: string
      type: "PUBLIC" | "PERSONAL"
    }[]
    members: {
      Workspace: {
        id: string
        name: string
        type: "PUBLIC" | "PERSONAL"
      }
    }[]
  }
}

export type NotificationProps = {
  status: number
  data: {
    _count: {
      notifications: number
    }
  }
}

export type FolderProps = {
  status: number
  data: {
    id: string
    name: string
    _count: {
      videos: number
    }
  }
}
