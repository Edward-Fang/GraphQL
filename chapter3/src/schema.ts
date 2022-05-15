import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Query {
    posts: [Post!]!
    me: User
    profile(userId: ID!): Profile
  }

  type Mutation {
    # create和update一样内容可选，但是create某项为空会被捕捉
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postPublish(postId: ID!): PostPayload!
    postUnpublish(postId: ID!): PostPayload!
    signUp(credentials: CredentialInput!, name: String!, bio: String!): AuthPayload!
    signIn(credentials: CredentialInput!): AuthPayload!
  }

  # 不一定要和数据库中的字段对应
  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  type CredentialInput {
    email: String!
    password: String!
  }
`
