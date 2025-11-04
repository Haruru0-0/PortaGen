"use client"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import KuruKuru from "@/assets/KuruKuru.gif";

export function CuteSuspenseFallback() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (textRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(textRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(textRef.current, 
          { opacity: 0, y: -10 }, 
          { opacity: 1, y: 0, duration: 0.3 }
        );

        // Pulsing color animation
        gsap.to(textRef.current, {
          color: "#93c5fd",
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });

        // Scale animation
        gsap.to(textRef.current, {
          scale: 1.05,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });
      }
    }

    if (imageRef.current && !prefersReducedMotion) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-50">
      <p
        ref={textRef}
        className="text-3xl font-bold mb-2"
        style={{ color: "#bfdbfe" }}
      >
        Kuru kuru~
      </p>

      <div ref={imageRef} className="w-100 h-100 relative">
        <Image
          src={KuruKuru}
          alt="Kuru kuru"
          fill
          sizes="200px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
