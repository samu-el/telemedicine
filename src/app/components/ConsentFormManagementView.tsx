import { useState } from 'react';
import { User } from '../App';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  Eye,
  FileText,
  CheckCircle,
  Clock,
  Shield,
} from 'lucide-react';

interface ConsentFormManagementViewProps {
  user: User;
  onBack: () => void;
}

interface ConsentForm {
  id: string;
  name: string;
  version: string;
  category: 'privacy' | 'medical' | 'data' | 'terms';
  content: string;
  active: boolean;
  mandatory: boolean;
  createdAt: string;
  lastUpdated: string;
  acceptances: number;
}

export function ConsentFormManagementView({ user, onBack }: ConsentFormManagementViewProps) {
  const [consentForms, setConsentForms] = useState<ConsentForm[]>([
    {
      id: '1',
      name: 'Privacy Policy',
      version: 'v2.1',
      category: 'privacy',
      active: true,
      mandatory: true,
      createdAt: '2025-11-15',
      lastUpdated: '2026-03-01',
      acceptances: 1247,
      content: `# Privacy Policy

## 1. Introduction
MediConnect ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our telemedicine platform.

## 2. Information We Collect
### Personal Information
- Name, email address, and contact details
- Date of birth and gender
- Medical history and health information
- Payment and billing information
- Government-issued identification documents

### Automatically Collected Information
- IP address and device information
- Browser type and operating system
- Usage data and interaction patterns
- Cookies and similar tracking technologies

## 3. How We Use Your Information
We use your information to:
- Provide and improve our telemedicine services
- Process consultations and prescriptions
- Communicate with you about your account and services
- Comply with legal and regulatory requirements
- Prevent fraud and ensure platform security

## 4. Data Sharing and Disclosure
We may share your information with:
- Healthcare providers for consultation and treatment
- Pharmacies for prescription fulfillment
- Payment processors for billing services
- Legal authorities when required by law

We do NOT sell your personal information to third parties.

## 5. Data Security
We implement industry-standard security measures including:
- End-to-end encryption for sensitive data
- Secure data storage in GDPR-compliant facilities
- Regular security audits and assessments
- Access controls and authentication protocols

## 6. Your Rights (GDPR)
Under GDPR, you have the right to:
- Access your personal data
- Rectify inaccurate information
- Request data deletion ("right to be forgotten")
- Object to data processing
- Data portability
- Withdraw consent at any time

## 7. Data Retention
We retain your data for:
- Active accounts: Duration of account plus 7 years (legal requirement)
- Inactive accounts: 3 years, then archived or deleted
- Medical records: 10 years (regulatory requirement)

## 8. International Data Transfers
Your data may be transferred to and processed in countries outside the EU. We ensure appropriate safeguards are in place through:
- Standard Contractual Clauses (SCCs)
- Adequacy decisions by the European Commission
- Binding Corporate Rules (BCRs)

## 9. Children's Privacy
Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children.

## 10. Changes to This Policy
We may update this Privacy Policy periodically. We will notify you of significant changes via email or platform notification.

## 11. Contact Information
For privacy-related questions or to exercise your rights:
- Email: privacy@mediconnect.de
- Address: MediConnect GmbH, Friedrichstrasse 123, 10117 Berlin, Germany
- Data Protection Officer: dpo@mediconnect.de

Last Updated: March 1, 2026`,
    },
    {
      id: '2',
      name: 'Terms of Service',
      version: 'v1.8',
      category: 'terms',
      active: true,
      mandatory: true,
      createdAt: '2025-10-01',
      lastUpdated: '2026-02-15',
      acceptances: 1247,
      content: `# Terms of Service

## 1. Acceptance of Terms
By accessing and using MediConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations.

## 2. Service Description
MediConnect provides a telemedicine platform connecting patients with licensed healthcare providers for remote consultations, diagnosis, and treatment.

## 3. User Accounts
### Registration
- You must provide accurate and complete information
- You are responsible for maintaining account security
- You must be at least 18 years old to create an account
- One person per account; no account sharing

### Account Termination
We reserve the right to suspend or terminate accounts that:
- Violate these terms
- Engage in fraudulent activity
- Misuse the platform or services

## 4. User Responsibilities
You agree to:
- Provide truthful and accurate medical information
- Follow prescribed treatment plans
- Respect healthcare providers and staff
- Use the platform only for legitimate medical purposes
- Not share prescription medications with others

## 5. Healthcare Services
### Limitations
- Emergency services: This is NOT an emergency service. Call 112 for emergencies.
- Diagnosis limitations: Some conditions require in-person examination
- Prescription restrictions: Controlled substances may have additional requirements
- Geographic restrictions: Services available only in Germany

### Provider Relationship
- Healthcare providers are independent professionals
- MediConnect facilitates but does not provide medical care
- Provider-patient relationship is established directly
- Final treatment decisions rest with the healthcare provider

## 6. Fees and Payment
- Consultation fees are displayed before booking
- Payment is required before consultation
- Refunds are subject to our refund policy
- We reserve the right to change fees with notice

## 7. Intellectual Property
All content, trademarks, and intellectual property on the platform are owned by MediConnect or licensed to us.

## 8. Limitation of Liability
MediConnect is not liable for:
- Medical outcomes or treatment results
- Provider negligence or malpractice
- Technical issues or service interruptions
- Lost data or communications

## 9. Dispute Resolution
Disputes will be resolved through:
1. Good faith negotiation
2. Mediation (if negotiation fails)
3. Arbitration in Berlin, Germany
4. German law applies to all disputes

## 10. Modifications
We may modify these terms at any time. Continued use constitutes acceptance of modified terms.

## 11. Contact
For questions about these terms:
Email: legal@mediconnect.de

Last Updated: February 15, 2026`,
    },
    {
      id: '3',
      name: 'Medical Consent',
      version: 'v3.0',
      category: 'medical',
      active: true,
      mandatory: true,
      createdAt: '2025-09-01',
      lastUpdated: '2026-03-10',
      acceptances: 1247,
      content: `# Medical Consent Form

## Consent for Telemedicine Services

I hereby consent to participate in telemedicine consultations with healthcare providers through the MediConnect platform.

## Understanding of Telemedicine

I understand that:
- Telemedicine involves the use of electronic communications for medical consultations
- The consultation will be conducted via secure video, audio, or messaging
- The same standards of care apply as in-person consultations
- A physical examination may not be possible through telemedicine

## Benefits and Risks

### Benefits
- Convenient access to healthcare from home
- Reduced travel time and costs
- Access to specialists who may not be locally available
- Continuity of care

### Risks
- Technical difficulties may interrupt consultations
- Some conditions cannot be adequately assessed remotely
- Emergency situations require in-person care
- Technology failures may delay care

## Privacy and Security

I understand that:
- Consultations are conducted through secure, encrypted channels
- My medical information will be kept confidential per GDPR and medical privacy laws
- Electronic records will be maintained securely
- I should ensure privacy during video consultations

## Medical Information

I consent to:
- Share my complete medical history with healthcare providers
- Provide accurate information about symptoms and conditions
- Follow up as recommended by the provider
- Inform the provider of any allergies or adverse reactions

## Limitations

I understand that telemedicine has limitations:
- Not suitable for medical emergencies (call 112)
- Physical examination may be required for certain conditions
- Laboratory tests or imaging may be needed
- In-person follow-up may be recommended

## Prescriptions

I understand that:
- Prescriptions will be issued at the provider's discretion
- Some medications cannot be prescribed via telemedicine
- Controlled substances have additional requirements
- I must use prescriptions as directed

## Right to Withdraw

I may:
- Decline to participate at any time
- Request an in-person consultation instead
- Ask questions about the telemedicine process
- Discontinue the consultation if uncomfortable

## Payment Responsibility

I understand that:
- I am responsible for consultation fees
- Insurance coverage may vary for telemedicine
- Payment is required before service delivery

## Consent Confirmation

By accepting this consent form, I confirm that:
- I have read and understood this consent
- I have had the opportunity to ask questions
- I voluntarily consent to telemedicine services
- I understand the benefits and risks involved

## Emergency Protocol

In case of emergency:
- End the telemedicine consultation immediately
- Call 112 or go to the nearest emergency department
- Inform emergency services of your condition

For urgent but non-emergency situations:
- Contact your primary care physician
- Visit an urgent care facility
- Call the MediConnect support line

Last Updated: March 10, 2026`,
    },
    {
      id: '4',
      name: 'Data Processing Agreement',
      version: 'v2.5',
      category: 'data',
      active: true,
      mandatory: true,
      createdAt: '2025-11-20',
      lastUpdated: '2026-02-28',
      acceptances: 1247,
      content: `# Data Processing Agreement

## GDPR Compliance Notice

This Data Processing Agreement ("DPA") outlines how MediConnect processes your personal data in compliance with the General Data Protection Regulation (GDPR).

## 1. Definitions

**Personal Data**: Any information relating to an identified or identifiable natural person.

**Processing**: Any operation performed on personal data, including collection, storage, use, disclosure, or deletion.

**Data Controller**: MediConnect GmbH, who determines the purposes and means of processing.

**Data Subject**: You, the individual whose personal data is being processed.

## 2. Lawful Basis for Processing

We process your data under the following legal bases:
- **Consent**: You have given explicit consent (e.g., creating an account)
- **Contract**: Processing is necessary to fulfill our service agreement
- **Legal Obligation**: Compliance with healthcare and medical record regulations
- **Legitimate Interest**: Fraud prevention and platform security
- **Vital Interest**: Emergency medical situations

## 3. Data We Process

### Categories of Personal Data
- Identity data (name, date of birth)
- Contact data (email, phone number)
- Health data (medical history, symptoms, diagnoses)
- Financial data (payment information)
- Technical data (IP address, login data)
- Usage data (consultation history, platform interactions)

### Special Categories (Sensitive Data)
Health information is considered a special category under GDPR and receives enhanced protection.

## 4. Purpose of Processing

We process your data for:
- Providing telemedicine consultations
- Managing your account and profile
- Processing payments and billing
- Communicating about services
- Improving platform functionality
- Compliance with legal requirements
- Preventing fraud and abuse

## 5. Data Recipients

Your data may be shared with:
- **Healthcare Providers**: Licensed doctors who provide consultations
- **Pharmacies**: For prescription fulfillment
- **Payment Processors**: Stripe, PayPal (payment processing only)
- **Cloud Providers**: AWS, Microsoft Azure (secure data storage)
- **Legal Authorities**: When required by law

## 6. Data Retention Periods

- **Active accounts**: Data retained while account is active
- **Medical records**: 10 years (legal requirement for healthcare providers)
- **Billing records**: 7 years (tax and accounting requirements)
- **Marketing data**: Until consent is withdrawn
- **Backup data**: 90 days in secure backups

## 7. Your Rights Under GDPR

### Right to Access
Request a copy of all personal data we hold about you.

### Right to Rectification
Correct inaccurate or incomplete data.

### Right to Erasure ("Right to be Forgotten")
Request deletion of your data (subject to legal retention requirements).

### Right to Restriction
Limit how we process your data in certain circumstances.

### Right to Data Portability
Receive your data in a structured, machine-readable format.

### Right to Object
Object to processing based on legitimate interest or direct marketing.

### Right to Withdraw Consent
Withdraw consent at any time (doesn't affect prior lawful processing).

### Right to Lodge a Complaint
File a complaint with the German data protection authority (BfDI).

## 8. Exercising Your Rights

To exercise your rights:
- Email: privacy@mediconnect.de
- Online: Use the "Privacy Settings" in your account
- Response time: Within 30 days of request

## 9. Data Security Measures

We implement:
- **Encryption**: AES-256 for data at rest, TLS 1.3 for data in transit
- **Access Controls**: Role-based access, multi-factor authentication
- **Monitoring**: 24/7 security monitoring and intrusion detection
- **Auditing**: Regular security audits and penetration testing
- **Training**: Staff training on data protection practices

## 10. Data Breach Notification

In case of a data breach:
- We will notify the supervisory authority within 72 hours
- You will be informed if the breach poses a high risk to your rights
- We will document all breaches and response measures

## 11. International Transfers

Data may be transferred outside the EU to:
- United States (under EU-US Data Privacy Framework)
- Other countries with adequate protection (per EU Commission)
- Countries with Standard Contractual Clauses in place

## 12. Automated Decision-Making

We do NOT use automated decision-making or profiling that produces legal or significant effects on you without human oversight.

## 13. Children's Data

We do not knowingly process data of individuals under 18 years of age.

## 14. Updates to This Agreement

We may update this DPA to reflect:
- Changes in data processing practices
- Legal or regulatory requirements
- Service improvements

You will be notified of material changes.

## 15. Contact Information

**Data Controller**:
MediConnect GmbH
Friedrichstrasse 123
10117 Berlin, Germany

**Data Protection Officer**:
Email: dpo@mediconnect.de
Phone: +49 30 1234 5678

**Supervisory Authority**:
Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)
Graurheindorfer Str. 153
53117 Bonn, Germany

Last Updated: February 28, 2026`,
    },
  ]);

  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const handleSelectForm = (form: ConsentForm) => {
    setSelectedForm(form);
    setEditedContent(form.content);
    setIsEditing(false);
    setIsPreview(false);
  };

  const handleSaveChanges = () => {
    if (!selectedForm) return;

    const updatedForm = {
      ...selectedForm,
      content: editedContent,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setConsentForms(
      consentForms.map((form) => (form.id === selectedForm.id ? updatedForm : form))
    );
    setSelectedForm(updatedForm);
    setIsEditing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'privacy':
        return 'bg-blue-50 text-blue-700';
      case 'medical':
        return 'bg-green-50 text-green-700';
      case 'data':
        return 'bg-purple-50 text-purple-700';
      case 'terms':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy':
      case 'data':
        return <Shield className="w-4 h-4" />;
      case 'medical':
        return <FileText className="w-4 h-4" />;
      case 'terms':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (selectedForm) {
    return (
      <div className="p-6">
        <button
          onClick={() => {
            setSelectedForm(null);
            setIsEditing(false);
            setIsPreview(false);
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Consent Forms
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{selectedForm.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedForm.category)}`}>
                  {getCategoryIcon(selectedForm.category)}
                  {selectedForm.category.charAt(0).toUpperCase() + selectedForm.category.slice(1)}
                </span>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {selectedForm.version}
                </span>
                {selectedForm.active && (
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Active
                  </span>
                )}
                {selectedForm.mandatory && (
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                    Mandatory
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isPreview
                        ? 'bg-[#5B6FF8] text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    {isPreview ? 'Viewing Preview' : 'Preview'}
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Content
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(selectedForm.content);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1">Acceptances</p>
              <p className="text-2xl font-semibold text-gray-900">{selectedForm.acceptances.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1">Created</p>
              <p className="text-sm text-gray-900">{selectedForm.createdAt}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm text-gray-900">{selectedForm.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          {isEditing ? (
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Content (Markdown)
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent font-mono text-sm"
                placeholder="Enter consent form content in Markdown format..."
              />
            </div>
          ) : (
            <div className="p-8">
              <div className="prose prose-sm max-w-none">
                {editedContent.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-6">
                        {line.replace('# ', '')}
                      </h1>
                    );
                  } else if (line.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-semibold text-gray-900 mb-3 mt-5">
                        {line.replace('## ', '')}
                      </h2>
                    );
                  } else if (line.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-lg font-semibold text-gray-900 mb-2 mt-4">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  } else if (line.startsWith('- ')) {
                    return (
                      <li key={index} className="text-gray-700 ml-4">
                        {line.replace('- ', '')}
                      </li>
                    );
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={index} className="font-semibold text-gray-900 mb-2">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  } else if (line.trim() === '') {
                    return <div key={index} className="h-2" />;
                  } else {
                    return (
                      <p key={index} className="text-gray-700 mb-2">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Content Management
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Consent Forms</h1>
        <p className="text-sm text-gray-600 mt-1">
          Edit legal consent templates and privacy policies
        </p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">GDPR Compliance</h3>
            <p className="text-sm text-blue-800">
              All consent forms must comply with GDPR requirements. Changes to mandatory forms will
              require users to re-accept upon next login. Consult with legal counsel before making
              significant modifications.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {consentForms.map((form) => (
          <div
            key={form.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleSelectForm(form)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(form.category)}`}>
                    {getCategoryIcon(form.category)}
                    {form.category.charAt(0).toUpperCase() + form.category.slice(1)}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {form.version}
                  </span>
                  {form.active && (
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  )}
                  {form.mandatory && (
                    <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                      Mandatory
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Acceptances</span>
                <span className="font-medium text-gray-900">
                  {form.acceptances.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-gray-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {form.lastUpdated}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">{form.createdAt}</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-[#5B6FF8] text-white text-sm font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors">
              Edit Form
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
