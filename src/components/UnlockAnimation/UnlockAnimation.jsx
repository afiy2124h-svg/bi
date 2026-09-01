import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import HeartBurst from "../Effects/HeartBurst";

export default function UnlockAnimation({ onDone }) {
    const [phase, setPhase] = useState(0);
    const [burst, setBurst] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 350);
        const t2 = setTimeout(() => setBurst(1), 420);
        const t3 = setTimeout(() => setPhase(2), 1100);
        const t4 = setTimeout(() => setPhase(3), 1900);
        const t5 = setTimeout(() => onDone(), 2800);
        return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    }, [onDone]);

    return (
        <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#2b0a22] via-[#6b1d4f] to-[#24104a]"
                animate={{ opacity: phase >= 1 ? 1 : 0.55 }}
                transition={{ duration: 1.2 }}
            />
            <motion.div
                className="absolute inset-0"
                animate={{
                    background: phase >= 1
                        ? "radial-gradient(circle at 50% 50%, rgba(252,217,168,0.35), transparent 60%)"
                        : "radial-gradient(circle at 50% 50%, rgba(244,114,182,0.15), transparent 60%)",
                }}
                transition={{ duration: 1.4 }}
            />

            <HeartBurst trigger={burst} count={34} />

            <AnimatePresence>
                {phase >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h1
                            className="font-display animated-gradient-text text-5xl font-bold sm:text-7xl"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Welcome, {birthdayConfig.name} ❤️
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>

            {phase >= 2 && (
                <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-hand mt-6 text-3xl text-purple-200 sm:text-4xl"
                >
                    You found it... it's your day.
                </motion.p>
            )}

            {phase >= 3 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute bottom-10 text-sm tracking-[0.35em] text-pink-200/50 uppercase"
                >
                    getting ready...
                </motion.p>
            )}
        </div>
    );
}
