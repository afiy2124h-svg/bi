import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";

function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MusicPlayer({ audio, active }) {
    const [open, setOpen] = useState(false);
    const [showHint, setShowHint] = useState(false);

    if (!active) return null;

    const pct = audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0;

    return (
        <div className="fixed right-3 bottom-3 z-50 sm:right-5 sm:bottom-5">
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        className="glass-strong mb-3 w-[260px] rounded-3xl p-4 sm:w-[290px]"
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        role="group"
                        aria-label="Music player"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 shrink-0">
                                <div
                                    className={`absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 ${
                                        audio.isPlaying ? "animate-spin-slow" : ""
                                    }`}
                                    style={{
                                        maskImage: "radial-gradient(circle, black 55%, transparent 62%)",
                                        WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 62%)",
                                    }}
                                />
                                <span className="absolute inset-0 flex items-center justify-center text-sm">
                                    🎵
                                </span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">
                                    {birthdayConfig.name}'s Song ♥
                                </p>
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-purple-200/70">
                                    <span className="eq tabular">
                                        <span />
                                        <span />
                                        <span />
                                        <span />
                                    </span>
                                    <span className="tabular">
                                        {formatTime(audio.currentTime)} / {formatTime(audio.duration)}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="icon-btn !h-10 !w-10 shrink-0"
                                onClick={audio.toggle}
                                aria-label={audio.isPlaying ? "Pause music" : "Play music"}
                                aria-pressed={audio.isPlaying}
                            >
                                {audio.isPlaying ? (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <rect x="6" y="5" width="4" height="14" rx="1.5" />
                                        <rect x="14" y="5" width="4" height="14" rx="1.5" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.74l-11-6.86A1 1 0 0 0 8 5.14z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {audio.hasError ? (
                            <p className="mt-3 rounded-xl border border-amber-200/30 bg-amber-500/10 px-3 py-2 text-center text-[11px] leading-snug text-amber-100">
                                Add <code>birthday-song.mp3</code> to{" "}
                                <code>public/assets/music/</code> to play music.
                            </p>
                        ) : (
                            <>
                                <input
                                    type="range"
                                    min="0"
                                    max={audio.duration || 0}
                                    step="0.1"
                                    value={audio.currentTime}
                                    onChange={(e) => audio.seek(Number(e.target.value))}
                                    className="mt-3 w-full"
                                    style={{ "--fill": `${pct}%` }}
                                    aria-label="Music progress"
                                />
                                <div className="mt-3 flex items-center gap-3">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-pink-200/80">
                                        <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
                                        <path
                                            d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
                                            stroke="currentColor"
                                            strokeWidth="1.6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={audio.volume}
                                        onChange={(e) => audio.changeVolume(Number(e.target.value))}
                                        className="w-full"
                                        style={{ "--fill": `${audio.volume * 100}%` }}
                                        aria-label="Volume"
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end">
                <motion.button
                    className="glass-strong glow-border relative flex h-14 w-14 items-center justify-center rounded-full"
                    onClick={() => {
                        if (audio.hasError) {
                            setShowHint((s) => !s);
                            return;
                        }
                        setOpen((o) => !o);
                    }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={open ? "Close music player" : "Open music player"}
                    aria-expanded={open}
                >
                    <span className={`eq ${audio.isPlaying ? "" : "paused"}`}>
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                    {!audio.isPlaying && !audio.hasError && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] text-white">
                            ♪
                        </span>
                    )}
                    {audio.hasError && <span className="text-base">🎶</span>}
                </motion.button>
            </div>

            <AnimatePresence>
                {showHint && (
                    <motion.div
                        className="glass-strong absolute right-0 bottom-16 w-56 rounded-2xl p-3 text-[11px] leading-snug text-pink-100"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                    >
                        Music not found. Add your song at{" "}
                        <code>public/assets/music/birthday-song.mp3</code> — the site
                        still works without it. 💿
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
