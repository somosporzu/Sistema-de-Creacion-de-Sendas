
export enum EnergyType {
  Destruccion = 'Destrucción',
  Conservacion = 'Conservación',
  Transformacion = 'Transformación',
  Creacion = 'Creación',
  Caos = 'Caos',
  Orden = 'Orden'
}

export enum ConceptCategory {
  Marcial = 'Marcial',
  Social = 'Social',
  Productivo = 'Productivo',
  Espiritual = 'Espiritual',
  Intelectual = 'Intelectual'
}

export enum SkillType {
  Pasiva = 'Pasiva',
  AccionRapida = 'Acción Rápida',
  AccionPrincipal = 'Acción Principal',
  AccionCompleta = 'Acción Completa'
}

export enum ModuleCategory {
  A = 'Categoría A: Bonificadores Numéricos',
  B = 'Categoría B: Ventajas y Condiciones',
  C = 'Categoría C: Acciones Activas',
  D = 'Categoría D: Habilidades Pasivas',
  E = 'Categoría E: Efectos Cumbre'
}

export interface Module {
  id: string;
  category: ModuleCategory;
  name: string;
  cost: number;
  description: string;
  isMinor?: boolean;
  isSupreme?: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  cost: number;
}

export interface Skill {
  id: string;
  name: string;
  range: 'Inicial' | 'Rango 1' | 'Rango 2' | 'Rango 3';
  description: string;
  type: SkillType;
  selectedModules: string[]; // IDs of modules
  resistanceModifier: number; // For manual PS/Resistance adjustments
  limitedUses: number; // 0 = no limit, 1, 2, 3
  thematicRestriction: boolean; // -1 PS
  increasedPower: boolean; // +1 PS
}

export interface Path {
  name: string;
  fantasy: string;
  isHybrid: boolean;
  energies: EnergyType[];
  concepts: string[];
  equipment: EquipmentItem[];
  affinityCategories: string[];
  foreignCategories: string[];
  skills: Skill[];
}

export const SKILL_CONFIG = {
  'Inicial': { budget: 6, count: 1 },
  'Rango 1': { budget: 4, count: 2 },
  'Rango 2': { budget: 6, count: 2 },
  'Rango 3': { budget: 9, count: 2 }
};
