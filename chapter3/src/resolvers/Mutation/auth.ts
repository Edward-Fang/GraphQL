import { Context } from '../../index'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import { JSON_SIGNATURE } from '../../keys'

interface SignupArgs {
  credentials: {
    email: string
    password: string
  }
  name: string
  bio: string
}

interface SigninArgs {
  credentials: {
    email: string
    password: string
  }
}

interface UserPayload {
  userErrors: {
    message: string
  }[]
  token: string | null
}

export const authResolvers = {
  signUp: async (_: any, { credentials, name, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
    const { email, password } = credentials
    const isEmail = validator.isEmail(email)
    if (!isEmail) {
      return {
        userErrors: [
          {
            message: 'Invalid email'
          }
        ],
        token: null
      }
    }

    const isInvalidPassword = validator.isLength(password, { min: 5, max: 12 })
    if (!isInvalidPassword) {
      return {
        userErrors: [
          {
            message: 'Invalid password'
          }
        ],
        token: null
      }
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: 'Invalid name or bio'
          }
        ],
        token: null
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    })

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id
      }
    })

    return {
      userErrors: [],
      token: await JWT.sign({ userId: user.id }, JSON_SIGNATURE, { expiresIn: 360000 })
    }
  },

  signIn: async (_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<UserPayload> => {
    const { email, password } = credentials

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      return {
        userErrors: [
          {
            message: 'Invalid Credentials'
          }
        ],
        token: null
      }
    }

    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      return {
        userErrors: [
          {
            message: 'Invalid Credentials'
          }
        ],
        token: null
      }
    }

    return {
      userErrors: [],
      token: await JWT.sign({ userId: user.id }, JSON_SIGNATURE, { expiresIn: 360000 })
    }
  }
}
