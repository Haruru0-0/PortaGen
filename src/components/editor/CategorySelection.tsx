
import { PixelCard } from "@/components/pixel-card";
import Image from "next/image";
import Potion from "@/assets/Potion.png";
import Jellyfish from "@/assets/Jellyfish.png";

interface CategorySelectionProps {
  activeCategory: string;
  setActiveCategory: (category: "lockScreen" | "homeScreen") => void;
}

export const CategorySelection = ({
  activeCategory,
  setActiveCategory,
}: CategorySelectionProps) => {
  return (
    <div className="mb-6">
      <PixelCard>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setActiveCategory("lockScreen")}
            className={`flex cursor-pointer items-center justify-center gap-3 px-4 py-3 text-sm border-2 border-border transition-colors font-bold ${
              activeCategory === "lockScreen"
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            <Image src={Potion} alt={"potion"} className={"w-8 h-8"} />
            LOCK SCREEN
          </button>
          <button
            onClick={() => setActiveCategory("homeScreen")}
            className={`flex cursor-pointer items-center justify-center gap-3 px-4 py-3 text-sm border-2 border-border transition-colors font-bold ${
              activeCategory === "homeScreen"
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-muted"
            }`}
          >
            <Image src={Jellyfish} alt={"jellyfish"} className={"w-8 h-8"} />
            HOME SCREEN
          </button>
        </div>
      </PixelCard>
    </div>
  );
};
