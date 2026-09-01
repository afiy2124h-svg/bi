import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import ConfettiCanvas from "../Effects/ConfettiCanvas";
import AmbientBackground from "../Effects/AmbientBackground";
import FloatingHearts from "../Effects/FloatingHearts";

export default function FinalSurprise({ onReplay }) {
    const [opened, setOpened] = useState(false);
    const [fireworks, setFireworks] = useState(0);

    const openSurprise = () => {
        setOpened(true);
        setFireworks((f) => f + 1);
    };

    return (
        <section
            id="final"
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
        >
            <AmbientBackground stars />
            <FloatingHearts count={12} seed={202} />

            <ConfettiCanvas fireworksKey={fireworks} rain={opened} />

            <AnimatePresence mode="wait">
                {!opened ? (
                    <motion.div
                        key="final-1"
                        className="relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.h2
                            className="font-display text-3xl font-semibold text-rose-soft sm:text-5xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            One Last Thing... ❤️
                        </motion.h2>
                        <motion.p
                            className="font-hand mt-6 text-2xl text-purple-200 sm:text-3xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            Are you ready for it?
                        </motion.p>
                        <motion.button
                            className="btn-romantic mt-12 animate-pulse-glow text-base sm:text-lg"
                            onClick={openSurprise}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.9, duration: 0.6 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            Open Your Surprise 🎁
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="final-2"
                        className="relative z-10 max-w-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.span
                            className="block text-6xl sm:text-7xl"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
                        >
                            🎂
                        </motion.span>

                        <motion.h1
                            className="font-display animated-gradient-text mt-6 text-5xl font-extrabold leading-tight sm:text-7xl"
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.9, ease: "easeOut" }}
                        >
                            Happy Birthday, {birthdayConfig.name}! 🎂❤️
                        </motion.h1>

                        {birthdayConfig.finalLines.map((line, i) => (
                            <motion.p
                                key={i}
                                className="mt-5 text-base leading-relaxed text-purple-100/85 sm:text-xl"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 + i * 0.5, duration: 0.8 }}
                            >
                                {line}
                            </motion.p>
                        ))}

                        <motion.button
                            className="btn-ghost mt-12"
                            onClick={onReplay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.3, duration: 0.8 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Replay Our Memories ✨
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
