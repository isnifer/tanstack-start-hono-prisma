import type { RequestIdVariables } from 'hono/request-id'
import { auth } from '@/lib/auth.server'

export type AppTypings<T extends 'required' | 'optional'> = {
  Variables: RequestIdVariables & {
    user: T extends 'required'
      ? typeof auth.$Infer.Session.user
      : typeof auth.$Infer.Session.user | null
    session: T extends 'required'
      ? typeof auth.$Infer.Session.session
      : typeof auth.$Infer.Session.session | null
  }
}
