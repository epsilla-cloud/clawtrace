'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './waiting.module.css';

const COUNTDOWN_SECONDS = 5 * 60; // 5 minutes

export default function WaitingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId') ?? '';
  const destination = agentId ? `/trace/${agentId}` : '/trace';

  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          router.push(destination);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [destination, router]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');

  // Progress 0→1 as countdown goes 300→0
  const progress = (COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS;
  const circumference = 2 * Math.PI * 120;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.label}>
          Your first OpenClaw trajectory will be ready to observe in about
        </p>

        <div className={styles.timerWrap}>
          <svg className={styles.ring} viewBox="0 0 260 260" aria-hidden="true">
            <circle className={styles.ringTrack} cx="130" cy="130" r="120" />
            <circle
              className={styles.ringProgress}
              cx="130" cy="130" r="120"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className={styles.countdown}>{minutes}:{seconds}</span>
        </div>

        <button
          type="button"
          className={styles.skipBtn}
          onClick={() => router.push(destination)}
        >
          Skip Waiting
        </button>
      </div>
    </div>
  );
}
