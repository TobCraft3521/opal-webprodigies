"use server"

import { db } from "../db"

export const queryFolderInfo = async (folderId: string) => {
  const folder = await db.folder.findUnique({
    where: {
      id: folderId,
    },
    select: {
      name: true,
      _count: {
        select: {
          videos: true,
        },
      },
    },
  })

  if (!folder)
    return {
      status: 404,
      data: null,
    }
  return {
    status: 200,
    data: folder,
  }
}
