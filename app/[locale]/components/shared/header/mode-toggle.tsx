"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";

export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
