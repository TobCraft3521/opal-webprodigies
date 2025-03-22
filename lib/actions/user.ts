"use server"

import { currentUser } from "@clerk/nextjs/server"
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service"
import { db } from "@/lib/db"

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 403 }

    const existingUser = await db.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    })

    if (existingUser) {
      return { status: 200, user: existingUser }
    }

    const newUser = await db.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })
    if (newUser) {
      return { status: 201, user: newUser }
    }
    return { status: 400 }
  } catch (error) {
    return { status: 500 }
  }
}

export const getNotifications = async () => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const notifications = await db.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    })

    if (notifications && notifications.notification.length > 0) {
      return { status: 200, data: notifications }
    }
    return { status: 404, data: [] }
  } catch (error) {
    return { status: 400, data: [] }
  }
}

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }
    const videos = await db.video.findMany({
      where: {
        OR: [
          {
            workSpaceId,
          },
          {
            folderId: workSpaceId,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    })
    if (videos && videos.length > 0)
      return {
        status: 200,
        data: videos,
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

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser()
    if (!user) return { status: 404 }

    const users = await db.user.findMany({
      where: {
        OR: [
          {
            firstname: {
              contains: query,
            },
          },
          {
            lastname: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
        NOT: [
          {
            clerkid: user.id,
          },
        ],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    })

    if (users && users.length > 0) {
      return {
        status: 200,
        data: users,
      }
    }

    return {
      status: 404,
      data: undefined,
    }
  } catch (error) {
    return {
      status: 500,
      data: undefined,
    }
  }
}
