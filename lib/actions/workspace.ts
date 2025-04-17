"use server"

import { currentUser } from "@clerk/nextjs/server"
import { db } from "../db"

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const isUserInWorkspace = await db.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    })
    return {
      status: 200,
      data: {
        workspace: isUserInWorkspace,
      },
    }
  } catch (error) {
    return {
      status: 403,
      data: {
        workspace: null,
      },
    }
  }
}

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const folders = await db.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    })
    if (folders && folders.length)
      return {
        status: 200,
        data: folders,
      }

    return {
      status: 404,
      data: [],
    }
  } catch (error) {
    console.log(error, "error")
    return {
      status: 403,
      data: [],
    }
  }
}

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const workspaces = await db.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })
    if (workspaces)
      return {
        status: 200,
        data: workspaces,
      }

    return {
      status: 404,
    }
  } catch (error) {
    return {
      status: 400,
    }
  }
}

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const authorized = await db.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    if (authorized?.subscription?.plan === "FREE") return { status: 403 }
    const workspace = await db.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        workspace: {
          create: {
            name,
            type: "PUBLIC",
          },
        },
      },
    })
    if (workspace)
      return {
        status: 200,
        data: "Workspace created successfully",
      }

    return {
      status: 401,
      data: "Failed to create workspace",
    }
  } catch (error) {
    return {
      status: 400,
    }
  }
}

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await db.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    })

    if (folder) return { status: 200, data: "Folder renamed successfully" }
    return { status: 400, data: "Folder does not exist" }
  } catch (error) {
    return { status: 500, data: "Oops! Failed to rename folder" }
  }
}

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await db.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: {
            name: "New Folder",
          },
        },
      },
    })

    if (isNewFolder) return { status: 200, data: "Folder created successfully" }
  } catch (error) {
    return { status: 500, data: "Oops! Failed to create folder" }
  }
}
