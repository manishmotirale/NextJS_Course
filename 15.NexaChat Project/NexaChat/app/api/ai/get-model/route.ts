import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      // Cache response for 1 hour to optimize performance and prevent rate limiting
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "OpenRouter API error" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const rawModels: any[] = data?.data || [];

    // Filter models where prompt and completion costs are strictly zero
    const freeModels = rawModels.filter((model) => {
      const promptPrice = parseFloat(model.pricing?.prompt || "0");
      const completionPrice = parseFloat(model.pricing?.completion || "0");

      return promptPrice === 0 && completionPrice === 0;
    });

    // Format response payload for the frontend
    const formattedModels = freeModels.map((model) => ({
      id: model.id,
      name: model.name,
      description: model.description || "",
      context_length: model.context_length || 0,
      architecture: model.architecture || {},
      pricing: model.pricing || {},
      top_provider: model.top_provider || {},
    }));

    return NextResponse.json({
      models: formattedModels,
    });
  } catch (error) {
    console.error("Error fetching free models:", error);

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to fetch free models",
      },
      { status: 500 },
    );
  }
}
