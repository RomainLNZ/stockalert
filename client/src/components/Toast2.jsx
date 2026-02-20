import React, { useEffect, useMemo, useRef, useState } from "react";

function Toast({ message, duration = 3000, type = "warning", onClose }) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const rafRef = useRef(null);

    const EXIT_MS = 220;
    const safeDuration = Math.max(duration, EXIT_MS + 50);

    const theme = useMemo(() => {
        const map = {
            warning: {
                bg: "bg-orange-500/15",
                border: "border-orange-300/30",
                text: "text-orange-50",
                shadow: "shadow-orange-500/20",
                bar: "bg-orange-200/60",
            },
            error: {
                bg: "bg-red-500/15",
                border: "border-red-300/30",
                text: "text-red-50",
                shadow: "shadow-red-500/20",
                bar: "bg-red-200/60",
            },
            success: {
                bg: "bg-emerald-500/15",
                border: "border-emerald-300/30",
                text: "text-emerald-50",
                shadow: "shadow-emerald-500/20",
                bar: "bg-emerald-200/60",
            },
        };
        return (
            map[type] || {
                bg: "bg-white/10",
                border: "border-white/25",
                text: "text-white",
                shadow: "shadow-black/20",
                bar: "bg-white/40",
            }
        );
    }, [type]);

    const Icon = useMemo(() => {
        // Icônes inline (pas besoin de lucide)
        const common = "w-5 h-5";
        if (type === "success") {
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        }
        if (type === "error") {
            return (
                <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                    <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        }
        // warning par défaut
        return (
            <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
                <path
                    d="M12 9v4m0 4h.01M10.3 4.2l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.8l-8-14a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }, [type]);

    useEffect(() => {
        // entrée
        const enterRaf = requestAnimationFrame(() => setVisible(true));

        // progress (RAF) — on calcule % restant en fonction du temps
        const start = performance.now();
        const run = (now) => {
            const elapsed = now - start;
            const remaining = Math.max(0, safeDuration - elapsed);
            const pct = (remaining / safeDuration) * 100;
            setProgress(pct);
            if (remaining > 0) rafRef.current = requestAnimationFrame(run);
        };
        rafRef.current = requestAnimationFrame(run);

        // sortie juste avant la fin
        const hideTimer = setTimeout(() => setVisible(false), safeDuration - EXIT_MS);

        // close après anim
        const closeTimer = setTimeout(() => onClose?.(), safeDuration);

        return () => {
            cancelAnimationFrame(enterRaf);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            clearTimeout(hideTimer);
            clearTimeout(closeTimer);
        };
    }, [safeDuration, onClose]);

    return (
        <div
            className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-50
        min-w-[320px] max-w-[min(92vw,520px)]
        px-5 py-4 rounded-2xl
        ${theme.bg} ${theme.border} ${theme.text}
        border
        backdrop-blur-xl backdrop-saturate-150
        shadow-lg ${theme.shadow}
        ring-1 ring-white/10
        relative overflow-hidden
        transform-gpu
        transition-all duration-200 ease-out
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-[0.98]"}
      `}
            role="status"
            aria-live="polite"
        >
            {/* highlight glass */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 left-0 h-20 w-full bg-white/10 blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            </div>

            <div className="relative flex items-start gap-3">
                <div className="mt-0.5 shrink-0 opacity-90">{Icon}</div>
                <div className="flex-1 leading-snug">{message}</div>

                {/* bouton close optionnel */}
                <button
                    type="button"
                    onClick={() => {
                        setVisible(false);
                        setTimeout(() => onClose?.(), EXIT_MS);
                    }}
                    className="ml-2 -mr-1 rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/10 transition"
                    aria-label="Fermer"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" aria-hidden="true">
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* barre de progression */}
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                    className={`h-full ${theme.bar} rounded-full transition-[width] duration-75 ease-linear`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default Toast;