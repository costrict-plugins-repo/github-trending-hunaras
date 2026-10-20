import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetJobDetails(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_job_details',
    'Get full details of a specific job posting on Hunaras.',
    {
      job_id: z.string().describe('The job ID to get details for'),
    },
    async ({ job_id }) => {
      try {
        const job = await api.get(`/api/jobs/${job_id}`)

        const requirements = Array.isArray(job.requirements) ? job.requirements : []
        const reqList = requirements.length > 0
          ? requirements.map((r: string) => `- ${r}`).join('\n')
          : 'Not specified'

        const url = job.slug ? `https://hunaras.com/jobs/${job.slug}` : ''
        const employerName = job.employer?.name || job.employerName || ''
        const applicationCount = job.applicationCount ?? job._count?.applications ?? 'N/A'

        const text = [
          `## ${job.title}`,
          ``,
          `**Company:** ${job.companyName}`,
          employerName ? `**Employer:** ${employerName}` : null,
          `**Location:** ${job.location}`,
          `**Type:** ${job.type}`,
          job.salary ? `**Salary:** ${job.salary}` : null,
          `**Experience Level:** ${job.experience}`,
          `**Status:** ${job.status}`,
          `**Interview Questions:** ${job.questionCount}`,
          `**Applications:** ${applicationCount}`,
          job.createdAt ? `**Posted:** ${job.createdAt.split('T')[0]}` : null,
          url ? `**URL:** ${url}` : null,
          ``,
          `### Description`,
          ``,
          job.description,
          ``,
          `### Requirements`,
          ``,
          reqList,
          ``,
          `---`,
          `*Use \`apply_to_job\` with job ID \`${job.id}\` to apply.*`,
        ].filter(Boolean).join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError && e.status === 404) {
          return {
            content: [{
              type: 'text' as const,
              text: `Job not found with ID \`${job_id}\`. Please check the ID and try again.`,
            }],
          }
        }
        throw e
      }
    }
  )
}
