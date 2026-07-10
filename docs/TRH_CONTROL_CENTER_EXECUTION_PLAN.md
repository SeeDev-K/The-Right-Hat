# TRH Control Center — Execution Plan

This roadmap adapts the premium redesign and security specification to the current TRH codebase. Existing RBAC, RLS, audit, staff access, Community, Team Access, Reports, API Center and private-route protections are preserved and strengthened rather than rebuilt.

## Phase 0 — Baseline, scope and delivery governance

**Goal:** establish the current implementation state, dependencies, database migrations and acceptance criteria.

- Inventory routes, components, tables, RLS policies and admin APIs.
- Track every phase with implementation status, migrations, tests and Vercel result.
- Keep public member authentication separate from private TRH staff authentication.
- Produce a final implementation/remaining-work/compromises report.

**Status:** in progress.

## Phase 1 — Premium design system and shared admin shell

**Goal:** remove visual inconsistency and provide a reusable enterprise SOC interface.

- Admin-scoped design tokens: near-black, electric blue, cyan, amber, critical red.
- Display/body/mono typography roles.
- Dark mode default and light mode toggle.
- Shared responsive sidebar, active navigation, staff identity block and sign-out.
- Standard admin surfaces, buttons, badges, skeletons, focus states and transitions.
- Move all modules progressively onto the shared shell.

**Acceptance:** no module should look like an unrelated template; keyboard focus remains visible; theme preference persists.

## Phase 2 — Staff authentication hardening and MFA

**Goal:** make staff authentication materially stronger, not only visually private.

- Supabase MFA/TOTP enrollment and challenge flow.
- MFA-required gate before Control Center access.
- Passkey/WebAuthn feasibility and provider-compatible implementation.
- Progressive login backoff enforced server-side or at the edge.
- Suspicious-login audit events and notification hooks.
- Strong-password guidance and compromised-password check architecture.
- Session policy review; avoid claiming httpOnly refresh-token guarantees unless the chosen Supabase SSR architecture enforces them.

**Acceptance:** a staff account without completed MFA cannot open protected modules.

## Phase 3 — Live Control Center, command palette and activity feed

**Goal:** turn the dashboard into a real operations console.

- Live KPIs with time windows and meaningful trends.
- Security posture card: checks, blocked attempts, secret rotation and last review.
- Real audit feed from `audit_logs`, including IP/user-agent where captured.
- Global command palette with keyboard navigation.
- Polling or realtime subscriptions with visible last-refresh age.
- Sidebar badges driven by actual CRM, reports and review queues.
- Skeleton loaders and premium empty states.

## Phase 4 — Contacts CRM enterprise workflow

**Goal:** complete CRM operations and compliant exports.

- Sorting, filtering, search and robust pagination.
- Contact detail drawer with event/history timeline.
- Assignment, bulk status updates and ownership.
- CSV and PDF export with optional anonymization.
- Server validation and module checks for every mutation.
- Retention and deletion workflow compatible with Moroccan Law 09-08 and GDPR requirements.

## Phase 5 — Academy CMS, SEO and versioning

**Goal:** replace the simple board with a production content workflow.

- Draft/review/published/archived lifecycle.
- Rich Markdown or WYSIWYG editor with safe rendering and preview.
- SEO title, description, slug and social metadata.
- Author and modification metadata.
- Content revisions and rollback.
- Associated media and publication validation.

## Phase 6 — Media CMS and storage governance

**Goal:** implement a real managed media library.

- Supabase Storage upload with drag-and-drop.
- File type/size validation and safe naming.
- Image preview, alt text, dimensions, weight and format.
- Usage tracking before deletion.
- Protected delete flow with audit event and optional undo window.
- Accessibility and SEO validation.

## Phase 7 — Settings, RBAC matrix, sessions and API keys

**Goal:** make Settings operational rather than informational.

- Profile and operational identity.
- Visual role/module permission matrix.
- Team lifecycle and least-privilege defaults.
- Session list and provider-supported revocation.
- API key metadata, scopes, expiry, last use and rotation workflow.
- Notifications and billing placeholders only where a real backend exists.

## Phase 8 — Security Center, immutable audit and alerting

**Goal:** provide credible internal security posture evidence.

- Append-only audit architecture with no UI update/delete path.
- Capture IP, user-agent, request correlation ID and actor context where possible.
- Alerts for role changes, exports, repeated login failures and unusual access.
- Dependency/security review status and patch queue.
- Internal security-status page with last audit/pentest records.

## Phase 9 — Backend and transport hardening

**Goal:** close security gaps at API and infrastructure level.

- Strict server-side validation with Zod or equivalent.
- Rate limiting for login, reset, reporting and public mutations.
- CSRF review for cookie-authenticated mutations.
- CSP tightening, HSTS and production header verification.
- WAF/bot protection integration compatible with Vercel.
- Secret-management and environment-variable review.

## Phase 10 — CI/CD security and automated tests

**Goal:** make security regressions detectable before deployment.

- Dependabot configuration.
- GitHub Actions: typecheck, build, dependency audit and secret scanning.
- Critical-vulnerability merge gate where supported.
- Automated authorization tests for RLS and APIs.
- XSS, injection and IDOR regression tests for CRM/CMS/Community.

## Phase 11 — Accessibility, performance, QA and delivery report

**Goal:** ship a verifiable enterprise-grade release.

- Keyboard navigation and visible focus audit.
- Responsive desktop/tablet/mobile review.
- Loading, empty, error and restricted states.
- Performance and bundle review.
- Security header and route-access verification.
- Final report: implemented, remaining, compromises and operational steps.

## Current implementation already available

- Private TRH staff entry and public member/staff separation.
- Module-based RBAC functions and client/server checks.
- RLS foundations for content, team, API, audit and Community.
- Team roles and module assignment.
- Community posts, replies, member profiles, moderation and reports.
- API Center, Activity Center and Security Center foundations.
- Security headers, private-route noindex and no-store behavior.
- Dynamic admin metrics and several audited mutations.

## Execution order

Phases are executed sequentially because later modules depend on the shared design system, authentication model, authorization helpers and audit schema established earlier. A phase is considered complete only after its code, migration instructions, runtime behavior and Vercel build are verified.
