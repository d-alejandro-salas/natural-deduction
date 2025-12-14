// src/components/atoms/Button.jsx

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary", // opciones: 'primary', 'secondary', 'danger', 'ghost'
  className = "",
}) {
  // Diccionario de estilos según la variante
  const variants = {
    primary: "bg-primary text-white hover:bg-blue-700 shadow-sm shadow-blue-500/30",
    secondary: "bg-white border border-border text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    danger: "text-red-500 hover:bg-red-50 hover:text-red-600",
    ghost: "text-slate-400 hover:text-slate-600 hover:bg-slate-100", // Para la X de borrar
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-lg px-4 py-2 font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
        ${variants[variant] || variants.primary} 
        ${disabled ? "opacity-50 cursor-not-allowed grayscale" : ""}
        ${className}
      `}>
      {children}
    </button>
  );
}