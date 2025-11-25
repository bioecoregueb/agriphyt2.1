
export type PesticideTag = 'SYSTEMIC' | 'CONTACT' | 'CURATIVE' | 'PREVENTIVE' | 'INGESTION';

export type PesticideType = 'Insecticide' | 'Fongicide';

export interface TargetStageEvaluation {
    stage: string;
    rating: number; // 1 to 5
}

export interface Pesticide {
  id: number;
  name: string;
  type: PesticideType;
  tags: PesticideTag[];
  activeIngredient: string;
  family: string;
  irac: string;
  chemicalDetails: string;
  targetStage: TargetStageEvaluation[];
  modeOfAction: string;
  dosage: string;
  targets: string[];
  notes: string;
  logP: string;
  ph: string;
  labelImage?: string; // Base64 string of the uploaded image
}

export interface CompatibilityRule {
  id: number;
  type: 'Family' | 'Chemical';
  status: 'Do Not Mix' | 'Safe to Mix' | 'Conditional';
  agents: [string, string];
  reason: string;
  precaution: string;
  created: string;
  modified: string;
  version: number;
}

export type ModeOfActionCategory = 'Nerve & Muscle' | 'Respiration' | 'Midgut' | 'Growth & Development' | 'Unknown / Other';

export interface ModeOfActionInfo {
    category: ModeOfActionCategory;
    styles: {
        bg: string;
        text: string;
        border: string;
        dot: string;
    };
}

export interface IracData {
  code: string;
  modeOfAction: string;
}

export type Page = 'overview' | 'database' | 'add' | 'profile';