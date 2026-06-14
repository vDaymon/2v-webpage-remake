"use client";

import { Suspense, useRef, useMemo, useLayoutEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Environment, Lightformer, ContactShadows, Instances, Instance } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SRGBColorSpace, Color, CanvasTexture, Shape, ExtrudeGeometry, Matrix4, Vector3, Quaternion } from "three";

// Start fetching the logo textures as soon as the 3D chunk loads.
useTexture.preload("/logo-2v.png");
useTexture.preload("/logosinfondo.png");

/* ── helpers ─────────────────────────────────────────────────────────── */
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const PALETTE = {
  metal: "#dfe3ea",     // brushed aluminium
  metalDark: "#c2c7d1",
  deck: "#cdd2da",
  key: "#26233a",
  screen: "#070410",
  brand: "#311b53",
  islandBlack: "#04030a",
  bar: "#2a1a48",
  block: "#7c3aed",
  blockSoft: "#a78bfa",
  pink: "#f0abfc",
};

const C_SCREEN = new Color(PALETTE.screen);
const C_BRAND = new Color(PALETTE.brand);

const FADE_OUT = 0.5;
const BRAND_IN = [0.66, 0.78];
const LOGO_IN = [0.72, 0.9];
const SPIN = [0.5, 0.82];
const SPIN_RAD = Math.PI * 2 * (350 / 360);
const ZOOM = [0.9, 1.0];

/* ── rounded-rectangle slab (correct way to model a thin device) ─────── */
function roundedRectShape(w, h, r) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function useSlabGeo(w, h, depth, radius, bevel = 0.012) {
  return useMemo(() => {
    const shape = roundedRectShape(w - 2 * bevel, h - 2 * bevel, Math.max(0.01, radius - bevel));
    const geo = new ExtrudeGeometry(shape, {
      depth: Math.max(0.001, depth - 2 * bevel),
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 4,
      curveSegments: 28,
      steps: 1,
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [w, h, depth, radius, bevel]);
}

function Slab({ w, h, depth, radius, bevel, children, ...props }) {
  const geo = useSlabGeo(w, h, depth, radius, bevel);
  return (
    <mesh geometry={geo} castShadow {...props}>
      {children}
    </mesh>
  );
}

/* aluminium material */
function metalProps(color = PALETTE.metal) {
  return {
    color,
    metalness: 0.92,
    roughness: 0.34,
    envMapIntensity: 1.15,
  };
}

/* ── on-screen UI ────────────────────────────────────────────────────── */
function Block({ progress, start, x, y, w, h, color, z }) {
  const ref = useRef();
  useFrame(() => {
    const p = progress.current;
    const appear = smoothstep(start, start + 0.07, p);
    const out = 1 - smoothstep(FADE_OUT, FADE_OUT + 0.08, p);
    const a = appear * out;
    const m = ref.current;
    if (!m) return;
    m.visible = a > 0.001;
    m.scale.set(w, h * Math.max(0.0001, a), 1);
    m.material.opacity = a;
  });
  return (
    <mesh ref={ref} position={[x, y, z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

function ScreenLogo({ progress, size, tex }) {
  const ref = useRef();
  useFrame(() => {
    const a = smoothstep(LOGO_IN[0], LOGO_IN[1], progress.current);
    const m = ref.current;
    if (!m) return;
    m.visible = a > 0.001;
    m.material.opacity = a;
    const pop = 0.84 + 0.16 * a;
    m.scale.set(size * pop, size * pop, 1);
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.02]} visible={false}>
      <planeGeometry args={[1, 1]} />
      {/* brighter than 1.0 so Bloom makes the logo glow */}
      <meshBasicMaterial map={tex} transparent opacity={0} toneMapped={false} color={[1.6, 1.6, 1.6]} />
    </mesh>
  );
}

function useRoundedMask(w, h, radius) {
  return useMemo(() => {
    const base = 512;
    const cw = base;
    const ch = Math.max(1, Math.round((base * h) / w));
    const cnv = document.createElement("canvas");
    cnv.width = cw;
    cnv.height = ch;
    const ctx = cnv.getContext("2d");
    const r = (radius / w) * cw;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(cw, 0, cw, ch, r);
    ctx.arcTo(cw, ch, 0, ch, r);
    ctx.arcTo(0, ch, 0, 0, r);
    ctx.arcTo(0, 0, cw, 0, r);
    ctx.closePath();
    ctx.fill();
    return new CanvasTexture(cnv);
  }, [w, h, radius]);
}

function ScreenSurface({ progress, w, h, mask }) {
  const ref = useRef();
  useFrame(() => {
    const a = smoothstep(BRAND_IN[0], BRAND_IN[1], progress.current);
    const m = ref.current;
    if (m) m.material.color.copy(C_SCREEN).lerp(C_BRAND, a);
  });
  return (
    <mesh ref={ref}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        color={PALETTE.screen}
        alphaMap={mask}
        transparent
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
}

function DeviceScreen({ progress, w, h, radius, blocks, logoSize, tex, island }) {
  const mask = useRoundedMask(w, h, radius);
  return (
    <group>
      <ScreenSurface progress={progress} w={w} h={h} mask={mask} />
      {island === "pill" && (
        <mesh position={[0, h * 0.4, 0.004]}>
          <planeGeometry args={[0.17, 0.05]} />
          <meshBasicMaterial color={PALETTE.islandBlack} toneMapped={false} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
        </mesh>
      )}
      {island === "notch" && (
        <mesh position={[0, h * 0.47, 0.004]}>
          <planeGeometry args={[0.46, 0.05]} />
          <meshBasicMaterial color={PALETTE.islandBlack} toneMapped={false} polygonOffset polygonOffsetFactor={-6} polygonOffsetUnits={-6} />
        </mesh>
      )}
      <group position={[0, 0, 0.006]}>
        {blocks.map((b, i) => (
          <Block key={i} progress={progress} {...b} z={0.002 + i * 0.0012} />
        ))}
        <ScreenLogo progress={progress} size={logoSize} tex={tex} />
      </group>
      {/* glossy glass that reflects the environment */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          color="#05030a"
          alphaMap={mask}
          transparent
          opacity={0.08}
          roughness={0.12}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.7}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-8}
          polygonOffsetUnits={-8}
        />
      </mesh>
    </group>
  );
}

/* build an alpha mask of just the 2V mark (drops the purple background) */
function useLogoMask(tex) {
  return useMemo(() => {
    const image = tex?.image;
    if (!image || !image.width) return null;
    const w = 512;
    const h = Math.max(1, Math.round((w * image.height) / image.width));
    const cnv = document.createElement("canvas");
    cnv.width = w;
    cnv.height = h;
    const ctx = cnv.getContext("2d");
    ctx.drawImage(image, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h);
    const px = img.data;
    for (let i = 0; i < px.length; i += 4) {
      const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
      let a = (lum - 0.3) / (0.5 - 0.3);
      a = Math.max(0, Math.min(1, a));
      px[i] = 255;
      px[i + 1] = 255;
      px[i + 2] = 255;
      px[i + 3] = Math.round(a * 255);
    }
    ctx.putImageData(img, 0, 0);
    return new CanvasTexture(cnv);
  }, [tex]);
}

function BackLogo({ mask, size, z }) {
  if (!mask) return null;
  return (
    <mesh position={[0, 0, z]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color="#8d93a0"
        alphaMap={mask}
        transparent
        metalness={0.8}
        roughness={0.4}
        envMapIntensity={1.1}
        polygonOffset
        polygonOffsetFactor={-4}
        polygonOffsetUnits={-4}
      />
    </mesh>
  );
}

const LAPTOP_BLOCKS = [
  { start: 0.12, x: 0, y: 0.82, w: 3.1, h: 0.16, color: PALETTE.bar },
  { start: 0.15, x: -1.33, y: 0.82, w: 0.16, h: 0.16, color: PALETTE.pink },
  { start: 0.2, x: -0.68, y: 0.22, w: 1.66, h: 0.78, color: PALETTE.block },
  { start: 0.24, x: 1.04, y: 0.22, w: 1.0, h: 0.78, color: PALETTE.blockSoft },
  { start: 0.29, x: -0.68, y: -0.42, w: 1.66, h: 0.1, color: PALETTE.bar },
  { start: 0.33, x: -0.88, y: -0.58, w: 1.28, h: 0.1, color: PALETTE.bar },
  { start: 0.37, x: -1.18, y: -0.82, w: 0.64, h: 0.16, color: PALETTE.pink },
  { start: 0.41, x: 0.62, y: -0.7, w: 0.54, h: 0.4, color: PALETTE.block },
  { start: 0.44, x: 1.24, y: -0.7, w: 0.54, h: 0.4, color: PALETTE.blockSoft },
  { start: 0.47, x: 0.02, y: -0.7, w: 0.54, h: 0.4, color: PALETTE.bar },
];

const PHONE_BLOCKS = [
  { start: 0.16, x: 0, y: 0.66, w: 0.74, h: 0.44, color: PALETTE.block },
  { start: 0.22, x: 0, y: 0.2, w: 0.74, h: 0.28, color: PALETTE.blockSoft },
  { start: 0.28, x: -0.2, y: -0.28, w: 0.32, h: 0.4, color: PALETTE.bar },
  { start: 0.34, x: 0.2, y: -0.28, w: 0.32, h: 0.4, color: PALETTE.pink },
  { start: 0.4, x: 0, y: -0.78, w: 0.74, h: 0.16, color: PALETTE.bar },
];

/* ── MacBook detail parts ───────────────────────────────────────────── */

// a single rounded, bevelled keycap geometry (face up), reused for every key
function useKeyGeo() {
  return useMemo(() => {
    const shape = roundedRectShape(0.16, 0.16, 0.034);
    const geo = new ExtrudeGeometry(shape, {
      depth: 0.022,
      bevelEnabled: true,
      bevelThickness: 0.013,
      bevelSize: 0.014,
      bevelSegments: 3,
      curveSegments: 6,
      steps: 1,
    });
    geo.center();
    geo.rotateX(-Math.PI / 2); // lay flat, top facing +Y
    geo.computeVertexNormals();
    return geo;
  }, []);
}

// instanced keycaps with per-key width/depth scale (modifiers, spacebar, fn row)
function KeyCaps({ geo, layout, y }) {
  const ref = useRef();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new Matrix4();
    const pos = new Vector3();
    const quat = new Quaternion();
    const scl = new Vector3();
    layout.forEach((k, i) => {
      pos.set(k.x, y, k.z);
      scl.set(k.sx, 1, k.sz);
      m.compose(pos, quat, scl);
      ref.current.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [geo, layout, y]);
  return (
    <instancedMesh ref={ref} args={[geo, undefined, layout.length]} castShadow frustumCulled={false}>
      <meshStandardMaterial color="#1b1922" roughness={0.5} metalness={0.34} envMapIntensity={0.7} />
    </instancedMesh>
  );
}

function Keyboard({ topY }) {
  const keyGeo = useKeyGeo();
  const layout = useMemo(() => {
    const cols = 13;
    const gap = 0.205;
    const startX = -((cols - 1) * gap) / 2;
    const out = [];
    // thin function row
    for (let c = 0; c < cols; c++) out.push({ x: startX + c * gap, z: -0.5, sx: 1, sz: 0.52 });
    // 4 standard rows
    [-0.3, -0.1, 0.1, 0.3].forEach((z) => {
      for (let c = 0; c < cols; c++) out.push({ x: startX + c * gap, z, sx: 1, sz: 1 });
    });
    // bottom row: modifiers + wide spacebar
    [0, 1, 2].forEach((c) => out.push({ x: startX + c * gap, z: 0.52, sx: 1, sz: 1 }));
    out.push({ x: 0, z: 0.52, sx: 5.2, sz: 1 });
    [10, 11, 12].forEach((c) => out.push({ x: startX + c * gap, z: 0.52, sx: 1, sz: 1 }));
    return out;
  }, []);
  return (
    <group position={[0, topY, -0.06]}>
      {/* dark recessed keyboard tray (gaps between keys read as this) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[2.96, 1.42]} />
        <meshStandardMaterial color="#0d0b15" roughness={0.95} metalness={0.08} />
      </mesh>
      <KeyCaps geo={keyGeo} layout={layout} y={0.018} />
    </group>
  );
}

function SpeakerGrille({ topY, x }) {
  const holes = useMemo(() => {
    const arr = [];
    const rows = 24;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 2; c++) {
        arr.push([x + (c - 0.5) * 0.05, r * 0.044 - ((rows - 1) * 0.044) / 2 - 0.05]);
      }
    }
    return arr;
  }, [x]);
  return (
    <Instances position={[0, topY + 0.005, 0]}>
      <cylinderGeometry args={[0.013, 0.013, 0.02, 8]} />
      <meshStandardMaterial color="#0a0912" roughness={0.9} metalness={0.1} />
      {holes.map((h, i) => (
        <Instance key={i} position={[h[0], 0, h[1]]} />
      ))}
    </Instances>
  );
}

/* ── MacBook ─────────────────────────────────────────────────────────── */
function Laptop({ progress, tex, logoMask }) {
  const deckTopY = 0.06;
  return (
    <group position={[-1.55, -0.15, 0]} rotation={[0, 0.26, 0]}>
      {/* unibody deck + everything that sits on it */}
      <group position={[0, -0.04, 0.3]}>
        <Slab w={3.5} h={2.3} depth={0.12} radius={0.1} bevel={0.02} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial {...metalProps(PALETTE.deck)} />
        </Slab>
        <Keyboard topY={deckTopY} />
        <SpeakerGrille topY={deckTopY} x={1.56} />
        <SpeakerGrille topY={deckTopY} x={-1.56} />
        {/* trackpad */}
        <mesh position={[0, deckTopY + 0.004, 0.86]} castShadow>
          <boxGeometry args={[1.2, 0.012, 0.66]} />
          <meshStandardMaterial color="#bcc1cc" roughness={0.22} metalness={0.55} envMapIntensity={1.3} />
        </mesh>
        {/* front opening lip */}
        <mesh position={[0, deckTopY - 0.001, 1.12]}>
          <boxGeometry args={[0.7, 0.018, 0.08]} />
          <meshStandardMaterial color="#9aa0ad" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* rubber feet */}
        {[[-1.45, -0.9], [1.45, -0.9], [-1.45, 1.0], [1.45, 1.0]].map(([fx, fz], i) => (
          <mesh key={i} position={[fx, -0.066, fz]}>
            <cylinderGeometry args={[0.075, 0.075, 0.016, 18]} />
            <meshStandardMaterial color="#141320" roughness={0.7} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* hinge */}
      <mesh position={[0, -0.05, -0.83]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 3.34, 28]} />
        <meshStandardMaterial color="#34343e" roughness={0.45} metalness={0.78} envMapIntensity={0.9} />
      </mesh>

      {/* lid */}
      <group position={[0, 0.0, -0.82]} rotation={[-0.32, 0, 0]}>
        <group position={[0, 1.12, 0]}>
          <Slab w={3.46} h={2.12} depth={0.07} radius={0.06} bevel={0.012}>
            <meshStandardMaterial {...metalProps(PALETTE.metalDark)} />
          </Slab>
          <BackLogo mask={logoMask} size={0.95} z={-0.037} />
          <group position={[0, 0, 0.035]}>
            <DeviceScreen progress={progress} w={3.34} h={2.0} radius={0.06} blocks={LAPTOP_BLOCKS} logoSize={1.66} tex={tex} island="notch" />
          </group>
        </group>
      </group>
    </group>
  );
}

/* ── iPhone ──────────────────────────────────────────────────────────── */
function Phone({ progress, tex, logoMask }) {
  const bodyW = 1.0;
  const bodyH = 2.12;
  const bodyD = 0.09;
  const faceZ = bodyD / 2;
  const bottomY = -bodyH / 2;

  const speakerHoles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 5; i++) {
      arr.push(0.18 + i * 0.05);
      arr.push(-0.18 - i * 0.05);
    }
    return arr;
  }, []);

  return (
    <group position={[1.95, -0.25, 0.5]} rotation={[0, -0.42, 0]}>
      <Slab w={bodyW} h={bodyH} depth={bodyD} radius={0.17} bevel={0.016}>
        <meshStandardMaterial {...metalProps(PALETTE.metal)} />
      </Slab>

      {/* side buttons */}
      <mesh position={[bodyW / 2 + 0.006, 0.45, 0]}>
        <boxGeometry args={[0.026, 0.34, 0.05]} />
        <meshStandardMaterial {...metalProps(PALETTE.metalDark)} />
      </mesh>
      <mesh position={[-bodyW / 2 - 0.006, 0.55, 0]}>
        <boxGeometry args={[0.026, 0.18, 0.05]} />
        <meshStandardMaterial {...metalProps(PALETTE.metalDark)} />
      </mesh>
      <mesh position={[-bodyW / 2 - 0.006, 0.28, 0]}>
        <boxGeometry args={[0.026, 0.18, 0.05]} />
        <meshStandardMaterial {...metalProps(PALETTE.metalDark)} />
      </mesh>
      {/* action button */}
      <mesh position={[-bodyW / 2 - 0.006, 0.82, 0]}>
        <boxGeometry args={[0.026, 0.1, 0.05]} />
        <meshStandardMaterial {...metalProps(PALETTE.metalDark)} />
      </mesh>

      {/* antenna lines on the titanium frame */}
      {[0.82, -0.82].map((ay, i) => (
        <group key={i}>
          <mesh position={[bodyW / 2, ay, 0]}>
            <boxGeometry args={[0.02, 0.016, bodyD * 0.88]} />
            <meshStandardMaterial color="#b3b8c4" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[-bodyW / 2, ay, 0]}>
            <boxGeometry args={[0.02, 0.016, bodyD * 0.88]} />
            <meshStandardMaterial color="#b3b8c4" metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* bottom: USB-C port + speaker / mic holes */}
      <mesh position={[0, bottomY + 0.012, 0]}>
        <boxGeometry args={[0.2, 0.045, 0.05]} />
        <meshStandardMaterial color="#08070f" roughness={0.6} metalness={0.4} />
      </mesh>
      <Instances position={[0, bottomY + 0.014, 0]}>
        <cylinderGeometry args={[0.013, 0.013, 0.05, 10]} />
        <meshStandardMaterial color="#08070f" roughness={0.85} metalness={0.2} />
        {speakerHoles.map((hx, i) => (
          <Instance key={i} position={[hx, 0, 0]} />
        ))}
      </Instances>

      <BackLogo mask={logoMask} size={0.5} z={-faceZ - 0.002} />

      <group position={[0, 0, faceZ]}>
        <DeviceScreen progress={progress} w={0.9} h={2.0} radius={0.15} blocks={PHONE_BLOCKS} logoSize={0.84} tex={tex} island="pill" />
      </group>
    </group>
  );
}

/* ── devices group ───────────────────────────────────────────────────── */
function Devices({ progress, tex, logoMask }) {
  const group = useRef();
  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const intro = smoothstep(0, 0.16, p);
    const tiltDown = (1 - smoothstep(0.04, 0.42, p)) * 0.72;
    const spin = smoothstep(SPIN[0], SPIN[1], p) * SPIN_RAD;
    const g = group.current;
    if (!g) return;
    g.scale.setScalar(0.88 + 0.12 * intro);
    g.position.x = -0.15;
    g.position.y = -0.15 + (1 - intro) * -0.9 + Math.sin(t * 0.4) * 0.03;
    g.rotation.x = tiltDown + Math.sin(t * 0.35) * 0.012;
    g.rotation.y = spin + Math.sin(t * 0.3) * 0.02;
  });

  return (
    <group ref={group}>
      <Laptop progress={progress} tex={tex} logoMask={logoMask} />
      <Phone progress={progress} tex={tex} logoMask={logoMask} />
    </group>
  );
}

function Rig({ progress }) {
  const { camera, size } = useThree();
  useFrame(() => {
    const p = progress.current;
    const aspect = size.width / Math.max(1, size.height);
    const fit = Math.max(1, 1.5 / aspect);
    const baseZ = (8.0 - smoothstep(0, 1, p) * 0.9) * fit;
    const zoom = smoothstep(ZOOM[0], ZOOM[1], p);
    const tz = baseZ * (1 - zoom) + 2.7 * zoom;
    const tx = -1.55 * zoom;
    const ty = 0.45 * (1 - zoom) + 0.85 * zoom;
    camera.position.x += (tx - camera.position.x) * 0.09;
    camera.position.y += (ty - camera.position.y) * 0.09;
    camera.position.z += (tz - camera.position.z) * 0.09;
    camera.lookAt(tx, ty - 0.05, 0);
  });
  return null;
}

/* atmospheric background gradient (also keeps the frame opaque for bloom) */
function Background() {
  const tex = useMemo(() => {
    const s = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d");
    const g = ctx.createRadialGradient(s * 0.5, s * 0.4, s * 0.04, s * 0.5, s * 0.55, s * 0.78);
    g.addColorStop(0, "#5a2596");
    g.addColorStop(0.45, "#3a1268");
    g.addColorStop(1, "#190732");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 0, -9]} scale={[44, 30, 1]} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* faint 2V watermark sitting in the background, behind the devices —
   purely a backdrop, not part of the animated device models */
function WatermarkLogo({ tex }) {
  return (
    <mesh position={[0, 0.35, -6]} renderOrder={-5}>
      <planeGeometry args={[6.6, 6.6]} />
      <meshBasicMaterial map={tex} transparent opacity={0.09} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function SceneContent({ progress }) {
  const [tex, wmTex] = useTexture(["/logo-2v.png", "/logosinfondo.png"]);
  tex.colorSpace = SRGBColorSpace;
  wmTex.colorSpace = SRGBColorSpace;
  const logoMask = useLogoMask(tex);
  return (
    <>
      <Background />
      <WatermarkLogo tex={wmTex} />

      {/* studio environment built from soft area lights → real reflections */}
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 3, 3]} scale={[7, 5, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-5, 1, 2]} scale={[3, 6, 1]} color="#b794f6" />
        <Lightformer intensity={1.2} position={[5, -1, 2]} scale={[3, 6, 1]} color="#f0abfc" />
        <Lightformer intensity={0.7} position={[0, -4, -3]} scale={[10, 10, 1]} color="#3a1268" />
      </Environment>

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 7, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-6, 1, 4]} intensity={18} color="#7c3aed" />
      <pointLight position={[6, -2, 5]} intensity={14} color="#f0abfc" />

      <ContactShadows position={[0, -2.1, 0]} opacity={0.4} scale={11} blur={3.2} far={4.5} color="#0a0418" frames={Infinity} />

      <Rig progress={progress} />
      <Devices progress={progress} tex={tex} logoMask={logoMask} />
    </>
  );
}

export default function Scene3D({ progress }) {
  return (
    <Canvas
      camera={{ position: [0, 0.45, 8.0], fov: 40 }}
      dpr={[1, 1.8]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneContent progress={progress} />
      </Suspense>
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.25} intensity={0.7} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
