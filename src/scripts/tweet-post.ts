import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Twitter API credentials - these should be in your .env file
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

async function tweetPost(postSlug: string) {
  try {
    // Read the post file
    const postsDirectory = path.join(process.cwd(), '_posts');
    const fullPath = path.join(postsDirectory, `${postSlug}.md`);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post ${postSlug} not found`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data: frontMatter, content } = matter(fileContents);

    // Create tweet content with full blog post
    const title = frontMatter.title;
    const mainTweet = `${title}\n\n${content}`;

    // Send main tweet
    const mainResponse = await client.v2.tweet(mainTweet);
    console.log('Main tweet posted successfully:', mainResponse);

    // Reply with the URL
    const url = `https://collincaram.com/posts/${postSlug}`;
    const replyResponse = await client.v2.reply(
      `Originally posted at: ${url}`,
      mainResponse.data.id
    );
    console.log('URL reply posted successfully:', replyResponse);

    return { mainTweet: mainResponse, reply: replyResponse };
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
}

// If running from command line
if (require.main === module) {
  const postSlug = process.argv[2];
  if (!postSlug) {
    console.error('Please provide a post slug as an argument');
    process.exit(1);
  }

  tweetPost(postSlug)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { tweetPost };
