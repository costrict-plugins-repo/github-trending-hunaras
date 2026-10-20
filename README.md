# hunaras-mcp

MCP server for [Hunaras](https://hunaras.com) — an AI-native recruiting platform.

Connect any MCP-compatible AI assistant (Claude, ChatGPT, etc.) to Hunaras and manage your entire recruiting workflow through natural language.

## What You Can Do

**Candidates** (17 tools):
- Search and apply for jobs
- Check AI interview assessments and scores
- Manage your profile and LinkedIn sync
- Respond to meeting proposals
- Rate employers
- Track notifications

**Employers** (6 tools):
- Post jobs and manage listings
- Search the talent pool (semantic search)
- Source candidates from LinkedIn
- View candidate profiles and AI assessments

**Shared** (1 tool):
- Get market insights (job counts, salary ranges, demand data)

## Setup

### 1. Get an API key

Sign up at [hunaras.com](https://hunaras.com), then go to **Settings > API Keys** to create one.

### 2. Configure your MCP client

#### Claude Desktop / Claude Code

Add to your MCP config (`claude_desktop_config.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "hunaras": {
      "command": "npx",
      "args": ["-y", "hunaras-mcp"],
      "env": {
        "HUNARAS_API_KEY": "hnar_your_api_key_here"
      }
    }
  }
}
```

#### Other MCP clients

```json
{
  "command": "npx",
  "args": ["-y", "hunaras-mcp"],
  "env": {
    "HUNARAS_API_KEY": "hnar_your_api_key_here"
  }
}
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HUNARAS_API_KEY` | Yes | — | Your API key (starts with `hnar_`) |
| `HUNARAS_API_URL` | No | `https://hunaras.com` | API base URL (for self-hosted instances) |

## Tools

### Candidate Tools

| Tool | Description |
|------|-------------|
| `search_jobs` | Search jobs using AI semantic search |
| `get_job_details` | Get full job posting details |
| `apply_to_job` | Submit a job application |
| `get_my_profile` | View your candidate profile |
| `get_my_applications` | List applications with statuses |
| `update_profile` | Update profile fields |
| `update_visibility` | Show/hide from talent pool |
| `get_my_assessments` | List AI interview assessments |
| `get_assessment_details` | Full assessment report with scores |
| `get_my_appointments` | List meeting proposals |
| `respond_to_appointment` | Accept, reschedule, or reject meetings |
| `get_my_notifications` | List notifications |
| `mark_notifications_read` | Mark notifications as read |
| `get_my_ratings` | View ratings from employers |
| `rate_employer` | Rate an employer |
| `get_pending_ratings` | See which employers you can rate |
| `sync_linkedin` | Sync profile with LinkedIn |

### Employer Tools

| Tool | Description |
|------|-------------|
| `create_job` | Post a new job listing |
| `list_my_jobs` | List your job postings |
| `search_candidates` | Semantic search across talent pool (Pro) |
| `get_candidate_profile` | View candidate profile + assessment (Pro) |
| `hunt_candidates` | Source candidates from LinkedIn (Pro) |
| `invite_candidate` | Invite external candidate to platform |

### Shared Tools

| Tool | Description |
|------|-------------|
| `get_market_insights` | Job market data, salary ranges, demand |

## Example Conversations

**Find a job:**
> "Find me React developer jobs in Berlin"
> "Show me details for the first one"
> "Apply with a cover letter highlighting my 5 years of experience"

**Check interview results:**
> "How did I do on my interviews?"
> "Show me the detailed assessment for the frontend role"

**Employer hiring:**
> "Post a senior backend engineer role, remote, $150k-$180k"
> "Search for candidates with Python and AWS experience"

## Pricing

- **Candidates**: Always free
- **Employers Free**: 2 active jobs, 1 candidate reveal
- **Employers Pro** ($200/mo): Unlimited jobs, reveals, talent pool search, scheduling

## Links

- [Hunaras](https://hunaras.com)
- [Documentation](https://hunaras.com/docs)
- [Issues](https://github.com/shaxbozaka/hunaras/issues)

## License

MIT
