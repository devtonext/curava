/*
  Dashboard configuration. Each entry describes an editable section (stored in `site_content`)
  or a collection table. Add a field here + use it in a page and the dashboard picks it up.

  Field types: text, textarea, title (multi-line heading), list (one item per line), tags (comma separated),
  image, number, select, boolean, color, date, url, slug, markdown
*/

const TONES = [
  { value: "default", label: "White" },
  { value: "purple", label: "Primary colour" },
  { value: "yellow", label: "Accent colour" },
];

export const PAGES = [
  {
    id: "site",
    label: "Site settings",
    description: "Brand, colours, announcement bar, SEO and contact details used across every page.",
    sections: [
      {
        key: "general", title: "Brand & theme", fields: [
          { name: "brand_name", label: "Brand name", type: "text" },
          { name: "brand_tagline", label: "Tagline", type: "text" },
          { name: "primary_color", label: "Primary colour", type: "color" },
          { name: "accent_color", label: "Accent colour", type: "color" },
          { name: "footer_note", label: "Footer copyright text", type: "text", full: true },
        ],
      },
      {
        key: "general", title: "Announcement bar", fields: [
          { name: "announcement_enabled", label: "Show announcement bar", type: "boolean" },
          { name: "announcement_text", label: "Text", type: "text", full: true },
          { name: "announcement_link", label: "Link", type: "url", help: "Internal path like /programs or a full URL." },
        ],
      },
      {
        key: "seo", title: "SEO & sharing", fields: [
          { name: "meta_title", label: "Default page title", type: "text", full: true },
          { name: "meta_description", label: "Meta description", type: "textarea", full: true, help: "Around 150 characters works best." },
          { name: "og_image", label: "Social share image", type: "image", full: true },
        ],
      },
      {
        key: "contact", title: "Contact details & socials", fields: [
          { name: "phone", label: "Phone", type: "text" },
          { name: "email", label: "Email", type: "text" },
          { name: "address", label: "Address", type: "text", full: true },
          { name: "hours", label: "Opening hours", type: "text", full: true },
          { name: "map_embed_url", label: "Map embed URL", type: "url", full: true, help: "Google Maps → Share → Embed a map → copy the src URL. Leave empty to hide the map." },
          { name: "instagram", label: "Instagram", type: "url" },
          { name: "linkedin", label: "LinkedIn", type: "url" },
          { name: "x", label: "X / Twitter", type: "url" },
          { name: "facebook", label: "Facebook", type: "url" },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Home",
    path: "/",
    collections: ["features", "stats", "doctors", "reviews", "partners", "articles"],
    sections: [
      {
        key: "home_hero", title: "Hero", fields: [
          { name: "title", label: "Headline", type: "title", full: true },
          { name: "subtitle", label: "Subtitle", type: "textarea", full: true },
          { name: "cta_label", label: "Button label", type: "text" },
          { name: "cta_link", label: "Button link", type: "url" },
          { name: "image_url", label: "Main image", type: "image" },
          { name: "stat_image_url", label: "Stat card image", type: "image" },
          { name: "circle_label", label: "Round button label", type: "text" },
          { name: "circle_link", label: "Round button link", type: "url" },
          { name: "stat_prefix", label: "Stat prefix", type: "text" },
          { name: "stat_value", label: "Stat value", type: "number" },
          { name: "stat_suffix", label: "Stat suffix", type: "text" },
          { name: "stat_caption", label: "Stat caption", type: "text" },
        ],
      },
      {
        key: "home_features", title: "Feature highlight", fields: [
          { name: "tags", label: "Tags", type: "tags", full: true },
          { name: "title", label: "Title", type: "text", full: true },
          { name: "text", label: "Text", type: "textarea", full: true },
          { name: "cta_label", label: "Button label", type: "text" },
          { name: "cta_link", label: "Button link", type: "url" },
        ],
      },
      {
        key: "home_sections", title: "Section headings", fields: [
          { name: "partners_title", label: "Partners strip title", type: "text", full: true },
          { name: "marquee", label: "Scrolling banner words", type: "list", full: true },
          { name: "stats_title", label: "Stats title", type: "title" },
          { name: "stats_text", label: "Stats text", type: "textarea" },
          { name: "specialists_title", label: "Specialists title", type: "title" },
          { name: "specialists_cta", label: "Specialists button", type: "text" },
          { name: "reviews_title", label: "Reviews title", type: "title" },
          { name: "insights_title", label: "Insights title", type: "title" },
          { name: "cta_title", label: "Contact cards title", type: "title" },
        ],
      },
    ],
  },
  {
    id: "programs",
    label: "Programs",
    path: "/programs",
    collections: ["programs", "steps", "plans", "faqs"],
    sections: [
      {
        key: "programs_page", title: "Page header", fields: [
          { name: "title", label: "Title", type: "title" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "cta_label", label: "Button label", type: "text" },
          { name: "banner_image", label: "Banner image", type: "image", full: true },
          { name: "banner_value", label: "Banner stat", type: "number" },
          { name: "banner_suffix", label: "Banner stat suffix", type: "text" },
          { name: "banner_caption", label: "Banner caption", type: "text", full: true },
        ],
      },
      {
        key: "programs_page", title: "Sections", fields: [
          { name: "grid_title", label: "Programs title", type: "title" },
          { name: "grid_text", label: "Programs text", type: "textarea" },
          { name: "why_eyebrow", label: "Why-it-works label", type: "text" },
          { name: "why_title", label: "Why-it-works title", type: "title" },
          { name: "why_points", label: "Why-it-works points", type: "list", full: true },
          { name: "why_image", label: "Why-it-works image", type: "image", full: true },
          { name: "marquee", label: "Scrolling banner words", type: "list" },
          { name: "steps_title", label: "Steps title", type: "title" },
          { name: "pricing_title", label: "Pricing title", type: "title" },
          { name: "pricing_text", label: "Pricing text", type: "textarea" },
          { name: "faq_title", label: "FAQ title", type: "title" },
        ],
      },
    ],
  },
  {
    id: "specialists",
    label: "Specialists",
    path: "/specialists",
    collections: ["doctors"],
    sections: [
      {
        key: "specialists_page", title: "Page content", fields: [
          { name: "title", label: "Title", type: "title" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "marquee", label: "Scrolling banner words", type: "list" },
          { name: "cta_title", label: "Contact cards title", type: "title" },
        ],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    path: "/insights",
    collections: ["articles"],
    sections: [
      {
        key: "insights_page", title: "Page content", fields: [
          { name: "title", label: "Title", type: "title" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "newsletter_title", label: "Newsletter title", type: "title" },
          { name: "newsletter_text", label: "Newsletter text", type: "textarea" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    collections: ["company_values", "milestones"],
    sections: [
      {
        key: "about_page", title: "Page header", fields: [
          { name: "title", label: "Title", type: "title" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "banner_image", label: "Banner image", type: "image", full: true },
          { name: "banner_value", label: "Banner stat", type: "number" },
          { name: "banner_suffix", label: "Banner stat suffix", type: "text" },
          { name: "banner_caption", label: "Banner caption", type: "text", full: true },
        ],
      },
      {
        key: "about_page", title: "Sections", fields: [
          { name: "mission_eyebrow", label: "Mission label", type: "text" },
          { name: "mission_title", label: "Mission title", type: "title" },
          { name: "mission_text", label: "Mission text", type: "textarea", full: true },
          { name: "mission_text_2", label: "Mission text (second paragraph)", type: "textarea", full: true },
          { name: "values_title", label: "Values title", type: "title" },
          { name: "values_text", label: "Values text", type: "textarea" },
          { name: "timeline_title", label: "Timeline title", type: "title", full: true },
          { name: "careers_eyebrow", label: "Careers label", type: "text" },
          { name: "careers_title", label: "Careers title", type: "title" },
          { name: "careers_points", label: "Careers points", type: "list", full: true },
          { name: "careers_image", label: "Careers image", type: "image", full: true },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    sections: [
      {
        key: "contact_page", title: "Page content & forms", fields: [
          { name: "title", label: "Title", type: "title" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "topics", label: "Message topics", type: "list" },
          { name: "time_slots", label: "Booking time slots", type: "list" },
          { name: "message_success", label: "Message sent text", type: "textarea" },
          { name: "booking_success", label: "Booking sent text", type: "textarea" },
        ],
      },
    ],
  },
];

export const COLLECTIONS = {
  doctors: {
    label: "Specialists", singular: "specialist", titleField: "name", subtitleField: "role", imageField: "image_url",
    description: "Doctors shown on the Specialists page. Mark up to 4 as featured to show them on the home page.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role / specialty", type: "text" },
      { name: "years", label: "Years of experience", type: "number" },
      { name: "categories", label: "Filter categories", type: "tags", help: "Comma separated, e.g. Genetics, Hormones" },
      { name: "image_url", label: "Photo", type: "image", full: true },
      { name: "bio", label: "Bio", type: "textarea", full: true },
      { name: "featured", label: "Feature on home page", type: "boolean" },
    ],
  },
  articles: {
    label: "Articles", singular: "article", titleField: "title", subtitleField: "category", imageField: "image_url",
    description: "Posts for the Insights page. The article marked as featured is shown large at the top.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, full: true },
      { name: "slug", label: "URL slug", type: "slug", from: "title", required: true, help: "Used in the address: /insights/your-slug" },
      { name: "category", label: "Category", type: "text" },
      { name: "author", label: "Author", type: "text" },
      { name: "published_at", label: "Publish date", type: "date" },
      { name: "read_minutes", label: "Read time (minutes)", type: "number" },
      { name: "featured", label: "Featured article", type: "boolean" },
      { name: "image_url", label: "Cover image", type: "image", full: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "body", label: "Body", type: "markdown", full: true, help: "Leave a blank line between paragraphs. Start a line with ## for a heading." },
    ],
  },
  reviews: {
    label: "Reviews", singular: "review", titleField: "name", subtitleField: "meta", imageField: "avatar_url",
    description: "Patient testimonials in the home page slider.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "meta", label: "Subtitle", type: "text" },
      { name: "rating", label: "Rating", type: "select", options: [5, 4, 3, 2, 1].map(n => ({ value: n, label: `${n} stars` })) },
      { name: "avatar_url", label: "Avatar", type: "image" },
      { name: "quote", label: "Quote", type: "textarea", full: true, required: true },
    ],
  },
  features: {
    label: "Home features", singular: "feature", titleField: "title", subtitleField: "text", imageField: "image_url",
    description: "The list next to the large image on the home page (image swaps on hover).",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Short text", type: "text" },
      { name: "image_url", label: "Image", type: "image", full: true },
    ],
  },
  stats: {
    label: "Stats", singular: "stat", titleField: "label", subtitleField: "value",
    description: "Animated numbers on the home page.",
    fields: [
      { name: "prefix", label: "Prefix", type: "text" },
      { name: "value", label: "Value", type: "number", required: true },
      { name: "suffix", label: "Suffix", type: "text" },
      { name: "tone", label: "Card colour", type: "select", options: TONES },
      { name: "label", label: "Label", type: "text", required: true, full: true },
    ],
  },
  programs: {
    label: "Programs", singular: "program", titleField: "title", subtitleField: "text",
    description: "Program cards on the Programs page (also used in the booking form).",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "tone", label: "Card colour", type: "select", options: TONES },
      { name: "text", label: "Description", type: "textarea", full: true },
    ],
  },
  plans: {
    label: "Pricing plans", singular: "plan", titleField: "name", subtitleField: "price",
    description: "Membership pricing table on the Programs page.",
    fields: [
      { name: "name", label: "Plan name", type: "text", required: true },
      { name: "price", label: "Price", type: "text", required: true },
      { name: "period", label: "Period", type: "text", help: "e.g. /month" },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "description", label: "Short description", type: "text", full: true },
      { name: "features", label: "Included features", type: "list", full: true },
      { name: "highlighted", label: "Highlight as most popular", type: "boolean" },
    ],
  },
  steps: {
    label: "Process steps", singular: "step", titleField: "title", subtitleField: "text",
    description: "The 'how it works' steps on the Programs page.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Text", type: "textarea", full: true },
    ],
  },
  faqs: {
    label: "FAQs", singular: "question", titleField: "question", subtitleField: "answer",
    description: "Questions on the Programs page.",
    fields: [
      { name: "question", label: "Question", type: "text", required: true, full: true },
      { name: "answer", label: "Answer", type: "textarea", required: true, full: true },
    ],
  },
  company_values: {
    label: "Values", singular: "value", titleField: "title", subtitleField: "text",
    description: "Value cards on the About page.",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "tone", label: "Card colour", type: "select", options: TONES },
      { name: "text", label: "Text", type: "textarea", full: true },
    ],
  },
  milestones: {
    label: "Timeline", singular: "milestone", titleField: "title", subtitleField: "year",
    description: "Company history on the About page.",
    fields: [
      { name: "year", label: "Year", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Text", type: "textarea", full: true },
    ],
  },
  partners: {
    label: "Partners", singular: "partner", titleField: "name", imageField: "logo_url",
    description: "Logo strip on the home page. Without a logo image, the name is shown as a wordmark.",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo_url", label: "Logo (optional)", type: "image" },
    ],
  },
};

export const INBOX = {
  messages: {
    label: "Messages", statuses: ["new", "read", "archived"],
    columns: [["name", "Name"], ["email", "Email"], ["topic", "Topic"], ["message", "Message"]],
  },
  appointments: {
    label: "Appointments", statuses: ["pending", "confirmed", "completed", "cancelled"],
    columns: [["name", "Name"], ["phone", "Phone"], ["email", "Email"], ["program", "Program"], ["specialist", "Specialist"], ["preferred_date", "Date"], ["preferred_time", "Time"], ["notes", "Notes"]],
  },
  subscribers: {
    label: "Subscribers",
    columns: [["email", "Email"]],
  },
};

export const emptyRow = fields =>
  Object.fromEntries(fields.map(f => [f.name,
    f.type === "boolean" ? false
      : f.type === "list" || f.type === "tags" ? []
      : f.type === "select" ? f.options[0].value
      : f.type === "number" ? null
      : ""]));
