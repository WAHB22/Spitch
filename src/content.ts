/**
 * Every piece of text on the site lives in this file, so copy can change without touching components.
 * The product name comes from BRAND in src/config.ts.
 */
import { BRAND } from "./config.ts";

export type Role = "pitcher" | "builder" | "both";

export type Pitch = {
  title: string;
  summary: string;
  needs: string[];
  score: number;
};

/** The en dash is wrapped in word joiners so the name never breaks across two lines. */
const REGION = "Ottawa\u2060–\u2060Gatineau";

export const content = {
  /** Placeholders to fill before launch. Each one is listed in README.md under "TODO before launch". */
  placeholders: {
    contactEmail: "hello@spitch.example",
    /** YouTube link (watch, youtu.be, shorts or embed) or a direct .mp4 URL. Empty shows "coming soon". */
    videoUrl: "",
    /** Leave empty until the date is confirmed. When set, it appears in the FAQ answer about the launch. */
    launchDate: "",
  },

  region: REGION,

  seo: {
    title: `${BRAND} - Your idea deserves a team`,
    description: `Record a one-minute pitch. ${BRAND} matches you with people across ${REGION} who have the skills to build it with you.`,
    ogImageAlt: `${BRAND}: Your idea deserves a team.`,
  },

  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main",
    home: `${BRAND} home`,
    phoneMockup: (p: Pitch) =>
      `Illustration of the ${BRAND} app: a pitch card for "${p.title}" with a compatibility score of ${p.score} out of 5 and the skills it needs.`,
    score: (n: number) => `Compatibility ${n} out of 5`,
    playVideo: "Play the launch video",
    videoTitle: `${BRAND} launch video`,
  },

  nav: {
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "For you", href: "#for-you" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Join the waitlist",
  },

  hero: {
    badge: `Launching first in ${REGION}`,
    headline: "Your idea deserves a team.",
    subline: `Record a one-minute pitch. ${BRAND} matches you with people across ${REGION} who have the skills to build it with you.`,
    primaryCta: "Join the waitlist",
    secondaryCta: "How it works",
  },

  /** Words used inside the mock app UI (hero phone and example pitch cards). */
  mockUi: {
    videoPitch: "Video pitch",
    aiSummary: "AI summary",
    needs: "Needs",
    compatibility: "Compatibility",
    pass: "Pass",
    interested: "Interested",
  },

  video: {
    title: `See ${BRAND} in one minute`,
    comingSoon: "Launch video coming soon",
  },

  problem: {
    title: "Great ideas die alone.",
    cards: [
      { title: "Ideas without a team", body: "People have ideas but no one to build them with." },
      { title: "Skills without a project", body: "People have skills but nothing real to work on." },
      { title: "Experience is hard to get", body: "Co-ops, internships and first jobs are hard to land without real projects to show." },
    ],
  },

  howItWorks: {
    title: "How it works",
    steps: [
      { title: "Record your pitch", body: "30 to 60 seconds. Add more detail if you want." },
      { title: "Get matched", body: `${BRAND}'s AI summarizes your idea, suggests the skills it needs and scores how compatible people are, out of 5.` },
      { title: "Swipe and chat", body: "Match with the right people and introduce yourselves." },
      { title: "Meet and build", body: "In person or on a call. Share your full idea when you're ready." },
    ],
  },

  forYou: {
    title: "For you",
    pitchers: {
      label: "For pitchers",
      title: "Got an idea? Find the people who can build it.",
      benefits: [
        "Get seen by people nearby with the right skills",
        "List exactly what you need, from skills to funding",
        "You decide when to share your full idea",
      ],
      cta: "Join the waitlist",
    },
    builders: {
      label: "For builders",
      title: "Got skills? Find a project worth building.",
      benefits: [
        "Work on real ideas, not exercises",
        "Build experience you can put on your resume",
        `Meet people across ${REGION}`,
      ],
      cta: "Join the waitlist",
    },
    teamUp: "Same idea as someone else? Team up instead of competing.",
  },

  examples: {
    title: "Example pitches",
    label: "for illustration",
    pitches: [
      {
        title: "Campus food rescue",
        summary: "Connects cafeterias' leftover food with students at closing time.",
        needs: ["Mobile developer", "UX designer"],
        score: 4,
      },
      {
        title: "Study room finder",
        summary: "Shows free study rooms on campus in real time.",
        needs: ["Backend developer", "Marketing"],
        score: 5,
      },
      {
        title: "Solar bike chargers",
        summary: "Solar charging stations for e-bikes around the city.",
        needs: ["Electrical engineer", "Funding"],
        score: 3,
      },
    ] satisfies Pitch[],
  },

  why: {
    lead: "Building something is worth it, even when it doesn't work out.",
    rest: "Every project teaches you something, connects you with someone, and gives you something real to show.",
  },

  trust: {
    title: "Built for people who mean it",
    items: [
      { title: "Local only", body: `${REGION} at launch, and you can only post from inside the region.` },
      { title: "Faces optional", body: "Your idea speaks first." },
      { title: "You control your idea", body: "Others see your pitch and summary; your full idea is shared only when you choose." },
      { title: "Everyone's there on purpose", body: "The small posting fee keeps out spam and scams." },
    ],
  },

  pricing: {
    title: "Pricing",
    plans: [
      { name: "Launch period", price: "Free", body: "Post, match and chat for free while we launch." },
      { name: "After launch", price: "$5", unit: "per pitch", body: "About the price of a coffee." },
    ],
    guarantee: "No traction? Get a free re-push or a $5 credit toward your next pitch.",
    note: "Final pricing is confirmed before the free period ends.",
  },

  faq: {
    title: "FAQ",
    items: [
      {
        q: `What is ${BRAND}?`,
        a: `A local app that matches people who have ideas with people who have the skills to build them, starting in ${REGION}.`,
      },
      {
        q: "Who is it for?",
        a: "Anyone with an idea who needs a team, and anyone with skills who wants a real project: students, recent grads, makers and builders.",
      },
      {
        q: "How does matching work?",
        a: `You record a 30 to 60 second pitch and list what you need. ${BRAND}'s AI summarizes your idea, suggests the skills it needs and shows a compatibility score out of 5. More detail means better matches.`,
      },
      {
        q: "Is it free?",
        a: "Yes, during the launch period. After that, posting a pitch costs $5. If your pitch gets no traction, you get a free re-push or a $5 credit.",
      },
      {
        q: "Why charge at all?",
        a: `So everyone on ${BRAND} is there on purpose. A small fee keeps out low-effort posts, spam and scams.`,
      },
      {
        q: "Is my idea safe?",
        a: "Other users see your pitch and its summary. Your full idea is shared only when you decide, with whoever you decide. You can meet in person or on a video call first.",
      },
      { q: "Do I need to show my face?", a: "No. Faces are optional." },
      {
        q: `Why only ${REGION}?`,
        a: "Starting local means people can actually meet, and it keeps the community real. Pitches can only be posted from inside the region.",
      },
      {
        q: "What happens after a match?",
        a: `You chat, introduce yourselves and decide together. ${BRAND}'s job ends at the connection. We link to agreement examples for inspiration.`,
      },
      {
        q: "When does it launch?",
        a: "Join the waitlist and you'll be the first to know.",
        /** Used instead of `a` once placeholders.launchDate is filled in. */
        withDate: (date: string) => `${BRAND} is planned to launch on ${date}. Join the waitlist and you'll be the first to know.`,
      },
    ],
  },

  finalCta: {
    title: "Be first in.",
    subline: `Join the waitlist and get early access when ${BRAND} launches in ${REGION}.`,
  },

  form: {
    email: { label: "Email", placeholder: "you@example.com" },
    role: {
      legend: "I'm a...",
      options: [
        { value: "pitcher", label: "Pitcher" },
        { value: "builder", label: "Builder" },
        { value: "both", label: "Both" },
      ] satisfies { value: Role; label: string }[],
    },
    organization: { label: "School or workplace", hint: "Optional, up to 100 characters." },
    region: {
      legend: `Are you in ${REGION}?`,
      yes: "Yes",
      no: "No",
      outsideNote: `${BRAND} launches in ${REGION} first. We'll let you know when we reach you.`,
    },
    consent: `I agree to receive emails from ${BRAND} about the launch. I can unsubscribe anytime.`,
    honeypotLabel: "Leave this field empty",
    submit: "Join the waitlist",
    submitting: "Joining...",
    errors: {
      summary: "Please fix the highlighted fields.",
      emailRequired: "Enter your email address.",
      emailInvalid: "Enter a valid email address, like name@example.com.",
      roleRequired: "Choose Pitcher, Builder or Both.",
      organizationTooLong: "Keep this under 100 characters.",
      regionRequired: "Choose Yes or No.",
      consentRequired: "Tick the box so we can email you about the launch.",
      network: "Something went wrong and you're not on the list yet. Please try again.",
    },
    success: {
      title: "You're on the list.",
      duplicateTitle: "You're already on the list.",
      body: `We'll email you when ${BRAND} launches.`,
    },
  },

  footer: {
    madeIn: `Made in ${REGION}`,
    privacy: "Privacy",
    terms: "Terms",
    rights: (year: number) => `© ${year} ${BRAND}`,
  },

  legal: {
    draftBanner: "DRAFT - to be reviewed before launch",
    pageTitle: (title: string) => `${title} (draft) - ${BRAND}`,
    back: `Back to ${BRAND}`,
    updated: "Draft for the pre-launch waitlist.",
    privacy: {
      title: "Privacy policy",
      sections: [
        {
          heading: "What the waitlist collects",
          body: [
            "When you join the waitlist we collect: your email address, whether you're a pitcher, a builder or both, your school or workplace if you choose to give it, your answer to whether you're in Ottawa–Gatineau, and your consent to receive emails about the launch.",
          ],
        },
        {
          heading: "How we use it",
          body: [`We use this information only to send you updates about the ${BRAND} launch.`],
        },
        {
          heading: "Unsubscribing",
          body: ["You can unsubscribe at any time using the link in any email we send, or by writing to us."],
        },
        {
          heading: "Deleting your information",
          body: ["To have your information deleted, email us at the address below and we will delete it."],
        },
      ],
      contact: "Contact:",
    },
    terms: {
      title: "Terms",
      sections: [
        {
          heading: "Pre-launch waitlist only",
          body: [`This site is a waitlist for ${BRAND} before it launches. Joining the waitlist does not create an account.`],
        },
        {
          heading: "No purchase",
          body: ["Joining the waitlist is free. Nothing is sold on this site and no payment is taken."],
        },
        {
          heading: "Details may change",
          body: [`Features, pricing and launch details described on this site may change before ${BRAND} launches.`],
        },
      ],
      contact: "Questions:",
    },
  },

  notFound: {
    pageTitle: `Page not found - ${BRAND}`,
    title: "Page not found",
    body: "That page doesn't exist.",
    back: `Back to ${BRAND}`,
  },
} as const;
