// 📖 Docs: obsidian/frontend/webgl-scenes.md · skill: optimize-3d-scene

/**
 * The page's background: a stream of light that runs the whole length of the
 * site. The camera rides a curve through it as the reader scrolls, and the
 * colour moves accent → cyan → pink along the way.
 *
 * Built to the starter's scene rules (.claude/rules/scenes.md):
 *  - one `Points` draw call; positions are static, every moving part (swirl,
 *    the travelling pulse, size) is computed in the vertex shader from one
 *    time uniform, so scroll costs a camera matrix per frame;
 *  - time in seconds from `createFrameClock`, easing via `perFrame` / `damp`;
 *  - desktop draws at ~60 fps (`createDrawGate`), phones are never capped;
 *  - DPR clamped to 1.5 (soft points — a lower count, not a lower DPR, pays
 *    for phones); the buffer is sized once per real size change, and a
 *    same-size resize is ignored (the iOS toolbar);
 *  - colours are read from the site's own tokens, so nothing is hardcoded;
 *  - deterministic (seeded) so a context-loss rebuild looks identical.
 *
 * This module is imported lazily by `light-stream.tsx` and never on the robot
 * form.
 */

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";

import { createDrawGate, createFrameClock, damp, perFrame } from "@/lib/scene/per-frame";

export interface LightStream {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  /** Frames drawn so far — lets `keepSceneAlive` notice a stalled scene. */
  frames: () => number;
  dispose: () => void;
}

interface Options {
  /** A rebuild after a context loss: no fade-in, the reader already saw it. */
  settled: boolean;
}

/** Particles allocated once, at the desktop budget; phones draw a prefix. */
const COUNT_DESKTOP = 16000;
const COUNT_PHONE = 6000;
const DPR_MAX = 1.5;
/** Fraction of the particles that are wide, faint "dust" instead of the stream. */
const DUST_SHARE = 0.16;

/** The stream's path through the scene — a slow S-curve, away from the camera. */
const PATH: readonly (readonly [number, number, number])[] = [
  [0, 0, 0],
  [2.2, -1, -14],
  [-2.6, 1.6, -28],
  [1.6, -2.2, -42],
  [3, 1, -56],
  [-1.6, 2.6, -70],
  [-2.2, -1.6, -84],
  [1, 0, -98],
  [0, 0, -112],
];
/** How far along the path the camera gets at the bottom of the page. */
const CAMERA_END = 0.96;
const LOOK_AHEAD = 0.035;

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uPixelScale;
  uniform float uSize;
  attribute vec3 aOffset;
  attribute vec2 aData;      // x: position along the path (0..1), y: per-particle seed
  varying float vAlpha;
  varying float vAlong;

  void main() {
    // Each particle slowly orbits the path's axis (the path runs mostly along -z).
    float angle = uTime * 0.12 * (0.4 + aData.y) + aData.y * 6.2831853;
    float c = cos(angle);
    float s = sin(angle);
    vec3 off = aOffset;
    off.xy = mat2(c, -s, s, c) * off.xy;

    vec4 mv = modelViewMatrix * vec4(position + off, 1.0);
    gl_Position = projectionMatrix * mv;

    // A bright pulse travels down the stream.
    float pulse = 0.5 + 0.5 * sin(aData.x * 70.0 - uTime * 1.7 + aData.y * 3.0);
    float depth = -mv.z;
    float fade = smoothstep(0.2, 2.0, depth) * (1.0 - smoothstep(16.0, 44.0, depth));

    vAlpha = (0.2 + 0.8 * pulse * pulse * pulse) * fade;
    vAlong = aData.x;
    float px = uSize * uPixelScale * (0.55 + 1.5 * pulse) / max(depth, 0.6);
    gl_PointSize = clamp(px, 1.0, 16.0 * uPixelScale);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uStart;
  uniform vec3 uMiddle;
  uniform vec3 uEnd;
  uniform float uIntro;
  varying float vAlpha;
  varying float vAlong;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    if (r > 1.0) discard;
    float soft = (1.0 - r) * (1.0 - r);
    vec3 col = vAlong < 0.5
      ? mix(uStart, uMiddle, vAlong * 2.0)
      : mix(uMiddle, uEnd, (vAlong - 0.5) * 2.0);
    gl_FragColor = vec4(col, soft * vAlpha * uIntro);
  }
`;

/** A small deterministic PRNG — the same stream on every build. */
const seeded = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A design token as sRGB 0..1 — the scene never carries a colour literal. */
const readToken = (name: string): Color => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return raw ? new Color(raw) : new Color(0);
};

const toVector = (color: Color): Vector3 => {
  const rgb = { r: 0, g: 0, b: 0 };
  color.getRGB(rgb, SRGBColorSpace);
  return new Vector3(rgb.r, rgb.g, rgb.b);
};

const isPhoneTier = (): boolean =>
  window.innerWidth < 768 || window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const buildGeometry = (curve: CatmullRomCurve3): BufferGeometry => {
  const rand = seeded(20260518);
  const total = COUNT_DESKTOP;
  const position = new Float32Array(total * 3);
  const offset = new Float32Array(total * 3);
  const data = new Float32Array(total * 2);
  const center = new Vector3();

  // Stream and dust are interleaved at random, so any prefix of the buffer is a
  // fair sample of both — a phone can draw the first N and keep the look.
  for (let i = 0; i < total; i += 1) {
    const dust = rand() < DUST_SHARE;
    const along = rand();
    curve.getPointAt(along, center);

    // Random direction on a sphere; the radius is dense near the axis for the
    // stream and wide for the dust.
    const z = rand() * 2 - 1;
    const phi = rand() * Math.PI * 2;
    const flat = Math.sqrt(1 - z * z);
    const radius = dust ? 3 + rand() * 7 : 0.12 + rand() * rand() * 1.9;

    position[i * 3] = center.x;
    position[i * 3 + 1] = center.y;
    position[i * 3 + 2] = center.z;
    offset[i * 3] = flat * Math.cos(phi) * radius;
    offset[i * 3 + 1] = flat * Math.sin(phi) * radius;
    offset[i * 3 + 2] = z * radius * 1.6;
    data[i * 2] = along;
    data[i * 2 + 1] = rand();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aOffset", new BufferAttribute(offset, 3));
  geometry.setAttribute("aData", new BufferAttribute(data, 2));
  return geometry;
};

export const createLightStream = (container: HTMLElement, { settled }: Options): LightStream => {
  const renderer = new WebGLRenderer({
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
  });
  // The shader writes display colours directly, so nothing is converted twice.
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
  const ground = toVector(readToken("--stream-ground"));
  renderer.setClearColor(new Color().setRGB(ground.x, ground.y, ground.z, LinearSRGBColorSpace), 1);
  container.appendChild(renderer.domElement);

  const curve = new CatmullRomCurve3(PATH.map(([x, y, z]) => new Vector3(x, y, z)));
  const geometry = buildGeometry(curve);
  geometry.boundingSphere = null;

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelScale: { value: 1 },
      uSize: { value: 38 },
      uIntro: { value: settled ? 1 : 0 },
      uStart: { value: toVector(readToken("--stream-start")) },
      uMiddle: { value: toVector(readToken("--stream-middle")) },
      uEnd: { value: toVector(readToken("--stream-end")) },
    },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;
  const scene = new Scene();
  scene.add(points);
  const camera = new PerspectiveCamera(60, 1, 0.1, 80);

  const eye = new Vector3();
  const target = new Vector3();

  let phone = isPhoneTier();
  let width = 0;
  let height = 0;
  let dpr = 0;
  let maxScroll = 1;
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let parallaxX = 0;
  let parallaxY = 0;
  let pointerMoved = false;
  let frameCount = 0;
  let raf = 0;
  let disposed = false;

  const clock = createFrameClock();
  let gate = createDrawGate(!phone);

  const retune = (): void => {
    phone = isPhoneTier();
    gate = createDrawGate(!phone);
    // Uniforms and a draw range only — never a define, so no program recompiles.
    geometry.setDrawRange(0, phone ? COUNT_PHONE : COUNT_DESKTOP);
  };

  const place = (t: number): void => {
    const along = Math.min(CAMERA_END, Math.max(0, t) * CAMERA_END);
    curve.getPointAt(along, eye);
    curve.getPointAt(Math.min(1, along + LOOK_AHEAD), target);
    eye.x += parallaxX * 0.55;
    eye.y += parallaxY * 0.4;
    camera.position.copy(eye);
    camera.lookAt(target);
  };

  const draw = (): void => {
    renderer.render(scene, camera);
    frameCount += 1;
  };

  const measureScroll = (): void => {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };

  const resize = (): void => {
    const nextWidth = container.clientWidth;
    const nextHeight = container.clientHeight;
    const nextDpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    // A same-size resize clears the buffer for nothing — skip it (iOS toolbar).
    if (nextWidth === width && nextHeight === height && nextDpr === dpr) return;
    if (nextWidth === 0 || nextHeight === 0) return;
    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;
    retune();
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    material.uniforms.uPixelScale.value = dpr;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    measureScroll();
    place(progress);
    gate.force();
    draw(); // setSize cleared the buffer — draw in the same frame
  };

  const onPointer = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    pointerMoved = true;
    pointerX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
  };

  const loop = (now: number): void => {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) {
      clock.reset();
      return;
    }
    const { dt, t } = clock.tick(now);

    const raw = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    progress += (raw - progress) * perFrame(0.14, dt);
    if (Math.abs(raw - progress) > 0.2) progress = raw; // a jump to a section: snap
    if (pointerMoved) {
      parallaxX = damp(parallaxX, pointerX, 3, dt);
      parallaxY = damp(parallaxY, pointerY, 3, dt);
    }
    material.uniforms.uTime.value = t;
    material.uniforms.uIntro.value = damp(material.uniforms.uIntro.value as number, 1, 1.4, dt);
    place(progress);

    if (gate.shouldDraw(dt)) draw();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const bodyObserver = new ResizeObserver(measureScroll);
  bodyObserver.observe(document.body);
  window.addEventListener("pointermove", onPointer, { passive: true });

  resize();
  raf = requestAnimationFrame(loop);

  return {
    canvas: renderer.domElement,
    gl: renderer.getContext(),
    frames: () => frameCount,
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
};
