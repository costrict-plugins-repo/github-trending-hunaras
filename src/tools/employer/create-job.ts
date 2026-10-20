import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import { type AuthenticatedUser } from '../../auth.js'

export function registerCreateJob(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'create_job',
    'Post a new job listing on Hunaras. Free tier: max 2 active jobs. Pro: unlimited.',
    {
      title: z.string().describe('Job title (e.g. "Senior Frontend Engineer")'),
      description: z.string().describe('Full job description in markdown'),
      requirements: z.array(z.string()).optional().describe('List of requirements'),
      location: z.string().optional().default('Remote').describe('Job location (default: "Remote")'),
      type: z.enum(['full-time', 'part-time', 'contract', 'remote']).optional().default('full-time').describe('Employment type'),
      salary: z.string().optional().describe('Salary range (e.g. "$120k-$160k")'),
      question_count: z.number().min(3).max(20).optional().default(8).describe('Number of interview questions (default 8)'),
    },
    async ({ title, description, requirements, location, type, salary, question_count }) => {
      try {
        const job = await api.post('/api/jobs', {
          title,
          description,
          requirements,
          location,
          type,
          salary,
          questionCount: question_count,
        })

        const jobUrl = job.slug ? `https://hunaras.com/jobs/${job.slug}` : ''

        const text = [
          `## Job Created Successfully`,
          ``,
          `**${job.title}**`,
          `- Location: ${job.location || location}`,
          `- Type: ${job.type || type}`,
          salary ? `- Salary: ${salary}` : null,
          `- Interview questions: ${job.questionCount || question_count}`,
          `- Status: active`,
          ``,
          jobUrl ? `**URL:** ${jobUrl}` : null,
          `**ID:** \`${job.id}\``,
          ``,
          `Candidates can now find and apply to this job on Hunaras.`,
        ].filter(Boolean).join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError && (e.upgradeRequired || e.status === 403)) {
          return {
            content: [{
              type: 'text' as const,
              text: `🔒 **Free tier is limited to 2 active jobs.**\n\nEither close an existing job or upgrade to Pro ($200/month) for unlimited jobs.\n\nVisit: https://hunaras.com/pricing`,
            }],
          }
        }
        throw e
      }
    }
  )
}
