// Search-engine data: structured data (schema.org JSON-LD) and the pages
// that must stay out of the sitemap. Pure functions, no Astro imports.
import { subjects } from "../config/site";
import { locales } from "../i18n/locales";

interface SiteInfo {
  url: string;
  name: string;
  author: string;
}

const home = (url: string) => `${url}/`;
const personId = (url: string) => `${url}/#person`;
const websiteId = (url: string) => `${url}/#website`;

const person = (site: SiteInfo) => ({ "@type": "Person", "@id": personId(site.url), name: site.author, url: home(site.url) });
const website = (site: SiteInfo) => ({ "@type": "WebSite", "@id": websiteId(site.url), name: site.author, url: home(site.url) });

// Who the site belongs to and what it is: lets search engines tie the domain
// to the author's name. Language-neutral, the same on every home page.
export function websiteGraph(site: SiteInfo) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      person(site),
      { ...website(site), alternateName: site.name, author: { "@id": personId(site.url) }, publisher: { "@id": personId(site.url) } },
    ],
  };
}

export function topicGraph(site: SiteInfo, page: { title: string; description: string; url: string; bcp47: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: page.title,
    description: page.description,
    url: page.url,
    inLanguage: page.bcp47,
    learningResourceType: "interactive notes",
    // Inlined: search engines do not follow @id references across pages.
    author: person(site),
    isPartOf: website(site),
  };
}

// Search results show about 155 characters: cut at the last full sentence
// that fits, or at a word with an ellipsis.
export function metaDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentence >= max / 2) return head.slice(0, sentence + 1);
  return `${head.slice(0, head.lastIndexOf(" "))}…`;
}

// JSON for a <script type="application/ld+json">: "<" is escaped so a value
// can never close the script element.
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

// Pages that must stay out of the sitemap: redirects, "coming soon"
// placeholders, and pages showing another language's notes (their canonical
// URL is the original language).
export function sitemapExcludes(url: string): Set<string> {
  const out = new Set([home(url)]);
  for (const subject of subjects) {
    for (const lang of locales) {
      // Subjects with topics only redirect; the others are "coming soon" placeholders.
      out.add(`${url}/${lang}/${subject.slug}/`);
      for (const topic of subject.topics) {
        if (!topic.locales.includes(lang)) out.add(`${url}/${lang}/${subject.slug}/${topic.slug}/`);
      }
    }
  }
  return out;
}
