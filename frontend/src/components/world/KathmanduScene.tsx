"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heritageSites } from "@/data/heritage";

export const WORLD = { w: 170, h: 104 };

/** Fixed positions for the six documented Ward 16 sites (world units) */
export const SITE_POSITIONS: Record<string, [number, number]> = {
  "siddhi-ganesh": [-52, -18],
  "koncha-dyo": [-28, -34],
  "22-dhara": [8, -38],
  "sitala-ajima": [38, -22],
  "mhepi-ajima": [52, 12],
  gurunakak: [18, 34],
};

/** Deterministic pseudo-random so SSR/client markup stays stable */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Building {
  x: number; z: number; w: number; d: number; h: number;
  wall: string; roof: string; rot: number;
}

/** Procedural Newari-style blocks: plaster walls + pyramid roofs,
    arranged along streets with a central plaza kept clear. */
function makeBuildings(): Building[] {
  const walls = ["#C9A97E", "#B98F63", "#A9714B", "#8B5A3C", "#D9C4A5"];
  const roofs = ["#7A2E1D", "#8F3A24", "#6B2418", "#96402A"];
  const out: Building[] = [];
  let i = 0;
  // ring of blocks around the central plaza and along edges
  for (let gx = -3; gx <= 3; gx++) {
    for (let gz = -2; gz <= 2; gz++) {
      const cx = gx * 24 + (gz % 2 === 0 ? 6 : -6);
      const cz = gz * 22;
      // keep plaza + site clearings open
      if (Math.hypot(cx, cz) < 20) continue;
      if (Object.values(SITE_POSITIONS).some(([sx, sz]) => Math.hypot(cx - sx, cz - sz) < 15)) continue;
      const n = 1 + Math.floor(rand(i) * 2);
      for (let b = 0; b < n; b++) {
        const w = 6 + rand(i * 7 + b) * 7;
        const d = 6 + rand(i * 13 + b) * 7;
        const h = 4 + rand(i * 29 + b) * 5;
        out.push({
          x: cx + (rand(i * 3 + b) - 0.5) * 10,
          z: cz + (rand(i * 5 + b) - 0.5) * 10,
          w, d, h,
          wall: walls[Math.floor(rand(i * 11 + b) * walls.length)],
          roof: roofs[Math.floor(rand(i * 17 + b) * roofs.length)],
          rot: (rand(i * 19 + b) - 0.5) * 0.3,
        });
      }
      i++;
    }
  }
  return out;
}

/** Scattered Newari courtyard trees — trunk + layered foliage cones */
function Trees() {
  const trees = useMemo(() => {
    const out: { x: number; z: number; s: number }[] = [];
    let i = 0;
    for (let gx = -3; gx <= 3; gx++) {
      for (let gz = -2; gz <= 2; gz++) {
        const cx = gx * 24 + (gz % 2 === 0 ? 6 : -6);
        const cz = gz * 22;
        if (Math.hypot(cx, cz) < 22) continue;
        if (Object.values(SITE_POSITIONS).some(([sx, sz]) => Math.hypot(cx - sx, cz - sz) < 16)) continue;
        if (rand(i * 31) < 0.4) {
          out.push({
            x: cx + (rand(i * 37) - 0.5) * 14,
            z: cz + (rand(i * 41) - 0.5) * 14,
            s: 0.7 + rand(i * 43) * 0.7,
          });
        }
        i++;
      }
    }
    return out;
  }, []);
  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.4, 2.2, 6]} />
            <meshStandardMaterial color="#6b4a2f" roughness={1} />
          </mesh>
          <mesh position={[0, 3.1, 0]} castShadow>
            <coneGeometry args={[1.7, 3.2, 7]} />
            <meshStandardMaterial color="#4a6b34" roughness={0.95} />
          </mesh>
          <mesh position={[0, 4.6, 0]}>
            <coneGeometry args={[1.2, 2.2, 7]} />
            <meshStandardMaterial color="#5a7d3e" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const BUILDINGS = makeBuildings();

function Buildings() {
  return (
    <group>
      {BUILDINGS.map((b, i) => (
        <group key={i} position={[b.x, 0, b.z]} rotation={[0, b.rot, 0]}>
          <mesh position={[0, b.h / 2, 0]} castShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.wall} roughness={0.9} />
          </mesh>
          {/* Newari pyramid roof */}
          <mesh position={[0, b.h + b.w * 0.28, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[b.w * 0.78, b.w * 0.56, 4]} />
            <meshStandardMaterial color={b.roof} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Ground() {
  return (
    <group>
      {/* earth base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WORLD.w + 40, WORLD.h + 40]} />
        <meshStandardMaterial color="#7d8f5a" roughness={1} />
      </mesh>
      {/* ward plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[WORLD.w, WORLD.h]} />
        <meshStandardMaterial color="#cbb894" roughness={1} />
      </mesh>
      {/* streets */}
      {[-30, 0, 30].map((z) => (
        <mesh key={`h${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]} receiveShadow>
          <planeGeometry args={[WORLD.w - 8, 7]} />
          <meshStandardMaterial color="#8d7a63" roughness={1} />
        </mesh>
      ))}
      {[-40, 0, 40].map((x) => (
        <mesh key={`v${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.04, 0]} receiveShadow>
          <planeGeometry args={[7, WORLD.h - 8]} />
          <meshStandardMaterial color="#8d7a63" roughness={1} />
        </mesh>
      ))}
      {/* central stupa */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[4.5, 5, 2.4, 12]} />
          <meshStandardMaterial color="#e8e0cf" roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <coneGeometry args={[3.4, 2.6, 12]} />
          <meshStandardMaterial color="#b03a2a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.4, 0]}>
          <sphereGeometry args={[0.7, 12, 12]} />
          <meshStandardMaterial color="#f2c14e" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

interface MarkerProps {
  slug: string;
  position: [number, number, number];
  active: boolean;
  onSelect: (slug: string) => void;
}

function HeritageMarker({ slug, position, active, onSelect }: MarkerProps) {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ring.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.12;
      ring.current.scale.set(s, s, s);
    }
  });
  return (
    <group position={position}>
      {/* small shrine */}
      <mesh position={[0, 1.1, 0]} castShadow onClick={(e) => { e.stopPropagation(); onSelect(slug); }}>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial color={active ? "#f2c14e" : "#a33"} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow onClick={(e) => { e.stopPropagation(); onSelect(slug); }}>
        <coneGeometry args={[1.9, 1.6, 4]} />
        <meshStandardMaterial color="#7A2E1D" roughness={0.8} />
      </mesh>
      {/* pulsing ground ring */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]} onClick={(e) => { e.stopPropagation(); onSelect(slug); }}>
        <ringGeometry args={[3.2, 3.8, 32]} />
        <meshBasicMaterial color={active ? "#f2c14e" : "#F7F0E3"} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Markers({ selected, onSelect }: { selected: string | null; onSelect: (s: string) => void }) {
  return (
    <group>
      {heritageSites.map((s) => {
        const pos = SITE_POSITIONS[s.slug];
        if (!pos) return null;
        return (
          <HeritageMarker
            key={s.slug}
            slug={s.slug}
            position={[pos[0], 0, pos[1]]}
            active={selected === s.slug}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

interface PlayerProps {
  input: React.MutableRefObject<{ x: number; z: number }>;
  playerPos: React.MutableRefObject<THREE.Vector3>;
  onNear: (slug: string | null) => void;
}

function Player({ input, playerPos, onNear }: PlayerProps) {
  const group = useRef<THREE.Group>(null!);
  const pos = useRef(new THREE.Vector3(0, 0, 30));
  const near = useRef<string | null>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const speed = 14;
    const dx = input.current.x * speed * dt;
    const dz = input.current.z * speed * dt;
    pos.current.x = THREE.MathUtils.clamp(pos.current.x + dx, -WORLD.w / 2 + 4, WORLD.w / 2 - 4);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z + dz, -WORLD.h / 2 + 4, WORLD.h / 2 - 4);
    playerPos.current.copy(pos.current);
    g.position.copy(pos.current);
    if (Math.abs(input.current.x) > 0.1 || Math.abs(input.current.z) > 0.1) {
      const target = Math.atan2(input.current.x, input.current.z);
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 10, dt);
    }
    // proximity check → nearest site within 9 units
    let best: string | null = null;
    let bd = 9;
    for (const s of heritageSites) {
      const p = SITE_POSITIONS[s.slug];
      if (!p) continue;
      const d = Math.hypot(pos.current.x - p[0], pos.current.z - p[1]);
      if (d < bd) { bd = d; best = s.slug; }
    }
    if (best !== near.current) {
      near.current = best;
      onNear(best);
    }
  });

  return (
    <group ref={group} position={[0, 0, 30]}>
      {/* traveller — simple robed figure */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <capsuleGeometry args={[0.55, 1.1, 4, 10]} />
        <meshStandardMaterial color="#830000" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color="#e8c9a0" roughness={0.8} />
      </mesh>
    </group>
  );
}

function CameraRig({ target }: { target: React.MutableRefObject<THREE.Vector3> }) {
  useFrame(({ camera }) => {
    const p = target.current;
    const desired = new THREE.Vector3(p.x, 26, p.z + 22);
    camera.position.lerp(desired, 0.06);
    camera.lookAt(p.x, 0, p.z - 4);
  });
  return null;
}

export interface SceneProps {
  inputRef: React.MutableRefObject<{ x: number; z: number }>;
  playerPos: React.MutableRefObject<THREE.Vector3>;
  selected: string | null;
  onSelect: (slug: string) => void;
  onNear: (slug: string | null) => void;
  autoOrbit?: boolean;
  onReady?: () => void;
}

function SceneInner({ inputRef, playerPos, selected, onSelect, onNear, autoOrbit }: SceneProps) {
  const orbit = useRef(0);
  useFrame((_, dt) => {
    if (autoOrbit) orbit.current += dt * 0.08;
  });
  return (
    <>
      <color attach="background" args={["#a8bfd4"]} />
      <fog attach="fog" args={["#a8bfd4", 90, 220]} />
      <hemisphereLight args={["#cfe4ff", "#5a4a33", 0.9]} />
      <directionalLight
        position={[40, 60, 20]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
      />
      <Ground />
      <Buildings />
      <Trees />
      <Markers selected={selected} onSelect={onSelect} />
      {autoOrbit ? (
        <OrbitCamera orbit={orbit} />
      ) : (
        <>
          <Player input={inputRef} playerPos={playerPos} onNear={onNear} />
          <CameraRig target={playerPos} />
        </>
      )}
    </>
  );
}

function OrbitCamera({ orbit }: { orbit: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const a = orbit.current;
    camera.position.set(Math.sin(a) * 55, 42, Math.cos(a) * 55);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function KathmanduScene({ onReady, ...props }: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 30, 40], fov: 45, near: 0.1, far: 400 }}
      gl={{ antialias: true }}
      style={{ background: "#a8bfd4" }}
      onCreated={() => onReady?.()}
    >
      <SceneInner {...props} />
    </Canvas>
  );
}
