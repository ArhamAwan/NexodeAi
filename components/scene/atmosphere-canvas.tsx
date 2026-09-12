"use client";

/* Three.js atmosphere buffers are mutated each frame — intentional. */
/* eslint-disable react-hooks/immutability */

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || navigator.maxTouchPoints > 0;
}

function CssFallback() {
  return <div aria-hidden className="absolute inset-0 bg-[#0A0A0A]" />;
}

class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <CssFallback />;
    return this.props.children;
  }
}

function Atmosphere({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size, camera } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const rand = seeded(91 + count);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (rand() - 0.5) * 14;
      arr[i * 3 + 1] = (rand() - 0.5) * 8;
      arr[i * 3 + 2] = (rand() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [size.width, size.height]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.04;
      pointsRef.current.rotation.x =
        Math.sin(t * 0.15) * 0.06 + mouse.current.y * 0.08;
      pointsRef.current.rotation.z = mouse.current.x * 0.05;
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.12 + mouse.current.y * 0.15;
      meshRef.current.rotation.y = t * 0.18 + mouse.current.x * 0.2;
      meshRef.current.position.y = Math.sin(t * 0.4) * 0.15;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.08;
      torusRef.current.rotation.y = -t * 0.1;
      torusRef.current.rotation.z = t * 0.05;
    }
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      mouse.current.x * 0.35,
      0.03,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      mouse.current.y * 0.2,
      0.03,
    );
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#F4F1EC"
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <mesh ref={meshRef} scale={1.65}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#F4F1EC"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      <mesh ref={torusRef} scale={2.1} rotation={[0.6, 0.2, 0]}>
        <torusGeometry args={[1, 0.28, 12, 48]} />
        <meshBasicMaterial
          color="#F4F1EC"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}

export function AtmosphereCanvas() {
  const [ok, setOk] = useState(true);
  const reduced = prefersReducedMotion();
  const mobile = isMobile();

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setOk(false);
    } catch {
      setOk(false);
    }
  }, []);

  if (reduced || !ok) return <CssFallback />;

  return (
    <div aria-hidden className="absolute inset-0 -z-0">
      <SceneErrorBoundary>
        <Canvas
          dpr={mobile ? 1 : [1, 2]}
          camera={{ position: [0, 0, 6.2], fov: 48 }}
          flat
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: mobile ? "low-power" : "high-performance",
            failIfMajorPerformanceCaveat: false,
            stencil: false,
            depth: true,
          }}
          style={{ width: "100%", height: "100%", display: "block" }}
          onCreated={({ gl }) => {
            gl.setClearColor("#0A0A0A", 1);
            const ctx = gl.getContext();
            // Ordered dither + dark radial CSS overlays = fake “scanline” banding
            ctx.disable(ctx.DITHER);
          }}
        >
          <color attach="background" args={["#0A0A0A"]} />
          {/* Soft fog only — harsh near/far distances band into rings */}
          <fog attach="fog" args={["#0A0A0A", 8, 18]} />
          <Atmosphere count={mobile ? 60 : 180} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}
