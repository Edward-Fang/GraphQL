import { Post, Prisma } from '@prisma/client'
import { Context } from '../../index'
import { canUserMutatePost } from '../../utils/canUserMutatePost'

// 这里定义类型用小写，Schema那里用大写
interface PostArgs {
  post: {
    title?: string
    content?: string
  }
}

interface PostPayloadType {
  userErrors: {
    message: string
  }[]
  post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
  postCreate: (_: any, { post }: PostArgs, { prisma, userInfo }: Context): PostPayloadType => {
    // 先判断用户是否登录，登录才能创建
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated)'
          }
        ],
        post: null
      }
    }

    const { title, content } = post
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'You must provide title and content to post'
          }
        ],
        post: null
      }
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId
        }
      })
    }
  },

  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs['post'] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated)'
          }
        ],
        post: null
      }
    }

    // 再判断登陆的用户是否是创建的一致，一致才能修改或删除
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma
    })

    if (error) return error

    const { title, content } = post
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'Need to have at least a field to update'
          }
        ],
        post: null
      }
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    })
    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'This post does not exist'
          }
        ],
        post: null
      }
    }

    let payloadType = {
      title,
      content
    }
    if (!title) delete payloadType.title
    if (!content) delete payloadType.content
    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadType
        },
        where: {
          id: Number(postId)
        }
      })
    }
  },

  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated)'
          }
        ],
        post: null
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma
    })

    if (error) return error

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    })
    if (!post) {
      return {
        userErrors: [
          {
            message: 'This post does not exist'
          }
        ],
        post: null
      }
    }
    await prisma.post.delete({
      where: {
        id: Number(postId)
      }
    })
    return {
      userErrors: [],
      post
    }
  },

  postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated)'
          }
        ],
        post: null
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma
    })

    if (error) return error

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId)
        },
        data: {
          published: true
        }
      })
    }
  },

  postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context) => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated)'
          }
        ],
        post: null
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma
    })

    if (error) return error

    return {
      userErrors: [],
      post: prisma.post.update({
        where: {
          id: Number(postId)
        },
        data: {
          published: false
        }
      })
    }
  }
}
