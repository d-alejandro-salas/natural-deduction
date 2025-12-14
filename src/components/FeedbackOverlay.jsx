// src/components/FeedbackOverlay.jsx

import { useEffect, useState } from "react";

// Importa tus imágenes desde assets
import fregeImg from "../assets/frege.png";
import gentzenImg from "../assets/gentzen.png";

export function FeedbackOverlay({ type, message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const isSuccess = type === "success";

  // Configuración de personajes
  const character = isSuccess
    ? {
        name: "Gottlob Frege",
        img: fregeImg,
        color: "border-green-500",
        bg: "bg-green-50",
        rotation: "rotate-3",
        anim: "animate-bounce-slow",
      }
    : {
        name: "Gerhard Gentzen",
        img: gentzenImg,
        color: "border-red-500",
        bg: "bg-red-50",
        rotation: "-rotate-3",
        anim: "animate-shake",
      };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className={`
          relative max-w-md w-full mx-4 transform transition-all duration-300 scale-100
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* 1. EL GLOBITO DE MANGA */}
        <div className={`
          relative z-10 bg-white border-4 ${character.color} rounded-3xl p-6 shadow-2xl
          flex flex-col gap-2 mb-4
        `}>
          {/* Triángulo del globo */}
          <div className={`
            absolute -bottom-4 w-8 h-8 bg-white border-r-4 border-b-4 ${character.color}
            transform rotate-45
            ${isSuccess ? "right-12" : "left-12"}
          `}></div>

          <h3 className={`font-black text-xl uppercase tracking-widest ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {isSuccess ? "¡SENSE & REFERENCE!" : "¡NEIN! DAS IST FALSCH!"}
          </h3>
          
          <p className="text-lg font-bold text-slate-800 font-mono leading-tight">
            {message}
          </p>

          <p className="text-[10px] text-slate-400 text-right mt-2 uppercase font-bold tracking-widest">
            — {character.name}
          </p>

          {/* --- BOTÓN CERRAR --- */}
          {/* Lo movimos a -15px para que flote más afuera y sea más fácil de cliquear */}
          <button 
            onClick={onClose}
            className="absolute top-[-15px] right-[-15px] bg-white text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-full p-2 shadow-lg transition-all active:scale-90 z-50"
            title="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>

        </div>

        {/* 2. LA IMAGEN DEL PERSONAJE */}
        <div className={`
          flex w-full 
          ${isSuccess ? "justify-end" : "justify-start"}
        `}>
          <div className={`
            relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl
            transform ${character.rotation} hover:scale-110 transition-transform duration-300 cursor-pointer
            ${character.anim}
          `}
          onClick={onClose}
          >
            <img 
              src={character.img} 
              alt={character.name}
              className="w-full h-full object-cover"
            />
            {/* Filtro de color suave */}
            <div className={`absolute inset-0 ${character.bg} mix-blend-multiply opacity-20`}></div>
          </div>
        </div>

      </div>
    </div>
  );
}