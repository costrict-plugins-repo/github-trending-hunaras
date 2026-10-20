import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

const STATUS_INDICATORS: Record<string, string> = {
  pending: '⏳',
  screening: '🔍',
  interviewed: '🎤',
  shortlisted: '⭐',
  rejected: '❌',
  hired: '✅',
  appointment: '📅',
}

export function registerGetMyApplications(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_applications',
    'List all your job applications with current statuses.',
    {},
    async () => {
      const data = await api.get('/api/applications?candidate=true')
      const applications = Array.isArray(data) ? data : data.applications || []

      if (applications.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'You have no applications yet.\n\nUse `search_jobs` to find jobs, then `apply_to_job` to submit an application.',
          }],
        }
      }

      const lines = applications.map((app: any, i: number) => {
        const indicator = STATUS_INDICATORS[app.status] || '❓'
        const date = app.createdAt ? app.createdAt.split('T')[0] : 'N/A'
        const jobTitle = app.job?.title || app.jobTitle || 'Unknown'
        const companyName = app.job?.companyName || app.companyName || ''
        const location = app.job?.location || app.location || ''
        const slug = app.job?.slug || app.jobSlug || ''
        const score = app.assessment?.overallScore ?? app.overallScore
        const scoreStr = score != null ? ` | Score: ${score}/100` : ''
        const url = slug ? `https://hunaras.com/jobs/${slug}` : ''
        return `${i + 1}. ${indicator} **${jobTitle}** — ${companyName}\n   Status: ${app.status} | ${location} | Applied: ${date}${scoreStr}${url ? `\n   ${url}` : ''}`
      })

      const statusCounts = applications.reduce((acc: Record<string, number>, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const summary = Object.entries(statusCounts)
        .map(([status, count]) => `${status}: ${count}`)
        .join(' | ')

      const text = `## Your Applications\n\n${lines.join('\n\n')}\n\n---\n*${applications.length} application(s) total — ${summary}*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
