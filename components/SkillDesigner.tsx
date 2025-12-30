
import React, { useState, useMemo, useEffect } from 'react';
import { Skill, SkillType, Module, ModuleCategory, SKILL_CONFIG } from '../types';
import { MODULE_CATALOG, RESISTANCE_BASE_COSTS } from '../constants';
import { TrashIcon } from './Icons';

interface SkillDesignerProps {
  skill: Skill;
  initialBudget: number;
  onUpdate: (updatedSkill: Skill) => void;
  onClose: () => void;
}

const SkillDesigner: React.FC<SkillDesignerProps> = ({ skill, initialBudget, onUpdate, onClose }) => {
  const [selectedCat, setSelectedCat] = useState<ModuleCategory>(ModuleCategory.A);

  // Asegurar que no estemos en una categoría prohibida al abrir o cambiar
  useEffect(() => {
    if (skill.range !== 'Rango 3' && selectedCat === ModuleCategory.E) {
      setSelectedCat(ModuleCategory.A);
    }
  }, [skill.range, selectedCat]);

  const currentPS = useMemo(() => {
    let cost = 0;
    skill.selectedModules.forEach(id => {
      const mod = MODULE_CATALOG.find(m => m.id === id);
      if (mod) cost += mod.cost;
    });

    cost -= (skill.resistanceModifier * 2);
    if (skill.limitedUses === 1) cost -= 3;
    if (skill.limitedUses === 2) cost -= 2;
    if (skill.limitedUses === 3) cost -= 1;
    if (skill.thematicRestriction) cost -= 1;
    if (skill.increasedPower) cost += 1;

    return cost;
  }, [skill]);

  const baseResistance = RESISTANCE_BASE_COSTS[skill.type];
  const finalResistance = skill.type === SkillType.Pasiva || skill.limitedUses > 0 
    ? 0 
    : Math.max(0, baseResistance - skill.resistanceModifier);

  const toggleModule = (id: string) => {
    const isSelected = skill.selectedModules.includes(id);
    const mod = MODULE_CATALOG.find(m => m.id === id);
    
    // Bloqueo de seguridad: No añadir módulos E si no es rango 3
    if (mod?.category === ModuleCategory.E && skill.range !== 'Rango 3') return;

    const newModules = isSelected 
      ? skill.selectedModules.filter(m => m !== id)
      : [...skill.selectedModules, id];
    onUpdate({ ...skill, selectedModules: newModules });
  };

  const currentBudget = skill.range === 'Inicial' ? initialBudget : SKILL_CONFIG[skill.range].budget;

  // Filtrar categorías visibles
  const visibleCategories = Object.values(ModuleCategory).filter(cat => {
    if (cat === ModuleCategory.E) return skill.range === 'Rango 3';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#fdfcf8] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-amber-900/20">
        <div className="p-6 border-b border-amber-900/10 flex justify-between items-center bg-amber-50">
          <div>
            <h2 className="text-2xl font-bold fantasy-font text-amber-900">Diseñando: {skill.range}</h2>
            <p className="text-sm text-amber-700">Presupuesto: {currentPS} / {currentBudget} PS</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-amber-100 rounded-full transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Configuración Izquierda */}
          <div className="w-1/3 p-6 border-r border-amber-900/10 overflow-y-auto space-y-6">
            <section>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">Nombre</label>
              <input 
                type="text" value={skill.name}
                onChange={(e) => onUpdate({ ...skill, name: e.target.value })}
                className="w-full p-2 rounded border border-amber-200"
              />
            </section>

            <section>
              <label className="block text-sm font-bold text-amber-900 mb-2 uppercase tracking-wider">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(SkillType).map(t => (
                  <button
                    key={t}
                    onClick={() => onUpdate({ ...skill, type: t, limitedUses: 0 })}
                    className={`p-2 text-[10px] rounded border transition-all ${skill.type === t ? 'bg-amber-700 text-white border-amber-700' : 'bg-white border-amber-200'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {skill.type !== SkillType.Pasiva && (
              <section className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-4">
                <h4 className="font-bold text-amber-900 text-xs uppercase tracking-widest">Economía</h4>
                <div>
                  <label className="text-[10px] font-semibold block mb-1">Reducir Resistencia (-1 Res = +2 PS)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="0" max={baseResistance} step="1"
                      value={skill.resistanceModifier}
                      onChange={(e) => onUpdate({ ...skill, resistanceModifier: parseInt(e.target.value) })}
                      className="flex-1 accent-amber-700"
                      disabled={skill.limitedUses > 0}
                    />
                    <span className="font-bold text-amber-900 text-sm">{finalResistance} R</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-semibold block mb-1">Usos Limitados por Día</label>
                  <select 
                    value={skill.limitedUses}
                    onChange={(e) => onUpdate({ ...skill, limitedUses: parseInt(e.target.value), resistanceModifier: 0 })}
                    className="w-full p-2 text-xs rounded border border-amber-200"
                  >
                    <option value={0}>Sin límite (Usa Resistencia)</option>
                    <option value={1}>1 uso al día (-3 PS)</option>
                    <option value={2}>2 usos al día (-2 PS)</option>
                    <option value={3}>3 usos al día (-1 PS)</option>
                  </select>
                </div>
              </section>
            )}

            <section className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" checked={skill.thematicRestriction}
                  onChange={(e) => onUpdate({ ...skill, thematicRestriction: e.target.checked })}
                  className="w-4 h-4 accent-amber-700"
                />
                <span className="text-xs">Restricción Temática (-1 PS)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" checked={skill.increasedPower}
                  onChange={(e) => onUpdate({ ...skill, increasedPower: e.target.checked })}
                  className="w-4 h-4 accent-amber-700"
                />
                <span className="text-xs font-bold">Aumentar Poder (+1 PS)</span>
              </label>
            </section>
          </div>

          {/* Catálogo Derecha */}
          <div className="flex-1 p-6 flex flex-col bg-slate-50">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {visibleCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-2 text-[10px] font-bold rounded-full transition-all border ${selectedCat === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}
                >
                  {cat.split(':')[0]}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 content-start">
              {MODULE_CATALOG.filter(m => m.category === selectedCat).map(mod => (
                <button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-4 text-left rounded-lg border transition-all flex flex-col justify-between h-32 ${skill.selectedModules.includes(mod.id) ? 'bg-amber-100 border-amber-500' : 'bg-white border-slate-200'}`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-900">{mod.name}</span>
                      <span className="bg-amber-700 text-white text-[10px] px-2 py-0.5 rounded-full">{mod.cost} PS</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{mod.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] opacity-60 uppercase font-bold">Total Gastado</span>
              <span className={`text-xl font-bold ${currentPS > currentBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                {currentPS} / {currentBudget} PS
              </span>
            </div>
          </div>
          <button onClick={onClose} className="bg-amber-600 hover:bg-amber-500 px-10 py-3 rounded-lg font-bold">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default SkillDesigner;
