'use client'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 min-h-[400vh]">
      {/* Base black */}
      <div className="absolute inset-0 bg-black" />

      {/* Subtle animated gradient orbs */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[150px] animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%)',
          top: '45%',
          left: '-10%',
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          top: '25%',
          right: '-5%',
        }}
      />
      <div
        className="absolute w-[750px] h-[750px] rounded-full blur-[145px] animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, rgba(234,179,8,0.1) 0%, transparent 70%)',
          top: '55%',
          left: '15%',
        }}
      />
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[130px] animate-blob animation-delay-3000"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
          top: '80%',
          right: '10%',
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[140px] animate-blob animation-delay-5000"
        style={{
          background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)',
          top: '110%',
          left: '25%',
        }}
      />
      <div
        className="absolute w-[750px] h-[750px] rounded-full blur-[145px] animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
          top: '140%',
          right: '5%',
        }}
      />
    </div>
  )
}
