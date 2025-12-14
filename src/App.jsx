import { useState } from "react";
import ProofSetup from "./components/ProofSetup";
import ProofBoard from "./components/ProofBoard";
import Footer from "./components/Footer";

function App() {
  const [gameStage, setGameStage] = useState("setup");
  const [proofData, setProofData] = useState(null);

  const startProof = (premises, conclusion) => {
    setProofData({ premises, conclusion });
    setGameStage("solving");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-slate-800 selection:bg-primary/20 selection:text-primary">
      
      <header className="py-8 px-4 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Deducción <span className="text-primary">Natural</span>
        </h1>
      </header>

      {/* AQUÍ ESTÁ LA CLAVE: 'flex-1' empuja al footer hacia abajo */}
      <main className="w-full flex-1 flex justify-center px-4 pb-12">
        
        {gameStage === "setup" && (
          <ProofSetup onStartProof={startProof} />
        )}

        {gameStage === "solving" && (
          <ProofBoard
            proofData={proofData}
            onBack={() => setGameStage("setup")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;