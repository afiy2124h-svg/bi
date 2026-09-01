import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import HeartBurst from "../Effects/HeartBurst";
import FloatingHearts from "../Effects/FloatingHearts";

const STORAGE_KEY = "sneha-birthday-happiness";

function splitEmoji(option) {
    const match = option.match(/^(\p{Extended_Pictographic}\uFE0F?\s*)+/u);
    if (match) {
        return { emoji: match[0].trim(), text: option.slice(match[0].length).trim() };
    }
    return { emoji: "💝", text: option };
}

function usePersistedChoice() {
    const [saved] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        } catch {
            return null;
        }
    });
    return saved;
}

export default function HappinessGift() {
    const saved = usePersistedChoice();
    const [selected, setSelected] = useState(saved?.value || null);
    const [custom, setCustom] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [burst, setBurst] = useState(0);
    const [confirmation, setConfirmation] = useState(null);

    const save = (value) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, at: Date.now() }));
        } catch {
            // localStorage unavailable — keep in memory only
        }
    };

    const choose = (value) => {
        setSelected(value);
        save(value);
        setConfirmation({
            headline: "Then that's what I want for you. ❤️",
            detail: birthdayConfig.happinessConfirmation[1],
            wish: value,
        });
        setBurst((b) => b + 1);
        setConfirming(true);
        window.setTimeout(() => setConfirming(false), 2600);
    };

    const handleCustom = (e) => {
        e.preventDefault();
        const text = custom.trim();
        if (!text) return;
        choose(text);
    };

    const options = Array.isArray(birthdayConfig.giftOptions) ? birthdayConfig.giftOptions : [];

    return (
        <section
            id="gift"
            className="relative overflow-hidden px-5 py-24 sm:px-8"
        >
            <FloatingHearts count={8} seed={110} />

            <motion.h2
                className="font-display mx-auto max-w-3xl text-center text-3xl font-bold text-rose-soft sm:text-5xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8 }}
            >
                If I Could Give You One Gift... 🎁
            </motion.h2>

            <motion.p
                className="font-hand mx-auto mt-4 max-w-xl text-center text-2xl text-purple-200 sm:text-3xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.8 }}
            >
                What would make you happiest? ❤️
            </motion.p>

            <div className="mx-auto mt-12 max-w-4xl">
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                    {options.map((option, i) => {
                        const { emoji, text } = splitEmoji(option);
                        const isSelected = selected === option;
                        return (
                            <motion.button
                                key={i}
                                type="button"
                                onClick={() => choose(option)}
                                className="glass group relative overflow-hidden rounded-3xl px-4 py-5 text-left transition-all duration-300 sm:px-6 sm:py-7"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
                                whileHover={{ y: -6 }}
                                whileTap={{ scale: 0.97 }}
                                aria-pressed={isSelected}
                                style={
                                    isSelected
                                        ? {
                                              borderColor: "rgba(244,114,182,0.8)",
                                              boxShadow: "0 0 0 1px #f472b6, 0 0 40px rgba(244,114,182,0.45)",
                                              background: "rgba(244,114,182,0.16)",
                                          }
                                        : undefined
                                }
                            >
                                <span className="mb-2 block text-3xl transition-transform duration-300 group-hover:scale-110 sm:text-4xl">
                                    {emoji}
                                </span>
                                <span className="block text-sm font-medium text-white sm:text-base">
                                    {text}
                                </span>
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.span
                                            className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-300/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </motion.button>
                        );
                    })}
                </div>

                {/* Custom wish */}
                <motion.form
                    onSubmit={handleCustom}
                    className="glass mt-10 rounded-3xl p-6 sm:p-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <p className="font-hand text-center text-2xl text-purple-100 sm:text-3xl">
                        Or tell me what would make you happiest...
                    </p>
                    <label htmlFor="wish" className="sr-only">
                        Your wish
                    </label>
                    <textarea
                        id="wish"
                        rows="3"
                        placeholder="Tell me your wish... ❤️"
                        value={custom}
                        onChange={(e) => setCustom(e.target.value)}
                        className="mt-5 w-full resize-none rounded-2xl border border-pink-300/25 bg-white/10 px-5 py-4 text-white placeholder:text-pink-200/50 focus:border-pink-300/70 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
                    />
                    <div className="mt-5 flex justify-center">
                        <button type="submit" className="btn-romantic">
                            Choose My Happiness ❤️
                        </button>
                    </div>
                </motion.form>

                {/* Confirmation */}
                <div className="relative">
                    <AnimatePresence>
                        {confirming && (
                            <motion.div
                                key={`confirm-${burst}`}
                                className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <HeartBurst trigger={burst} count={30} />
                                <motion.div
                                    className="glass-strong glow-border mx-auto max-w-md rounded-3xl px-7 py-9 text-center"
                                    initial={{ scale: 0.7, y: 24, opacity: 0 }}
                                    animate={{ scale: 1, y: 0, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                >
                                    <span className="text-4xl">💖</span>
                                    <h3 className="font-display mt-4 text-2xl font-semibold text-rose-soft">
                                        {confirmation.headline}
                                    </h3>
                                    <p className="mt-2 text-sm text-purple-100/80">
                                        {confirmation.detail}
                                    </p>
                                    <p className="font-hand mt-4 text-2xl text-pink-200">
                                        “{confirmation.wish}”
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
