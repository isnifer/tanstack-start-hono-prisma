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
    <div>
      <div>{message}</div>
      <Link to="/hello">Hello</Link>
      {!session?.user && (
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
          onClick={() => auth.signIn.social({ provider: 'google' })}>
          Sign in with Google
        </button>
      )}
    </div>
  )
}
