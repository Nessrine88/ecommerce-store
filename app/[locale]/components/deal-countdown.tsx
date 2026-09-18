
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Static target date
const TARGET_DATE = new Date("2026-09-20T00:00:00");

// Function to calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(
    Number(targetDate) - Number(currentTime),
    0,
  );

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    ),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountdown = () => {
  const t = useTranslations("Homepage.dealCountdown");

  const [time, setTime] = useState<
    ReturnType<typeof calculateTimeRemaining>
  >();

  useEffect(() => {
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  if (!time) {
    return (
      <section className="mx-auto my-20 grid max-w-6xl grid-cols-1 px-6 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-3xl font-semibold text-stone-900">
            {t("loading")}
          </h3>
        </div>
      </section>
    );
  }

  const hasEnded =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;
 
  if (hasEnded) {
    return (
      <section className="mx-auto my-20 grid max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-bg py-12 md:grid-cols-2 md:gap-16 md:py-16">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mt-2 font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
              {t("ended.title")}
            </h3>
          </div>

          <p className="max-w-md text-base leading-relaxed text-stone-400">
            {t("ended.description")}
          </p>

          <div>
            <Button className="h-11 rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 hover:bg-amber-300">
              <Link href={`/search`}>{t("ended.button")}</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full overflow-hidden rounded-2xl">
          <Image
            src="/promo.webp"
            fill
            alt={t("imageAlt")}
            className="object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto my-20 grid max-w-7xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-bg px-6 py-12 sm:px-10 md:grid-cols-2 md:gap-16 md:py-16">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium tracking-wide text-amber-400">
            {t("active.endsAt")}
          </p>

          <h3 className="mt-2 font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
            {t("active.title")}
          </h3>
        </div>

        <p className="max-w-md text-base leading-relaxed text-stone-400">
          {t("active.description")}
        </p>

        <ul className="grid grid-cols-4 gap-3 sm:gap-4">
          <StatBox label={t("active.timer.days")} value={time.days} />
          <StatBox label={t("active.timer.hours")} value={time.hours} />
          <StatBox
            label={t("active.timer.minutes")}
            value={time.minutes}
          />
          <StatBox
            label={t("active.timer.seconds")}
            value={time.seconds}
          />
        </ul>

        <div>
          <Button className="h-11 rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 hover:bg-amber-300">
            <Link href={`/search`}>{t("active.button")}</Link>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-2xl">
        <Image
          src="/promo.webp"
          fill
          alt={t("imageAlt")}
          className="object-cover"
        />
      </div>
    </section>
  );
};

const StatBox = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <li className="flex flex-col items-center gap-1 rounded-xl border border-stone-800 bg-stone-900/60 py-4">
    <p className="font-serif text-2xl text-stone-50 tabular-nums sm:text-3xl">
      {String(value).padStart(2, "0")}
    </p>

    <p className="text-xs text-stone-500">{label}</p>
  </li>
);

export default DealCountdown;

