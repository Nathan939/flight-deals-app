'use client'

import Image from 'next/image'

export default function WorldMap() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      style={{
        zIndex: 1
      }}
      aria-hidden="true"
    >
      <div
        className="relative w-[160%] max-w-none"
        style={{
          filter: 'blur(2px) invert(1) brightness(0.3)',
          opacity: 1,
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 70%)',
        }}
      >
        <Image
          src="/world-map.jpg"
          alt=""
          width={1920}
          height={1080}
          className="w-full h-auto object-contain"
          priority={false}
        />
      </div>
    </div>
  )
}
