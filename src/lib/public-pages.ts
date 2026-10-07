// Public destinations shared by sitemap, AI discovery and analytics.
// Inquiry redirects, private routes and draft policies do not belong here.
export const publicPages = [
  {
    path: "/",
    title: "Green Arc Commune",
    description:
      "Gold/XAUUSD education, mentorship and community with Shubham Soni.",
  },
  {
    path: "/programmes",
    title: "Compare learning programmes",
    description:
      "Compare live mentorship, individual mentorship and Strategy Master; Algo Core is coming soon.",
  },
  {
    path: "/programmes/strategy-master",
    title: "Strategy Master Program",
    description: "Gold-market context, strategy reasoning and risk planning.",
  },
  {
    path: "/about/shubham-soni",
    title: "Shubham Soni",
    description:
      "Founder, trader and educator: experience and teaching approach.",
  },
  {
    path: "/stories/member-story",
    title: "A member’s perspective",
    description:
      "Watch the original member testimonial supplied to Green Arc Commune.",
  },
] as const;
