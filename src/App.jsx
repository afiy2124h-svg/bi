import { useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import { birthdayConfig } from "./config/birthday";
import useAudio from "./hooks/useAudio";
import PasswordScreen from "./components/PasswordScreen/PasswordScreen";
import UnlockAnimation from "./components/UnlockAnimation/UnlockAnimation";
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen";
import IntroSection from "./components/WelcomeScreen/IntroSection";
import PhotoSlideshow from "./components/PhotoSlideshow/PhotoSlideshow";
import MemoryTimeline from "./components/MemoryTimeline/MemoryTimeline";
import BirthdayMessage from "./components/BirthdayMessage/BirthdayMessage";
import HappinessGift from "./components/HappinessGift/HappinessGift";
import FinalSurprise from "./components/FinalSurprise/FinalSurprise";
import SecretMessage from "./components/SecretMessage/SecretMessage";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function App() {
    const [stage, setStage] = useState("password");
    const [musicOn, setMusicOn] = useState(false);
    const audio = useAudio(birthdayConfig.song);

    const handleUnlock = useCallback(() => setStage("unlock"), []);
    const handleUnlockDone = useCallback(() => setStage("journey"), []);
    const handleBegin = useCallback(() => {
        setMusicOn(true);
        audio.play();
    }, [audio]);
    const handleStart = useCallback(() => scrollTo("intro"), []);
    const handleContinue = useCallback(() => scrollTo("slideshow"), []);
    const handleReplay = useCallback(() => scrollTo("slideshow"), []);

    return (
        <MotionConfig reducedMotion="user">
            {stage === "password" && <PasswordScreen onUnlock={handleUnlock} />}

            {stage === "unlock" && <UnlockAnimation onDone={handleUnlockDone} />}

            {stage === "journey" && (
                <main className="relative overflow-x-hidden bg-gradient-to-b from-[#1b0615] via-[#2b0a22] to-[#1b0615]">
                    <WelcomeScreen onBegin={handleBegin} onStart={handleStart} />
                    <IntroSection onContinue={handleContinue} />
                    <PhotoSlideshow />
                    <MemoryTimeline />
                    <BirthdayMessage />
                    <HappinessGift />
                    <FinalSurprise onReplay={handleReplay} />
                    <SecretMessage />
                    <MusicPlayer audio={audio} active={musicOn} />
                </main>
            )}
        </MotionConfig>
    );
}
