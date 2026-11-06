"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Progres scroll 0..1 untuk seluruh halaman.
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}

function Core({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null!);
  const wire = useRef<THREE.Mesh>(null!);
  const solid = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state, dt) => {
    const p = scrollProgress();
    const { x, y } = state.pointer;
    const g = group.current;

    // Objek berputar pelan, miring mengikuti kursor, dan "berjalan" ke
    // samping + mengecil seiring scroll supaya selalu melayani konten.
    g.rotation.y += dt * 0.18;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * 0.5 + p * Math.PI * 3, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -x * 0.3, 3, dt);

    const aspect = state.viewport.aspect;
    const side = aspect > 1 ? 1 : 0; // di mobile tetap di tengah
    const tx = side * (Math.cos(p * Math.PI * 2.5) * 2.4 + 1.2) * (1 - p * 0.35);
    const ty = aspect > 1 ? 0 : 1.2 - p * 1.2;
    g.position.x = THREE.MathUtils.damp(g.position.x, tx, 2.5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty, 2.5, dt);
    const s = (aspect > 1 ? 1 : 0.7) * (1 - p * 0.45);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 2.5, dt));

    wire.current.rotation.y -= dt * 0.1;
    // Meredup saat scroll supaya konten tetap terbaca
    solid.current.opacity = 0.9 - p * 0.55;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.25, 12]} />
        <MeshDistortMaterial
          ref={solid as never}
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.25}
          metalness={0.8}
          distort={0.45}
          speed={1.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh ref={wire} scale={1.55}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Particles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // PRNG deterministik (mulberry32) — render tetap murni & stabil.
    let seed = 1337;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      // Titik tersebar di cangkang bola besar
      const r = 4 + rand() * 7;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 4;
    }
    return arr;
  }, [count]);

  useFrame((state, dt) => {
    const pts = ref.current;
    pts.rotation.y += dt * 0.025;
    pts.rotation.x = THREE.MathUtils.damp(pts.rotation.x, state.pointer.y * 0.12, 2, dt);
    pts.rotation.z = THREE.MathUtils.damp(pts.rotation.z, scrollProgress() * 1.2, 2, dt);
    pts.position.x = THREE.MathUtils.damp(pts.position.x, state.pointer.x * 0.5, 2, dt);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.028}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";
  const color = dark ? "#c7f24a" : "#2f9e44";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700"
      style={{ opacity: dark ? 1 : 0.55 }}
    >
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        // Kanvas tidak menerima klik (pointer-events-none), jadi dengarkan
        // gerakan kursor dari body.
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 3, 5]} intensity={40} color={color} />
        <pointLight position={[-5, -3, 2]} intensity={18} color="#4ad3ff" />
        <Core color={color} />
        <Particles count={isMobile ? 700 : 1800} color={color} />
      </Canvas>
    </div>
  );
}
