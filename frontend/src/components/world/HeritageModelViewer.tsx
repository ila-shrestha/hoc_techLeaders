"use client";

/**
 * HeritageModelViewer — reusable viewer for heritage 3D destinations.
 *
 * Supports two loading paths, cleanly separated:
 *  - GLB/GLTF via `src` (GLTFLoader)
 *  - Procedural Three.js groups via `build` (factory returning { group, api })
 *
 * The viewer owns the renderer, camera, OrbitControls and animation loop.
 * Model-specific lighting/environment is applied from the model's api.
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface ModelApiLike {
  setLighting?(mode: string): void;
  setLightingPreset?(p: string): void;
  setWireframe?(on: boolean): void;
  setWiresVisible?(v: boolean): void;
  getView?(v: string): { position: THREE.Vector3; target: THREE.Vector3 };
  environment?: { background: THREE.Color; fog: THREE.Color };
  update?(t: number): void;
  dispose?(): void;
}

export interface BuiltModel {
  group: THREE.Object3D;
  api?: ModelApiLike;
}

export interface ViewerContext {
  api?: ModelApiLike;
  /** smoothly move camera to a position/lookAt */
  focus: (position: [number, number, number], target: [number, number, number]) => void;
}

export function HeritageModelViewer({
  src,
  build,
  className = "",
  autoRotate = true,
  onReady,
}: {
  src?: string;
  build?: () => BuiltModel;
  className?: string;
  autoRotate?: boolean;
  onReady?: (ctx: ViewerContext) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const ctxRef = useRef<ViewerContext | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || (!src && !build)) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#1a0d0d");
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // neutral fill lights for GLB path; procedural models bring their own rig
    const fill = new THREE.HemisphereLight("#cfe4ff", "#5a4a33", 0.9);
    scene.add(fill);
    const key = new THREE.DirectionalLight("#fff4e0", 1.2);
    key.position.set(6, 10, 6);
    scene.add(key);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = 1.5;
    controls.maxDistance = 80;

    let model: THREE.Object3D | null = null;
    let api: ModelApiLike | undefined;
    const clock = new THREE.Clock();
    let disposed = false;
    let raf = 0;
    let focusAnim: { t: number; fromP: THREE.Vector3; toP: THREE.Vector3; fromT: THREE.Vector3; toT: THREE.Vector3 } | null = null;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const frameModel = (obj: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const dist = maxDim * 1.6 + 2;
      camera.position.set(center.x + dist * 0.55, center.y + dist * 0.5, center.z + dist * 0.75);
      controls.target.copy(center);
      controls.minDistance = maxDim * 0.25;
      controls.maxDistance = maxDim * 8;
      controls.update();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      api?.update?.(t);
      if (focusAnim) {
        focusAnim.t += 0.05;
        const k = Math.min(focusAnim.t, 1);
        const e = 1 - Math.pow(1 - k, 3);
        camera.position.lerpVectors(focusAnim.fromP, focusAnim.toP, e);
        controls.target.lerpVectors(focusAnim.fromT, focusAnim.toT, e);
        if (k >= 1) focusAnim = null;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const finish = () => {
      if (disposed) return;
      ctxRef.current = {
        api,
        focus: (p, tg) => {
          focusAnim = {
            t: 0,
            fromP: camera.position.clone(),
            toP: new THREE.Vector3(...p),
            fromT: controls.target.clone(),
            toT: new THREE.Vector3(...tg),
          };
        },
      };
      onReady?.(ctxRef.current);
      setState("ready");
    };

    if (build) {
      try {
        const built = build();
        model = built.group;
        api = built.api;
        scene.add(model);
        if (api?.environment) {
          scene.background = api.environment.background;
          scene.fog = new THREE.FogExp2(api.environment.fog, 0.03);
        }
        frameModel(model);
        finish();
      } catch {
        queueMicrotask(() => { if (!disposed) setState("error"); });
      }
    } else if (src) {
      const loader = new GLTFLoader();
      loader.load(
        src,
        (gltf) => {
          if (disposed) return;
          model = gltf.scene;
          // normalise scale + centre
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 6 / maxDim;
          model.scale.setScalar(scale);
          model.position.sub(center.multiplyScalar(scale));
          scene.add(model);
          frameModel(model);
          finish();
        },
        undefined,
        () => { if (!disposed) setState("error"); },
      );
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      api?.dispose?.();
      if (model) {
        model.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose?.();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats?.forEach((mat) => mat?.dispose?.());
        });
        if (model.parent === scene) scene.remove(model);
      }
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, autoRotate]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mountRef} className="h-full w-full" />
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a0d0d] text-xs font-medium uppercase tracking-[0.2em] text-[#F7F0E3]/60">
          Loading model…
        </div>
      )}
      {state === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a0d0d] p-4 text-center text-xs text-[#F7F0E3]/60">
          3D model unavailable
        </div>
      )}
    </div>
  );
}
