// Demo imagery from Unsplash (free to use) and randomuser.me. Swap any URL for your own assets.
const u = (id, w = 1200, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=80`;

export const images = {
  hero: u("1612349317150-e413f6a5b16d", 900, 1100),
  dnaCard: u("1628595351029-c2bf17511435", 700, 700),
  servicesBanner: u("1579154204601-01588f351e67", 1800, 800),
  servicesDetail: u("1631815589968-fdb09a223b1e", 1100, 940),
  aboutBanner: u("1600880292203-757bb62b4baf", 1800, 800),
  aboutTeam: u("1631217868264-e5b90bb7e133", 1100, 940),
};

export const features = [
  { title: "Whole-body screening", text: "One visit, 120+ biomarkers reviewed", img: u("1532187863486-abf9dbad1b69", 900, 900) },
  { title: "Genomic risk mapping", text: "Know what your DNA is telling you", img: u("1628595351029-c2bf17511435", 900, 900) },
  { title: "Personal care plans", text: "Built with you, adjusted as you change", img: u("1581056771107-24ca5f033842", 900, 900) },
];

export const stats = [
  { value: 38, suffix: "k+", label: "Patients supported since launch" },
  { value: 48, suffix: "h", label: "Average time to a specialist review", tone: "purple" },
  { value: 120, suffix: "+", label: "Biomarkers in every core panel" },
  { value: 4.9, suffix: "/5", label: "Average patient satisfaction score", tone: "yellow" },
];

export const doctors = [
  { name: "Dr. Amara Okafor", role: "Cardiology", years: 14, cat: ["heart"], img: u("1651008376811-b90baee60c1f", 700, 770) },
  { name: "Dr. Liam Hartley", role: "Clinical Genetics", years: 11, cat: ["genetics"], img: u("1537368910025-700350fe46c7", 700, 770) },
  { name: "Dr. Sofia Marín", role: "Dermatology", years: 9, cat: ["skin"], img: u("1594824476967-48c8b964273f", 700, 770) },
  { name: "Dr. Marcus Reyes", role: "Endocrinology", years: 16, cat: ["hormones"], img: u("1622253692010-333f2da6031d", 700, 770) },
  { name: "Dr. Elena Rossi", role: "Family Medicine", years: 12, cat: ["general"], img: u("1559839734-2b71ea197ec2", 700, 770) },
  { name: "Dr. Arjun Mehta", role: "Vascular Medicine", years: 8, cat: ["heart"], img: u("1582750433449-648ed127bb54", 700, 770) },
  { name: "Dr. Noor Haddad", role: "Metabolic Genomics", years: 10, cat: ["genetics", "hormones"], img: u("1527613426441-4da17471b66d", 700, 770) },
  { name: "Dr. Claire Whitman", role: "Preventive Medicine", years: 19, cat: ["general", "skin"], img: u("1631217868264-e5b90bb7e133", 700, 770) },
];

export const doctorFilters = [
  { id: "all", label: "All" },
  { id: "heart", label: "Heart & vascular" },
  { id: "genetics", label: "Genetics" },
  { id: "skin", label: "Skin" },
  { id: "hormones", label: "Hormones" },
  { id: "general", label: "General practice" },
];

export const reviews = [
  {
    quote: "For years I was told my fatigue was ‘just stress’. Curava's screening found a thyroid issue in one visit, and my specialist walked me through every number. I finally feel like myself again.",
    name: "Hannah Lindqvist", meta: "Product designer, member since 2024",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "The genomic report sounded intimidating, but the follow-up call made it simple. I left with three concrete changes and a plan I actually stick to.",
    name: "Marcus Bell", meta: "Teacher, member since 2023",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Booking took two minutes, results came back in two days, and nobody rushed me. That's not something I can say about any clinic I've visited before.",
    name: "Priya Raman", meta: "Founder, member since 2025",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export const programs = [
  { title: "Whole-body screening", text: "A single morning visit covering heart, metabolic, hormonal and organ health markers." },
  { title: "Genomic risk mapping", text: "Understand inherited risks and how your lifestyle can shift the odds in your favour.", tone: "purple" },
  { title: "Chronic care partnership", text: "Ongoing support for diabetes, hypertension and thyroid conditions with monthly check-ins." },
  { title: "Skin & longevity", text: "Dermatology mapping and cellular health markers to keep you ahead of visible change." },
  { title: "Virtual follow-ups", text: "Video consultations that slot into a lunch break, with notes sent straight to your inbox.", tone: "yellow" },
  { title: "Family health plans", text: "One coordinated plan for the whole household, from kids' check-ups to parents' screenings." },
];

export const steps = [
  { title: "Book a visit", text: "Choose a time online or call the care desk. Takes about two minutes." },
  { title: "Get screened", text: "A relaxed, 60-minute visit at one of our clinics or a partner lab." },
  { title: "Review together", text: "Your specialist walks you through the results within 48 hours." },
  { title: "Follow your plan", text: "Check-ins, reminders and re-tests keep you on track over time." },
];

export const faqs = [
  { q: "Do I need a referral to join a program?", a: "No. You can book directly. If you already have a GP, we'll happily share your results with them once you give consent." },
  { q: "How long until I get my results?", a: "Most results arrive within 48 hours. Genomic reports take 3–4 weeks, and we'll keep you updated along the way." },
  { q: "Is my health data kept private?", a: "Yes. Your data is encrypted, never sold, and only visible to you and the clinicians directly involved in your care." },
  { q: "Can I switch programs later?", a: "Absolutely. Upgrades are credited against what you've already paid, and you can pause a membership at any time." },
];

export const featuredArticle = {
  title: "What 38,000 screenings taught us about catching problems early",
  text: "Our clinical team shares the patterns hiding in routine bloodwork — and the three markers most people never get checked.",
  img: u("1614935151651-0bea6508db6b", 1200, 830),
};

export const articleFilters = [
  { id: "all", label: "All" },
  { id: "research", label: "Research" },
  { id: "stories", label: "Patient stories" },
  { id: "news", label: "News" },
];

export const articles = [
  { cat: "research", tag: "Research", read: 6, title: "Your genes load the dice — your habits still roll them", text: "Why a genetic risk score is a starting point, not a verdict.", img: u("1576086213369-97a306d36557", 900, 620) },
  { cat: "stories", tag: "Patient story", read: 4, title: "“I thought I was just tired.” Hannah's thyroid journey", text: "How one screening ended three years of guesswork.", img: u("1638202993928-7267aad84c31", 900, 620) },
  { cat: "news", tag: "News", read: 2, title: "Curava opens its fourth clinic, with evening hours", text: "Screenings now available until 9pm on weekdays.", img: u("1551076805-e1869033e561", 900, 620) },
  { cat: "research", tag: "Research", read: 7, title: "The quiet rise of insulin resistance in people under 40", text: "What the numbers show, and the simple test that spots it.", img: u("1498837167922-ddd27525d352", 900, 620) },
  { cat: "stories", tag: "Patient story", read: 5, title: "Marcus turned a scary report into a 3-step plan", text: "A teacher's take on making genomic results practical.", img: u("1571019613454-1cb2f99b2d8b", 900, 620) },
  { cat: "news", tag: "News", read: 3, title: "New patient portal: every result, one tap away", text: "Track trends, message your specialist and rebook in seconds.", img: u("1576091160399-112ba8d25d1d", 900, 620) },
];

export const values = [
  { title: "Clarity over volume", text: "Fewer, better tests — each one chosen for a reason we can explain to you." },
  { title: "Time is care", text: "Longer appointments and follow-ups that don't feel like a favour.", tone: "purple" },
  { title: "Your data, your call", text: "Encrypted, never sold, and shared only when you say so.", tone: "yellow" },
];

export const timeline = [
  { year: "2019", title: "A kitchen-table idea", text: "Two physicians and a data scientist sketch a clinic where results come with explanations." },
  { year: "2021", title: "First clinic opens", text: "Our flagship location welcomes its first 1,000 patients in under six months." },
  { year: "2023", title: "Genomics program launches", text: "Risk mapping becomes available, paired with specialist-led counselling sessions." },
  { year: "2026", title: "Four clinics & a new portal", text: "Evening hours, virtual follow-ups and every result in one place." },
];

export const contact = {
  phone: "+1 (800) 555-0199",
  phoneHref: "tel:+18005550199",
  email: "hello@curava.health",
  address: "210 Meridian Ave, Suite 4, Austin TX",
  hours: "Mon–Fri 7am–9pm · Sat 8am–2pm",
};
