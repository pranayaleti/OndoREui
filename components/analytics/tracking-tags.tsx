"use client"

import Script from "next/script"
import { useEffect, useState } from "react"
import { isMarketingRestrictedRegion } from "@/lib/region"

/**
 * Marketing / retargeting tracking tags.
 *
 * Each tag loads ONLY if its env var is set, so flipping a pixel on/off
 * is just a redeploy with a new env value — no code changes.
 *
 * Recommended setup: configure GTM once (NEXT_PUBLIC_GTM_ID) and add the
 * Meta / TikTok / LinkedIn pixels INSIDE GTM. The standalone components
 * below are kept as fallbacks for cases where GTM is not desired.
 *
 * Env vars:
 *  - NEXT_PUBLIC_GTM_ID            — e.g. "GTM-XXXXXXX"
 *  - NEXT_PUBLIC_META_PIXEL_ID     — Facebook/Meta Pixel numeric ID
 *  - NEXT_PUBLIC_TIKTOK_PIXEL_ID   — TikTok Pixel ID
 *  - NEXT_PUBLIC_LINKEDIN_PARTNER_ID — LinkedIn Insight Partner ID
 */

export function GoogleTagManager() {
  const id = process.env["NEXT_PUBLIC_GTM_ID"]
  if (!id) return null
  return (
    <Script
      id="gtm-base"
      strategy="afterInteractive"
      // GTM's official snippet — verbatim recommended install
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){
            w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${id}');
        `,
      }}
    />
  )
}

/** Inline <noscript> GTM iframe — must live at top of <body>. */
export function GoogleTagManagerNoscript() {
  const id = process.env["NEXT_PUBLIC_GTM_ID"]
  if (!id) return null
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}

/**
 * Google Analytics (gtag). Gated alongside the marketing tags: GA sets cookies
 * and sends data to Google, so under GDPR/ePrivacy it requires consent too.
 * (Moved out of app/layout.tsx so it shares the same geo-gate.)
 */
export function GoogleAnalyticsTag() {
  const id = process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]
  if (!id) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}

export function MetaPixel() {
  const id = process.env["NEXT_PUBLIC_META_PIXEL_ID"]
  if (!id) return null
  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${id}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

export function TikTokPixel() {
  const id = process.env["NEXT_PUBLIC_TIKTOK_PIXEL_ID"]
  if (!id) return null
  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;
            var ttq=w[t]=w[t]||[];
            ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
            ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
            for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
            ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
            ttq.load=function(e,n){
              var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;
              ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
              var s=document.createElement("script");
              s.type="text/javascript";s.async=!0;
              s.src=r+"?sdkid="+e+"&lib="+t;
              var a=document.getElementsByTagName("script")[0];
              a.parentNode.insertBefore(s,a);
            };
            ttq.load('${id}');
            ttq.page();
          }(window, document, 'ttq');
        `,
      }}
    />
  )
}

export function LinkedInInsightTag() {
  const id = process.env["NEXT_PUBLIC_LINKEDIN_PARTNER_ID"]
  if (!id) return null
  return (
    <>
      <Script
        id="linkedin-insight"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "${id}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${id}&fmt=gif`}
        />
      </noscript>
    </>
  )
}

/**
 * rb2b — anonymous visitor de-anonymization. The most consent-sensitive tag
 * here (it identifies individuals/companies), so it is gated like the rest.
 * Reads NEXT_PUBLIC_REB2B_KEY (matches .env.example and the `reb2b` global).
 */
export function Rb2bPixel() {
  const key = process.env["NEXT_PUBLIC_REB2B_KEY"]
  if (!key) return null
  return (
    <Script
      id="rb2b-script"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          !function(key) {
            if (window.reb2b) return;
            window.reb2b = {loaded: true};
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
            document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
          }("${key}");
        `,
      }}
    />
  )
}

/**
 * Render all marketing tags, geo-gated for privacy compliance.
 *
 * Each tag is still a no-op without its env var. On top of that, the whole
 * bundle is withheld from privacy-strict (European) regions, detected
 * client-side via {@link isMarketingRestrictedRegion}. We start in the
 * suppressed state and only opt in after mount once a non-EEA region is
 * confirmed — this both errs toward privacy and avoids a hydration mismatch
 * (the prerendered HTML contains no pixels, matching the first client render).
 *
 * Note: the no-JS <noscript> fallbacks (e.g. GoogleTagManagerNoscript) cannot
 * be geo-gated, since detection requires JavaScript. That is an accepted
 * trade-off of the no-banner approach.
 */
export function TrackingTags() {
  // Safe default: suppressed until the client confirms a non-restricted region.
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    setAllowed(!isMarketingRestrictedRegion())
  }, [])

  if (!allowed) return null

  return (
    <>
      <GoogleAnalyticsTag />
      <GoogleTagManager />
      <MetaPixel />
      <TikTokPixel />
      <LinkedInInsightTag />
      <Rb2bPixel />
    </>
  )
}
