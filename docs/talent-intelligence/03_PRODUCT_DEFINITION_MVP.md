# The Right Hat — Phase 3: Product Definition & MVP

Status: COMPLETE
Decision owner: Founder
Date: 2026-07-10
Product thesis: Verified Talent Passport + Explainable Shortlist
Launch scope: Morocco, cybersecurity/cloud/AI/software, concierge-assisted delivery

---

## 1. Executive decision

The MVP is not a job board, a social network, a general freelance marketplace or a complete ATS.

It is a focused trust workflow that helps an employer move from an unclear technical hiring need to a human-reviewed shortlist of evidence-backed candidates.

The product must prove two things:

1. employers will pay for faster, higher-confidence technical shortlists;
2. strong talent will invest time in a reusable evidence-based professional passport.

### MVP promise

> Give TRH a difficult technology role. Receive a shortlist of three to five consented candidates with explicit evidence, gaps and interview focus areas.

### Primary value metric

**Time to qualified shortlist**, measured from approved role brief to delivery of the first employer-reviewable shortlist.

### Phase 3 verdict

**BUILD THE CONCIERGE-ASSISTED MVP.**

The first release should automate structure, visibility, evidence handling and workflow while keeping verification, recommendation approval and final hiring decisions under human control.

---

## 2. Product boundaries

### Included in MVP

- talent onboarding;
- candidate consent and visibility controls;
- structured technical profile;
- evidence vault;
- verification workflow;
- Verified Talent Passport;
- employer organization and members;
- structured Role Brief;
- human-reviewed semantic shortlist;
- explainable match evidence;
- recruiter pipeline;
- candidate contact and interest status;
- interview notes and outcome capture;
- operations workspace for TRH reviewers;
- audit trail;
- basic analytics.

### Explicitly excluded

- public mass job board;
- general professional social feed;
- open bidding marketplace;
- payroll, EOR and escrow;
- full ATS replacement;
- video interviewing infrastructure;
- automatic rejection;
- personality or emotion scoring;
- universal candidate score;
- salary prediction presented as objective truth;
- autonomous outreach without approval;
- public leaderboards;
- generic learning catalogue;
- co-founder matching;
- investor marketplace;
- advertising;
- selling identifiable candidate data.

---

## 3. Primary actors

## 3.1 Talent

Initial talent groups:

- cybersecurity specialists;
- SOC analysts;
- penetration testers;
- cloud and DevOps engineers;
- DevSecOps engineers;
- data and ML engineers;
- backend/platform engineers;
- high-potential juniors with strong practical evidence;
- diaspora professionals open to regional or cross-border work.

### Jobs to be done

- prove capability beyond a CV;
- reuse verified evidence across opportunities;
- control who sees sensitive professional information;
- access better local and international opportunities;
- reduce repeated low-quality screening;
- understand which evidence is missing.

## 3.2 Employer

Primary buyer/user:

- CTO;
- CISO;
- Head of Engineering;
- Founder;
- Head of Talent;
- specialist technical recruiter.

### Jobs to be done

- convert an unclear vacancy into a usable capability brief;
- find credible candidates quickly;
- understand why each candidate is recommended;
- reduce engineering screening burden;
- track candidate progress;
- preserve notes and decisions;
- learn which evidence predicts successful interviews and hires.

## 3.3 TRH Operations

Internal roles:

- talent researcher;
- verification analyst;
- technical reviewer;
- recruiter/operator;
- administrator;
- compliance reviewer.

### Jobs to be done

- review evidence;
- request missing information;
- approve or reject verification claims;
- prepare shortlists;
- document reasoning;
- coordinate candidates and employers;
- monitor consent, retention and audit events.

---

## 4. Product architecture by workspace

The MVP contains three connected workspaces.

## 4.1 Talent Workspace

Purpose: build and control a portable evidence-based professional identity.

Core areas:

1. onboarding;
2. profile completion;
3. skills;
4. evidence vault;
5. verification status;
6. Talent Passport preview;
7. opportunities and consent requests;
8. availability and preferences;
9. privacy controls;
10. account and data rights.

## 4.2 Employer Workspace

Purpose: define roles, review shortlists and move candidates through a lightweight pipeline.

Core areas:

1. organization setup;
2. team members;
3. role briefs;
4. shortlist workspace;
5. candidate comparison;
6. pipeline;
7. interview notes;
8. decisions and outcomes;
9. analytics;
10. billing/pilot status.

## 4.3 TRH Operations Workspace

Purpose: operate the concierge layer safely and consistently.

Core areas:

1. talent review queue;
2. evidence verification queue;
3. role intake queue;
4. shortlist preparation;
5. candidate consent and contact tracking;
6. employer delivery;
7. quality review;
8. outcome capture;
9. audit and compliance;
10. operational analytics.

---

## 5. End-to-end Talent journey

## Step 1 — Invitation or application

Entry channels:

- invited by TRH;
- referred by an existing member;
- joins through a specialist community;
- applies to a private opportunity;
- requests verification directly.

Required actions:

- create account;
- verify email;
- accept privacy and processing notices;
- choose preferred language;
- choose initial visibility mode.

Visibility modes:

- private;
- discoverable by TRH only;
- discoverable by approved employers;
- shareable by private link;
- selected fields public.

## Step 2 — Structured profile

Required fields:

- display name;
- location and timezone;
- professional headline;
- target role families;
- years of relevant experience range;
- languages;
- work model preference;
- availability;
- contract preference;
- salary/rate preference visibility;
- mobility and work authorization fields where lawful.

Optional fields:

- biography;
- portfolio links;
- GitHub/GitLab links;
- LinkedIn link;
- personal website;
- preferred industries;
- mission preferences.

## Step 3 — Skills graph

A talent selects skills under structured domains.

Each skill contains:

- canonical skill name;
- aliases;
- domain;
- self-declared proficiency band;
- years or recency band;
- supporting evidence count;
- verification status;
- last used date;
- visibility.

Proficiency is not a universal score. Initial bands:

- awareness;
- working knowledge;
- independent practitioner;
- advanced practitioner;
- expert/lead.

Every band remains a claim until supported by evidence and human review.

## Step 4 — Evidence Vault

Supported evidence types:

- CV;
- identity document reference;
- diploma;
- certification;
- employment proof;
- mission proof;
- project case study;
- repository;
- code sample;
- architecture document;
- publication;
- CTF/challenge result;
- assessment result;
- reference;
- portfolio link;
- presentation/demo recording;
- language certificate.

Each evidence item has:

- type;
- title;
- issuer/source;
- description;
- issue date;
- expiry date;
- file/link;
- linked skills;
- visibility;
- verification status;
- reviewer;
- reviewer note;
- confidence level;
- timestamps.

Verification statuses:

- self_declared;
- submitted;
- under_review;
- verified;
- partially_verified;
- rejected;
- expired;
- revoked.

## Step 5 — Verification

The candidate sees:

- what is being checked;
- why it is being checked;
- expected review time;
- missing information;
- reviewer decision;
- appeal or resubmission action.

No evidence becomes employer-visible beyond the candidate's consent settings.

## Step 6 — Talent Passport

The passport presents:

- verified identity indicator without exposing identity documents;
- role families;
- verified and self-declared skills separated clearly;
- evidence timeline;
- experience;
- certifications;
- projects;
- language and work preferences;
- availability;
- evidence gaps;
- last verified dates;
- visibility and sharing controls.

The passport must never display a single global human score.

## Step 7 — Opportunity consent

Before a candidate enters an employer shortlist, the candidate must receive:

- employer identity or approved anonymous brief;
- role summary;
- location/work model;
- compensation range where available;
- fields that will be shared;
- expiration of consent;
- accept, decline or ask a question.

## Step 8 — Process and outcome

The candidate can see:

- consent requested;
- interested;
- employer review;
- interview requested;
- interview scheduled;
- offer/mission discussion;
- closed;
- hired/started.

The employer cannot silently move a candidate into an externally shared shortlist without recorded consent.

---

## 6. End-to-end Employer journey

## Step 1 — Organization setup

Required:

- legal/display name;
- website;
- country;
- industry;
- organization size;
- hiring contact;
- billing contact;
- data-processing acceptance;
- team roles.

Initial organization roles:

- owner;
- hiring_manager;
- recruiter;
- interviewer;
- viewer.

## Step 2 — Create Role Brief

The employer can start with:

- job description upload;
- free-text need;
- guided form;
- copied vacancy;
- call notes entered by TRH.

The structured Role Brief contains:

### Business context

- organization/team;
- business objective;
- why the role exists;
- urgency;
- target start date.

### Work outcomes

- expected outcomes in first 30/60/90 days;
- recurring responsibilities;
- systems and environments affected;
- level of ownership;
- team composition.

### Capability requirements

- must-have skills;
- trainable skills;
- evidence required for each must-have;
- desired certifications;
- minimum recent experience;
- language requirements;
- security or compliance constraints.

### Commercial constraints

- employment/contract type;
- location;
- remote/hybrid/on-site;
- compensation range;
- rate range;
- availability deadline;
- relocation or work authorization.

### Selection workflow

- interview stages;
- technical review method;
- decision makers;
- target decision date;
- deal-breakers.

Role Brief statuses:

- draft;
- needs_clarification;
- ready_for_search;
- sourcing;
- shortlist_ready;
- interviewing;
- filled;
- paused;
- closed.

## Step 3 — Search preparation

TRH or an authorized employer user reviews:

- ambiguous requirements;
- impossible combinations;
- missing compensation;
- excessive must-haves;
- requirements without lawful justification;
- evidence expectations;
- interview process quality.

The system suggests improvements but a human approves the final brief.

## Step 4 — Candidate discovery

Discovery sources in MVP:

- verified TRH talent pool;
- invited candidates;
- manually sourced candidates entered by TRH;
- referrals.

Search capabilities:

- structured filters;
- natural-language query;
- skill aliases;
- evidence-backed filters;
- availability;
- language;
- location/timezone;
- contract type;
- verification recency;
- candidate visibility and consent eligibility.

## Step 5 — Explainable Shortlist

A shortlist contains three to five candidates in the concierge MVP.

Each candidate card must show:

- fit summary;
- role requirements matched;
- evidence supporting each match;
- unverified claims;
- missing evidence;
- potential concerns;
- availability;
- work preferences;
- compensation alignment if consented;
- suggested interview questions;
- human reviewer note;
- candidate consent status.

No candidate is presented as “best overall.” The product explains role-specific evidence and uncertainty.

## Step 6 — Compare candidates

Comparison dimensions:

- required outcomes;
- must-have skills;
- verified evidence;
- recency;
- language;
- availability;
- work model;
- compensation/rate alignment;
- evidence gaps;
- interview focus areas.

Sensitive or prohibited attributes are excluded from comparison.

## Step 7 — Pipeline

Initial stages:

- identified;
- consent_requested;
- consented;
- shortlisted;
- employer_review;
- contacted;
- interested;
- interview;
- technical_review;
- offer;
- hired;
- mission_started;
- declined;
- rejected_by_employer;
- withdrawn;
- closed.

Every transition records:

- actor;
- timestamp;
- reason;
- optional note;
- source stage;
- destination stage.

## Step 8 — Outcome feedback

Employer feedback:

- shortlist usefulness;
- interview quality;
- evidence accuracy;
- reason for progression or rejection;
- hire outcome;
- quality after 30/90 days where available.

Talent feedback:

- role accuracy;
- employer communication quality;
- process fairness;
- outcome;
- willingness to reuse TRH.

Outcome data must be collected with explicit purpose and retention rules.

---

## 7. Explainable matching contract

AI output is a recommendation artifact, not a decision.

Every match explanation must contain:

1. matched requirement;
2. supporting evidence IDs;
3. verification status;
4. evidence recency;
5. confidence band;
6. known gap;
7. human reviewer status;
8. explanation version/model version.

Confidence bands:

- high evidence support;
- moderate evidence support;
- limited evidence support;
- insufficient evidence.

The UI must not imply mathematical certainty.

### Prohibited matching behavior

- inferring ethnicity, religion, health, political opinion or sexual orientation;
- using age unless legally required and justified;
- inferring personality from text or images;
- emotion recognition;
- rejecting a candidate automatically;
- hiding the reason a profile was recommended;
- using protected proxies without review;
- treating missing data as proof of low capability.

---

## 8. Concierge operations workflow

The MVP deliberately includes human operations.

## 8.1 Talent intake

1. source candidate;
2. obtain consent;
3. review profile completeness;
4. request evidence;
5. conduct structured intake call;
6. verify priority evidence;
7. publish internal passport;
8. mark readiness.

Talent readiness states:

- invited;
- onboarding;
- incomplete;
- review_ready;
- under_review;
- verified_ready;
- opportunity_ready;
- paused;
- archived.

## 8.2 Role intake

1. receive employer need;
2. conduct role calibration;
3. structure Role Brief;
4. confirm budget and process;
5. approve search;
6. define evidence requirements;
7. define delivery deadline.

## 8.3 Shortlist production

1. generate broad candidate set;
2. filter by consent eligibility and hard constraints;
3. review evidence;
4. request missing evidence;
5. contact candidate;
6. obtain opportunity consent;
7. prepare explanation;
8. human quality review;
9. deliver three to five candidates;
10. collect employer feedback.

## 8.4 Service-level targets

Pilot targets:

- role calibration completed within one business day;
- first candidate set within three business days;
- first qualified shortlist within five business days;
- evidence verification response within two business days for standard items;
- employer feedback requested within two business days of delivery.

These are operational hypotheses and must be tested.

---

## 9. Screen inventory

## 9.1 Public

- Talent Intelligence landing page;
- How verification works;
- For talent;
- For employers;
- Trust and privacy;
- request pilot;
- join talent network;
- private Talent Passport share page.

## 9.2 Talent application

- sign up/sign in;
- onboarding progress;
- profile overview;
- personal/professional details;
- skills;
- experience;
- evidence vault;
- evidence detail;
- verification requests;
- Talent Passport preview;
- visibility and privacy;
- opportunities;
- opportunity detail and consent;
- activity/history;
- data export/deletion request;
- account security.

## 9.3 Employer application

- organization onboarding;
- dashboard;
- roles list;
- role creation wizard;
- Role Brief detail;
- shortlist list;
- shortlist detail;
- candidate comparison;
- candidate evidence view;
- pipeline board;
- interview notes;
- outcome form;
- organization members;
- settings and privacy;
- pilot/billing status.

## 9.4 TRH Operations

- operations dashboard;
- talent queue;
- talent detail;
- evidence queue;
- evidence review;
- role intake queue;
- role calibration;
- search workspace;
- shortlist builder;
- candidate consent tracker;
- employer delivery view;
- quality review;
- outcome dashboard;
- audit log;
- retention/compliance queue.

---

## 10. Domain model

The MVP domain should be organization-aware and consent-aware from the beginning.

### Identity and tenancy

- users;
- organizations;
- organization_members;
- organization_invitations;
- roles and permissions.

### Talent

- talent_profiles;
- talent_preferences;
- talent_visibility_rules;
- talent_skills;
- experiences;
- education_records;
- certifications;
- evidence_items;
- evidence_skill_links;
- verification_cases;
- verification_events;
- references;
- availability_records.

### Employer demand

- role_briefs;
- role_outcomes;
- role_requirements;
- role_evidence_requirements;
- role_interview_stages.

### Matching and pipeline

- candidate_matches;
- match_explanations;
- shortlists;
- shortlist_candidates;
- consent_requests;
- pipeline_entries;
- pipeline_events;
- interview_notes;
- employer_feedback;
- talent_feedback;
- engagement_outcomes.

### Governance

- consent_grants;
- data_access_events;
- audit_logs;
- retention_rules;
- deletion_requests;
- exports;
- model_versions;
- recommendation_reviews.

---

## 11. Visibility model

Every data object requires a visibility classification.

Initial visibility levels:

- private_user_only;
- trh_operations;
- approved_employer;
- opportunity_specific;
- private_link;
- public_summary.

Rules:

- documents are private by default;
- employers see derived verification results unless the candidate explicitly shares the source document;
- opportunity consent is scoped and expires;
- access is logged;
- revocation stops future access;
- previously exported data cannot be technically recalled, so export must be minimized and disclosed;
- sensitive identity documents never appear in public or general employer views.

---

## 12. MVP analytics

## North Star

**Successful verified talent engagements**, where both employer and talent confirm the match met expectations.

## Activation metrics

Talent:

- onboarding completion;
- profile completion;
- first evidence submitted;
- first evidence verified;
- passport readiness;
- opportunity consent response.

Employer:

- organization activation;
- first Role Brief approved;
- first shortlist delivered;
- first candidate progressed;
- first interview;
- first successful engagement.

## Quality metrics

- time to role calibration;
- time to first candidate set;
- time to qualified shortlist;
- shortlist-to-interview rate;
- interview-to-offer rate;
- offer-to-hire rate;
- evidence rejection rate;
- evidence verification turnaround;
- percentage of match claims linked to evidence;
- employer satisfaction;
- talent trust/fairness score;
- repeat employer rate;
- candidate withdrawal rate.

## Economics

- revenue per pilot;
- verification cost per talent;
- operations hours per shortlist;
- gross margin per engagement;
- employer acquisition cost;
- talent acquisition cost;
- repeat revenue;
- software-assisted versus manual work ratio.

---

## 13. Acceptance criteria

## Talent Passport

- every displayed claim shows status;
- source evidence is linked internally;
- candidate controls visibility;
- no global candidate score exists;
- expired evidence is visually distinct;
- access is auditable;
- passport works in French and English at minimum;
- mobile display is usable.

## Role Brief

- must-have and trainable skills are separate;
- compensation/work model can be captured;
- outcomes are mandatory before search approval;
- deal-breakers require explicit entry;
- ambiguous requirements can be flagged;
- status transitions are logged.

## Explainable Shortlist

- every recommended candidate has at least one evidence-backed match;
- gaps are visible;
- unverified claims are not presented as verified;
- candidate consent exists before employer delivery;
- human reviewer approval exists;
- recommendation/model version is recorded;
- employer can provide structured feedback.

## Pipeline

- stage history is immutable through append-only events;
- role and candidate authorization is enforced;
- rejected/withdrawn reasons are captured without forcing sensitive disclosure;
- candidate receives status visibility appropriate to the process;
- no employer can access another organization's pipeline.

## Operations

- reviewer actions are attributable;
- evidence decisions can be appealed/resubmitted;
- access to sensitive evidence is logged;
- deletion and export requests can be tracked;
- operations can measure turnaround times.

---

## 14. Twelve-week MVP delivery plan

## Weeks 1–2 — Foundation

- product prototypes;
- domain schema;
- organization tenancy;
- consent model;
- design partner role templates;
- evidence taxonomy for SOC Analyst and Cloud/DevOps Engineer.

## Weeks 3–4 — Talent profile

- onboarding;
- structured profile;
- skills;
- evidence vault;
- visibility controls;
- internal talent review.

## Weeks 5–6 — Verification and Passport

- verification queue;
- evidence statuses;
- reviewer notes;
- passport views;
- private sharing;
- audit events.

## Weeks 7–8 — Employer workflow

- organization onboarding;
- Role Brief wizard;
- role calibration;
- role requirements;
- employer permissions.

## Weeks 9–10 — Matching and shortlist

- structured search;
- semantic retrieval prototype;
- match explanation records;
- shortlist builder;
- candidate consent;
- employer shortlist delivery.

## Weeks 11–12 — Pipeline and pilot readiness

- pipeline stages/events;
- interview notes;
- feedback and outcomes;
- analytics;
- QA/security review;
- first controlled design-partner pilots.

---

## 15. Decision gate for Phase 4

Proceed to AI/Data/Trust architecture only when:

- two role-family taxonomies are approved;
- Talent Passport schema is accepted by at least ten talents;
- Role Brief is accepted by at least five employers;
- employers understand shortlist explanations without live clarification;
- consent flow is acceptable to talent;
- no critical visibility or tenancy ambiguity remains;
- product team agrees on the events required for outcome learning.

---

## 16. Final product statement

> The Right Hat MVP is a consent-driven trust workflow for technical hiring. It converts fragmented professional evidence into a reusable Talent Passport, converts employer needs into structured Role Briefs, and produces human-reviewed explainable shortlists instead of opaque rankings.

The product wins only if it improves real hiring outcomes. A polished interface without trusted evidence, employer willingness to pay and candidate consent is not success.
