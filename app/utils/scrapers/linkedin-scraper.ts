import puppeteer from 'puppeteer-core';
import {executablePath} from 'puppeteer'
import fs from 'fs/promises';
import path from 'path';

interface LinkedInCompanyInfo {
  name: string;
  description: string;
  posts: Array<{
    content: string;
    date: string;
  }>;
}

export async function scrapeLinkedInCompany(url: string): Promise<LinkedInCompanyInfo> {
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: executablePath()
  });

  try {
    const page = await browser.newPage();
    
    // 设置用户代理以避免被检测
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 获取公司信息
    const companyInfo = await page.evaluate(() => {
      
      const name = document.querySelector('.org-top-card-summary__title')?.textContent?.trim() || '';
      const description = document.querySelector('.org-about-us-organization-description')?.textContent?.trim() || '';
      
      // 获取最近的帖子
      const posts = Array.from(document.querySelectorAll('.feed-shared-update-v2')).map(post => ({
        content: post.querySelector('.feed-shared-text')?.textContent?.trim() || '',
        date: post.querySelector('.feed-shared-actor__sub-description')?.textContent?.trim() || ''
      }));

      return {
        name,
        description,
        posts
      };
    });

    // 生成Markdown内容
    const markdown = generateMarkdown(companyInfo);
    
    // 保存到文件
    const fileName = `${companyInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_linkedin.md`;
    await saveMarkdown(fileName, markdown);

    return companyInfo;

  } finally {
    await browser.close();
  }
}

function generateMarkdown(info: LinkedInCompanyInfo): string {
  return `# ${info.name}

## Company Description
${info.description}

## Recent Posts
${info.posts.map(post => `
### ${post.date}
${post.content}
`).join('\n')}
`;
}

async function saveMarkdown(fileName: string, content: string): Promise<void> {
  
  const outputDir = path.join(process.cwd(), 'public', 'data', 'companies');
  // 确保输出目录存在
  await fs.mkdir(outputDir, { recursive: true });
  
  const filePath = path.join(outputDir, fileName);
  await fs.writeFile(filePath, content, 'utf-8');
}