import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetPendingRatings(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_pending_ratings',
    'See which employers you can rate based on your interactions.',
    {},
    async () => {
      const data = await api.get('/api/ratings?pending=true')
      const pending = Array.isArray(data) ? data : data.pending || []

      if (pending.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No pending ratings. You can rate employers after completing interviews or meetings.',
          }],
        }
      }

      const lines = pending.map((p: any, i: number) => {
        const jobTitle = p.job?.title || p.jobTitle || 'Unknown'
        const company = p.job?.companyName || p.companyName || ''
        const interactionType = p.trigger || p.interactionType || 'interaction'
        const date = p.createdAt || p.date ? (p.createdAt || p.date).split('T')[0] : 'N/A'
        const jobId = p.job?.id || p.jobId || ''

        return [
          `${i + 1}. **${jobTitle}**${company ? ` — ${company}` : ''}`,
          `   Interaction: ${interactionType.replace(/_/g, ' ').toLowerCase()}`,
          `   Date: ${date}`,
          jobId ? `   Job ID: \`${jobId}\`` : null,
        ].filter(Boolean).join('\n')
      })

      const text = `## Pending Ratings\n\n${lines.join('\n\n')}\n\n---\n*Use \`rate_employer\` to submit your rating.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
