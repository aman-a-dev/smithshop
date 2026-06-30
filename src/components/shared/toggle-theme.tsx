"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes"; // 👈 import
import { cn } from "@/lib/utils";

type AnimationType =
    | "none"
    | "circle-spread"
    | "round-morph"
    | "swipe-left"
    | "swipe-up"
    | "diag-down-right"
    | "fade-in-out"
    | "shrink-grow"
    | "flip-x-in"
    | "split-vertical"
    | "swipe-right"
    | "swipe-down"
    | "wave-ripple";

interface ToggleThemeProps extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number;
    animationType?: AnimationType;
}

const ToggleTheme = ({
    className,
    duration = 400,
    animationType = "circle-spread",
    ...props
}: ToggleThemeProps) => {
    const { resolvedTheme, setTheme } = useTheme(); // 👈 use next-themes
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), []);

    const isDark = resolvedTheme === "dark";

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return;

        const newTheme = isDark ? "light" : "dark";

        // Start view transition and update theme via next-themes
        await document.startViewTransition(() => {
            flushSync(() => {
                setTheme(newTheme); // 👈 this updates context, class, and localStorage
            });
        }).ready;

        // Animation logic (unchanged – uses the new class state)
        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        );
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        switch (animationType) {
            case "circle-spread":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`
                        ]
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)"
                    }
                );
                break;
            // ... all other cases remain exactly as you had them
            // (I'm omitting them for brevity – keep your original switch)
            case "round-morph":
                // ... your code
                break;
            // etc.
            case "none":
            default:
                break;
        }
    }, [isDark, duration, animationType, setTheme]);

    if (!mounted) return null; // or a placeholder

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isDark ? "hover:text-amber-400" : "hover:text-primarylw",
                    className
                )}
                {...props}
            >
                {isDark ? (
                    <Sun className="h-6 w-6" />
                ) : (
                    <Moon className="h-6 w-6" />
                )}
            </button>

            {/* Override default view transition animations for JS‑based effects */}
            {animationType !== "flip-x-in" && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
              ::view-transition-old(root),
              ::view-transition-new(root) {
                animation: none;
                mix-blend-mode: normal;
              }
            `
                    }}
                />
            )}
        </>
    );
};

export default ToggleTheme;
