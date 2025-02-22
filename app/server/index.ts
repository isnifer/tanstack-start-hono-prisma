import { Hono } from 'hono'
import type { AppTypings } from '@/typings/AppTypings'
import { auth } from '@/lib/auth.server'
import v1 from './v1'

BigInt.prototype.toJSON = function () {
  return this.toString()
}

const app = new Hono<AppTypings<'optional'>>()
  .basePath('/api')

  /**
   * Handle all requests to /api/auth/*
   * @see https://www.better-auth.com/docs/integrations/hono#mount-the-handler
   */
  .on(['POST', 'GET'], '/auth/*', c => auth.handler(c.req.raw))

  /**
   * Just a simple route to test the server
   */
  .get('/hello', c => c.json({ message: 'Hello World' }, 200))

  /**
   * Authentication middleware
   * All requests lower than this middleware are protected
   * @see https://www.better-auth.com/docs/integrations/hono#middleware
   */
  .use(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) {
      // Reset user and session
      c.set('user', null)
      c.set('session', null)

      return c.json({ message: 'Unauthorized' }, 401)
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return next()
  })

  .get('/protected', c => c.json({ message: 'Hello Protected World' }, 200))

  /**
   * API v1
   */
  .route('/v1', v1)

export default app

export type AppType = typeof app
