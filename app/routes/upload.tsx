import React from 'react'
import Navbar from '~/components/Navbar'

const upload = () => {
  return (
   <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
        <div className='page-heading'>
            <h1>AI-Powered feedback to get the best out of your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FBBF24] via-[#FB7185] to-[#1aff35]">resumes!</span></h1>
        </div>
    </section>
   </main>
  )
}

export default upload
