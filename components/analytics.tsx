import Script from "next/script"
import { Suspense } from "react"

import { RouteHits } from "@/components/analytics-route-hits"

const METRIKA_ID = process.env.NEXT_PUBLIC_YM_ID
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

/**
 * Счётчики. Идентификаторы приходят из окружения и вшиваются на сборке:
 * без них ничего не рендерится, поэтому dev и превью-сборки остаются чистыми.
 */
export function Analytics() {
  return (
    <>
      {METRIKA_ID ? <Metrika id={METRIKA_ID} /> : null}
      {GA_ID ? <GoogleAnalytics id={GA_ID} /> : null}
      {METRIKA_ID || GA_ID ? (
        // useSearchParams внутри требует границы: без неё статическая
        // генерация страниц свалилась бы в клиентский рендер целиком.
        <Suspense fallback={null}>
          <RouteHits metrikaId={METRIKA_ID} gaId={GA_ID} />
        </Suspense>
      ) : null}
    </>
  )
}

function Metrika({ id }: { id: string }) {
  return (
    <>
      <Script id="ym" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${id},"init",{ssr:true,webvisor:true,clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}

function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag("js",new Date());
gtag("config","${id}",{send_page_view:true});`}
      </Script>
    </>
  )
}
