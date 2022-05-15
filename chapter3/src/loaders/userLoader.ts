import { User } from '.prisma/client'
import DataLoader from 'dataloader'
import { prisma } from '..'

type BatchUser = (ids: number[]) => Promise<User[]>

// 找到所有作者
const batchUsers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids
      }
    }
  })

  // 按照顺序返回作者数组
  const userMap: { [key: string]: User } = {}
  users.forEach((user) => (userMap[user.id] = user))

  return ids.map((id) => userMap[id])
}

// @ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers)

// ids: [1, 3, 2]

// [{id: 2}, {id: 1}, {id: 3}]

// {
//   1: {id: 1},
//   2: {id: 2},
//   3: {id: 3}
// }
