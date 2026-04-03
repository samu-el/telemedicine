import { Shield, Lock, FileCheck, ChevronRight, Stethoscope, HeartPulse, Leaf } from 'lucide-react';
import {
  TREATMENT_CATALOG,
  type TreatmentCatalogItem,
  setIntakeSession,
  type TreatmentId,
} from '../lib/intakeSession';

interface LandingPageProps {
  onSelectSignIn: () => void;
  /** After choosing a treatment, continue to pre-account intake (questionnaire → documents → payment → review). */
  onContinueToIntake: () => void;
}

function treatmentIcon(t: TreatmentCatalogItem) {
  switch (t.id) {
    case 'hair-loss':
      return <Stethoscope className="w-7 h-7 text-[#5B6FF8]" />;
    case 'contraception':
      return <HeartPulse className="w-7 h-7 text-[#5B6FF8]" />;
    default:
      return <Leaf className="w-7 h-7 text-[#5B6FF8]" />;
  }
}

export function LandingPage({ onSelectSignIn, onContinueToIntake }: LandingPageProps) {
  const handleChooseTreatment = (item: TreatmentCatalogItem) => {
    const anonymousIntakeToken =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `intake-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setIntakeSession({
      treatmentId: item.id as TreatmentId,
      specialty: item.specialty,
      anonymousIntakeToken,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B6FF8] rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">MediConnect</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelectSignIn}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('treatments')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 text-sm font-medium bg-[#5B6FF8] text-white rounded-lg hover:bg-[#4A5FE7] transition-colors"
            >
              Choose treatment
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-4 pt-12 pb-10 md:pt-16 md:pb-14">
          <p className="text-sm font-medium text-[#5B6FF8] mb-3">German telemedicine · GDPR-first</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight max-w-2xl">
            Licensed remote care — structured intake, doctor review, pharmacy fulfilment
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            MediConnect is a workflow platform: we do not automate medical decisions. Choose a treatment path below,
            Complete intake (questionnaire, documents, and payment), then create an account so your case is bound to a verified identity.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#treatments"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5B6FF8] text-white font-medium rounded-lg hover:bg-[#4A5FE7] transition-colors"
            >
              Browse treatments <ChevronRight className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onSelectSignIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-800 font-medium rounded-lg hover:bg-white transition-colors"
            >
              Already registered? Sign in
            </button>
          </div>
        </section>

        <section className="bg-white border-y border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Trust & compliance</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#5B6FF8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">No automated decisions</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    The platform routes data to licensed physicians; it does not replace clinical judgement.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-[#5B6FF8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Art. 9 GDPR & encryption</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Health data is special-category data; we design for explicit consent and secure processing.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-[#5B6FF8]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Documentation (§630f BGB)</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Records are retained according to applicable medical documentation rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="treatments" className="max-w-6xl mx-auto px-4 py-14 scroll-mt-24">
          <h2 className="text-2xl font-semibold text-gray-900">Treatment catalog</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Select one treatment (MVP: single path), then complete the full intake flow before account creation. Your data
            stays in this browser session until you register on the final step (demo checkout is non-binding until verified).
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TREATMENT_CATALOG.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col hover:border-[#5B6FF8]/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {treatmentIcon(item)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2 flex-1">{item.shortDescription}</p>
                <p className="text-sm font-medium text-gray-900 mt-4">{item.priceRangeFrom}</p>
                <p className="text-xs text-gray-500 mt-1">{item.eligibilityHint}</p>
                <button
                  type="button"
                  onClick={() => {
                    handleChooseTreatment(item);
                    onContinueToIntake();
                  }}
                  className="mt-6 w-full py-2.5 rounded-lg bg-[#5B6FF8] text-white text-sm font-medium hover:bg-[#4A5FE7] transition-colors flex items-center justify-center gap-2"
                >
                  Start intake <ChevronRight className="w-4 h-4" />
                </button>
              </article>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-8">
            <a href="#faq" className="text-[#5B6FF8] font-medium hover:underline">
              FAQs
            </a>
            {' · '}
            Pricing shown as starting ranges; final fees depend on your case and pharmacy.
          </p>
        </section>

        <section id="faq" className="bg-gray-100 border-t border-gray-200 py-12 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-semibold text-gray-900">Common questions</h2>
            <ul className="mt-6 space-y-4 text-sm text-gray-700">
              <li>
                <strong className="text-gray-900">Why pick a treatment first?</strong>
                <p className="mt-1 text-gray-600">
                  So the questionnaire and doctor queue match your concern from the first authenticated step.
                </p>
              </li>
              <li>
                <strong className="text-gray-900">Is my data safe before I register?</strong>
                <p className="mt-1 text-gray-600">
                  Questionnaire responses are not kept in this browser; only treatment choice and intake progress (e.g.
                  documents, payment demo) may be held in session storage until you register and bind your account.
                </p>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-500">
          Demo platform — not for emergency use. In emergencies, call emergency services (e.g. 112 in Germany).
        </div>
      </footer>
    </div>
  );
}
