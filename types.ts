
export type PesticideTag = 'SYSTEMIC' | 'CONTACT' | 'CURATIVE' | 'PREVENTIVE';

export interface Pesticide {
  id: number;
  name: string;
  tags: PesticideTag[];
  activeIngredient: string;
  family: string;
  irac: string;
  targetStage: string[];
  modeOfAction: string;
  dosage: string;
  targets: string[];
  notes: string;
  logP: string;
  ph: string;
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

export type Page = 'overview' | 'database' | 'add' | 'profile';