import { useState } from "react";
import { motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import FloatingHearts from "../Effects/FloatingHearts";

function MemoryCard({ memory, index, flip }) {
    const [failed, setFailed] = useState(false);

    return (
        <motion.article
            className={`relative z-10 w-full sm:w-[calc(50%-2.5rem)] ${
                flip ? "sm:ml-auto" : ""
            }`}
            initial={{ opacity: 0, y: 60, x: flip ? 40 : -40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="glass glow-border overflow-hidden rounded-3xl p-3 sm:p-4">
                <div className="relative overflow-hidden rounded-2xl bg-[#14060f]">
                    {failed ? (
                        <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-rose-300/20 to-purple-400/20">
                            <span className="animate-heartbeat text-4xl">💗</span>
                        </div>
                    ) : (
                        <img
                            src={memory.image}
                            alt={memory.title}
                            loading="lazy"
                            onError={() => setFailed(true)}
                            className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    )}
                    {memory.date && (
                        <span className="glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-pink-100">
                            {memory.date}
                        </span>
                    )}
                </div>
                <div className="px-2 pt-4 pb-2">
                    <h3 className="font-display text-xl font-semibold text-rose-soft sm:text-2xl">
                        {memory.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-purple-100/80 sm:text-base">
                        {memory.message}
                    </p>
                </div>
            </div>
        </motion.article>
    );
}

export default function MemoryTimeline() {
    const memories = Array.isArray(birthdayConfig.memories) ? birthdayConfig.memories : [];

    if (memories.length === 0) {
        return (
            <section id="memories" className="relative flex min-h-dvh items-center justify-center px-6">
                <div className="glass rounded-3xl p-10 text-center">
                    <span className="text-4xl">🕰️</span>
                    <p className="mt-4 text-pink-100">
                        Add memories to the <code>memories</code> array in{" "}
                        <code>src/config/birthday.js</code>.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="memories" className="relative overflow-hidden px-5 py-24 sm:px-8">
            <FloatingHearts count={8} seed={88} />

            <motion.h2
                className="font-display mx-auto max-w-3xl text-center text-3xl font-bold text-rose-soft sm:text-5xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                A Little Collection of Beautiful Moments ❤️
            </motion.h2>
            <motion.p
                className="font-hand mx-auto mt-4 max-w-xl text-center text-2xl text-purple-200"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                Little pieces of forever...
            </motion.p>

            <div className="relative mx-auto mt-16 max-w-4xl">
                {/* Timeline line */}
                <motion.div
                    className="absolute top-0 bottom-0 left-4 w-[2px] bg-gradient-to-b from-transparent via-pink-400/60 to-transparent sm:left-1/2 sm:-translate-x-1/2"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    style={{ transformOrigin: "top" }}
                    aria-hidden="true"
                />

                <div className="space-y-12 sm:space-y-20">
                    {memories.map((memory, i) => (
                        <div key={i} className="relative">
                            {/* Node */}
                            <motion.div
                                className="absolute top-6 left-4 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center sm:left-1/2"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                aria-hidden="true"
                            >
                                <span className="animate-pulse-glow h-4 w-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
                            </motion.div>
                            <MemoryCard memory={memory} index={i} flip={i % 2 === 1} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
