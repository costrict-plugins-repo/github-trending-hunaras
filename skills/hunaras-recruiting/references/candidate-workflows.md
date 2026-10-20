# Candidate Workflows

Detailed multi-step orchestration guides for candidate journeys on Hunaras. Each workflow includes exact tool sequences, parameter examples, decision points, and tips.

All candidate features are free. You never need to pay to use Hunaras.

## Table of Contents

1. [Find and Apply for Jobs](#1-find-and-apply-for-jobs)
2. [Review Your Interview Assessments](#2-review-your-interview-assessments)
3. [Build and Optimize Your Profile](#3-build-and-optimize-your-profile)
4. [Manage Meeting Invitations](#4-manage-meeting-invitations)
5. [Rate Employers](#5-rate-employers)
6. [Stay on Top of Notifications](#6-stay-on-top-of-notifications)
7. [Track Your Applications](#7-track-your-applications)
8. [Complete Job Search Journey](#8-complete-job-search-journey)

---

## 1. Find and Apply for Jobs

### When to Use
You are looking for a new role and want to discover jobs that match your skills and interests.

### Tool Sequence

```
search_jobs  -->  get_job_details  -->  apply_to_job
```

### Step-by-Step

**Step 1: Search for jobs**

Use natural language to describe what you are looking for:

```
search_jobs({
  query: "frontend developer with React and TypeScript",
  location: "Remote",
  type: "full-time",
  limit: 15
})
```

Tips:
- Write the query as you would describe your ideal job in conversation. The search uses AI semantic matching, so natural language works better than keyword lists.
- Leave `location` empty to search all locations.
- The `type` filter accepts: `full-time`, `part-time`, `contract`, `internship`.
- Results include a `Match` percentage showing how well each job aligns with your query.

**Search strategy for different situations:**

| Situation                   | Query Approach                                           |
|-----------------------------|----------------------------------------------------------|
| Know exactly what you want  | Be specific: "senior React developer, fintech, remote"   |
| Exploring options           | Be broad: "software engineer"                           |
| Career change               | Describe target: "entry-level data analyst"              |
| Specific company type       | Add context: "startup backend engineer, Python"          |

**Step 2: Get full job details**

For each interesting result, drill into the details:

```
get_job_details({
  job_id: "clx9876mnopqr"
})
```

The response includes:
- Full job description (often in markdown with detailed requirements)
- Salary range (if listed)
- Employment type and location
- Number of existing applicants
- Number of interview questions you will face
- Company name and employer info

**What to evaluate:**
- Does the description match what you expected from the search result?
- Are you qualified for the listed requirements?
- Is the salary range acceptable?
- How many interview questions? (5-8 is typical for junior, 10-15 for senior)

**Step 3: Apply to the job**

```
apply_to_job({
  job_id: "clx9876mnopqr",
  cover_letter: "I am excited about this role because..."
})
```

Tips for cover letters:
- A cover letter is optional but recommended. It is shown to the employer alongside your assessment.
- Keep it concise (2-3 paragraphs). The AI interview is where you demonstrate depth.
- Highlight why this specific role interests you, not generic qualifications.
- If your background is non-traditional for the role, the cover letter is where you bridge the gap.

**What happens after applying:**
1. Your application is created with status `pending`
2. You will be directed to take the AI video interview on the Hunaras web platform
3. The AI asks questions calibrated to the job requirements (the `question_count` set by the employer)
4. After completing the interview, the AI generates your scored assessment
5. The employer can then review your application, profile, and assessment

---

## 2. Review Your Interview Assessments

### When to Use
You have completed one or more AI interviews and want to understand your scores and feedback.

### Tool Sequence

```
get_my_assessments  -->  get_assessment_details
```

### Step-by-Step

**Step 1: List all assessments**

```
get_my_assessments({})
```

Returns a summary of all your completed assessments with overall scores and job names.

**Step 2: View detailed assessment**

```
get_assessment_details({
  assessment_id: "clxassess123"
})
```

### Understanding Your Scores

Each assessment rates you across 5 dimensions on a 0-100 scale:

| Dimension          | What It Measures                                         |
|--------------------|----------------------------------------------------------|
| Technical Skills   | Domain knowledge, technical depth, practical expertise   |
| Communication      | Clarity, articulation, ability to explain complex topics  |
| Problem Solving    | Analytical thinking, structured approach to challenges   |
| Experience         | Relevant background, accomplishments, depth of work      |
| Culture Fit        | Alignment with team values, collaboration style          |

**Score interpretation:**

| Range   | Meaning              | What It Signals to Employers                    |
|---------|----------------------|-------------------------------------------------|
| 80-100  | Exceptional          | Top candidate, likely to receive offers quickly  |
| 60-79   | Strong               | Solid candidate, competitive for most roles      |
| 40-59   | Average              | Meets basic requirements, room for growth        |
| Below 40| Below expectations   | May need more preparation for this role type     |

**Key fields in the detailed assessment:**
- **Overall Score** -- weighted average of all dimensions
- **Strengths** -- specific things you demonstrated well
- **Areas for Improvement** -- where you could grow
- **Recommendation** -- AI's hiring recommendation: `strongly_recommend`, `recommend`, `consider`, or `do_not_recommend`
- **Summary** -- narrative paragraph about your interview performance

### Using Assessments to Improve

Your assessments are portable -- they form your "talent card" that any employer on the platform can see. To strengthen your profile:

1. Review weaknesses from past assessments before your next interview
2. Each new interview is a fresh assessment. Improved performance generates better scores.
3. Multiple strong assessments across different roles signal versatility
4. Consistent high scores in a specific dimension (e.g., communication) become a standout strength

---

## 3. Build and Optimize Your Profile

### When to Use
You want to make your profile more discoverable to employers or keep it up to date.

### Tool Sequence

```
get_my_profile  -->  update_profile  -->  sync_linkedin  -->  update_visibility
```

### Step-by-Step

**Step 1: Review your current profile**

```
get_my_profile({})
```

Check what is filled in and what is missing. A complete profile includes: name, headline/title, bio, location, skills, and at least one assessment.

**Step 2: Update profile fields**

```
update_profile({
  headline: "Senior Full-Stack Engineer | React, Node.js, AWS",
  bio: "8 years of experience building scalable web applications. Passionate about developer experience and clean architecture. Previously at Stripe and Shopify.",
  location: "San Francisco, CA",
  skills: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL", "GraphQL", "Docker"]
})
```

Only fields you provide are updated -- you can call this multiple times to update individual fields.

**Profile optimization tips:**

| Field     | Best Practice                                                      |
|-----------|--------------------------------------------------------------------|
| Headline  | Use a clear title with 2-3 key technologies, e.g. "Backend Engineer / Go, PostgreSQL, Kubernetes" |
| Bio       | 2-3 sentences: years of experience, key accomplishments, what you are looking for |
| Location  | Include city and state/country. Use "Remote" if you are location-flexible |
| Skills    | List 5-10 specific, searchable skills. Use standard names (e.g. "React" not "ReactJS") |

**Step 3: Sync from LinkedIn (optional)**

```
sync_linkedin({})
```

This pulls your latest experience, education, and skills from your linked LinkedIn account. It supplements (does not overwrite) your manually entered data.

Note: LinkedIn sync requires that you previously connected your LinkedIn account through the Hunaras web platform. If the scraper is temporarily down (502 error), try again later.

**Step 4: Set your visibility**

```
update_visibility({
  visible: true
})
```

**Visibility decision guide:**

| Your Situation                                  | Recommended Visibility |
|-------------------------------------------------|------------------------|
| Actively job searching                          | Visible                |
| Open to opportunities but not actively looking  | Visible                |
| Employed and not looking                        | Hidden                 |
| Profile incomplete (no assessments yet)         | Hidden (until ready)   |

When visible:
- Employers with Pro subscriptions can find you through talent pool search
- Your headline, bio, skills, location, and assessment scores are searchable
- Your profile appears ranked by semantic relevance to employer queries

When hidden:
- You do not appear in search results
- Your existing applications and assessments are unaffected
- You can still search for and apply to jobs normally

### Profile Completeness Checklist

For maximum discoverability, ensure you have:
- [ ] A clear headline/title
- [ ] A bio with experience summary
- [ ] Your location
- [ ] 5+ relevant skills listed
- [ ] At least one completed AI assessment
- [ ] Visibility set to `true`

---

## 4. Manage Meeting Invitations

### When to Use
An employer has reviewed your assessment and wants to schedule a meeting (phone screen, video call, or in-person interview).

### Tool Sequence

```
get_my_appointments  -->  respond_to_appointment
```

### Step-by-Step

**Step 1: Check your appointments**

```
get_my_appointments({})
```

Lists all meeting proposals with their status, proposed times, and employer details.

**Step 2: Respond to an appointment**

You have three options:

**Accept:**
```
respond_to_appointment({
  appointment_id: "clxappt456",
  action: "accept",
  message: "Looking forward to it!"
})
```

When you accept:
- If the employer has Google Calendar connected, a Google Meet link is generated and added to both calendars
- Otherwise, a Jitsi video call link is provided
- Both parties receive a confirmation email

**Reschedule:**
```
respond_to_appointment({
  appointment_id: "clxappt456",
  action: "reschedule",
  message: "I have a conflict at that time. Could we do Thursday instead?",
  proposed_at: "2026-03-15T14:00:00Z"
})
```

When you reschedule:
- The employer receives your proposed alternative time
- They can accept or propose a different time
- The process loops until both parties agree

**Reject:**
```
respond_to_appointment({
  appointment_id: "clxappt456",
  action: "reject",
  rejection_reason: "Thank you for the interest, but I have accepted another offer."
})
```

When you reject:
- The employer is notified with your reason
- Your application status may be updated
- This is permanent -- you cannot undo a rejection

### Response Best Practices

| Scenario                                | Recommended Action                          |
|-----------------------------------------|---------------------------------------------|
| Time works, you are interested          | Accept with a brief positive message        |
| Interested but time conflicts           | Reschedule with a specific alternative      |
| No longer interested in the role        | Reject with a polite, honest reason         |
| Need to think about it                  | Do not respond immediately; come back later |
| Have multiple offers                    | Be transparent; mention your timeline       |

Tips:
- Respond promptly. Employers track response times.
- When rescheduling, always propose a specific alternative time rather than leaving it open-ended.
- Keep rejection messages professional -- the employer may have other roles in the future.

---

## 5. Rate Employers

### When to Use
You have completed an interview process with an employer and want to share your experience to help other candidates.

### Tool Sequence

```
get_pending_ratings  -->  rate_employer  -->  get_my_ratings
```

### Step-by-Step

**Step 1: See who you can rate**

```
get_pending_ratings({})
```

Returns employers you have interacted with but have not yet rated.

**Step 2: Submit a rating**

```
rate_employer({
  job_id: "clxjob789",
  overall_score: 4,
  trigger: "AFTER_MEETING",
  comment: "Clear communication throughout the process. Interview questions were relevant and well-structured. Feedback was provided within 3 days."
})
```

The rating scale:
- **5** -- Exceptional experience. Clear communication, fair process, valuable feedback.
- **4** -- Good experience. Professional and respectful, minor areas for improvement.
- **3** -- Average experience. Adequate process but nothing stood out.
- **2** -- Below average. Slow responses, unclear expectations, or unprofessional conduct.
- **1** -- Poor experience. Disrespectful, misleading, or severely unprofessional.

**Step 3: Review your ratings**

```
get_my_ratings({})
```

See all ratings you have given and received.

### Rating Guidelines

**What to consider when rating:**
- Communication speed and clarity throughout the process
- Whether the interview process was fair and relevant to the role
- Whether you received meaningful feedback (even if you were not selected)
- Professionalism and respect shown by the hiring team
- Accuracy of the job description vs the actual role

**What NOT to base your rating on:**
- Whether or not you got the job -- rate the process, not the outcome
- Salary negotiations -- these are separate from process quality
- Personal feelings about being rejected

**Writing helpful comments:**
- Be specific: "Responded to my application within 24 hours" is more helpful than "Good communication"
- Be constructive: "The technical interview felt too long at 2 hours" is more helpful than "Bad interview"
- Be honest but professional: future employers can see that you leave thoughtful feedback

---

## 6. Stay on Top of Notifications

### When to Use
You want to check for updates on your applications, meeting invitations, or other activity.

### Tool Sequence

```
get_my_notifications  -->  mark_notifications_read
```

### Step-by-Step

**Step 1: Check notifications**

All notifications:
```
get_my_notifications({})
```

Unread only:
```
get_my_notifications({
  unread_only: true
})
```

### Notification Types

| Notification                    | What to Do                                  |
|---------------------------------|---------------------------------------------|
| New meeting invitation          | Use `get_my_appointments` to review and respond |
| Application status change       | Use `get_my_applications` to see updated status |
| New assessment available        | Use `get_my_assessments` to review scores    |
| Employer viewed your profile    | No action needed -- your visibility is working |
| Job invitation                  | Use `get_job_details` to review the role     |

**Step 2: Mark as read**

Mark a specific notification:
```
mark_notifications_read({
  notification_id: "clxnotif123"
})
```

Mark all as read:
```
mark_notifications_read({})
```

### Notification Cadence

Check notifications regularly during an active job search. Key moments to check:
- After submitting an application (status updates)
- 1-3 days after an AI interview (assessment results)
- After responding to a meeting invitation (confirmation or counter-proposal)

---

## 7. Track Your Applications

### When to Use
You want an overview of all your job applications and their current statuses.

### Tool Sequence

```
get_my_applications
```

### Step-by-Step

```
get_my_applications({})
```

### Understanding Application Statuses

Applications move through these statuses:

```
pending  -->  screening  -->  interviewed  -->  shortlisted  -->  appointment  -->  hired
                                    |                |
                                    v                v
                                rejected         rejected
```

| Status        | Meaning                                    | Your Next Step                        |
|---------------|--------------------------------------------|---------------------------------------|
| pending       | Submitted, awaiting employer review        | Wait; complete AI interview if prompted |
| screening     | Employer is reviewing your application     | Wait; prepare for potential meeting   |
| interviewed   | AI interview completed, assessment ready   | Check assessment with `get_my_assessments` |
| shortlisted   | You made the short list                    | Be ready for a meeting invitation     |
| appointment   | Meeting has been scheduled                 | Check `get_my_appointments`           |
| hired         | You got the job                            | Congratulations!                      |
| rejected      | Not selected for this role                 | Review assessment for improvement areas |

### What to Do When Rejected

1. Review your assessment for that job: `get_my_assessments` then `get_assessment_details`
2. Identify the weakest dimension and work on it
3. Your next AI interview will generate a fresh assessment -- each one is independent
4. Rate the employer's process: `get_pending_ratings` then `rate_employer`
5. Keep applying: `search_jobs` to find new opportunities

---

## 8. Complete Job Search Journey

### End-to-End Orchestration

This workflow covers a full job search from profile setup through hiring.

```
Phase 1: Profile Setup
  get_my_profile  -->  update_profile  -->  sync_linkedin  -->  update_visibility

Phase 2: Job Discovery
  search_jobs  -->  get_job_details  -->  apply_to_job (repeat)

Phase 3: Interview & Assessment
  [Complete AI interview on web platform]
  get_my_assessments  -->  get_assessment_details

Phase 4: Employer Interaction
  get_my_notifications  -->  get_my_appointments  -->  respond_to_appointment

Phase 5: Post-Process
  rate_employer  -->  [continue searching or accept offer]
```

### Phase 1: Set Up Your Profile

First-time setup (run once, update as needed):

```
get_my_profile({})
```

If profile is incomplete:
```
update_profile({
  headline: "Full-Stack Developer | React, Python, AWS",
  bio: "5 years building web applications...",
  location: "Austin, TX",
  skills: ["React", "Python", "AWS", "PostgreSQL", "Docker"]
})
```

Import LinkedIn data:
```
sync_linkedin({})
```

Go visible:
```
update_visibility({ visible: true })
```

### Phase 2: Search and Apply

Run a search:
```
search_jobs({
  query: "full stack developer Python React",
  type: "full-time",
  limit: 20
})
```

For top matches, get details and apply:
```
get_job_details({ job_id: "..." })
apply_to_job({ job_id: "...", cover_letter: "..." })
```

**Apply to multiple jobs.** Each application generates an independent AI interview and assessment. Applying broadly improves your chances and gives you more assessment data points.

### Phase 3: Interview and Review

After applying, complete the AI interview on the Hunaras web platform. Then review your results:

```
get_my_assessments({})
get_assessment_details({ assessment_id: "..." })
```

Use assessment feedback to prepare for subsequent interviews. Focus on your weakest dimension.

### Phase 4: Respond to Employers

Check for updates:
```
get_my_notifications({ unread_only: true })
```

If you have meeting invitations:
```
get_my_appointments({})
respond_to_appointment({
  appointment_id: "...",
  action: "accept"
})
```

### Phase 5: Close the Loop

After completing the process (regardless of outcome), rate the employer:

```
get_pending_ratings({})
rate_employer({
  job_id: "...",
  overall_score: 4,
  trigger: "AFTER_MEETING",
  comment: "Professional and transparent process."
})
```

### Managing Multiple Applications

When you have several active applications:

1. Use `get_my_applications` regularly to track all statuses at once
2. Check `get_my_notifications` for time-sensitive updates (meeting invitations)
3. Respond to appointments promptly -- employers notice response speed
4. If you accept an offer, consider withdrawing from other active processes out of courtesy

### Passive Job Seeking

If you are employed but open to opportunities:

1. Complete your profile and set `visible: true`
2. Employers with Pro subscriptions can discover you through talent pool search
3. You do not need to actively search -- let employers come to you
4. Check `get_my_notifications` periodically for inbound interest
5. When invited to apply, use `get_job_details` to evaluate before committing
