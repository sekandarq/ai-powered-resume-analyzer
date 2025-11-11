const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const getColor = (score: number) => {
    if (score < 40) return "#EF4444"; // red
    if (score < 80) return "#FACC15"; // yellow
    return "#22C55E"; // green
  };

  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-[100px] h-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Progress circle with dynamic color */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke={getColor(score)}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-semibold text-sm">{`${score}/100`}</span>
      </div>
    </div>
  );
};

export default ScoreCircle;
