import { Context } from '..'

interface UserParentType {
  id: number
}

export const User = {
  posts: (parent: UserParentType, __: any, { prisma, userInfo }: Context) => {
    const isOwnProfile = parent.id === userInfo?.userId
    // 是本人的话展示所有，不是就展示已出版的
    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }
  }
}
