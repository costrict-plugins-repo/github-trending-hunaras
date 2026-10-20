import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { AuthenticatedUser } from './auth.js'

// Employer tools
import { registerSearchCandidates } from './tools/employer/search-candidates.js'
import { registerGetCandidateProfile } from './tools/employer/get-candidate-profile.js'
import { registerCreateJob } from './tools/employer/create-job.js'
import { registerListMyJobs } from './tools/employer/list-my-jobs.js'
import { registerHuntCandidates } from './tools/employer/hunt-candidates.js'
import { registerInviteCandidate } from './tools/employer/invite-candidate.js'

// Candidate tools
import { registerSearchJobs } from './tools/candidate/search-jobs.js'
import { registerGetJobDetails } from './tools/candidate/get-job-details.js'
import { registerApplyToJob } from './tools/candidate/apply-to-job.js'
import { registerGetMyProfile } from './tools/candidate/get-my-profile.js'
import { registerGetMyApplications } from './tools/candidate/get-my-applications.js'
import { registerUpdateProfile } from './tools/candidate/update-profile.js'
import { registerUpdateVisibility } from './tools/candidate/update-visibility.js'
import { registerGetMyAssessments } from './tools/candidate/get-my-assessments.js'
import { registerGetAssessmentDetails } from './tools/candidate/get-assessment-details.js'
import { registerGetMyAppointments } from './tools/candidate/get-my-appointments.js'
import { registerRespondToAppointment } from './tools/candidate/respond-to-appointment.js'
import { registerGetMyNotifications } from './tools/candidate/get-my-notifications.js'
import { registerMarkNotificationsRead } from './tools/candidate/mark-notifications-read.js'
import { registerGetMyRatings } from './tools/candidate/get-my-ratings.js'
import { registerRateEmployer } from './tools/candidate/rate-employer.js'
import { registerGetPendingRatings } from './tools/candidate/get-pending-ratings.js'
import { registerSyncLinkedin } from './tools/candidate/sync-linkedin.js'

// Shared tools
import { registerGetMarketInsights } from './tools/shared/get-market-insights.js'

export function registerTools(server: McpServer, user: AuthenticatedUser) {
  // Shared tools — always registered
  registerGetMarketInsights(server, user)

  if (user.role === 'employer') {
    registerSearchCandidates(server, user)
    registerGetCandidateProfile(server, user)
    registerCreateJob(server, user)
    registerListMyJobs(server, user)
    registerHuntCandidates(server, user)
    registerInviteCandidate(server, user)
  }

  if (user.role === 'candidate') {
    registerSearchJobs(server, user)
    registerGetJobDetails(server, user)
    registerApplyToJob(server, user)
    registerGetMyProfile(server, user)
    registerGetMyApplications(server, user)
    registerUpdateProfile(server, user)
    registerUpdateVisibility(server, user)
    registerGetMyAssessments(server, user)
    registerGetAssessmentDetails(server, user)
    registerGetMyAppointments(server, user)
    registerRespondToAppointment(server, user)
    registerGetMyNotifications(server, user)
    registerMarkNotificationsRead(server, user)
    registerGetMyRatings(server, user)
    registerRateEmployer(server, user)
    registerGetPendingRatings(server, user)
    registerSyncLinkedin(server, user)
  }
}
