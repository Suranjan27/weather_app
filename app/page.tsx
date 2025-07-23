"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Thermometer, Eye } from "lucide-react"
import Image from "next/image"

interface WeatherData {
  name: string
  sys: {
    country: string
  }
  main: {
    temp: number
    humidity: number
    feels_like: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  visibility: number
}

const getWeatherIcon = (weatherMain: string) => {
  switch (weatherMain.toLowerCase()) {
    case "clear":
      return <Sun className="h-16 w-16 text-yellow-500" />
    case "clouds":
      return <Cloud className="h-16 w-16 text-gray-500" />
    case "rain":
      return <CloudRain className="h-16 w-16 text-blue-500" />
    case "snow":
      return <CloudSnow className="h-16 w-16 text-blue-200" />
    default:
      return <Cloud className="h-16 w-16 text-gray-500" />
  }
}

export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [extremeTemps, setExtremeTemps] = useState<{
    hottest: { city: string; country: string; temp: number } | null
    coolest: { city: string; country: string; temp: number } | null
  }>({ hottest: null, coolest: null })

  useEffect(() => {
    // Fetch extreme temperatures when component mounts
    const fetchExtremeTemps = async () => {
      try {
        console.log("Fetching extreme temperatures...")
        const response = await fetch("/api/extreme-temps")
        const data = await response.json()
        if (response.ok) {
          console.log("Extreme temps data:", data)
          setExtremeTemps(data)
        } else {
          console.error("Failed to fetch extreme temps:", data.error)
        }
      } catch (error) {
        console.error("Failed to fetch extreme temperatures:", error)
      }
    }

    fetchExtremeTemps()

    // Refresh every 5 minutes
    const interval = setInterval(fetchExtremeTemps, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather data")
      }

      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchWeather()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 pb-20">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative">
              <Image
                src="/weather-icon-logo.png"
                alt="Weather App Logo"
                width={85}
                height={85}
                className="hover:scale-110 transition-transform duration-300 ease-in-out drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold text-white">Weather App</h1>
          </div>
          <p className="text-blue-100">Get current weather information for any city</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Weather</CardTitle>
            <CardDescription>Enter a city name to get current weather conditions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {weather && (
          <Card className="mb-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">{getWeatherIcon(weather.weather[0].main)}</div>
              <CardTitle className="text-2xl">
                {weather.name}, {weather.sys.country}
              </CardTitle>
              <CardDescription className="text-lg capitalize">{weather.weather[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 mb-2">{Math.round(weather.main.temp)}°C</div>
                <div className="text-gray-600">Feels like {Math.round(weather.main.feels_like)}°C</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">{weather.main.humidity}%</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Wind className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="font-semibold">{weather.wind.speed} m/s</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Thermometer className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Pressure</div>
                  <div className="font-semibold">{weather.main.pressure} hPa</div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Eye className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Visibility</div>
                  <div className="font-semibold">{(weather.visibility / 1000).toFixed(1)} km</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Temperature Extremes Ribbon */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 text-white py-3 shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center items-center space-x-8 text-sm md:text-base">
              {extremeTemps.hottest && (
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-yellow-300" />
                  <span className="font-semibold">Hottest:</span>
                  <span>
                    {extremeTemps.hottest.city}, {extremeTemps.hottest.country}: {Math.round(extremeTemps.hottest.temp)}
                    °C
                  </span>
                </div>
              )}

              <div className="hidden md:block w-px h-6 bg-white/30"></div>

              {extremeTemps.coolest && (
                <div className="flex items-center space-x-2">
                  <CloudSnow className="h-5 w-5 text-blue-200" />
                  <span className="font-semibold">Coolest:</span>
                  <span>
                    {extremeTemps.coolest.city}, {extremeTemps.coolest.country}: {Math.round(extremeTemps.coolest.temp)}
                    °C
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
