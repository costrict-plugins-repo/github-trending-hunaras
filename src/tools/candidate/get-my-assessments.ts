import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetMyAssessments(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_my_assessments',
    'List your AI interview assessments with scores and recommendations.',
    {},
    async () => {
      const data = await api.get('/api/assessments')
      const assessments = Array.isArray(data) ? data : data.assessments || []

      if (assessments.length === 0) {
        return {
          content: [{
            type: 'text' as const,
            text: 'No assessments yet. Complete an AI interview to receive your assessment.',
          }],
        }
      }

      const lines = assessments.map((a: any, i: number) => {
        const jobTitle = a.jobTitle || a.application?.job?.title || 'Unknown'
        const company = a.companyName || a.application?.job?.companyName || ''
        const date = a.createdAt ? a.createdAt.split('T')[0] : 'N/A'
        const overall = a.overallScore != null ? `${a.overallScore}/100` : 'N/A'

        const dimensions = [
          a.technicalScore != null ? `Technical: ${a.technicalScore}/100` : null,
          a.communicationScore != null ? `Communication: ${a.communicationScore}/100` : null,
          a.problemSolvingScore != null ? `Problem Solving: ${a.problemSolvingScore}/100` : null,
          a.experienceScore != null ? `Experience: ${a.experienceScore}/100` : null,
          a.cultureFitScore != null ? `Culture Fit: ${a.cultureFitScore}/100` : null,
        ].filter(Boolean)

        const recommendation = a.recommendation
          ? `Recommendation: ${a.recommendation.replace(/_/g, ' ')}`
          : null

        return [
          `${i + 1}. **${jobTitle}**${company ? ` — ${company}` : ''}`,
          `   Overall Score: ${overall}`,
          dimensions.length > 0 ? `   ${dimensions.join(' | ')}` : null,
          recommendation ? `   ${recommendation}` : null,
          `   Date: ${date}`,
        ].filter(Boolean).join('\n')
      })

      const text = `## Your Assessments\n\n${lines.join('\n\n')}\n\n---\n*${assessments.length} assessment(s) total. Use \`get_assessment_details\` to view a full report.*`

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
