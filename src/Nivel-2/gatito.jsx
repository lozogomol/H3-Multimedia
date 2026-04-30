import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const SPEED_Z = 0.05;
const carriles = [-1.5, 1.5];

export default function Gatito({ onMove, onFinish, ...props }) {
  const { scene, animations } = useGLTF("/gatito.glb");
  const ref = useRef();
  const { actions, names } = useAnimations(animations, ref);

  const carrilActual = useRef(0); // 0 = izq, 1 = der

  const playAnim = (name) => {
    Object.values(actions).forEach((a) => a?.fadeOut(0.3));
    const anim = actions[name] ?? actions[names[0]];
    if (anim) anim.reset().fadeIn(0.3).play();
  };

  useEffect(() => {
    playAnim("take001"); // siempre en movimiento
  }, [actions]);

  // click → cambiar carril
  const handleClick = (e) => {
    e.stopPropagation();
    carrilActual.current = e.point.x > 0 ? 1 : 0;
  };

  useFrame(() => {
    if (!ref.current) return;

    // avanzar hacia meta
    ref.current.position.z += SPEED_Z;

    // moverse SOLO en X
    const targetX = carriles[carrilActual.current];
    ref.current.position.x += (targetX - ref.current.position.x) * 0.2;

    // rotación leve
    ref.current.rotation.y = carrilActual.current === 0 ? 0.3 : -0.3;

    onMove?.(ref.current.position);

    // META
    if (ref.current.position.z > 20) {
      onFinish?.();
    }
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={handleClick}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <primitive ref={ref} object={scene} scale={0.9} position={[0, 0, -20]} />
    </>
  );
}