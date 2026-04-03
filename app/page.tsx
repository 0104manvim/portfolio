import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const filePath = path.join(process.cwd(), "index.html");
  const html = fs.readFileSync(filePath, "utf8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatches = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)];
  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  const fontHrefMatch = html.match(
    /<link[^>]*href="([^"]*fonts\.googleapis\.com[^"]*)"[^>]*>/i
  );

  const bodyHtml = bodyMatch?.[1]?.replace(/<script>[\s\S]*?<\/script>/gi, "") ?? "";
  const inlineStyles = styleMatches.map((match) => match[1]).join("\n");
  const inlineScript = scriptMatches.map((match) => match[1]).join("\n");

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {fontHrefMatch ? <link rel="stylesheet" href={fontHrefMatch[1]} /> : null}
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      <main dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <Script id="portfolio-inline-script" strategy="afterInteractive">
        {inlineScript}
      </Script>
    </>
  );
}
