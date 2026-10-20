import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerRateEmployer(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'rate_employer',
    'Rate an employer after your interview or job experience.',
    {
      job_id: z.string().describe('Job ID to rate the employer for'),
      overall_score: z.number().min(1).max(5).describe('Overall rating 1-5 stars'),
      trigger: z.enum(['AFTER_MEETING', 'AFTER_JOB_CLOSED', 'AFTER_AI_INTERVIEW']).describe('What prompted this rating'),
      comment: z.string().optional().describe('Written feedback (min 20 chars if provided)'),
      dimensions: z.record(z.number()).optional().describe('Dimension scores e.g. {"communication": 4, "professionalism": 5}'),
    },
    async ({ job_id, overall_score, trigger, comment, dimensions }) => {
      try {
        await api.post('/api/ratings', {
          jobId: job_id,
          overallScore: overall_score,
          trigger,
          comment,
          dimensions,
        })

        const stars = '⭐'.repeat(overall_score) + '☆'.repeat(5 - overall_score)
        const text = [
          `## Rating Submitted`,
          ``,
          `${stars} ${overall_score}/5`,
          ``,
          `Your rating has been submitted. Thank you for your feedback!`,
          comment ? `\nYour comment: "${comment}"` : null,
        ].filter(Boolean).join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.status === 409) {
            return {
              content: [{
                type: 'text' as const,
                text: 'You have already rated this employer for this job.',
              }],
            }
          }
          if (e.status === 403) {
            return {
              content: [{
                type: 'text' as const,
                text: 'You cannot rate this employer — no application found for this job.',
              }],
            }
          }
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
