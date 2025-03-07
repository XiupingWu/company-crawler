export type ScraperType = 'linkedin' | 'google' | 'website';

export type ScrapedData = {
  name: string;
  description: string;
  posts?: Array<{
    content: string;
    date: string;
  }>;
  // 可以添加其他数据类型
};

export class ScraperManager {
  static async scrape(type: ScraperType, url: string): Promise<ScrapedData> {
    const response = await fetch('/api/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Scraping failed');
    }

    const { data } = await response.json();
    return data;
  }

  static validateUrl(type: ScraperType, url: string): boolean {
    switch (type) {
      case 'linkedin':
        return url.includes('linkedin.com/company/');
      case 'google':
        return url.includes('google.com');
      case 'website':
        return url.startsWith('http') || url.startsWith('https');
      default:
        return false;
    }
  }
}

export const scraperManager = new ScraperManager();