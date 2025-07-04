// app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Basic URL validation
    if (!url || typeof url !== 'string' || !url.includes('blogspot.com')) {
      return NextResponse.json({ error: 'Invalid Blogspot URL provided.' }, { status: 400 });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // --- Extract Title ---
    let title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    // Clean up common Blogspot title suffixes like " - Blogger"
    title = title.replace(/\s*-\s*Blogger$/, '').trim();

    // --- Extract Content (Best effort for main article content) ---
    let content = '';
    // Common selectors for blog post content areas on Blogspot and general blogs
    const postBody = $('.post-body, .entry-content, .post-content, [itemprop="articleBody"], article, main').first();
    if (postBody.length) {
        // Get text content and clean it up
        content = postBody.text().trim();
        // Remove excessive newlines and spaces
        content = content.replace(/\n\s*\n/g, '\n\n').trim();
    }


    // --- Extract Image URL ---
    let imageUrl = $('meta[property="og:image"]').attr('content') || // Open Graph image
                   $('.post-body img, .entry-content img, .post-content img, article img, main img').first().attr('src') || // First image in content
                   ''; // Default to empty string if no image found

    // If the image URL is relative, try to make it absolute.
    // This is a basic attempt and might not cover all edge cases.
    if (imageUrl && !imageUrl.startsWith('http')) {
        try {
            imageUrl = new URL(imageUrl, url).href;
        } catch (e) {
            console.warn(`Could not resolve relative image URL: ${imageUrl} for base URL: ${url}`);
            imageUrl = ''; // If resolution fails, discard
        }
    }

    // For Blogspot, there's no direct "type" field. Set to empty or a default.
    const type = "";

    return NextResponse.json({ title, content, imageUrl, type });

  } catch (error: any) {
    console.error('Scraping error:', error);
    if (axios.isAxiosError(error)) {
        return NextResponse.json({ error: `Failed to fetch URL: ${error.message}` }, { status: error.response?.status || 500 });
    }
    return NextResponse.json({ error: 'Internal server error during scraping.' }, { status: 500 });
  }
}