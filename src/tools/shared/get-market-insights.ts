import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetMarketInsights(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_market_insights',
    'Get job market insights from Hunaras — active jobs, candidate pool size, job type distribution, and salary ranges.',
    {
      category: z.string().optional().describe('Filter by job category/keyword (e.g. "engineering", "marketing")'),
      location: z.string().optional().describe('Filter by location (e.g. "Remote", "New York")'),
    },
    async ({ category, location }) => {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (location) params.set('location', location)

      const qs = params.toString()
      const data = await api.get(`/api/market-insights${qs ? `?${qs}` : ''}`)

      const filterDesc = [
        category ? `category: "${category}"` : null,
        location ? `location: "${location}"` : null,
      ].filter(Boolean).join(', ')

      // Format type distribution
      const typeLines = Array.isArray(data.jobTypes) && data.jobTypes.length > 0
        ? (data.jobTypes as Array<{ type: string; count: number; percentage: number }>)
            .map((t) => `- ${t.type}: ${t.count} (${t.percentage}%)`)
        : ['- No data available']

      // Format locations
      const locationLines = data.topLocations && data.topLocations.length > 0
        ? (data.topLocations as Array<{ location: string; count: number }>)
            .map((l) => `- ${l.location}: ${l.count}`)
        : ['- No data available']

      // Format salary info
      const salaryInfo = data.salaries && data.salaries.length > 0
        ? `${data.salaries.length} job(s) with listed salaries:\n${(data.salaries as string[]).slice(0, 10).map((s: string) => `- ${s}`).join('\n')}`
        : 'No salary data available for current filters.'

      const text = [
        `## Hunaras Market Insights`,
        filterDesc ? `\n*Filters: ${filterDesc}*` : null,
        ``,
        `### Overview`,
        `- **Active Jobs:** ${data.activeJobCount ?? 'N/A'}`,
        `- **Searchable Candidates:** ${data.searchableCandidateCount ?? 'N/A'}`,
        data.postedThisWeek != null ? `- **Posted This Week:** ${data.postedThisWeek}` : null,
        data.postedThisMonth != null ? `- **Posted This Month:** ${data.postedThisMonth}` : null,
        ``,
        `### Job Types`,
        typeLines.join('\n'),
        ``,
        `### Top Locations`,
        locationLines.join('\n'),
        ``,
        `### Salary Ranges`,
        salaryInfo,
      ].filter(Boolean).join('\n')

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
