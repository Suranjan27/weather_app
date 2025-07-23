import { NextResponse } from "next/server"

const API_KEY = "bbf96b6106ad3ac2c231e86f9d2d02b1"
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

// More diverse cities from different climate zones for better extreme detection
const MAJOR_CITIES = [
  "Phoenix,US", // Hot desert
  "Death Valley,US", // Extremely hot
  "Dubai,AE", // Hot desert
  "Riyadh,SA", // Hot desert
  "Delhi,IN", // Hot continental
  "Bangkok,TH", // Tropical hot
  "Cairo,EG", // Hot desert
  "Las Vegas,US", // Hot desert
  "Fairbanks,US", // Very cold
  "Anchorage,US", // Cold
  "Reykjavik,IS", // Cold oceanic
  "Moscow,RU", // Cold continental
  "Yakutsk,RU", // Extremely cold
  "Nuuk,GL", // Arctic
  "Barrow,US", // Arctic
  "Murmansk,RU", // Arctic
  "Tromsø,NO", // Arctic
  "Yellowknife,CA", // Subarctic
  "Iqaluit,CA", // Arctic
  "Svalbard,NO", // High Arctic
]

export async function GET() {
  try {
    console.log("Fetching extreme temperatures...")

    // Fetch weather data for all cities with timeout
    const weatherPromises = MAJOR_CITIES.map(async (city) => {
      try {
        const requestUrl = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch(requestUrl, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.log(`Failed to fetch ${city}: ${response.status}`)
          return null
        }

        const raw = await response.text()
        const data = JSON.parse(raw)

        const result = {
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
        }

        console.log(`${city}: ${result.temp}°C`)
        return result
      } catch (error) {
        console.error(`Failed to fetch weather for ${city}:`, error)
        return null
      }
    })

    const weatherData = await Promise.all(weatherPromises)
    const validData = weatherData.filter((data) => data !== null)

    console.log(`Got valid data for ${validData.length} cities`)

    if (validData.length === 0) {
      return NextResponse.json({
        hottest: null,
        coolest: null,
      })
    }

    // Find hottest and coolest temperatures
    const hottest = validData.reduce((prev, current) => (current.temp > prev.temp ? current : prev))
    const coolest = validData.reduce((prev, current) => (current.temp < prev.temp ? current : prev))

    console.log(`Hottest: ${hottest.city}, ${hottest.country} - ${hottest.temp}°C`)
    console.log(`Coolest: ${coolest.city}, ${coolest.country} - ${coolest.temp}°C`)

    return NextResponse.json({
      hottest,
      coolest,
      totalCities: validData.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Extreme temps API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch extreme temperatures",
        hottest: null,
        coolest: null,
      },
      { status: 500 },
    )
  }
}
