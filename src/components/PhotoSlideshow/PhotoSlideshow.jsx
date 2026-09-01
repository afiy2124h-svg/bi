import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import FloatingHearts from "../Effects/FloatingHearts";

const SLIDE_DURATION = 6500;

function PhotoFallback({ label = "A beautiful moment" }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-rose-300/20 via-purple-400/20 to-pink-500/20 text-center">
            <span className="animate-heartbeat text-5xl">💖</span>
            <span className="font-hand text-2xl text-pink-100">{label}</span>
        </div>
    );
}

export default function PhotoSlideshow() {
    const photos = Array.isArray(birthdayConfig.photos) ? birthdayConfig.photos : [];
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const [failed, setFailed] = useState({});
    const sectionRef = useRef(null);
    const timerRef = useRef(null);

    const next = useCallback(() => {
        setIndex((i) => (i + 1) % photos.length);
    }, [photos.length]);

    const prev = useCallback(() => {
        setIndex((i) => (i - 1 + photos.length) % photos.length);
    }, [photos.length]);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver(
            (entries) => setVisible(entries[0].isIntersecting),
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible || paused || photos.length < 2) return undefined;
        const id = setTimeout(next, SLIDE_DURATION);
        return () => clearTimeout(id);
    }, [visible, paused, photos.length, index, next]);

    useEffect(() => {
        if (!visible) return undefined;
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === " ") {
                e.preventDefault();
                setPaused((p) => !p);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [visible, next, prev]);

    useEffect(() => {
        if (photos.length > 1) {
            const nextPhoto = photos[(index + 1) % photos.length];
            if (nextPhoto?.image) {
                const img = new Image();
                img.src = nextPhoto.image;
            }
        }
    }, [index, photos]);

    if (photos.length === 0) {
        return (
            <section id="slideshow" className="relative flex min-h-dvh items-center justify-center px-6">
                <div className="glass rounded-3xl p-10 text-center">
                    <span className="text-4xl">🌸</span>
                    <p className="mt-4 text-pink-100">
                        Add photos to <code>public/assets/images/</code> and update the{" "}
                        <code>photos</code> array in{" "}
                        <code>src/config/birthday.js</code>.
                    </p>
                </div>
            </section>
        );
    }

    const current = photos[index];
    const isFailed = failed[current.image];

    return (
        <section
            id="slideshow"
            ref={sectionRef}
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6"
            aria-roledescription="Photo slideshow"
        >
            <FloatingHearts count={8} seed={77} />

            <motion.h2
                className="font-display mb-8 text-center text-3xl font-bold text-rose-soft sm:text-5xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                A Few Moments with You ✨
            </motion.h2>

            <div className="relative w-full max-w-4xl">
                {/* Glow */}
                <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-pink-500/15 blur-3xl" aria-hidden="true" />

                {/* Gradient frame */}
                <div className="glow-soft relative rounded-[1.75rem] bg-gradient-to-br from-pink-400 via-purple-500 to-amber-300 p-[3px]">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.6rem] bg-[#14060f] sm:aspect-[16/10]">
                        <AnimatePresence mode="sync">
                            <motion.div
                                key={index}
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.1, ease: "easeInOut" }}
                            >
                                {isFailed ? (
                                    <PhotoFallback />
                                ) : (
                                    <>
                                        {/* Blurred backdrop fill (never distorts) */}
                                        <img
                                            src={current.image}
                                            alt=""
                                            aria-hidden="true"
                                            loading="lazy"
                                            onError={() => setFailed((f) => ({ ...f, [current.image]: true }))}
                                            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                                        />
                                        {/* Real photo (never stretches) */}
                                        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
                                            <img
                                                src={current.image}
                                                alt={current.caption || `${birthdayConfig.name}'s photo ${index + 1}`}
                                                loading="lazy"
                                                onError={() => setFailed((f) => ({ ...f, [current.image]: true }))}
                                                className={`max-h-full max-w-full rounded-lg object-contain shadow-2xl ${
                                                    index % 2 === 0 ? "animate-kenburns-in" : "animate-kenburns-out"
                                                }`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Soft inner glow */}
                                <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-white/10" aria-hidden="true" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Caption */}
                        <AnimatePresence>
                            <motion.div
                                key={`cap-${index}`}
                                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-14 pb-4 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.9, delay: 0.5 }}
                            >
                                <p className="font-hand text-xl text-pink-50 drop-shadow sm:text-2xl">
                                    {current.caption}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Counter */}
                <p className="tabular mt-4 text-center text-sm tracking-widest text-purple-200/70">
                    {index + 1} <span className="text-purple-300/40">/</span> {photos.length}
                </p>

                {/* Progress bars */}
                <div className="mt-3 flex justify-center gap-1.5" role="progressbar" aria-label={`Photo ${index + 1} of ${photos.length}`}>
                    {photos.map((p, i) => (
                        <div
                            key={i}
                            className={`h-1 overflow-hidden rounded-full transition-colors duration-500 ${
                                i === index ? "w-8 bg-white/20" : "w-3 bg-white/10"
                            }`}
                        >
                            {i === index && (
                                <div
                                    className="progress-fill h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
                                    style={{
                                        animationDuration: `${SLIDE_DURATION}ms`,
                                        animationPlayState: paused ? "paused" : "running",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <button className="icon-btn" onClick={prev} aria-label="Previous photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="icon-btn !h-11 !w-11"
                        onClick={() => setPaused((p) => !p)}
                        aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                        aria-pressed={paused}
                    >
                        {paused ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.74l-11-6.86A1 1 0 0 0 8 5.14z" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <rect x="6" y="5" width="4" height="14" rx="1.5" />
                                <rect x="14" y="5" width="4" height="14" rx="1.5" />
                            </svg>
                        )}
                    </button>
                    <button className="icon-btn" onClick={next} aria-label="Next photo">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
