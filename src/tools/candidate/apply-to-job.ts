import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerApplyToJob(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'apply_to_job',
    'Submit an application to a job on Hunaras. You must have completed at least one AI interview first.',
    {
      job_id: z.string().describe('The job ID to apply to'),
      cover_letter: z.string().optional().describe('Optional cover letter to include with your application'),
    },
    async ({ job_id, cover_letter }) => {
      try {
        const result = await api.post('/api/applications', {
          jobId: job_id,
          coverLetter: cover_letter,
        })

        const text = [
          `## Application Submitted Successfully`,
          ``,
          `You've applied to **${result.jobTitle || 'the job'}**${result.companyName ? ` at ${result.companyName}` : ''}.`,
          ``,
          result.id ? `- Application ID: \`${result.id}\`` : null,
          `- Status: pending`,
          cover_letter ? `- Cover letter: included` : `- Cover letter: none`,
          result.jobUrl ? `- Job URL: ${result.jobUrl}` : null,
          ``,
          `The employer will review your application and AI assessment. You'll be notified when there's an update.`,
        ].filter(Boolean).join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          // Handle specific error cases returned by the API
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
