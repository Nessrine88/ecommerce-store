"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import Image from 'next/image'

//Static target date (replace with desired date)

const TARGET_DATE = new Date('2026-09-20T00:00:00');

//Function to calculate the time remaaining

const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    ),
    seconds: Math.floor(
      (timeDifference % (1000 * 60)) / (1000)
    ),
  }
}

const DealCountdown = () => {

  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    setTime(calculateTimeRemaining(TARGET_DATE));
    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);
      if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        clearInterval(timerInterval)
      }
    }, 1000)
    return () => clearInterval(timerInterval);
  }, [])

  if (!time) {
    return (
      <section className="mx-auto my-20 grid max-w-6xl grid-cols-1 px-6 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-3xl font-semibold text-stone-900">
            Loading countdown…
          </h3>
        </div>
      </section>
    )
  }

  const hasEnded = time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;

  if (hasEnded) {
    return (
      <section className="mx-auto my-20 grid max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-bg px-6 py-12 sm:px-10 md:grid-cols-2 md:gap-16 md:py-16">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mt-2 font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
              Deal has ended
            </h3>
          </div>

          <p className="max-w-md text-base leading-relaxed text-stone-400">
            This deal is no longer available. Check out our latest promotions!
          </p>

          <div>
            <Button
            
              className="h-11 rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 hover:bg-amber-300"
            >
              <Link href="/search">View products</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl">
          <Image
            src="/promo.webp"
            fill
            alt="Featured promotion"
            className="object-cover"
          />
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto my-20 grid max-w-6xl grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-bg px-6 py-12 sm:px-10 md:grid-cols-2 md:gap-16 md:py-16">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-medium tracking-wide text-amber-400">
            Ends December 20
          </p>
          <h3 className="mt-2 font-serif text-4xl leading-tight text-stone-50 sm:text-5xl">
            Deal of the month
          </h3>
        </div>

        <p className="max-w-md text-base leading-relaxed text-stone-400">
          Get ready for a shopping experience like never before. Every purchase
          comes with exclusive perks and offers, making this month a
          celebration of savvy choices and amazing deals.
        </p>

        <ul className="grid grid-cols-4 gap-3 sm:gap-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>

        <div>
          <Button
            
            className="h-11 rounded-full bg-amber-400 px-7 text-sm font-semibold text-stone-950 hover:bg-amber-300"
          >
            <Link href="/search">View products</Link>
          </Button>
        </div>
      </div>

      <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl">
        <Image
          src="/promo.webp"
          fill
          alt="Featured promotion"
          className="object-cover"
        />
      </div>
    </section>
  )
}

const StatBox = ({ label, value }: { label: string, value: number }) => (
  <li className="flex flex-col items-center gap-1 rounded-xl border border-stone-800 bg-stone-900/60 py-4">
    <p className="font-serif text-2xl text-stone-50 tabular-nums sm:text-3xl">
      {String(value).padStart(2, '0')}
    </p>
    <p className="text-xs text-stone-500">{label}</p>
  </li>
)

export default DealCountdown