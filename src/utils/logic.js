// src/utils/logic.js

/* =========================================
   1. EL PARSER (CEREBRO SINTÁCTICO)
   Convierte texto "p > (q & r)" en objetos.
   ========================================= */

const clean = (formula) => {
  // 1. TRADUCCIÓN DE PALABRAS CLAVE
  // Convertimos "p and q" -> "p & q" antes de quitar espacios
  let s = formula.toLowerCase()
    .replace(/\bthen\b/g, ">")
    .replace(/\band\b/g, "&")
    .replace(/\bor\b/g, "|")
    .replace(/\bnot\b/g, "!");

  // 2. LIMPIEZA DE ESPACIOS
  s = s.replace(/\s+/g, "");
  
  // 3. ELIMINACIÓN DE PARÉNTESIS REDUNDANTES
  while (true) {
    if (!s.startsWith("(") || !s.endsWith(")")) break;
    
    let depth = 0;
    let isPair = true;
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === "(") depth++;
      if (s[i] === ")") depth--;
      if (depth === 0) {
        isPair = false; 
        break;
      }
    }
    
    if (isPair) s = s.slice(1, -1);
    else break;
  }
  return s;
};

export const parse = (formula) => {
  const s = clean(formula);

  let depth = 0;

  // 1. IMPLICACIÓN (>)
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (depth === 0 && char === ">") {
      return { type: "IMPLICATION", left: parse(s.substring(0, i)), right: parse(s.substring(i + 1)) };
    }
  }

  // 2. DISYUNCIÓN (|)
  depth = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (depth === 0 && char === "|") {
      return { type: "DISJUNCTION", left: parse(s.substring(0, i)), right: parse(s.substring(i + 1)) };
    }
  }

  // 3. CONJUNCIÓN (&)
  depth = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (depth === 0 && char === "&") {
      return { type: "CONJUNCTION", left: parse(s.substring(0, i)), right: parse(s.substring(i + 1)) };
    }
  }

  // 4. NEGACIÓN (!)
  if (s.startsWith("!")) {
    return { type: "NEGATION", value: parse(s.substring(1)) };
  }

  // 5. ÁTOMO
  return { type: "ATOM", value: s };
};


/* =========================================
   2. HELPERS (HERRAMIENTAS DE COMPARACIÓN)
   ========================================= */

const areEqual = (f1, f2) => {
  return JSON.stringify(f1) === JSON.stringify(f2);
};

const areOpposites = (f1, f2) => {
  // Caso 1: f1 es !f2
  if (f1.type === "NEGATION" && areEqual(f1.value, f2)) return true;
  // Caso 2: f2 es !f1
  if (f2.type === "NEGATION" && areEqual(f2.value, f1)) return true;
  return false;
};


/* =========================================
   3. REGLAS LÓGICAS (EL JUEZ)
   ========================================= */

// --- MODUS PONENS (MPP) ---
const checkMPP = (inputs, conclusion) => {
  const [prem1, prem2] = inputs;
  
  const verify = (mayor, menor) => {
    if (mayor.type !== "IMPLICATION") return false;
    if (!areEqual(mayor.left, menor)) return false;
    return areEqual(mayor.right, conclusion);
  };

  return verify(prem1, prem2) || verify(prem2, prem1);
};

// --- MODUS TOLLENS (MTT) ---
const checkMTT = (inputs, conclusion) => {
  const [prem1, prem2] = inputs;

  const verify = (mayor, menor) => {
    if (mayor.type !== "IMPLICATION") return false;
    if (!areOpposites(mayor.right, menor)) return false;
    return areOpposites(mayor.left, conclusion);
  };

  return verify(prem1, prem2) || verify(prem2, prem1);
};

// --- SILOGISMO DISYUNTIVO (MTP) ---
const checkMTP = (inputs, conclusion) => {
  const [prem1, prem2] = inputs;

  const verify = (mayor, menor) => {
    if (mayor.type !== "DISJUNCTION") return false;
    
    if (areOpposites(mayor.left, menor) && areEqual(mayor.right, conclusion)) return true;
    if (areOpposites(mayor.right, menor) && areEqual(mayor.left, conclusion)) return true;

    return false;
  };

  return verify(prem1, prem2) || verify(prem2, prem1);
};

// --- MODUS PONENDO TOLLENS (MPT) ---
// Estructura: ~(A & B), A ⊢ ~B
const checkMPT = (inputs, conclusion) => {
  const [prem1, prem2] = inputs;

  const verify = (mayor, menor) => {
    // La mayor debe ser NEGACIÓN de una CONJUNCIÓN: ~(A & B)
    if (mayor.type !== "NEGATION" || mayor.value.type !== "CONJUNCTION") return false;
    
    const A = mayor.value.left;
    const B = mayor.value.right;

    // Tengo A, concluyo ~B
    if (areEqual(A, menor) && areOpposites(B, conclusion)) return true;
    
    // Tengo B, concluyo ~A
    if (areEqual(B, menor) && areOpposites(A, conclusion)) return true;

    return false;
  };

  return verify(prem1, prem2) || verify(prem2, prem1);
};

// --- CONJUNCIÓN (CONJ) ---
const checkCONJ = (inputs, conclusion) => {
  const [p1, p2] = inputs;
  if (conclusion.type !== "CONJUNCTION") return false;

  if (areEqual(conclusion.left, p1) && areEqual(conclusion.right, p2)) return true;
  if (areEqual(conclusion.left, p2) && areEqual(conclusion.right, p1)) return true;

  return false;
};

// --- SIMPLIFICACIÓN (SIMP) ---
const checkSIMP = (inputs, conclusion) => {
  const [prem] = inputs;
  if (prem.type !== "CONJUNCTION") return false;

  return areEqual(prem.left, conclusion) || areEqual(prem.right, conclusion);
};

// --- ADICIÓN (ADD) ---
const checkADD = (inputs, conclusion) => {
  const [prem] = inputs;
  if (conclusion.type !== "DISJUNCTION") return false;
  return areEqual(conclusion.left, prem) || areEqual(conclusion.right, prem);
};

// --- DOBLE NEGACIÓN (DN) ---
const checkDN = (inputs, conclusion) => {
  const [prem] = inputs;

  // De !!A a A
  if (prem.type === "NEGATION" && prem.value.type === "NEGATION") {
    if (areEqual(prem.value.value, conclusion)) return true;
  }
  // De A a !!A
  if (conclusion.type === "NEGATION" && conclusion.value.type === "NEGATION") {
    if (areEqual(conclusion.value.value, prem)) return true;
  }
  return false;
};

// --- DE MORGAN (DM) ---
const checkDM = (inputs, conclusion) => {
  const [prem] = inputs;

  // 1. De ~(A & B) -> ~A | ~B
  if (prem.type === "NEGATION" && prem.value.type === "CONJUNCTION") {
    if (conclusion.type === "DISJUNCTION") {
      const notA = { type: "NEGATION", value: prem.value.left };
      const notB = { type: "NEGATION", value: prem.value.right };
      // Verificamos estricto: izquierda con izquierda, derecha con derecha
      return areEqual(conclusion.left, notA) && areEqual(conclusion.right, notB);
    }
  }

  // 2. De ~A | ~B -> ~(A & B)
  if (prem.type === "DISJUNCTION") {
    if (prem.left.type === "NEGATION" && prem.right.type === "NEGATION") {
      const target = {
        type: "NEGATION",
        value: {
          type: "CONJUNCTION",
          left: prem.left.value,
          right: prem.right.value
        }
      };
      return areEqual(conclusion, target);
    }
  }

  // 3. De ~(A | B) -> ~A & ~B
  if (prem.type === "NEGATION" && prem.value.type === "DISJUNCTION") {
    if (conclusion.type === "CONJUNCTION") {
      const notA = { type: "NEGATION", value: prem.value.left };
      const notB = { type: "NEGATION", value: prem.value.right };
      return areEqual(conclusion.left, notA) && areEqual(conclusion.right, notB);
    }
  }

  // 4. De ~A & ~B -> ~(A | B)
  if (prem.type === "CONJUNCTION") {
    if (prem.left.type === "NEGATION" && prem.right.type === "NEGATION") {
      const target = {
        type: "NEGATION",
        value: {
          type: "DISJUNCTION",
          left: prem.left.value,
          right: prem.right.value
        }
      };
      return areEqual(conclusion, target);
    }
  }

  return false;
};


/* =========================================
   4. FUNCIÓN PRINCIPAL (EXPORTADA)
   ========================================= */

export const validateStep = (rule, inputsRaw, outputString) => {
  try {
    const inputs = inputsRaw.map(parse);
    const conclusion = parse(outputString);

    switch (rule) {
      case "MPP": return checkMPP(inputs, conclusion);
      case "MTT": return checkMTT(inputs, conclusion);
      case "MTP": return checkMTP(inputs, conclusion);
      case "MPT": return checkMPT(inputs, conclusion); 
      case "CONJ": return checkCONJ(inputs, conclusion);
      case "SIMP": return checkSIMP(inputs, conclusion);
      case "ADD":  return checkADD(inputs, conclusion);
      case "DN":   return checkDN(inputs, conclusion);
      case "DM":   return checkDM(inputs, conclusion); 
      
      default:
        console.warn(`Regla ${rule} no implementada en logic.js`);
        return false;
    }
  } catch (e) {
    console.error("Error en validación:", e);
    return false;
  }
};