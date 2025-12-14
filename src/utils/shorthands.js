// src/utils/shor// src/utils/shorthands.js

export const isEnter = (e) => {
  return e.key === "Enter" && !e.ctrlKey && !e.shiftKey && !e.altKey;
};

export const isCtrlEnter = (e) => {
  return e.key === "Enter" && (e.ctrlKey || e.metaKey);
};

export const getDeleteIndex = (e) => {
  if (!e.shiftKey) return null;

  let code = e.code;

  // --- EXCEPCIÓN: SIGNO DE EXCLAMACIÓN (!) ---
  // Shift + 1 (Digit1) escribe "!", así que prohibimos que se use para borrar.
  if (code === "Digit1") return null;

  // Limpiamos el nombre de la tecla para obtener el número
  if (code.startsWith("Digit")) code = code.replace("Digit", "");
  if (code.startsWith("Numpad")) code = code.replace("Numpad", "");

  const num = parseInt(code);
  
  // Devolvemos el índice (número - 1) si es válido
  if (!isNaN(num) && num > 0) {
    return num - 1;
  }
  
  return null;
};