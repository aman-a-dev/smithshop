"use client";

import { useEffect } from "react";

export default function Eruda() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    import("eruda").then((eruda) => {
      eruda.default.init();
    });
  }, []);

  return null;
}