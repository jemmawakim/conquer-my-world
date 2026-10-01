"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";

const BLOB_COLORS = { idle: "#7c3aed", poked: "#f97316" } as const;

function Blob() {
  const meshRef = useRef<Mesh>(null);
  const [poked, setPoked] = useState(false);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.x += delta * 0.2;
    mesh.rotation.y += delta * (poked ? 1.2 : 0.35);
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.4}>
      <mesh
        ref={meshRef}
        scale={poked ? 1.15 : 1}
        onPointerOver={() => setPoked(true)}
        onPointerOut={() => setPoked(false)}
      >
        <icosahedronGeometry args={[1.4, 64]} />
        <MeshDistortMaterial
          color={poked ? BLOB_COLORS.poked : BLOB_COLORS.idle}
          distort={poked ? 0.6 : 0.35}
          speed={poked ? 5 : 2}
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function WobbleBlob() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      dpr={[1, 2]}
      aria-label="A wobbling 3D blob"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, -3]} intensity={30} color="#22d3ee" />
      <Blob />
    </Canvas>
  );
}
