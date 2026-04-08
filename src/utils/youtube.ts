// YouTube Data API utilities
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
}

/**
 * Fetch playlist videos from YouTube (requires API key)
 */
export const fetchPlaylistVideos = async (
  playlistId: string,
  apiKey: string
): Promise<YouTubeVideo[]> => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&key=${apiKey}&maxResults=50`
    )
    const data = await response.json()

    if (!data.items) return []

    return data.items.map((item: any) => ({
      id: item.contentDetails.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      duration: item.contentDetails.duration,
    }))
  } catch (error) {
    console.error('Error fetching YouTube playlist:', error)
    return []
  }
}

/**
 * Get video details from YouTube
 */
export const getVideoDetails = async (videoId: string, apiKey: string) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching video details:', error)
    return null
  }
}

/**
 * Extract YouTube video ID from URL
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Format YouTube duration (ISO 8601) to readable format
 */
export const formatYouTubeDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  
  const hours = parseInt(match?.[1] || '0')
  const minutes = parseInt(match?.[2] || '0')
  const seconds = parseInt(match?.[3] || '0')
  
  return hours * 3600 + minutes * 60 + seconds
}
