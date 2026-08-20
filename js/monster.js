import { TRAITS } from "./data.js";
import { TRAIT_COLORS } from "./resultView.js";

// El "monstruo elemental": un orbe animado en <canvas> cuyo color y
// partículas combinan los rasgos del piloto según su peso relativo.
// Sin librerías externas ni assets — todo generado por código.

const TRAIT_RGB = Object.fromEntries(
  TRAITS.map((t) => {
    const hex = TRAIT_COLORS[t];
    return [t, [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]];
  })
);

let rafId = null;

export function drawMonster(canvasId, scores) {
  if (rafId) cancelAnimationFrame(rafId);

  const canvas = document.getElementById(canvasId);
  const dpr = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 280;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const weights = computeWeights(scores.sums);
  const particles = spawnParticles(weights, size);
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const cx = size / 2;
  const cy = size / 2;
  const baseRadius = size * 0.24;

  function frame(t) {
    ctx.clearRect(0, 0, size, size);
    drawAuras(ctx, cx, cy, baseRadius, weights, t);
    drawBlob(ctx, cx, cy, baseRadius, weights, t);
    for (const p of particles) {
      updateParticle(p, cx, cy, baseRadius, t, size);
      drawParticle(ctx, p);
    }
    if (!reduceMotion) rafId = requestAnimationFrame(frame);
  }

  if (reduceMotion) {
    frame(0);
  } else {
    rafId = requestAnimationFrame(frame);
  }

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
}

// Solo los rasgos con puntuación positiva "pintan" el monstruo. Si
// ninguno es positivo (perfil muy adverso), se desplaza todo por el
// mínimo para que los dos rasgos más altos sigan teniendo peso real.
function computeWeights(sums) {
  const min = Math.min(...TRAITS.map((t) => sums[t]));
  const shift = min < 0 ? -min : 0;
  const shifted = Object.fromEntries(TRAITS.map((t) => [t, sums[t] + shift + 0.3]));
  const total = Object.values(shifted).reduce((a, b) => a + b, 0);
  return Object.fromEntries(TRAITS.map((t) => [t, shifted[t] / total]));
}

function mixColor(weights) {
  let r = 0, g = 0, b = 0;
  for (const t of TRAITS) {
    const [tr, tg, tb] = TRAIT_RGB[t];
    r += tr * weights[t];
    g += tg * weights[t];
    b += tb * weights[t];
  }
  return [Math.round(r), Math.round(g), Math.round(b)];
}

function drawBlob(ctx, cx, cy, baseRadius, weights, t) {
  const [r, g, b] = mixColor(weights);
  const wobble = 0.06;
  const lobes = 6;

  ctx.save();
  ctx.beginPath();
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const wave = Math.sin(angle * lobes + t / 900) * wobble + Math.sin(angle * 2 - t / 1400) * 0.03;
    const radius = baseRadius * (1 + wave);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(cx, cy, baseRadius * 0.1, cx, cy, baseRadius * 1.05);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0.55)`);
  ctx.fillStyle = gradient;
  ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
  ctx.shadowBlur = 24;
  ctx.fill();
  ctx.restore();
}

// Auras: una por cada uno de los 3 rasgos con más peso, superpuestas con
// "lighter" para que se note la mezcla en vez de un color plano.
function drawAuras(ctx, cx, cy, baseRadius, weights, t) {
  const top = [...TRAITS].sort((a, b) => weights[b] - weights[a]).slice(0, 3);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  top.forEach((trait, i) => {
    const [r, g, bC] = TRAIT_RGB[trait];
    const angle = (i / top.length) * Math.PI * 2 + t / 6000;
    const offset = baseRadius * 0.35;
    const x = cx + Math.cos(angle) * offset;
    const y = cy + Math.sin(angle) * offset;
    const radius = baseRadius * (0.9 + weights[trait] * 1.1);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(${r},${g},${bC},${0.25 * weights[trait] + 0.08})`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function spawnParticles(weights, size) {
  const particles = [];
  for (const trait of TRAITS) {
    const count = Math.round(weights[trait] * 26);
    for (let i = 0; i < count; i++) {
      particles.push(makeParticle(trait, size));
    }
  }
  return particles;
}

function makeParticle(trait, size) {
  return {
    trait,
    angle: Math.random() * Math.PI * 2,
    radiusOffset: 0.6 + Math.random() * 0.9,
    speed: 0.15 + Math.random() * 0.35,
    seed: Math.random() * 1000,
    size: 1.5 + Math.random() * 2.5,
    phase: Math.random() * Math.PI * 2,
  };
}

function updateParticle(p, cx, cy, baseRadius, t, canvasSize) {
  const time = t / 1000 + p.seed;

  if (p.trait === "rie") {
    // Fuego: ascienden y titilan
    const life = (time * (0.6 + p.speed)) % 2;
    p.x = cx + Math.sin(time * 3 + p.phase) * baseRadius * 0.5;
    p.y = cy + baseRadius * 1.3 - life * baseRadius * 1.6;
    p.alpha = Math.max(0, 1 - life / 2);
  } else if (p.trait === "cau") {
    // Agua: caen ondulando
    const life = (time * (0.5 + p.speed)) % 2;
    p.x = cx + Math.sin(time * 2 + p.phase) * baseRadius * 0.6;
    p.y = cy - baseRadius * 1.2 + life * baseRadius * 1.6;
    p.alpha = Math.max(0, 1 - Math.abs(life - 1));
  } else if (p.trait === "coo") {
    // Planta: brotan y se retraen en el borde
    const pulse = (Math.sin(time * 1.2 + p.phase) + 1) / 2;
    const radius = baseRadius * (1.05 + pulse * 0.25);
    p.x = cx + Math.cos(p.angle) * radius;
    p.y = cy + Math.sin(p.angle) * radius;
    p.alpha = 0.4 + pulse * 0.5;
  } else if (p.trait === "dis") {
    // Tierra/metal: destellos cristalinos en órbita lenta
    const angle = p.angle + time * 0.15;
    const radius = baseRadius * p.radiusOffset;
    p.x = cx + Math.cos(angle) * radius;
    p.y = cy + Math.sin(angle) * radius;
    p.alpha = 0.5 + Math.sin(time * 4 + p.phase) * 0.3;
  } else if (p.trait === "ini") {
    // Rayo: chispas que aparecen y desaparecen bruscamente
    const flash = Math.sin(time * 5 + p.phase);
    const angle = p.angle + time * 0.4;
    const radius = baseRadius * p.radiusOffset;
    p.x = cx + Math.cos(angle) * radius;
    p.y = cy + Math.sin(angle) * radius;
    p.alpha = flash > 0.7 ? 1 : 0;
  } else if (p.trait === "lid") {
    // Aire: remolino amplio y lento
    const angle = p.angle + time * 0.25;
    const radius = baseRadius * (1.3 + p.radiusOffset * 0.3);
    p.x = cx + Math.cos(angle) * radius;
    p.y = cy + Math.sin(angle) * radius * 0.85;
    p.alpha = 0.35 + Math.sin(time * 1.5 + p.phase) * 0.2;
  }

  p.x = Math.min(canvasSize, Math.max(0, p.x));
  p.y = Math.min(canvasSize, Math.max(0, p.y));
}

function drawParticle(ctx, p) {
  if (p.alpha <= 0.02) return;
  const [r, g, b] = TRAIT_RGB[p.trait];
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  if (p.trait === "dis") {
    ctx.translate(p.x, p.y);
    ctx.rotate(Math.PI / 4);
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  } else if (p.trait === "ini") {
    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p.x - p.size, p.y);
    ctx.lineTo(p.x, p.y - p.size);
    ctx.lineTo(p.x + p.size, p.y + p.size);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function downloadMonsterImage(canvasId, filename) {
  const canvas = document.getElementById(canvasId);
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
