import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Escenario from "./Escenario";
import GameScene from "./GameScene";
import "./Nivel-2.css";

export default function Nivel2() {
  const [phase, setPhase]         = useState("idle");    
  const [collisions, setCollisions] = useState(0);
  const [elapsed, setElapsed]     = useState(0);

  // Temporizador: sólo corre mientras se juega
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleStart = () => {
    setPhase("playing");
    setCollisions(0);
    setElapsed(0);
  };

  return (
    <Escenario
      collisions={collisions}
      time={elapsed}
      phase={phase}
      onStart={handleStart}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 7, 9], fov: 50 }}
        shadows
      >
        <GameScene
          phase={phase}
          onCollision={() => setCollisions((c) => c + 1)}
          onWin={() => setPhase("won")}
        />
      </Canvas>
    </Escenario>
  );
}