import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "bbf96b6106ad3ac2c231e86f9d2d02b1"
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 })
  }

  try {
    const requestUrl = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`

    const response = await fetch(requestUrl, {
      headers: { Accept: "application/json" },
    })

    // Get raw body first – it might not be JSON (e.g. 301/302 or text error pages)
    const raw = await response.text()
    let payload: unknown

    try {
      payload = JSON.parse(raw)
    } catch {
      payload = { message: raw }
    }

    if (!response.ok) {
      const message = (payload as any)?.message ?? `HTTP error: ${response.status}`

      return NextResponse.json({ error: message }, { status: response.status })
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred while fetching weather data" }, { status: 500 })
  }
}
