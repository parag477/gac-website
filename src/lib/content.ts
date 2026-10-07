import { canonicalOrigin } from "./site-config";

export const site = {
  name: "Green Arc Commune",
  url: canonicalOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  email: "support@greenarccommune.com",
  supportWhatsapp: "https://wa.me/919753574157",
  instagram: "https://www.instagram.com/greenarccommune/",
  whatsapp: "https://whatsapp.com/channel/0029VbB9LqrC1Fu7mqRvcK0b",
  youtube:
    process.env.NEXT_PUBLIC_YOUTUBE_URL ||
    "https://youtube.com/@greenarccommune",
  telegram: "https://t.me/greenarccapitals",
};

export const founder = {
  name: "Shubham Soni",
  role: "Founder, Trader and Educator",
  description:
    "Shubham Soni is the founder of Green Arc Commune, with 7+ years of trading experience and expertise in gold trading. His work brings trading education and mentorship into a shared learning environment.",
  approach:
    "The focus is on the decisions behind a trade: the preparation, the patience and the ability to step back and review.",
};

export const learningMethod = [
  {
    title: "Understand",
    text: "Learn to read market context, question an idea and understand the reasoning behind a decision.",
  },
  {
    title: "Practise",
    text: "Connect what you learn with live-market observation, structured frameworks and thoughtful preparation.",
  },
  {
    title: "Reflect",
    text: "Review your decisions, notice your habits and keep refining your process with guidance and perspective.",
  },
] as const;

export const programmeEnrolmentNote =
  "Ask the team for current fees, availability, duration, recording access and cancellation or refund terms before enrolling. Learning supports your process; trading outcomes are never guaranteed.";

export const teachingLanguage = "Hindi";
export const strategyOffer = {
  price: 3999,
  currency: "INR",
  audience: "Webinar subscribers",
  description:
    "The Strategy Master webinar offer is ₹3,999 for webinar subscribers. Contact the support team to confirm eligibility, the current schedule and access details before enrolling.",
};

export const programmes = [
  {
    slug: "live-mentorship",
    title: "Live Mentorship Program",
    kind: "enquiry",
    format: "Learn in the market",
    description:
      "Learn alongside Shubham as market context becomes a trading plan. Explore gold, preparation and the reasoning behind a decision.",
    fit: "For traders who learn by seeing the process unfold.",
    image: "/images/workspace.jpg",
    features: [
      "Live-market learning",
      "Gold-market context",
      "Preparation and risk",
      "Questions and review",
    ],
    rhythm: "Live mentorship",
    outcome:
      "Build a considered process for observing, planning and reviewing your trades.",
  },
  {
    slug: "individual-mentorship",
    title: "Individual Mentorship Program",
    kind: "enquiry",
    format: "Make it personal",
    description:
      "Focused guidance for your questions, your habits and your trading process.",
    fit: "For traders seeking personal guidance and focused feedback.",
    image: "/images/shubham-soni.jpg",
    features: [
      "Personal guidance",
      "Review your process",
      "Risk-management principles",
      "Questions at your pace",
    ],
    rhythm: "Personal mentorship",
    outcome:
      "Identify the decisions that deserve closer attention and build a practice that fits you.",
  },
  {
    slug: "strategy-master",
    title: "Strategy Master Program",
    kind: "page",
    format: "Learn strategy directly",
    description:
      "Go beyond spotting a setup. Learn how to connect market context, a clear trading idea and a considered risk plan, with a focus on gold.",
    fit: "For traders ready to understand the reasoning behind a strategy.",
    image: "/images/learning.jpg",
    detailImage: "/images/strategy-master-offer.png",
    features: [
      "Read market structure and context",
      "Understand the logic behind a setup",
      "Define risk before execution",
      "Review decisions and refine your process",
    ],
    rhythm: "From concept to a clear plan",
    outcome:
      "Learn strategy directly: understand what you are looking for, why it matters, and how to review the decision afterwards.",
  },
  {
    slug: "algo-core",
    title: "Algo Core",
    kind: "coming-soon",
    format: "In development",
    description:
      "Our algo application is being built. More details will be shared when it is ready.",
    fit: "A new way to explore systematic trading. In development.",
    image: "/images/workspace.jpg",
    features: [],
    rhythm: "Coming soon",
    outcome: "Our algo application is in development.",
  },
] as const;

export const team = [
  {
    name: "Shubham Soni",
    role: "Founder · Trader · Educator",
    image: "/images/shubham-soni.jpg",
  },
  {
    name: "Krishna Soni",
    role: "Production Head",
    image: "/images/krishna-soni.jpeg",
  },
  {
    name: "Rudra Sahu",
    role: "Technical Management",
    image: "/images/rudra-sahu.jpg",
  },
  {
    name: "Sheuli Sarkar",
    role: "Production VP",
    image: "/images/sheuli-sarkar.jpg",
  },
  {
    name: "Ritesh Upadhyay",
    role: "Web Development",
    image: "/images/ritesh-upadhyay.webp",
  },
];

// Existing reviews confirmed authentic by the owner. Excerpts preserve their words;
// the founder's name is corrected at the owner's request. These are not promised outcomes.
export const reviews = [
  {
    name: "Arjun Rao",
    context: "Mastery · Bangalore",
    quote:
      "Before GAC I was revenge trading after every loss. Shubham’s psychology framework completely rewired how I see the market.",
    theme: "A different mindset",
    initials: "AR",
  },
  {
    name: "Sneha Kulkarni",
    context: "Live Room · Chennai",
    quote:
      "The community is everything — Discord is always active, someone always has an answer. The team genuinely shows up every day.",
    theme: "People who show up",
    initials: "SK",
  },
  {
    name: "Priya Joshi",
    context: "Individual · Pune",
    quote:
      "The 1-on-1 mentorship with Anunay was a turning point. He identified my overtrading pattern in the first session.",
    theme: "The right feedback",
    initials: "PJ",
  },
  {
    name: "Meera Shah",
    context: "Live Room · Mumbai",
    quote:
      "The Live Room is something else. Every morning they break down exactly where the institutional footprint is.",
    theme: "Seeing the process",
    initials: "MS",
  },
  {
    name: "Rahul Khanna",
    context: "Algo Core · Delhi",
    quote: "The support is insane — they genuinely care about your success.",
    theme: "Support that matters",
    initials: "RK",
  },
  {
    name: "Varun Trivedi",
    context: "Mastery · Hyderabad",
    quote:
      "The structured daily bias framework is what made the difference — I finally understood where price WANTS to go, not where I want it to go.",
    theme: "Clarity over conviction",
    initials: "VT",
  },
];

export type VideoStory = {
  id: string;
  title: string;
  poster: string;
  src: string | null;
  captions?: string;
  description: string;
  placeholder: boolean;
};
// Original member recording supplied by the owner. No identity or quotation inferred.
export const videoStories: VideoStory[] = [
  {
    id: "member-story",
    title: "A member’s perspective.",
    poster: "/images/member-testimonial.jpg",
    src: "/videos/member-testimonial.mp4",
    description:
      "Hear a member share their experience of Green Arc Commune in their own words.",
    placeholder: false,
  },
];

export const faqs = [
  {
    question: "Which language are the programmes taught in?",
    answer:
      "The programmes are taught in Hindi. This website provides programme information in English. Ask the team about the current timetable and recording access before enrolling.",
  },
  {
    question: "What is the Strategy Master webinar offer?",
    answer: strategyOffer.description,
  },
  {
    question: "What does Green Arc Commune teach?",
    answer:
      "Green Arc Commune offers trading education and mentorship with a focus on gold/XAUUSD. The learning approach brings together market context, strategy reasoning, risk awareness, practice and reviewing your decisions.",
  },
  {
    question: "Who is Shubham Soni?",
    answer:
      "Shubham Soni is the founder of Green Arc Commune, a trader and an educator with 7+ years of trading experience and expertise in gold trading. His teaching focuses on preparation, patience and the decisions behind a trade.",
  },
  {
    question: "Is Green Arc Commune right for a beginner?",
    answer:
      "Tell us about your experience and what you want to learn. We’ll help you understand the prerequisites and which programme fits your starting point before you make a commitment.",
  },
  {
    question: "How are the four programmes different?",
    answer:
      "Live Mentorship Program focuses on learning through live-market observation. Individual Mentorship Program offers personal guidance. Strategy Master Program focuses on learning strategy directly. Algo Core is in development and coming soon.",
  },
  {
    question: "Do you provide tips or guaranteed returns?",
    answer:
      "Green Arc Commune is focused on education, process and disciplined learning. Trading involves risk, and no programme or testimonial is a promise of returns.",
  },
  {
    question: "Can I learn alongside work or college?",
    answer:
      "Ask the team for the current timetable, replay access and expected weekly commitment. These vary by programme, so confirm the details before enrolling.",
  },
  {
    question: "Where can I find the fees and next start date?",
    answer:
      "Send an enquiry for your preferred programme. The team can share the current fees, inclusions, availability and terms so you can make an informed decision.",
  },
];
