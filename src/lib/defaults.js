// Default content. Used as demo data when Supabase isn't configured, and as the source
// for supabase/seed.sql (regenerate with `npm run build:sql`).
// Keys are snake_case so they map 1:1 to database columns.

const u = (id, w = 1200, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const defaultContent = {
  general: {
    brand_name: "Curava",
    brand_tagline: "Precision care, human touch",
    primary_color: "#5a47cf",
    accent_color: "#fff27d",
    announcement_enabled: true,
    announcement_text: "New: evening screenings now available at all four clinics.",
    announcement_link: "/contact?tab=book",
    footer_note: "Curava Health. All rights reserved.",
  },
  seo: {
    meta_title: "Curava — Precision care, human touch",
    meta_description: "Curava pairs data-driven diagnostics with specialists who listen, so you get care that's built around you.",
    og_image: u("1612349317150-e413f6a5b16d", 1200, 630),
  },
  contact: {
    phone: "+1 (800) 555-0199",
    email: "hello@curava.health",
    address: "210 Meridian Ave, Suite 4, Austin TX",
    hours: "Mon–Fri 7am–9pm · Sat 8am–2pm",
    map_embed_url: "https://www.openstreetmap.org/export/embed.html?bbox=-97.76%2C30.25%2C-97.72%2C30.28&layer=mapnik",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    facebook: "",
  },
  home_hero: {
    title: "Care That\nThinks Ahead.",
    subtitle: "Data-led diagnostics and specialists who actually listen — so every decision about your health starts with the full picture.",
    cta_label: "Talk to us",
    cta_link: "/contact",
    image_url: u("1612349317150-e413f6a5b16d", 900, 1100),
    circle_label: "Explore Programs",
    circle_link: "/programs",
    stat_value: 94.7,
    stat_prefix: "+",
    stat_suffix: "%",
    stat_caption: "Early-detection accuracy across our screening panels",
    stat_image_url: u("1628595351029-c2bf17511435", 700, 700),
  },
  home_features: {
    tags: ["Genomics", "Specialists"],
    title: "The quiet signals your body sends — finally decoded.",
    text: "We translate lab results into plain language and a clear next step, reviewed by a specialist within 48 hours.",
    cta_label: "See how it works",
    cta_link: "/programs",
  },
  home_sections: {
    marquee: ["Smarter diagnostics", "Human-first care"],
    partners_title: "Trusted by leading labs, insurers and research partners",
    stats_title: "Numbers that\nkeep us honest.",
    stats_text: "Every metric below is tracked quarterly and shared openly with our patient community.",
    specialists_title: "Meet the people\nbehind your care.",
    specialists_cta: "All specialists",
    reviews_title: "What our patients\ntell their friends",
    insights_title: "Fresh from\nthe journal.",
    cta_title: "Reach out,\nwe'll take it from here",
  },
  programs_page: {
    title: "Programs built\naround your life.",
    intro: "Pick a starting point. Every program includes a specialist review, a plain-language report and follow-ups that fit your calendar.",
    cta_label: "Start a program",
    banner_image: u("1579154204601-01588f351e67", 1800, 800),
    banner_value: 120,
    banner_suffix: "+",
    banner_caption: "Biomarkers reviewed in a single core screening",
    grid_title: "Six ways\nto get started.",
    grid_text: "Each program can be combined or upgraded at any point — your plan grows with you.",
    why_eyebrow: "Why it works",
    why_title: "Data you can read.\nPeople you can reach.",
    why_points: [
      "Results explained in everyday language — no jargon walls.",
      "A named specialist who follows your case from start to finish.",
      "Secure patient portal with every report in one place.",
      "Transparent pricing, agreed before any test is run.",
    ],
    why_image: u("1631815589968-fdb09a223b1e", 1100, 940),
    marquee: ["Screen", "Understand", "Plan", "Thrive"],
    steps_title: "From first call\nto clear plan.",
    pricing_title: "Simple, honest\nmembership.",
    pricing_text: "No surprise invoices. Every plan includes specialist reviews and your patient portal.",
    faq_title: "Questions,\nanswered.",
  },
  specialists_page: {
    title: "Experts who\nmake time.",
    intro: "Every Curava specialist is board-certified, sees fewer patients per day than the industry average, and is reachable after your visit.",
    marquee: ["Board-certified", "Never rushed", "Always reachable"],
    cta_title: "Not sure who\nto see first?",
  },
  insights_page: {
    title: "Insights &\nfield notes.",
    intro: "Research explained simply, stories from our patients, and updates from the Curava team.",
    newsletter_title: "Health notes,\ntwice a month.",
    newsletter_text: "No spam, no miracle cures — just useful research and reminders, in under five minutes.",
  },
  about_page: {
    title: "Healthcare that\nexplains itself.",
    intro: "Curava started with a simple frustration: people were getting tested more than ever, yet understanding less. We set out to close that gap.",
    banner_image: u("1600880292203-757bb62b4baf", 1800, 800),
    banner_value: 4,
    banner_suffix: "",
    banner_caption: "Clinics, 60+ clinicians and one shared promise",
    mission_eyebrow: "Our mission",
    mission_title: "Turn every result into a next step.",
    mission_text: "We combine modern diagnostics with clinicians who have the time to talk. The goal isn't more data — it's clarity: what's happening in your body, what it means, and what to do about it.",
    mission_text_2: "That means smaller patient lists, reports written for humans, and a care team you can actually message. It also means saying no to tests you don't need.",
    values_title: "What we\nstand for.",
    values_text: "Three principles guide every hire, every program and every conversation.",
    timeline_title: "How we got here.",
    careers_eyebrow: "Careers",
    careers_title: "Build the clinic you'd want to visit.",
    careers_points: [
      "Patient lists capped so you can practise properly.",
      "Four-day clinical weeks with protected research time.",
      "Equity for every full-time team member.",
    ],
    careers_image: u("1631217868264-e5b90bb7e133", 1100, 940),
  },
  contact_page: {
    title: "Contact\nfor health.",
    intro: "Questions about a program, a result, or just not sure where to start? Our care desk answers every message within one working day.",
    topics: ["Programs & pricing", "My results", "Billing", "Press & partnerships", "Something else"],
    time_slots: ["Morning (7–11am)", "Midday (11am–2pm)", "Afternoon (2–5pm)", "Evening (5–9pm)"],
    message_success: "We've received your message. A member of the care desk will reply within one working day.",
    booking_success: "Your appointment request is in. We'll call you within one working day to confirm the time.",
  },
};

const rows = (prefix, list) => list.map((r, i) => ({ id: `${prefix}-${i + 1}`, sort_order: i + 1, published: true, ...r }));

export const defaultCollections = {
  features: rows("feat", [
    { title: "Whole-body screening", text: "One visit, 120+ biomarkers reviewed", image_url: u("1532187863486-abf9dbad1b69", 900, 900) },
    { title: "Genomic risk mapping", text: "Know what your DNA is telling you", image_url: u("1628595351029-c2bf17511435", 900, 900) },
    { title: "Personal care plans", text: "Built with you, adjusted as you change", image_url: u("1581056771107-24ca5f033842", 900, 900) },
  ]),
  stats: rows("stat", [
    { value: 38, prefix: "", suffix: "k+", label: "Patients supported since launch", tone: "default" },
    { value: 48, prefix: "", suffix: "h", label: "Average time to a specialist review", tone: "purple" },
    { value: 120, prefix: "", suffix: "+", label: "Biomarkers in every core panel", tone: "default" },
    { value: 4.9, prefix: "", suffix: "/5", label: "Average patient satisfaction score", tone: "yellow" },
  ]),
  doctors: rows("doc", [
    { name: "Dr. Amara Okafor", role: "Cardiology", years: 14, categories: ["Heart & vascular"], featured: true, image_url: u("1651008376811-b90baee60c1f", 700, 770), bio: "Amara leads our preventive cardiology program and has spent 14 years helping patients understand their heart health before symptoms appear." },
    { name: "Dr. Liam Hartley", role: "Clinical Genetics", years: 11, categories: ["Genetics"], featured: true, image_url: u("1537368910025-700350fe46c7", 700, 770), bio: "Liam turns complex genomic reports into practical, personalised plans — and is known for never rushing a consultation." },
    { name: "Dr. Sofia Marín", role: "Dermatology", years: 9, categories: ["Skin"], featured: true, image_url: u("1594824476967-48c8b964273f", 700, 770), bio: "Sofia specialises in skin cancer screening and longevity-focused dermatology, combining imaging with clear, kind explanations." },
    { name: "Dr. Marcus Reyes", role: "Endocrinology", years: 16, categories: ["Hormones"], featured: true, image_url: u("1622253692010-333f2da6031d", 700, 770), bio: "Marcus works with patients managing thyroid, diabetes and hormonal conditions, with a focus on sustainable lifestyle change." },
    { name: "Dr. Elena Rossi", role: "Family Medicine", years: 12, categories: ["General practice"], featured: false, image_url: u("1559839734-2b71ea197ec2", 700, 770), bio: "Elena coordinates care for whole families, making sure nothing falls between the cracks." },
    { name: "Dr. Arjun Mehta", role: "Vascular Medicine", years: 8, categories: ["Heart & vascular"], featured: false, image_url: u("1582750433449-648ed127bb54", 700, 770), bio: "Arjun focuses on circulation and vascular health, from screening to long-term management." },
    { name: "Dr. Noor Haddad", role: "Metabolic Genomics", years: 10, categories: ["Genetics", "Hormones"], featured: false, image_url: u("1527613426441-4da17471b66d", 700, 770), bio: "Noor researches how genes and metabolism interact, and translates that research into everyday advice." },
    { name: "Dr. Claire Whitman", role: "Preventive Medicine", years: 19, categories: ["General practice", "Skin"], featured: false, image_url: u("1631217868264-e5b90bb7e133", 700, 770), bio: "Claire has nearly two decades of experience in preventive care and mentors our clinical team." },
  ]),
  reviews: rows("rev", [
    { name: "Hannah Lindqvist", meta: "Product designer, member since 2024", rating: 5, avatar_url: "https://randomuser.me/api/portraits/women/44.jpg", quote: "For years I was told my fatigue was ‘just stress’. Curava's screening found a thyroid issue in one visit, and my specialist walked me through every number. I finally feel like myself again." },
    { name: "Marcus Bell", meta: "Teacher, member since 2023", rating: 5, avatar_url: "https://randomuser.me/api/portraits/men/32.jpg", quote: "The genomic report sounded intimidating, but the follow-up call made it simple. I left with three concrete changes and a plan I actually stick to." },
    { name: "Priya Raman", meta: "Founder, member since 2025", rating: 5, avatar_url: "https://randomuser.me/api/portraits/women/68.jpg", quote: "Booking took two minutes, results came back in two days, and nobody rushed me. That's not something I can say about any clinic I've visited before." },
  ]),
  programs: rows("prog", [
    { title: "Whole-body screening", text: "A single morning visit covering heart, metabolic, hormonal and organ health markers.", tone: "default" },
    { title: "Genomic risk mapping", text: "Understand inherited risks and how your lifestyle can shift the odds in your favour.", tone: "purple" },
    { title: "Chronic care partnership", text: "Ongoing support for diabetes, hypertension and thyroid conditions with monthly check-ins.", tone: "default" },
    { title: "Skin & longevity", text: "Dermatology mapping and cellular health markers to keep you ahead of visible change.", tone: "default" },
    { title: "Virtual follow-ups", text: "Video consultations that slot into a lunch break, with notes sent straight to your inbox.", tone: "yellow" },
    { title: "Family health plans", text: "One coordinated plan for the whole household, from kids' check-ups to parents' screenings.", tone: "default" },
  ]),
  plans: rows("plan", [
    { name: "Essential", price: "$49", period: "/month", description: "For staying on top of the basics.", features: ["Annual core screening", "Specialist results review", "Patient portal access", "Email support"], highlighted: false, cta_label: "Choose Essential" },
    { name: "Complete", price: "$129", period: "/month", description: "Our most popular, all-round plan.", features: ["Twice-yearly screening", "Genomic risk mapping", "Unlimited virtual follow-ups", "Named specialist", "Priority booking"], highlighted: true, cta_label: "Choose Complete" },
    { name: "Family", price: "$299", period: "/month", description: "One plan for up to five people.", features: ["Everything in Complete", "Up to 5 members", "Family health coordinator", "Kids' check-ups included"], highlighted: false, cta_label: "Choose Family" },
  ]),
  steps: rows("step", [
    { title: "Book a visit", text: "Choose a time online or call the care desk. Takes about two minutes." },
    { title: "Get screened", text: "A relaxed, 60-minute visit at one of our clinics or a partner lab." },
    { title: "Review together", text: "Your specialist walks you through the results within 48 hours." },
    { title: "Follow your plan", text: "Check-ins, reminders and re-tests keep you on track over time." },
  ]),
  faqs: rows("faq", [
    { question: "Do I need a referral to join a program?", answer: "No. You can book directly. If you already have a GP, we'll happily share your results with them once you give consent." },
    { question: "How long until I get my results?", answer: "Most results arrive within 48 hours. Genomic reports take 3–4 weeks, and we'll keep you updated along the way." },
    { question: "Is my health data kept private?", answer: "Yes. Your data is encrypted, never sold, and only visible to you and the clinicians directly involved in your care." },
    { question: "Can I switch programs later?", answer: "Absolutely. Upgrades are credited against what you've already paid, and you can pause a membership at any time." },
  ]),
  articles: rows("art", [
    {
      slug: "what-38000-screenings-taught-us", title: "What 38,000 screenings taught us about catching problems early", category: "Research", read_minutes: 8, featured: true,
      excerpt: "Our clinical team shares the patterns hiding in routine bloodwork — and the three markers most people never get checked.",
      image_url: u("1614935151651-0bea6508db6b", 1400, 900), author: "Dr. Liam Hartley", published_at: "2026-09-18",
      body: "Since opening our first clinic, we've reviewed more than 38,000 screenings. Looking back across that data, a few patterns stand out.\n\n## The markers most people miss\nStandard check-ups usually cover cholesterol and blood sugar. But three markers — ApoB, HbA1c trends and thyroid antibodies — often reveal risk years earlier.\n\n## Trends beat snapshots\nA single result is a photo. Several results over time are a film. The biggest wins came from patients who re-tested every six to twelve months.\n\n## What you can do\nAsk for your numbers, keep copies, and look at the direction of travel. If something is drifting, it's far easier to steer early.",
    },
    {
      slug: "genes-load-the-dice", title: "Your genes load the dice — your habits still roll them", category: "Research", read_minutes: 6, featured: false,
      excerpt: "Why a genetic risk score is a starting point, not a verdict.", image_url: u("1576086213369-97a306d36557", 900, 620), author: "Dr. Noor Haddad", published_at: "2026-08-30",
      body: "A genetic risk score tells you about probability, not destiny.\n\n## Risk is a range\nEven a high-risk result usually means a modest change in absolute risk — and lifestyle can move it substantially.\n\n## Use it as a map\nThe most useful thing a genomic report does is tell you where to look first.",
    },
    {
      slug: "hannahs-thyroid-journey", title: "“I thought I was just tired.” Hannah's thyroid journey", category: "Patient stories", read_minutes: 4, featured: false,
      excerpt: "How one screening ended three years of guesswork.", image_url: u("1638202993928-7267aad84c31", 900, 620), author: "Curava Editorial", published_at: "2026-08-12",
      body: "For three years Hannah was told her exhaustion was stress.\n\n## One visit\nHer first Curava screening flagged thyroid antibodies. Two weeks later she had a diagnosis and a plan.\n\n## Today\n\"I didn't realise how bad I felt until I felt better,\" she says.",
    },
    {
      slug: "fourth-clinic-evening-hours", title: "Curava opens its fourth clinic, with evening hours", category: "News", read_minutes: 2, featured: false,
      excerpt: "Screenings now available until 9pm on weekdays.", image_url: u("1551076805-e1869033e561", 900, 620), author: "Curava Team", published_at: "2026-07-28",
      body: "Our newest clinic opens this month, and with it, evening screenings across all locations.\n\nBook online or call the care desk to choose a slot that fits around work.",
    },
    {
      slug: "insulin-resistance-under-40", title: "The quiet rise of insulin resistance in people under 40", category: "Research", read_minutes: 7, featured: false,
      excerpt: "What the numbers show, and the simple test that spots it.", image_url: u("1498837167922-ddd27525d352", 900, 620), author: "Dr. Marcus Reyes", published_at: "2026-07-02",
      body: "Insulin resistance often develops silently for years.\n\n## The test\nA fasting insulin test alongside glucose gives a far clearer picture than glucose alone.\n\n## The good news\nIt's highly responsive to sleep, movement and diet changes.",
    },
    {
      slug: "new-patient-portal", title: "New patient portal: every result, one tap away", category: "News", read_minutes: 3, featured: false,
      excerpt: "Track trends, message your specialist and rebook in seconds.", image_url: u("1576091160399-112ba8d25d1d", 900, 620), author: "Curava Team", published_at: "2026-06-15",
      body: "The new Curava portal puts every report, trend chart and message in one place.\n\nIt's available now on web, iOS and Android.",
    },
  ]),
  company_values: rows("val", [
    { title: "Clarity over volume", text: "Fewer, better tests — each one chosen for a reason we can explain to you.", tone: "default" },
    { title: "Time is care", text: "Longer appointments and follow-ups that don't feel like a favour.", tone: "purple" },
    { title: "Your data, your call", text: "Encrypted, never sold, and shared only when you say so.", tone: "yellow" },
  ]),
  milestones: rows("ms", [
    { year: "2019", title: "A kitchen-table idea", text: "Two physicians and a data scientist sketch a clinic where results come with explanations." },
    { year: "2021", title: "First clinic opens", text: "Our flagship location welcomes its first 1,000 patients in under six months." },
    { year: "2023", title: "Genomics program launches", text: "Risk mapping becomes available, paired with specialist-led counselling sessions." },
    { year: "2026", title: "Four clinics & a new portal", text: "Evening hours, virtual follow-ups and every result in one place." },
  ]),
  partners: rows("partner", [
    { name: "Helix Labs", logo_url: "" },
    { name: "NorthCare", logo_url: "" },
    { name: "Medisure", logo_url: "" },
    { name: "Genova", logo_url: "" },
    { name: "Pulse+", logo_url: "" },
    { name: "Vitalink", logo_url: "" },
  ]),
};

// Sample inbox data so the demo dashboard isn't empty.
const daysAgo = d => new Date(Date.now() - d * 864e5).toISOString();
export const defaultSubmissions = {
  messages: [
    { id: "msg-1", name: "Jordan Lee", email: "jordan@example.com", topic: "Programs & pricing", message: "Is the genomic program covered by HSA accounts?", status: "new", created_at: daysAgo(0.2) },
    { id: "msg-2", name: "Fatima Noor", email: "fatima@example.com", topic: "My results", message: "Could my specialist call me about my latest thyroid panel?", status: "read", created_at: daysAgo(2) },
  ],
  appointments: [
    { id: "apt-1", name: "Chris Evans", phone: "+1 555 201 3344", email: "chris@example.com", program: "Whole-body screening", specialist: "Dr. Amara Okafor", preferred_date: daysAgo(-3).slice(0, 10), preferred_time: "Morning (7–11am)", notes: "", status: "pending", created_at: daysAgo(0.5) },
    { id: "apt-2", name: "Maya Chen", phone: "+1 555 908 1122", email: "maya@example.com", program: "Genomic risk mapping", specialist: "Dr. Liam Hartley", preferred_date: daysAgo(-6).slice(0, 10), preferred_time: "Evening (5–9pm)", notes: "Prefer a virtual follow-up.", status: "confirmed", created_at: daysAgo(1.5) },
  ],
  subscribers: [
    { id: "sub-1", email: "reader@example.com", created_at: daysAgo(3) },
    { id: "sub-2", email: "health.fan@example.com", created_at: daysAgo(7) },
  ],
};
