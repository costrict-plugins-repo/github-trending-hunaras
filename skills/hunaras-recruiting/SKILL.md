---
name: hunaras-recruiting
description: >
  AI-native recruiting platform. Use when users want to: find jobs, manage applications,
  check interview results, schedule meetings, rate employers, post jobs, search candidates,
  or get hiring market insights.
version: 1.0.0
author: Hunaras
mcp-server: hunaras
---

# Hunaras Recruiting

AI-native recruiting platform connecting employers with candidates through AI-powered interviews.

## Overview

Hunaras is a dual-role recruiting platform where:
- **Employers** post jobs, search a pre-assessed talent pool, review AI interview results, and schedule meetings
- **Candidates** find jobs, take AI video interviews, receive scored assessments, and manage their career

All interactions happen through natural language via MCP tools. The server authenticates with an API key (`hnar_` prefix) set in `HUNARAS_API_KEY`, and tools are scoped by role -- employer users see employer tools, candidate users see candidate tools. The shared `get_market_insights` tool is available to both roles.

## Configuration

```json
{
  "mcpServers": {
    "hunaras": {
      "command": "node",
      "args": ["path/to/mcp-server/dist/index.js"],
      "env": {
        "HUNARAS_API_KEY": "hnar_your_api_key_here",
        "HUNARAS_API_URL": "https://hunaras.com"
      }
    }
  }
}
```

## Quick Start

### For Candidates

| I want to...                  | Tool(s)                                          |
|-------------------------------|--------------------------------------------------|
| Find a job                    | `search_jobs` then `get_job_details`             |
| Apply to a job                | `apply_to_job`                                   |
| See my application status     | `get_my_applications`                            |
| Check interview scores        | `get_my_assessments` then `get_assessment_details` |
| Update my profile             | `update_profile`                                 |
| Import from LinkedIn          | `sync_linkedin`                                  |
| Show/hide from employers      | `update_visibility`                              |
| Respond to a meeting invite   | `get_my_appointments` then `respond_to_appointment` |
| Rate an employer              | `get_pending_ratings` then `rate_employer`        |
| Check notifications           | `get_my_notifications`                           |

### For Employers

| I want to...                  | Tool(s)                                          |
|-------------------------------|--------------------------------------------------|
| Post a job                    | `create_job`                                     |
| See my listings               | `list_my_jobs`                                   |
| Find candidates on platform   | `search_candidates` then `get_candidate_profile` |
| Source from LinkedIn           | `hunt_candidates` then `invite_candidate`        |
| Check market data             | `get_market_insights`                            |

## Candidate Tools

### 1. Find and Apply for a Job

**Flow:** `search_jobs` -> `get_job_details` -> `apply_to_job`

Use `search_jobs` with a natural language query. Results include a semantic match percentage. Drill into a job with `get_job_details` using the job ID. Apply with `apply_to_job`, optionally including a cover letter.

**Tool reference:**

- **`search_jobs`** -- Search for jobs using AI semantic search
  - `query` (string, required): Natural language query, e.g. "frontend developer with React experience"
  - `location` (string, optional): Filter by location, e.g. "Remote", "New York"
  - `type` (enum, optional): `full-time` | `part-time` | `contract` | `internship`
  - `limit` (number, optional, default 10): Max results (1-50)

- **`get_job_details`** -- Get full details of a job posting
  - `job_id` (string, required): The job ID from search results

- **`apply_to_job`** -- Submit an application
  - `job_id` (string, required): The job ID to apply to
  - `cover_letter` (string, optional): Cover letter text

### 2. Check Interview Results

**Flow:** `get_my_assessments` -> `get_assessment_details`

After completing an AI interview, view your scored assessment. Assessments rate you across 5 dimensions on a 0-100 scale:
- **Technical Skills** -- domain knowledge and technical depth
- **Communication** -- clarity, articulation, and professionalism
- **Problem Solving** -- analytical thinking and structured approach
- **Experience** -- relevant background and accomplishments
- **Culture Fit** -- alignment with team values and work style

Score interpretation:
- 80-100: Exceptional
- 60-79: Strong
- 40-59: Average
- Below 40: Below expectations

Each assessment also includes strengths, areas for improvement, and an overall recommendation.

**Tool reference:**

- **`get_my_assessments`** -- List all your AI interview assessments with scores
  - No parameters

- **`get_assessment_details`** -- Get a full detailed assessment report
  - `assessment_id` (string, required): The assessment ID

### 3. Set Up Your Profile

**Flow:** `get_my_profile` -> `update_profile` -> `sync_linkedin` -> `update_visibility`

A complete profile increases your visibility to employers. Start by reviewing your current profile, then update fields. Optionally sync from LinkedIn to import experience and skills automatically.

**Tool reference:**

- **`get_my_profile`** -- View your current profile, scores, and visibility status
  - No parameters

- **`update_profile`** -- Update profile fields (only provided fields change)
  - `headline` (string, optional): Professional title, e.g. "Senior Frontend Developer"
  - `bio` (string, optional): Brief bio about yourself
  - `location` (string, optional): Your location, e.g. "San Francisco, CA"
  - `skills` (array of strings, optional): Your skills, e.g. ["React", "TypeScript", "Node.js"]

- **`sync_linkedin`** -- Sync your profile with LinkedIn data
  - `linkedin_url` (string, optional): LinkedIn profile URL, e.g. "https://linkedin.com/in/username". Omit to use your linked account.

- **`update_visibility`** -- Toggle talent pool visibility
  - `visible` (boolean, required): `true` to appear in employer searches, `false` to hide

### 4. Manage Meetings

**Flow:** `get_my_appointments` -> `respond_to_appointment`

When an employer wants to schedule a meeting after reviewing your assessment, you receive an appointment proposal. You can accept, reschedule with a new time, or decline with a reason.

**Tool reference:**

- **`get_my_appointments`** -- List meeting proposals from employers
  - No parameters

- **`respond_to_appointment`** -- Accept, reschedule, or reject a meeting
  - `appointment_id` (string, required): The appointment ID
  - `action` (enum, required): `accept` | `reschedule` | `reject`
  - `proposed_at` (string, optional): New proposed time (ISO 8601) -- required for reschedule
  - `message` (string, optional): Message to employer
  - `rejection_reason` (string, optional): Reason for rejection

### 5. Rate Employers

**Flow:** `get_pending_ratings` -> `rate_employer` -> `get_my_ratings`

After completing an interview process, you can rate the employer on their hiring experience. This helps other candidates.

**Tool reference:**

- **`get_pending_ratings`** -- See which employers you can rate
  - No parameters

- **`rate_employer`** -- Submit a rating for an employer
  - `job_id` (string, required): Job ID to rate the employer for
  - `overall_score` (number, required): Rating 1-5 stars
  - `trigger` (enum, required): `AFTER_MEETING` | `AFTER_JOB_CLOSED` | `AFTER_AI_INTERVIEW`
  - `comment` (string, optional): Written feedback (min 20 chars if provided)
  - `dimensions` (object, optional): Dimension scores, e.g. `{"communication": 4, "professionalism": 5}`

- **`get_my_ratings`** -- View all ratings you have received and given
  - No parameters

### 6. Check Inbox

**Flow:** `get_my_notifications` -> `mark_notifications_read`

Stay on top of application updates, meeting invitations, and other activity.

**Tool reference:**

- **`get_my_notifications`** -- List your notifications
  - `unread_only` (boolean, optional): Filter to unread notifications only

- **`mark_notifications_read`** -- Mark notifications as read
  - `notification_id` (string, optional): Specific notification ID, or omit to mark all as read

### 7. Track Applications

**Flow:** `get_my_applications`

View all your submitted applications with their current status.

Application statuses:
- **pending** -- submitted, awaiting review
- **screening** -- employer is reviewing
- **interviewed** -- AI interview completed
- **shortlisted** -- you made the short list
- **appointment** -- meeting scheduled
- **hired** -- congratulations!
- **rejected** -- not selected for this role

**Tool reference:**

- **`get_my_applications`** -- List all applications with statuses
  - No parameters

## Employer Tools

### 1. Post a Job and Hire

**Flow:** `create_job` -> wait for applications -> `get_candidate_profile`

Post a job with a title, description, and requirements. Candidates apply and take an AI interview. Review their profiles and assessment scores. Free tier allows 2 active jobs and 1 candidate reveal; Pro unlocks unlimited.

**Tool reference:**

- **`create_job`** -- Post a new job listing
  - `title` (string, required): Job title, e.g. "Senior Frontend Engineer"
  - `description` (string, required): Full job description (markdown supported)
  - `requirements` (array of strings, optional): List of requirements
  - `location` (string, optional, default "Remote"): Job location
  - `type` (enum, optional, default "full-time"): `full-time` | `part-time` | `contract` | `remote`
  - `salary` (string, optional): Salary range, e.g. "$120k-$160k"
  - `question_count` (number, optional, default 8): Interview questions (3-20)

- **`list_my_jobs`** -- List your job postings with application counts
  - `include_inactive` (boolean, optional, default false): Include closed/draft jobs

- **`get_candidate_profile`** -- View a candidate's full profile and assessment (counts as a reveal)
  - `candidate_id` (string, required): Candidate user ID from search results

### 2. Search the Talent Pool

**Flow:** `search_candidates` -> `get_candidate_profile` -> `invite_candidate`

Search the pool of pre-assessed candidates using natural language. Filter by location and minimum assessment score. This is the fastest way to find qualified candidates since they already have AI interview scores.

Requires Pro subscription.

**Tool reference:**

- **`search_candidates`** -- Semantic search across the talent pool
  - `query` (string, required): Natural language query, e.g. "senior React developer with AWS experience"
  - `location` (string, optional): Filter by location
  - `min_score` (number, optional): Minimum assessment score (1-10 scale)
  - `limit` (number, optional, default 10): Max results (1-50)

### 3. Source from LinkedIn

**Flow:** `hunt_candidates` -> review results -> `invite_candidate`

Search LinkedIn for external candidates who are not yet on Hunaras. Found candidates can be invited to join the platform. Hunaras handles the outreach on your behalf.

Requires Pro subscription. Maximum 20 invites per day.

**Tool reference:**

- **`hunt_candidates`** -- Search LinkedIn for external candidates
  - `query` (string, required): Search query, e.g. "React developer San Francisco"
  - `keywords` (array of strings, optional): Additional keywords to refine results

- **`invite_candidate`** -- Invite an external candidate to Hunaras
  - `linkedin_url` (string, required): Full LinkedIn profile URL
  - `name` (string, required): Candidate name
  - `headline` (string, optional): Their LinkedIn headline or current role
  - `company` (string, optional): Their current company

### 4. Market Research

**Flow:** `get_market_insights`

Get market data to inform your hiring strategy -- active job counts, candidate pool size, job type distribution, top locations, and salary ranges.

**Tool reference:**

- **`get_market_insights`** -- Get job market data (available to both roles)
  - `category` (string, optional): Filter by job category, e.g. "engineering", "marketing"
  - `location` (string, optional): Filter by location, e.g. "Remote", "New York"

### 5. Manage Your Pipeline

**Flow:** `list_my_jobs` -> review statuses and applicant counts

Monitor your job postings, see how many applications each has received, and track which positions need attention.

## Decision Trees

### For Employers: Talent Pool vs LinkedIn Hunt

| Criteria                  | Talent Pool (`search_candidates`) | LinkedIn (`hunt_candidates`)     |
|---------------------------|-----------------------------------|----------------------------------|
| Candidates pre-assessed?  | Yes -- AI interview scores ready  | No -- must complete interview    |
| Speed to hire             | Fast -- profiles ready to review  | Slower -- outreach + onboarding  |
| Reach                     | Platform users only               | All of LinkedIn                  |
| Cost                      | Pro subscription                  | Pro subscription + daily limits  |
| Best for                  | Active hiring with known criteria | Hard-to-fill or niche roles      |

**Recommendation:** Start with `search_candidates`. Fall back to `hunt_candidates` when the talent pool does not have enough matches.

### For Candidates: Visibility Strategy

- **Set visible** (`update_visibility` with `visible: true`) if you are actively looking or open to opportunities. Employers with Pro can discover you.
- **Set hidden** (`update_visibility` with `visible: false`) if you are not looking. Your applications and assessments are unaffected.
- Complete your profile before going visible -- employers see your headline, bio, skills, and assessment scores.

## Free vs Pro (Employers)

| Feature                    | Free                  | Pro ($200/month)      |
|----------------------------|------------------------|----------------------|
| Active job postings        | 2                      | Unlimited            |
| Candidate reveals          | 1                      | Unlimited            |
| Talent pool search         | Not available          | Full semantic search |
| LinkedIn sourcing          | Not available          | 20 invites/day       |
| Meeting scheduling         | Not available          | Full access          |
| Team seats                 | 1                      | Multiple             |

Candidates always use Hunaras for free.

### Handling Upgrade Prompts

When a tool returns an upgrade-required message, inform the user:
- What feature they tried to use
- That it requires a Pro subscription
- Direct them to https://hunaras.com/pricing

## Error Handling

| Status | Meaning                    | Suggested Response                                                  |
|--------|----------------------------|---------------------------------------------------------------------|
| 401    | Not authenticated          | "Please check your API key configuration"                           |
| 403    | Forbidden / upgrade needed | Check if `upgradeRequired` -- suggest Pro upgrade at hunaras.com/pricing |
| 404    | Resource not found         | Verify the ID/slug is correct and try again                         |
| 409    | Duplicate action           | User already performed this action (e.g., already applied, already rated) |
| 429    | Rate limited               | Daily limit reached -- wait or try again tomorrow                   |
| 502    | Upstream service down      | "This service is temporarily unavailable, please try again later"   |

## Domain Tips

### Writing Job Descriptions (`create_job`)
- Be specific about requirements vs nice-to-haves
- Include a salary range -- jobs with listed salary get more qualified applicants
- Specify remote/hybrid/onsite clearly in the location field
- Use the `requirements` array for structured, scannable requirements
- Set `question_count` between 5-12 for most roles; use higher counts (15-20) for senior/complex positions

### Interpreting Assessments
- Dimension breakdown matters more than the overall score
- Check strengths and weaknesses for a nuanced view beyond the numbers
- The `recommendation` field gives an AI-generated hiring recommendation
- Scores are calibrated relative to the job requirements, not absolute

### Candidate Profile Optimization
- A complete profile (headline, bio, skills, location) ranks higher in talent pool search
- Syncing LinkedIn imports verified experience data
- Multiple assessments from different job applications show range and consistency

## Reference Files

For detailed multi-step orchestration patterns, see:
- [Employer Workflows](references/employer-workflows.md) -- complete employer journey guides
- [Candidate Workflows](references/candidate-workflows.md) -- complete candidate journey guides
