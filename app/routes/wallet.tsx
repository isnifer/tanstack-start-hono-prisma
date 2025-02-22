import { type SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { z } from 'zod'
import apiClient from '@/lib/api.client'

export const Route = createFileRoute('/wallet')({
  component: RouteComponent,
  loader: async () => {
    const balance = await apiClient.api.v1.wallet.balance.$get()
    const transactions = await apiClient.api.v1.wallet.transactions.$get()

    const initialBalance = balance.status === 200 ? (await balance.json()).item : 0
    const initialTransactions = transactions.status === 200 ? (await transactions.json()).items : []

    return {
      balance: initialBalance,
      transactions: initialTransactions,
    }
  },
  wrapInSuspense: true,
  pendingComponent: () => <div>Loading...</div>,
})

const AddMoneyFormType = z.object({ amount: z.string() })
type TAddMoneyForm = z.infer<typeof AddMoneyFormType>

function RouteComponent() {
  const { balance, transactions } = Route.useLoaderData()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting },
  } = useForm<TAddMoneyForm>({
    resolver: zodResolver(AddMoneyFormType),
    defaultValues: { amount: '' },
  })

  const router = useRouter()

  const submitHandler: SubmitHandler<TAddMoneyForm> = async data => {
    const amount = Number(data.amount)
    if (isNaN(amount)) {
      alert('Invalid amount')
      return
    }

    const response = await apiClient.api.v1.wallet.add.$post({ json: { amount } })
    if (!response.ok) {
      console.error(response)
    } else {
      console.log('invalidating')
      await router.invalidate()
      console.log('invalidated')
      setValue('amount', '')
    }
  }

  /**
   * Divide by 100 is not available for next currencies:
   *  1.	BIF – Burundian Franc, used in Burundi
   *  2.	CLP – Chilean Peso, used in Chile
   *  3.	DJF – Djiboutian Franc, used in Djibouti
   *  4.	GNF – Guinean Franc, used in Guinea
   *  5.	JPY – Japanese Yen, used in Japan
   *  6.	KMF – Comorian Franc, used in Comoros
   *  7.	KRW – South Korean Won, used in South Korea
   *  8.	MGA – Malagasy Ariary, used in Madagascar
   *  9.	PYG – Paraguayan Guarani, used in Paraguay
   *  10.	RWF – Rwandan Franc, used in Rwanda
   *  11.	UGX – Ugandan Shilling, used in Uganda
   *  12.	VND – Vietnamese Dong, used in Vietnam
   *  13.	VUV – Vanuatu Vatu, used in Vanuatu
   *  14.	XAF – CFA Franc (Central African), used in Cameroon, Central African Republic, Chad, Republic of the Congo, Gabon, Equatorial Guinea, São Tomé and Príncipe
   *  15.	XOF – CFA Franc (West African), used in Benin, Burkina Faso, Ivory Coast, Mali, Niger, Senegal, Togo, Guinea-Bissau, and others in West Africa
   *  16.	XPF – CFP Franc, used in French overseas territories in the Pacific (French Polynesia, New Caledonia, Wallis and Futuna)
   */

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">This is a wallet</h1>
      <p className="text-lg">Balance: {balance}</p>
      <p className="text-lg">Transactions: {transactions.length}</p>
      <form onSubmit={handleSubmit(submitHandler)} className="flex max-w-xs flex-col gap-2">
        <input
          {...register('amount')}
          type="number"
          disabled={isSubmitting}
          className="w-full rounded border p-2 text-black"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded bg-blue-500 p-2 text-white">
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </form>
      <ul className="list-disc">
        {transactions.map(transaction => (
          <li key={transaction.id} className="flex items-center gap-2 font-mono">
            <span>{dayjs(transaction.createdAt).format('DD.MM.YYYY HH:mm:ss Z')}</span>
            <span className="font-mono text-sm">
              {transaction.type}: {transaction.amount}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
