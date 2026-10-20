import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api, ApiError } from '../../api.js'
import { type AuthenticatedUser } from '../../auth.js'

export function registerGetCandidateProfile(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_candidate_profile',
    'Get a candidate\'s full profile, assessment scores, and skills. Counts as a "reveal" (Free tier: 1 reveal, Pro: unlimited).',
    {
      candidate_id: z.string().describe('The candidate user ID (from search_candidates results)'),
    },
    async ({ candidate_id }) => {
      try {
        const candidate = await api.get(`/api/candidates/${candidate_id}`)

        // Format profile
        const skills = Array.isArray(candidate.skills) ? candidate.skills : []
        const experience = Array.isArray(candidate.experience) ? candidate.experience : []
        const assessments = Array.isArray(candidate.assessments) ? candidate.assessments : []

        let text = `## ${candidate.name || 'Unknown'}\n`
        if (candidate.title) text += `**${candidate.title}**\n`
        if (candidate.location) text += `📍 ${candidate.location}\n`
        text += `\n`

        if (candidate.bio) {
          text += `### About\n${candidate.bio}\n\n`
        }

        if (skills.length > 0) {
          text += `### Skills\n${skills.join(', ')}\n\n`
        }

        if (candidate.linkedinUrl) {
          text += `**LinkedIn:** ${candidate.linkedinUrl}\n`
        }
        if (candidate.email) {
          text += `**Email:** ${candidate.email}\n`
        }
        text += `\n`

        // Experience
        if (experience.length > 0) {
          text += `### Experience\n`
          for (const exp of experience) {
            const e = exp as Record<string, string>
            text += `- **${e.title || 'Role'}** at ${e.company || 'Company'}`
            if (e.duration) text += ` (${e.duration})`
            text += `\n`
          }
          text += `\n`
        }

        // Assessments
        if (assessments.length > 0) {
          text += `### AI Assessments\n`
          for (const a of assessments) {
            const jobTitle = a.jobTitle || a.application?.job?.title || 'Unknown position'
            const company = a.companyName || a.application?.job?.companyName || ''
            const date = a.createdAt ? a.createdAt.split('T')[0] : 'N/A'
            text += `\n**${jobTitle}**${company ? ` at ${company}` : ''} (${date})\n`
            text += `- Overall: ${a.overallScore}/100\n`
            if (a.technicalScore != null) text += `- Technical: ${a.technicalScore}/100\n`
            if (a.communicationScore != null) text += `- Communication: ${a.communicationScore}/100\n`
            if (a.problemSolvingScore != null) text += `- Problem Solving: ${a.problemSolvingScore}/100\n`
            if (a.cultureFitScore != null) text += `- Culture Fit: ${a.cultureFitScore}/100\n`
            if (a.recommendation) text += `- Recommendation: ${a.recommendation.replace(/_/g, ' ')}\n`

            const strengths = Array.isArray(a.strengths) ? a.strengths : []
            if (strengths.length > 0) text += `- Strengths: ${strengths.join(', ')}\n`

            const weaknesses = Array.isArray(a.weaknesses) ? a.weaknesses : []
            if (weaknesses.length > 0) text += `- Areas for improvement: ${weaknesses.join(', ')}\n`

            if (a.summary) text += `\n> ${a.summary}\n`
          }
        } else {
          text += `*No AI assessments available yet.*\n`
        }

        return {
          content: [{ type: 'text' as const, text }],
        }
      } catch (e) {
        if (e instanceof ApiError) {
          if (e.upgradeRequired) {
            return {
              content: [{
                type: 'text' as const,
                text: `🔒 **You've used your free candidate reveal.**\n\nUpgrade to Pro ($200/month) for unlimited reveals.\n\nVisit: https://hunaras.com/pricing`,
              }],
            }
          }
          if (e.status === 404) {
            return {
              content: [{
                type: 'text' as const,
                text: `Candidate with ID \`${candidate_id}\` not found. Make sure you're using a valid candidate ID from search results.`,
              }],
            }
          }
        }
        throw e
      }
    }
  )
}
