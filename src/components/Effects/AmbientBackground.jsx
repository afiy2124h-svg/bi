import { useMemo } from "react";
import FloatingHearts from "./FloatingHearts";

function mulberry32(a) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function makeDots(count, seed, spread) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        const rnd = mulberry32(seed + i * 13);
        arr.push({
            id: i,
            left: rnd() * 100,
            top: rnd() * 100,
            size: 1.5 + rnd() * 3.5,
            duration: 2.5 + rnd() * 4,
            delay: -rnd() * 6,
            color: ["#f9a8d4", "#c084fc", "#fcd9a8", "#ffffff"][Math.floor(rnd() * 4)],
        });
    }
    return arr;
}

/**
 * Ambient romantic background: animated gradient + bokeh + sparkles + stars + floating hearts.
 * `stars` adds faint star dots, `bright` uses a lighter palette.
 */
export default function AmbientBackground({
    stars = false,
    bright = false,
    hearts = true,
    bokeh = true,
    sparkles = true,
    className = "",
}) {
    const sparkleDots = useMemo(() => makeDots(22, 3, 100), []);
    const starDots = useMemo(() => makeDots(40, 9, 100), []);

    return (
        <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
            <div
                className="animate-gradient-shift absolute inset-0"
                style={{
                    background: bright
                        ? "linear-gradient(135deg,#2b0a22,#4a1140 25%,#3b1570 50%,#7b2c6a 75%,#2b0a22)"
                        : "linear-gradient(135deg,#16030f,#3b0f2e 30%,#24104a 65%,#16030f)",
                }}
            />

            {bokeh &&
                [0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="animate-bokeh absolute rounded-full blur-3xl"
                        style={{
                            width: `${18 + i * 7}vw`,
                            height: `${18 + i * 7}vw`,
                            left: `${(i * 23) % 90}%`,
                            top: `${(i * 31) % 85}%`,
                            background: ["rgba(244,114,182,0.16)", "rgba(167,139,250,0.14)", "rgba(252,217,168,0.08)"][i % 3],
                            animationDuration: `${16 + i * 5}s`,
                            animationDelay: `${-i * 3}s`,
                        }}
                    />
                ))}

            {sparkles &&
                sparkleDots.map((d) => (
                    <span
                        key={`s-${d.id}`}
                        className="animate-twinkle absolute rounded-full"
                        style={{
                            left: `${d.left}%`,
                            top: `${d.top}%`,
                            width: d.size,
                            height: d.size,
                            background: d.color,
                            boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
                            animationDuration: `${d.duration}s`,
                            animationDelay: `${d.delay}s`,
                        }}
                    />
                ))}

            {stars &&
                starDots.map((d) => (
                    <span
                        key={`st-${d.id}`}
                        className="animate-twinkle absolute rounded-full"
                        style={{
                            left: `${d.left}%`,
                            top: `${d.top}%`,
                            width: d.size * 0.7,
                            height: d.size * 0.7,
                            background: "#ffffff",
                            opacity: 0.5,
                            animationDuration: `${d.duration + 2}s`,
                            animationDelay: `${d.delay}s`,
                        }}
                    />
                ))}

            {hearts && <FloatingHearts count={14} seed={5} />}
        </div>
    );
}
