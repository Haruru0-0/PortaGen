export interface SoundPreset {
    id: string;
    name: string;
    description: string;
    sounds: {
        click: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        hover: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        windowOpen: {
            frequencies: number[];
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        windowClose: {
            frequencies: number[];
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        minimize: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        maximize: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        error: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        success: {
            frequencies: number[];
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        powerUp: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
        menu: {
            frequency: number;
            duration: number;
            volume: number;
            type: OscillatorType;
            envelope?: {
                attack?: number;
                decay?: number;
                sustain?: number;
                release?: number;
            };
        };
    };
}

export const SOUND_PRESETS: SoundPreset[] = [
    {
        id: "arcade",
        name: "Arcade",
        description: "Classic arcade games",
        sounds: {
            click: {
                frequency: 1200,
                duration: 0.08,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.005,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.055
                }
            },
            hover: {
                frequency: 800,
                duration: 0.06,
                volume: 0.25,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.03
                }
            },
            windowOpen: {
                frequencies: [523, 659, 784, 1047],
                duration: 0.12,
                volume: 0.35,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.03,
                    sustain: 0.6,
                    release: 0.08
                }
            },
            windowClose: {
                frequencies: [1047, 932, 831, 740],
                duration: 0.15,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.05,
                    sustain: 0.4,
                    release: 0.09
                }
            },
            minimize: {
                frequency: 600,
                duration: 0.1,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.07
                }
            },
            maximize: {
                frequency: 400,
                duration: 0.15,
                volume: 0.45,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.05,
                    sustain: 0.3,
                    release: 0.1
                }
            },
            error: {
                frequency: 150,
                duration: 0.4,
                volume: 0.5,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.8,
                    release: 0.29
                }
            },
            success: {
                frequencies: [523, 659, 784, 1047],
                duration: 0.2,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.04,
                    sustain: 0.7,
                    release: 0.15
                }
            },
            powerUp: {
                frequency: 200,
                duration: 0.3,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.02,
                    decay: 0.15,
                    sustain: 0.3,
                    release: 0.15
                }
            },
            menu: {
                frequency: 1000,
                duration: 0.05,
                volume: 0.3,
                type: 'square',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.4,
                    release: 0.035
                }
            }
        }
    },
    {
        id: "nintendo",
        name: "Nintendo",
        description: "8-bit console style",
        sounds: {
            click: {
                frequency: 1000,
                duration: 0.07,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.005,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.045
                }
            },
            hover: {
                frequency: 700,
                duration: 0.05,
                volume: 0.2,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.5,
                    release: 0.03
                }
            },
            windowOpen: {
                frequencies: [659, 784, 988, 1319],
                duration: 0.1,
                volume: 0.3,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.6,
                    release: 0.07
                }
            },
            windowClose: {
                frequencies: [1319, 1175, 1047, 932],
                duration: 0.12,
                volume: 0.35,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.04,
                    sustain: 0.4,
                    release: 0.06
                }
            },
            minimize: {
                frequency: 500,
                duration: 0.08,
                volume: 0.35,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.05
                }
            },
            maximize: {
                frequency: 350,
                duration: 0.12,
                volume: 0.4,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.04,
                    sustain: 0.3,
                    release: 0.08
                }
            },
            error: {
                frequency: 120,
                duration: 0.35,
                volume: 0.45,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.8,
                    release: 0.24
                }
            },
            success: {
                frequencies: [659, 784, 988, 1319],
                duration: 0.18,
                volume: 0.35,
                type: 'square',
                envelope: {
                    attack: 0.01,
                    decay: 0.03,
                    sustain: 0.7,
                    release: 0.13
                }
            },
            powerUp: {
                frequency: 180,
                duration: 0.25,
                volume: 0.35,
                type: 'square',
                envelope: {
                    attack: 0.02,
                    decay: 0.12,
                    sustain: 0.3,
                    release: 0.13
                }
            },
            menu: {
                frequency: 900,
                duration: 0.04,
                volume: 0.25,
                type: 'square',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.4,
                    release: 0.025
                }
            }
        }
    },
    {
        id: "minimal",
        name: "Minimal",
        description: "Subtle, professional",
        sounds: {
            click: {
                frequency: 800,
                duration: 0.05,
                volume: 0.2,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.4,
                    release: 0.03
                }
            },
            hover: {
                frequency: 600,
                duration: 0.04,
                volume: 0.1,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.02
                }
            },
            windowOpen: {
                frequencies: [440, 523],
                duration: 0.08,
                volume: 0.15,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.05
                }
            },
            windowClose: {
                frequencies: [523, 440],
                duration: 0.08,
                volume: 0.15,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.05
                }
            },
            minimize: {
                frequency: 300,
                duration: 0.06,
                volume: 0.15,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.04
                }
            },
            maximize: {
                frequency: 250,
                duration: 0.08,
                volume: 0.2,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.06
                }
            },
            error: {
                frequency: 100,
                duration: 0.2,
                volume: 0.25,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.05,
                    sustain: 0.7,
                    release: 0.14
                }
            },
            success: {
                frequencies: [440, 523, 659],
                duration: 0.12,
                volume: 0.2,
                type: 'sine',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.6,
                    release: 0.08
                }
            },
            powerUp: {
                frequency: 150,
                duration: 0.15,
                volume: 0.2,
                type: 'sine',
                envelope: {
                    attack: 0.02,
                    decay: 0.08,
                    sustain: 0.3,
                    release: 0.07
                }
            },
            menu: {
                frequency: 700,
                duration: 0.03,
                volume: 0.15,
                type: 'sine',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.015
                }
            }
        }
    },
    {
        id: "sci-fi",
        name: "Sci-Fi",
        description: "Space/futuristic",
        sounds: {
            click: {
                frequency: 1500,
                duration: 0.06,
                volume: 0.35,
                type: 'sawtooth',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.045
                }
            },
            hover: {
                frequency: 1000,
                duration: 0.05,
                volume: 0.2,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.4,
                    release: 0.03
                }
            },
            windowOpen: {
                frequencies: [800, 1200, 1600],
                duration: 0.1,
                volume: 0.3,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.07
                }
            },
            windowClose: {
                frequencies: [1600, 1200, 800],
                duration: 0.1,
                volume: 0.3,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.07
                }
            },
            minimize: {
                frequency: 700,
                duration: 0.08,
                volume: 0.3,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.06
                }
            },
            maximize: {
                frequency: 600,
                duration: 0.1,
                volume: 0.35,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.08
                }
            },
            error: {
                frequency: 200,
                duration: 0.3,
                volume: 0.4,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.7,
                    release: 0.19
                }
            },
            success: {
                frequencies: [1000, 1200, 1500],
                duration: 0.12,
                volume: 0.3,
                type: 'sawtooth',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.6,
                    release: 0.08
                }
            },
            powerUp: {
                frequency: 250,
                duration: 0.2,
                volume: 0.3,
                type: 'sawtooth',
                envelope: {
                    attack: 0.02,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 0.1
                }
            },
            menu: {
                frequency: 900,
                duration: 0.04,
                volume: 0.2,
                type: 'sawtooth',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.025
                }
            }
        }
    },
    {
        id: "retro-pop",
        name: "Retro Pop",
        description: "Cheerful, bouncy",
        sounds: {
            click: {
                frequency: 1100,
                duration: 0.07,
                volume: 0.3,
                type: 'triangle',
                envelope: {
                    attack: 0.005,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.045
                }
            },
            hover: {
                frequency: 850,
                duration: 0.05,
                volume: 0.15,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.4,
                    release: 0.03
                }
            },
            windowOpen: {
                frequencies: [700, 900, 1100],
                duration: 0.1,
                volume: 0.25,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.07
                }
            },
            windowClose: {
                frequencies: [1100, 900, 700],
                duration: 0.1,
                volume: 0.25,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.5,
                    release: 0.07
                }
            },
            minimize: {
                frequency: 600,
                duration: 0.08,
                volume: 0.2,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.06
                }
            },
            maximize: {
                frequency: 500,
                duration: 0.1,
                volume: 0.25,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.3,
                    release: 0.08
                }
            },
            error: {
                frequency: 180,
                duration: 0.25,
                volume: 0.3,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.1,
                    sustain: 0.7,
                    release: 0.14
                }
            },
            success: {
                frequencies: [800, 1000, 1200],
                duration: 0.12,
                volume: 0.25,
                type: 'triangle',
                envelope: {
                    attack: 0.01,
                    decay: 0.02,
                    sustain: 0.6,
                    release: 0.08
                }
            },
            powerUp: {
                frequency: 220,
                duration: 0.18,
                volume: 0.25,
                type: 'triangle',
                envelope: {
                    attack: 0.02,
                    decay: 0.1,
                    sustain: 0.3,
                    release: 0.08
                }
            },
            menu: {
                frequency: 800,
                duration: 0.04,
                volume: 0.15,
                type: 'triangle',
                envelope: {
                    attack: 0.005,
                    decay: 0.01,
                    sustain: 0.3,
                    release: 0.025
                }
            }
        }
    }
];