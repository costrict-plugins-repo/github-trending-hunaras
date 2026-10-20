import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerListMyJobs(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'list_my_jobs',
    'List all your job postings with application counts and status.',
    {
      include_inactive: z.boolean().optional().default(false).describe('Include closed/draft jobs (default: false, only active jobs)'),
    },
    async ({ include_inactive }) => {
      const params = new URLSearchParams({ mine: 'true' })
      if (include_inactive) params.set('includeInactive', 'true')

      const data = await api.get(`/api/jobs?${params.toString()}`)
      const jobs = Array.isArray(data) ? data : data.jobs || []

      if (jobs.length === 0) {
        const msg = include_inactive
          ? 'You have no job postings yet. Use `create_job` to post your first job.'
          : 'You have no active job postings. Use `create_job` to post a new job, or use `include_inactive: true` to see closed/draft jobs.'

        return {
          content: [{ type: 'text' as const, text: msg }],
        }
      }

      const statusLabel = include_inactive ? 'all' : 'active'
      const lines = jobs.map((job: any, i: number) => {
        const apps = job.applicationCount ?? job._count?.applications ?? 0
        const date = job.createdAt ? job.createdAt.split('T')[0] : 'N/A'
        const status = job.status !== 'active' ? ` [${job.status}]` : ''
        return `${i + 1}. **${job.title}**${status}\n   ${job.location} | ${job.type} | ${apps} application(s) | ${job.questionCount} questions\n   Posted: ${date} | ID: \`${job.id}\``
      })

      const text = `## Your Jobs (${statusLabel})\n\n${lines.join('\n\n')}\n\n---\n*${jobs.length} job(s) total.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
