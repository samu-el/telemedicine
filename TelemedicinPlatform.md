# Technical Proposal: Telemedicine Platform

---

## 1. Functional Concept (Product Specification)

The functional concept defines the exact capabilities, boundaries, expected workflows, business rules, and compliance boundaries for every actor on the platform. This specification serves as the authoritative product blueprint guiding all design and engineering decisions.

---

### 1.1 Project Overview & Strategic Context

The platform is specifically architected for the German healthcare regulatory environment, which imposes significantly stricter requirements than a generic telemedicine product. Key regulatory instruments governing the platform include:
- **GDPR (Datenschutzgrundverordnung)**: The EU's primary data protection and privacy regulation.
- **MBO-Ä (Musterberufsordnung für Ärzte)**: The German Model Professional Code for Physicians, which governs whether remote treatment (Fernbehandlung) is permissible on a case-by-case basis at the doctor's discretion.
- **§630f BGB (Bürgerliches Gesetzbuch)**: Medical documentation obligations under German civil law, mandating patient records are kept for a minimum of 10 years.
- **SGB V (Sozialgesetzbuch, Book V)**: Social Code Book governing public health insurance, applicable when insurance billing integration is considered post-MVP.
- **DSGVO Art. 9**: Special protections for health data as a "Special Category" of personal data, requiring explicit consent with heightened safeguards.

#### 1.1.1 Core Principles
- **No Automated Medical Decisions**: The system is a data-routing and workflow-orchestration tool only. Zero algorithmic, AI-driven, or rules-engine-driven medical decisions may be surfaced to patients as recommendations or outcomes. The platform will technically enforce this separation at the API middleware level — blocking any pathway that returns a medical conclusion without a verified doctor actor.
- **Full Role Isolation**: No user account may hold overlapping operational roles. A doctor account cannot submit a patient questionnaire. An admin account cannot make clinical decisions. This is enforced at both the RBAC database layer and the UI routing layer.
- **Immutable Auditability**: Every action — read, write, decision, status change, login, or file access — is durably and immutably logged with a verified timestamp, user ID, IP address, and full JSON diff of changed data.
- **Explicit, Granular, Revocable Consent**: Consent is not a single binary checkbox. The platform collects layered, module-specific consents that can each be independently revoked, subject to applicable medical data retention requirements.
- **Privacy by Design & Default**: Minimum data collection at each step. Encrypted at rest and in transit. User portal provides GDPR data access export and deletion requests.

---

### 1.2 Functional Module Specifications

#### Module 1.2.1 — Landing Page, Patient Intake & Authentication

**Landing page & treatment discovery (pre-signup)**
1. The **public landing page** is the default entry: marketing/trust content, compliance notices, and a browsable **treatment catalog** (e.g. cards or categories for each **Treatment Type** defined in §1.2.3).
2. The visitor **selects one treatment** (MVP: single path; future: compare or shortlist) **before** creating an account. Selection is stored in browser **session** and/or an **anonymous intake token** (server-side) so the chosen treatment follows the user through signup and into the questionnaire.
3. Optional: pricing ranges, eligibility hints, and links to FAQs remain on the landing area; **no** clinical questionnaire or payment runs on fully anonymous pages without eventually binding to an account (see below).

**Account creation & onboarding (after treatment choice)**
4. Patient enters their email address and chooses a password meeting strict complexity rules (minimum 12 characters, mix of case, numerals, and symbols). The **pre-selected treatment** is attached to the new account intake.
5. A Double Opt-In (DOI) email is dispatched containing a time-limited (24-hour) verification link.
6. Upon email verification, the patient is prompted to complete their basic profile (legal name, date of birth, address — all fields encrypted at rest).
7. Age verification gate: patients must confirm they are 18 years or older. Future expansion may support minors with guardian consent flows.
8. Account is created in `is_active: false` state until DOI is confirmed.

**Post-login patient experience (summary)**
- After onboarding, the patient completes **mandatory consents** (§1.2.2), the **dynamic questionnaire** for the treatment they chose on the landing flow, **pharmacy selection** (§1.2.9), **payment** (§1.2.8), then **tracks shipment** in the portal until case **Completed** (§1.2.5, §1.2.7).

**Doctor Registration & Verification Flow:**
1. Doctors are onboarded **exclusively by Admin invitation** — no self-registration permitted.
2. The Admin dispatches an email invitation specifying the doctor's specialty queue assignment.
3. Doctor must complete profile with: LANR (Lebenslange Arztnummer — the lifetime unique physician registration number), practice address, and medical specialty.
4. The platform validates the LANR against the Bundesärztekammer (German Medical Association) registry (manual validation in MVP, automated API lookup post-MVP).
5. 2FA enrollment is mandatory at first login: TOTP via Authenticator App (e.g., Google Authenticator, Authy) must be configured before the account is activated.
6. Sessions expire after **15 minutes of inactivity** and require re-authentication.

**Pharmacy / Partner Registration:**
1. Partner accounts are created by Admin only.
2. Partner provides: pharmacy name, DE pharmacy license number (Betriebserlaubnis), delivery service capabilities, and a secure API webhook URL for case notifications.

**Password & Account Security Rules:**
- Passwords are hashed with bcrypt (cost factor ≥ 12).
- Maximum of 5 failed login attempts before a 15-minute account lockout.
- CAPTCHA challenge (e.g., hCaptcha) after 3 failed attempts.
- Password reset via a time-limited (1 hour) secure email token — no security questions.
- All active sessions are invalidated immediately upon password change.
- Redis-managed JWT blocklist for immediate invalidation on logout.

---

#### Module 1.2.2 — Consent Management Engine

Consent is a legally critical pillar of the platform. Every consent presented to users must be independently versioned, immutably stored, and individually auditable.

**Consent Types Collected (Patient):**
1. **Privacy Policy Consent** (Datenschutzerklärung): Explicit agreement to GDPR-compliant data processing.
2. **Terms of Service Consent**: Binding agreement to platform usage terms.
3. **Medical Treatment Consent** (Behandlungseinwilligung): Informed consent for telemedicine evaluation by a licensed physician.
4. **Data Transfer Consent**: Permission to share approved prescription data with the designated pharmacy/partner.
5. **Optional — Marketing Communications**: Separately gated opt-in for any non-clinical communications (newsletter, service updates).

**Versioning Rules:**
- Every consent document (Privacy Policy, Terms, Medical Consent) has an independent `version_number` (e.g., `v1.0`, `v1.1`).
- When any consent document is updated by the Admin, a new version is created but the old version is never deleted. Historical version text is always retrievable.
- The system tracks exactly which version of each document the patient agreed to at the moment of signing.
- If a mandatory consent document is updated to a new version, the patient is presented with a re-consent prompt at their next login before they can proceed. They cannot skip mandatory re-consent.

**Revocation Rules:**
- Patients may revoke `Optional — Marketing Communications` at any time from the profile settings.
- Patients cannot revoke Treatment or Data Processing consent mid-case (once a case is In Review). They may initiate a "close account" request which is handled by the Admin following GDPR's Right to Erasure rules, balanced against legal retention obligations (§630f BGB).

**Technical Enforcement:**
- The questionnaire and case submission APIs perform a server-side check: "Has the patient provided all mandatory consents in their current (highest) version?" before allowing progression.
- If any mandatory consent is missing or outdated, the API returns a `403 Forbidden` with a consent-required error code.

---

#### Module 1.2.3 — Dynamic Medical Questionnaire Engine

The questionnaire is the primary clinical data collection instrument. It must be highly flexible, version-controlled, and enforce both UX and medico-legal requirements.

**Questionnaire Architecture:**
- Questionnaires are stored as a JSON Schema definition in the database (`schema_definition JSONB`), making them fully configurable by the Admin without code deployments.
- Each questionnaire belongs to a **Treatment Type** (e.g., "Hair Loss Treatment", "Contraception Consultation", "Allergy Assessment"). The patient **already chose** their treatment on the **landing page** before signup (§1.2.1); after login and consents, the app opens the matching questionnaire. Changing treatment mid-intake may be allowed only before questionnaire submission and only if Admin rules permit (otherwise restart intake).
- Multiple questionnaire versions may exist simultaneously. Patients always complete the **current active version** at the time of their submission.
- Responses are permanently linked to the exact questionnaire version that was presented.

**Question Types Supported:**
| Type | Description | Example |
| :--- | :--- | :--- |
| `text_short` | Single-line free text | "What is your current weight in kg?" |
| `text_long` | Multi-line free text | "Describe your symptoms" |
| `radio_single` | Single selection | "Do you smoke? Yes / No" |
| `checkbox_multi` | Multiple selections | "Which of the following apply to you?" |
| `dropdown` | Searchable dropdown select | "Select country of residence" |
| `scale_rating` | Likert-like numeric scale | "Rate your pain level (1-10)" |
| `date_picker` | Date input | "When did symptoms begin?" |
| `file_upload` | Inline document/photo upload | "Upload a photo of the affected area" |

**Conditional Logic Engine:**
- Question visibility is controlled by a `display_conditions` array defined in the schema.
- Example: Question 7 ("Are you currently breastfeeding?") is only shown if the patient answered "Female" in Question 2.
- Logic conditions support: `equals`, `not_equals`, `contains`, `greater_than`, `less_than`, and `is_answered`.
- Conditions can be chained with `AND`/`OR` operators.

**Medical Exclusion Logic (Hard Stops):**
- Certain answers trigger immediate disqualification from proceeding. These are defined as `exclusion_rules` in the schema.
- Example: If a patient answers "Yes" to "Are you currently on blood-thinning medication (e.g., Warfarin)?", the system displays a clinical stop-message explaining they must consult a physician in person.
- Hard stops are surfaced as a distinct, non-dismissible UI overlay with a recommendation to seek in-person care.
- Hard stop events are logged to the Audit Log (action: `QUESTIONNAIRE_HARD_STOP`) but do NOT create a Case — protecting the patient from being billed.

**Save-as-Draft Behaviour:**
- All in-progress answers are auto-saved to the backend every 30 seconds once the patient is **authenticated** (drafts are tied to `user_id` and treatment/case context). Pre-auth browsing on the landing page does not persist questionnaire answers until an account exists.
- Patient can leave and return to an incomplete questionnaire within 30 days.
- After 30 days of inactivity, the draft is deleted and the patient must restart.

**Questionnaire Versioning on Completed Cases:**
- Once a patient submits a questionnaire, the snapshot of both the schema and their answers is permanently stored and never altered, even if the Admin publishes a new version.
- Doctors always see the exact version of the questionnaire that the patient completed.

---

#### Module 1.2.4 — Document Upload System

- Patients may upload supporting clinical documents at two points: during the questionnaire (inline file_upload question) and from a dedicated "Documents" tab within their case.
- **Supported file types**: PDF, JPG, JPEG, PNG, HEIC.
- **Max file size**: 20 MB per file. Maximum 10 files per case.
- Every uploaded file undergoes: (1) file type validation (magic bytes, not just extension), (2) anti-malware / virus scan via a server-side integration (e.g., ClamAV), (3) AES-256 encryption before being stored to the object store.
- Files are linked to a specific `case_id` and are accessible via pre-signed, short-lived (15-minute TTL) URLs generated by the backend. Direct S3/Blob access is blocked.
- Doctors can also upload documents (clinical notes, reference images) as attachments to their Decision record.
- All file access events generate an Audit Log entry (action: `FILE_ACCESSED`).

---

#### Module 1.2.5 — Case Management System & State Machine

Every patient submission creates exactly one `Case` object. The case is the central unit of work that all actors interact with.

**Case Status Definitions & Valid Transitions:**

| Status | Description | Who Triggers It |
| :--- | :--- | :--- |
| `Draft` | Patient has begun the authenticated intake (after landing treatment choice) but not finished questionnaire/docs/pharmacy steps. | System (auto-created on first questionnaire save or equivalent) |
| `Submitted` | Questionnaire and required documents complete; **pharmacy selected**; **payment pending** (checkout not yet completed). | Patient |
| `Paid` | Payment has been successfully confirmed. | Payment Webhook (Stripe) |
| `In Review` | Case has been assigned to a doctor and is being evaluated. | System (auto-assign) or Doctor (manual claim) |
| `Needs More Info` | Doctor has requested additional patient input. | Doctor |
| `Awaiting Video` | Doctor has requested a video consultation appointment. | Doctor |
| `Approved` | Doctor has approved the case and issued a prescription. | Doctor |
| `Rejected` | Doctor has declined to treat the case remotely. | Doctor |
| `Sent to Partner` | Approved prescription forwarded to pharmacy/partner. | System (auto-trigger post-approval) |
| `In Fulfillment` | Pharmacy has acknowledged receipt and is processing. | Pharmacy/Partner |
| `Shipped` | Pharmacy has dispatched the medication. | Pharmacy/Partner |
| `Completed` | Order delivered and case lifecycle closed. | Pharmacy/Partner |
| `Cancelled` | Patient cancelled before doctor review. | Patient / Admin |
| `Refund Issued` | Payment reversed following rejection or cancellation. | System / Admin |

**Business Rules:**
- A case can only move **forward** through the state machine via allowed transitions. No manual status backdating is permitted for any role.
- In the event of a payment failure, the case remains in `Submitted` status and the patient is prompted to retry payment.
- Rejected cases are permanently closed. The patient must initiate a new case to re-apply (no "re-open" function).
- Cases where the patient fails to provide requested information within **14 days** of `Needs More Info` are automatically transitioned to `Cancelled` by a scheduled background job.
- All state transitions — regardless of trigger source — write an immutable `CaseStatusHistory` record.

---

#### Module 1.2.6 — Doctor Decision & Medical Review Workflow

This module is the most legally sensitive and must enforce strict safeguards to protect both the doctor and the patient.

**Case Assignment Logic (MVP):**
- Cases in `Paid` status are sorted into a shared queue visible to all available doctors of the relevant specialty.
- Doctors manually "claim" a case from the queue, locking it to their `doctor_id` via the `MedicalReview` record.
- Claiming is first-come-first-served. Once claimed, the case is removed from the shared queue and is visible only to the assigned doctor and admins.
- If a doctor has not submitted a decision within **72 hours** of claiming, the Admin receives a SLA breach alert.

**Doctor Review Interface — Visible Data:**
- Full questionnaire responses (linked to the exact schema version submitted).
- All uploaded patient documents (accessed via pre-signed URLs; each access logged).
- Patient's historical cases on the platform (read-only, status and outcome only).
- Inline messaging thread with the patient.

**Decision Options & Enforcement Rules:**

1. **Approve**:
   - Doctor must fill a mandatory `medical_justification` text field (minimum 50 characters) before confirming.
   - Doctor may optionally add internal notes visible only to Admins.
   - Upon confirmation, the system transitions the case to `Approved` and immediately triggers the prescription generation flow.
   
2. **Reject**:
   - Doctor must select a rejection category from a predefined list (e.g., "Contraindication detected", "Insufficient information provided", "Case requires in-person consultation", "Outside scope of telemedicine").
   - A mandatory free-text justification is required.
   - Patient is notified via email immediately.
   - A partial or full refund workflow is automatically triggered for admin review.

3. **Request More Information**:
   - Doctor composes a structured message to the patient via the secure messaging module.
   - Case status transitions to `Needs More Info`.
   - Patient receives an email notification with a link directly to the messaging thread.
   - The 14-day response timer begins.

4. **Request Video Consultation** (MVP+):
   - Doctor selects available appointment slots from their calendar integration.
   - Patient receives an email with scheduling options.
   - Case transitions to `Awaiting Video`.
   - Following the consultation, the doctor is returned to the standard decision workflow.

**Prescription Record Generation (on Approve):**
- The prescription payload is structured with: Medication PZN (Pharmazentralnummer — German standardized drug ID), dosage in mg, quantity, administration instructions, and prescribing doctor's LANR.
- The data is structured in a format compatible with future Gematik eRezept (KBV_PR_ERP_Prescription FHIR profile) integration.
- The prescription record is cryptographically signed (hash stored) to detect any downstream tampering.

---

#### Module 1.2.7 — Secure Messaging & Notification System

**In-Platform Messaging:**
- Asynchronous, case-scoped messaging between Patient ↔ Doctor only.
- Messages are stored encrypted (AES-256) in the database.
- Supported message content: plain text, file attachments (same type/size limits as document uploads).
- Doctors can also send messages visible only to the Admin (internal escalation notes).
- The complete message thread is permanently preserved as part of the case record.

**Email Notification Triggers:**
The platform dispatches transactional emails for all key lifecycle events:

| Trigger Event | Recipient | Email Content |
| :--- | :--- | :--- |
| Registration (DOI) | Patient | Email verification link (24h TTL) |
| Password Reset | Patient/Doctor | Reset link (1h TTL) |
| Case Submitted | Patient | Submission confirmation |
| Payment Confirmed | Patient | Payment receipt with invoice PDF |
| Case In Review | Patient | Review started notification |
| Doctor Requests Info | Patient | Request summary + portal link |
| Case Approved | Patient | Approval notice (no PHI in email body) |
| Case Rejected | Patient | Rejection reason and next steps |
| Prescription Sent to Partner | Patient | Fulfillment dispatched notice |
| Medication Shipped | Patient | Shipment notification with tracking link |
| New Case in Queue | Doctor | Queue alert |
| SLA Breach Alert | Admin | Case overdue warning |
| New Partner Case | Partner | Webhook + email alert |

- Email bodies must **never** contain Protected Health Information (PHI). All clinical detail is accessible only behind the authenticated portal link embedded in the email.
- Emails are dispatched via a transactional email provider (e.g., Sendgrid, AWS SES) using a verified sending domain and DKIM signing.

**Patient portal — order & shipment tracking:**
- The authenticated patient **home / orders** view lists **active cases** with a **status timeline** (e.g. Submitted → Paid → In Review → … → Shipped → Completed) aligned with §1.2.5.
- When the partner reports **dispatch**, the patient sees **carrier** and **tracking number** where provided; **track shipment** may deep-link to the carrier’s tracking page. Email/SMS triggers remain as in the table above.
- Past orders stay visible read-only for the patient’s history.

---

#### Module 1.2.8 — Payment System

**Payment Flow:**
1. After questionnaire + document submission, the patient has already **selected a pharmacy** (§1.2.9). The patient lands on a **checkout** screen showing the **service fee**, **chosen treatment** summary, and **designated pharmacy** (changeable only if allowed before payment, per business rules).
2. The system creates a Stripe `PaymentIntent` via the backend (never client-side secret handling).
3. Patient completes payment using Stripe Checkout (supports: Visa, Mastercard, SEPA Direct Debit, Apple Pay, Google Pay).
4. On successful payment, Stripe dispatches a signed webhook to the platform backend.
5. The backend verifies the webhook signature, marks the payment as confirmed, and transitions the case from `Submitted` to `Paid`.

**Invoice Generation:**
- A compliant VAT invoice (Rechnung) is auto-generated as a PDF immediately upon payment confirmation.
- Invoice includes: patient name, service description, itemized fee, VAT (19% where applicable), and a sequential invoice number.
- Invoice PDF is stored securely and attached to the payment record. Patient can download it from their case history.

**Refund Logic:**
- If a Doctor rejects a case, an automatic refund of the full service fee is queued for Admin approval.
- Admin reviews refund requests and confirms or adjusts via the Admin panel.
- Approved refunds are processed via Stripe's Refund API within 5-7 business days.
- Partial refunds are permitted at Admin discretion (e.g., if partial services were delivered).

---

#### Module 1.2.9 — Pharmacy / Partner Integration Module

**Patient pharmacy selection (pre-payment)**
- Before payment (§1.2.8), the patient **chooses a pharmacy** from an Admin-curated list: partners eligible for the selected **treatment**, **region**, and **delivery** constraints. The case stores the selected `partner_id` so that, upon doctor approval, the prescription is routed to that pharmacy.
- If a partner becomes unavailable before payment, the UI prompts re-selection; if unavailable after payment, Admin/partner escalation flows apply (see partner issue flags below).

**Fulfillment integration**
- Partners receive a notification (both email and HTTP webhook) when a case is transitioned to `Approved` and the prescription payload is ready.
- The webhook payload contains a secure, time-limited (48-hour) signed URL to retrieve the full structured prescription JSON.
- Partners update case status through a dedicated Partner Portal UI or via REST API callbacks.
- Supported inbound status updates from partners: `Acknowledged`, `In Preparation`, `Quality Check`, `Dispatched`, `Delivered`, `Return Initiated`.
- Partners can flag issues directly from the portal (e.g., "Medication out of stock", "Address undeliverable") which creates an alert visible to Admin.
- All partner interactions are logged to case history and the Audit Log.

---

#### Module 1.2.10 — Admin Panel

The admin panel is the central operational control surface.

**User Management:**
- Full CRUD for all user types (Patient, Doctor, Partner).
- Ability to suspend/unsuspend accounts with a required reason log.
- Invite new Doctors and Partners by email.
- View login history and session details per user.
- Bulk export of user records for GDPR Subject Access Request fulfillment.

**Case Monitoring:**
- Full case list with advanced filters (status, treatment type, doctor, date range).
- Ability to view any case in detail (read-only), including the full messaging thread and document list.
- Manual override capability to transition a stuck case (e.g., from `Needs More Info` to `Cancelled` if the patient is unresponsive).

**Questionnaire & Consent CMS:**
- Visual editor (or validated JSON editor) for creating and publishing new questionnaire versions.
- Preview mode allowing Admins to experience the questionnaire as a patient before publishing.
- Consent document versioning editor with side-by-side diff of current vs. previous version.

**Reporting Dashboard:**
- Platform KPIs: Total cases by status, approval rates, average decision time, revenue, refunds.
- Doctor performance metrics: cases handled per doctor, average resolution time, rejection rate category breakdown.
- Cohort analysis: patient acquisition by treatment type, conversion funnel (**Landing → Treatment selected → Registration → Questionnaire → Pharmacy choice → Payment → Approved**).
- All reports are exportable as CSV or PDF.

**Audit Log Viewer:**
- Filterable by: Actor (user ID), Action Type, Target Entity, Date Range, IP Address.
- Log entries are read-only — no editing or deletion of any record is possible from any interface.
- Accessible to Admins and assigned Data Protection Officers (DPOs).

---

### 1.3 Functional Business Rules Summary

| Rule ID | Rule Description | Enforced By |
| :--- | :--- | :--- |
| BR-01 | No medical decision may be made without a verified, active Doctor account. | API RBAC Middleware |
| BR-02 | No case may be created without confirmed payment. | Payment webhook + state machine |
| BR-03 | Mandatory consents must be accepted (current version) before questionnaire access. | Backend consent check API |
| BR-04 | Every Doctor decision requires a mandatory written justification. | API validation layer |
| BR-05 | Hard-stop questionnaire triggers must not create a case or charge payment. | Questionnaire engine |
| BR-06 | Prescription data must include a verified doctor LANR before being dispatched to pharmacy. | Prescription generation service |
| BR-11 | For standard patient-initiated cases, a **pharmacy (`partner_id`)** must be chosen **before** payment; checkout is blocked otherwise. | Checkout & case APIs |
| BR-07 | File access events must always generate an Audit Log event, regardless of role. | Storage service interceptor |
| BR-08 | Cases with no patient response to "Needs More Info" auto-cancel after 14 days. | Scheduled background job |
| BR-09 | SLA alerts fire if a claimed case has no doctor decision within 72 hours. | Scheduled background job |
| BR-10 | Audit Log records may never be deleted or modified by any role. | Database trigger + role grant restriction |

---

### 1.4 Core End-to-End Workflow

The following describes the complete patient-to-fulfillment lifecycle in sequential operating steps (**patient journey is landing-first**: treatment before signup, then onboarding, questionnaire, pharmacy, pay, track):

1. **Landing page & treatment choice (anonymous)**: Visitor browses the public site and **selects a treatment**; choice is held in session / anonymous intake token (§1.2.1).
2. **Registration & DOI Verification**: Patient creates account → verifies email → completes encrypted profile; selected treatment carries into the signed-in experience.
3. **Mandatory Consent Collection**: Patient accepts all required consent documents (current versions, individually timestamped and IP-logged).
4. **Dynamic Questionnaire Completion**: Patient completes the branching questionnaire for the **pre-selected** treatment. Any hard-stop triggers a clinical halt message; no case or charge is created.
5. **Document Upload**: Patient uploads any required supporting documents (ID, previous test results, photos).
6. **Pharmacy Selection**: Patient chooses a **designated pharmacy** from the Admin-approved list for that treatment/region (§1.2.9); `partner_id` is stored on the case before checkout.
7. **Payment**: Patient reviews checkout (fee + pharmacy + treatment summary) and completes payment via Stripe. Invoice is auto-generated.
8. **Case Creation & Queueing**: System transitions the case to `Paid` and assigns it to the relevant specialty queue.
9. **Doctor Claim**: A licensed, available Doctor claims the case from the queue, triggering `In Review` status.
10. **Doctor Review**: Doctor evaluates the complete case file, messaging the patient if clarification is needed.
11. **Medical Decision (Approve / Reject / More Info)**: Doctor records their decision and mandatory justification. All records immutably written.
12. **Patient Notification**: Patient receives an email notification of outcome, directing them to the portal.
13. **Prescription Dispatch (if Approved)**: A structured, signed prescription payload is forwarded to the **patient-selected** Partner.
14. **Pharmacy Fulfillment & patient tracking**: Partner acknowledges, prepares, and ships the order; status updates are pushed back to the platform. The patient **tracks shipment** in the portal (and via notifications) until delivery (§1.2.7).
15. **Delivery & Case Closure**: Upon confirmed delivery, the case transitions to `Completed`.
16. **Audit Finalization**: The complete case lifecycle — every event, access, change, and decision — is durably stored in the immutable Audit Log.

---

## 2. Technical Architecture Proposal

This section defines the full technical blueprint of the platform — covering the technology stack, system architecture, API design, security model, infrastructure topology, CI/CD strategy, monitoring, and third-party integrations.

---

### 2.1 Architecture Philosophy & Design Patterns

The platform is engineered as a **Modular Monolith** using **FastAPI**. It leverages FastAPI's high performance (built on Starlette and Pydantic) to handle concurrent I/O efficiently, while structuring the application to be easily decomposable into microservices in the future if scale demands it.

**Core Architectural Patterns & Decisions:**

1. **Domain-Driven Design (DDD) & Router Modularity**:
   - The application is divided into strict domains (e.g., `PatientIntake`, `MedicalReview`, `Billing`, `Compliance`).
   - Each domain is implemented as a standalone FastAPI `APIRouter` module with its own models, schemas (Pydantic), CRUD operations, and business logic services.
   - Cross-domain communication happens exclusively through defined service-layer interfaces, never by direct database queries.

2. **Data Transfer Objects (DTO) & Strict Validation (Pydantic V2)**:
   - FastAPI enforces massive structural safety by relying entirely on Pydantic V2 for request/response validation.
   - Any API request that does not strictly match the nested Pydantic schema is automatically rejected with a `422 Unprocessable Entity` before it ever reaches the controller logic. Zero raw JSON parsing happens manually.

3. **Asynchronous I/O Everywhere**:
   - The backend is fully async, utilizing Python's `async/await` syntax. `asyncpg` is used alongside SQLAlchemy 2.0 (in async mode) to ensure the database connection pool does not block the main Starlette event loop during heavy I/O operations (like fetching large case records).

4. **Event-Driven Asynchronous Tasks**:
   - Critical workflows that take time (generating PDF invoices, dispatching transactional emails, pushing HL7/FHIR payloads to partners) are decoupled from the HTTP request cycle.
   - The system utilizes **Celery** (backed by Azure Cache for Redis) to distribute these tasks to async background workers, instantly returning a `202 Accepted` or `200/201` success status to the client while the heavy lifting happens out-of-band.

5. **Inversion of Control (IoC) & Dependency Injection**:
   - We heavily utilize FastAPI's native Dependency Injection (`Depends()`).
   - Database sessions, current logged-in user context (extracted from JWTs), Redis clients, and HTTP clients (for external API calls) are injected into route handlers. This makes unit testing incredibly fast and predictable via dependency overrides.

---

### 2.2 Technology Stack 

#### 2.2.1 Frontend — Next.js 15 (App Router)
- **Framework**: React 19 with Next.js 15 App Router. Selected for industry-leading SSR/SSG. Server Components render non-sensitive UI on the server (SEO-optimized, faster Time-to-Interactive), while Client Components handle interactive elements.
- **Language**: TypeScript (strict mode enabled). Pydantic models from the FastAPI backend generate OpenAPI specs, which are automatically converted to TypeScript interfaces using `openapi-typescript-codegen` for type-safe API consumption.
- **Styling**: Tailwind CSS with a custom design token configuration ensuring visual consistency across the Patient App, Doctor Dashboard, Pharmacy Portal, and Admin Panel.
- **State Management**: React Query (TanStack Query) for declarative server state fetching/caching; Zustand for lightweight client-side ephemeral state.
- **Form Handling**: React Hook Form combined with Zod for zero-latency client-side validation mappings that mirror backend Pydantic rules.
- **Hosting**: Deployed directly to **Azure Static Web Apps** for global CDN edge caching.

#### 2.2.2 Backend — FastAPI (Python 3.12+)
- **Framework**: FastAPI. Python is the premier language in healthcare/ML, allowing future AI/OCR integrations (e.g., automated lab result reading) to sit natively in the codebase.
- **ASGI Server**: Uvicorn running on top of Gunicorn to manage multiple worker processes per container.
- **ORM**: SQLAlchemy 2.0 (using async engine). It maps Python classes natively to PostgreSQL tables.
- **Database Migrations**: Alembic. Schema state is strictly version-controlled. Migrations are executed in CI/CD, never automatically on startup.
- **Background Workers**: Celery + Redis for reliable, retriable queue management handling email dispatch, auto-cancellation timers, and SLA alerts.
- **File Uploads**: `python-multipart`. Files are streamed chunk-by-chunk to an in-memory anti-virus scanner, then immediately streamed to Azure Blob Storage without touching the local disk.

#### 2.2.3 Database — Azure Database for PostgreSQL
- **Engine**: PostgreSQL 16. Selected for ACID compliance (critical for case state machine transactions) and JSONB column support (for questionnaire schemas and answers).
- **Topology**: Azure Flexible Server configured for Zone Redundancy (High Availability). Continual backups and Point-In-Time Restore (PITR) up to 35 days enabled.
- **RLS Policies**: Native Row-Level Security (RLS) policies enforce that patients can only query their own cases, providing a defense-in-depth layer.
- **Connection Pooling**: PgBouncer enabled natively within Azure Flexible Server to handle thousands of concurrent FastAPI worker connections.

#### 2.2.4 Ephemeral State & Caching — Azure Cache for Redis
- **Role**: High-availability Redis Enterprise tier deployed in Multi-AZ.
- **Usage**:
  1. Celery task broker for background jobs.
  2. Rate-limiting datastore integrated with FastAPI `SlowApi`.
  3. Session management (JWT blocklisting upon user logout).
  4. Cache Layer for low-mutation data (questionnaire schemas, consent templates) with short TTL.

#### 2.2.5 Storage — Azure Blob Storage
- **Tier**: Premium Block Blobs deployed in Europe (e.g. Germany West Central) for high-throughput Patient document uploads and prescriptions. Separate containers for: `patient-documents`, `doctor-attachments`, `invoices`, `audit-logs-export`.
- **Encryption**: Automatically protected by **Azure Key Vault** Managed Keys (SSE-CMK).
- **Access Control**: Private containers ONLY. No public egress. FastAPI generates **Shared Access Signatures (SAS) URLs** with incredibly short lifetimes (e.g., 5 minutes) to broker file access.
- **Versioning**: Object versioning enabled on critical containers for additional data durability.

#### 2.2.6 Identity & Authentication
- **Standard**: OAuth 2.0 with OpenID Connect (OIDC) for identity tokens. Authorization Code Flow with PKCE for all web clients.
- **Token Generation**: FastAPI creates standard JWTs (`pyjwt`) using RS256 asymmetric encryption. Refresh tokens are stored in Azure Cache for Redis.
- **Two-Factor Authentication**: Local TOTP implementation utilizing the `pyotp` library.
- **Permissions Framework**: Role-Based Access Control (RBAC) scopes embedded directly into the JWT claims (`scopes: ["patient:read", "case:submit"]`), evaluated by FastAPI `Security()` dependency injection routes.

---

### 2.3 System Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────┐
│                   INTERNET / PATIENT / DOCTOR                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTPS (TLS 1.2 / 1.3)
┌───────────────────────────▼──────────────────────────────────────┐
│                    AZURE FRONT DOOR (CDN & WAF)                  │
│       (Global load balancing, DDoS protection, App Firewall)     │
└────────────┬──────────────────────────────────┬──────────────────┘
             │ (Static assets)                  │ (API traffic)
             ▼                                  ▼
┌──────────────────────────┐       ┌───────────────────────────────┐
│                          │       │       AZURE CONTAINER APPS    │
│  AZURE STATIC WEB APPS   │       │                               │
│  (Next.js Client)        │       │   ┌───────────────────────┐   │
│                          │       │   │  FastAPI (API Pods)   │   │
└──────────────────────────┘       │   │                       │   │
                                   │   ├───────────────────────┤   │
                                   │   │  Celery (Worker Pods) │   │
                                   │   └───────────┬───────────┘   │
                                   └───────────────┼───────────────┘
          ┌────────────────────────────────────────┤
          │                                        │
┌─────────▼─────────────┐   ┌──────────────────────▼────────┐   ┌───────────────┐
│ Azure DB for Postgres │   │ Azure Cache for Redis         │   │ Azure Blob    │
│ (Flexible Server,     │   │ (Premium Tier, Multi-AZ)      │   │ Storage       │
│  Multi-AZ HA)         │   │ [Celery Broker & Rate Limits] │   │ (Private SAS) │
└───────────────────────┘   └───────────────────────────────┘   └───────────────┘
          │
┌─────────▼─────────────┐   ┌───────────────────────────────┐
│ Partner Webhooks      │   │ External APIs                 │
│ (Celery posts HMAC    │──►│ (Stripe, Twilio SendGrid,     │
│  JSON to pharmacies)  │   │  Gematik eRezept)             │
└───────────────────────┘   └───────────────────────────────┘
```

---

### 2.4 FastAPI Domain Module Breakdown

The API is structured around `APIRouters` which map directly to distinct service domains. Core endpoints include:

| Domain | Responsibilities (FastAPI Routers) | Critical Endpoints |
| :--- | :--- | :--- |
| `catalog` (public) | Treatment types for landing page; no PHI. | `GET /api/v1/treatments`, `GET /api/v1/treatments/{slug}` |
| `auth` | JWT issuance, Registration, Login, TOTP 2FA. | `POST /api/v1/auth/token`, `POST /api/v1/auth/2fa/verify` |
| `users` | Profile CRUD, GDPR Data Export requests. | `GET /api/v1/users/me`, `POST /api/v1/users/export` |
| `consents`| Version-locked consent fetching, audit confirmation. | `GET /api/v1/consents/latest`, `POST /api/v1/consents/accept` |
| `forms` | Questionnaire schema retrieval, Pydantic validation of answers. | `GET /api/v1/forms/{type}`, `POST /api/v1/forms/{id}/submit` |
| `documents`| Chunked uploads, Azure Blob SAS generation, virus scan queuing. | `POST /api/v1/documents/upload`, `GET /api/v1/documents/{id}/url` |
| `cases` | Patient case generation, timeline history, status checks. | `POST /api/v1/cases`, `GET /api/v1/cases/{id}` |
| `clinical`| Doctor Queue management, Medical claim locking, Decision workflows. | `POST /api/v1/clinical/cases/{id}/claim`, `POST /clinical/decisions` |
| `partners` (patient) | List eligible pharmacies for case/treatment/region; bind `partner_id` pre-payment. | `GET /api/v1/cases/{id}/eligible-partners`, `PATCH /api/v1/cases/{id}/pharmacy` |
| `payments`| Stripe intent generation, webhook verification, auto-invoicing. | `POST /api/v1/payments/intent`, `POST /api/v1/payments/stripe-hook` |
| `admin` | Global reporting, user suspension, CMS publishing for questionnaires. | `GET /api/v1/admin/kpis`, `PUT /api/v1/admin/forms/{id}/publish` |

---

### 2.5 API Architecture & Design Standards

### 2.5 API Security & Error Handling

#### 2.5.1 Exception Normalization
- FastAPI's default exception handlers are overridden. A custom `HTTPException` handler ensures every error, regardless of source (SQL constraint, Auth, Pydantic format), returns a standardized RFC 7807 Problem Details JSON format:
  ```json
  {
    "type": "https://api.telemed.de/errors/consent-outdated",
    "title": "Consent Outdated",
    "status": 403,
    "detail": "A mandatory new version (v2.1) of the Privacy Policy must be accepted.",
    "instance": "/api/v1/cases/submit",
    "trace_id": "req-uuid-12345"
  }
  ```

#### 2.5.2 Authentication & Authorization Flow
1. Client sends `POST /api/v1/auth/token` with email + password (using OAuth2 Password Bearer flow).
2. If 2FA is enabled, server returns `{ "requires2FA": true }` with a temporary `pre_auth_token`.
3. Client sends `POST /api/v1/auth/2fa/verify` with the TOTP code + `pre_auth_token`.
4. Server responds with a short-lived `access_token` (JWT, 15-min) and a `refresh_token` (stored in an HttpOnly cookie, 30-day).
5. All subsequent requests include the `access_token` in the `Authorization: Bearer` header.
6. When the access token expires, the client silently calls `POST /api/v1/auth/refresh` to obtain a new token pair using the HttpOnly refresh cookie.
7. On logout, `POST /api/v1/auth/logout` adds the current `access_token` to the Azure Redis blocklist and rotates/deletes the refresh token.

#### 2.5.3 Authorization & Scopes Implementation
- Access control relies on standardized OAuth2 scopes injected into the JWT.
- FastAPI dependency injection validates these seamlessly:
  ```python
  @router.post("/cases", dependencies=[Depends(Security(get_current_user, scopes=["cases:create"]))])
  ```
- Sub-checks regarding specific resource access (e.g. "Can this doctor view THIS specific case?") are executed at the service logic layer or delegated to PostgreSQL Row-Level Security.

#### 2.5.4 Audit Log Interceptor Middleware
- A custom Starlette middleware captures every request/response payload passing through the application.
- For all state-mutating requests (`POST`, `PATCH`, `PUT`, `DELETE`), an asynchronous Celery task is spawned to write the full JSON diff, Actor ID, and IP address into the Immutable Audit Log. This ensures that HTTP response latencies are not affected by logging overhead.

---

### 2.6 Security Architecture

#### 2.6.1 Defence-in-Depth Layers

| Layer | Mechanism | Tool / Implementation |
| :--- | :--- | :--- |
| Network perimeter | WAF filtering (SQLi, XSS, geo-blocking strict to EU) | Azure Front Door WAF |
| Transport | TLS 1.2 minimum enforced end-to-end | Let's Encrypt / Azure App Service Certificates |
| Application gateway | Granular rate limiting | FastAPI SlowApi + Azure Redis |
| Authentication | JWT + 2FA (TOTP) + refresh token rotation | FastAPI OAuth2, PyJWT, pyotp |
| Authorization | Scope-based RBAC + RLS at database layer | FastAPI Dependencies + PostgreSQL RLS policies |
| Data at rest | AES-256 volume encryption + Envelope encryption for PHI | Azure Storage Service Encryption + Azure Key Vault |
| File storage | SSE-CMK per container + Private Network Links only | Azure Blob Storage + Shared Access Signatures |
| Secrets management | No secrets in code or environment variables | Azure Key Vault natively integrated into runtime |
| Audit logging | Append-only, WORM-compliant audit log | Azure Blob Immutable Storage + Write-protected DB role |
| Session management | Redis-backed JWT blocklist + hard inactivity timeout | Azure Cache for Redis TTL |

#### 2.6.2 GDPR Technical Measures
- **Data Minimisation**: Pydantic response models dynamically exclude fields based on the requester's context. Doctors do not receive patient PII not relevant to clinicals; partners do not receive patient identity fields.
- **Pseudonymisation Strategy**: Patient records use a `pseudonym_id` that links back to the real `patient_id` only via an Admin-only join. Clinical records reference `pseudonym_id` only.
- **Right to be Forgotten Implementation**: Deleting a patient account triggers a Celery background job that: (1) destroys PII fields via SQLAlchemy overwrites with `[DELETED]`, (2) revokes all active tokens, (3) destroys the specific Azure Key Vault key used to encrypt their PHI, (4) anonymises questionnaire responses (patient identity removed, clinical data retained for legal purposes).
- **Data Portability**: A `POST /api/v1/users/export` endpoint triggers a Celery job that compiles the patient's complete platform data into a structured JSON and ZIP file in Blob Storage, sending a private SAS download link by email.
- **Data Retention Enforcement**: A scheduled weekly Celery task flags any case records older than 10 years for Admin review before archival, ensuring compliance with §630f BGB German medical retention requirements.

#### 2.6.3 Penetration Testing & Vulnerability Management
- **SAST (Static Analysis)**: Integrated into the CI pipeline via Python `bandit` and `safety` on every commit. PRs fail if critical vulnerabilities are detected.
- **DAST (Dynamic Analysis)**: OWASP ZAP scans run against the staging environment on every release candidate.
- **External Pen Test**: Periodic engagements with a certified external security firm, targeting custom healthcare vectors.

---

### 2.7 Infrastructure & Deployment Topology (Azure)

**Cloud Provider**: Microsoft Azure (Region: `Germany West Central` - Frankfurt)

```text
┌────────────────────────────────────────────────────────────┐
│              Azure Germany West Central (Frankfurt)        │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Azure Virtual Network (VNet)        │  │
│  │                                                      │  │
│  │  ┌──────────────┐    ┌──────────────────────────┐    │  │
│  │  │ Public Subnet│    │     Private Subnet         │    │  │
│  │  │              │    │                            │    │  │
│  │  │  Front Door  │    │ Azure Container Apps (ACA) │    │  │
│  │  │   + WAF      │    │  - FastAPI Web Pods        │    │  │
│  │  └──────┬───────┘    │  - Celery Worker Pods      │    │  │
│  │         │            └───────────┬────────────────┘    │  │
│  │         │                        │                     │  │
│  │  ┌──────▼────────────────────────▼─────────────────┐  │  │
│  │  │     Data Subnet (Isolated via Private Link)     │  │  │
│  │  │  Azure DB for Postgres (Flexible Server, HA)    │  │  │
│  │  │  Azure Cache for Redis (Premium Tier)           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                            │
│  Azure Blob Storage │  Azure Key Vault │ Azure Monitor      │
└────────────────────────────────────────────────────────────┘
```

**Key Infrastructure Decisions:**
- **Azure Container Apps**: Serverless container orchestration abstracting away K8s overhead. Auto-scales FastAPI pods from 1 to 50 based on concurrent HTTP requests. Auto-scales Celery pods via KEDA based on Redis queue depths.
- **VNet Integration**: All backend resources (PostgreSQL, Redis, Key Vault, Blob Storage) use Azure Private Endpoints. Traffic never physically routes over the public internet.
- **Identities**: Container Apps run using Managed Identities to securely fetch credentials from Key Vault automatically — there are zero statically defined API tokens for Azure services.

---

### 2.8 CI/CD Pipeline (GitHub Actions)

The deployment pipeline enforces strict quality gates before advancing code to Azure.

```text
Developer Push / PR
        │
        ▼
┌───────────────┐
│  Lint + Tests  │  ← Flake8, Black, Unit Tests (pytest), Integration Tests
│  (CI Stage)    │  ← Security Scan: bandit, safety
└───────┬───────┘
        │ PR merged to main
        ▼
┌───────────────┐
│  Build Stage  │  ← Next.js build, FastAPI Docker image build
│               │  ← Docker image tagged with Git SHA and pushed to ACR
└───────┬───────┘
        │
        ▼
┌───────────────────┐
│  Deploy: Staging  │  ← ACA revision update to Staging environment
│                   │  ← DB migrations (Alembic) applied via ephemeral job
│                   │  ← OWASP ZAP DAST scan runs against staging URL
└────────┬──────────┘
         │ Manual approval gate (Tech Lead / Release Manager)
         ▼
┌───────────────────┐
│  Deploy: Prod     │  ← Blue/Green deployment via ACA traffic splitting
│                   │  ← Health checks verify new containers
│                   │  ← Azure alerts monitor 5xx error rate post-deploy
│                   │  ← Automatic scale-back of traffic if error threshold exceeded
└───────────────────┘
```

---

### 2.9 Observability & Telemetry

**Logging:**
- All structured logs (JSON format) generated by `structlog` are streamed to **Azure Monitor (Log Analytics Workspace)**.
- Every log captures a `correlation_id` to trace an entire HTTP request lifecycle across domain routers, Celery tasks, and external calls.

**Metrics & Tracing:**
- **Azure Application Insights** is integrated via the OpenTelemetry Python SDK.
- This provides automatic Flame Graphs showing exact timings for SQL queries (via SQLAlchemy hooks) and external HTTP requests (via `httpx`).
- Custom metrics capture domain-specific data such as "Cases Created Per Hour" or "Average Doctor Review Latency".

**Alerting:**
- Azure Monitor Alerts push to Microsoft Teams / PagerDuty on critical thresholds:
  - 5xx error rates > 1% over 5 minutes.
  - Celery queue depth > 500 unprocessed items.
  - Database connection pool near exhaustion.

---

### 2.10 Third-Party Service Integrations

| Service | Provider (Recommended) | Purpose |
| :--- | :--- | :--- |
| Payment Processing | Stripe | `stripe-python` bindings for PaymentIntents and Webhook verifications |
| Transactional Email | SendGrid / Twilio SendGrid | Celery tasks executing templated email dispatch |
| SMS (2FA) | Twilio | `twilio-python` for OTP delivery during 2FA setup |
| Virus Scanning | ClamAV (Self-hosted API) | Files buffered and scanned in memory prior to Blob Storage commit |
| Video Consultations | Daily.co / Twilio Video | WebRTC video session provisioning (Roadmap Phase 2+) |
| e-Prescription | Gematik TI Konnektor | FHIR-compliant eRezept payloads constructed via Python FHIR libs |
| Secret Management | Azure Key Vault | Absolute secret rotation and policy enforcement |
| Observability | Azure App Insights / Monitor | Logs, Metrics, Distributed Tracing |
| CDN & Edge Security | Azure Front Door | Edge caching, DDoS protection, WAF filtering |

---


## 3. Data Model Design

This section defines the **authoritative logical and physical data model** for the platform: entity responsibilities, key attributes, referential integrity, indexing strategy, encryption boundaries, and how the schema maps to the functional modules in §1 and the architecture in §2. The model targets **PostgreSQL 16** with **Alembic**-managed migrations, **SQLAlchemy 2.0** async mappings, and defense-in-depth alignment with **Row-Level Security (RLS)** where row ownership is role-scoped.

---

### 3.0 Design Principles & Cross-Cutting Rules

**Normalization & integrity**
- Third Normal Form (3NF) for operational tables; **JSONB** used only where the domain is inherently semi-structured (questionnaire schemas, audit diffs, webhook payloads) and versioning or query patterns justify it.
- **Every** state transition on `Case` produces a row in `CaseStatusHistory`; application code never updates `current_status` without a matching history insert inside a single database transaction.
- **Foreign keys** are enforced at the database layer with explicit `ON DELETE` policies (typically `RESTRICT` for clinical/financial parents, `SET NULL` only where legally safe).

**Identifiers & time**
- Primary keys are **UUID v4** (`uuid_generate_v4()` or application-generated) unless an external system supplies a stable natural key (e.g. Stripe IDs stored as unique business keys, not PKs).
- All mutable entities carry `created_at` and `updated_at` (`TIMESTAMPTZ`, UTC); history and audit tables are **insert-only** with `created_at` only.

**PII / PHI & encryption**
- Columns storing direct identifiers or clinical content are marked in design docs and implemented as **encrypted at rest** (database TDE) plus **application-layer encryption** for the most sensitive fields (names, DOB, free-text answers, justifications) using keys from **Azure Key Vault** (envelope encryption pattern).
- **`pseudonym_id`**: optional surrogate exposed in clinical joins where pseudonymisation is required (§2.6.2); stored on `PatientProfile` or a dedicated `PatientIdentity` bridge table depending on migration granularity.

**Multi-tenancy & roles**
- **No overlapping roles per user**: enforced with a **single `role_id`** per `User` and a check constraint or application invariant that profile tables (`PatientProfile`, `DoctorProfile`, `PartnerProfile`) are mutually exclusive by role.
- **RLS** policies (PostgreSQL) align with JWT claims: e.g. `patient_id = current_setting('app.current_patient_id')::uuid` for patient-scoped tables.

**Soft delete & retention**
- Users are deactivated via `is_active` / `suspended_at`; hard deletes are rare and GDPR-driven, modeled via **anonymisation jobs** rather than physical row removal for clinical parents until retention allows.
- Medical retention (**§630f BGB**, minimum **10 years**) influences **archival** flags and export packs, not silent `DELETE`.

---

### 3.1 Identity, Access Control & User Profiles

#### 3.1.1 `Role`
Defines the fixed actor types aligned with §1.2.1 (Patient, Doctor, Partner, Admin, optional DPO read-only).

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `name` | VARCHAR(64) UNIQUE | e.g. `patient`, `doctor`, `partner`, `admin` |
| `description` | TEXT | Internal documentation |
| `created_at` | TIMESTAMPTZ | |

**Permissions**: Fine-grained OAuth2-style scopes may be stored in `RolePermission` (many-to-many) with `permission_code` (e.g. `cases:read`, `clinical:decide`) rather than a single opaque JSONB blob, to allow auditing of permission changes over time.

#### 3.1.2 `User`
Central authentication subject; one row per login identity.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `email` | BYTEA or VARCHAR + app encryption | Unique; normalization (lowercase) before hash/compare |
| `email_verified_at` | TIMESTAMPTZ NULL | NULL until DOI completed |
| `password_hash` | VARCHAR | bcrypt, cost ≥ 12 |
| `role_id` | UUID FK → `Role` | Exactly one role per user |
| `is_active` | BOOLEAN | Account usable |
| `suspended_at` | TIMESTAMPTZ NULL | Admin suspension |
| `suspension_reason` | TEXT NULL | |
| `failed_login_count` | SMALLINT | Reset on success |
| `locked_until` | TIMESTAMPTZ NULL | Lockout window |
| `totp_secret` | BYTEA NULL | Encrypted; doctors mandatory post-invite |
| `totp_enabled_at` | TIMESTAMPTZ NULL | |
| `last_login_at` | TIMESTAMPTZ NULL | |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

**Indexes**: UNIQUE on hashed email lookup key if using blind-index pattern; `role_id`, `is_active` for admin grids.

#### 3.1.3 `UserSession` / `RefreshToken` (optional split)
Supports JWT refresh rotation and **Redis blocklist** described in §2.5.2.

| Concept | Storage | Notes |
| :--- | :--- | :--- |
| Refresh token family | `refresh_token` table: `id`, `user_id`, `token_hash`, `expires_at`, `revoked_at`, `replaced_by_id` | Detect reuse / theft |
| Blocklist | Primarily Redis; optional DB audit of logout events | |

#### 3.1.4 `DoctorInvitation`
Admin-only onboarding for doctors (§1.2.1): no self-registration.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `email` | VARCHAR | Target email |
| `token_hash` | VARCHAR | One-time invite |
| `expires_at` | TIMESTAMPTZ | |
| `specialty_queue_id` | UUID FK NULL | Pre-assigned queue / treatment family |
| `invited_by_user_id` | UUID FK → `User` | Admin |
| `consumed_at` | TIMESTAMPTZ NULL | |

#### 3.1.5 `PatientProfile`
Demographics and insurance pointers; **one-to-one** with `User` where `role = patient`.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID UNIQUE FK → `User` | |
| `pseudonym_id` | UUID UNIQUE | For pseudonymised clinical linkage |
| `first_name`, `last_name` | Encrypted | |
| `date_of_birth` | Encrypted or DATE in secure enclave | Age gate ≥ 18 |
| `address_line1`, `city`, `postal_code`, `country` | Encrypted / structured | German address for invoicing |
| `phone` | VARCHAR NULL | E.164 |
| `insurance_provider_code` | VARCHAR NULL | SGB V future use |
| `insurance_number` | Encrypted NULL | |
| `marketing_opt_in` | BOOLEAN | Revocable per §1.2.2 |

#### 3.1.6 `DoctorProfile`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID UNIQUE FK | |
| `lanr` | VARCHAR UNIQUE | **Lebenslange Arztnummer**; validated against registry (MVP manual) |
| `specialization` | VARCHAR | Maps to specialty queue |
| `verification_status` | ENUM | e.g. `pending`, `verified`, `suspended` |
| `practice_name`, `practice_address` | TEXT | |
| `verified_at` | TIMESTAMPTZ NULL | |

#### 3.1.7 `PartnerProfile`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `user_id` | UUID UNIQUE FK | |
| `pharmacy_legal_name` | VARCHAR | |
| `betriebserlaubnis_nr` | VARCHAR UNIQUE NULL | DE pharmacy license |
| `api_webhook_url` | VARCHAR | HTTPS; HMAC secret stored in Key Vault reference |
| `webhook_secret_version` | VARCHAR | Key rotation |
| `delivery_regions` | JSONB NULL | Capability flags |

---

### 3.2 Consent & Legal Document Versioning

Aligned with §1.2.2: independent document types, immutable versions, re-consent on mandatory updates.

#### 3.2.1 `ConsentDocumentType`
Lookup: `privacy_policy`, `terms_of_service`, `medical_treatment`, `data_transfer`, `marketing` (optional).

#### 3.2.2 `ConsentVersion`
One row per published version; **never deleted**.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `document_type` | ENUM / FK | |
| `version_label` | VARCHAR | e.g. `v1.0`, `v2.1` |
| `content_markdown` | TEXT | Rendered in UI |
| `is_mandatory` | BOOLEAN | If false, revocable independently (marketing) |
| `effective_from` | TIMESTAMPTZ | |
| `published_by_user_id` | UUID FK NULL | Admin |
| `created_at` | TIMESTAMPTZ | |

**Constraint**: UNIQUE(`document_type`, `version_label`).

#### 3.2.3 `PatientConsentAcceptance`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `patient_user_id` | UUID FK → `User` | |
| `consent_version_id` | UUID FK | |
| `accepted_at` | TIMESTAMPTZ | |
| `ip_address` | INET | |
| `user_agent` | TEXT | |
| `revoked_at` | TIMESTAMPTZ NULL | Only where legally allowed (e.g. marketing) |

**API gate**: “Latest mandatory set” = for each mandatory `document_type`, the patient must have accepted the row with `max(effective_from)` for that type.

---

### 3.3 Treatment Types & Questionnaire Engine

Aligned with §1.2.3: JSON Schema in DB, versioning, drafts, hard stops without case creation.

#### 3.3.1 `TreatmentType`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `slug` | VARCHAR UNIQUE | e.g. `hair_loss`, `contraception` |
| `display_name` | VARCHAR | i18n key optional later |
| `is_active` | BOOLEAN | |
| `default_questionnaire_version_id` | UUID FK NULL | Current active version |

#### 3.3.2 `QuestionnaireVersion`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `treatment_type_id` | UUID FK | |
| `version_number` | INT | Monotonic per treatment |
| `schema_definition` | JSONB | Questions, `display_conditions`, `exclusion_rules` |
| `published_at` | TIMESTAMPTZ NULL | NULL = draft |
| `published_by_user_id` | UUID FK NULL | |

**Indexes**: (`treatment_type_id`, `version_number` DESC) for “current” resolution.

#### 3.3.3 `QuestionnaireDraft`
Autosave every 30s; TTL 30 days inactivity (§1.2.3).

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `patient_user_id` | UUID FK | |
| `treatment_type_id` | UUID FK | |
| `questionnaire_version_id` | UUID FK | Version pinned when draft started |
| `answers_json` | JSONB Encrypted | |
| `last_saved_at` | TIMESTAMPTZ | Job deletes stale drafts |

#### 3.3.4 `QuestionnaireResponse` (submitted snapshot)
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID UNIQUE FK | One submission per case |
| `questionnaire_version_id` | UUID FK | **Immutable** reference |
| `answers_json` | JSONB Encrypted | Snapshot at submit |
| `schema_snapshot_json` | JSONB | Optional duplicate of schema for legal immutability |
| `submitted_at` | TIMESTAMPTZ | |
| `hard_stop_triggered` | BOOLEAN | If true, no case / no charge (usually no row here; alternatively logged only in `AuditLog`) |

---

### 3.4 Cases, State Machine & Operational Data

Aligned with §1.2.5: full status enum and `CaseStatusHistory`.

#### 3.4.1 Case status enumeration
Store as PostgreSQL `ENUM` or `TEXT` with `CHECK`:

`Draft`, `Submitted`, `Paid`, `In Review`, `Needs More Info`, `Awaiting Video`, `Approved`, `Rejected`, `Sent to Partner`, `In Fulfillment`, `Shipped`, `Completed`, `Cancelled`, `Refund Issued`.

#### 3.4.2 `Case`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `patient_user_id` | UUID FK | |
| `treatment_type_id` | UUID FK | From landing/treatment selection (§1.2.1) |
| `selected_partner_user_id` | UUID FK NULL | Pharmacy chosen **before** payment (§1.2.9); required before `Paid` for patient-led flows |
| `current_status` | case_status ENUM | |
| `assigned_doctor_user_id` | UUID FK NULL | Denormalized for RLS; sync with `MedicalReview` |
| `specialty_queue` | VARCHAR NULL | Denormalized from treatment/doctor routing |
| `needs_info_deadline_at` | TIMESTAMPTZ NULL | 14-day rule |
| `payment_due_snapshot_amount_cents` | INT NULL | Fee at submission |
| `currency` | CHAR(3) | e.g. EUR |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

**Indexes**: (`patient_user_id`, `created_at` DESC); (`current_status`, `created_at`) for queues; partial index on `current_status = 'Paid'` for doctor pool.

#### 3.4.3 `CaseStatusHistory`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | BIGSERIAL PK | Monotonic cheap inserts |
| `case_id` | UUID FK | |
| `from_status` | ENUM NULL | NULL when created |
| `to_status` | ENUM | |
| `trigger_source` | VARCHAR | `patient`, `stripe_webhook`, `doctor`, `system_job`, `admin` |
| `actor_user_id` | UUID FK NULL | System NULL |
| `metadata_json` | JSONB NULL | e.g. Stripe event id |
| `created_at` | TIMESTAMPTZ | |

**Append-only**; no updates.

#### 3.4.4 `CaseDocument` (attachments)
Renamed from generic `Attachment` for clarity; aligns with §1.2.4.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID FK | |
| `uploaded_by_user_id` | UUID FK | Patient or doctor |
| `storage_container` | VARCHAR | `patient-documents` / `doctor-attachments` |
| `blob_path` | VARCHAR | Private path |
| `file_name` | VARCHAR | Original name |
| `mime_type` | VARCHAR | |
| `size_bytes` | BIGINT | |
| `virus_scan_status` | ENUM | `pending`, `clean`, `infected`, `error` |
| `checksum_sha256` | VARCHAR | Integrity |
| `created_at` | TIMESTAMPTZ | |

---

### 3.5 Messaging, Notifications & Email Audit

#### 3.5.1 `CaseMessage`
Case-scoped thread (§1.2.7); encrypted body.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID FK | |
| `sender_user_id` | UUID FK | |
| `recipient_role` | ENUM | `patient`, `doctor`, `admin_internal` |
| `body_ciphertext` | BYTEA | |
| `sent_at` | TIMESTAMPTZ | |
| `read_at` | TIMESTAMPTZ NULL | |

#### 3.5.2 `NotificationLog` (optional)
Stores **non-PHI** email dispatch metadata: template id, recipient hash, `sent_at`, provider message id — for support and GDPR evidence without duplicating clinical content.

---

### 3.6 Billing, Invoices & Refunds

Aligned with §1.2.8.

#### 3.6.1 `Payment`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID UNIQUE FK | One successful payment per case fee (adjust if partial payments) |
| `stripe_payment_intent_id` | VARCHAR UNIQUE | |
| `amount_cents` | INT | |
| `currency` | CHAR(3) | |
| `status` | ENUM | `pending`, `succeeded`, `failed`, `refunded`, `partially_refunded` |
| `captured_at` | TIMESTAMPTZ NULL | |

#### 3.6.2 `Invoice`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID FK | |
| `payment_id` | UUID FK | |
| `invoice_number` | VARCHAR UNIQUE | Sequential Rechnung |
| `pdf_blob_path` | VARCHAR | Azure Blob |
| `vat_rate` | NUMERIC(5,2) | e.g. 19.00 |
| `issued_at` | TIMESTAMPTZ | |

#### 3.6.3 `Refund`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `payment_id` | UUID FK | |
| `requested_by_user_id` | UUID FK NULL | System/doctor trigger |
| `approved_by_user_id` | UUID FK NULL | Admin |
| `amount_cents` | INT | |
| `stripe_refund_id` | VARCHAR NULL | |
| `status` | ENUM | `pending_admin`, `processed`, `failed` |
| `created_at` | TIMESTAMPTZ | |

---

### 3.7 Clinical Review, Decisions & Prescriptions

Aligned with §1.2.6 and prescription payload §1.2.6.

#### 3.7.1 `MedicalReview`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID UNIQUE FK | One active review row |
| `doctor_user_id` | UUID FK | |
| `claimed_at` | TIMESTAMPTZ | SLA 72h from claim |
| `completed_at` | TIMESTAMPTZ NULL | When decision final |

#### 3.7.2 `MedicalDecision`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `medical_review_id` | UUID FK | |
| `verdict` | ENUM | `approved`, `rejected`, `needs_more_info`, `video_requested` |
| `rejection_category` | VARCHAR NULL | From predefined list |
| `medical_justification` | TEXT Encrypted | Min length enforced in API |
| `internal_notes` | TEXT NULL | Admin-visible |
| `decided_at` | TIMESTAMPTZ | |

#### 3.7.3 `PrescriptionLine` (supports multi-line future; MVP single line)
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `decision_id` | UUID FK | |
| `pzn` | VARCHAR | Pharmazentralnummer |
| `dosage_mg` | NUMERIC NULL | |
| `quantity` | INT | |
| `instructions` | TEXT | Patient-facing |
| `prescriber_lanr` | VARCHAR | Denormalized from doctor |
| `payload_hash` | VARCHAR | Tamper detection |
| `fhir_json` | JSONB NULL | Future KBV_PR_ERP_Prescription |

---

### 3.8 Partner Fulfillment & Webhooks

Aligned with §1.2.9.

#### 3.8.1 `PartnerCaseSubscription`
Links which partner receives which cases (MVP may be 1:1 default pharmacy).

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID FK | |
| `partner_user_id` | UUID FK | |
| `status` | ENUM | `pending`, `acknowledged`, … |

#### 3.8.2 `PartnerWebhookDelivery`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `partner_user_id` | UUID FK | |
| `case_id` | UUID FK | |
| `payload_url_issued_at` | TIMESTAMPTZ | Signed URL 48h |
| `http_status` | INT NULL | |
| `attempt` | SMALLINT | Retries |
| `created_at` | TIMESTAMPTZ | |

#### 3.8.3 `Shipment`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | UUID PK | |
| `case_id` | UUID FK | |
| `partner_user_id` | UUID FK | |
| `tracking_number` | VARCHAR | |
| `carrier` | VARCHAR | |
| `shipped_at` / `delivered_at` | TIMESTAMPTZ NULL | |
| `partner_status` | ENUM | Partner pipeline |

---

### 3.9 Administration & CMS

#### 3.9.1 `AdminActionLog` (optional separate from `AuditLog`)
Coarse admin operations: user suspend, manual case transition, questionnaire publish — still duplicated into `AuditLog` for unified reporting.

#### 3.9.2 `QuestionnairePublishEvent` / `ConsentPublishEvent`
Immutable record when Admin publishes; supports compliance audits.

---

### 3.10 Immutable Audit Log

Aligned with §1.1.1, §1.2.10, §2.5.4.

#### 3.10.1 `AuditLog`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | BIGSERIAL | Partition key friendly |
| `occurred_at` | TIMESTAMPTZ | |
| `actor_user_id` | UUID FK NULL | System jobs NULL |
| `actor_ip` | INET NULL | |
| `action_code` | VARCHAR | e.g. `FILE_ACCESSED`, `QUESTIONNAIRE_HARD_STOP`, `CASE_STATUS_CHANGED` |
| `resource_type` | VARCHAR | Table or domain name |
| `resource_id` | UUID NULL | |
| `request_id` | UUID | Correlation id |
| `payload_diff_json` | JSONB NULL | Old/new or redacted snapshot |
| `user_agent` | TEXT NULL | |

**Protections**: `REVOKE UPDATE, DELETE ON audit_log FROM app_role`; inserts via dedicated role or security definer function; **monthly range partitioning** on `occurred_at`; optional **WORM** archive to Blob for long-term.

---

### 3.11 Entity–Relationship Overview (Textual)

```text
User ──1:1── PatientProfile ──1:N── Case ──1:1── QuestionnaireResponse
                 │                         │
                 │                         ├──1:N── CaseDocument
                 │                         ├──1:N── CaseMessage
                 │                         ├──0:1── Payment ──0:1── Invoice
                 │                         ├──0:1── MedicalReview ──1:1── MedicalDecision ──1:N── PrescriptionLine
                 │                         └──1:N── CaseStatusHistory
                 └──1:N── PatientConsentAcceptance ──N:1── ConsentVersion

DoctorProfile ── (User) ── claims ── MedicalReview
PartnerProfile ── (User) ── PartnerWebhookDelivery / Shipment
```

---

### 3.12 Indexing, Constraints & Transaction Patterns

**Critical unique constraints**
- `MedicalReview.case_id` UNIQUE (one concurrent claim).
- `QuestionnaireResponse.case_id` UNIQUE.
- `Payment.case_id` UNIQUE (per MVP assumption).

**Transactional case transition**
1. `SELECT … FOR UPDATE` on `Case`.
2. Validate transition against **allowed graph** (§1.2.5).
3. `INSERT` into `CaseStatusHistory`.
4. `UPDATE Case SET current_status = …`.
5. Commit; async Celery for emails/webhooks.

**Query patterns**
- Doctor queue: filter `current_status = 'Paid'` + join `TreatmentType` / specialty.
- Patient dashboard: `patient_user_id` + order by `updated_at`.

---

### 3.13 GDPR & Retention Hooks in the Schema

| Requirement | Schema / job support |
| :--- | :--- |
| Export (Art. 15) | Join all tables by `user_id` / `patient_user_id`; blob paths for ZIP |
| Erasure (Art. 17) | Anonymise `PatientProfile` fields; retain `Case` legal minimums |
| Consent evidence | `PatientConsentAcceptance` + version text in `ConsentVersion` |
| Medical retention | `Case` + attachments + decisions retained ≥ 10 years; flags for archival |

---

## 4. UI Wireframes Reference

[PLACEHOLDER: Wireframes for all key user interfaces]
*Expected deliverables during Discovery mapping out the **Landing page & treatment catalog**, **sign-up and step-by-step onboarding**, **questionnaire**, **pharmacy picker**, **checkout**, **order/shipment tracking**, Doctor Dashboard with the Decision Workflow panel, Pharmacy Order Tracker, and the Admin CMS/Reporting Panel.*

---

## 5. MVP Implementation Roadmap

This section defines **how** the platform described in §1–§4 is delivered: delivery model, governance, phased scope, sprint-level sequencing, quality gates, environments, dependencies, and launch. It is the operational counterpart to the technical architecture (§2) and data model (§3). Timelines in this roadmap may extend beyond a single **3-month** funded window unless scope is reduced: see **§6** for the labour budget (**1 PM + 4 developers**, man-hours and total cost).

---

### 5.1 Delivery Model, Governance & Quality Gates

#### 5.1.1 Agile / Scrum Baseline
- **Framework**: Scrum with **two-week sprints** (time-boxed, fixed dates for review, retrospective, and planning).
- **Product Owner (PO)**: Owns prioritisation, accepts user stories, and resolves scope trade-offs against compliance non-negotiables (consent, auditability, no automated medical decisions — §1.1.1).
- **Scrum Master** (or rotating tech lead): Removes blockers, enforces ceremony hygiene, tracks dependencies on legal, DPO, and pharmacy partners.
- **Definition of Ready (DoR)**: Story has acceptance criteria, data classification (PII/PHI), security notes, and OpenAPI contract link where applicable.
- **Definition of Done (DoD)**: Code merged to `main` via pull request; unit tests for domain logic; integration tests for critical paths; no critical/high SAST findings; feature behind configuration flag if incomplete; documentation updated (API + runbook snippet); deployment to Staging verified.

#### 5.1.2 Compliance-Embedded “Non-Functional” Gates
These are **release blockers** for production, not optional polish:

| Gate | Validation |
| :--- | :--- |
| **Consent & re-consent** | Mandatory consents version-locked; APIs return `403` when outdated (§1.2.2). |
| **Audit trail** | State-changing operations and file access produce durable `AuditLog` rows (§3.10, §2.5.4). |
| **Role isolation** | No overlapping roles per user; RBAC plus RLS smoke tests per deployment (§1.1.1, §2.2.3). |
| **Medical workflow** | Doctor decisions require justification; prescription carries LANR and structured payload (§1.2.6). |
| **Data residency** | Azure region (e.g. Germany West Central) and Private Link topology unchanged from approved architecture (§2.7). |

#### 5.1.3 Environments & Branching Strategy
- **Local**: Docker Compose (PostgreSQL, Redis, optional ClamAV) for developer parity with production behaviour.
- **Development**: Shared unstable environment; optional auto-deploy from short-lived feature branches.
- **Staging**: Production-like (TLS, Azure Key Vault, Private Endpoints); **mandatory** for user acceptance testing, E2E automation, and DAST.
- **Production**: Blue/green or revision-based traffic split (§2.8); database migrations via Alembic job in CI/CD — **never** automatic migration on application startup.

**Branching**: Trunk-based development with short-lived feature branches; `main` remains deployable to Staging; production releases tagged from `main` after the checklist in §5.1.2 is satisfied for the release candidate.

#### 5.1.4 Artifact & Documentation Outputs (Continuous)
- **OpenAPI**: Generated from FastAPI; versioned per release; breaking changes require PO and dependent frontend sign-off.
- **Runbooks**: Incident playbooks for authentication outage, Stripe webhook failure, Redis or Celery backlog, database connection exhaustion, and region failover.
- **Architecture Decision Records (ADRs)**: Major decisions (queue assignment, field-level encryption scope, partner webhook contract) recorded in the repository.

---

### 5.2 Cross-Cutting Workstreams (Parallel Across Phases)

| Workstream | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
| :--- | :--- | :--- | :--- | :--- |
| **Security & privacy** | DPIA kickoff, threat modelling | Secure coding, RLS policies, secret hygiene | SAST/DAST, penetration test remediation | Production configuration review |
| **DevOps / SRE** | Infrastructure as Code baseline, CI skeleton | Full pipeline, Staging parity, observability wiring | Alert threshold tuning, chaos/smoke drills | On-call rotation, hypercare monitoring |
| **QA** | Test strategy, requirements traceability matrix | API tests, growing E2E coverage | Full regression, exploratory charters | Pilot test scenarios, bug triage |
| **Design / UX** | Design system, critical user journeys | Sprint-aligned UI delivery | Accessibility and edge-state polish | Pilot feedback iterations |
| **Legal / regulatory** | Consent copy, processor agreements | Review of transactional email templates | DPIA completion pack | Pilot participant terms |

---

### 5.3 Phase 1 — Discovery, Planning & Foundations (Weeks 1–4)

**Objective**: Convert this specification into an **executable backlog**, validated **UX**, stable **data contracts**, and a **deployable non-production** cloud footprint — without yet delivering full end-to-end product value.

#### 5.3.1 Week-by-Week Breakdown

| Week | Themes | Key Activities |
| :--- | :--- | :--- |
| **1** | Alignment & backlog | Stakeholder workshops; map §1 modules to epics and user stories; establish risk register; confirm MVP scope versus post-MVP (video consultation, full eRezept production); tooling setup (Jira/Linear, GitHub); definition of Ready/Done workshops. |
| **2** | Legal, privacy & vendors | DPIA scoping with DPO; subprocessors register (Azure, Stripe, email/SMS providers); draft data processing agreements; LANR validation process for MVP (manual vs future API); Stripe and transactional email sandbox accounts; clarify Betriebserlaubnis collection for partners (§1.2.1). |
| **3** | UX & questionnaire | Design system foundations (Tailwind tokens); wireframes and flows: **landing → treatment choice (pre-signup)** → registration → double opt-in → consent → questionnaire → documents → **pharmacy picker** → checkout/payment → **order & shipment tracking**; doctor queue → claim → review → decision; admin consent and questionnaire CMS; accessibility target (WCAG 2.1 Level AA aspirational). |
| **4** | Technical foundations | Finalise ERD against §3; first OpenAPI stubs for `catalog`, `auth`, `consents`, `forms`, `cases`, `partners`; Terraform modules for VNet, Container Apps, PostgreSQL Flexible Server, Redis, Blob Storage, Key Vault (§2.7); **Staging** environment with empty database; CI: lint (Flake8/Black), pytest, Docker image build, deploy to Staging. |

#### 5.3.2 Phase 1 Deliverables (Exit Criteria)
- Signed-off **MVP backlog** with stories traceable to business rules BR-01–BR-11 (§1.3).
- **UI**: High-fidelity designs (or approved wireframes with explicit open questions) for patient, doctor, and admin critical paths.
- **Data**: ERD and Alembic migration ordering; naming consistent with §3.
- **Infra**: Staging endpoint reachable over HTTPS; all secrets in Key Vault; no credentials in Git.
- **Compliance**: DPIA draft v0.1; consent and privacy text either lawyer-reviewed or explicitly scheduled with owner and date.

#### 5.3.3 Phase 1 Risks & Mitigations
- **Scope creep**: PO maintains a single “MVP” backlog; defer video and insurance billing explicitly.
- **Legal latency**: Technical spikes proceed on Staging with placeholder copy; production launch blocked until text sign-off.
- **Design churn**: Freeze **layout and components** early; allow copy and microcopy iteration during Phase 2.

---

### 5.4 Phase 2 — MVP Development (Weeks 5–18)

**Objective**: Implement the **Modular Monolith** (FastAPI + Next.js) per §2, delivering the modules required for a **paid, doctor-reviewed, partner-fulfilled** case lifecycle (§1.4).

**Execution**: **Seven two-week sprints** (Sprints 1–7). Each sprint below lists **backend**, **frontend**, **integrations**, and **sprint review demo** intent.

#### 5.4.1 Sprint 1 (Weeks 5–6) — Identity, RBAC & Application Skeleton
- **Backend**: FastAPI project structure; SQLAlchemy 2.0 async models; `User`, `Role`; JWT access and refresh tokens; password hashing (bcrypt cost ≥ 12); email verification tokens for double opt-in; public **`catalog`** endpoints for treatment types (§2.4); anonymous intake/session handoff for pre-selected treatment; Alembic migrations; `/health` and `/ready` endpoints.
- **Frontend**: Next.js 15 App Router shell; **marketing landing + treatment catalog** (browse before signup); patient registration and login; React Query for API calls; protected routes using session/JWT pattern aligned with §2.5.2.
- **Infra**: Deploy API and web to Staging; environment variables from Key Vault references.
- **Demo**: Visitor selects a treatment on the landing flow, then registers; completes email verification; authenticated call to protected endpoint; doctor self-registration rejected at API level.

#### 5.4.2 Sprint 2 (Weeks 7–8) — Audit Logging, 2FA & Session Hardening
- **Backend**: Append-only `AuditLog` service; Starlette middleware or Celery task for mutation logging (§2.5.4); Redis for JWT blocklist and refresh token family; TOTP (`pyotp`) for doctors — mandatory before `DoctorProfile` is active; failed-login lockout and CAPTCHA hook after repeated failures (§1.2.1).
- **Frontend**: Doctor invitation redemption flow; 2FA enrollment and challenge screens.
- **QA**: Contract tests on audit payload schema; snapshot tests for critical audit action codes.
- **Demo**: Doctor cannot activate account without 2FA; logout invalidates session per blocklist design; sample audit entries visible in admin or DB.

#### 5.4.3 Sprint 3 (Weeks 9–10) — Consent Management Engine
- **Backend**: `ConsentVersion` lifecycle; admin publish workflow; patient acceptance endpoints; revocation rules for marketing opt-in; mandatory re-consent gate before questionnaire (§1.2.2); RFC 7807 errors (§2.5.1).
- **Frontend**: Consent step in onboarding; re-consent modal on login when versions change; profile marketing toggle.
- **Demo**: Patient blocked from intake when consent outdated; after acceptance, progression allowed; version and IP persisted (§3.2).

#### 5.4.4 Sprint 4 (Weeks 11–12) — Questionnaire Engine & Document Upload
- **Backend**: `TreatmentType`, `QuestionnaireVersion` with JSONB `schema_definition`; server-side validation of answers; evaluation of `display_conditions` and `exclusion_rules`; `QuestionnaireDraft` with autosave and scheduled purge of stale drafts; `CaseDocument` with Blob upload, ClamAV queue, SAS URLs; audit `FILE_ACCESSED` and `QUESTIONNAIRE_HARD_STOP` (§1.2.3–1.2.4).
- **Frontend**: Dynamic questionnaire renderer; save-as-draft; hard-stop overlay; document upload with type and size validation.
- **Demo**: Full intake for one treatment type; hard stop produces halt message and **no** payable case; successful path creates draft progressing toward case creation post-payment in Sprint 5.

#### 5.4.5 Sprint 5 (Weeks 13–14) — Case State Machine, Pharmacy Selection & Payments
- **Backend**: `Case` (including `selected_partner_user_id`), `CaseStatusHistory`; partner eligibility rules; state transition validation (§1.2.5); Stripe PaymentIntent only after pharmacy selected (§1.2.9); webhook endpoint with signature verification and idempotency; transition to `Paid`; Celery jobs for PDF invoice (Rechnung) and transactional emails without PHI in body (§1.2.8); email provider integration.
- **Frontend**: **Pharmacy picker** → **checkout** (fee + treatment + pharmacy summary); Stripe Checkout or Payment Element; patient case timeline and **shipment tracking** placeholders (§1.2.7).
- **Demo**: Happy path: intake complete → pharmacy chosen → `Submitted` → payment → `Paid` with invoice artifact; failed payment leaves case in `Submitted` (§1.2.5).

#### 5.4.6 Sprint 6 (Weeks 15–16) — Doctor Workflow & Medical Decisions
- **Backend**: Queue query for `Paid` cases by specialty; `MedicalReview` claim with uniqueness on `case_id`; SLA timestamps for 72-hour alert (§1.2.6); decision endpoints with encrypted justification; rejection categories; integration with secure messaging (`CaseMessage`) minimum viable; refund request row on rejection path.
- **Frontend**: Doctor dashboard queue; case detail with immutable questionnaire snapshot; document access via short-lived URLs; decision forms with validation (minimum justification length).
- **Demo**: Doctor claims case, requests more information or rejects with category, or approves with justification; status history auditable; patient notified via email trigger (content non-PHI).

#### 5.4.7 Sprint 7 (Weeks 17–18) — Prescriptions, Partner Integration & Admin CMS
- **Backend**: `PrescriptionLine` with PZN, dosage, hash, optional FHIR JSON stub (§1.2.6); partner webhook delivery with HMAC and signed URL payload (§1.2.9); inbound status updates; `Shipment` records; Admin APIs: user suspend, manual case transition (audited), publish questionnaire and consent versions; basic KPI queries for dashboard (§1.2.10).
- **Frontend**: Minimal partner portal **or** partner-only API with documented Postman collection for MVP; Admin grids and CMS editors for forms and consents.
- **Demo**: End-to-end from approval to partner notification and status callback; admin publishes new questionnaire version without code deployment.

#### 5.4.8 Phase 2 Dependency & Sequencing Notes
- Stripe remains in **test mode** until Phase 3 exit criteria are met.
- Celery workers must be operational before invoice delivery and webhook retries are considered complete.
- Messaging can be scoped thin in Sprint 6 if schedule slips — **no** reduction of audit or decision justification requirements.

#### 5.4.9 Phase 2 “MVP Feature Complete” Checklist
- [ ] Full lifecycle §1.4 (steps 1–15) executable on Staging with test personas.
- [ ] Business rules BR-01–BR-11 enforced or explicitly waived with written risk acceptance.
- [ ] OpenAPI specification published; smoke E2E covers registration, consent, pay, doctor decision, partner callback.
- [ ] Observability: correlation IDs from API through Celery tasks (§2.9).

---

### 5.5 Phase 3 — Testing, Security & Compliance Hardening (Weeks 19–22)

**Objective**: Demonstrate that the system is **functionally correct**, **secure**, and **audit-ready** before real patient data in production.

#### 5.5.1 Test Pyramid & Scope
- **Unit**: Consent gate logic, case transition matrix, questionnaire condition engine, payment state mapping.
- **Integration**: Database transactions with `FOR UPDATE` where applicable; Stripe webhook replay; RLS policy tests per role.
- **E2E**: Playwright or Cypress against Staging — paths for approve, reject, needs more info, payment failure, consent block.
- **Exploratory**: Abuse scenarios — horizontal privilege escalation, replay of webhooks, oversized uploads, malformed JSON schema submissions.

#### 5.5.2 Security Activities
- **SAST**: `bandit`, `safety` on every build; merge blocked on new critical issues.
- **DAST**: OWASP ZAP scheduled against Staging release candidates.
- **External penetration test**: Scoped to patient and doctor portals, APIs, file handling, and admin; critical and high findings remediated before go-live.

#### 5.5.3 Privacy & Compliance Pack
- **DPIA**: Final version reflecting actual flows, subprocessors, and residual risks.
- **Records of processing (Art. 30)**: Updated for the live configuration.
- **GDPR export and erasure**: Dry-run of `POST /api/v1/users/export` and anonymisation job on Staging (§2.6.2).
- **Medical retention**: Alignment with §630f BGB — flags and admin review for archival, not silent delete (§3.13).

#### 5.5.4 Performance & Operational Readiness (MVP Level)
- Verify connection pool sizing under expected pilot load; validate Celery queue depth alerts; document rollback procedure for bad deployment (§2.8).

#### 5.5.5 Phase 3 Exit Criteria
- Zero open **critical** and **high** security defects; medium/low items triaged with owner and date.
- E2E suite green on Staging; PO sign-off on clinical journeys.
- DPO or legal **conditional** approval for pilot, or documented residual risks accepted by executive sponsor.

---

### 5.6 Phase 4 — Pilot Launch & Hypercare (Weeks 23–26)

**Objective**: Transition to **controlled production** use with **reliability targets** and **rapid response** to incidents.

#### 5.6.1 Pre-Launch (Week 23)
- Production Key Vault secrets; Stripe **live** keys; email domain SPF, DKIM, DMARC aligned.
- Runbooks: rollback via Container Apps revision; database migration forward-only policy; Stripe webhook replay procedure.
- Monitoring dashboards: HTTP 5xx rate, p95 latency, Celery queue depth, Stripe webhook error count (§2.9).
- Support model: severity definitions (e.g. P1 payment or auth down, P2 single doctor blocked).

#### 5.6.2 Soft Launch (Weeks 24–25)
- **Cohort**: Limited patients, onboarded doctors, **one** pharmacy partner; optional feature flags for gradual enablement.
- **Operational**: Daily metrics review — funnel from registration to paid case, doctor time-to-decision, partner SLA.
- **Feedback**: Structured interviews with doctors and support tickets categorised.

#### 5.6.3 Hypercare (Week 26 and beyond)
- Reserved engineering capacity for **same-day** fixes for P1 issues; twice-daily sync during first week.
- **Bug budget**: Compliance and data-integrity defects override cosmetic backlog.

#### 5.6.4 Handover to Sustaining Engineering
- Post-pilot backlog: video consultation completion, additional partners, Gematik production integration, SGB V billing — prioritised by regulation and revenue.

---

### 5.7 Milestone Summary

| Milestone | Target (relative) | Evidence |
| :--- | :--- | :--- |
| **M1 — Backlog & Staging** | End Week 4 | Staging live, backlog agreed, designs approved |
| **M2 — Auth & Audit** | End Week 8 | Login, 2FA for doctors, audit coverage for mutations |
| **M3 — Intake** | End Week 12 | Consent gate, questionnaire, uploads, hard stops |
| **M4 — Monetised case** | End Week 14 | Stripe live path on Staging, case reaches `Paid` |
| **M5 — Clinical path** | End Week 16 | Claim, decision, prescription record |
| **M6 — MVP feature complete** | End Week 18 | Partner webhook and admin CMS |
| **M7 — Release candidate** | End Week 22 | Security and E2E sign-off |
| **M8 — Pilot live** | Week 24–25 | Production traffic within cohort limits |

---

### 5.8 Dependencies, Assumptions & Out-of-Scope Reminders

**External dependencies**
- Client: timely legal review of consent texts, privacy policy, and pilot terms.
- Pharmacy partner: stable webhook URL, TLS, test and production IP allowlists if used.
- Vendors: Stripe account verification, Azure subscription quotas, email sending limits.

**Assumptions**
- Team availability per §6 (1 PM + 4 devs, ~3 months); key-person absence extends the calendar.
- German-language UI may be phased: copy freeze dates must align with sprint boundaries.

**Post-MVP unless formally in scope**
- Full **video consultation** workflow beyond status placeholder.
- **Gematik/TI** production eRezept dispatch.
- Multi-partner marketplace and **SGB V** billing integration.

---

### 5.9 Risk Register (Delivery-Focused)

| ID | Risk | Likelihood | Impact | Mitigation |
| :--- | :--- | :--- | :--- | :--- |
| R-D1 | Delay in legal approval of consent copy | Medium | High | Build against Staging with placeholders; block production go-live only |
| R-D2 | Stripe webhook delivery or signature issues | Medium | High | Idempotent handlers, dead-letter queue, alerting, manual admin replay tool |
| R-D3 | Scope creep into automated clinical suggestions | Low | Critical | Enforce §1.1.1 in architecture review; reject non-compliant stories |
| R-D4 | Doctor queue starvation or SLA breaches | Medium | Medium | Alerts at 72 hours; admin reassignment path; pilot with committed doctors |
| R-D5 | Single partner outage or integration bugs | Medium | High | Admin escalation; partner issue flags (§1.2.9); second partner on roadmap |

---

## 6. Time and Cost Estimation

**Currency:** United States Dollar (USD), excluding sales tax unless stated.

### Labour budget (man-hours)

| Assumption | Value |
| :--- | :--- |
| **Team** | 1 Product Manager + 4 developers = **5** people |
| **Duration** | **3** months |
| **Billable hours** | **170** h per month per person |

**Total man-hours:** 5 × 3 × 170 = **2,550 h** (equivalently **15** person-months × 170 h)

**Rate:** **$20 / h** (blended planning rate).

**Total labour cost:** 2,550 h × $20/h = **$51,000 USD**


---

### Not included in the figures above

- **Sales tax / taxes** and accounting treatment
- **External** penetration testing, security audit, or specialised legal / DPIA review
- **Gematik / TI** or other certification fees
- **Cloud and infrastructure** (Azure, domains, etc.) — typically **$550–$1,300+ / month** in production depending on scale (see §2.7)
- **Third-party usage:** Stripe fees, email/SMS providers, virus-scanning costs
- **Ongoing support** after go-live (retainer or ad-hoc)
- **Travel**, **hardware**, **marketing**, **clinical** operations (e.g. doctors’ fees), **pharmacy** stock
