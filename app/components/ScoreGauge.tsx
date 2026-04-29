import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
  const [pathLength, setPathLength] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);

  const percentage = animatedScore / 100;

    const getGaugeColor = (value: number) => {
      if (value < 40) return "#f97316";
      if (value < 70) return "#f59e0b";
      return "#14b8a6";
    };


  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useEffect(() => {
    let frameId = 0;
    const duration = 900;
    const start = performance.now();
    const from = animatedScore;
    const to = Math.max(0, Math.min(100, score));

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOut(progress);
      setAnimatedScore(from + (to - from) * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-40">
        <svg viewBox="0 0 100 50" className="w-full h-full">

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#dbe4ee"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Foreground arc with rounded ends */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke={getGaugeColor(animatedScore)}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            className="transition-all duration-500"
            strokeDashoffset={pathLength * (1 - percentage)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <div className="pt-4 text-xl font-semibold tracking-[-0.03em] text-slate-950">{Math.round(animatedScore)}/100</div>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
