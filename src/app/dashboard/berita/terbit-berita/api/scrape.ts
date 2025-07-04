// pages/api/scrape.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.includes('blogspot.com')) {
      return res.status(400).json({ error: 'Invalid Blogspot URL provided.' });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    title = title.replace(/\s*-\s*Blogger$/, '').trim();

    let content = '';
    const postBody = $('.post-body, .entry-content, .post-content, [itemprop="articleBody"], article, main').first();
    if (postBody.length) {
        content = postBody.text().trim();
        content = content.replace(/\n\s*\n/g, '\n\n').trim();
    }

    let imageUrl = $('meta[property="og:image"]').attr('content') ||
                   $('.post-body img, .entry-content img, .post-content img, article img, main img').first().attr('src') ||
                   '';

    if (imageUrl && !imageUrl.startsWith('http')) {
        try {
            imageUrl = new URL(imageUrl, url).href;
        } catch (e) {
            console.warn(`Could not resolve relative image URL: ${imageUrl} for base URL: ${url}`);
            imageUrl = '';
        }
    }

    const type = "";

    return res.status(200).json({ title, content, imageUrl, type });

  } catch (error: any) {
    console.error('Scraping error:', error);
    if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({ error: `Failed to fetch URL: ${error.message}` });
    }
    return res.status(500).json({ error: 'Internal server error during scraping.' });
  }
}