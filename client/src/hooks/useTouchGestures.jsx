import { useState, useCallback, useRef, useEffect } from 'react'

export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState(null)
  
  // Минимальное расстояние для свайпа
  const minSwipeDistance = 50

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
    setIsScrolling(false)
  }, [])

  const onTouchMove = useCallback((e) => {
    if (!touchStart) return
    
    const currentTouch = e.targetTouches[0].clientX
    const diff = touchStart - currentTouch
    
    // Определяем, что пользователь скроллит, а не свайпает
    if (Math.abs(diff) > 10) {
      setIsScrolling(true)
    }
  }, [touchStart])

  const onTouchEnd = useCallback((e) => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setSwipeDirection('left')
    } else if (isRightSwipe) {
      setSwipeDirection('right')
    } else {
      setSwipeDirection(null)
    }

    // Сброс через небольшую задержку
    setTimeout(() => {
      setSwipeDirection(null)
    }, 300)
  }, [touchStart, touchEnd])

  const onTouchCancel = useCallback(() => {
    setTouchStart(null)
    setTouchEnd(null)
    setIsScrolling(false)
    setSwipeDirection(null)
  }, [])

  // Обработка свайпа влево/вправо
  const handleSwipe = useCallback((callback) => {
    if (swipeDirection && !isScrolling) {
      callback(swipeDirection)
    }
  }, [swipeDirection, isScrolling])

  // Обработка долгого нажатия
  const [longPress, setLongPress] = useState(false)
  const longPressTimer = useRef(null)

  const onTouchStartLongPress = useCallback((callback, delay = 500) => {
    longPressTimer.current = setTimeout(() => {
      setLongPress(true)
      callback()
    }, delay)
  }, [])

  const onTouchEndLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    setLongPress(false)
  }, [])

  const onTouchMoveLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  return {
    // Touch события
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    
    // Long press события
    onTouchStartLongPress,
    onTouchEndLongPress,
    onTouchMoveLongPress,
    
    // Состояния
    isScrolling,
    swipeDirection,
    longPress,
    
    // Обработчики
    handleSwipe,
    
    // Touch handlers для компонентов
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel
    },
    
    longPressHandlers: {
      onTouchStart: onTouchStartLongPress,
      onTouchEnd: onTouchEndLongPress,
      onTouchMove: onTouchMoveLongPress
    }
  }
}

export default useTouchGestures
