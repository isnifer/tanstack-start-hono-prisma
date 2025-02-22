import { getHeaders } from '@tanstack/start/server'
import { hc } from 'hono/client'
import type { AppType } from '../server'

const isServer = typeof window === 'undefined'

const apiClient = hc<AppType>(import.meta.env.VITE_API_URL, {
  init: { credentials: 'include' },
  headers: async () => {
    if (isServer) {
      return {
        ...getHeaders(),
        'Access-Control-Allow-Origin': '*',
      }
    }

    return {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  },
})

export default apiClient
