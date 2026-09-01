import { motion } from "framer-motion";
import { birthdayConfig } from "../../config/birthday";
import FloatingHearts from "../Effects/FloatingHearts";

export default function IntroSection({ onContinue }) {
    return (
        <section
            id="intro"
            className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
        >
            <FloatingHearts count={10} seed={33} />

            <motion.p
                className="font-hand text-3xl text-pink-200 sm:text-4xl"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8 }}
            >
                A little story, just for you ✨
            </motion.p>

            <div className="mt-10 max-w-2xl space-y-6">
                {birthdayConfig.introLines.map((line, i) => (
                    <motion.p
                        key={i}
                        className="text-lg leading-relaxed text-purple-50/90 sm:text-xl"
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.8, delay: i * 0.25 }}
                    >
                        {line}
                    </motion.p>
                ))}
            </div>

            <motion.button
                className="btn-ghost mt-12"
                onClick={onContinue}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.4 }}
            >
                Continue ↓
            </motion.button>
        </section>
    );
}
