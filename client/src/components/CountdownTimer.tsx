import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownTimerProps {
  targetTime: number;
}

export function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [prevSeconds, setPrevSeconds] = useState(timeLeft.seconds);

  function calculateTimeLeft() {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { hours, minutes, seconds, total: diff };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setPrevSeconds(timeLeft.seconds);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, timeLeft.seconds]);

  const isUrgent = timeLeft.total < 60000;

  return (
    <div className="flex items-center justify-center gap-2" data-testid="countdown-timer">
      <TimeDigit value={timeLeft.hours} label="H" isUrgent={isUrgent} />
      <span className="text-3xl md:text-5xl font-mono text-muted-foreground">:</span>
      <TimeDigit value={timeLeft.minutes} label="M" isUrgent={isUrgent} />
      <span className="text-3xl md:text-5xl font-mono text-muted-foreground">:</span>
      <TimeDigit 
        value={timeLeft.seconds} 
        label="S" 
        isUrgent={isUrgent}
        shouldAnimate={prevSeconds !== timeLeft.seconds}
      />
    </div>
  );
}

function TimeDigit({ 
  value, 
  label, 
  isUrgent, 
  shouldAnimate = false 
}: { 
  value: number; 
  label: string; 
  isUrgent: boolean;
  shouldAnimate?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={shouldAnimate ? { y: -10, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          exit={shouldAnimate ? { y: 10, opacity: 0 } : false}
          transition={{ duration: 0.2 }}
          className={`text-4xl md:text-6xl font-mono font-bold ${
            isUrgent ? "text-primary animate-pulse-slow" : "text-foreground"
          }`}
          data-testid={`time-${label.toLowerCase()}`}
        >
          {String(value).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
      <span className="text-xs md:text-sm text-muted-foreground font-medium mt-1">{label}</span>
    </div>
  );
}
