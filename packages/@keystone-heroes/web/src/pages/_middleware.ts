// import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ContentSecurityPolicy = `
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com *.twitter.com wow.zamimg.com;
child-src *.youtube.com *.google.com *.twitter.com;
style-src 'self' 'unsafe-inline' *.googleapis.com;
style-src-elem 'self' 'unsafe-inline' wow.zamimg.com fonts.googleapis.com;
img-src * blob: data:;
media-src 'none';
connect-src *;
font-src 'self' fonts.gstatic.com;
`;

const headers = {
  "Content-Security-Policy": ContentSecurityPolicy.replace(/\n/giu, ""),
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "on",
};

export function middleware(/* req: NextRequest, ev: NextFetchEvent */): NextResponse {
  const response = NextResponse.next();

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.append(key, value);
  });

  return response;
}
