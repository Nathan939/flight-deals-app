'use client'

import { useState, useEffect } from 'react'

interface AnimatedTitleProps {
  text: string
  highlightText: string
  duration?: number
  className?: string
}

export default function AnimatedTitle({
  text,
  highlightText,
  duration = 1500,
  className = ''
}: AnimatedTitleProps) {
  const [displayedText, setDisplayedText] = useState('')
  const fullText = `${text} ${highlightText} ?`
  const highlightStart = text.length + 1 // +1 for the space
  const highlightEnd = highlightStart + highlightText.length

  useEffect(() => {
    const totalChars = fullText.length
    const delayPerChar = duration / totalChars
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex <= totalChars) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, delayPerChar)

    return () => clearInterval(interval)
  }, [fullText, duration])

  return (
    <h1 className={className}>
      {displayedText.split('').map((char, index) => {
        const isHighlighted = index >= highlightStart && index < highlightEnd

        return (
          <span
            key={index}
            className={`${isHighlighted ? 'text-primary' : ''}`}
          >
            {char}
          </span>
        )
      })}
      <span className="animate-pulse">|</span>
    </h1>
  )
}
