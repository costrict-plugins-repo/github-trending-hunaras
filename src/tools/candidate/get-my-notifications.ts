import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

const TYPE_ICONS: Record<string, string> = {
  APPLICATION_STATUS: '📋',
  APPOINTMENT: '📅',
  RATING: '⭐',
  INTERVIEW: '🎤',
}

export function registerGetMyNotifications(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_notifications',
    'List your notifications.',
    {
      unread_only: z.boolean().optional().describe('Only show unread notifications'),
    },
    async ({ unread_only }) => {
      const query = unread_only ? '?unread=true' : ''
      const data = await api.get(`/api/notifications${query}`)
      const notifications = Array.isArray(data) ? data : data.notifications || []

      if (notifications.length === 0) {
        const emptyMsg = unread_only
          ? 'No unread notifications. You\'re all caught up!'
          : 'No notifications yet.'
        return {
          content: [{
            type: 'text' as const,
            text: emptyMsg,
          }],
        }
      }

      const lines = notifications.map((n: any, i: number) => {
        const readIcon = n.read ? '📭' : '📬'
        const typeIcon = TYPE_ICONS[n.type] || '🔔'
        const title = n.title || 'Notification'
        const message = n.message || ''
        const time = n.createdAt
          ? new Date(n.createdAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : 'N/A'

        return [
          `${i + 1}. ${readIcon} ${typeIcon} **${title}**`,
          message ? `   ${message}` : null,
          `   ${time} | ID: \`${n.id}\``,
        ].filter(Boolean).join('\n')
      })

      const unreadCount = notifications.filter((n: any) => !n.read).length
      const text = `## Your Notifications\n\n${lines.join('\n\n')}\n\n---\n*${notifications.length} notification(s)${unreadCount > 0 ? ` — ${unreadCount} unread` : ''}. Use \`mark_notifications_read\` to mark as read.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
