import { useState } from 'react';
import { User } from '../App';
import { PatientRegistrationFlow } from './PatientRegistrationFlow';
import { LandingPage } from './LandingPage';
import { PreAuthIntakeWizard } from './PreAuthIntakeWizard';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS: User[] = [
  {
    id: 'patient-1',
    email: 'patient@example.com',
    name: 'Sarah Miller',
    role: 'patient',
  },
  {
    id: 'doctor-1',
    email: 'doctor@example.com',
    name: 'Dr. Michael Chen',
    role: 'doctor',
  },
  {
    id: 'pharmacy-1',
    email: 'pharmacy@example.com',
    name: 'MedCare Pharmacy',
    role: 'pharmacy',
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
];

type AuthScreen = 'landing' | 'intake' | 'register' | 'login';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [screen, setScreen] = useState<AuthScreen>('landing');

  if (screen === 'register') {
    return (
      <PatientRegistrationFlow
        onRegistered={onLogin}
        onBackToIntake={() => setScreen('intake')}
        onBackToLanding={() => setScreen('landing')}
        onSelectSignIn={() => setScreen('login')}
      />
    );
  }

  if (screen === 'intake') {
    return (
      <PreAuthIntakeWizard
        onComplete={() => setScreen('register')}
        onBack={() => setScreen('landing')}
      />
    );
  }

  if (screen === 'landing') {
    return (
      <LandingPage
        onSelectSignIn={() => setScreen('login')}
        onContinueToIntake={() => setScreen('intake')}
      />
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = MOCK_USERS.find((u) => u.email === email);
    if (user && password) {
      onLogin(user);
    } else {
      setError('Invalid email or password');
    }
  };

  const handleQuickLogin = (user: User) => {
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#5B6FF8] rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">MediConnect</h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign in to access your account
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B6FF8] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#5B6FF8] text-white font-medium py-2.5 rounded-lg hover:bg-[#4A5FE7] transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              New patient?{' '}
              <button
                type="button"
                onClick={() => setScreen('landing')}
                className="text-[#5B6FF8] font-medium hover:underline"
              >
                Start on the home page
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setScreen('landing')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to landing
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-3 font-medium uppercase tracking-wide">
              Quick Login (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900 capitalize">
                    {user.role}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {user.email}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Demo Platform - GDPR Compliant Telemedicine
        </p>
      </div>
    </div>
  );
}
