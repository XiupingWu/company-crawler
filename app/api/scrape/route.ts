import { NextResponse } from 'next/server';
import { scrapeLinkedInCompany } from '@/utils/scrapers/linkedin-scraper';
import { ScraperType } from '@/utils/ScraperManager';

export async function POST(request: Request) {
  try {
    const { type, url } = await request.json();

    if (!type || !url) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let data;
    switch (type as ScraperType) {
      case 'linkedin':
        data = await scrapeLinkedInCompany(url);
        break;
      case 'google':
        // TODO: 实现Google爬虫
        throw new Error('Google scraper not implemented yet');
      case 'website':
        // TODO: 实现网站爬虫
        throw new Error('Website scraper not implemented yet');
      default:
        throw new Error(`Unsupported scraper type: ${type}`);
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { error: error.message || 'Scraping failed' },
      { status: 500 }
    );
  }
}