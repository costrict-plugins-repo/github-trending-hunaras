import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerMarkNotificationsRead(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'mark_notifications_read',
    'Mark notifications as read — one specific notification or all at once.',
    {
      notification_id: z.string().optional().describe('Specific notification ID to mark as read. Omit to mark all as read.'),
    },
    async ({ notification_id }) => {
      const body = notification_id
        ? { id: notification_id }
        : { markAll: true }

      await api.patch('/api/notifications', body)

      const text = notification_id
        ? `Notification \`${notification_id}\` marked as read.`
        : 'All notifications marked as read.'

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
