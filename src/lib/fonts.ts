import { Press_Start_2P, Pixelify_Sans, Inter, Roboto, Outfit, Orbitron, Poppins, Space_Grotesk, Rajdhani } from "next/font/google";

export const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
    display: "swap",
});

export const pixelifySans = Pixelify_Sans({
    subsets: ["latin"],
    variable: "--font-retro",
    display: "swap",
});

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const roboto = Roboto({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-roboto",
    display: "swap",
});

export const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const orbitron = Orbitron({
    subsets: ["latin"],
    variable: "--font-orbitron",
    display: "swap",
});

export const poppins = Poppins({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-poppins",
    display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
    display: "swap",
});

export const rajdhani = Rajdhani({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-rajdhani",
    display: "swap",
});

export const PORTFOLIO_FONTS = [
    { name: "Press Start 2P", className: pressStart2P.className, variable: pressStart2P.variable, fontFamily: '"Press Start 2P"' },
    { name: "Pixelify Sans", className: pixelifySans.className, variable: pixelifySans.variable, fontFamily: '"Pixelify Sans"' },
    { name: "Inter", className: inter.className, variable: inter.variable, fontFamily: 'Inter' },
    { name: "Roboto", className: roboto.className, variable: roboto.variable, fontFamily: 'Roboto' },
    { name: "Outfit", className: outfit.className, variable: outfit.variable, fontFamily: 'Outfit' },
    { name: "Orbitron", className: orbitron.className, variable: orbitron.variable, fontFamily: 'Orbitron' },
    { name: "Poppins", className: poppins.className, variable: poppins.variable, fontFamily: 'Poppins' },
    { name: "Space Grotesk", className: spaceGrotesk.className, variable: spaceGrotesk.variable, fontFamily: '"Space Grotesk"' },
    { name: "Rajdhani", className: rajdhani.className, variable: rajdhani.variable, fontFamily: 'Rajdhani' },
];