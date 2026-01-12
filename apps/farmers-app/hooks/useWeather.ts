import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { useState, useEffect } from 'react'

// Open-Meteo weather codes mapping
// https://open-meteo.com/en/docs#weathervariables
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'foggy' | 'snowy'

const weatherCodeToCondition = (code: number): WeatherCondition => {
  if (code === 0) return 'sunny'
  if (code >= 1 && code <= 3) return 'cloudy'
  if (code >= 45 && code <= 48) return 'foggy'
  if (code >= 51 && code <= 67) return 'rainy'
  if (code >= 71 && code <= 77) return 'snowy'
  if (code >= 80 && code <= 82) return 'rainy'
  if (code >= 85 && code <= 86) return 'snowy'
  if (code >= 95 && code <= 99) return 'stormy'
  return 'cloudy'
}

const getWeatherDescription = (code: number): string => {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return descriptions[code] || 'Unknown'
}

// Generate farming advice based on weather conditions
const getFarmingAdvice = (
  temp: number,
  precipProbability: number,
  weatherCode: number,
  humidity: number
): string => {
  const condition = weatherCodeToCondition(weatherCode)

  if (condition === 'stormy') {
    return 'Stay indoors. Avoid field work during storms.'
  }

  if (condition === 'rainy' || precipProbability > 70) {
    return 'Rain expected. Good day for indoor tasks or planning.'
  }

  if (precipProbability > 40 && precipProbability <= 70) {
    return 'Possible rain. Complete urgent outdoor tasks early.'
  }

  if (temp > 35) {
    return 'Very hot. Water crops early morning or evening.'
  }

  if (temp < 10) {
    return 'Cool weather. Protect sensitive crops from cold.'
  }

  if (humidity > 80 && condition !== 'rainy') {
    return 'High humidity. Watch for fungal diseases.'
  }

  if (condition === 'sunny' && temp >= 20 && temp <= 30) {
    return 'Perfect conditions for planting and field work.'
  }

  if (condition === 'cloudy') {
    return 'Good day for transplanting seedlings.'
  }

  return 'Good conditions for general farm activities.'
}

export interface WeatherData {
  temperature: number
  precipitationProbability: number
  humidity: number
  windSpeed: number
  weatherCode: number
  weatherCondition: WeatherCondition
  weatherDescription: string
  farmingAdvice: string
  location: string
  sunrise: string
  sunset: string
  daily: {
    maxTemp: number
    minTemp: number
    precipSum: number
  }
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    precipitation_probability: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
  }
  daily: {
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
    sunrise: string[]
    sunset: string[]
  }
}

const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=auto`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch weather data')
  }

  const data: OpenMeteoResponse = await response.json()

  const temp = Math.round(data.current.temperature_2m)
  const precipProbability = data.current.precipitation_probability ?? 0
  const weatherCode = data.current.weather_code
  const humidity = data.current.relative_humidity_2m

  return {
    temperature: temp,
    precipitationProbability: precipProbability,
    humidity: humidity,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: weatherCode,
    weatherCondition: weatherCodeToCondition(weatherCode),
    weatherDescription: getWeatherDescription(weatherCode),
    farmingAdvice: getFarmingAdvice(temp, precipProbability, weatherCode, humidity),
    location: 'Current Location',
    sunrise: data.daily.sunrise[0] || '',
    sunset: data.daily.sunset[0] || '',
    daily: {
      maxTemp: Math.round(data.daily.temperature_2m_max[0] || 0),
      minTemp: Math.round(data.daily.temperature_2m_min[0] || 0),
      precipSum: data.daily.precipitation_sum[0] || 0,
    },
  }
}

// Reverse geocode to get location name
const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const result = await Location.reverseGeocodeAsync({ latitude, longitude })
    if (result.length > 0) {
      const place = result[0]
      return place.city || place.subregion || place.region || 'Unknown'
    }
  } catch {
    // Fallback if reverse geocoding fails
  }
  return 'Current Location'
}

interface UseWeatherOptions {
  // Default coordinates (Marrakesh) if location permission denied
  defaultLatitude?: number
  defaultLongitude?: number
  defaultLocationName?: string
}

export function useWeather(options: UseWeatherOptions = {}) {
  const {
    defaultLatitude = 31.6295,
    defaultLongitude = -7.9811,
    defaultLocationName = 'Marrakesh',
  } = options

  const [coordinates, setCoordinates] = useState<{
    latitude: number
    longitude: number
    locationName: string
  } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)

  // Get user's location on mount
  useEffect(() => {
    let isMounted = true

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
          if (isMounted) {
            setCoordinates({
              latitude: defaultLatitude,
              longitude: defaultLongitude,
              locationName: defaultLocationName,
            })
            setLocationError('Location permission denied. Using default location.')
          }
          return
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })

        const locationName = await getLocationName(
          location.coords.latitude,
          location.coords.longitude
        )

        if (isMounted) {
          setCoordinates({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            locationName,
          })
        }
      } catch (error) {
        if (isMounted) {
          setCoordinates({
            latitude: defaultLatitude,
            longitude: defaultLongitude,
            locationName: defaultLocationName,
          })
          setLocationError('Could not get location. Using default.')
        }
      }
    }

    getLocation()

    return () => {
      isMounted = false
    }
  }, [defaultLatitude, defaultLongitude, defaultLocationName])

  const query = useQuery({
    queryKey: ['weather', coordinates?.latitude, coordinates?.longitude],
    queryFn: async () => {
      if (!coordinates) throw new Error('No coordinates')
      const weather = await fetchWeather(coordinates.latitude, coordinates.longitude)
      return {
        ...weather,
        location: coordinates.locationName,
      }
    },
    enabled: !!coordinates,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  })

  return {
    ...query,
    locationError,
  }
}
