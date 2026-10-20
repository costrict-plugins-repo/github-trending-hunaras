import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import { type AuthenticatedUser } from '../../auth.js'

export function registerHuntCandidates(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'hunt_candidates',
    'Search LinkedIn for external candidates to source. Pro subscription required. Results are NOT saved to the database.',
    {
      query: z.string().describe('Search query for LinkedIn (e.g. "React developer San Francisco")'),
      keywords: z.array(z.string()).optional().describe('Additional keywords to refine results'),
    },
    async ({ query, keywords }) => {
      try {
        const searchQuery = keywords && keywords.length > 0
          ? `${query} ${keywords.join(' ')}`
          : query

        const data = await api.post('/api/leads/hunt', { query: searchQuery, location: undefined })
        const profiles = data.profiles || data || []

        if (!Array.isArray(profiles) || profiles.length === 0) {
          return {
            content: [{
              type: 'text' as const,
              text: `No LinkedIn profiles found for "${query}". Try different search terms or broader keywords.`,
            }],
          }
        }

        const lines = profiles.map((p: any, i: number) => {
          const name = p.name || 'Unknown'
          const headline = p.headline ? ` — ${p.headline}` : ''
          const loc = p.location ? `\n   📍 ${p.location}` : ''
          const company = p.company ? `\n   🏢 ${p.company}` : ''
          const url = p.url ? `\n   🔗 ${p.url}` : ''
          return `${i + 1}. **${name}**${headline}${loc}${company}${url}`
        })

        const text = [
          `## LinkedIn Search Results for "${query}"`,
          ``,
          `Found ${profiles.length} external profile(s) — **NOT on Hunaras**:`,
          ``,
          ...lines,
          ``,
          `---`,
          `*These candidates are not yet on Hunaras. Use \`invite_candidate\` with their LinkedIn URL to invite them to the platform.*`,
        ].join('\n')

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError && (e.upgradeRequired || e.status === 403)) {
          return {
            content: [{
              type: 'text' as const,
              text: '🔒 **LinkedIn Sourcing requires a Pro subscription.**\n\nUpgrade to Pro ($200/month) to search and source candidates externally via LinkedIn.\n\nVisit: https://hunaras.com/pricing',
            }],
          }
        }
        if (e instanceof ApiError) {
          return {
            content: [{
              type: 'text' as const,
              text: `LinkedIn search failed: ${e.message}. The service may be temporarily unavailable.`,
            }],
          }
        }
        throw e
      }
    }
  )
}
