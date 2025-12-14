// src/utils/rules.js

export const RULES = {
  // --- TIER S (Las Indispensables) ---
  MPP: { label: "Modus Ponens (MPP)", inputs: 2 },    // El Rey: Si A>B y A, entonces B
  MTT: { label: "Modus Tollens (MTT)", inputs: 2 },   // La Reina: Si A>B y !B, entonces !A
  SIMP: { label: "Simplificación (Elim)", inputs: 1 },// Sacar datos: A&B -> A
  CONJ: { label: "Conjunción (Intro)", inputs: 2 },   // Unir datos: A, B -> A&B
  
  // --- TIER A (Muy Frecuentes) ---
  DN:  { label: "Doble Negación (DN)", inputs: 1 },   // Limpieza: !!A -> A
  MTP: { label: "Silogismo Disyuntivo (MTP)", inputs: 2 }, // El "O": A|B, !A -> B
  DM:  { label: "De Morgan (DM)", inputs: 1 },        // Transformar: !(A&B) <-> !A|!B
  
  // --- TIER B (Situacionales) ---
  MPT: { label: "Modus Ponendo Tollens (MPT)", inputs: 2 }, // Menos común: !(A&B), A -> !B
  ADD: { label: "Adición (Intro Disy)", inputs: 1 },  // Truco mágico: A -> A|B
  
  // --- TIER C (Atajos / Avanzadas) ---
  HS:  { label: "Silogismo Hipotético (HS)", inputs: 2 }, // Cadena: A>B, B>C -> A>C
  CD:  { label: "Dilema Constructivo (CD)", inputs: 2 }, // Combo: (A>B)&(C>D), A|C -> B|D
};