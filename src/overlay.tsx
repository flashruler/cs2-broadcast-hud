import { ScoreboardBar } from "./components/ScoreboardBar";
import { useTeamConfig } from "./hooks/useTeamConfig";

function Overlay() {
    const { data: teamConfig, isLoading } = useTeamConfig();

    if (isLoading) {
        return (
            <div className="w-full h-screen" style={{ backgroundColor: '#00FF00' }}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-black bg-white bg-opacity-75 p-4 rounded">
                        Loading team configuration...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen relative" style={{ backgroundColor: '#00FF00' }}>
            {/* Debug info in top-left corner */}
            <div className="absolute top-4 left-4 text-black text-xs bg-white bg-opacity-75 p-2 rounded">
                <div>CT: {teamConfig?.ctName || "Not loaded"}</div>
                <div>T: {teamConfig?.tName || "Not loaded"}</div>
            </div>
            
            {/* Main HUD content */}
            <div className="flex h-full">
                <ScoreboardBar
                    ctScore={10}
                    tScore={10}
                    round={10}
                    maxRounds={24}
                    timer="2:30"
                    ctName={teamConfig?.ctName || "Counter-Terrorists"}
                    tName={teamConfig?.tName || "Terrorists"}
                    ctLogoUrl={teamConfig?.ctLogoUrl || "test"}
                    tLogoUrl={teamConfig?.tLogoUrl || "test"}
                    collapsed={teamConfig?.isCondensed || false}
                />
            </div>
            
            {/* Chroma key guide text */}
            <div className="absolute bottom-4 right-4 text-black text-xs bg-white bg-opacity-75 p-2 rounded">
                Chroma Key: #00FF00 (Bright Green)
            </div>
        </div>
    );
}
export default Overlay;