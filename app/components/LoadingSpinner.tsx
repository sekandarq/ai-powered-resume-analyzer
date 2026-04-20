type LoadingSpinnerProps = {
  label?: string;
  className?: string;
};

const LoadingSpinner = ({ label = "Loading...", className = "" }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      <p className="text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
};

export default LoadingSpinner;