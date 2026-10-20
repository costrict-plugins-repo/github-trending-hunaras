#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { authenticateApiKey, type AuthenticatedUser } from './auth.js'
import { registerTools } from './tools.js'

const server = new McpServer({
  name: 'hunaras',
  version: '1.0.0',
})

async function main() {
  const apiKey = process.env.HUNARAS_API_KEY

  if (!apiKey) {
    console.error('Missing HUNARAS_API_KEY. Get one from your Hunaras dashboard Settings -> API Keys.')
    process.exit(1)
  }

  const currentUser = await authenticateApiKey()

  if (!currentUser) {
    console.error('Invalid HUNARAS_API_KEY. Check that your key is correct and not revoked.')
    process.exit(1)
  }

  console.error(`Authenticated as ${currentUser.name || currentUser.email} (${currentUser.role}, ${currentUser.plan})`)

  registerTools(server, currentUser)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Hunaras MCP server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
