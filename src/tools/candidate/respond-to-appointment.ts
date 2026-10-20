import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerRespondToAppointment(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'respond_to_appointment',
    'Respond to a meeting proposal — accept, reschedule, or reject.',
    {
      appointment_id: z.string().describe('Appointment ID'),
      action: z.enum(['accept', 'reschedule', 'reject']).describe('Response action'),
      proposed_at: z.string().optional().describe('New proposed time (ISO 8601) — required for reschedule'),
      message: z.string().optional().describe('Message to employer'),
      rejection_reason: z.string().optional().describe('Reason for rejection'),
    },
    async ({ appointment_id, action, proposed_at, message, rejection_reason }) => {
      if (action === 'reschedule' && !proposed_at) {
        return {
          content: [{
            type: 'text' as const,
            text: 'A new proposed time (`proposed_at`) is required when rescheduling. Please provide an ISO 8601 datetime (e.g. "2026-03-15T14:00:00Z").',
          }],
        }
      }

      try {
        await api.post(`/api/appointments/${appointment_id}/respond`, {
          action,
          proposedAt: proposed_at,
          message,
          rejectionReason: rejection_reason,
        })

        const confirmations: Record<string, string> = {
          accept: 'Meeting accepted! The employer will be notified and you\'ll receive the meeting details.',
          reschedule: `Reschedule request sent with new proposed time: ${proposed_at}. The employer will be notified.`,
          reject: 'Meeting declined. The employer has been notified.',
        }

        const text = `## Appointment Response Sent\n\n${confirmations[action]}${message ? `\n\nYour message: "${message}"` : ''}`

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          return {
            content: [{
              type: 'text' as const,
              text: e.message,
            }],
          }
        }
        throw e
      }
    }
  )
}
