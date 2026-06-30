"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

import LightLogo from "../../../public/icons/smithshop-logo-light.svg";
import DarkLogo from "../../../public/icons/smithshop-logo-dark.svg";

export default function Logo() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div style={{ width: 70, height: 100 }} aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";
    const logoSrc = isDark ? LightLogo : DarkLogo;

    return (
        <Image
            src={logoSrc}
            alt="Smithshop Logo"
            width={0}
            height={0}
            sizes="70px"
            style={{ width: "70px", height: "auto" }}
            priority
        />
    );
}
