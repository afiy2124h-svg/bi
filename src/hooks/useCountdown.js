import { useEffect, useState } from "react";

function isSameDate(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function compute(birthdayStr, now) {
    const [y, m, d] = birthdayStr.split("-").map(Number);
    const candidates = [
        new Date(y - 1, m - 1, d),
        new Date(y, m - 1, d),
        new Date(y + 1, m - 1, d),
    ];

    const isToday = candidates.some((c) => isSameDate(c, now));
    const future = candidates
        .filter((c) => c.getTime() > now.getTime())
        .map((c) => c.getTime());
    const target = future.length ? Math.min(...future) : candidates[0].getTime();
    const diff = Math.max(0, target - now.getTime());

    return {
        isToday,
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
    };
}

/**
 * Counts down to the next occurrence of the given birthday.
 * Returns { days, hours, minutes, seconds, isToday }.
 */
export default function useCountdown(birthdayStr) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    return compute(birthdayStr, now);
}
