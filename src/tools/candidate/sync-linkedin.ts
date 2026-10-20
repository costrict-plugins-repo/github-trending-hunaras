import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerSyncLinkedin(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'sync_linkedin',
    'Sync your profile with LinkedIn data.',
    {
      linkedin_url: z.string().optional().describe('LinkedIn profile URL (e.g. https://linkedin.com/in/username). Omit to use your linked account.'),
    },
    async ({ linkedin_url }) => {
      try {
        const body = linkedin_url ? { linkedinUrl: linkedin_url } : {}
        const result = await api.post('/api/profile/sync-linkedin', body)

        const synced: string[] = []
        if (result.name) synced.push(`Name: ${result.name}`)
        if (result.title || result.headline) synced.push(`Headline: ${result.title || result.headline}`)
        if (result.location) synced.push(`Location: ${result.location}`)
        if (result.bio || result.summary) synced.push(`Bio/Summary: updated`)
        if (result.skills?.length) synced.push(`Skills: ${result.skills.length} imported`)
        if (result.experience?.length) synced.push(`Experience: ${result.experience.length} positions`)
        if (result.education?.length) synced.push(`Education: ${result.education.length} entries`)

        const text = [
          `## LinkedIn Sync Complete`,
          ``,
          synced.length > 0
            ? `The following data was synced:\n\n${synced.map(s => `- ${s}`).join('\n')}`
            : 'Profile synced successfully.',
          ``,
          `*Use \`get_my_profile\` to see your updated profile.*`,
        ].join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.status === 502) {
            return {
              content: [{
                type: 'text' as const,
                text: 'LinkedIn scraper service is currently unavailable. Please try again later.',
              }],
            }
          }
          if (e.status === 400) {
            return {
              content: [{
                type: 'text' as const,
                text: 'No LinkedIn account linked. Please provide a `linkedin_url` parameter or link your LinkedIn account in your profile settings.',
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
