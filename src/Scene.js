import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Scene() {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.x = ref.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={ref}>
      <boxBufferGeometry />
      <meshNormalMaterial />
    </mesh>
  );
}
