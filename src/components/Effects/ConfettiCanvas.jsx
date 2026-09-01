import { useEffect, useRef } from "react";

const COLORS = ["#f9a8d4", "#f472b6", "#c084fc", "#fcd9a8", "#fda4af", "#e9d5ff", "#ffffff", "#fbbf24"];

function mulberry32(a) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function makeFireworkBurst(rnd, x, y) {
    const particles = [];
    const count = 60 + Math.floor(rnd() * 40);
    for (let i = 0; i < count; i++) {
        const angle = rnd() * Math.PI * 2;
        const speed = 2 + rnd() * 6.5;
        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2.5 + rnd() * 4,
            color: COLORS[Math.floor(rnd() * COLORS.length)],
            life: 1,
            decay: 0.005 + rnd() * 0.01,
            type: rnd() < 0.35 ? "heart" : rnd() < 0.6 ? "circle" : "spark",
            rotation: rnd() * 360,
            vr: (rnd() - 0.5) * 10,
            gravity: 0.05,
        });
    }
    return particles;
}

function makeConfettiParticle(rnd, w) {
    return {
        x: rnd() * w,
        y: -20 - rnd() * 120,
        vx: (rnd() - 0.5) * 2.4,
        vy: 2 + rnd() * 3.2,
        size: 4 + rnd() * 7,
        color: COLORS[Math.floor(rnd() * COLORS.length)],
        life: 1,
        decay: 0.0035 + rnd() * 0.005,
        type: rnd() < 0.45 ? "heart" : "rect",
        rotation: rnd() * 360,
        vr: (rnd() - 0.5) * 14,
        gravity: 0.06,
        sway: 0.01 + rnd() * 0.02,
        phase: rnd() * Math.PI * 2,
    };
}

/**
 * Full-screen canvas burst layer.
 * - `fireworksKey`: increment to trigger a multi-burst fireworks celebration.
 * - `rain`: while true, keeps a soft confetti rain falling.
 */
export default function ConfettiCanvas({ fireworksKey = 0, rain = false }) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const rainRef = useRef(false);
    const fireworksRef = useRef(0);
    const rafRef = useRef(null);

    useEffect(() => {
        rainRef.current = rain;
    }, [rain]);

    useEffect(() => {
        if (fireworksKey > 0) fireworksRef.current = fireworksKey;
    }, [fireworksKey]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const rnd = mulberry32(Date.now() % 100000);
        let lastSpawn = 0;
        let scheduledWaves = [];

        const drawHeart = (p) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.font = `${p.size * 2.2}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("❤", 0, 0);
            ctx.restore();
        };

        const tick = (now) => {
            const particles = particlesRef.current;
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.life -= p.decay;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                if (p.sway) p.vx += Math.sin(now / 300 + p.phase) * p.sway;
                p.rotation += p.vr;
                ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
                ctx.fillStyle = p.color;
                ctx.strokeStyle = p.color;

                if (p.type === "heart") {
                    drawHeart(p);
                } else if (p.type === "rect") {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
                    ctx.restore();
                } else if (p.type === "spark") {
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            if (fireworksRef.current > 0 && now - lastSpawn > 340) {
                lastSpawn = now;
                const burst = makeFireworkBurst(
                    rnd,
                    width * (0.2 + rnd() * 0.6),
                    height * (0.2 + rnd() * 0.45)
                );
                particles.push(...burst);
                fireworksRef.current -= 1;
            }

            if (rainRef.current && now - lastSpawn > 90) {
                lastSpawn = now;
                particles.push(makeConfettiParticle(rnd, width));
                if (particles.length < 400) particles.push(makeConfettiParticle(rnd, width));
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            particlesRef.current = [];
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[70]"
            aria-hidden="true"
        />
    );
}
