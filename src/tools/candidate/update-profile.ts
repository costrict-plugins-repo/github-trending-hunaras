import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerUpdateProfile(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'update_profile',
    'Update your Hunaras candidate profile. Only provided fields are updated.',
    {
      headline: z.string().optional().describe('Your professional headline/title (e.g. "Senior Frontend Developer")'),
      bio: z.string().optional().describe('A brief bio about yourself'),
      location: z.string().optional().describe('Your location (e.g. "San Francisco, CA")'),
      skills: z.array(z.string()).optional().describe('List of your skills (e.g. ["React", "TypeScript", "Node.js"])'),
    },
    async ({ headline, bio, location, skills }) => {
      if (!headline && !bio && !location && !skills) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No fields provided to update. Specify at least one of: headline, bio, location, skills.',
          }],
        }
      }

      const body: Record<string, unknown> = {}
      const updated: string[] = []

      if (headline !== undefined) {
        body.title = headline
        updated.push(`Headline: ${headline}`)
      }

      if (bio !== undefined) {
        body.bio = bio
        updated.push(`Bio: ${bio.slice(0, 100)}${bio.length > 100 ? '...' : ''}`)
      }

      if (location !== undefined) {
        body.location = location
        updated.push(`Location: ${location}`)
      }

      if (skills !== undefined) {
        body.skills = skills
        updated.push(`Skills: ${skills.join(', ')}`)
      }

      await api.patch('/api/user', body)

      const text = [
        `## Profile Updated`,
        ``,
        `The following fields were updated:`,
        ``,
        ...updated.map(u => `- ${u}`),
        ``,
        `Your talent pool profile has been refreshed.`,
      ].join('\n')

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
