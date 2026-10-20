import { NextResponse, type NextRequest } from "next/server";
import { NICE_TRY_HTML, isBlockedAgent } from "@/lib/guard";

/**
 * Edge guard: site rippers, scrapers and automated browsers get the
 * "nice tryy" page instead of the site, its scripts, styles or models.
 * Link-preview bots still pass so shared links unfurl.
 */
export function middleware(req: NextRequest) {
  if (isBlockedAgent(req.headers.get("user-agent"))) {
    return new NextResponse(NICE_TRY_HTML, {
      status: 403,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!favicon\\.svg|favicon\\.ico|apple-touch-icon\\.png).*)"],
};
