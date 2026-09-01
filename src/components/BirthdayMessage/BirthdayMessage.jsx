import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import AmbientBackground from "../Effects/AmbientBackground";
import FloatingHearts from "../Effects/FloatingHearts";

const TYPE_SPEED = 34;
const LINE_PAUSE = 620;

export default function BirthdayMessage() {
    const lines = useMemo(
        () =>
            birthdayConfig.birthdayMessage
                .split("\n")
                .map((l) => l.trim())
                .filter(Boolean),
        []
    );

    const reducedMotion = useReducedMotion();
    const [started, setStarted] = useState(false);
    const [lineIndex, setLineIndex] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [done, setDone] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return undefined;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) setStarted(true);
            },
            { threshold: 0.35 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!started || done) return undefined;
        if (reducedMotion) {
            setLineIndex(lines.length);
            setDone(true);
            return undefined;
        }

        const currentLine = lines[lineIndex];
        if (!currentLine) {
            setDone(true);
            return undefined;
        }

        const id = setTimeout(() => {
            if (charCount < currentLine.length) {
                setCharCount((c) => c + 1);
            } else {
                setLineIndex((l) => l + 1);
                setCharCount(0);
            }
        }, charCount === currentLine.length ? LINE_PAUSE : TYPE_SPEED);

        return () => clearTimeout(id);
    }, [started, done, reducedMotion, lineIndex, charCount, lines]);

    const visibleLines = lines.slice(0, lineIndex);
    const currentLine = lines[lineIndex] || "";

    return (
        <section
            id="message"
            ref={sectionRef}
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24"
        >
            <AmbientBackground stars />
            <FloatingHearts count={6} seed={99} />

            <motion.h2
                className="font-display relative z-10 mb-10 text-center text-4xl font-bold text-rose-soft sm:text-6xl"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.8 }}
            >
                For You, {birthdayConfig.name} ❤️
            </motion.h2>

            <div className="relative z-10 max-w-2xl text-center">
                {visibleLines.map((line, i) => (
                    <motion.p
                        key={i}
                        className="font-display text-xl leading-relaxed text-purple-50/95 sm:text-2xl"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {line}
                    </motion.p>
                ))}

                {!reducedMotion && !done && (
                    <p className="font-display text-xl leading-relaxed text-purple-50/95 sm:text-2xl">
                        {currentLine.slice(0, charCount)}
                        <span className="type-cursor" aria-hidden="true" />
                    </p>
                )}

                {done && (
                    <motion.p
                        className="font-hand mt-10 text-3xl text-pink-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        — with all my heart ❤️
                    </motion.p>
                )}
            </div>
        </section>
    );
}
