import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

interface WeatherData {
  temp: number
  precip: string
  advice: string
  location: string
}

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm',
}

function getCondition(code: number): string {
  return WEATHER_CODE_MAP[code] || 'Unknown'
}

function getFarmingAdvice(temp: number, precipProb: number, code: number): string {
  if (code >= 95) return 'Stay indoors — storms expected'
  if (code >= 61 || precipProb > 70) return 'Rainy — skip spraying, good for planting'
  if (temp > 35) return 'Very hot — irrigate early morning'
  if (temp < 10) return 'Cold — protect sensitive crops'
  if (precipProb >= 40) return 'Rain likely — plan indoor tasks'
  if (code <= 1) return 'Clear skies — great day for field work'
  return 'Good conditions for farming'
}

// Default: Nairobi
const DEFAULT_LAT = -1.2921
const DEFAULT_LON = 36.8219

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchWeather() {
      try {
        setIsLoading(true)
        setError(null)

        let lat = DEFAULT_LAT
        let lon = DEFAULT_LON
        let locationName = 'Nairobi'

        // Try to get real location
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status === 'granted') {
          try {
            const loc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            })
            lat = loc.coords.latitude
            lon = loc.coords.longitude

            // Reverse geocode for city name
            const [place] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon })
            if (place) {
              locationName = place.city || place.subregion || place.region || locationName
            }
          } catch {
            // Use defaults if location fetch fails
          }
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=precipitation_probability_max&timezone=auto&forecast_days=1`

        const res = await fetch(url)
        if (!res.ok) throw new Error('Weather API error')

        const data = await res.json()
        if (cancelled) return

        const temp = Math.round(data.current.temperature_2m)
        const code = data.current.weather_code
        const precipProb = data.daily.precipitation_probability_max?.[0] ?? 0

        setWeather({
          temp,
          precip: `${precipProb}%`,
          advice: getFarmingAdvice(temp, precipProb, code),
          location: locationName,
        })
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message)
          // Fallback to mock-like defaults so the UI still works
          setWeather({
            temp: 24,
            precip: '--',
            advice: 'Weather unavailable',
            location: 'Unknown',
          })
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchWeather()
    return () => { cancelled = true }
  }, [])

  return { weather, isLoading, error }
}
