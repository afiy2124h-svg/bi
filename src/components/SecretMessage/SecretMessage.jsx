import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import HeartBurst from "../Effects/HeartBurst";

const CLICKS_NEEDED = 5;
const RESET_AFTER_MS = 8000;

export default function SecretMessage() {
    const [count, setCount] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [burst, setBurst] = useState(0);
    const resetTimer = useRef(null);

    const handleClick = () => {
        const next = count + 1;
        setCount(next);
        setBurst((b) => b + 1);

        window.clearTimeout(resetTimer.current);
        resetTimer.current = window.setTimeout(() => setCount(0), RESET_AFTER_MS);

        if (next >= CLICKS_NEEDED) {
            setRevealed(true);
            window.clearTimeout(resetTimer.current);
        }
    };

    useEffect(() => {
        return () => window.clearTimeout(resetTimer.current);
    }, []);

    if (!birthdayConfig.enableSecretMessage) return null;

    return (
        <>
            <motion.button
                type="button"
                onClick={handleClick}
                className="fixed bottom-3 left-3 z-50 flex h-10 w-10 items-center justify-center rounded-full text-pink-300/25 transition-colors duration-300 hover:text-pink-300/70 sm:bottom-5 sm:left-5"
                aria-label="A little secret (tap me)"
                whileTap={{ scale: 0.85 }}
            >
                <span className="animate-heartbeat text-xl">💗</span>
            </motion.button>

            <AnimatePresence>
                {revealed && (
                    <motion.div
                        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setRevealed(false)}
                    >
                        <HeartBurst trigger={burst} count={26} />
                        <motion.div
                            className="glass-strong glow-border relative max-w-md rounded-3xl px-7 py-9 text-center"
                            initial={{ scale: 0.7, y: 24 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 240, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Secret message"
                        >
                            <span className="text-4xl">💌</span>
                            <h3 className="font-display mt-4 text-2xl font-semibold text-rose-soft">
                                ❤️ You found the secret message ❤️
                            </h3>
                            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-purple-50/90">
                                {birthdayConfig.secretMessage}
                            </p>
                            <button
                                className="btn-ghost mt-7 text-sm"
                                onClick={() => setRevealed(false)}
                            >
                                Close with love 💖
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
