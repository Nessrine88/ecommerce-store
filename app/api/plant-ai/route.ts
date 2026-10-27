
import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/app/db";
import { categories, categoryTranslations } from "@/app/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function isAllowedImageHost(hostname: string) {
  return (
    hostname === "utfs.io" ||
    hostname.endsWith(".utfs.io") ||
    hostname === "ufs.sh" ||
    hostname.endsWith(".ufs.sh")
  );
}

export async function POST(request: Request) {
  try {
    // Restrict AI usage to administrators.
    const session = await auth();
    const role = (
      session?.user as { role?: string } | undefined
    )?.role;

    if (!session?.user || role !== "admin") {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const imageUrl = body.imageUrl;

    if (typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "An image URL is required." },
        { status: 400 },
      );
    }

    let url: URL;

    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid image URL." },
        { status: 400 },
      );
    }

    if (
      url.protocol !== "https:" ||
      !isAllowedImageHost(url.hostname) ||
      url.username ||
      url.password
    ) {
      return NextResponse.json(
        { error: "Unsupported image URL." },
        { status: 400 },
      );
    }

    // Download the uploaded image without following redirects.
    const imageResponse = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Could not retrieve the uploaded image." },
        { status: 400 },
      );
    }

    const mimeType = imageResponse.headers
      .get("content-type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();

    if (!mimeType || !ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Use a JPEG, PNG, or WebP image." },
        { status: 400 },
      );
    }

    const imageBuffer = Buffer.from(
      await imageResponse.arrayBuffer(),
    );

    if (
      imageBuffer.length === 0 ||
      imageBuffer.length > MAX_IMAGE_BYTES
    ) {
      return NextResponse.json(
        { error: "The image must be smaller than 8 MB." },
        { status: 400 },
      );
    }

    // Load real categories from your existing database.
    const categoryRows = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categoryTranslations.name,
      })
      .from(categories)
      .leftJoin(
        categoryTranslations,
        and(
          eq(
            categoryTranslations.categoryId,
            categories.id,
          ),
          eq(categoryTranslations.locale, "en"),
        ),
      );

    if (categoryRows.length === 0) {
      return NextResponse.json(
        { error: "Create at least one product category first." },
        { status: 400 },
      );
    }

    const categoryOptions = categoryRows.map((category) => ({
      id: category.id,
      name: category.name ?? category.slug,
    }));

    const result = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this plant photo for an e-commerce product listing.

Return suggestions for:
- common product name in English
- scientific name, if identifiable
- concise English product description
- Arabic product name and description
- French product name and description
- brand, only if identifiable from the image
- the most suitable existing category

Available categories:
${JSON.stringify(categoryOptions)}

Choose categoryId only from the supplied category IDs.
If no category fits, return null for categoryId.

Do not invent a brand, price, stock quantity, or product facts.
If identification is uncertain, explain that in identificationNotes.
Write useful, factual descriptions. Avoid unsupported claims
about toxicity, pet safety, medicinal uses, or care requirements.

Return only the requested structured data.
              `,
            },
            {
              inlineData: {
                mimeType,
                data: imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            scientificName: {
              type: Type.STRING,
              nullable: true,
            },
            description: { type: Type.STRING },
            nameAr: { type: Type.STRING },
            descriptionAr: { type: Type.STRING },
            nameFr: { type: Type.STRING },
            descriptionFr: { type: Type.STRING },
            brand: {
              type: Type.STRING,
              nullable: true,
            },
            categoryId: {
              type: Type.STRING,
              nullable: true,
            },
            identificationNotes: { type: Type.STRING },
          },
          required: [
            "name",
            "scientificName",
            "description",
            "nameAr",
            "descriptionAr",
            "nameFr",
            "descriptionFr",
            "brand",
            "categoryId",
            "identificationNotes",
          ],
        },
      },
    });

    if (!result.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const suggestion = JSON.parse(result.text);

    // Never trust a category ID generated by the model.
    const validCategoryIds = new Set(
      categoryRows.map((category) => category.id),
    );

    if (!validCategoryIds.has(suggestion.categoryId)) {
      suggestion.categoryId = null;
    }

    // Return only expected fields.
    return NextResponse.json({
      suggestion: {
        name: suggestion.name,
        scientificName: suggestion.scientificName,
        description: suggestion.description,
        nameAr: suggestion.nameAr,
        descriptionAr: suggestion.descriptionAr,
        nameFr: suggestion.nameFr,
        descriptionFr: suggestion.descriptionFr,
        brand: suggestion.brand,
        categoryId: suggestion.categoryId,
        identificationNotes: suggestion.identificationNotes,
      },
    });
  } catch (error) {
    console.error("Plant AI analysis failed:", error);

    return NextResponse.json(
      { error: "Plant analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
