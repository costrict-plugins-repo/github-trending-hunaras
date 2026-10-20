import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

function starDisplay(score: number): string {
  const filled = Math.round(score)
  return '⭐'.repeat(filled) + '☆'.repeat(5 - filled) + ` ${score}/5`
}

export function registerGetMyRatings(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_ratings',
    'View ratings you\'ve received from employers.',
    {},
    async () => {
      const data = await api.get('/api/ratings')
      const ratings = Array.isArray(data) ? data : data.ratings || []

      if (ratings.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No ratings received yet.',
          }],
        }
      }

      const lines = ratings.map((r: any, i: number) => {
        const employer = r.employer?.name || r.employerName || 'Unknown'
        const company = r.employer?.companyName || r.companyName || ''
        const jobTitle = r.job?.title || r.jobTitle || 'Unknown'
        const date = r.createdAt ? r.createdAt.split('T')[0] : 'N/A'
        const comment = r.comment ? `\n   Comment: "${r.comment}"` : ''

        const dims = r.dimensions && typeof r.dimensions === 'object'
          ? Object.entries(r.dimensions)
              .map(([key, val]) => `${key}: ${val}/5`)
              .join(' | ')
          : null

        return [
          `${i + 1}. ${starDisplay(r.overallScore)} — **${jobTitle}**`,
          `   From: ${employer}${company ? ` (${company})` : ''} | Date: ${date}`,
          dims ? `   Dimensions: ${dims}` : null,
          comment,
        ].filter(Boolean).join('\n')
      })

      const avgScore = ratings.reduce((sum: number, r: any) => sum + (r.overallScore || 0), 0) / ratings.length
      const text = `## Your Ratings\n\n${lines.join('\n\n')}\n\n---\n*${ratings.length} rating(s) — Average: ${avgScore.toFixed(1)}/5*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
