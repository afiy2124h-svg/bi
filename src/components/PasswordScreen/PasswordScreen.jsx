import { useState } from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import AmbientBackground from "../Effects/AmbientBackground";
import HeartBurst from "../Effects/HeartBurst";

export default function PasswordScreen({ onUnlock }) {
    const [value, setValue] = useState("");
    const [shakeKey, setShakeKey] = useState(0);
    const [wrong, setWrong] = useState(false);
    const [success, setSuccess] = useState(false);
    const [burst, setBurst] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value === birthdayConfig.password) {
            setSuccess(true);
            setBurst((b) => b + 1);
            setTimeout(() => onUnlock(), 900);
        } else {
            setWrong(true);
            setShakeKey((k) => k + 1);
            setValue("");
            setTimeout(() => setWrong(false), 2600);
        }
    };

    return (
        <div className="relative z-10 flex min-h-dvh items-center justify-center px-5 py-10">
            <AmbientBackground bright />

            <motion.div
                key={shakeKey}
                animate={
                    wrong
                        ? { x: [0, -14, 14, -10, 10, -5, 5, 0] }
                        : { x: 0 }
                }
                transition={wrong ? { duration: 0.55, ease: "easeInOut" } : { duration: 0.2 }}
                className="relative w-full max-w-md"
            >
                <motion.form
                    onSubmit={handleSubmit}
                    className="glass-strong glow-border relative overflow-hidden rounded-3xl px-7 py-10 text-center sm:px-10"
                    animate={success ? { opacity: 0, scale: 0.94, filter: "brightness(1.8)" } : {}}
                    transition={{ duration: 0.7 }}
                >
                    <HeartBurst trigger={burst} count={26} />

                    {/* Lock / heart icon */}
                    <motion.div
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/30 to-purple-500/30 ring-1 ring-pink-300/50"
                        animate={{
                            scale: success ? [1, 1.25, 1] : 1,
                            boxShadow: success
                                ? ["0 0 20px rgba(244,114,182,.3)", "0 0 70px rgba(244,114,182,.9)", "0 0 40px rgba(244,114,182,.6)"]
                                : "0 0 30px rgba(244,114,182,.35)",
                        }}
                        transition={{ duration: 1.1 }}
                    >
                        <svg
                            width="38"
                            height="38"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <motion.path
                                d="M5 11h14v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9z"
                                fill="rgba(244,114,182,0.55)"
                            />
                            <motion.path
                                d="M12 14.5v2.5"
                                stroke="#fff"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                            <motion.path
                                d="M8 11V7a4 4 0 0 1 8 0v4"
                                stroke="#fff"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                animate={
                                    success
                                        ? {
                                              pathLength: [1, 0.3],
                                              opacity: [1, 0],
                                          }
                                        : {}
                                }
                                transition={{ duration: 0.5 }}
                            />
                            <motion.path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="#f472b6"
                                opacity={0}
                                animate={success ? { opacity: [0, 1] } : {}}
                                transition={{ duration: 0.4, delay: 0.35 }}
                            />
                        </svg>
                    </motion.div>

                    <h1 className="font-display text-2xl font-semibold leading-snug text-rose-soft sm:text-3xl">
                        This little surprise is only for someone special... ❤️
                    </h1>

                    <p className="font-hand mt-4 text-2xl text-purple-200">
                        Do you know the secret?
                    </p>

                    <label htmlFor="secret" className="sr-only">
                        Enter the secret password
                    </label>
                    <input
                        id="secret"
                        type="password"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="••••••"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="mt-7 w-full rounded-2xl border border-pink-300/30 bg-white/10 px-5 py-4 text-center text-lg tracking-[0.5em] text-white placeholder:text-pink-200/40 focus:border-pink-300/70 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
                        aria-invalid={wrong}
                        aria-describedby={wrong ? "secret-hint" : undefined}
                    />

                    {wrong && (
                        <motion.p
                            id="secret-hint"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-sm text-rose-200/90"
                        >
                            Hmm... that's not the secret ❤️ Try again...
                        </motion.p>
                    )}

                    <motion.button
                        type="submit"
                        className="btn-romantic mt-6 w-full text-base sm:text-lg"
                        whileTap={{ scale: 0.97 }}
                    >
                        Unlock My Surprise ❤️
                    </motion.button>

                    <p className="mt-6 text-xs text-pink-100/40">
                        Made with love, just for you.
                    </p>
                </motion.form>
            </motion.div>
        </div>
    );
}
