/**
 * Copy guard rules, shared by the edge middleware and the in-browser gate.
 * A deterrent, not DRM: it stops the common ways a site gets cloned.
 */

/** Hosts allowed to render the site. Saved or cloned copies elsewhere see "nice tryy". */
export const ALLOWED_HOSTS = [/^localhost$/, /^127\.0\.0\.1$/, /^snapflow[\w-]*\.vercel\.app$/, /^(www\.)?snapflow\.design$/];

/** Link-preview bots: allowed so a shared link still unfurls with a card. */
export const PREVIEW_BOTS =
  /(Slackbot|Slack-ImgProxy|Twitterbot|facebookexternalhit|Facebot|LinkedInBot|WhatsApp|TelegramBot|Discordbot|Applebot|SkypeUriPreview|redditbot|Embedly|iMessage)/i;

/** Site rippers, scrapers, HTTP clients and browser automation. */
export const BLOCKED_AGENTS =
  /(curl|wget|httrack|sitesucker|webcopier|webzip|teleport|offline explorer|webreaper|grab-site|aria2|python|aiohttp|httpx|scrapy|go-http-client|node-fetch|undici|axios|got\/|okhttp|java\/|libwww|lwp::|ruby|php\/|postmanruntime|insomnia|httpie|headlesschrome|puppeteer|playwright|selenium|webdriver|phantomjs|slimerjs|nightmare|electron\/|cheerio|jsdom|crawler|spider|scraper|screenshot|urlbox|browserless|apify|zyte|scrapingbee|firecrawl|html\.to\.design|builder\.io|locofy|anima)/i;

export function isBlockedAgent(ua: string | null | undefined) {
  if (!ua || ua.trim().length < 10) return true;
  if (PREVIEW_BOTS.test(ua)) return false;
  return BLOCKED_AGENTS.test(ua);
}

export function isAllowedHost(host: string) {
  return ALLOWED_HOSTS.some((re) => re.test(host));
}

/** The page every caught copier sees. Plain HTML so it works from the edge, too. */
export const NICE_TRY_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>nice tryy</title><style>html,body{margin:0;height:100%;background:#fff;color:#0b1017;font-family:ui-sans-serif,system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif}main{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px}h1{margin:0;font-size:56px;font-weight:200;letter-spacing:-0.035em}p{margin:0;font-size:13px;color:#8592a6}</style></head><body><main><svg width="40" height="40" viewBox="-2 0 38 38" aria-hidden="true"><path fill="#0b1017" fill-rule="evenodd" d="M18.6 1.155 31.054 8.345a4 4 0 0 1 2 3.464v14.382a4 4 0 0 1-2 3.464L18.6 36.845a4 4 0 0 1-4 0L2.146 29.655a4 4 0 0 1-2-3.464V11.809a4 4 0 0 1 2-3.464L14.6 1.155a4 4 0 0 1 4 0Zm0 8.6 5.007 2.89a4 4 0 0 1 2 3.464v5.782a4 4 0 0 1-2 3.464l-5.007 2.89a4 4 0 0 1-4 0l-5.007-2.89a4 4 0 0 1-2-3.464v-5.782a4 4 0 0 1 2-3.464l5.007-2.89a4 4 0 0 1 4 0Z"/></svg><h1>nice tryy</h1><p>Redesign concept by Umar Khalid</p></main></body></html>`;
