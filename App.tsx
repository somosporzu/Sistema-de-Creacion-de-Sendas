
import React, { useState } from 'react';
import { 
  Path, 
  EnergyType, 
  Skill, 
  SkillType, 
  SKILL_CONFIG,
  EquipmentItem
} from './types';
import { ENERGY_LIST, CATEGORIES_LIST, MODULE_CATALOG, FULL_CONCEPTS_LIST, RESISTANCE_BASE_COSTS } from './constants';
import SkillDesigner from './components/SkillDesigner';
import { TrashIcon } from './components/Icons';

const INITIAL_SKILLS: Skill[] = [
  { id: 'init-1', range: 'Inicial', name: 'Habilidad Inicial', description: '', type: SkillType.Pasiva, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r1-1', range: 'Rango 1', name: 'Habilidad 1A', description: '', type: SkillType.Pasiva, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r1-2', range: 'Rango 1', name: 'Habilidad 1B', description: '', type: SkillType.Pasiva, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r2-1', range: 'Rango 2', name: 'Habilidad 2A', description: '', type: SkillType.AccionPrincipal, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r2-2', range: 'Rango 2', name: 'Habilidad 2B', description: '', type: SkillType.AccionPrincipal, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r3-1', range: 'Rango 3', name: 'Habilidad 3A', description: '', type: SkillType.AccionPrincipal, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
  { id: 'r3-2', range: 'Rango 3', name: 'Habilidad 3B', description: '', type: SkillType.AccionPrincipal, selectedModules: [], resistanceModifier: 0, limitedUses: 0, thematicRestriction: false, increasedPower: false },
];

const CONCEPT_TABS = ["Marcial", "Social", "Productivo", "Espiritual", "Intelectual"];

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [activeConceptTab, setActiveConceptTab] = useState("Marcial");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCost, setNewItemCost] = useState(0);

  const [path, setPath] = useState<Path>({
    name: '',
    fantasy: '',
    isHybrid: false,
    energies: [],
    concepts: [],
    equipment: [],
    affinityCategories: [],
    foreignCategories: [],
    skills: INITIAL_SKILLS
  });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const currentInitialBudget = path.isHybrid ? 3 : 6;

  const handleUpdateSkill = (updatedSkill: Skill) => {
    setPath(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === updatedSkill.id ? updatedSkill : s)
    }));
  };

  const calculateSpent = (skill: Skill, budget: number) => {
    let spent = 0;
    skill.selectedModules.forEach(mid => { spent += MODULE_CATALOG.find(m => m.id === mid)?.cost || 0; });
    spent -= (skill.resistanceModifier * 2);
    if (skill.limitedUses === 1) spent -= 3;
    if (skill.limitedUses === 2) spent -= 2;
    if (skill.limitedUses === 3) spent -= 1;
    if (skill.thematicRestriction) spent -= 1;
    if (skill.increasedPower) spent += 1;
    return spent;
  };

  const addEquipmentItem = () => {
    if (!newItemName) return;
    const newItem: EquipmentItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      cost: newItemCost
    };
    setPath(prev => ({ ...prev, equipment: [...prev.equipment, newItem] }));
    setNewItemName("");
    setNewItemCost(0);
  };

  const removeEquipmentItem = (id: string) => {
    setPath(prev => ({ ...prev, equipment: prev.equipment.filter(i => i.id !== id) }));
  };

  const totalEquipmentCost = path.equipment.reduce((sum, item) => sum + item.cost, 0);

  const generateFichaText = () => {
    let text = `═══════════════════════════════════════════════════\n`;
    text += `SENDA: ${path.name || 'SIN NOMBRE'}\n`;
    text += `═══════════════════════════════════════════════════\n\n`;
    text += `CONCEPTO: ${path.fantasy || 'Sin descripción'}\n`;
    text += `AFINIDAD: ${path.energies.join(' / ') || 'Ninguna'}\n`;
    text += `CONCEPTOS: ${path.concepts.join(', ') || 'Ninguno'}\n\n`;
    
    text += `EQUIPO INICIAL (Presupuesto 150L):\n`;
    if (path.equipment.length === 0) {
      text += `- Sin equipo registrado.\n`;
    } else {
      path.equipment.forEach(item => {
        text += `- ${item.name} (${item.cost}L)\n`;
      });
      text += `Total: ${totalEquipmentCost}L / 150L\n`;
    }
    text += `\n`;

    text += `COSTES MODIFICADOS:\n`;
    text += `- Afines: ${path.affinityCategories.join(', ') || 'N/A'}\n`;
    text += `- Ajenos: ${path.foreignCategories.join(', ') || 'N/A'}\n\n`;

    path.skills.forEach(skill => {
      const budget = skill.range === 'Inicial' ? currentInitialBudget : SKILL_CONFIG[skill.range].budget;
      const spent = calculateSpent(skill, budget);
      const baseRes = RESISTANCE_BASE_COSTS[skill.type];
      const finalRes = skill.type === SkillType.Pasiva || skill.limitedUses > 0 ? 0 : Math.max(0, baseRes - skill.resistanceModifier);
      const resLabel = skill.limitedUses > 0 ? `${skill.limitedUses} uso(s)/día` : `${finalRes} de Resistencia`;

      text += `───────────────────────────────────────────────────\n`;
      text += `${skill.range.toUpperCase()} (${budget} PS): ${skill.name || 'Sin Nombre'}\n`;
      text += `───────────────────────────────────────────────────\n`;
      text += `${skill.description || 'Sin descripción narrativa.'}\n\n`;
      text += `Tipo: ${skill.type} | Coste: ${resLabel}\n\n`;
      text += `Componentes:\n`;
      
      skill.selectedModules.forEach(mid => {
        const mod = MODULE_CATALOG.find(m => m.id === mid);
        text += `- ${mod?.name} (${mod?.cost} PS)\n`;
      });

      if (skill.resistanceModifier > 0) text += `- Ajuste Resistencia (+${skill.resistanceModifier * 2} PS)\n`;
      if (skill.limitedUses > 0) text += `- Usos Limitados (${skill.limitedUses === 1 ? '+3' : skill.limitedUses === 2 ? '+2' : '+1'} PS)\n`;
      if (skill.thematicRestriction) text += `- Restricción Temática (+1 PS)\n`;
      if (skill.increasedPower) text += `- Aumentar Poder (-1 PS)\n`;

      text += `\nTOTAL: ${spent} de ${budget} PS\n\n`;
    });

    text += `═══════════════════════════════════════════════════`;
    return text;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateFichaText());
    alert("¡Ficha copiada al portapapeles!");
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([generateFichaText()], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `Senda_${(path.name || 'SinNombre').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleConcept = (concept: string) => {
    setPath(prev => {
      const isSelected = prev.concepts.includes(concept);
      if (isSelected) return { ...prev, concepts: prev.concepts.filter(c => c !== concept) };
      if (prev.concepts.length < 3) return { ...prev, concepts: [...prev.concepts, concept] };
      return prev;
    });
  };

  const toggleEnergy = (energy: EnergyType) => {
    setPath(prev => {
      const isSelected = prev.energies.includes(energy);
      const max = prev.isHybrid ? 2 : 1;
      let newEnergies = [...prev.energies];
      if (isSelected) {
        newEnergies = newEnergies.filter(e => e !== energy);
      } else if (newEnergies.length < max) {
        newEnergies.push(energy);
      } else if (max === 1) {
        newEnergies = [energy];
      }
      return { ...prev, energies: newEnergies };
    });
  };

  const filteredConcepts = FULL_CONCEPTS_LIST.filter(c => 
    c.type.toLowerCase().includes(activeConceptTab.toLowerCase())
  );

  const currentSkillToEdit = path.skills.find(s => s.id === editingSkillId);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold fantasy-font text-amber-900 mb-2">SDSM Designer</h1>
        <p className="text-amber-800 italic">Sistema de Diseño de Sendas Modular v1.0</p>
      </header>

      <nav className="flex justify-between mb-12 bg-white p-2 rounded-full border border-amber-900/10 shadow-sm overflow-x-auto no-scrollbar">
        {[1, 2, 3, 4, 5, 6, 7].map(s => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 min-w-[80px] py-3 rounded-full font-bold text-xs md:text-sm transition-all ${step === s ? 'bg-amber-700 text-white shadow-md' : 'text-amber-900 hover:bg-amber-50'}`}
          >
            {s === 7 ? 'FICHA' : `Paso ${s}`}
          </button>
        ))}
      </nav>

      <main className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-amber-900/10 shadow-xl min-h-[600px]">
        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-bold fantasy-font text-amber-900">1. Concepto y Fantasía</h2>
            <input 
              type="text" value={path.name} onChange={(e) => setPath({ ...path, name: e.target.value })}
              placeholder="Nombre de la Senda (Ej: Senda del Inquisidor)"
              className="w-full p-4 text-xl rounded-xl border border-amber-200 outline-none bg-amber-900 text-white placeholder:text-amber-200/50"
            />
            <textarea 
              value={path.fantasy} onChange={(e) => setPath({ ...path, fantasy: e.target.value })}
              placeholder="Describe la fantasía de poder..."
              rows={4} className="w-full p-4 text-lg rounded-xl border border-amber-200 outline-none bg-amber-900 text-white placeholder:text-amber-200/50"
            />
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto animate-in fade-in">
            <h2 className="text-3xl font-bold fantasy-font text-amber-900 mb-6">2. Afinidad Energética</h2>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <button onClick={() => setPath({ ...path, isHybrid: false, energies: path.energies.slice(0, 1) })}
                className={`p-6 rounded-2xl border-2 ${!path.isHybrid ? 'bg-amber-50 border-amber-700' : 'bg-white border-amber-100'}`}>
                <h4 className="font-bold text-xl">Especialista</h4>
                <p className="text-xs opacity-60">1 Energía | 6 PS Iniciales</p>
              </button>
              <button onClick={() => setPath({ ...path, isHybrid: true })}
                className={`p-6 rounded-2xl border-2 ${path.isHybrid ? 'bg-amber-50 border-amber-700' : 'bg-white border-amber-100'}`}>
                <h4 className="font-bold text-xl">Híbrido</h4>
                <p className="text-xs opacity-60">2 Energías | 3 PS Iniciales</p>
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {ENERGY_LIST.map(e => (
                <button key={e} onClick={() => toggleEnergy(e)}
                  className={`p-4 rounded-xl border-2 font-bold text-sm ${path.energies.includes(e) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-amber-100'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-3xl mx-auto animate-in fade-in">
            <h2 className="text-3xl font-bold fantasy-font text-amber-900 mb-6">3. Conceptos Base</h2>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-widest">Elige hasta 3 conceptos</label>
              <span className="text-[10px] font-bold text-amber-700">{path.concepts.length}/3 Seleccionados</span>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4 bg-amber-50 p-1 rounded-lg border border-amber-100">
              {CONCEPT_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveConceptTab(tab)}
                  className={`flex-1 py-2 px-2 text-[10px] font-bold rounded transition-all ${activeConceptTab === tab ? 'bg-amber-700 text-white shadow-sm' : 'text-amber-900 hover:bg-amber-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[450px] overflow-y-auto pr-2">
              {filteredConcepts.map(c => (
                <button key={c.name} onClick={() => toggleConcept(c.name)}
                  className={`p-4 text-left rounded-xl border transition-all ${path.concepts.includes(c.name) ? 'bg-amber-700 text-white border-amber-700 shadow-md scale-[1.02]' : 'bg-white border-amber-100 hover:bg-amber-50'}`}>
                  <div className="font-bold text-sm">{c.name}</div>
                  <div className={`text-[9px] uppercase font-bold ${path.concepts.includes(c.name) ? 'text-amber-200' : 'text-slate-400'}`}>{c.type}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold fantasy-font text-amber-900">4. Equipo Inicial (PAPA)</h2>
              <div className={`px-6 py-2 rounded-full font-bold text-lg ${totalEquipmentCost > 150 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {totalEquipmentCost} / 150L
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <h4 className="font-bold text-amber-900 text-sm uppercase tracking-widest mb-4">Añadir Objeto</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-1 block">Nombre del Objeto</label>
                      <input 
                        type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Ej: Espada de Acero"
                        className="w-full p-3 rounded-lg border border-amber-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase mb-1 block">Coste en L (Monedas)</label>
                      <input 
                        type="number" value={newItemCost} onChange={(e) => setNewItemCost(Number(e.target.value))}
                        className="w-full p-3 rounded-lg border border-amber-200 outline-none"
                      />
                    </div>
                    <button 
                      onClick={addEquipmentItem}
                      disabled={!newItemName}
                      className="w-full bg-amber-700 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      Añadir al Inventario
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-widest">Lista de Equipo</label>
                <div className="bg-white border border-amber-100 rounded-2xl h-[400px] overflow-y-auto shadow-inner">
                  {path.equipment.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                      No hay objetos añadidos
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {path.equipment.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-amber-50/30 rounded-lg border border-amber-100 group">
                          <div>
                            <span className="font-bold text-sm text-slate-800">{item.name}</span>
                            <span className="ml-3 text-xs font-bold text-amber-700">{item.cost}L</span>
                          </div>
                          <button 
                            onClick={() => removeEquipmentItem(item.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="max-w-4xl mx-auto animate-in fade-in">
            <h2 className="text-3xl font-bold fantasy-font text-amber-900 mb-6">5. Economía de Experiencia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-4 uppercase text-xs tracking-widest">Categorías Afines (3)</h4>
                <div className="grid grid-cols-1 gap-2 h-80 overflow-y-auto pr-2">
                  {CATEGORIES_LIST.map(cat => (
                    <button key={cat} onClick={() => setPath({ ...path, affinityCategories: path.affinityCategories.includes(cat) ? path.affinityCategories.filter(c => c !== cat) : (path.affinityCategories.length < 3 ? [...path.affinityCategories, cat] : path.affinityCategories) })}
                      className={`p-2 text-xs text-left rounded border ${path.affinityCategories.includes(cat) ? 'bg-emerald-700 text-white' : 'bg-white'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
              <section className="bg-red-50/50 p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-red-900 mb-4 uppercase text-xs tracking-widest">Categorías Ajenas (2)</h4>
                <div className="grid grid-cols-1 gap-2 h-80 overflow-y-auto pr-2">
                  {CATEGORIES_LIST.map(cat => (
                    <button key={cat} onClick={() => setPath({ ...path, foreignCategories: path.foreignCategories.includes(cat) ? path.foreignCategories.filter(c => c !== cat) : (path.foreignCategories.length < 2 ? [...path.foreignCategories, cat] : path.foreignCategories) })}
                      className={`p-2 text-xs text-left rounded border ${path.foreignCategories.includes(cat) ? 'bg-red-700 text-white' : 'bg-white'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in">
            <h2 className="text-3xl font-bold fantasy-font text-amber-900 mb-8">6. Diseño de Habilidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {path.skills.map((skill) => {
                const budget = skill.range === 'Inicial' ? currentInitialBudget : SKILL_CONFIG[skill.range].budget;
                const spent = calculateSpent(skill, budget);

                return (
                  <div key={skill.id} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">{skill.range}</span>
                        <span className={`text-xs font-bold ${spent > budget ? 'text-red-500' : 'text-emerald-600'}`}>{spent} / {budget} PS</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{skill.name || 'Sin Nombre'}</h4>
                      <div className="flex flex-wrap gap-1 mt-4">
                        {skill.selectedModules.map(mid => (
                          <span key={mid} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {MODULE_CATALOG.find(m => m.id === mid)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setEditingSkillId(skill.id)}
                      className="w-full bg-amber-50 group-hover:bg-amber-700 group-hover:text-white mt-6 py-2 rounded-lg text-amber-900 font-bold text-sm transition-all border border-amber-200">
                      Editar Habilidad
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="max-w-4xl mx-auto animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold fantasy-font text-amber-900">Vista de Ficha Final</h2>
              <div className="flex gap-3">
                <button 
                  onClick={downloadAsText}
                  className="bg-slate-700 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-600 transition-colors shadow-lg"
                >
                  Exportar TXT
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="bg-amber-700 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors shadow-lg"
                >
                  Copiar Ficha
                </button>
              </div>
            </div>
            
            <div className="bg-[#f5f2e8] p-8 rounded-xl border-2 border-amber-900/10 shadow-inner overflow-x-auto">
              <pre className="font-mono text-[13px] leading-relaxed text-slate-800 whitespace-pre">
                {generateFichaText()}
              </pre>
            </div>
            
            <p className="mt-6 text-center text-amber-800 italic text-sm">
              Esta ficha está lista para ser copiada directamente a tu hoja de personaje o descargada como archivo.
            </p>
          </div>
        )}
      </main>

      {editingSkillId && currentSkillToEdit && (
        <SkillDesigner 
          skill={currentSkillToEdit}
          initialBudget={currentInitialBudget}
          onUpdate={handleUpdateSkill}
          onClose={() => setEditingSkillId(null)}
        />
      )}
    </div>
  );
};

export default App;
