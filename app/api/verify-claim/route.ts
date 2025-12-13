import { NextRequest, NextResponse } from "next/server";

interface WeatherData {
  rainfall: number;
  temperature: number;
  anomaly: string;
}

interface ClaimData {
  crop: string;
  region: string;
  policyStart: string;
  policyEnd: string;
  claimDate: string;
}

async function getWeatherData(region: string): Promise<WeatherData | null> {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(region)}&appid=${apiKey}&units=metric`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    const rainfall = data.rain?.["1h"] || data.rain?.["3h"] || 0;
    const temperature = data.main?.temp || 0;
    
    let anomaly = "Normal conditions";
    if (temperature > 40) {
      anomaly = "Severe heatwave";
    } else if (temperature < 5) {
      anomaly = "Extreme cold";
    } else if (rainfall > 50) {
      anomaly = "Heavy rainfall";
    } else if (rainfall > 100) {
      anomaly = "Extreme flooding";
    }

    return {
      rainfall,
      temperature,
      anomaly,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    return null;
  }
}

async function verifyClaimWithGemini(
  claimData: ClaimData,
  weatherData: WeatherData | null
): Promise<{ approve: boolean; reason: string; detailedSummary: string }> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  const weatherInfo = weatherData
    ? `- Rainfall (mm): ${weatherData.rainfall.toFixed(1)}
- Average Temperature (°C): ${weatherData.temperature.toFixed(1)}
- Anomaly: ${weatherData.anomaly}`
    : `Weather API unavailable. Use your knowledge of typical weather patterns in ${claimData.region} during this period to assess.`;

  const prompt = `You are an agricultural insurance claim verifier with expertise in crop science and weather impact analysis.

        Given the following data, determine whether the crop failure claim
        should be APPROVED or REJECTED.

        Rules:
        - Approve ONLY if weather conditions are severe enough to cause crop failure
        - Be conservative and factual
        - Consider the crop type and region
        - Provide a detailed analysis summary
        - Output MUST be valid JSON
        - Do NOT include explanations outside JSON

        DATA:
        Crop: ${claimData.crop}
        Region: ${claimData.region}
        Policy Duration: ${claimData.policyStart} to ${claimData.policyEnd}
        Claim Date: ${claimData.claimDate}
        Weather Summary:
        ${weatherInfo}

        Return JSON with this exact structure:
        {
            "approve": boolean,
            "reason": "Brief decision explanation (max 80 words)",
            "detailedSummary": "Comprehensive analysis covering: 1) Weather conditions observed, 2) Impact on the specific crop type, 3) Regional climate context, 4) Risk factors identified, 5) Final assessment rationale (max 200 words)"
        }
    `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      approve: result.approve === true,
      reason: result.reason || "No reason provided",
      detailedSummary: result.detailedSummary || result.reason || "No detailed analysis available",
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to verify claim with AI");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crop, region, policyStart, policyEnd, claimDate } = body;

    if (!crop || !region || !policyStart || !policyEnd || !claimDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const weatherData = await getWeatherData(region);

    const claimData: ClaimData = {
      crop,
      region,
      policyStart,
      policyEnd,
      claimDate,
    };

    const verification = await verifyClaimWithGemini(claimData, weatherData);

    return NextResponse.json({
      ...verification,
      weatherData,
      usedWeatherAPI: weatherData !== null,
    });
  } catch (error) {
    console.error("Claim verification error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}