We are planning to build a legally compliant telemedicine platform for the German market.

The platform will connect patients, doctors, and pharmacy/fulfillment partners in a structured and fully documented digital workflow.

It is critical that the system does NOT perform any automatic medical decisions. All diagnoses, approvals, and prescriptions must be made solely by licensed doctors. The platform must technically enforce a strict separation between patient, doctor, pharmacy, and admin roles.

Based on the attached requirements, please provide:
	1.	Functional concept (product specification)
	2.	Technical architecture proposal
	3.	Data model design
	4.	Wireframes for all key user interfaces
	5.	MVP implementation roadmap
	6.	Time and cost estimation (broken down by phases)

The MVP must include:
	•	Patient registration and authentication
	•	Consent management (including versioning)
	•	Dynamic medical questionnaire with conditional logic
	•	Document upload functionality
	•	Payment integration
	•	Case management system
	•	Doctor dashboard with decision workflow (approve / reject / request more info)
	•	Pharmacy/partner status tracking
	•	Admin panel
	•	Audit logs and reporting

Please ensure the system is designed from the beginning with:
	•	strict GDPR compliance for sensitive health data
	•	full auditability and traceability
	•	versioning of medical questionnaires and consent forms
	•	scalability towards video consultations and e-prescription integrations

Kindly structure your proposal in the following phases:
Phase 1: Discovery & Planning
Phase 2: MVP Development
Phase 3: Testing & Compliance Hardening
Phase 4: Pilot Launch—

📘 2. Full IT Specification (Lastenheft – English)

⸻

1. Project Overview

The objective is to develop a legally compliant telemedicine platform for the German healthcare market.

The platform must enable:
	•	patients to submit medical requests,
	•	doctors to independently review and decide,
	•	pharmacies/partners to process fulfillment,
	•	full documentation of every step for legal and compliance purposes.

The platform acts strictly as a digital intermediary system, not a medical decision-maker.

⸻

2. Core Principles
	•	No automated medical decisions
	•	Full independence of doctors
	•	Complete auditability of all actions
	•	GDPR-compliant handling of health data
	•	Modular and scalable architecture

⸻

3. User Roles

3.1 Patient
	•	Registration & login
	•	Profile management
	•	Submit medical questionnaire
	•	Upload documents
	•	Provide consent
	•	Track case status
	•	Messaging
	•	Payment
	•	History of previous cases

⸻

3.2 Doctor
	•	Secure login (2FA recommended)
	•	Case dashboard
	•	View patient data & history
	•	Request additional information
	•	Conduct optional video consultation
	•	Make medical decision:
	•	approve
	•	reject
	•	request more information
	•	Document reasoning
	•	Generate prescription data
	•	Maintain patient records

⸻

3.3 Pharmacy / Partner
	•	Receive approved cases
	•	Update fulfillment status
	•	Provide shipment tracking
	•	Communicate issues

⸻

3.4 Admin
	•	User management
	•	Case monitoring
	•	Payment management
	•	Content management (CMS)
	•	Questionnaire management
	•	Consent management
	•	Reporting dashboard
	•	Audit logs

⸻

4. Core Workflow
	1.	Patient registers
	2.	Patient provides consent
	3.	Patient completes questionnaire
	4.	Patient uploads required documents
	5.	Patient completes payment
	6.	Case is created
	7.	Doctor reviews case
	8.	Doctor decision:
	•	approve
	•	reject
	•	request more information
	•	request video consultation
	9.	Patient is notified
	10.	If approved → case forwarded to pharmacy/partner
	11.	Fulfillment & completion
	12.	Full documentation stored

⸻

5. Functional Modules

5.1 Authentication & Security
	•	Secure login system
	•	Email verification
	•	Password reset
	•	Optional 2FA
	•	Session management

⸻

5.2 Consent Management
	•	GDPR-compliant consent collection
	•	Versioning of all consent texts
	•	Timestamp logging
	•	Mandatory before medical submission

⸻

5.3 Dynamic Questionnaire Engine
	•	Configurable form builder
	•	Conditional logic
	•	Multiple input types
	•	Versioning
	•	Mandatory fields
	•	Medical exclusion logic

⸻

5.4 Case Management System

Each submission creates a Case object.

Statuses include:
	•	Draft
	•	Submitted
	•	Paid
	•	In Review
	•	Need More Info
	•	Approved
	•	Rejected
	•	Sent to Partner
	•	Completed

⸻

5.5 Doctor Decision Module
	•	Full case visibility
	•	Structured decision workflow
	•	Mandatory justification
	•	Internal notes
	•	Attachments
	•	Templates

⸻

5.6 Communication System
	•	Patient ↔️ Doctor messaging
	•	Notifications (email)
	•	Internal notes
	•	History tracking

⸻

5.7 Video Consultation (Optional MVP+)
	•	Appointment scheduling
	•	Video session integration
	•	Session logs

⸻

5.8 Prescription / Order Module
	•	Structured prescription data
	•	Approval logging
	•	Export functionality
	•	Status tracking
	•	Future-ready for e-prescription integration

⸻

5.9 Pharmacy / Partner Module
	•	Case intake
	•	Status updates
	•	Shipment tracking
	•	Issue reporting

⸻

5.10 Payment System
	•	Service fee collection
	•	Payment status tracking
	•	Refund management
	•	Invoice generation

⸻

5.11 Admin Panel
	•	User & role management
	•	Case overview
	•	Payment dashboard
	•	CMS
	•	Questionnaire editor
	•	Consent editor
	•	Reporting

⸻

5.12 Reporting & Analytics
	•	User metrics
	•	Conversion rates
	•	Case outcomes
	•	Processing times
	•	Doctor performance
	•	System usage

⸻

6. Non-Functional Requirements

6.1 Security
	•	End-to-end encryption (TLS)
	•	Data encryption at rest
	•	Role-based access control
	•	Audit logs
	•	Secure file storage
	•	Anti-brute-force mechanisms

⸻

6.2 Data Protection (GDPR)
	•	Explicit consent management
	•	Data minimization
	•	Data deletion policies
	•	Export capability
	•	EU-based hosting preferred

⸻

6.3 Audit & Logging
	•	Immutable logs
	•	Track all actions:
	•	access
	•	changes
	•	approvals
	•	communications

⸻

6.4 Availability & Scalability
	•	High uptime
	•	Scalable architecture
	•	Load balancing
	•	Monitoring system

⸻

7. Technical Architecture

Recommended Stack:
	•	Frontend: React / Next.js
	•	Backend: Node.js (NestJS) or Python (FastAPI)
	•	Database: PostgreSQL
	•	Cache: Redis
	•	Storage: Secure object storage
	•	Auth: OAuth2 / OpenID
	•	Infrastructure: AWS / Azure / EU cloud
	•	Containerization: Docker
	•	CI/CD: GitHub Actions or GitLab CI

⸻

8. Data Model (Core Entities)
	•	User
	•	Role
	•	PatientProfile
	•	DoctorProfile
	•	Partner (Pharmacy)
	•	Consent + ConsentVersion
	•	Questionnaire + Version
	•	Response
	•	Case
	•	CaseStatusHistory
	•	MedicalReview
	•	Decision
	•	PrescriptionRecord
	•	Appointment
	•	Message
	•	Attachment
	•	Payment
	•	Invoice
	•	ShipmentStatus
	•	AuditLog

⸻

9. API Requirements
	•	REST API (preferred)
	•	Role-based access control
	•	Versioned endpoints
	•	Swagger/OpenAPI documentation
	•	Secure authentication
	•	Logging of all mutations

⸻

10. MVP Scope

Must include:
	•	Patient onboarding
	•	Questionnaire
	•	Case management
	•	Doctor dashboard
	•	Decision workflow
	•	Messaging
	•	Payment
	•	Admin panel
	•	Audit logs

⸻

11. Project Phases

Phase 1 – Discovery
Phase 2 – MVP Development
Phase 3 – Testing & Compliance
Phase 4 – Pilot Launch

⸻

12. Deliverables

The IT company must deliver:
	•	Functional specification
	•	Technical architecture
	•	Database schema
	•	API documentation
	•	Deployment guide
	•	Security concept
	•	Test documentation
	•	Go-live checklist