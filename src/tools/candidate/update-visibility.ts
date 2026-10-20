import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerUpdateVisibility(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'update_visibility',
    'Toggle your visibility in the Hunaras talent pool. When visible, employers with Pro subscriptions can discover you via search.',
    {
      visible: z.boolean().describe('Set to true to appear in talent pool search, false to hide'),
    },
    async ({ visible }) => {
      await api.patch('/api/user/visibility', { visible })

      const statusMsg = visible
        ? 'You are now **visible** in the talent pool. Employers with Pro subscriptions can discover your profile through search.'
        : 'You are now **hidden** from the talent pool. Employers will not see you in search results.'

      const text = [
        `## Visibility Updated`,
        ``,
        statusMsg,
        ``,
        `*You can change this at any time using \`update_visibility\`.*`,
      ].join('\n')

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
