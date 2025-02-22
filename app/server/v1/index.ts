import { Hono } from 'hono'
import wallet from './wallet'

const v1 = new Hono()

  /**
   * Wallet routes
   */
  .route('/wallet', wallet)

export default v1
