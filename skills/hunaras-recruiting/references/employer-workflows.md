# Employer Workflows

Detailed multi-step orchestration guides for employer journeys on Hunaras. Each workflow includes exact tool sequences, parameter examples, decision points, and tips.

## Table of Contents

1. [Post a Job and Start Hiring](#1-post-a-job-and-start-hiring)
2. [Search the Talent Pool](#2-search-the-talent-pool)
3. [Source Candidates from LinkedIn](#3-source-candidates-from-linkedin)
4. [Full Hiring Pipeline](#4-full-hiring-pipeline)
5. [Market Research Before Hiring](#5-market-research-before-hiring)
6. [Manage Active Listings](#6-manage-active-listings)

---

## 1. Post a Job and Start Hiring

### When to Use
You have a role to fill and want candidates to come to you through the platform.

### Tool Sequence

```
create_job  -->  list_my_jobs (verify)  -->  [wait for applications]  -->  get_candidate_profile
```

### Step-by-Step

**Step 1: Create the job**

Call `create_job` with job details:

```
create_job({
  title: "Senior Backend Engineer",
  description: "We are building a high-throughput data pipeline...",
  requirements: [
    "5+ years experience with Go or Rust",
    "Experience with distributed systems",
    "Strong understanding of database internals",
    "Nice-to-have: Kubernetes experience"
  ],
  location: "Remote",
  type: "full-time",
  salary: "$150k-$190k",
  question_count: 10
})
```

Tips:
- The `description` field supports markdown. Use headers, bullet points, and emphasis for readability.
- Separate hard requirements from nice-to-haves in the `requirements` array -- the AI interview uses these to calibrate questions.
- Set `question_count` based on role complexity: 5-8 for junior, 8-12 for mid-level, 10-15 for senior, 15-20 for principal/architect.
- Always include a `salary` range. Jobs with salary listed receive significantly more qualified applications.

**Decision: Free tier limit**

If you are on Free tier and already have 2 active jobs, the tool will return an upgrade-required message. Options:
- Close an existing job, then try again
- Upgrade to Pro at https://hunaras.com/pricing

**Step 2: Verify the listing**

Call `list_my_jobs` to confirm the job is active:

```
list_my_jobs({})
```

The response shows each job with its application count, status, and ID. Verify the new job appears as `active`.

**Step 3: Wait for applications**

Candidates discover the job via `search_jobs` on the platform and apply. Each applicant takes an AI interview that generates a scored assessment. You will be notified as applications come in.

**Step 4: Review candidates**

Once applications arrive, use `get_candidate_profile` to see the full profile and assessment:

```
get_candidate_profile({
  candidate_id: "clx1234abcdef"
})
```

This counts as a "reveal":
- **Free tier**: 1 reveal total. Your first reveal shows the full experience -- profile, assessment scores, strengths, weaknesses, and recommendation. The second candidate onward requires Pro.
- **Pro tier**: Unlimited reveals.

### What to Look For in Assessments

When reviewing a candidate's profile, pay attention to:

1. **Overall score** -- quick filter, but do not rely on it alone
2. **Technical score** -- calibrated to your job's requirements
3. **Communication score** -- especially important for collaborative/client-facing roles
4. **Strengths and weaknesses** -- the qualitative detail matters most
5. **Recommendation** -- the AI's hiring recommendation (strongly_recommend, recommend, consider, do_not_recommend)

---

## 2. Search the Talent Pool

**Requires Pro subscription.**

### When to Use
You want to proactively find candidates who are already on the platform and have completed AI assessments. This is the fastest path to finding qualified candidates.

### Tool Sequence

```
search_candidates  -->  get_candidate_profile  -->  invite_candidate (optional)
```

### Step-by-Step

**Step 1: Search with natural language**

```
search_candidates({
  query: "React developer with TypeScript and Node.js experience",
  location: "Remote",
  min_score: 7,
  limit: 15
})
```

Tips:
- Write the query as you would describe the ideal candidate in conversation -- the search uses AI semantic matching.
- `min_score` is on a 1-10 scale (maps to assessment scores). Setting 7+ filters to strong candidates.
- Start broad and narrow down. If you get too few results, remove the `location` filter or lower `min_score`.
- The `similarity` percentage in results indicates how well the candidate's profile matches your query.

**Step 2: Review top matches**

For each promising candidate, call `get_candidate_profile`:

```
get_candidate_profile({
  candidate_id: "clx5678ghijkl"
})
```

Review the assessment dimensions, experience, and skills. Each call counts as a reveal.

**Step 3: Decision point -- invite or pass**

If the candidate looks like a fit but you want them to apply to your specific job, note their contact details from the profile. You can also use `invite_candidate` if they were discovered but have not applied to your role.

### Search Strategy

| Scenario                        | Query Approach                                      |
|---------------------------------|-----------------------------------------------------|
| Specific tech stack             | Name the technologies: "Go, PostgreSQL, gRPC"       |
| Broad role search               | Describe the role: "senior engineer, distributed systems" |
| Culture/soft skill focus         | Include traits: "strong communicator, team lead"    |
| Industry-specific               | Add context: "fintech payments engineer"            |

**Iterative refinement:**
1. Start broad: `"backend engineer"` with no filters
2. Check results -- if too many, add location or raise min_score
3. If too few, broaden the query or drop filters
4. Try alternative phrasings: "full-stack" vs "fullstack", "ML" vs "machine learning"

---

## 3. Source Candidates from LinkedIn

**Requires Pro subscription.**

### When to Use
The talent pool does not have enough candidates for your role, or you are looking for passive candidates who are not yet on the platform.

### Tool Sequence

```
hunt_candidates  -->  [review results]  -->  invite_candidate (for each fit)
```

### Step-by-Step

**Step 1: Search LinkedIn**

```
hunt_candidates({
  query: "Staff ML Engineer",
  keywords: ["PyTorch", "recommendation systems", "Bay Area"]
})
```

Tips:
- The `query` is sent to LinkedIn search -- use LinkedIn search conventions.
- Use `keywords` to add technical specifics that refine results without cluttering the main query.
- Results are external profiles -- they are NOT saved to Hunaras and do NOT have assessment scores.

**Step 2: Review results**

Each result includes name, headline, location, company, and LinkedIn URL. Evaluate based on headline and company to decide who to invite.

**Step 3: Invite selected candidates**

For each promising profile, call `invite_candidate`:

```
invite_candidate({
  linkedin_url: "https://www.linkedin.com/in/jane-doe-12345",
  name: "Jane Doe",
  headline: "Staff ML Engineer at Meta",
  company: "Meta"
})
```

What happens next:
- Hunaras adds the candidate to an outreach queue and contacts them on your behalf.
- The candidate receives an invitation to join Hunaras and apply to your job.
- You are limited to 20 invites per day to maintain outreach quality.

**Handling errors:**
- `409` -- candidate was already invited (by you or another employer)
- `429` -- daily invite limit reached; wait until tomorrow
- `502` -- LinkedIn scraper is temporarily unavailable

### Talent Pool vs LinkedIn: Decision Framework

```
Do you need candidates NOW?
  |
  +--> YES --> search_candidates (talent pool)
  |              |
  |              +--> Found enough? --> Done
  |              +--> Not enough? --> hunt_candidates (LinkedIn)
  |
  +--> NO (building pipeline) --> hunt_candidates (LinkedIn)
```

---

## 4. Full Hiring Pipeline

### End-to-End Orchestration

This workflow combines all employer tools into a complete hiring cycle.

```
Phase 1: Research
  get_market_insights  -->  understand demand and salary benchmarks

Phase 2: Post
  create_job  -->  list_my_jobs (verify)

Phase 3: Source (parallel)
  search_candidates (talent pool)  |  hunt_candidates (LinkedIn)
                                   |
                        invite_candidate (for LinkedIn finds)

Phase 4: Review
  get_candidate_profile (for each applicant)

Phase 5: Hire
  [Schedule meetings via web platform]
```

### Phase 1: Market Research

Before posting, understand the market:

```
get_market_insights({
  category: "engineering",
  location: "Remote"
})
```

Use the salary ranges and job counts to calibrate your offer. If there are many active jobs in your category, consider offering above-market salary to stand out.

### Phase 2: Post the Job

Create the job informed by market data:

```
create_job({
  title: "Senior Frontend Engineer",
  description: "...",
  requirements: ["React", "TypeScript", "3+ years"],
  salary: "$140k-$170k",
  location: "Remote",
  type: "full-time",
  question_count: 8
})
```

### Phase 3: Proactive Sourcing

While waiting for organic applications, proactively search for candidates.

Run talent pool and LinkedIn searches in parallel (if Pro):

```
search_candidates({
  query: "senior frontend React TypeScript",
  limit: 20
})
```

```
hunt_candidates({
  query: "Senior Frontend Engineer React",
  keywords: ["TypeScript", "Next.js"]
})
```

Invite promising LinkedIn finds:

```
invite_candidate({
  linkedin_url: "https://linkedin.com/in/...",
  name: "...",
  headline: "..."
})
```

### Phase 4: Review Applicants

As applications come in, review profiles:

```
get_candidate_profile({ candidate_id: "..." })
```

**Prioritization strategy:**
1. Sort by overall assessment score
2. Check technical score first for engineering roles
3. Read strengths/weaknesses for nuanced comparison
4. Look at the recommendation: `strongly_recommend` candidates should be fast-tracked

### Phase 5: Schedule and Hire

Meeting scheduling happens through the Hunaras web platform. When you schedule a meeting:
- The candidate receives an email with accept/reschedule/decline options
- If you have Google Calendar connected, a Meet link is generated automatically
- Otherwise, a Jitsi video call link is provided

---

## 5. Market Research Before Hiring

### When to Use
You want to understand the hiring landscape before committing to a role, or need data to justify a salary range to stakeholders.

### Tool Sequence

```
get_market_insights (broad)  -->  get_market_insights (filtered)
```

### Step-by-Step

**Step 1: Broad market overview**

```
get_market_insights({})
```

Returns: total active jobs, candidate pool size, job type distribution, top locations, and sample salary ranges.

**Step 2: Filtered by your niche**

```
get_market_insights({
  category: "data science",
  location: "New York"
})
```

**Step 3: Compare multiple markets**

Run multiple queries to compare:

```
get_market_insights({ category: "engineering", location: "Remote" })
get_market_insights({ category: "engineering", location: "San Francisco" })
get_market_insights({ category: "engineering", location: "New York" })
```

This shows you where the talent and competition is concentrated.

### Using Market Data

| Data Point              | How to Use It                                                |
|-------------------------|--------------------------------------------------------------|
| Active job count        | High count = competitive market; differentiate your listing  |
| Candidate pool size     | Low count = consider LinkedIn sourcing                       |
| Job type distribution   | Match your offering to what candidates expect                |
| Salary ranges           | Benchmark your offer against the market                      |
| Top locations           | Consider where talent is concentrated                        |

---

## 6. Manage Active Listings

### When to Use
You want to review your job postings, check application volumes, or decide which jobs need attention.

### Tool Sequence

```
list_my_jobs  -->  [identify jobs needing action]
```

### Step-by-Step

**Active jobs only (default):**

```
list_my_jobs({})
```

**All jobs including closed/draft:**

```
list_my_jobs({ include_inactive: true })
```

### What to Look For

- **Low application count after 1+ week** -- consider revising the description, adjusting salary, or sourcing proactively via `search_candidates` or `hunt_candidates`
- **High application count** -- prioritize reviewing with `get_candidate_profile`
- **Closed jobs** -- use `include_inactive: true` to see historical data

### Free Tier Job Management

Free employers can have at most 2 active jobs. If you need to post a new job:
1. Check current active jobs with `list_my_jobs`
2. If you have 2 active, close one through the web platform
3. Then call `create_job` for the new posting

Or upgrade to Pro for unlimited active postings.

---

## Pro Features Summary

Tools that require Pro and what happens on Free tier:

| Tool                  | Free Tier Behavior                                    |
|-----------------------|-------------------------------------------------------|
| `create_job`          | Works for first 2 active jobs; blocked after that     |
| `get_candidate_profile` | 1 free reveal; blocked after that                  |
| `search_candidates`   | Returns upgrade-required message                     |
| `hunt_candidates`     | Returns upgrade-required message                     |
| `invite_candidate`    | Returns upgrade-required message                     |
| `list_my_jobs`        | Always works                                         |
| `get_market_insights` | Always works                                         |

When any tool returns an upgrade prompt, suggest the employer visit https://hunaras.com/pricing to upgrade to Pro ($200/month).
