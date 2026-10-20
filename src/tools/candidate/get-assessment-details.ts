import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { api } from '../../api.js'
import type { AuthenticatedUser } from '../../auth.js'

export function registerGetAssessmentDetails(server: McpServer, _user: AuthenticatedUser) {
  server.tool(
    'get_assessment_details',
    'Get detailed AI assessment report for a specific interview.',
    {
      assessment_id: z.string().describe('Assessment ID to get details for'),
    },
    async ({ assessment_id }) => {
      const data = await api.get('/api/assessments')
      const assessments = Array.isArray(data) ? data : data.assessments || []

      const assessment = assessments.find((a: any) => a.id === assessment_id)

      if (!assessment) {
        return {
          content: [{
            type: 'text' as const,
            text: 'Assessment not found. Use `get_my_assessments` to see available assessments.',
          }],
        }
      }

      const a = assessment
      const jobTitle = a.jobTitle || a.application?.job?.title || 'Unknown'
      const company = a.companyName || a.application?.job?.companyName || ''
      const date = a.createdAt ? a.createdAt.split('T')[0] : 'N/A'

      const dimensions = [
        { name: 'Technical', score: a.technicalScore, reasoning: a.technicalReasoning },
        { name: 'Communication', score: a.communicationScore, reasoning: a.communicationReasoning },
        { name: 'Problem Solving', score: a.problemSolvingScore, reasoning: a.problemSolvingReasoning },
        { name: 'Experience', score: a.experienceScore, reasoning: a.experienceReasoning },
        { name: 'Culture Fit', score: a.cultureFitScore, reasoning: a.cultureFitReasoning },
      ]

      const dimensionLines = dimensions
        .filter(d => d.score != null)
        .map(d => {
          const line = `- **${d.name}:** ${d.score}/100`
          return d.reasoning ? `${line}\n  ${d.reasoning}` : line
        })

      const strengths = Array.isArray(a.strengths) ? a.strengths : []
      const weaknesses = Array.isArray(a.weaknesses) ? a.weaknesses : []

      const text = [
        `## Assessment Report`,
        ``,
        `**Job:** ${jobTitle}${company ? ` at ${company}` : ''}`,
        `**Date:** ${date}`,
        `**Overall Score:** ${a.overallScore != null ? `${a.overallScore}/100` : 'N/A'}`,
        a.recommendation ? `**Recommendation:** ${a.recommendation.replace(/_/g, ' ')}` : null,
        ``,
        `### Dimension Scores`,
        ``,
        ...dimensionLines,
        ``,
        strengths.length > 0 ? `### Strengths\n\n${strengths.map((s: string) => `- ${s}`).join('\n')}` : null,
        strengths.length > 0 ? `` : null,
        weaknesses.length > 0 ? `### Areas for Improvement\n\n${weaknesses.map((w: string) => `- ${w}`).join('\n')}` : null,
        weaknesses.length > 0 ? `` : null,
        a.summary ? `### Summary\n\n${a.summary}` : null,
        a.summary ? `` : null,
        a.detailedReport ? `### Detailed Report\n\n${a.detailedReport}` : null,
      ].filter(Boolean).join('\n')

      return {
        content: [{ type: 'text' as const, text }],
      }
    }
  )
}
