# Weather Fetcher Skill

This skill allows the agent to fetch real-time weather data for Phuket, Krabi, Bangkok, or Chiang Mai.

## Usage
`fetch_weather(location)`

## Parameters
- `location`: string (one of the 4 featured hubs)

## Response
Returns a JSON object with:
- `maxTemp`: number (°C)
- `precipProb`: percentage
- `maxUv`: number
- `suitability`: enum (Doable, Caution, Rain Possible)
