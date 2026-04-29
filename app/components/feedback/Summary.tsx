import { useEffect, useState } from 'react'
import ScoreGauge from '../ScoreGauge'
import ScoreCard from '../ScoreCard';
import { cn } from '~/lib/utils';

const AnimatedScore = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let frameId = 0;
        const duration = 700;
        const start = performance.now();

        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(value * eased));

            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
            }
        };

        frameId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frameId);
    }, [value]);

    const textColor = value > 70 ? 'text-green-600'
        : value > 40 ? 'text-yellow-600' : 'text-red-600';

    return (
        <p className='text-2xl'>
            <span className={textColor}>{displayValue}</span>/100
        </p>
    )
}

const Category = ({ title, score }: { title: string; score: number }) => {
    const toneClass = score > 70
        ? 'border-emerald-200 bg-emerald-50/70'
        : score > 49
            ? 'border-amber-200 bg-amber-50/70'
            : 'border-rose-200 bg-rose-50/70';

    return (
        <div className={cn('rounded-2xl border p-4 transition hover:shadow-sm', toneClass)}>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex flex-row gap-2 items-center'>
                    <p className='text-lg font-semibold text-slate-900'>{title}</p>
                    <ScoreCard score={score} />
                </div>
                <AnimatedScore value={score} />
            </div>
            <div className='mt-3 h-2 overflow-hidden rounded-full bg-white/80'>
                <div
                    className={cn(
                        'h-full rounded-full transition-all duration-700',
                        score > 70 ? 'bg-emerald-500' : score > 49 ? 'bg-amber-500' : 'bg-rose-500'
                    )}
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                />
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const categories = [
        {
            key: 'tone',
            title: 'Tone & Style',
            score: feedback.toneAndStyle.score,
            tips: feedback.toneAndStyle.tips,
        },
        {
            key: 'content',
            title: 'Content',
            score: feedback.content.score,
            tips: feedback.content.tips,
        },
        {
            key: 'structure',
            title: 'Structure',
            score: feedback.structure.score,
            tips: feedback.structure.tips,
        },
        {
            key: 'skills',
            title: 'Skills',
            score: feedback.skills.score,
            tips: feedback.skills.tips,
        },
    ];

  return (
    <div className='glass-panel premium-glass w-full space-y-5'>
        <div className='flex flex-wrap items-center gap-8'>
            <ScoreGauge score={feedback.overallScore} />

            <div className='flex flex-col justify-center text-left flex-1 min-w-[240px]'>
                <p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-500'>Score Overview</p>
                <h2 className='text-2xl font-bold text-slate-900'>Resume Health Snapshot</h2>
                <p className='text-base text-slate-600'>
                    Use this as a quick read on overall quality, then work through the improvement plan above.
                </p>
            </div>
        </div>

        <div className='grid gap-3'>
            {categories.map((category) => (
                <Category key={category.key} title={category.title} score={category.score} />
            ))}
        </div>
    </div>
  )
}

export default Summary
