import { Chat } from '@/components/Chat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Chat Page</h1>
      <Chat />
    </div>
  )
}
