import { createFileRoute } from '@tanstack/react-router'
import apiClient from '@/lib/api.client'

export const Route = createFileRoute('/hello')({
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
  const { message } = Route.useLoaderData()

  return <div>{message}</div>
}
