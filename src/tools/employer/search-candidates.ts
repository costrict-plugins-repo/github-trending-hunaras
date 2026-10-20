import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import { type AuthenticatedUser } from '../../auth.js'

export function registerSearchCandidates(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'search_candidates',
    'Search the Hunaras talent pool for candidates matching a query using AI semantic search. Pro subscription required.',
    {
      query: z.string().describe('Natural language search query (e.g. "senior React developer with AWS experience")'),
      location: z.string().optional().describe('Filter by location (e.g. "New York", "Remote")'),
      min_score: z.number().min(1).max(10).optional().describe('Minimum overall assessment score (1-10 scale)'),
      limit: z.number().min(1).max(50).optional().default(10).describe('Maximum number of results (default 10)'),
    },
    async ({ query, location, min_score, limit }) => {
      try {
        const results = await api.post('/api/talent-pool/search', { query, location, limit, min_score })
        const candidates = results.candidates || results

        if (!Array.isArray(candidates) || candidates.length === 0) {
          return {
            content: [{
              type: 'text' as const,
              text: `No candidates found matching "${query}". Try broadening your search terms.`,
            }],
          }
        }

        const lines = candidates.map((c: any, i: number) => {
          const similarity = c.similarity != null ? `${(c.similarity * 100).toFixed(1)}%` : 'N/A'
          const loc = c.location ? ` | ${c.location}` : ''
          const title = c.title || 'No title'
          const bio = c.bio ? `\n   ${c.bio.slice(0, 120)}${c.bio.length > 120 ? '...' : ''}` : ''
          const score = c.score ? ` | Score: ${c.score}/10` : ''
          return `${i + 1}. **${c.name || 'Anonymous'}** — ${title}${loc}\n   Match: ${similarity}${score} | ID: \`${c.id}\`${bio}`
        })

        const text = `## Talent Pool Results for "${query}"\n\nFound ${candidates.length} candidate(s):\n\n${lines.join('\n\n')}\n\n---\n*Use \`get_candidate_profile\` with a candidate ID to see their full profile and assessment.*`

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError && e.upgradeRequired) {
          return {
            content: [{
              type: 'text' as const,
              text: '🔒 **Talent Pool Search requires a Pro subscription.**\n\nUpgrade to Pro ($200/month) to search our talent pool of pre-assessed candidates.\n\nVisit: https://hunaras.com/pricing',
            }],
          }
        }
        throw e
      }
    }
  )
}
