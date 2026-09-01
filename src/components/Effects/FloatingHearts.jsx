import { useMemo } from "react";

const HEARTS = ["❤️", "💖", "💗", "💕", "🌸", "💫", "🩷"];

function makeHearts(count, seed) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        const rnd = mulberry32(seed + i * 7);
        arr.push({
            id: i,
            emoji: HEARTS[Math.floor(rnd() * HEARTS.length)],
            left: rnd() * 100,
            size: 0.8 + rnd() * 1.6,
            duration: 9 + rnd() * 10,
            delay: -rnd() * 18,
            drift: (rnd() - 0.5) * 160,
            opacity: 0.35 + rnd() * 0.5,
        });
    }
    return arr;
}

function mulberry32(a) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export default function FloatingHearts({ count = 16, seed = 1, className = "" }) {
    const hearts = useMemo(() => makeHearts(count, seed), [count, seed]);

    return (
        <div
            className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
            aria-hidden="true"
        >
            {hearts.map((h) => (
                <span
                    key={h.id}
                    className="animate-float-up absolute"
                    style={{
                        left: `${h.left}%`,
                        bottom: "-6%",
                        fontSize: `${h.size}rem`,
                        animationDuration: `${h.duration}s`,
                        animationDelay: `${h.delay}s`,
                        "--drift": `${h.drift}px`,
                        "--max-opacity": `${h.opacity}`,
                    }}
                >
                    {h.emoji}
                </span>
            ))}
        </div>
    );
}
