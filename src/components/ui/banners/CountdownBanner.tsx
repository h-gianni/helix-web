import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/core/Badge';
import { Button } from '@/components/ui/core/Button';

const CountdownBanner = ({
  badgeText = "Limited Offer",
  title = "End of year sale",
  description = "Upgrade to our premium plan and save 30%. This offer is available for a limited time only.",
  endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days from now
  primaryCta = "Claim Offer",
  secondaryCta = "Learn More",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  bgColor = "bg-gradient-to-r from-[var(--accent-base)] to-[var(--primary-base)]",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const TimerBox = ({ value, unit }: { value: number; unit: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur-sm text-white rounded-[var(--radius)] px-3 py-2 text-xl md:text-2xl font-mono font-bold">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-white/80 text-xs mt-1">{unit}</span>
    </div>
  );

  return (
    <div className={`w-full rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)] ${bgColor} p-6 md:p-8`}>
      <div className="flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-transparent">
          {badgeText}
        </Badge>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {title}
        </h2>
        
        <p className="text-white/90 text-sm md:text-base mb-6 max-w-lg">
          {description}
        </p>
        
        <div className="flex gap-3 md:gap-4 mb-6">
          <TimerBox value={timeLeft.days} unit="days" />
          <span className="text-white text-xl md:text-2xl font-bold self-center -mt-4">:</span>
          <TimerBox value={timeLeft.hours} unit="hours" />
          <span className="text-white text-xl md:text-2xl font-bold self-center -mt-4">:</span>
          <TimerBox value={timeLeft.minutes} unit="mins" />
          <span className="text-white text-xl md:text-2xl font-bold self-center -mt-4">:</span>
          <TimerBox value={timeLeft.seconds} unit="secs" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg"
            onClick={onPrimaryClick}
            className="bg-white text-[var(--primary-dark)] hover:bg-white/90"
          >
            {primaryCta}
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={onSecondaryClick}
            className="border-white text-white hover:bg-white/10"
          >
            {secondaryCta}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CountdownBanner;