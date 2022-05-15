import { Context } from '..'

interface ProfileParentType {
  id: number
  bio: string
  userId: number
}

// 在Profile下查找用户信息，在parent中拿到用户的id
export const Profile = {
  user: (parent: ProfileParentType, __: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: parent.userId
      }
    })
  }
}
