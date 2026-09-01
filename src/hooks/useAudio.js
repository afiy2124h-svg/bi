import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A small, leak-free wrapper around the HTML5 Audio API.
 * The audio element is created lazily and cleaned up on unmount.
 */
export default function useAudio(src) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);

    useEffect(() => {
        let audio = null;

        if (!src) {
            setHasError(true);
            return undefined;
        }

        audio = new Audio(src);
        audio.preload = "auto";
        audio.loop = true;
        audio.volume = 0.8;
        audioRef.current = audio;

        const onLoaded = () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                setDuration(audio.duration);
            }
            setIsReady(true);
            setHasError(false);
        };
        const onTime = () => setCurrentTime(audio.currentTime);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onEnded = () => setIsPlaying(false);
        const onError = () => {
            setHasError(true);
            setIsReady(false);
            setIsPlaying(false);
        };

        audio.addEventListener("loadedmetadata", onLoaded);
        audio.addEventListener("loadeddata", onLoaded);
        audio.addEventListener("timeupdate", onTime);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);
        audio.addEventListener("ended", onEnded);
        audio.addEventListener("error", onError);

        return () => {
            audio.pause();
            audio.removeEventListener("loadedmetadata", onLoaded);
            audio.removeEventListener("loadeddata", onLoaded);
            audio.removeEventListener("timeupdate", onTime);
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
            audio.removeEventListener("ended", onEnded);
            audio.removeEventListener("error", onError);
            audio.src = "";
            audioRef.current = null;
        };
    }, [src]);

    const play = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio
            .play()
            .then(() => {})
            .catch(() => {
                setHasError(true);
                setIsPlaying(false);
            });
    }, []);

    const pause = useCallback(() => {
        audioRef.current?.pause();
    }, []);

    const toggle = useCallback(() => {
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            play();
        } else {
            pause();
        }
    }, [play, pause]);

    const seek = useCallback((t) => {
        const audio = audioRef.current;
        if (!audio) return;
        const target = Math.min(Math.max(0, t), audio.duration || 0);
        audio.currentTime = target;
        setCurrentTime(target);
    }, []);

    const changeVolume = useCallback((v) => {
        const audio = audioRef.current;
        const clamped = Math.min(Math.max(0, v), 1);
        if (audio) audio.volume = clamped;
        setVolume(clamped);
    }, []);

    return {
        play,
        pause,
        toggle,
        seek,
        changeVolume,
        isPlaying,
        isReady,
        hasError,
        currentTime,
        duration,
        volume,
    };
}
