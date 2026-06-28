// Planet-inspired palette — each entry is [base, highlight, shadow, atmosphere]
export const PLANET_PALETTES = [
  { base: [60, 130, 200],  hi: [140, 200, 255], shadow: [20, 50, 90],   atmo: [80, 160, 240]  },  // Earth-like blue
  { base: [180, 120, 60],  hi: [240, 190, 130], shadow: [90, 50, 20],   atmo: [200, 150, 80]  },  // Jupiter amber
  { base: [160, 90, 50],   hi: [220, 160, 110], shadow: [80, 40, 15],   atmo: [190, 120, 70]  },  // Mars rust
  { base: [70, 170, 160],  hi: [150, 230, 220], shadow: [25, 70, 65],   atmo: [90, 200, 190]  },  // Neptune teal
  { base: [140, 80, 190],  hi: [200, 150, 240], shadow: [60, 30, 90],   atmo: [160, 100, 220] },  // Gas giant violet
  { base: [190, 170, 130], hi: [240, 220, 180], shadow: [90, 75, 50],   atmo: [210, 190, 150] },  // Saturn gold
  { base: [80, 140, 100],  hi: [150, 210, 170], shadow: [30, 60, 40],   atmo: [100, 170, 130] },  // Alien green
  { base: [200, 80, 100],  hi: [250, 150, 170], shadow: [90, 30, 40],   atmo: [220, 100, 130] },  // Red dwarf
];

export const NEBULA_COLORS = PLANET_PALETTES.map(p => p.base);

export const SOURCE_COLORS = {
  A: { bg: "rgba(220,130,70,0.15)", border: "rgba(220,130,70,0.35)", text: "rgba(240,170,100,0.9)" },
  I: { bg: "rgba(80,160,220,0.15)", border: "rgba(80,160,220,0.35)", text: "rgba(130,200,250,0.9)" },
};

export function nebulaRGB(i) {
  return PLANET_PALETTES[i % PLANET_PALETTES.length].base;
}

export function nebulaColor(i, alpha = 0.6) {
  const c = PLANET_PALETTES[i % PLANET_PALETTES.length].base;
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

export function getPalette(i) {
  return PLANET_PALETTES[i % PLANET_PALETTES.length];
}
