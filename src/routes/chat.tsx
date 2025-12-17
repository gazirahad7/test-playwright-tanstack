import { ChatPro } from '@/components/ChatPro'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ChatPro />
    </div>
  )
}
