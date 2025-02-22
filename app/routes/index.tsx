import { Link, createFileRoute } from '@tanstack/react-router'
import apiClient from '@/lib/api.client'
import auth from '@/lib/auth.client'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const response = await apiClient.api.protected.$get()
    if (response.status !== 200) {
      return { message: 'Error', session: context.session }
    }

    const data = await response.json()

    return { message: data.message, session: context.session }
  },
  errorComponent: () => <div>Error</div>,
  wrapInSuspense: true,
})

function RouteComponent() {
  const { message, session } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold">{message}</div>
      <div className="flex flex-col gap-1">
        <p>Available routes:</p>
        <p>
          <Link to="/hello" className="text-blue-500 hover:underline">
            Hello
          </Link>
        </p>
        <p>
          <Link to="/wallet" className="text-blue-500 hover:underline">
            Wallet
          </Link>
        </p>
      </div>
      {!session?.user && (
        <button
          className="cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => auth.signIn.social({ provider: 'google' })}>
          Sign in with Google
        </button>
      )}
    </div>
  )
}
