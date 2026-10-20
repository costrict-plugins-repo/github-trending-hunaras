import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerSearchJobs(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'search_jobs',
    'Search for jobs on Hunaras using AI semantic search. Find jobs matching your skills, experience, and interests.',
    {
      query: z.string().describe('Natural language search query (e.g. "frontend developer with React experience")'),
      location: z.string().optional().describe('Filter by location (e.g. "New York", "Remote")'),
      type: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional().describe('Filter by employment type'),
      limit: z.number().min(1).max(50).optional().default(10).describe('Maximum number of results (default 10)'),
    },
    async ({ query, location, type, limit }) => {
      const data = await api.post('/api/jobs/search', { query, location, type, limit })
      const jobs = Array.isArray(data) ? data : data.jobs || []

      if (jobs.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: `No jobs found matching "${query}". Try broadening your search terms or removing filters.`,
          }],
        }
      }

      const lines = jobs.map((j: any, i: number) => {
        const similarity = j.similarity != null ? `${(j.similarity * 100).toFixed(1)}%` : 'N/A'
        const salary = j.salary ? ` | ${j.salary}` : ''
        const companyName = j.companyName || j.company_name || 'Unknown'
        const url = j.slug ? `https://hunaras.com/jobs/${j.slug}` : ''
        return `${i + 1}. **${j.title}** — ${companyName}\n   ${j.location} | ${j.type}${salary}\n   Match: ${similarity}${url ? ` | [View Job](${url})` : ''}\n   ID: \`${j.id}\``
      })

      const text = `## Job Search Results for "${query}"\n\nFound ${jobs.length} job(s):\n\n${lines.join('\n\n')}\n\n---\n*Use \`get_job_details\` with a job ID to see full details, or \`apply_to_job\` to apply.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
