import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  accepted: '✅',
  rescheduled: '🔄',
  rejected: '❌',
  cancelled: '🚫',
}

export function registerGetMyAppointments(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_appointments',
    'List your meeting proposals from employers.',
    {},
    async () => {
      const data = await api.get('/api/appointments')
      const appointments = Array.isArray(data) ? data : data.appointments || []

      if (appointments.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No appointments yet.',
          }],
        }
      }

      const lines = appointments.map((apt: any, i: number) => {
        const icon = STATUS_ICONS[apt.status] || '❓'
        const employerName = apt.employer?.name || apt.employerName || 'Unknown'
        const jobTitle = apt.job?.title || apt.jobTitle || 'Unknown'
        const proposedTime = apt.proposedAt
          ? new Date(apt.proposedAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })
          : 'TBD'
        const meetingLink = apt.status === 'accepted' && apt.meetingLink
          ? `\n   Meeting link: ${apt.meetingLink}`
          : ''
        const message = apt.message ? `\n   Message: ${apt.message}` : ''

        return [
          `${i + 1}. ${icon} **${jobTitle}** — ${employerName}`,
          `   Status: ${apt.status} | Proposed: ${proposedTime}`,
          `   ID: \`${apt.id}\``,
          meetingLink,
          message,
        ].filter(Boolean).join('\n')
      })

      const text = `## Your Appointments\n\n${lines.join('\n\n')}\n\n---\n*Use \`respond_to_appointment\` to accept, reschedule, or reject a proposal.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
