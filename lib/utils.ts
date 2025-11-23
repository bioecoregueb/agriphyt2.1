
import { ModeOfActionCategory, ModeOfActionInfo, PesticideType } from '../types';

// Define the color schemes for each category
const categoryStyles: Record<ModeOfActionCategory, { bg: string; text: string; border: string; dot: string; }> = {
    'Nerve & Muscle': { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-300', dot: 'bg-blue-500' },
    'Respiration': { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-300', dot: 'bg-orange-500' },
    'Midgut': { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-300', dot: 'bg-purple-500' },
    'Growth & Development': { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-300', dot: 'bg-teal-500' },
    'Unknown / Other': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-300', dot: 'bg-gray-500' }
};

export function getModeOfActionCategory(modeOfAction: string): ModeOfActionInfo {
    const lowerCaseMoA = modeOfAction.toLowerCase();

    if (/(acetylcholinesterase|gaba|sodium channel|nicotinic|ach|nerve|muscle)/.test(lowerCaseMoA)) {
        return { category: 'Nerve & Muscle', styles: categoryStyles['Nerve & Muscle'] };
    }
    if (/(mitochondrial|respiration|atp synthase|oxidative phosphorylation|electron transport)/.test(lowerCaseMoA)) {
        return { category: 'Respiration', styles: categoryStyles['Respiration'] };
    }
    if (/(midgut|bt|bacillus thuringiensis)/.test(lowerCaseMoA)) {
        return { category: 'Midgut', styles: categoryStyles['Midgut'] };
    }
    if (/(chitin|juvenile|ecdysone|biosynthesis inhibitor|growth)/.test(lowerCaseMoA)) {
        return { category: 'Growth & Development', styles: categoryStyles['Growth & Development'] };
    }

    return { category: 'Unknown / Other', styles: categoryStyles['Unknown / Other'] };
}

export function getCodeLabel(type: PesticideType | string | undefined): string {
    if (!type) return 'IRAC/FRAC Code';
    switch (type) {
        case 'Insecticide': return 'IRAC Code';
        case 'Fongicide': return 'FRAC Code';
        default: return 'IRAC/FRAC Code';
    }
}