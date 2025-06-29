
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 text-2xl font-mono">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">{timeLeft.days}</div>
          <div className="text-sm text-slate-400">DAYS</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-400">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-sm text-slate-400">HOURS</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-sm text-slate-400">MINUTES</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-sm text-slate-400">SECONDS</div>
      </div>
    </div>
  );
};
