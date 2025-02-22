import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import type { AppTypings } from '@/typings/AppTypings'
import prisma from '@/lib/prisma.server'

const wallet = new Hono<AppTypings<'required'>>()

  /**
   * Get wallet balance
   */
  .get('/balance', async c => {
    const userId = c.get('user').id
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { balance: true },
    })

    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    const balance = user.balance
    const formattedBalance = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(balance) / 100)

    return c.json({ item: formattedBalance }, 200)
  })

  /**
   * Get wallet transactions
   */
  .get('/transactions', async c => {
    const userId = c.get('user').id
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        type: true,
        createdAt: true,
      },
    })

    return c.json({ items: transactions }, 200)
  })

  /**
   * Add money to wallet
   */
  .post('/add', zValidator('json', z.object({ amount: z.number().positive() })), async c => {
    const { amount } = c.req.valid('json')
    const userId = c.get('user').id

    let user = await prisma.user.findFirst({ where: { id: userId }, select: { balance: true } })
    if (!user) {
      return c.json({ message: 'User not found' }, 404)
    }

    await prisma.walletTransaction.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
        description: 'Topped up',
      },
    })

    user = await prisma.user.findFirst({ where: { id: userId }, select: { balance: true } })

    return c.json({ message: 'Money added to wallet', balance: user?.balance.toString() }, 200)
  })

export default wallet
