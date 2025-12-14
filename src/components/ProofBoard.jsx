// src/components/ProofBoard.jsx

import { useState, useEffect, useRef } from "react";
import { formatFormula } from "../utils/formatter";
import { Button } from "./atoms/Button";
import { RULES } from "../utils/rules";
import { validateStep } from "../utils/logic";
import { getDeleteIndex, isEnter } from "../utils/shorthands";
import { ProofHeader } from "./ProofHeader";
import { FeedbackOverlay } from "./FeedbackOverlay"; // <--- Importamos el componente de feedback

export default function ProofBoard({ proofData, onBack }) {
  const premiseCount = proofData.premises.length;
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [steps, setSteps] = useState(() => {
    return proofData.premises.map((p) => ({
      formula: p,
      rule: "Premisa",
      refs: [],
    }));
  });

  // Estado para controlar el overlay de feedback (Manga)
  const [feedback, setFeedback] = useState(null); 

  const [isAdding, setIsAdding] = useState(true);

  const [newStep, setNewStep] = useState({
    rule: "MPP", 
    refs: ["", ""], 
    formula: "", 
  });

  const nextLineNum = steps.length + 1;

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  const handleInsertSymbol = (char) => {
    if (isAdding) {
      setNewStep(prev => ({ ...prev, formula: prev.formula + char }));
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const handleRowClick = (index) => {
    if (!isAdding) return;
    const lineNum = index + 1;
    const emptyIndex = newStep.refs.findIndex(ref => ref === "");
    
    const newRefs = [...newStep.refs];
    if (emptyIndex !== -1) newRefs[emptyIndex] = lineNum;
    else newRefs[newRefs.length - 1] = lineNum;
    
    setNewStep({ ...newStep, refs: newRefs });
  };

  const handleRemoveStep = (index) => {
    if (index < premiseCount) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleRuleChange = (ruleKey) => {
    setNewStep({
      ...newStep,
      rule: ruleKey,
      refs: Array(RULES[ruleKey].inputs).fill(""),
    });
  };

  const handleAddStep = () => {
    if (!newStep.formula.trim()) return;

    const hasEmptyRefs = newStep.refs.some(r => r === "" || r === null);
    if (hasEmptyRefs && RULES[newStep.rule].inputs > 0) {
      alert("Por favor selecciona las líneas de referencia.");
      return;
    }

    const inputFormulas = newStep.refs.map(refNum => {
      const index = parseInt(refNum) - 1;
      return steps[index]?.formula || "";
    });

    const isValid = validateStep(newStep.rule, inputFormulas, newStep.formula);

    if (!isValid) {
      // --- ERROR: Activamos a Gentzen ---
      setFeedback({
        type: "error",
        message: `¡ERROR! La regla ${RULES[newStep.rule].label} no se aplica así. Revisa tus premisas.`
      });
      return;
    }

    const stepToAdd = {
      formula: newStep.formula,
      rule: RULES[newStep.rule].label,
      refs: newStep.refs,
    };

    setSteps([...steps, stepToAdd]);
    setNewStep({ ...newStep, formula: "", refs: Array(RULES[newStep.rule].inputs).fill("") });
    setIsAdding(false); 
    
    if (containerRef.current) containerRef.current.focus();
  };

  const handleCheckSolution = () => {
    const lastStep = steps[steps.length - 1];
    const currentFormula = lastStep.formula.replace(/\s/g, "");
    const goalFormula = proofData.conclusion.replace(/\s/g, "");

    if (currentFormula === goalFormula) {
      // --- ÉXITO: Activamos a Frege ---
      setFeedback({
        type: "success",
        message: "¡Brillante! Has demostrado la verdad lógica correctamente."
      });
    } else {
      setFeedback({
        type: "error",
        message: "Aún no has llegado a la conclusión exacta. ¡Sigue intentando!"
      });
    }
  };

  const handleKeyDown = (e) => {
    if (isEnter(e)) {
      e.preventDefault();
      if (isAdding) {
        handleAddStep();
      } else {
        setIsAdding(true);
        setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
      }
    }

    const deleteIdx = getDeleteIndex(e);
    if (deleteIdx !== null) {
      e.preventDefault();
      if (deleteIdx >= premiseCount && steps[deleteIdx]) {
        handleRemoveStep(deleteIdx);
      }
    }
  };

  return (
    <div 
      className="flex flex-col lg:flex-row gap-6 items-start max-w-5xl mx-auto outline-none"
      tabIndex={0}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* RENDERIZADO DEL OVERLAY (Si hay feedback) */}
      {feedback && (
        <FeedbackOverlay 
          type={feedback.type} 
          message={feedback.message} 
          onClose={() => setFeedback(null)} 
        />
      )}

      {/* SIDEBAR IZQUIERDO (Herramientas) */}
      <div className="w-full lg:w-72 lg:sticky lg:top-8 shrink-0">
        <ProofHeader onInsert={handleInsertSymbol} />
      </div>

      {/* COLUMNA DERECHA (Principal) */}
      <div className="flex-1 w-full flex flex-col gap-6">
        
        {/* 1. OBJETIVO (Arriba) */}
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Objetivo a demostrar
            </h2>
            <div className="font-mono text-2xl text-slate-800 font-bold break-all">
              {formatFormula(proofData.conclusion)}
            </div>
          </div>
          <div>
             <Button variant="secondary" onClick={onBack} className="text-xs">
              Abandonar
            </Button>
          </div>
        </div>

        {/* 2. TABLERO DE PASOS */}
        <div className="bg-white border border-border rounded-xl shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-[3rem_1fr_10rem_3rem] gap-4 px-6 py-3 bg-slate-50 border-b border-border text-xs font-bold text-slate-500 uppercase">
            <div className="text-center">#</div>
            <div>Fórmula</div>
            <div>Justificación</div>
            <div className="text-center">Acción</div>
          </div>

          <div className="divide-y divide-border bg-white">
            {steps.map((step, index) => {
              const lineNum = index + 1;
              const isPremise = index < premiseCount;
              const isClickable = isAdding; 

              return (
                <div 
                  key={index} 
                  onClick={() => handleRowClick(index)}
                  className={`
                    grid grid-cols-[3rem_1fr_10rem_3rem] gap-4 px-6 py-4 items-center transition-all
                    ${isClickable ? "cursor-pointer hover:bg-blue-50/60 active:bg-blue-100" : "hover:bg-slate-50"}
                  `}
                >
                  <div className="font-mono text-slate-400 text-center font-bold select-none">{lineNum}</div>
                  <div className="font-mono text-lg text-slate-800 pointer-events-none">{formatFormula(step.formula)}</div>
                  <div className="text-sm text-slate-500 font-medium flex flex-col pointer-events-none">
                    <span className="text-slate-700">{step.rule}</span>
                    {step.refs.length > 0 && (
                      <span className="text-xs bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1 border border-slate-200">
                        {step.refs.join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    {!isPremise && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveStep(index); }}
                        className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title={`Eliminar paso (Shift + ${lineNum})`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Área de Edición */}
          <div className="bg-slate-50 border-t border-border p-6 transition-all">
            {isAdding ? (
              <div className="grid grid-cols-[3rem_1fr_12rem] gap-4 items-start animate-fade-in">
                <div className="font-mono text-primary font-bold text-xl text-center pt-2">{nextLineNum}</div>
                <div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={newStep.formula}
                    onChange={(e) => setNewStep({...newStep, formula: e.target.value})}
                    placeholder="Escribe tu deducción..."
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 font-mono text-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    autoFocus
                  />
                  <p className="text-xs text-primary mt-2 animate-pulse">💡 Tip: Haz clic en las filas de arriba para seleccionarlas.</p>
                </div>
                <div className="flex flex-col gap-3">
                  <select
                    value={newStep.rule}
                    onChange={(e) => handleRuleChange(e.target.value)}
                    className="w-full bg-white border border-border rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-primary cursor-pointer shadow-sm"
                  >
                    {Object.keys(RULES).map((key) => (<option key={key} value={key}>{RULES[key].label}</option>))}
                  </select>
                  <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-2 py-1">
                    <span className="text-xs text-slate-400 font-bold uppercase">De:</span>
                    {newStep.refs.map((refVal, i) => (
                      <div key={i} className="font-mono text-sm font-bold text-primary w-6 text-center border-b border-primary/20">{refVal || "_"}</div>
                    ))}
                  </div>
                  <Button onClick={handleAddStep} variant="primary" className="w-full justify-center">+ Aplicar Paso</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2 animate-fade-in">
                <p className="text-sm text-slate-500 font-medium">Paso agregado. ¿Qué deseas hacer ahora?</p>
                <div className="flex gap-4">
                  <Button onClick={() => setIsAdding(true)} variant="secondary" className="shadow-sm">+ Agregar otra deducción</Button>
                  <Button onClick={handleCheckSolution} variant="primary" className="px-8 shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 border-none text-white">✓ Chequear Solución</Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Atajos */}
          <div className="bg-slate-100/50 border-t border-border p-3 text-center">
            <div className="inline-flex gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <span><code className="bg-white border border-slate-300 px-1 rounded text-slate-600 mr-1">Enter</code>{isAdding ? "Aplicar" : "Nueva línea"}</span>
              <span><code className="bg-white border border-slate-300 px-1 rounded text-slate-600 mr-1">Shift + #</code>Borrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}