export interface GrainTextureOptions {
  opacity?: number;
  seed?: number;
  baseFrequency?: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createGrainSvg(options: GrainTextureOptions = {}): string {
  const opacity = clamp(options.opacity ?? 0.14, 0, 1);
  const seed = Math.round(options.seed ?? 17);
  const frequency = clamp(options.baseFrequency ?? 0.82, 0.05, 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${opacity}"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#grain)"/></svg>`;
}

export function createGrainTexture(options: GrainTextureOptions = {}): string {
  return `url("data:image/svg+xml,${encodeURIComponent(createGrainSvg(options))}")`;
}

export function grainTextureStyle(options: GrainTextureOptions = {}): { backgroundImage: string } {
  return { backgroundImage: createGrainTexture(options) };
}
