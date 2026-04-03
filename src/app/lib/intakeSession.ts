import type { SpecialtyType } from '../components/DynamicQuestionnaire';

const STORAGE_KEY = 'mediconnect_intake_v1';

export type TreatmentId = 'hair-loss' | 'contraception' | 'allergy-assessment';

export interface TreatmentCatalogItem {
  id: TreatmentId;
  title: string;
  shortDescription: string;
  specialty: Exclude<SpecialtyType, null>;
  priceRangeFrom: string;
  eligibilityHint: string;
}

/** Treatment types aligned with §1.2.3 (examples) and mapped to questionnaire specialties. */
export const TREATMENT_CATALOG: TreatmentCatalogItem[] = [
  {
    id: 'hair-loss',
    title: 'Hair Loss Treatment',
    shortDescription:
      'Telemedicine assessment for androgenetic alopecia and related hair concerns.',
    specialty: 'dermatology',
    priceRangeFrom: 'From €29',
    eligibilityHint: 'Adults 18+; not for acute scalp infection without prior diagnosis.',
  },
  {
    id: 'contraception',
    title: 'Contraception Consultation',
    shortDescription:
      'Review suitable options with a licensed physician where remote care is appropriate.',
    specialty: 'general',
    priceRangeFrom: 'From €24',
    eligibilityHint: 'Adults 18+; some conditions require in-person care.',
  },
  {
    id: 'allergy-assessment',
    title: 'Allergy Assessment',
    shortDescription:
      'Structured intake for seasonal or suspected allergic conditions (non-emergency).',
    specialty: 'general',
    priceRangeFrom: 'From €29',
    eligibilityHint: 'Not for anaphylaxis or breathing emergencies — seek emergency care.',
  },
];

export interface IntakeSessionPayload {
  treatmentId: TreatmentId;
  specialty: Exclude<SpecialtyType, null>;
  anonymousIntakeToken: string;
  selectedAt: string;
  /** Set after pre-auth questionnaire submit (answers are not stored in session). */
  questionnaireCompletedAt?: string;
  /** Pre-auth documents step (optional files). */
  documentFileNames?: string[];
  documentsCompletedAt?: string;
  /** Pre-auth payment (demo). */
  paymentMethodLabel?: string;
  paymentCompletedAt?: string;
}

export function getIntakeSession(): IntakeSessionPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as IntakeSessionPayload & {
      questionnaireAnswers?: Record<string, unknown>;
    };
    if (!parsed.treatmentId || !parsed.specialty || !parsed.anonymousIntakeToken) return null;
    const { questionnaireAnswers: _discarded, ...rest } = parsed;
    return rest;
  } catch {
    return null;
  }
}

export function setIntakeSession(payload: Omit<IntakeSessionPayload, 'selectedAt'> & { selectedAt?: string }): void {
  const full: IntakeSessionPayload = {
    ...payload,
    selectedAt: payload.selectedAt ?? new Date().toISOString(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function clearIntakeSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getTreatmentById(id: TreatmentId): TreatmentCatalogItem | undefined {
  return TREATMENT_CATALOG.find((t) => t.id === id);
}

/** Mark pre-auth questionnaire step complete without persisting answers in session. */
export function markQuestionnaireComplete(): void {
  const current = getIntakeSession();
  if (!current) return;
  const full: IntakeSessionPayload = {
    ...current,
    questionnaireCompletedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function hasPreAuthQuestionnaireComplete(): boolean {
  const i = getIntakeSession();
  return Boolean(i?.questionnaireCompletedAt);
}

export function mergeIntakeDocuments(fileNames: string[]): void {
  const current = getIntakeSession();
  if (!current) return;
  const full: IntakeSessionPayload = {
    ...current,
    documentFileNames: fileNames,
    documentsCompletedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

export function mergeIntakePayment(methodLabel: string): void {
  const current = getIntakeSession();
  if (!current) return;
  const full: IntakeSessionPayload = {
    ...current,
    paymentMethodLabel: methodLabel,
    paymentCompletedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(full));
}

/** Questionnaire, documents, and payment (demo) before account creation. */
export function hasPreAuthFullIntakeComplete(): boolean {
  const i = getIntakeSession();
  return Boolean(
    hasPreAuthQuestionnaireComplete() &&
      i?.documentsCompletedAt &&
      i?.paymentCompletedAt
  );
}
