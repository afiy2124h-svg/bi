import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EMOJIS = ["❤️", "💖", "💗", "💕", "🩷", "💝", "✨"];

/**
 * A one-shot burst of hearts radiating from the center of its container.
 * Increment `trigger` to fire a new burst.
 */
export default function HeartBurst({ trigger = 0, count = 18, className = "" }) {
    const [particles, setParticles] = useState([]);
    const prevTrigger = useRef(0);

    useEffect(() => {
        if (trigger === 0 || trigger === prevTrigger.current) return;
        prevTrigger.current = trigger;

        const list = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
            const dist = 60 + Math.random() * 150;
            list.push({
                id: `${trigger}-${i}`,
                emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                size: 0.9 + Math.random() * 1.4,
                rotate: (Math.random() - 0.5) * 120,
                duration: 1 + Math.random() * 0.7,
            });
        }
        setParticles(list);
    }, [trigger, count]);

    return (
        <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible ${className}`}
            aria-hidden="true"
        >
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.span
                        key={p.id}
                        className="absolute"
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                        animate={{
                            x: p.x,
                            y: p.y,
                            opacity: [0, 1, 0],
                            scale: [0.4, 1.2, 0.9],
                            rotate: p.rotate,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: p.duration, ease: "easeOut" }}
                        style={{ fontSize: `${p.size}rem` }}
                    >
                        {p.emoji}
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
}
