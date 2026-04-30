import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Escenario from "./Escenario";
import Gatito from "./Gatito";
import Obstaculo from "./Obstaculo";
import "./Nivel-2.css";

export default function Nivel2() {
  const [gatoPos, setGatoPos] = useState(null);
  const [golpes, setGolpes] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [fin, setFin] = useState(false);

  useEffect(() => {
    if (fin) return;

    const interval = setInterval(() => {
      setTiempo((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [fin]);

  return (
    <Escenario>
      {/* UI */}
      <div className="ui">
        <p>Golpes: {golpes}</p>
        <p>Tiempo: {tiempo}s</p>
      </div>

      {fin && (
        <div className="resultado">
          <h2>🏁 Nivel completado</h2>
          <p>Tiempo: {tiempo}s</p>
          <p>Colisiones: {golpes}</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 6] }}>
        <ambientLight intensity={1} />

        <Gatito
          onMove={setGatoPos}
          onFinish={() => setFin(true)}
        />

        {/* MUCHOS obstáculos */}
        {[...Array(6)].map((_, i) => (
          <Obstaculo
            key={i}
            position={[
              i % 2 === 0 ? -1.5 : 1.5,
              0,
              -10 - i * 5,
            ]}
            gatoPos={gatoPos}
            onHit={() => setGolpes((g) => g + 1)}
          />
        ))}
      </Canvas>
    </Escenario>
  );
}