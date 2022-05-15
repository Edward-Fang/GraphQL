import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import { Query, Profile, Post, User, Mutation } from './resolvers'
import { PrismaClient, Prisma } from '@prisma/client'
import { getUserFromToken } from './utils/getUserFromToken'

export const prisma = new PrismaClient()

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
  userInfo: {
    userId: number
  } | null
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Profile,
    Post,
    User,
    Mutation
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization)
    return { prisma, userInfo }
  }
})
server.listen(3000, () => console.log('Server is ready'))
