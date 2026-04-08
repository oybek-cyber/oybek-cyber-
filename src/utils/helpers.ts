/**
 * Format duration in seconds to human-readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Create excerpt from text
 */
export const createExcerpt = (text: string, length: number = 150): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Group array items by property
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key])
      return {
        ...acc,
        [groupKey]: [...(acc[groupKey] || []), item],
      }
    },
    {} as Record<string, T[]>
  )
}

/**
 * Debounce function
 */
export const debounce = (
  func: (...args: any[]) => void,
  delay: number
): ((...args: any[]) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle function
 */
export const throttle = (
  func: (...args: any[]) => void,
  limit: number
): ((...args: any[]) => void) => {
  let inThrottle: boolean
  
  return (...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
