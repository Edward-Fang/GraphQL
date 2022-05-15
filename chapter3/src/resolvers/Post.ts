import { Context } from '..'
import { userLoader } from '../loaders/userLoader'

interface PostParentType {
  authorId: number
}

// 在进行以下搜索时： {
//   post{
//     user{
//       id
//     }
//   }
// }
// 搜索文章时都会搜索一次作者，利用缓存解决
export const Post = {
  user: (parent: PostParentType, __: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId)
  }
}
