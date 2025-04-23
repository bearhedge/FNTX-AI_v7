import { GameProvider } from "@/context/GameContext";
import { GameInterface } from "@/components/game/GameInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-terminal-dark text-terminal-text">
      <GameProvider>
        <GameInterface />
      </GameProvider>
    </div>
  );
};

export default Index;
