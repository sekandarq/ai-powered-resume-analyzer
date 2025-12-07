import React from 'react'
import ScoreGauge from '../ScoreGauge'
import ScoreCard from '../ScoreCard';

const Category = ({ title, score }: { title: string; score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
        : score > 40 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className='resume-summary'>
            <div className='category'>
                <div className='flex flex-row gap-2 items-center justify-center'>
                    <p className='text-xl'>{title}</p>
                    <ScoreCard score={score} />
                </div>
                <p className='text-2xl'>
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
        <div className='flex flex-row items-center p-4 gap-8'>
            <ScoreGauge score={feedback.overallScore} />

            <div className='flex flex-col justify-center'>
                <h2 className='text-2xl font-bold'>Resume Overall Score</h2>
                <p className='text-xl text-gray-600'>
                    This score represents the overall quality of your resume based on various factors listed below.
                </p>
            </div>
        </div> 
        <Category title="Tone & Style" score={feedback.toneAndStyle.score}/>
        <Category title="Content" score={feedback.content.score}/>
        <Category title="Structure" score={feedback.structure.score}/>
        <Category title="Skills" score={feedback.skills.score}/>
    </div>
  )
}

export default Summary
