import type { TaskConfig } from 'payload'
import { scrapeCompetitorIntelligence } from '@/lib/gemini'
import type { RegionValue, SourceType } from '@/lib/gemini'

export const runScrapeTask: TaskConfig<'runScrape'> = {
  slug: 'runScrape',
  inputSchema: [
    { name: 'scrapeRunId', type: 'text', required: true },
    { name: 'automationId', type: 'text', required: true },
    { name: 'productId', type: 'text', required: true },
    { name: 'userId', type: 'text', required: true },
  ],
  outputSchema: [
    { name: 'competitorCount', type: 'number', required: true },
    { name: 'contentItemCount', type: 'number', required: true },
  ],
  retries: 2,
  handler: async ({ input, req }) => {
    const { scrapeRunId, automationId, productId, userId } = input

    // Mark run as running
    await req.payload.update({
      collection: 'scrape-runs',
      id: scrapeRunId,
      data: { status: 'running' },
      draft: false,
      req,
      overrideAccess: true,
    })

    try {
      // Fetch product and automation details
      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
        req,
        overrideAccess: true,
      })

      const automation = await req.payload.findByID({
        collection: 'automations',
        id: automationId,
        req,
        overrideAccess: true,
      })

      const regions = (product.regions ?? ['global']) as RegionValue[]
      const sources = (automation.sources ?? ['news']) as SourceType[]

      // Run Gemini scrape
      const results = await scrapeCompetitorIntelligence(
        product.name,
        product.description ?? null,
        product.niche,
        regions,
        sources,
      )

      // Save competitors
      let competitorCount = 0
      const competitorIdMap: Record<string, string> = {}

      for (const comp of results.competitors) {
        const created = await req.payload.create({
          collection: 'competitors',
          data: {
            name: comp.name,
            product: productId,
            scrapeRun: scrapeRunId,
            createdBy: userId,
            website: comp.website ?? null,
            description: comp.description,
            strengths: comp.strengths,
            weaknesses: comp.weaknesses,
            pricingInfo: comp.pricingInfo ?? null,
            sourceUrl: comp.sourceUrl ?? null,
            regions: comp.regions ?? [],
            isOneClick: false,
          },
          draft: false,
          req,
          overrideAccess: true,
        })
        competitorIdMap[comp.name] = created.id as string
        competitorCount++
      }

      // Save content items
      let contentItemCount = 0
      for (const item of results.contentItems) {
        const competitorId = item.competitorName ? competitorIdMap[item.competitorName] : undefined
        await req.payload.create({
          collection: 'content-items',
          data: {
            title: item.title,
            product: productId,
            scrapeRun: scrapeRunId,
            createdBy: userId,
            sourceType: item.sourceType,
            url: item.url ?? null,
            snippet: item.snippet,
            publishedAt: item.publishedAt ?? null,
            relevanceScore: item.relevanceScore ?? null,
            region: item.region ?? null,
            competitor: competitorId ?? null,
          },
          draft: false,
          req,
          overrideAccess: true,
        })
        contentItemCount++
      }

      // Compute next run time
      const intervalMs: Record<string, number> = {
        '6h': 6 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '72h': 72 * 60 * 60 * 1000,
        '168h': 168 * 60 * 60 * 1000,
      }
      const interval = automation.interval as string
      const nextRunAt = new Date(Date.now() + (intervalMs[interval] ?? 24 * 60 * 60 * 1000))

      // Mark run as completed and update automation
      await req.payload.update({
        collection: 'scrape-runs',
        id: scrapeRunId,
        data: {
          status: 'completed',
          completedAt: new Date().toISOString(),
          summary: results.summary,
        },
        draft: false,
        req,
        overrideAccess: true,
      })

      await req.payload.update({
        collection: 'automations',
        id: automationId,
        data: {
          lastRunAt: new Date().toISOString(),
          nextRunAt: nextRunAt.toISOString(),
        },
        draft: false,
        req,
        overrideAccess: true,
      })

      return { output: { competitorCount, contentItemCount } }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      await req.payload.update({
        collection: 'scrape-runs',
        id: scrapeRunId,
        data: {
          status: 'failed',
          completedAt: new Date().toISOString(),
          errorMessage,
        },
        draft: false,
        req,
        overrideAccess: true,
      })
      throw err
    }
  },
}
