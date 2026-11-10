import Image from "next/image";

const sceneArt = {
  portfolios: "08-shin-dress-uniform",
  assets: "01-lena-reaching",
  settings: "03-lena-wind",
  editor: "06-shin-scarf",
  privacy: "09-lena-bouquet",
  dashboard: "11-shin-soft-smile",
} as const;

export function WorkspaceScene({ surface }: { surface: string }) {
  const artwork = sceneArt[surface as keyof typeof sceneArt];
  if (!artwork) return null;
  return <div className="persona-scene" aria-hidden="true">
    <div className="persona-scene-art"><Image src={`/artwork/eighty-six/reference-set/${artwork}.webp`} alt="" fill sizes="100vw" /></div>
    <div className="persona-scene-water" />
  </div>;
}
