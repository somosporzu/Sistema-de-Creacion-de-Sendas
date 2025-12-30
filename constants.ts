
import { Module, ModuleCategory, EnergyType, SkillType } from './types';

export const MODULE_CATALOG: Module[] = [
  // CATEGORIA A: Bonificadores Numéricos
  { id: 'a1', category: ModuleCategory.A, name: '+1 a Defensa (condicional)', cost: 1, description: 'Ej: Con armadura ligera o frente a proyectiles' },
  { id: 'a2', category: ModuleCategory.A, name: '+2 a Defensa (muy condicional)', cost: 2, description: 'Ej: Contra el primer ataque de la ronda' },
  { id: 'a3', category: ModuleCategory.A, name: '+1 a Armadura', cost: 1, description: 'Solo con armadura ligera/media' },
  { id: 'a4', category: ModuleCategory.A, name: '+2 a Salvación específica', cost: 1, description: 'Ej: Salvaciones de Cuerpo (Fortaleza)' },
  { id: 'a5', category: ModuleCategory.A, name: '+3 Resistencia máxima', cost: 2, description: 'Aumento permanente de la reserva' },
  { id: 'a6', category: ModuleCategory.A, name: '+5 Resistencia máxima', cost: 4, description: 'Aumento permanente masivo' },
  { id: 'a8', category: ModuleCategory.A, name: '+1 al daño (condicional)', cost: 1, description: 'Ej: Solo contra enemigos heridos' },
  { id: 'a9', category: ModuleCategory.A, name: '+1 al ataque (condicional)', cost: 1, description: 'Ej: Con armas de una mano' },
  { id: 'a10', category: ModuleCategory.A, name: '+3 metros movimiento', cost: 1, description: 'Aumenta la movilidad base' },
  { id: 'a11', category: ModuleCategory.A, name: '+2 a Iniciativa', cost: 1, description: 'Reacciona antes en combate' },
  { id: 'a12', category: ModuleCategory.A, name: 'Cambio de Tipo de daño(condicional)', cost: 2, description: 'Ej: de Cortante a Radiante' },

  // CATEGORIA B: Ventajas y Condiciones
  { id: 'b1', category: ModuleCategory.B, name: 'Ventaja en categoría específica', cost: 2, description: 'Ej: Tiradas de rastreo o sigilo' },
  { id: 'b2', category: ModuleCategory.B, name: 'Bono +1 en categoría específica', cost: 1, description: 'Ej: Tiradas de diplomacia' },
  { id: 'b3', category: ModuleCategory.B, name: 'Ventaja en salvación específica', cost: 3, description: 'Ej: Contra venenos o miedo' },
  { id: 'b4', category: ModuleCategory.B, name: 'Bono +1 en salvación específica', cost: 2, description: 'Ej: Contra efectos de empuje' },
  { id: 'b5', category: ModuleCategory.B, name: 'Ignorar terreno difícil', cost: 2, description: 'En entornos específicos (bosques, nieve)' },
  { id: 'b6', category: ModuleCategory.B, name: 'Inmunidad a estado menor', cost: 3, description: 'Ej: Asustado, Derribado' },
  { id: 'b7', category: ModuleCategory.B, name: 'Reducir costes/tiempos', cost: 3, description: 'Reduce a la mitad tiempo de creación u otros' },

  // CATEGORIA C: Acciones Activas
  { id: 'c1', category: ModuleCategory.C, name: 'Bono temporal simple', cost: 1, description: '+1 Defensa o Ataque hasta próximo turno' },
  { id: 'c2', category: ModuleCategory.C, name: 'Bono a aliado adyacente', cost: 2, description: 'Ayuda técnica o moral inmediata' },
  { id: 'c3', category: ModuleCategory.C, name: 'Curación menor', cost: 2, description: 'Restaura 3-5 de Resistencia' },
  { id: 'c4', category: ModuleCategory.C, name: 'Ataque modificado', cost: 4, description: 'Ej: Ataque con +3 al daño o efecto secundario' },
  { id: 'c5', category: ModuleCategory.C, name: 'Imponer estado (ND 10-12)', cost: 4, description: 'Aturdido o Inmovilizado 1 ronda' },
  { id: 'c6', category: ModuleCategory.C, name: 'Efecto de área pequeño', cost: 5, description: 'Afecta a todos a 3-5 metros' },
  { id: 'c7', category: ModuleCategory.C, name: 'Interceptar ataque', cost: 4, description: 'Te conviertes en el objetivo de un aliado' },

  // CATEGORIA D: Habilidades Pasivas
  { id: 'd1', category: ModuleCategory.D, name: 'Pasiva Menor Situacional', cost: 2, description: 'Ej: Identificar materiales automáticamente' },
  { id: 'd2', category: ModuleCategory.D, name: 'Inmunidad Pasiva Suprema', cost: 5, description: 'Ej: Inmune a estados mentales', isSupreme: true },
  { id: 'd3', category: ModuleCategory.D, name: 'Doble beneficio pasivo', cost: 5, description: 'Ej: +1 Def y +3m mov permanente', isSupreme: true },

  // CATEGORIA E: Efectos Cumbre (Solo Rango 3)
  { id: 'e1', category: ModuleCategory.E, name: 'Área grande + múltiple efecto', cost: 8, description: 'Caos o control en 10+ metros' },
  { id: 'e2', category: ModuleCategory.E, name: 'Revivir / Rescate Heroico', cost: 9, description: 'Evita la muerte o levanta aliados' },
  { id: 'e3', category: ModuleCategory.E, name: 'Estado de transformación', cost: 9, description: 'Forma divina o demoníaca temporal' },
  { id: 'e4', category: ModuleCategory.E, name: 'Daño devastador (x2)', cost: 8, description: 'Ataque final de la senda' },
  { id: 'e5', category: ModuleCategory.E, name: 'Cambio de reglas fundamental', cost: 9, description: 'Rompe mecánicas normales del sistema' },
];

export const FULL_CONCEPTS_LIST = [
  { name: "Agricultor", type: "Productivo" }, { name: "Alfarero", type: "Productivo" },
  { name: "Artesano", type: "Productivo" }, { name: "Astrólogo", type: "Intelectual" },
  { name: "Bardo", type: "Social / Espiritual" }, { name: "Botánico", type: "Intelectual" },
  { name: "Carpintero", type: "Productivo" }, { name: "Cazador", type: "Marcial" },
  { name: "Cocinero", type: "Productivo" }, { name: "Constructor", type: "Productivo" },
  { name: "Cortesano", type: "Social" }, { name: "Curandero", type: "Espiritual" },
  { name: "Domador", type: "Marcial" }, { name: "Erudito", type: "Intelectual / Espiritual" },
  { name: "Espía", type: "Social" }, { name: "Espiritista", type: "Espiritual" },
  { name: "Explorador", type: "Marcial" }, { name: "Filósofo", type: "Intelectual" },
  { name: "Guerrero", type: "Marcial" }, { name: "Hechicero", type: "Espiritual" },
  { name: "Herrero", type: "Productivo" }, { name: "Historiador", type: "Intelectual" },
  { name: "Ingeniero", type: "Intelectual" }, { name: "Ladrón", type: "Social / Marcial" },
  { name: "Lingüista", type: "Intelectual" }, { name: "Marinero", type: "Marcial" },
  { name: "Mercader", type: "Social" }, { name: "Minero", type: "Productivo" },
  { name: "Monje", type: "Marcial / Espiritual" }, { name: "Noble", type: "Social" },
  { name: "Naturalista", type: "Intelectual" }, { name: "Pescador", type: "Productivo" },
  { name: "Pícaro", type: "Social" }, { name: "Profesor", type: "Social / Intelectual" },
  { name: "Sacerdote", type: "Espiritual" }, { name: "Sastre", type: "Productivo" },
  { name: "Tintorero", type: "Productivo" }
];

export const CATEGORIES_LIST = [
  "Atributo Cuerpo", "Atributo Destreza", "Atributo Aura", "Atributo Resistencia",
  "Potenciar Naturalezas", "Potenciar Conceptos",
  "Técnicas de Destrucción", "Técnicas de Conservación", "Técnicas de Transformación",
  "Técnicas de Creación", "Técnicas de Caos", "Técnicas de Orden",
  "Conceptos Marciales", "Conceptos Sociales", "Conceptos Espirituales", "Conceptos Intelectuales", "Conceptos Productivos"
];

export const ENERGY_LIST = [
  EnergyType.Destruccion, EnergyType.Conservacion, EnergyType.Transformacion,
  EnergyType.Creacion, EnergyType.Caos, EnergyType.Orden
];

export const RESISTANCE_BASE_COSTS = {
  [SkillType.Pasiva]: 0,
  [SkillType.AccionRapida]: 4,
  [SkillType.AccionPrincipal]: 2,
  [SkillType.AccionCompleta]: 0
};
