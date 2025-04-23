
import { GameProvider } from "@/context/GameContext";
import { GameInterface } from "@/components/game/GameInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-apple-gray-background text-apple-gray-text">
      <GameProvider>
        <GameInterface />
      </GameProvider>
    </div>
  );
};

export default Index;

