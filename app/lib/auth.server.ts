import { PrismaClient } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  appName: 'Tanstack Start Hono Prisma',
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  /**
   * Set to false to prevent cross-subdomain cookies due to client and backoffice
   * @see https://www.better-auth.com/docs/reference/security#cookies
   */
  advanced: { crossSubDomainCookies: { enabled: true } },
  session: {
    /**
     * @see https://www.better-auth.com/docs/concepts/session-management#cookie-cache
     */
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})
