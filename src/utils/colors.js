// Hubble Space Telescope palette
// Named after the nebulae and regions they reference
export const NEBULA_COLORS = [
  [66, 150, 240],   // Pillars of Creation — blue
  [180, 100, 220],  // Eagle Nebula — violet
  [80, 200, 210],   // Crab Nebula — cyan
  [220, 130, 70],   // Carina Nebula — warm amber
  [140, 80, 190],   // Ring Nebula — purple
  [60, 180, 160],   // Lagoon Nebula — teal
  [200, 80, 100],   // Rosette Nebula — deep rose
  [100, 170, 240],  // Orion Nebula — ice blue
];

// Source badge colors
export const SOURCE_COLORS = {
  A: { bg: "rgba(220,130,70,0.15)", border: "rgba(220,130,70,0.35)", text: "rgba(240,170,100,0.9)" },
  I: { bg: "rgba(80,160,220,0.15)", border: "rgba(80,160,220,0.35)", text: "rgba(130,200,250,0.9)" },
};

export function nebulaRGB(i) {
  return NEBULA_COLORS[i % NEBULA_COLORS.length];
}

export function nebulaColor(i, alpha = 0.6) {
  const c = NEBULA_COLORS[i % NEBULA_COLORS.length];
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}
