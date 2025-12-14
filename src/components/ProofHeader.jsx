// src/components/ProofHeader.jsx

import { IconButton } from "./atoms/IconButton";

// Constante estática fuera del componente (Optimización)
const TOOLS = [
  { label: "→", insert: ">", key: ">", word: "then" },
  { label: "∨", insert: "|", key: "|", word: "or" },
  { label: "∧", insert: "&", key: "&", word: "and" },
  { label: "¬", insert: "!", key: "!", word: "not" },
];

export function ProofHeader({ onInsert }) {
  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* SECCIÓN PRINCIPAL */}
      <div className="p-6">
        
        {/* TÍTULO */}
        <div className="flex justify-center mb-6 lg:mb-8">
          <h2 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm cursor-default">
            <span className="text-sm">⌨️</span>
            Panel de Control
          </h2>
        </div>

        {/* VISTA MÓVIL */}
        <div className="grid lg:hidden grid-cols-[auto_1fr_1fr_1fr_1fr] gap-y-6 gap-x-3 items-center text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-2 pt-2">Click</div>
          {TOOLS.map((t) => (
            <div key={t.insert} className="flex justify-center">
              <IconButton onClick={() => onInsert(t.insert)} title={`Insertar ${t.label}`}>{t.label}</IconButton>
            </div>
          ))}

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-2">Teclas</div>
          {TOOLS.map((t) => (
            <div key={t.insert + "key"} className="flex justify-center h-6 items-center">
              <code className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded scale-110 select-none">{t.key}</code>
            </div>
          ))}

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right pr-2">O escribe</div>
          {TOOLS.map((t) => (
            <div key={t.insert + "word"} className="flex justify-center h-6 items-center">
              <span className="text-[10px] text-slate-400 italic scale-110">{t.word}</span>
            </div>
          ))}
        </div>

        {/* VISTA ESCRITORIO */}
        <div className="hidden lg:grid grid-cols-[auto_1fr_1fr] gap-y-4 gap-x-4 items-center">
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center border-b border-slate-100 pb-2 mb-2">Click</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center border-b border-slate-100 pb-2 mb-2">Tecla</div>
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center border-b border-slate-100 pb-2 mb-2">O escribe</div>

          {TOOLS.map((t) => (
            <div key={t.insert} className="contents">
              <div className="flex justify-center">
                <IconButton onClick={() => onInsert(t.insert)} title={`Insertar ${t.label}`}>{t.label}</IconButton>
              </div>
              <div className="flex justify-center">
                <code className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded shadow-sm select-none hover:border-primary/30 transition-colors cursor-help" title="Atajo de teclado">{t.key}</code>
              </div>
              <div className="flex justify-center">
                <span className="text-xs text-slate-400 italic hover:text-primary transition-colors cursor-help" title="Palabra clave">{t.word}</span>
              </div>
              <div className="col-span-3 h-px bg-slate-50 my-1 last:hidden"></div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER DE ATAJOS */}
      <div className="bg-slate-50 border-t border-border p-4">
        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Atajos de Teclado</h3>
        <div className="grid grid-cols-1 gap-2 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Nueva línea/Aplicar</span>
            <code className="font-bold bg-white border border-slate-200 px-1.5 rounded">Enter</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Borrar línea</span>
            <code className="font-bold bg-white border border-slate-200 px-1.5 rounded">Shift + #</code>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Ir a conclusión</span>
            <code className="font-bold bg-white border border-slate-200 px-1.5 rounded">Ctrl + Enter</code>
          </div>
        </div>
      </div>
    </div>
  );
}