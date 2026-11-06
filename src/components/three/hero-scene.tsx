"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

// Palet: Emerald + Teal. Dark = neon di atas gelap, light = pastel di atas terang.
const PALETTE = {
  dark: { c1: "#34d399", c2: "#22d3ee", k1: 0.5, k2: 0.34, dots: "#34d399" },
  light: { c1: "#34d399", c2: "#22d3ee", k1: 0.38, k2: 0.3, dots: "#059669" },
};

// Progres scroll 0..1 untuk seluruh halaman.
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}

// Kabut aurora: dua lapis fbm noise yang mengalir pelan, bergeser saat scroll
// dan menyala di sekitar kursor. Alpha dipakai supaya grid/bg di belakang tetap terlihat.
function Aurora({ mode }: { mode: "dark" | "light" }) {
  const { size } = useThree();
  const pal = PALETTE[mode];
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uRes: { value: new THREE.Vector2() },
      uPointer: { value: new THREE.Vector2(9, 9) },
      uC1: { value: new THREE.Color() },
      uC2: { value: new THREE.Color() },
      uK: { value: new THREE.Vector2() },
    }),
    []
  );

  useFrame((s, dt) => {
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    u.uScroll.value = THREE.MathUtils.damp(u.uScroll.value, scrollProgress(), 3, dt);
    u.uRes.value.set(size.width * s.gl.getPixelRatio(), size.height * s.gl.getPixelRatio());
    u.uPointer.value.lerp(s.pointer, 1 - Math.exp(-dt * 4));
    u.uC1.value.set(pal.c1);
    u.uC2.value.set(pal.c2);
    u.uK.value.set(pal.k1, pal.k2);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        vertexShader={`void main(){ gl_Position = vec4(position.xy, 0., 1.); }`}
        fragmentShader={`
          uniform float uTime; uniform float uScroll; uniform vec2 uRes; uniform vec2 uPointer;
          uniform vec3 uC1; uniform vec3 uC2; uniform vec2 uK;
          float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float no(vec2 p){
            vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
            return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y);
          }
          float fbm(vec2 p){ float v = 0., a = .5; for(int i = 0; i < 5; i++){ v += a*no(p); p *= 2.; a *= .5; } return v; }
          void main(){
            vec2 uv = gl_FragCoord.xy / uRes;
            vec2 p = uv * vec2(uRes.x/uRes.y, 1.) * 1.7 + vec2(0., uScroll * 2.5);
            float t = uTime * .07;
            float n1 = fbm(p + vec2(t, -t) + fbm(p*1.3 - t));
            float n2 = fbm(p*.8 + 5. - t);
            float a1 = smoothstep(.45, .85, n1) * uK.x * (1. - uv.y*.5);
            float a2 = smoothstep(.5, .95, n2) * uK.y * uv.x;
            float g = smoothstep(.45, 0., distance(uv, uPointer*.5 + .5)) * .14;
            float a = clamp(a1 + a2 + g, 0., 1.);
            vec3 col = (uC1*(a1+g) + uC2*a2) / max(a1 + a2 + g, .0001);
            gl_FragColor = vec4(col, a);
          }`}
      />
    </mesh>
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
      <pointsMaterial color={color} size={0.028} sizeAttenuation transparent opacity={0.65} depthWrite={false} />
    </points>
  );
}

export default function HeroScene() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === "light" ? "light" : "dark";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const eventSource = typeof document !== "undefined" ? document.body : undefined;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Aurora: gradien lembut, cukup dirender di resolusi rendah (hemat GPU) */}
      <Canvas
        className="absolute! inset-0"
        dpr={0.6}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <Aurora mode={mode} />
      </Canvas>
      {/* Partikel: tajam, resolusi normal */}
      <Canvas
        className="absolute! inset-0"
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        eventSource={eventSource}
        eventPrefix="client"
      >
        <Particles count={isMobile ? 600 : 1500} color={PALETTE[mode].dots} />
      </Canvas>
    </div>
  );
}
