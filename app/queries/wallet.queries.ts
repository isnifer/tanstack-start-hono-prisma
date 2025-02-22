import { queryOptions } from '@tanstack/react-query'
import apiClient from '@/lib/api.client'

export const walletQueryOptions = () =>
  queryOptions({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await apiClient.api.v1.wallet.balance.$get()
      if (response.status === 404) {
        throw new Error('User not found')
      }

      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance')
      }

      return (await response.json()).item
    },
    staleTime: 1000 * 60 * 5, // 5 minutes on client, 0 on server
  })

export const transactionsQueryOptions = () =>
  queryOptions({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await apiClient.api.v1.wallet.transactions.$get()
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      return (await response.json()).items
    },
    staleTime: 1000 * 60 * 5, // 5 minutes on client, 0 on server
  })
