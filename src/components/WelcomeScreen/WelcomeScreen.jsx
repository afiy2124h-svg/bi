import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import useCountdown from "../../hooks/useCountdown";
import FloatingHearts from "../Effects/FloatingHearts";

function pad(n) {
    return String(n).padStart(2, "0");
}

function CountdownCard({ isToday }) {
    const { days, hours, minutes, seconds } = useCountdown(birthdayConfig.birthday);

    if (isToday) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 inline-block rounded-2xl border border-amber-200/40 bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-6 py-4 text-center backdrop-blur-md"
            >
                <span className="font-hand text-3xl text-amber-100">
                    Today is your special day, {birthdayConfig.name}! 🎂❤️
                </span>
            </motion.div>
        );
    }

    const cells = [
        { label: "days", value: days },
        { label: "hours", value: hours },
        { label: "minutes", value: minutes },
        { label: "seconds", value: seconds },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
        >
            <p className="mb-4 text-xs tracking-[0.35em] text-pink-200/70 uppercase">
                counting down to your day
            </p>
            <div className="flex items-stretch justify-center gap-2 sm:gap-4">
                {cells.map((cell) => (
                    <div
                        key={cell.label}
                        className="glass flex w-16 flex-col items-center rounded-2xl px-2 py-3 sm:w-24 sm:py-4"
                    >
                        <span className="font-display tabular text-2xl font-bold text-rose-soft sm:text-4xl">
                            {pad(cell.value)}
                        </span>
                        <span className="mt-1 text-[10px] uppercase tracking-widest text-purple-200/70 sm:text-xs">
                            {cell.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default function WelcomeScreen({ onBegin, onStart }) {
    const [stage, setStage] = useState(1);
    const countdown = useCountdown(birthdayConfig.birthday);
    const showCountdown = birthdayConfig.showCountdown && !countdown.isToday;

    return (
        <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16">
            <FloatingHearts count={18} seed={21} />

            <AnimatePresence mode="wait">
                {stage === 1 ? (
                    <motion.div
                        key="stage-1"
                        className="relative z-10 mx-auto max-w-2xl text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.97 }}
                        transition={{ duration: 0.7 }}
                    >
                        <motion.p
                            className="font-hand text-3xl leading-relaxed text-purple-100 sm:text-4xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            {birthdayConfig.welcomeIntro}
                        </motion.p>
                        <motion.p
                            className="mt-6 text-sm leading-relaxed text-pink-200/70 sm:text-base"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            Just press the button... and let the music lead the way. 🎵
                        </motion.p>
                        <motion.button
                            className="btn-romantic mt-10 text-base sm:text-lg"
                            onClick={() => {
                                setStage(2);
                                onBegin();
                            }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Begin Your Birthday Surprise ✨
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="stage-2"
                        className="relative z-10 mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.7 }}
                    >
                        <AnimatePresence>
                            {showCountdown && <CountdownCard key="countdown" isToday={false} />}
                            {birthdayConfig.showCountdown && countdown.isToday && (
                                <CountdownCard key="today" isToday />
                            )}
                        </AnimatePresence>

                        <motion.p
                            className="font-hand text-2xl text-pink-200/90 sm:text-3xl"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            Someone very special was born today...
                        </motion.p>

                        <motion.h1
                            className="font-display animated-gradient-text mt-5 text-5xl font-extrabold leading-tight sm:text-7xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.9, ease: "easeOut" }}
                        >
                            Happy Birthday, {birthdayConfig.name}! 🎂❤️
                        </motion.h1>

                        <motion.p
                            className="mt-6 text-base text-purple-100/80 sm:text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                        >
                            Today is all about you.
                        </motion.p>

                        <motion.button
                            className="btn-romantic mt-10 text-base sm:text-lg"
                            onClick={onStart}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Start the Surprise ❤️
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
