// src/utils/formatter.js

export const formatFormula = (text) => {
  if (!text) return "";
  
  // Normalizamos a minúsculas para el chequeo visual, 
  // pero mantenemos el texto original si no matchea.
  
  return text
    // Reemplazo de palabras clave (Case insensitive)
    .replace(/\b(then|entonces)\b/gi, "→")
    .replace(/\b(and|y)\b/gi, "∧")
    .replace(/\b(or|o)\b/gi, "∨")
    .replace(/\b(not|no)\b/gi, "¬")
    .replace(/\b(iff|sii)\b/gi, "↔")
    .replace(/\b(false|falso)\b/gi, "⊥")
    
    // Reemplazo de símbolos técnicos
    .replace(/>/g, "→")
    .replace(/&/g, "∧")
    .replace(/\|/g, "∨")
    .replace(/!/g, "¬")
    .replace(/_/g, "⊥")
    .replace(/<->/g, "↔");
};