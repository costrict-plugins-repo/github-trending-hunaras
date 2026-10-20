import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import { type AuthenticatedUser } from '../../auth.js'

export function registerInviteCandidate(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'invite_candidate',
    'Request Hunaras to reach out to an external candidate (e.g. from LinkedIn). Pro subscription required. Max 20 invites per day.',
    {
      linkedin_url: z.string().url().describe('Full LinkedIn profile URL'),
      name: z.string().describe('Candidate name'),
      headline: z.string().optional().describe('Their LinkedIn headline or current role'),
      company: z.string().optional().describe('Their current company'),
    },
    async ({ linkedin_url, name, headline, company }) => {
      try {
        const result = await api.post('/api/leads', {
          linkedin_url,
          name,
          headline,
          company,
        })

        const remaining = result.remainingToday ?? 'unknown'

        const text = [
          `## Invitation Sent`,
          ``,
          `**${name}** has been added to your outreach queue.`,
          ``,
          `- LinkedIn: ${linkedin_url}`,
          headline ? `- Headline: ${headline}` : null,
          company ? `- Company: ${company}` : null,
          `- Status: invited`,
          result.id ? `- Lead ID: \`${result.id}\`` : null,
          ``,
          `Hunaras will reach out to this candidate on your behalf.`,
          ``,
          `*${remaining} invite(s) remaining today.*`,
        ].filter(Boolean).join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.upgradeRequired || e.status === 403) {
            return {
              content: [{
                type: 'text' as const,
                text: '🔒 **Candidate Invitations require a Pro subscription.**\n\nUpgrade to Pro ($200/month) to invite external candidates to Hunaras.\n\nVisit: https://hunaras.com/pricing',
              }],
            }
          }
          if (e.status === 409) {
            return {
              content: [{
                type: 'text' as const,
                text: `This candidate has already been invited. ${e.message}`,
              }],
            }
          }
          if (e.status === 429) {
            return {
              content: [{
                type: 'text' as const,
                text: `⏳ **Daily invite limit reached.**\n\n${e.message}\n\nThis limit helps maintain quality outreach and avoid spam.`,
              }],
            }
          }
        }
        throw e
      }
    }
  )
}
