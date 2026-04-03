import { useState } from 'react';
import { User } from '../App';
import { Eye, EyeOff, CheckCircle, Shield, ChevronRight, ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import { getIntakeSession, getTreatmentById, hasPreAuthFullIntakeComplete } from '../lib/intakeSession';

type BlockReason = 'none' | 'no-intake' | 'no-full-intake';

function getInitialBlockReason(): BlockReason {
  const i = getIntakeSession();
  if (!i) return 'no-intake';
  if (!hasPreAuthFullIntakeComplete()) return 'no-full-intake';
  return 'none';
}

interface PatientRegistrationFlowProps {
  onRegistered: (user: User) => void;
  /** Return to pre-auth intake (questionnaire → documents → payment → review). */
  onBackToIntake: () => void;
  /** Return to public landing (step 1). */
  onBackToLanding: () => void;
  /** Open sign-in form (existing users). */
  onSelectSignIn: () => void;
}

type Step = 'credentials' | 'doi' | 'profile' | 'age' | 'ready';

export function PatientRegistrationFlow({
  onRegistered,
  onBackToIntake,
  onBackToLanding,
  onSelectSignIn,
}: PatientRegistrationFlowProps) {
  const [step, setStep] = useState<Step>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [blockReason] = useState<BlockReason>(getInitialBlockReason);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    ageConfirmed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const intake = getIntakeSession();
  const treatment = intake ? getTreatmentById(intake.treatmentId) : undefined;

  const steps: { id: Step; label: string }[] = [
    { id: 'credentials', label: 'Account' },
    { id: 'doi', label: 'Verify email' },
    { id: 'profile', label: 'Profile' },
    { id: 'age', label: 'Age' },
    { id: 'ready', label: 'Done' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const handleCredentials = () => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 12) e.password = 'Minimum 12 characters required';
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password))
      e.password = 'Must include uppercase, lowercase, number and symbol';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep('doi');
  };

  const handleSimulateEmailVerified = () => {
    setStep('profile');
  };

  const handleProfile = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!formData.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) e.address = 'Address is required';
    if (!formData.city.trim()) e.city = 'City is required';
    if (!formData.postalCode.trim()) e.postalCode = 'Postal code is required';
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep('age');
  };

  const handleAge = () => {
    if (!formData.ageConfirmed) {
      setErrors({ age: 'You must confirm you are 18 or older to continue.' });
      return;
    }
    setErrors({});
    setStep('ready');
  };

  const handleComplete = () => {
    const newUser: User = {
      id: `patient-${Date.now()}`,
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      role: 'patient',
    };
    onRegistered(newUser);
  };

  if (blockReason !== 'none' && step === 'credentials') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">
              {blockReason === 'no-intake' ? 'Choose a treatment first' : 'Complete pre-account intake first'}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {blockReason === 'no-intake'
                ? 'Select a treatment from the catalog on the home page to start your intake (§1.2.1).'
                : 'Finish questionnaire, documents, payment, and review before creating your account so your case can be bound to your profile.'}
            </p>
            <button
              type="button"
              onClick={blockReason === 'no-intake' ? onBackToLanding : onBackToIntake}
              className="mt-6 w-full bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors"
            >
              {blockReason === 'no-intake' ? 'Back to home' : 'Back to intake'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#5B6FF8] rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">MediConnect</h1>
          </div>

          <p className="text-sm font-medium text-[#5B6FF8] mb-1">Step 6 of 6 · Account</p>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h2>
          <p className="text-sm text-gray-600 mb-4">Treatment choice, intake progress, documents, and payment demo from this session attach to your new intake (questionnaire answers are not stored in the browser)</p>

          {treatment && step === 'credentials' && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <span className="font-medium">Treatment:</span> {treatment.title}
              <span className="text-blue-800 block text-xs mt-1 font-medium">Pre-account intake completed (questionnaire, documents, payment)</span>
              <span className="text-blue-700 block text-xs mt-1">Intake token stored for this session · profile fields encrypted at rest after verification</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center w-full">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all shrink-0 ${
                      index < currentStepIndex
                        ? 'bg-[#5B6FF8] text-white'
                        : index === currentStepIndex
                        ? 'bg-[#5B6FF8] text-white ring-4 ring-blue-100'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 font-medium text-center truncate w-full ${
                      index === currentStepIndex ? 'text-[#5B6FF8]' : index < currentStepIndex ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 shrink min-w-[8px] ${index < currentStepIndex ? 'bg-[#5B6FF8]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {step === 'credentials' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.de"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Min. 12 characters"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Minimum 12 characters; uppercase, lowercase, number and symbol</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] pr-10 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
              <p className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg border border-gray-100">
                Account is created with <strong className="text-gray-800">is_active: false</strong> until you confirm your email (double opt-in). Mandatory consents are collected after you sign in.
              </p>
              <button type="button" onClick={handleCredentials} className="w-full bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onBackToIntake}
                className="w-full text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                ← Back to intake review
              </button>
            </div>
          )}

          {step === 'doi' && (
            <div className="space-y-6">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#5B6FF8]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm your email</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We sent a double opt-in link to <strong>{formData.email}</strong>. The link expires in <strong>24 hours</strong>.
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                Your account stays inactive until you click the link. After verification, you will complete your profile and age confirmation.
              </div>
              <button
                type="button"
                onClick={handleSimulateEmailVerified}
                className="w-full bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors"
              >
                Simulate email verified (demo)
              </button>
              <button type="button" onClick={() => setStep('credentials')} className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" /> Back to credentials
              </button>
            </div>
          )}

          {step === 'profile' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Legal name, date of birth, and address — encrypted at rest in production.</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.dateOfBirth && <p className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Street address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Musterstraße 1"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Berlin"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    placeholder="10115"
                    className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.postalCode && <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+49 30 12345678"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8]"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('doi')} className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={handleProfile} className="flex-1 bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'age' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-[#5B6FF8]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Age verification</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Patients must confirm they are 18 or older. Minors would require guardian consent (not in MVP).
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
                    <p className="font-medium">Important</p>
                    <p className="mt-1">If you are under 18, please consult a doctor in person.</p>
                  </div>
                </div>
              </div>
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#5B6FF8] cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={formData.ageConfirmed}
                  onChange={(e) => {
                    updateField('ageConfirmed', e.target.checked);
                    setErrors({});
                  }}
                  className="w-5 h-5 text-[#5B6FF8] rounded mt-0.5"
                />
                <span className="text-sm text-gray-900">
                  I confirm that I am <strong>18 years of age or older</strong> and that the information I provide is accurate.
                </span>
              </label>
              {errors.age && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.age}
                </p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('profile')} className="flex items-center gap-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={handleAge} className="flex-1 bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 'ready' && (
            <div className="space-y-6 text-center">
              <div className="py-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Onboarding complete</h3>
                <p className="text-sm text-gray-600 mt-2">
                  You can sign in to complete mandatory consents and continue your case for <strong>{treatment?.title ?? 'your treatment'}</strong>. Your treatment and intake progress from this session carry forward; complete or re-enter the questionnaire in the portal as prompted.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Next steps</h4>
                <ul className="text-sm text-blue-800 space-y-1.5">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Sign in to the patient portal</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Accept required consent documents</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0" /> Upload documents, pharmacy & payment as prompted</li>
                </ul>
              </div>
              <button type="button" onClick={handleComplete} className="w-full bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors">
                Continue to platform (demo)
              </button>
            </div>
          )}

          {step !== 'ready' && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button type="button" onClick={onSelectSignIn} className="text-[#5B6FF8] font-medium hover:underline">
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
