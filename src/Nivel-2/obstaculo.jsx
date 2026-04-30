import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Obstaculo({ position, gatoPos, onHit }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current || !gatoPos) return;

    ref.current.position.z += 0.25; // más rápido

    if (ref.current.position.z > 5) {
      ref.current.position.z = -20 - Math.random() * 10;
    }

    const dx = Math.abs(ref.current.position.x - gatoPos.x);
    const dz = Math.abs(ref.current.position.z - gatoPos.z);

    if (dx < 1 && dz < 1) {
      onHit?.();

      ref.current.position.z = -20;

      // rebote visual
      ref.current.scale.y = 2;
      setTimeout(() => {
        if (ref.current) ref.current.scale.y = 1;
      }, 150);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}