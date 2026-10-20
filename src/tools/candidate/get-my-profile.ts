import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetMyProfile(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_profile',
    'View your Hunaras candidate profile, including assessment scores and visibility status.',
    {},
    async () => {
      const profile = await api.get('/api/user')

      if (!profile) {
        return {
          content: [{
            type: 'text' as const,
            text: 'Profile not found. This should not happen — please contact support.',
          }],
        }
      }

      const skills = Array.isArray(profile.skills) ? profile.skills : []
      const assessments = Array.isArray(profile.assessments) ? profile.assessments : []
      const applicationCount = profile.applicationCount ?? profile._count?.applications ?? 0

      const assessmentLines = assessments.length > 0
        ? assessments.map((a: any, i: number) => {
            const jobTitle = a.jobTitle || a.application?.job?.title || 'Unknown'
            const company = a.companyName || a.application?.job?.companyName || ''
            const date = a.createdAt ? a.createdAt.split('T')[0] : 'N/A'
            return [
              `${i + 1}. **${jobTitle}**${company ? ` at ${company}` : ''} (${date})`,
              `   Overall: ${a.overallScore}/100 | Technical: ${a.technicalScore}/100`,
              `   Communication: ${a.communicationScore}/100 | Problem Solving: ${a.problemSolvingScore}/100`,
              `   Culture Fit: ${a.cultureFitScore}/100`,
              a.recommendation ? `   Recommendation: ${a.recommendation.replace(/_/g, ' ')}` : null,
            ].filter(Boolean).join('\n')
          }).join('\n\n')
        : 'No assessments yet. Apply to jobs and complete AI interviews to build your profile.'

      const visibilityStatus = profile.aiSearchVisible
        ? 'Visible — employers can find you in talent pool search'
        : 'Hidden — you are not visible to employers in talent pool search'

      const memberSince = profile.createdAt ? profile.createdAt.split('T')[0] : 'N/A'

      const text = [
        `## Your Profile`,
        ``,
        `**Name:** ${profile.name}`,
        `**Email:** ${profile.email}`,
        profile.title ? `**Title:** ${profile.title}` : null,
        profile.location ? `**Location:** ${profile.location}` : null,
        profile.bio ? `**Bio:** ${profile.bio}` : null,
        skills.length > 0 ? `**Skills:** ${skills.join(', ')}` : null,
        profile.linkedinUrl ? `**LinkedIn:** ${profile.linkedinUrl}` : null,
        `**Profile Completed:** ${profile.profileCompleted ? 'Yes' : 'No'}`,
        `**Visibility:** ${visibilityStatus}`,
        `**Total Applications:** ${applicationCount}`,
        `**Member Since:** ${memberSince}`,
        ``,
        `### Recent Assessments`,
        ``,
        assessmentLines,
        ``,
        `---`,
        `*Use \`update_profile\` to edit your profile or \`update_visibility\` to change your talent pool visibility.*`,
      ].filter(Boolean).join('\n')

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
