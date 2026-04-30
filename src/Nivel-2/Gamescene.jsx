import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

// ─── Constants ───────────────────────────────────────────
const LANE_A   = -0.9;   
const LANE_B   =  0.9;   
const START_X  = -6.2;
const FINISH_X =  6.2;
const CAT_SPEED = 1.7;   
const GRAVITY  = 11;
const COLL_R   = 0.65;  
const CUBE_COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c77dff", "#ff9f43"];

// ─── Cubo que cae ────────────────────────────────────────
function FallingCube({ data, catRef, active, onCollision }) {
  const ref   = useRef();
  const vy    = useRef(0);
  const bvy   = useRef(0);          // velocidad de rebote
  const phase = useRef("fall");     // fall | bounce | rest
  const hit   = useRef(false);

  const spin = useRef([
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 3,
  ]);

  useFrame((_, dt) => {
    if (!ref.current || !active) return;
    const pos = ref.current.position;

    // Rotar mientras esté en el aire
    if (pos.y > 0.4) {
      ref.current.rotation.x += spin.current[0] * dt;
      ref.current.rotation.y += spin.current[1] * dt;
    }

    if (phase.current === "fall") {
      vy.current += GRAVITY * dt;
      pos.y -= vy.current * dt;
      if (pos.y <= 0.25) {
        pos.y = 0.25;
        bvy.current = vy.current * 0.52;
        vy.current = 0;
        phase.current = "bounce";
      }
    } else if (phase.current === "bounce") {
      bvy.current -= GRAVITY * dt;
      pos.y += bvy.current * dt;
      if (pos.y <= 0.25) {
        pos.y = 0.25;
        if (Math.abs(bvy.current) < 0.7) {
          phase.current = "rest";
        } else {
          bvy.current = Math.abs(bvy.current) * 0.5;
        }
      }
    }

    // Detección de colisión (solo cuando está cerca del suelo)
    if (catRef.current && !hit.current && pos.y < 1.0) {
      const cp = catRef.current.position;
      const dx = pos.x - cp.x;
      const dz = pos.z - cp.z;
      if (Math.sqrt(dx * dx + dz * dz) < COLL_R) {
        hit.current = true;
        onCollision();
        // Rebotar dramáticamente al chocar
        bvy.current = 5 + Math.random() * 4;
        phase.current = "bounce";
        pos.y = 0.3;
        spin.current = [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 10,
        ];
        // Cooldown para no contar doble
        setTimeout(() => { hit.current = false; }, 1500);
      }
    }
  });

  return (
    <mesh ref={ref} position={[data.x, data.y, data.z]} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color={CUBE_COLORS[data.id % CUBE_COLORS.length]}
        roughness={0.25}
        metalness={0.2}
      />
    </mesh>
  );
}

// ─── Carretera ───────────────────────────────────────────
function Road() {
  return (
    <>
      {/* Asfalto oscuro */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 4.6]} />
        <meshStandardMaterial color="#0d1117" />
      </mesh>

      {/* Líneas punteadas del centro */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-7.5 + i * 1.4, 0, 0]}>
          <planeGeometry args={[0.75, 0.07]} />
          <meshStandardMaterial color="#ffffff" opacity={0.18} transparent />
        </mesh>
      ))}

      {/* Bordes verdes */}
      {[-2.3, 2.3].map((z, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, z]}>
          <planeGeometry args={[16, 0.22]} />
          <meshStandardMaterial color="#00A86B" emissive="#00A86B" emissiveIntensity={0.35} />
        </mesh>
      ))}

      {/* Portón INICIO (verde) */}
      {[-0.9, 0, 0.9].map((z, i) => (
        <mesh key={`ig-${i}`} position={[-7.3, 0.8, z]}>
          <boxGeometry args={[0.1, 1.6, 0.1]} />
          <meshStandardMaterial color="#00A86B" emissive="#00A86B" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <mesh position={[-7.3, 1.65, 0]}>
        <boxGeometry args={[0.1, 0.1, 4.5]} />
        <meshStandardMaterial color="#00A86B" emissive="#00A86B" emissiveIntensity={0.5} />
      </mesh>

      {/* Portón META (rojo) */}
      {[-0.9, 0, 0.9].map((z, i) => (
        <mesh key={`mg-${i}`} position={[7.3, 0.8, z]}>
          <boxGeometry args={[0.1, 1.6, 0.1]} />
          <meshStandardMaterial color="#ff4d4d" emissive="#ff4d4d" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <mesh position={[7.3, 1.65, 0]}>
        <boxGeometry args={[0.1, 0.1, 4.5]} />
        <meshStandardMaterial color="#ff4d4d" emissive="#ff4d4d" emissiveIntensity={0.5} />
      </mesh>
    </>
  );
}

// ─── Escena principal ─────────────────────────────────────
export default function GameScene({ phase, onCollision, onWin }) {
  const { scene, animations } = useGLTF("/gatito.glb");

  // Dos refs: uno para mover el grupo, otro para animar el primitivo
  const catGroupRef   = useRef();
  const animTargetRef = useRef();
  const { actions, names } = useAnimations(animations, animTargetRef);
  const currentAnim = useRef(null);
  const hasWon      = useRef(false);

  const [cubes, setCubes] = useState([]);
  const cubeId = useRef(0);

  // ── Helpers de animación ───────────────────────────────
  const playAnim = (name) => {
    if (currentAnim.current === name) return;
    Object.values(actions).forEach((a) => a?.fadeOut(0.3));
    const a = actions[name] ?? actions[names[0]];
    if (a) { a.reset().fadeIn(0.3).play(); currentAnim.current = name; }
  };

  // Idle al cargar el modelo
  useEffect(() => {
    const idle = names.find((n) => n !== "take001") ?? names[0];
    if (idle) playAnim(idle);
  }, [actions]);

  // Reinicio al cambiar de fase
  useEffect(() => {
    hasWon.current = false;
    setCubes([]);
    if (catGroupRef.current) {
      catGroupRef.current.position.set(START_X, 0, LANE_A);
      // Ajusta este ángulo según la orientación de tu modelo
      catGroupRef.current.rotation.y = -Math.PI / 2;
    }
    if (phase !== "playing") {
      const idle = names.find((n) => n !== "take001") ?? names[0];
      if (idle) playAnim(idle);
    }
  }, [phase]);

  // Generador de cubos (intervalo fuera del loop de render)
  useEffect(() => {
    if (phase !== "playing") return;
    const timer = setInterval(() => {
      const x = -5.5 + Math.random() * 10;
      const z = Math.random() > 0.5 ? LANE_A : LANE_B;
      const yStart = 5 + Math.random() * 3.5; // altura inicial variada
      setCubes((prev) => [
        ...prev.slice(-14),   // máximo 15 cubos en escena
        { id: cubeId.current++, x, y: yStart, z },
      ]);
    }, 1100);
    return () => clearInterval(timer);
  }, [phase]);

  // ── Loop de juego ─────────────────────────────────────
  useFrame((state, dt) => {
    if (!catGroupRef.current || phase !== "playing") return;

    // Avanzar a la derecha automáticamente
    catGroupRef.current.position.x += CAT_SPEED * dt;

    // Carril según posición Y del mouse (arriba = carril A, abajo = carril B)
    const targetZ = state.mouse.y > 0 ? LANE_A : LANE_B;
    catGroupRef.current.position.z +=
      (targetZ - catGroupRef.current.position.z) * 0.1;

    playAnim("take001");

    // Condición de victoria
    if (!hasWon.current && catGroupRef.current.position.x >= FINISH_X) {
      hasWon.current = true;
      const idle = names.find((n) => n !== "take001") ?? names[0];
      if (idle) playAnim(idle);
      onWin();
    }
  });

  return (
    <>
      {/* Iluminación */}
      <fog attach="fog" args={["#020817", 12, 28]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 3]} intensity={1.3} castShadow />
      <pointLight position={[-7.3, 2, 0]} color="#00A86B" intensity={1.2} distance={6} />
      <pointLight position={[7.3, 2, 0]}  color="#ff4d4d" intensity={1.2} distance={6} />

      <Road />

      {cubes.map((c) => (
        <FallingCube
          key={c.id}
          data={c}
          catRef={catGroupRef}
          active={phase === "playing"}
          onCollision={onCollision}
        />
      ))}

      {/* Gatito — grupo para posición, primitivo para animación */}
      <group ref={catGroupRef} position={[START_X, 0, LANE_A]}>
        <primitive ref={animTargetRef} object={scene} scale={0.9} />
      </group>
    </>
  );
}