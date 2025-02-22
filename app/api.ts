import { createStartAPIHandler } from '@tanstack/start/api'
import server from './server'

export default createStartAPIHandler(({ request }) =>
  server.fetch(request, { NODE_ENV: process.env.NODE_ENV })
)
