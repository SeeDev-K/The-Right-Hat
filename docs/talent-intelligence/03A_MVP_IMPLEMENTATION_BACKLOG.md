# The Right Hat — Talent Intelligence MVP Implementation Backlog

Status: READY FOR EXECUTION
Related phase: 03_PRODUCT_DEFINITION_MVP
Date: 2026-07-10

---

## 1. Delivery principle

The MVP must be delivered in vertical slices that create usable workflows, not as isolated technical components.

Priority definitions:

- **P0** — required for first controlled pilot;
- **P1** — required before repeatable paid delivery;
- **P2** — valuable after initial pilot learning;
- **Deferred** — explicitly outside MVP.

A feature is not complete because the screen exists. It is complete only when authorization, audit, visibility, validation and error states are included.

---

## 2. Epic map

| Epic | Priority | Outcome |
|---|---:|---|
| E0 Product instrumentation and environments | P0 | Safe measurable development and pilot environments |
| E1 Identity, tenancy and permissions | P0 | Talent, employer and TRH users isolated correctly |
| E2 Consent and visibility | P0 | Talent controls data sharing and employer access |
| E3 Talent profile and skills | P0 | Structured candidate identity beyond a CV |
| E4 Evidence Vault | P0 | Evidence can be submitted, linked and governed |
| E5 Verification Operations | P0 | TRH can review claims consistently |
| E6 Verified Talent Passport | P0 | Employer-readable proof with clear statuses |
| E7 Organization and Role Brief | P0 | Employer need becomes a structured search object |
| E8 Search, matching and shortlist | P0 | Evidence-backed candidates can be recommended |
| E9 Candidate opportunity consent | P0 | Candidates approve employer-specific sharing |
| E10 Recruiter pipeline | P0 | Hiring progress and outcomes are recorded |
| E11 Pilot analytics and quality | P0 | TRH can measure value and operational cost |
| E12 Notifications and collaboration | P1 | Users receive reliable workflow updates |
| E13 Data rights and compliance operations | P1 | Export, deletion and retention requests are manageable |
| E14 Billing and pilot contracts | P1 | Paid pilots can be tracked |
| E15 Integrations | P2 | CV import, calendar and ATS interoperability |

---

## 3. E0 — Product instrumentation and environments

### P0 stories

- define development, preview and production Supabase projects;
- define environment-variable ownership;
- add migration ordering and rollback notes;
- add product event naming convention;
- add error tracking and correlation IDs;
- add feature flags for pilot employers;
- add audit event taxonomy;
- define seeded demo data without real candidate information;
- define backup and restore test procedure.

### Acceptance criteria

- preview data is separate from production;
- secrets are never committed;
- every high-impact mutation emits an audit event;
- errors can be traced from UI to backend action;
- pilot functionality can be enabled per organization.

---

## 4. E1 — Identity, tenancy and permissions

### P0 stories

- support user types: talent, employer staff, TRH operations;
- create organizations;
- create organization memberships;
- invite employer team members;
- enforce organization isolation through RLS;
- define roles: owner, hiring_manager, recruiter, interviewer, viewer;
- define TRH operational roles;
- prevent a public member account from accessing employer or operations data;
- add account status: active, suspended, archived;
- log sign-in and sensitive session events.

### Acceptance criteria

- an employer user cannot read another organization’s role, shortlist or pipeline;
- an interviewer sees only assigned roles/candidates;
- a suspended account cannot perform privileged mutations;
- permissions are enforced in the database, not only the interface;
- automated tests cover cross-tenant reads and writes.

---

## 5. E2 — Consent and visibility

### P0 stories

- define visibility enum;
- store field-level or object-level visibility rules;
- create consent request records;
- create scoped consent grants;
- support consent expiration;
- support consent revocation;
- prevent employer access before valid consent;
- record every employer passport access;
- show the talent what data will be shared;
- prevent source identity documents from appearing in employer views by default.

### Acceptance criteria

- no employer can access an opportunity-specific passport without active consent;
- revocation blocks future access;
- consent includes purpose, recipient and expiration;
- candidate can review active grants;
- data access is auditable.

---

## 6. E3 — Talent profile and skills

### P0 stories

- talent onboarding wizard;
- preferred language;
- professional headline and biography;
- location/timezone;
- work model preferences;
- contract preferences;
- availability and notice period;
- role families;
- language records;
- work authorization/mobility fields with explicit visibility;
- experience records;
- education records;
- certification records;
- skill taxonomy;
- skill aliases;
- proficiency claims;
- last-used/recency fields;
- profile completeness indicators.

### P1 stories

- CV-assisted import with confirmation;
- GitHub/GitLab profile import;
- profile change history;
- suggested missing evidence.

### Acceptance criteria

- imported information remains unverified until reviewed;
- user can correct every AI-extracted field;
- profile completion does not pressure disclosure of unnecessary sensitive data;
- skill claims can link to multiple evidence items.

---

## 7. E4 — Evidence Vault

### P0 stories

- secure file upload;
- URL evidence submission;
- evidence type selection;
- issuer/source metadata;
- issue and expiry dates;
- linked skills;
- visibility setting;
- evidence status;
- file malware scanning hook;
- private storage bucket;
- signed short-lived access URLs;
- replace/resubmit workflow;
- candidate evidence list and detail views.

### P1 stories

- repository evidence metadata extraction;
- certificate issuer verification integration hooks;
- evidence duplicate detection;
- document text extraction with user confirmation.

### Acceptance criteria

- storage is private by default;
- expired evidence is automatically marked or queued;
- no raw document is exposed through a permanent public URL;
- every access to sensitive evidence is logged;
- file types and sizes are validated server-side.

---

## 8. E5 — Verification Operations

### P0 stories

- evidence review queue;
- assignment to reviewer;
- status transitions;
- reviewer notes;
- request additional information;
- partially verified outcome;
- rejection reason taxonomy;
- expiry/revocation;
- resubmission;
- reviewer conflict-of-interest note;
- audit trail;
- verification turnaround reporting.

### P1 stories

- second-review requirement for sensitive evidence;
- configurable verification playbooks by evidence type;
- quality sampling dashboard;
- appeal workflow.

### Acceptance criteria

- reviewer cannot silently alter the original submission;
- every decision records actor, reason and timestamp;
- rejected evidence is not deleted automatically;
- candidate receives a clear decision and next action;
- verification status is never inferred solely from AI output.

---

## 9. E6 — Verified Talent Passport

### P0 stories

- internal passport view;
- candidate preview;
- employer opportunity-specific view;
- private share link with expiration;
- clear evidence labels;
- verified identity indicator;
- skills grouped by verification status;
- project and experience timeline;
- evidence recency;
- availability and preferences;
- evidence gaps;
- print-friendly/exportable summary with access controls;
- mobile-responsive design.

### P1 stories

- bilingual French/English passport;
- Arabic summary;
- QR share link;
- employer-specific annotations hidden from talent/public views.

### Acceptance criteria

- no universal score;
- verified and self-declared claims are visually distinct;
- hidden source documents remain hidden;
- expired evidence cannot appear as current verification;
- unauthorized or expired links fail closed.

---

## 10. E7 — Organization and Role Brief

### P0 stories

- organization onboarding;
- organization verification status;
- employer team roles;
- role list;
- role creation wizard;
- free-text/job-description intake;
- business objective;
- 30/60/90-day outcomes;
- must-have versus trainable requirements;
- evidence requirements;
- environment/tools;
- language;
- work model/location;
- contract type;
- compensation/rate range;
- target start date;
- deal-breakers;
- interview stages;
- status workflow;
- TRH role calibration notes.

### P1 stories

- AI-assisted Role Brief extraction;
- unrealistic requirement warnings;
- reusable role templates;
- employer approval workflow.

### Acceptance criteria

- a role cannot enter search without approved outcomes and requirements;
- compensation can be withheld from public display but must be captured for TRH pilot operations unless explicitly waived;
- must-haves and preferences are separate;
- discriminatory or sensitive criteria can be flagged for review;
- changes are versioned/audited.

---

## 11. E8 — Search, matching and shortlist

### P0 stories

- structured talent search;
- filtering by verified skills;
- filtering by availability/language/location/work model;
- candidate eligibility based on visibility;
- internal candidate set;
- match record;
- requirement-to-evidence links;
- evidence gaps;
- confidence band;
- reviewer note;
- shortlist builder;
- shortlist approval;
- employer delivery;
- candidate comparison;
- employer feedback.

### P1 stories

- semantic search;
- natural-language query;
- skill alias expansion;
- AI-generated explanation draft;
- interview question suggestions;
- explanation quality evaluation.

### Acceptance criteria

- no candidate is delivered without consent and human approval;
- every positive match statement links to evidence or is marked unverified;
- missing data is shown as unknown, not negative proof;
- recommendation version and reviewer are recorded;
- employer cannot modify verification status.

---

## 12. E9 — Candidate opportunity consent

### P0 stories

- create opportunity consent request;
- show employer or approved anonymous employer description;
- show role summary;
- show fields to be shared;
- show expiration;
- accept;
- decline;
- ask a question;
- revoke before employer delivery when possible;
- candidate communication log;
- consent status in shortlist builder.

### Acceptance criteria

- shortlist delivery blocks candidates without active consent;
- candidate receives enough information for meaningful consent;
- decline reason is optional;
- consent is purpose-scoped;
- consent events are immutable/audited.

---

## 13. E10 — Recruiter pipeline

### P0 stories

- pipeline stages;
- drag/drop or explicit stage transition;
- append-only stage events;
- employer notes;
- interviewer assignment;
- interview scheduling metadata;
- rejection/withdrawal reason;
- offer status;
- hired/mission started outcome;
- candidate-visible status subset;
- employer and TRH permissions.

### P1 stories

- email/calendar integration;
- reminders;
- structured scorecards;
- duplicate candidate handling across roles.

### Acceptance criteria

- history cannot be overwritten;
- talent sees an honest but privacy-safe status;
- interviewer access is role-scoped;
- rejection does not require sensitive profiling;
- successful engagement triggers outcome feedback workflow.

---

## 14. E11 — Pilot analytics and quality

### P0 stories

- time to role calibration;
- time to first candidate set;
- time to qualified shortlist;
- shortlist-to-interview;
- interview-to-offer;
- offer-to-hire;
- verification turnaround;
- evidence rejection rate;
- candidate consent response rate;
- employer satisfaction;
- talent fairness/trust feedback;
- operations hours per shortlist;
- revenue and direct delivery cost per pilot.

### Acceptance criteria

- metric definitions are documented;
- events include organization and role IDs safely;
- dashboard distinguishes missing data from zero;
- internal analytics do not expose cross-tenant data;
- pilot review can export an anonymized summary.

---

## 15. P0 release sequence

### Release A — Secure foundation

- E0 instrumentation;
- E1 identity/tenancy;
- E2 consent skeleton;
- initial audit framework.

### Release B — Talent readiness

- E3 profile;
- E4 Evidence Vault;
- E5 basic verification;
- E6 internal Passport.

### Release C — Employer demand

- E7 organization and Role Brief;
- employer permissions;
- role calibration.

### Release D — Match delivery

- E8 search/shortlist;
- E9 opportunity consent;
- employer Passport view.

### Release E — Outcome loop

- E10 pipeline;
- E11 analytics;
- controlled pilot readiness.

---

## 16. Definition of Done

Every P0 story must include:

- happy path;
- loading state;
- empty state;
- validation errors;
- authorization failure;
- audit event where applicable;
- responsive UI;
- keyboard accessibility;
- server/database enforcement;
- test coverage for critical policies;
- privacy review;
- product analytics event where applicable;
- documentation of known limitations.

---

## 17. First implementation sprint

Recommended first sprint scope:

1. create multi-tenant foundation tables;
2. define employer and TRH roles;
3. create talent profile schema;
4. create visibility and consent enums;
5. create private evidence storage foundation;
6. create audit event conventions;
7. build talent onboarding shell;
8. build organization onboarding shell;
9. add cross-tenant RLS tests;
10. seed SOC Analyst and Cloud/DevOps role-family taxonomies.

Sprint exit criteria:

- talent account can create a private structured profile;
- employer organization can be created with isolated membership;
- no employer can read talent evidence without a valid path to consent;
- TRH operations access is explicit and audited;
- database migration and rollback notes exist;
- preview deployment succeeds.

---

## 18. Deferred backlog

Do not pull these into P0 without founder approval:

- open public job marketplace;
- autonomous recruiter;
- payroll;
- escrow;
- time tracking;
- video interview hosting;
- universal reputation score;
- personality inference;
- emotion detection;
- social feed;
- broad learning marketplace;
- advertising;
- investor matching;
- mass referral gamification;
- international relocation case management;
- enterprise ATS replacement.

---

## 19. Phase 3 output

The MVP is now defined at product and delivery level.

Next strategic phase:

**Phase 4 — AI, Data & Trust Strategy**

That phase must define the skills graph, evidence taxonomy, retrieval/matching architecture, model evaluation, explainability contract, bias testing, human review checkpoints, privacy and AI cost controls before production AI recommendations are implemented.
