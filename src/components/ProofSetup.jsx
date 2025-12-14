// src/components/ProofSetup.jsx

import { useState, useRef, useEffect } from "react";
import { formatFormula } from "../utils/formatter";
import { Button } from "./atoms/Button";
import { ProofHeader } from "./ProofHeader";
import { isEnter, isCtrlEnter, getDeleteIndex } from "../utils/shorthands";

export default function ProofSetup({ onStartProof }) {
  const [lines, setLines] = useState(["", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[focusedIndex]) {
      inputRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex, lines.length]);

  const handleChange = (index, value) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const handleInsertSymbol = (char) => {
    if (focusedIndex === null) return;
    const currentLine = lines[focusedIndex] || "";
    const newLine = currentLine + char;
    handleChange(focusedIndex, newLine);
    // Recuperar el foco (por si se pierde al cliquear el botón)
    if (inputRefs.current[focusedIndex]) {
      inputRefs.current[focusedIndex].focus();
    }
  };

  const addLine = () => {
    const newLines = [...lines];
    // Insertamos penúltimo (antes de la conclusión)
    const insertPos = newLines.length - 1;
    newLines.splice(insertPos, 0, "");
    setLines(newLines);
    setFocusedIndex(insertPos); 
  };
  
  const removeLine = (index) => {
    const isConclusion = index === lines.length - 1;
    const isFirstPremise = index === 0;

    // Lógica de protección
    if (lines.length > 2 && !isFirstPremise && !isConclusion) {
      setLines(lines.filter((_, i) => i !== index));
      if (focusedIndex >= index) {
        setFocusedIndex(Math.max(0, index - 1));
      }
    }
  };

  const handleStart = () => {
    if (lines.some((l) => l.trim() === "")) return;
    onStartProof(lines.slice(0, -1), lines.at(-1));
  };

  // --- MANEJO DE TECLADO ---
  const handleKeyDown = (e) => {
    if (isEnter(e)) {
      e.preventDefault();
      addLine();
      return;
    }

    if (isCtrlEnter(e)) {
      e.preventDefault();
      setFocusedIndex(lines.length - 1);
      return;
    }

    const deleteIdx = getDeleteIndex(e);
    if (deleteIdx !== null) {
      // Si llegamos aquí, es porque NO es Shift+1 (gracias a shorthands.js)
      // Solo verificamos si la línea existe
      if (lines[deleteIdx] !== undefined) {
        const isConclusion = deleteIdx === lines.length - 1;
        // Solo prevenimos default si vamos a borrar algo válido
        if (!isConclusion && lines.length > 2) {
           e.preventDefault(); 
           removeLine(deleteIdx);
        }
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start max-w-5xl mx-auto">
      
      {/* SIDEBAR */}
      <div className="w-full lg:w-72 lg:sticky lg:top-8 shrink-0">
        <ProofHeader onInsert={handleInsertSymbol} />
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="flex-1 w-full bg-surface border border-border rounded-xl shadow-xl overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Cabecera */}
        <div className="hidden md:grid grid-cols-[3rem_3rem_1fr_8rem] gap-4 px-4 py-3 bg-slate-50 border-b border-border text-xs font-bold text-slate-400 uppercase tracking-wider items-center">
          <div className="text-center">Borrar</div>
          <div className="text-center">#</div>
          <div className="pl-2">Fórmula</div>
          <div className="text-right pr-4">Vista Previa</div>
        </div>

        {/* Filas */}
        <div className="divide-y divide-border bg-white">
          {lines.map((line, index) => {
            const isConclusion = index === lines.length - 1;
            const isFirstPremise = index === 0;
            const canDelete = lines.length > 2 && !isFirstPremise && !isConclusion;
            const isActive = focusedIndex === index;

            return (
              <div 
                key={index} 
                className={`
                  group grid grid-cols-[3rem_3rem_1fr] md:grid-cols-[3rem_3rem_1fr_8rem] 
                  gap-2 md:gap-4 px-2 md:px-4 py-4 items-center transition-all duration-200
                  ${isActive ? "bg-blue-50/40" : "hover:bg-slate-50"}
                  ${isConclusion ? "border-t-2 border-primary/20 bg-slate-50/80" : ""}
                `}
                onClick={() => setFocusedIndex(index)}
              >
                <div className="flex justify-center">
                  {canDelete ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeLine(index); }}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all"
                      title={`Borrar línea (Shift + ${index + 1})`}
                      tabIndex={-1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  ) : ((isFirstPremise || isConclusion) && <span className="text-slate-200 text-xs select-none">🔒</span>)}
                </div>

                <div className={`font-mono text-center text-sm select-none ${isConclusion ? "text-primary font-bold" : "text-slate-400"}`}>
                  {isConclusion ? "∴" : index + 1}
                </div>

                <div className="relative w-full">
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={line}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onFocus={() => setFocusedIndex(index)}
                    placeholder={isConclusion ? "Conclusión..." : "Premisa..."}
                    className={`w-full bg-transparent outline-none font-mono text-lg md:text-xl placeholder-slate-300 transition-colors pl-2 ${isConclusion ? "text-slate-800 font-bold" : "text-slate-600"}`}
                    autoFocus={isConclusion}
                    spellCheck="false"
                  />
                  <span className="md:hidden block text-xs font-mono text-primary mt-1 min-h-[1.2em] pl-2">
                    {formatFormula(line)}
                  </span>
                </div>

                <div className="hidden md:block font-mono text-lg text-right text-primary font-medium opacity-90 select-none pr-4">
                  {formatFormula(line)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 border-t border-border flex justify-between items-center gap-4">
          <Button onClick={addLine} variant="secondary" className="text-sm" title="Atajo: Enter">
            <span>+</span> Agregar premisa
          </Button>
          <Button onClick={handleStart} variant="primary" className="shadow-lg shadow-blue-500/20 px-6">
            Comenzar Resolución
          </Button>
        </div>
      </div>
    </div>
  );
}