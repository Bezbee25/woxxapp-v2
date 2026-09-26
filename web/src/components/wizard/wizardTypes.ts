export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface ThemePreset {
  id: string;
  name: string;
  category: 'food' | 'fashion' | 'beauty' | 'craft' | 'services' | 'general';
  badge: string;
  icon: string;
  description: string;
  colors: {
    bg: string;
    secondary: string;
    text: string;
    accent: string;
  };
  sampleTagline: string;
  sampleProducts: {
    name: string;
    price: number;
    category: string;
    image: string;
  }[];
}

export interface ModuleDefinition {
  code: string;
  name: string;
  icon: string;
  stepName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  isBase?: boolean;
  includedInEcommerce?: boolean;
  requiredModule?: string;
}

export interface WizardFormData {
  commerceName: string;
  subdomain: string;
  customDomain: string;
  themeId: string;
  selectedModules: string[];
  billingCycle: 'monthly' | 'yearly';
}

export interface SubdomainCheckResult {
  available: boolean;
  subdomain?: string;
  reason?: string;
  suggestions?: string[];
  previewUrl?: string;
}
