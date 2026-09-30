import { GoogleGenAI } from '@google/genai'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

function getClient() {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY })
}

export type RegionValue =
  | 'global'
  | 'us'
  | 'uk'
  | 'eu'
  | 'ca'
  | 'au'
  | 'in'
  | 'sea'
  | 'latam'
  | 'me'

export type SourceType = 'news' | 'reddit' | 'x' | 'social' | 'launches' | 'reviews'

export interface CompetitorResult {
  name: string
  website: string | null
  description: string
  strengths: string
  weaknesses: string
  pricingInfo: string | null
  sourceUrl: string | null
  regions: RegionValue[]
}

export interface ContentItemResult {
  title: string
  sourceType: SourceType
  url: string | null
  snippet: string
  publishedAt: string | null
  relevanceScore: number
  competitorName: string | null
  region: RegionValue | null
}

export interface ScrapeOutput {
  competitors: CompetitorResult[]
  contentItems: ContentItemResult[]
  summary: string
}

const REGION_LABELS: Record<RegionValue, string> = {
  global: 'Global',
  us: 'United States',
  uk: 'United Kingdom',
  eu: 'European Union',
  ca: 'Canada',
  au: 'Australia',
  in: 'India',
  sea: 'Southeast Asia',
  latam: 'Latin America',
  me: 'Middle East',
}

const SOURCE_LABELS: Record<SourceType, string> = {
  news: 'news articles',
  reddit: 'Reddit posts',
  x: 'X/Twitter posts',
  social: 'social media posts',
  launches: 'product launches',
  reviews: 'review sites',
}

export async function discoverCompetitors(
  productName: string,
  productDescription: string | null,
  niche: string,
  regions: RegionValue[],
): Promise<CompetitorResult[]> {
  const client = getClient()
  const regionNames = regions.map((r) => REGION_LABELS[r] || r).join(', ')

  const prompt = `You are a competitive intelligence analyst. Find the top competitors for the following product in the ${regionNames} market.

Product: ${productName}
${productDescription ? `Description: ${productDescription}` : ''}
Market Niche: ${niche}
Target Regions: ${regionNames}

Search the web and find all major competitors currently in this market. For each competitor provide:
1. Company/product name
2. Website URL
3. Brief description (2-3 sentences)
4. Key strengths
5. Notable weaknesses
6. Pricing information if available
7. Which of these regions they operate in: ${regionNames}

Return your response as a JSON array with this exact structure:
[
  {
    "name": "Competitor Name",
    "website": "https://example.com",
    "description": "Brief description",
    "strengths": "Key strengths",
    "weaknesses": "Notable weaknesses",
    "pricingInfo": "Pricing details or null",
    "sourceUrl": "URL where you found this info or null",
    "regions": ["us", "uk"]
  }
]

Only return the JSON array, no other text. Find at least 5 competitors if they exist.`

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  })

  const text = response.text ?? ''
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  try {
    const parsed = JSON.parse(jsonMatch[0]) as CompetitorResult[]
    return parsed
  } catch {
    return []
  }
}

export async function scrapeCompetitorIntelligence(
  productName: string,
  productDescription: string | null,
  niche: string,
  regions: RegionValue[],
  sources: SourceType[],
): Promise<ScrapeOutput> {
  const client = getClient()
  const regionNames = regions.map((r) => REGION_LABELS[r] || r).join(', ')
  const sourceNames = sources.map((s) => SOURCE_LABELS[s] || s).join(', ')

  const prompt = `You are a competitive intelligence researcher. Research the latest information about competitors in the "${niche}" market for the product "${productName}".

${productDescription ? `Product Description: ${productDescription}` : ''}
Target Regions: ${regionNames}
Sources to check: ${sourceNames}

Search the web for:
1. COMPETITORS: Find all major competitors in this niche. For each include name, website, description, strengths, weaknesses, pricing, and regions.
2. CONTENT ITEMS: Find recent content from ${sourceNames} about competitors in this niche. Include news articles, Reddit discussions, social media posts, product launches, or reviews.

Return your response as a JSON object with this exact structure:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "https://example.com or null",
      "description": "2-3 sentence description",
      "strengths": "Key strengths",
      "weaknesses": "Notable weaknesses",
      "pricingInfo": "Pricing details or null",
      "sourceUrl": "Source URL or null",
      "regions": ["us", "uk"]
    }
  ],
  "contentItems": [
    {
      "title": "Content title",
      "sourceType": "news|reddit|x|social|launches|reviews",
      "url": "https://example.com or null",
      "snippet": "Brief excerpt or summary",
      "publishedAt": "ISO date string or null",
      "relevanceScore": 85,
      "competitorName": "Competitor this is about or null",
      "region": "us or null"
    }
  ],
  "summary": "2-3 sentence executive summary of the competitive landscape and key findings"
}

Only return the JSON object, no other text. Be thorough — find at least 5 competitors and 10 content items.`

  const response = await client.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  })

  const text = response.text ?? ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { competitors: [], contentItems: [], summary: 'No results found.' }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ScrapeOutput
    return parsed
  } catch {
    return { competitors: [], contentItems: [], summary: 'Failed to parse results.' }
  }
}
