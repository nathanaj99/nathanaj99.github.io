/**
 * The whole motion budget of the site lives in this file.
 *
 * One requestAnimationFrame loop, shared by every interactive component. The
 * loop only runs while something is actually moving: subscribers report back
 * whether they are still settling, and when they all report `false` the loop
 * stops until the pointer moves again. Nothing animates on a device without a
 * fine pointer, or when the visitor asks for reduced motion.
 */

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** True when pointer-driven motion is welcome here. */
export const motionAllowed = () => finePointer() && !reducedMotion();

export interface Pointer {
  /** Client coordinates, or null before the pointer has been seen. */
  x: number;
  y: number;
  seen: boolean;
}

type Subscriber = (pointer: Pointer, dtScale: number) => boolean;

const subscribers = new Set<Subscriber>();
const pointer: Pointer = { x: 0, y: 0, seen: false };

let frame = 0;
let last = 0;

function tick(now: number) {
  frame = 0;
  const dtScale = last ? Math.min(Math.max((now - last) / 16.667, 0.4), 3) : 1;
  last = now;

  let active = false;
  for (const subscriber of subscribers) {
    if (subscriber(pointer, dtScale)) active = true;
  }

  if (active) frame = requestAnimationFrame(tick);
  else last = 0;
}

function wake() {
  if (!frame && subscribers.size) frame = requestAnimationFrame(tick);
}

function onPointerMove(event: PointerEvent) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.seen = true;
  wake();
}

function onPointerLeave() {
  pointer.seen = false;
  wake();
}

let listening = false;

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', wake, { passive: true });
}

/**
 * Register a per-frame callback. Return `true` while still animating so the
 * loop keeps going, `false` once settled.
 */
export function subscribe(subscriber: Subscriber): () => void {
  subscribers.add(subscriber);
  listen();
  wake();
  return () => subscribers.delete(subscriber);
}

export interface Spring {
  value: number;
  target: number;
  velocity: number;
}

export function spring(value = 0): Spring {
  return { value, target: value, velocity: 0 };
}

/**
 * A light damped spring. Slightly under-damped so shapes carry a little
 * inertia and overshoot by a hair, the way a hanging object would.
 */
export function step(
  s: Spring,
  dtScale: number,
  stiffness = 0.055,
  damping = 0.86,
): boolean {
  const steps = Math.max(1, Math.round(dtScale));
  for (let i = 0; i < steps; i++) {
    s.velocity += (s.target - s.value) * stiffness;
    s.velocity *= damping;
    s.value += s.velocity;
  }
  const settled = Math.abs(s.target - s.value) < 0.0004 && Math.abs(s.velocity) < 0.0004;
  if (settled) {
    s.value = s.target;
    s.velocity = 0;
  }
  return !settled;
}

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * How much the pointer should influence an element: 1 at its centre, easing to
 * 0 at `radius` away. Keeps interaction local instead of global.
 */
export function proximity(
  rect: DOMRect,
  pointerPos: Pointer,
  radius: number,
): { x: number; y: number; falloff: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = pointerPos.x - cx;
  const dy = pointerPos.y - cy;
  const distance = Math.hypot(dx, dy);
  const falloff = clamp(1 - distance / radius, 0, 1);
  const eased = falloff * falloff * (3 - 2 * falloff);
  const norm = distance || 1;
  return { x: (dx / norm) * eased, y: (dy / norm) * eased, falloff: eased };
}
