import { queryOptions } from '@tanstack/react-query'
import { getHeaders } from '@tanstack/start/server'
import { createAuthClient } from 'better-auth/react'
import type { Session, User } from 'better-auth/types'

export type Credentials = null | {
  user: User
  session: Session
}

const auth = createAuthClient({ baseURL: import.meta.env.VITE_API_URL })

export default auth

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: () => {
      const headers = typeof window === 'undefined' ? getHeaders() : new Headers()
      return auth.getSession({ fetchOptions: { headers: headers as HeadersInit } })
    },
    staleTime: Infinity,
  })
