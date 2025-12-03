import { Track } from "@/lib/types";

export interface PlayerControlsProps {
    isPlaying: boolean;
    isLoading: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onShuffle?: () => void;
    onRepeat?: () => void;
    buttonsRef: React.MutableRefObject<HTMLButtonElement[]>;
    handleButtonHover: (index: number) => void;
    handleButtonLeave: (index: number) => void;
    handleButtonClick: (index: number) => void;
}

export interface SongInfoProps {
    track: Track;
    useSpotify: boolean;
    spotifyTrack: any;
    albumCoverRef?: React.RefObject<HTMLDivElement | null>;
}

export interface ProgressBarProps {
    progress: number;
    duration: string; // Display string
    durationMs?: number; // For Spotify calculation
    onSeek: (value: number[]) => void;
    formatTime: (progress: number) => string;
    isLoading: boolean;
}

export interface VolumeControlProps {
    volume: number;
    onVolumeChange: (value: number[]) => void;
    isLoading: boolean;
}

export interface PlaylistProps {
    tracks: Track[];
    currentTrackId: number;
    onTrackSelect: (track: Track) => void;
    useSpotify: boolean;
    spotifyPlaylistTracks: any[];
    spotifyCurrentTrack: any;
    formatDuration: (ms: number) => string;
    onClose?: () => void;
}
