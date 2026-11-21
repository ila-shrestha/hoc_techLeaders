import * as THREE from "three";

/**
 * Koncha Dyo Shrine — Newari Wooden Pavilion diorama.
 * Faithful port of the standalone Three.js HTML implementation.
 * Returns a Group plus an api for lighting presets, wireframe and flame flicker.
 */

export interface ModelApi {
  setLighting: (mode: "day" | "devotional") => void;
  setWireframe: (on: boolean) => void;
  /** current background/fog colours for the host scene */
  environment: { background: THREE.Color; fog: THREE.Color };
  /** call each frame with elapsed seconds for flame flicker */
  update: (t: number) => void;
  dispose: () => void;
}

export function buildKonchaDyo(): { group: THREE.Group; api: ModelApi } {
  const dioramaGroup = new THREE.Group();
  let lightingMode: "day" | "devotional" = "day";

  function createNoiseTexture(colorBase: string, colorNoise: string, size = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = colorBase;
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < size * size * 0.15; i++) {
      ctx.fillStyle = colorNoise;
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 1.5 + 0.5;
      ctx.fillRect(x, y, r, r);
    }
    return new THREE.CanvasTexture(canvas);
  }

  function createBrickTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#6e352b";
    ctx.fillRect(0, 0, 512, 512);
    const rows = 24, cols = 12, rh = 512 / rows, cw = 512 / cols;
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cw / 2);
      for (let c = -1; c <= cols; c++) {
        const x = c * cw + offset;
        const y = r * rh;
        const hueVar = Math.random() * 40 - 20;
        ctx.fillStyle = `rgb(${155 + hueVar}, ${75 + hueVar / 2}, ${60 + hueVar / 2})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, rh - 2);
        if (Math.random() > 0.4) {
          ctx.fillStyle = "rgba(215, 185, 160, 0.25)";
          ctx.fillRect(x + 1, y + 1, (cw - 2) * Math.random(), rh - 2);
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  const brickTex = createBrickTexture();
  const darkWoodTex = createNoiseTexture("#2d1a12", "#1a0e0a");
  const goldTex = createNoiseTexture("#c59b27", "#8e6b12");
  const stoneTex = createNoiseTexture("#8c847b", "#605953");
  const vermilionTex = createNoiseTexture("#b5241b", "#d84c1a");

  const matStone = new THREE.MeshStandardMaterial({ color: 0x888078, map: stoneTex, roughness: 0.85 });
  const matBrick = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.8 });
  const matWood = new THREE.MeshStandardMaterial({ color: 0x42261b, map: darkWoodTex, roughness: 0.75 });
  const matWoodOrnate = new THREE.MeshStandardMaterial({ color: 0x3d2116, map: darkWoodTex, roughness: 0.7 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xdcae34, map: goldTex, roughness: 0.35, metalness: 0.75 });
  const matVermilion = new THREE.MeshStandardMaterial({ color: 0xb22216, map: vermilionTex, roughness: 0.9 });
  const matTorana = new THREE.MeshStandardMaterial({ color: 0x6e352b, roughness: 0.65 });
  const matIron = new THREE.MeshStandardMaterial({ color: 0x2b2927, roughness: 0.8, metalness: 0.6 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 2.8), matStone);
  base.position.set(0, 0.125, 0);
  base.receiveShadow = true;
  dioramaGroup.add(base);

  const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.4), matStone);
  step.position.set(0, 0.29, 1.3);
  step.receiveShadow = true;
  dioramaGroup.add(step);

  const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 2.5), matBrick);
  plinth.position.set(0, 0.31, -0.05);
  plinth.receiveShadow = true;
  plinth.castShadow = true;
  dioramaGroup.add(plinth);

  const wallH = 2.1;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(3.1, wallH, 0.25), matBrick);
  backWall.position.set(0, 0.37 + wallH / 2, -1.1);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  dioramaGroup.add(backWall);

  const sideWallGeo = new THREE.BoxGeometry(0.25, wallH, 2.1);
  const leftWall = new THREE.Mesh(sideWallGeo, matBrick);
  leftWall.position.set(-1.45, 0.37 + wallH / 2, -0.05);
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  dioramaGroup.add(leftWall);
  const rightWall = leftWall.clone();
  rightWall.position.x = 1.45;
  dioramaGroup.add(rightWall);

  const nicheGroup = new THREE.Group();
  nicheGroup.position.set(0, 1.8, -0.96);
  const triangularGeo = new THREE.ConeGeometry(0.18, 0.22, 3);
  triangularGeo.rotateY(Math.PI);
  nicheGroup.add(new THREE.Mesh(triangularGeo, matBrick));
  dioramaGroup.add(nicheGroup);

  const shrineGroup = new THREE.Group();
  shrineGroup.position.set(0, 0.42, -0.4);

  const deityGeo = new THREE.SphereGeometry(0.24, 24, 24);
  deityGeo.scale(1.0, 1.15, 0.9);
  const deity = new THREE.Mesh(deityGeo, matVermilion);
  deity.position.set(0, 0.24, 0);
  deity.castShadow = true;
  shrineGroup.add(deity);

  const lotus = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.08, 16), matVermilion);
  lotus.position.set(0, 0.04, 0);
  lotus.castShadow = true;
  shrineGroup.add(lotus);

  const backStela = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.12), matStone);
  backStela.position.set(0, 0.32, -0.15);
  backStela.castShadow = true;
  shrineGroup.add(backStela);
  const leftStela = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.46, 0.1), matStone);
  leftStela.position.set(-0.52, 0.25, -0.1);
  leftStela.rotation.y = 0.25;
  leftStela.castShadow = true;
  shrineGroup.add(leftStela);
  const rightStela = leftStela.clone();
  rightStela.position.x = 0.52;
  rightStela.rotation.y = -0.25;
  shrineGroup.add(rightStela);

  const bellStand = new THREE.Group();
  bellStand.position.set(-0.45, 0.05, 0.25);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), matIron);
  pole.position.set(0, 0.225, 0);
  bellStand.add(pole);
  const bell = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.08, 8), matGold);
  bell.position.set(0, 0.35, 0.06);
  bellStand.add(bell);
  shrineGroup.add(bellStand);

  const lampStand = new THREE.Group();
  lampStand.position.set(0.42, 0.05, 0.2);
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 8), matIron);
  lampPole.position.set(0, 0.2, 0);
  lampStand.add(lampPole);
  const lampTray = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 8), matIron);
  lampTray.position.set(0, 0.4, 0);
  lampStand.add(lampTray);
  shrineGroup.add(lampStand);

  const flowerColors = [0xdf8418, 0xd45014, 0xd49b14];
  for (let i = 0; i < 24; i++) {
    const flowerMat = new THREE.MeshStandardMaterial({
      color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
      roughness: 0.9,
    });
    const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.018), flowerMat);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.2 + Math.random() * 0.4;
    flower.position.set(Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius + 0.1);
    shrineGroup.add(flower);
  }
  dioramaGroup.add(shrineGroup);

  const facadeGroup = new THREE.Group();
  facadeGroup.position.set(0, 0.42, 0.95);

  const pillarGeo = new THREE.BoxGeometry(0.24, 1.45, 0.24);
  const leftPillar = new THREE.Mesh(pillarGeo, matWoodOrnate);
  leftPillar.position.set(-1.15, 0.725, 0);
  leftPillar.castShadow = true;
  leftPillar.receiveShadow = true;
  facadeGroup.add(leftPillar);
  const rightPillar = leftPillar.clone();
  rightPillar.position.x = 1.15;
  facadeGroup.add(rightPillar);

  const lowerBeam = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.15, 0.28), matWoodOrnate);
  lowerBeam.position.set(0, 1.42, 0.02);
  lowerBeam.castShadow = true;
  facadeGroup.add(lowerBeam);

  const doorGeo = new THREE.BoxGeometry(0.42, 1.25, 0.04);
  const leftDoor = new THREE.Mesh(doorGeo, matWoodOrnate);
  leftDoor.position.set(-0.48, 0.625, -0.15);
  leftDoor.rotation.y = Math.PI / 3;
  facadeGroup.add(leftDoor);
  const rightDoor = new THREE.Mesh(doorGeo, matWoodOrnate);
  rightDoor.position.set(0.48, 0.625, -0.15);
  rightDoor.rotation.y = -Math.PI / 3;
  facadeGroup.add(rightDoor);

  const screenGeo = new THREE.BoxGeometry(0.48, 1.1, 0.05);
  const leftScreen = new THREE.Mesh(screenGeo, matWoodOrnate);
  leftScreen.position.set(-0.85, 0.55, 0);
  leftScreen.castShadow = true;
  facadeGroup.add(leftScreen);
  const rightScreen = leftScreen.clone();
  rightScreen.position.x = 0.85;
  facadeGroup.add(rightScreen);

  const toranaArchGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.15, 32, 1, false, 0, Math.PI);
  toranaArchGeo.rotateX(Math.PI / 2);
  toranaArchGeo.scale(1.1, 0.75, 1.0);
  const torana = new THREE.Mesh(toranaArchGeo, matTorana);
  torana.position.set(0, 1.62, 0.12);
  torana.castShadow = true;
  facadeGroup.add(torana);

  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 8), matGold);
  finial.position.set(0, 2.05, 0.12);
  finial.castShadow = true;
  facadeGroup.add(finial);

  const upperH = 0.85;
  const upperWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, upperH, 1.4), matBrick);
  upperWall.position.set(0, 1.95 + upperH / 2, -0.3);
  upperWall.castShadow = true;
  facadeGroup.add(upperWall);

  const paintingLeft = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.03), matWood);
  paintingLeft.position.set(-0.75, 2.35, 0.4);
  facadeGroup.add(paintingLeft);
  const paintingRight = paintingLeft.clone();
  paintingRight.position.x = 0.75;
  facadeGroup.add(paintingRight);

  const roofBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 2.1), matWood);
  roofBase.position.set(0, 2.85, -0.15);
  roofBase.castShadow = true;
  facadeGroup.add(roofBase);
  const roofTop = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.12, 2.2), matWoodOrnate);
  roofTop.position.set(0, 2.95, -0.15);
  roofTop.castShadow = true;
  facadeGroup.add(roofTop);

  for (let i = 0; i < 5; i++) {
    const gajur = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 8), matGold);
    gajur.position.set(-1.1 + i * 0.55, 3.05, 0.8);
    facadeGroup.add(gajur);
  }
  dioramaGroup.add(facadeGroup);

  // Devotional lighting rig — carried inside the group so it travels with the model
  const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.7);
  dioramaGroup.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffebd2, 1.5);
  dirLight.position.set(6, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  const d = 6;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  dioramaGroup.add(dirLight);
  const pointLight = new THREE.PointLight(0xff7722, 1.8, 4.0);
  pointLight.position.set(0, 0.6, -0.3);
  pointLight.castShadow = true;
  pointLight.shadow.bias = -0.002;
  dioramaGroup.add(pointLight);
  const flameLight = new THREE.PointLight(0xff9900, 1.2, 2.5);
  flameLight.position.set(-0.35, 0.25, -0.2);
  dioramaGroup.add(flameLight);

  const bgColor = new THREE.Color(0xe2e0e0);
  const fogColor = new THREE.Color(0xe2e0e0);

  return { group: dioramaGroup, api: { setLighting, setWireframe, update, dispose, environment: { background: bgColor, fog: fogColor } } };

  function setLighting(mode: "day" | "devotional") {
    lightingMode = mode;
    if (mode === "devotional") {
      dirLight.intensity = 0.3;
      ambientLight.intensity = 0.25;
      pointLight.intensity = 3.5;
      flameLight.intensity = 2.0;
      bgColor.setHex(0x1a1515);
      fogColor.setHex(0x1a1515);
    } else {
      dirLight.intensity = 1.5;
      ambientLight.intensity = 0.7;
      pointLight.intensity = 1.8;
      flameLight.intensity = 1.2;
      bgColor.setHex(0xe2e0e0);
      fogColor.setHex(0xe2e0e0);
    }
  }

  function setWireframe(on: boolean) {
    dioramaGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = (child as THREE.Mesh).material as THREE.Material | THREE.Material[];
        const arr = Array.isArray(m) ? m : [m];
        arr.forEach((mat) => { (mat as THREE.MeshStandardMaterial).wireframe = on; });
      }
    });
  }

  function update(t: number) {
    flameLight.intensity =
      (lightingMode === "devotional" ? 2.0 : 1.2) +
      Math.sin(t * 12) * 0.25 +
      Math.cos(t * 23) * 0.15;
    pointLight.intensity =
      (lightingMode === "devotional" ? 3.5 : 1.8) + Math.sin(t * 7) * 0.15;
  }

  function dispose() {
    dioramaGroup.traverse((child) => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      (Array.isArray(m) ? m : [m]).forEach((mat) => {
        if (!mat) return;
        const sm = mat as THREE.MeshStandardMaterial;
        sm.map?.dispose();
        mat.dispose();
      });
    });
    [brickTex, darkWoodTex, goldTex, stoneTex, vermilionTex].forEach((t) => t.dispose());
  }
}
