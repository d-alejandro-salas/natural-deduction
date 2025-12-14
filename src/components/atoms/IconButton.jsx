// src/components/atoms/IconButton.jsx

export function IconButton({ 
  onClick, 
  children, 
  title, 
  active = false 
}) {
  return (
    <button
      type="button" // Importante para que no envíe formularios
      onClick={onClick}
      title={title}
      className={`
        w-10 h-10 flex items-center justify-center rounded-lg border text-lg font-mono transition-all duration-200 active:scale-95
        ${active 
          ? "bg-primary text-white border-primary shadow-md shadow-primary/30" 
          : "bg-white border-border text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-primary"
        }
      `}>
      {children}
    </button>
  );
}