import {
  faqs,
  founder,
  learningMethod,
  programmes,
  programmeEnrolmentNote,
  reviews,
  site,
  team,
  videoStories,
} from "@/lib/content";
import { publicPages } from "@/lib/public-pages";
import { siteIndexable } from "@/lib/seo";

const absolute = (path: string) => new URL(path, site.url).href;

export function llmsIndex(): string {
  return `# ${site.name}

> Gold/XAUUSD trading education, mentorship and community with Shubham Soni.

The website serves learners with English-language information about programmes taught in Hindi. Three programmes accept inquiries. Algo Core is in development and is not available for enrollment. Education and member experiences do not guarantee trading results. The illustrated hero chart is decorative, not live market data.

## Website

${publicPages.map((p) => `- [${p.title}](${absolute(p.path)}): ${p.description}`).join("\n")}

## Detailed text

- [Expanded public content](${absolute("/llms-full.txt")}): Programme descriptions, learning approach, team, member stories and frequently asked questions, generated from the same content as the website.

## Contact and official channels

- [Programme inquiries](${absolute("/#contact")}): Contact form for live and individual mentorship.
- [Support WhatsApp](${site.supportWhatsapp}): Speak to the team about Strategy Master.
- [Email support](mailto:${site.email}): ${site.email}
- [YouTube](${site.youtube}): Green Arc Commune’s official channel.
- [Instagram](${site.instagram}): Official profile.
- [WhatsApp community](${site.whatsapp}): Official community channel, separate from support.

## Optional

- [Privacy information](${absolute("/privacy")}): Website data handling and optional analytics; final business-policy details remain pending.
- [Terms and disclosures](${absolute("/terms")}): Educational risk and enrollment information; final programme terms remain pending.
- [Sitemap](${absolute("/sitemap.xml")}): Canonical public page inventory.
`;
}

export function llmsFull(): string {
  return `# ${site.name}: expanded public content

> Gold/XAUUSD trading education and mentorship. Source: ${absolute("/")}

This document is generated from public website content. Programme availability and the official contact channels below are the source for current inquiries. The hero candlestick chart is illustrative, not live or historical market data. Neither educational content nor member testimonials promise investment returns.

## Founder

Source: ${absolute("/about/shubham-soni")}

${founder.description}

${founder.approach}

## Learning approach

${learningMethod.map((step) => `### ${step.title}\n\n${step.text}`).join("\n\n")}

## Programmes

Source: ${absolute("/programmes")}

${programmes
  .map(
    (p) => `### ${p.title}

Status: ${p.kind === "coming-soon" ? "Coming soon; in development; enrollment is not available." : "Contact the team for current availability."}

${p.description}

${p.fit}

${p.features.map((feature) => `- ${feature}`).join("\n")}

${p.outcome}

${p.kind === "page" ? `Programme page: ${absolute(`/programmes/${p.slug}`)}\n\nSupport: ${site.supportWhatsapp}` : p.kind === "enquiry" ? `Inquiry form: ${absolute(`/?programme=${p.slug}#contact`)}` : ""}`,
  )
  .join("\n\n")}

${programmeEnrolmentNote}

## Frequently asked questions

Source: ${absolute("/#faq")}

${faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}`).join("\n\n")}

## Current team

Source: ${absolute("/#team")}

${team.map((member) => `- ${member.name}: ${member.role}`).join("\n")}

## Member experiences

Source: ${absolute("/#stories")}

Member experiences are individual, not promises of results. Written reviews include historical programme names and team references; current programmes and team members are listed above.

${reviews.map((review) => `### ${review.theme}\n\n${review.name} — ${review.context}\n\n> ${review.quote}`).join("\n\n")}

### Member video

${videoStories[0].title} ${videoStories[0].description}

Watch: ${absolute("/stories/member-story")}

The accompanying description is not a transcript. No quotation or speaker identity has been inferred from the recording.

## Contact

Email: ${site.email}

Inquiry form: ${absolute("/#contact")}

Support WhatsApp: ${site.supportWhatsapp}

Community WhatsApp channel: ${site.whatsapp}

YouTube: ${site.youtube}

Instagram: ${site.instagram}

## Website privacy and terms

Privacy information: ${absolute("/privacy")}

Terms and disclosures: ${absolute("/terms")}

Final business policies and programme terms require confirmation from the team. Do not treat a poster offer as an unconditional current price; verify fees, eligibility and access terms before enrolling.
`;
}

export function textResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=0, must-revalidate",
      Link: `<${absolute("/llms.txt")}>; rel="describedby"`,
      ...(!siteIndexable ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    },
  });
}
