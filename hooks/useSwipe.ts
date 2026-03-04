'use client'

import { useState, useRef, TouchEvent } from 'react'

interface SwipeHandlers {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    threshold?: number
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 70 }: SwipeHandlers) {
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const [offsetX, setOffsetX] = useState(0)

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
        setOffsetX(0)
    }

    const onTouchMove = (e: TouchEvent) => {
        if (!touchStart) return
        const currentTouch = e.targetTouches[0].clientX
        setTouchEnd(currentTouch)
        setOffsetX(currentTouch - touchStart)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > threshold
        const isRightSwipe = distance < -threshold

        if (isLeftSwipe && onSwipeLeft) onSwipeLeft()
        if (isRightSwipe && onSwipeRight) onSwipeRight()

        setOffsetX(0)
    }

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        offsetX
    }
}
