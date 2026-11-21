import * as THREE from "three";

/**
 * Siddhi Ganesh Temple Plaza Diorama — faithful port of the standalone
 * Three.js HTML implementation. Returns a Group + api for lighting
 * presets, wires visibility and camera focus points.
 */

export type GaneshPreset = "golden" | "day" | "dusk" | "night";
export type GaneshView = "full" | "temple" | "stupa";

export interface GaneshApi {
  setLightingPreset: (p: GaneshPreset) => void;
  setWiresVisible: (v: boolean) => void;
  /** suggested camera position + lookAt for named views */
  getView: (v: GaneshView) => { position: THREE.Vector3; target: THREE.Vector3 };
  /** current background/fog colours for the host scene */
  environment: { background: THREE.Color; fog: THREE.Color };
  update: (t: number) => void;
  dispose: () => void;
}

export const GANESH_VIEWS: Record<GaneshView, { position: [number, number, number]; target: [number, number, number] }> = {
  full: { position: [16, 12, 18], target: [0, 2.8, 0] },
  temple: { position: [8, 6, 6], target: [2.2, 3.0, -0.8] },
  stupa: { position: [5, 3.5, 8], target: [1.4, 1.5, 3.2] },
};

export function buildSiddhiGanesh(): { group: THREE.Group; api: GaneshApi } {
  const diorama = new THREE.Group();
  const pointLights: THREE.PointLight[] = [];
  let currentLighting: GaneshPreset = "golden";

  function generateBrickCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#8f2e1f";
    ctx.fillRect(0, 0, 512, 512);
    const rows = 32, cols = 16, rh = 512 / rows, cw = 512 / cols;
    for (let i = 0; i < rows; i++) {
      const offset = (i % 2) * (cw / 2);
      for (let j = -1; j <= cols + 1; j++) {
        const x = j * cw + offset, y = i * rh;
        if ((i + j) % 3 === 0) ctx.fillStyle = "#9b3222";
        else if ((i + j) % 5 === 0) ctx.fillStyle = "#b84431";
        else ctx.fillStyle = "#8c2d1e";
        ctx.fillRect(x + 1.5, y + 1.5, cw - 3, rh - 3);
      }
    }
    ctx.strokeStyle = "#3d120a";
    ctx.lineWidth = 1;
    for (let i = 0; i < rows; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * rh); ctx.lineTo(512, i * rh); ctx.stroke();
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function generateRoofTileCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#7a2216"; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#5c170d";
    for (let y = 0; y < 256; y += 16) ctx.fillRect(0, y, 256, 3);
    ctx.fillStyle = "#8f2c1e";
    for (let x = 0; x < 256; x += 16) ctx.fillRect(x, 0, 8, 256);
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function generateWoodCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#2b170e"; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#180c07"; ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * 256);
      ctx.bezierCurveTo(80, Math.random() * 256, 170, Math.random() * 256, 256, Math.random() * 256);
      ctx.stroke();
    }
    return new THREE.CanvasTexture(canvas);
  }
  function generateStoneCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#73706c"; ctx.fillRect(0, 0, 512, 512);
    const step = 64;
    ctx.strokeStyle = "#474542"; ctx.lineWidth = 3;
    for (let x = 0; x < 512; x += step) {
      for (let y = 0; y < 512; y += step) {
        ctx.fillStyle = ((x + y) / step) % 2 === 0 ? "#6e6b67" : "#787570";
        ctx.fillRect(x, y, step, step);
        ctx.strokeRect(x, y, step, step);
      }
    }
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function generateErodedPlasterCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#d6c796"; ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = "#8f2e1f";
    ctx.beginPath(); ctx.ellipse(120, 380, 80, 45, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(400, 150, 60, 35, -Math.PI / 4, 0, Math.PI * 2); ctx.fill();
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "rgba(40, 35, 25, 0.3)");
    grad.addColorStop(0.3, "rgba(0, 0, 0, 0)");
    grad.addColorStop(1, "rgba(30, 25, 15, 0.4)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 512, 512);
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  const texBrick = generateBrickCanvas(); texBrick.repeat.set(3, 3);
  const texRoof = generateRoofTileCanvas(); texRoof.repeat.set(6, 6);
  const texWood = generateWoodCanvas();
  const texStone = generateStoneCanvas(); texStone.repeat.set(8, 8);
  const texEroded = generateErodedPlasterCanvas();

  const materials = {
    brick: new THREE.MeshStandardMaterial({ map: texBrick, roughness: 0.75 }),
    roof: new THREE.MeshStandardMaterial({ map: texRoof, roughness: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ map: texWood, roughness: 0.8 }),
    stone: new THREE.MeshStandardMaterial({ map: texStone, roughness: 0.85 }),
    erodedWall: new THREE.MeshStandardMaterial({ map: texEroded, roughness: 0.9 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xf5bd1b, metalness: 0.85, roughness: 0.25 }),
    brightGold: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.15 }),
    yellowPaint: new THREE.MeshStandardMaterial({ color: 0xefb118, roughness: 0.4 }),
    redPlaster: new THREE.MeshStandardMaterial({ color: 0xa83220, roughness: 0.85 }),
    fabricRed: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.9 }),
    fabricGold: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4, metalness: 0.5 }),
    brass: new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.3 }),
    groundRock: new THREE.MeshStandardMaterial({ color: 0x3d3630, roughness: 0.95 }),
    groundSoil: new THREE.MeshStandardMaterial({ color: 0x4a3a2c, roughness: 0.9 }),
  };

  // lighting rig carried inside the group
  const ambientLight = new THREE.AmbientLight(0xffeedd, 0.5);
  diorama.add(ambientLight);
  const hemiLight = new THREE.HemisphereLight(0xffdfa9, 0x1a1a2e, 0.6);
  diorama.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffad6b, 2.2);
  dirLight.position.set(-14, 18, 12);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  const d = 13;
  dirLight.shadow.camera.left = -d; dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d; dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.near = 0.5; dirLight.shadow.camera.far = 50;
  dirLight.shadow.bias = -0.0004;
  diorama.add(dirLight);

  function createTieredRoof(bottomW: number, topW: number, height: number, hasPataka: boolean) {
    const roofTier = new THREE.Group();
    const pyramidGeo = new THREE.CylinderGeometry(topW / Math.SQRT2, bottomW / Math.SQRT2, height, 4, 1);
    pyramidGeo.rotateY(Math.PI / 4);
    const roofMesh = new THREE.Mesh(pyramidGeo, materials.roof);
    roofMesh.position.y = height / 2;
    roofMesh.castShadow = true; roofMesh.receiveShadow = true;
    roofTier.add(roofMesh);

    const edgeGeo = new THREE.BoxGeometry(bottomW + 0.12, 0.08, 0.08);
    for (let i = 0; i < 4; i++) {
      const edge = new THREE.Mesh(edgeGeo, materials.gold);
      edge.position.y = 0.04;
      edge.rotation.y = (Math.PI / 2) * i;
      edge.translateZ(bottomW / 2);
      roofTier.add(edge);
    }

    const strutCount = 5, step = bottomW / (strutCount + 1);
    for (let i = 1; i <= strutCount; i++) {
      const offset = -bottomW / 2 + step * i;
      for (let side = 0; side < 4; side++) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), materials.wood);
        strut.rotation.x = Math.PI / 5;
        const strutGroup = new THREE.Group();
        strutGroup.add(strut);
        strutGroup.rotation.y = (Math.PI / 2) * side;
        if (side === 0) strutGroup.position.set(offset, 0.1, bottomW / 2 - 0.2);
        else if (side === 1) strutGroup.position.set(bottomW / 2 - 0.2, 0.1, offset);
        else if (side === 2) strutGroup.position.set(offset, 0.1, -bottomW / 2 + 0.2);
        else strutGroup.position.set(-bottomW / 2 + 0.2, 0.1, offset);
        roofTier.add(strutGroup);
      }
    }

    if (hasPataka) {
      const fringeCount = 24, fStep = bottomW / fringeCount;
      for (let side = 0; side < 4; side++) {
        for (let k = 0; k < fringeCount; k++) {
          const fMesh = new THREE.Mesh(
            new THREE.BoxGeometry(fStep * 0.8, 0.25, 0.02),
            k % 2 === 0 ? materials.fabricRed : materials.fabricGold
          );
          const fGroup = new THREE.Group();
          fMesh.position.set(-bottomW / 2 + fStep * (k + 0.5), -0.1, bottomW / 2 + 0.04);
          fGroup.add(fMesh);
          fGroup.rotation.y = (Math.PI / 2) * side;
          roofTier.add(fGroup);
        }
      }
    }
    return roofTier;
  }

  function createMainPagodaTemple() {
    const group = new THREE.Group();
    const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.4, 4.4), materials.stone);
    basePlinth.position.y = 0.2; basePlinth.castShadow = true; basePlinth.receiveShadow = true;
    group.add(basePlinth);
    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.6 - i * 0.2, 0.12, 0.4), materials.stone);
      step.position.set(0, 0.06 + i * 0.1, 2.3 + i * 0.15);
      step.castShadow = true; step.receiveShadow = true;
      group.add(step);
    }
    const lionGeo = new THREE.BoxGeometry(0.25, 0.4, 0.3);
    const leftLion = new THREE.Mesh(lionGeo, materials.stone);
    leftLion.position.set(-0.9, 0.4, 2.3); leftLion.castShadow = true;
    group.add(leftLion);
    const rightLion = leftLion.clone(); rightLion.position.x = 0.9;
    group.add(rightLion);

    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 3.4), materials.brick);
    lowerBody.position.y = 1.6; lowerBody.castShadow = true; lowerBody.receiveShadow = true;
    group.add(lowerBody);

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.15), materials.wood);
    doorFrame.position.set(0, 1.2, 1.71); group.add(doorFrame);
    const doorInner = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.35, 0.05), materials.darkMetal);
    doorInner.position.set(0, 1.15, 1.74); group.add(doorInner);

    const toranaBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.1), materials.brightGold);
    toranaBase.position.set(0, 2.15, 1.75); group.add(toranaBase);
    const toranaArch = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 8, 16, Math.PI), materials.brightGold);
    toranaArch.position.set(0, 2.15, 1.78); group.add(toranaArch);

    const winGeo = new THREE.BoxGeometry(0.08, 0.9, 0.7);
    const leftWin = new THREE.Mesh(winGeo, materials.wood);
    leftWin.position.set(-1.71, 1.6, 0); group.add(leftWin);
    const rightWin = leftWin.clone(); rightWin.position.x = 1.71;
    group.add(rightWin);

    const lowerRoofGroup = createTieredRoof(4.8, 3.6, 1.1, true);
    lowerRoofGroup.position.y = 2.8; group.add(lowerRoofGroup);

    const upperBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.3, 2.3), materials.brick);
    upperBody.position.y = 4.15; upperBody.castShadow = true; group.add(upperBody);

    const upperRoofGroup = createTieredRoof(3.4, 2.1, 1.0, false);
    upperRoofGroup.position.y = 4.8; group.add(upperRoofGroup);

    const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.2, 12), materials.brightGold);
    baseRing.position.y = 5.9; group.add(baseRing);
    const kalasaCone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.7, 12), materials.brightGold);
    kalasaCone.position.y = 6.35; kalasaCone.castShadow = true; group.add(kalasaCone);
    const topPoint = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), materials.brightGold);
    topPoint.position.y = 6.75; group.add(topPoint);
    return group;
  }

  function createTrishulaShrine() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 2.6), materials.redPlaster);
    base.position.y = 0.7; base.castShadow = true; base.receiveShadow = true;
    group.add(base);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(1.25, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      materials.yellowPaint
    );
    dome.position.y = 1.4; dome.castShadow = true; group.add(dome);
    const domeSpire = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.8, 8), materials.brightGold);
    domeSpire.position.y = 2.8; group.add(domeSpire);

    const poleGroup = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 5.2, 12), materials.brightGold);
    pole.position.y = 2.6; pole.castShadow = true; poleGroup.add(pole);
    const axeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.03), materials.brightGold);
    axeBlade.position.set(-0.4, 4.4, 0); axeBlade.rotation.z = Math.PI / 8; poleGroup.add(axeBlade);
    const speakerCone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 12), materials.darkMetal);
    speakerCone.rotation.z = -Math.PI / 2; speakerCone.position.set(0.25, 3.8, 0); poleGroup.add(speakerCone);
    const centerProng = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 8), materials.brightGold);
    centerProng.position.y = 5.55; poleGroup.add(centerProng);
    const prongCurve = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 8, 12, Math.PI), materials.brightGold);
    prongCurve.position.set(0, 5.0, 0); prongCurve.rotation.z = -Math.PI / 2; poleGroup.add(prongCurve);
    const archFrame = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 8, 16, Math.PI), materials.gold);
    archFrame.position.set(0, 1.6, 0); archFrame.rotation.x = Math.PI / 2; poleGroup.add(archFrame);
    poleGroup.position.set(0, 0, 1.6);
    group.add(poleGroup);
    return group;
  }

  function createCarvedStoneStupa() {
    const stupa = new THREE.Group();
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.25, 1.5), materials.stone);
    p1.position.y = 0.125; p1.castShadow = true; stupa.add(p1);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), materials.stone);
    p2.position.y = 0.4; p2.castShadow = true; stupa.add(p2);
    const nicheCore = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.8, 8), materials.stone);
    nicheCore.position.y = 0.95; nicheCore.castShadow = true; stupa.add(nicheCore);
    for (let i = 0; i < 4; i++) {
      const niche = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.1), materials.darkMetal);
      niche.position.y = 0.95; niche.rotation.y = (Math.PI / 2) * i;
      niche.translateZ(0.51); stupa.add(niche);
    }
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2), materials.stone);
    dome.position.y = 1.35; dome.castShadow = true; stupa.add(dome);
    const harmika = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), materials.stone);
    harmika.position.y = 1.95; stupa.add(harmika);
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 12), materials.stone);
    spire.position.y = 2.55; spire.castShadow = true; stupa.add(spire);
    const pinnacle = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), materials.brightGold);
    pinnacle.position.y = 3.05; stupa.add(pinnacle);
    return stupa;
  }

  function createLeftYellowBuilding() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.5, 4.2), materials.erodedWall);
    body.position.y = 2.75; body.castShadow = true; body.receiveShadow = true;
    group.add(body);
    for (let floor = 1; floor <= 3; floor++) {
      for (let col = -1; col <= 1; col += 2) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.9, 0.05), materials.wood);
        win.position.set(col * 1.2, floor * 1.3 + 0.2, 2.13);
        group.add(win);
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, 5.7, 1), new THREE.Vector3(1.5, 5.7, -1),
    ]);
    group.add(new THREE.Line(lineGeo, materials.darkMetal));
    for (let c = 0; c < 4; c++) {
      const cloth = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.01), c % 2 === 0 ? materials.fabricRed : materials.fabricGold);
      cloth.position.set(-1.0 + c * 0.65, 5.45, 0.3 - c * 0.4);
      group.add(cloth);
    }
    return group;
  }

  function createRearRedBuilding() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(6.5, 5.2, 3.8), materials.redPlaster);
    body.position.y = 2.6; body.castShadow = true; body.receiveShadow = true;
    group.add(body);
    for (let f = 1; f <= 3; f++) {
      for (let c = -2; c <= 2; c += 1.3) {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), materials.darkMetal);
        win.position.set(c, f * 1.25 + 0.2, 1.93);
        group.add(win);
      }
    }
    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), materials.darkMetal);
    solarPanel.rotation.x = Math.PI / 6; solarPanel.position.set(-1.8, 5.45, 0);
    group.add(solarPanel);
    const waterTank = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.9, 12), materials.darkMetal);
    waterTank.position.set(2.0, 5.65, -0.5);
    group.add(waterTank);
    return group;
  }

  function createRightAnnex() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 4.5), materials.redPlaster);
    body.position.y = 2.1; body.castShadow = true; body.receiveShadow = true;
    group.add(body);
    return group;
  }

  let wireGroup: THREE.Group | null = null;
  function createUtilityWires() {
    const group = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 6.5, 8), materials.darkMetal);
    pole.position.set(-6.2, 3.25, 4.8); pole.castShadow = true;
    group.add(pole);
    const wireConnections = [
      { from: new THREE.Vector3(-6.2, 6.2, 4.8), to: new THREE.Vector3(2.2, 5.2, -5.2), sag: 1.6 },
      { from: new THREE.Vector3(-6.2, 6.0, 4.8), to: new THREE.Vector3(-4.8, 5.0, -3.2), sag: 0.9 },
      { from: new THREE.Vector3(-6.2, 5.8, 4.8), to: new THREE.Vector3(5.5, 4.0, 2.2), sag: 1.4 },
      { from: new THREE.Vector3(-4.8, 5.1, -3.2), to: new THREE.Vector3(1.8, 5.0, -5.2), sag: 0.7 },
    ];
    wireConnections.forEach((w) => {
      const mid = new THREE.Vector3().addVectors(w.from, w.to).multiplyScalar(0.5);
      mid.y -= w.sag;
      const curve = new THREE.QuadraticBezierCurve3(w.from, mid, w.to);
      const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      group.add(new THREE.Line(geometry, materials.darkMetal));
    });
    return group;
  }

  function createCulturalDetails() {
    const group = new THREE.Group();
    const bellStand = new THREE.Group();
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3), materials.brass);
    p1.position.set(-0.35, 0.65, 0);
    const p2 = p1.clone(); p2.position.x = 0.35;
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8), materials.brass);
    bar.rotation.z = Math.PI / 2; bar.position.y = 1.25;
    const bell = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.28, 10), materials.brass);
    bell.rotation.x = Math.PI; bell.position.y = 0.95;
    bellStand.add(p1, p2, bar, bell);
    bellStand.position.set(-0.6, 0, 3.8);
    group.add(bellStand);

    for (let i = -4; i <= 4; i++) {
      const diya = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.04, 8), materials.brass);
      diya.position.set(2.2 + i * 0.35, 0.42, 1.3);
      group.add(diya);
      const lampLight = new THREE.PointLight(0xffaa33, 0.0, 1.5);
      lampLight.position.set(2.2 + i * 0.35, 0.5, 1.3);
      pointLights.push(lampLight);
      group.add(lampLight);
    }
    return group;
  }

  // --- assemble diorama ---
  const floor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.6, 15), materials.stone);
  floor.position.y = -0.3; floor.receiveShadow = true;
  diorama.add(floor);
  const soil = new THREE.Mesh(new THREE.BoxGeometry(14.8, 1.4, 14.8), materials.groundSoil);
  soil.position.y = -1.3; diorama.add(soil);
  const rock = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.8, 14.5), materials.groundRock);
  rock.position.y = -2.9; diorama.add(rock);

  const mainTemple = createMainPagodaTemple();
  mainTemple.position.set(2.2, 0, -0.8); diorama.add(mainTemple);
  const yellowShrine = createTrishulaShrine();
  yellowShrine.position.set(-2.8, 0, 2.6); diorama.add(yellowShrine);
  const stoneStupa = createCarvedStoneStupa();
  stoneStupa.position.set(1.4, 0, 3.2); diorama.add(stoneStupa);
  const leftBuilding = createLeftYellowBuilding();
  leftBuilding.position.set(-4.8, 0, -3.2); diorama.add(leftBuilding);
  const rearBuilding = createRearRedBuilding();
  rearBuilding.position.set(1.8, 0, -5.2); diorama.add(rearBuilding);
  const rightBuilding = createRightAnnex();
  rightBuilding.position.set(5.5, 0, 2.2); diorama.add(rightBuilding);
  wireGroup = createUtilityWires(); diorama.add(wireGroup);
  diorama.add(createCulturalDetails());

  const bgColor = new THREE.Color(0x181528);
  const fogColor = new THREE.Color(0x181528);

  function setLightingPreset(preset: GaneshPreset) {
    currentLighting = preset;
    pointLights.forEach((l) => (l.intensity = preset === "night" ? 0.8 : 0));
    if (preset === "golden") {
      bgColor.setHex(0x181528); fogColor.setHex(0x181528);
      dirLight.color.setHex(0xffad6b); dirLight.intensity = 2.2;
      dirLight.position.set(-14, 18, 12);
      ambientLight.color.setHex(0xffeedd); ambientLight.intensity = 0.5;
      hemiLight.color.setHex(0xffdfa9); hemiLight.groundColor.setHex(0x1a1a2e);
    } else if (preset === "day") {
      bgColor.setHex(0xd0e4f7); fogColor.setHex(0xd0e4f7);
      dirLight.color.setHex(0xffffff); dirLight.intensity = 2.4;
      dirLight.position.set(-10, 22, 10);
      ambientLight.color.setHex(0xffffff); ambientLight.intensity = 0.7;
      hemiLight.color.setHex(0xffffff); hemiLight.groundColor.setHex(0x444455);
    } else if (preset === "dusk") {
      bgColor.setHex(0x2c1b33); fogColor.setHex(0x2c1b33);
      dirLight.color.setHex(0xf97316); dirLight.intensity = 1.4;
      dirLight.position.set(-18, 8, 8);
      ambientLight.color.setHex(0xc084fc); ambientLight.intensity = 0.4;
      hemiLight.color.setHex(0xa855f7); hemiLight.groundColor.setHex(0x0f172a);
    } else {
      bgColor.setHex(0x090910); fogColor.setHex(0x090910);
      dirLight.color.setHex(0x38bdf8); dirLight.intensity = 0.4;
      dirLight.position.set(-10, 15, 10);
      ambientLight.color.setHex(0x1e1b4b); ambientLight.intensity = 0.2;
      hemiLight.color.setHex(0x312e81); hemiLight.groundColor.setHex(0x020617);
    }
  }

  return {
    group: diorama,
    api: {
      setLightingPreset,
      setWiresVisible: (v) => { if (wireGroup) wireGroup.visible = v; },
      getView: (v) => ({
        position: new THREE.Vector3(...GANESH_VIEWS[v].position),
        target: new THREE.Vector3(...GANESH_VIEWS[v].target),
      }),
      environment: { background: bgColor, fog: fogColor },
      update: () => { void currentLighting; },
      dispose: () => {
        diorama.traverse((child) => {
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
        [texBrick, texRoof, texWood, texStone, texEroded].forEach((t) => t.dispose());
      },
    },
  };
}
