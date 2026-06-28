// Rainbow-ordered planet palette
export const PLANET_PALETTES = [
  { base: [220, 50, 50],   hi: [255, 130, 130], shadow: [100, 20, 20],  atmo: [240, 80, 80]   },  // Red
  { base: [230, 130, 40],  hi: [255, 190, 110], shadow: [110, 55, 15],  atmo: [240, 160, 60]  },  // Orange
  { base: [220, 200, 50],  hi: [255, 240, 130], shadow: [100, 90, 15],  atmo: [240, 220, 80]  },  // Yellow
  { base: [60, 180, 80],   hi: [140, 230, 150], shadow: [20, 80, 30],   atmo: [80, 210, 100]  },  // Green
  { base: [50, 140, 220],  hi: [130, 200, 255], shadow: [15, 55, 110],  atmo: [70, 160, 240]  },  // Blue
  { base: [100, 60, 200],  hi: [170, 130, 250], shadow: [40, 20, 100],  atmo: [130, 80, 230]  },  // Indigo
  { base: [180, 60, 200],  hi: [230, 140, 250], shadow: [80, 20, 100],  atmo: [210, 80, 230]  },  // Violet
  { base: [200, 80, 140],  hi: [250, 150, 200], shadow: [90, 30, 60],   atmo: [220, 100, 170] },  // Pink
];

export const NEBULA_COLORS = PLANET_PALETTES.map(p => p.base);

export const SOURCE_COLORS = {
  A: { bg: "rgba(230,130,40,0.15)", border: "rgba(230,130,40,0.35)", text: "rgba(250,170,80,0.9)" },
  I: { bg: "rgba(50,140,220,0.15)", border: "rgba(50,140,220,0.35)", text: "rgba(130,200,255,0.9)" },
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
