# Curava — React + Vite

Multi-page healthcare site built with React 18, Vite 5 and React Router 6.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build locally
```

## Structure

```
src/
  data.js          all copy, image URLs, doctors, programs, articles — edit content here
  utils.js         validators
  styles/global.css
  components/      Header, Footer, Layout, Button, Reveal, Counter, Marquee,
                   ReviewSlider, DoctorCard, Filters, Faq, InfoCard, PageHero, CtaCards, Toast
  pages/           Home, Programs, Specialists, Insights, About, Contact, NotFound
```

## Routes

`/`, `/programs`, `/specialists`, `/insights`, `/about`, `/contact` (`?tab=book&doctor=Name` opens booking prefilled).

## Images

Demo photos are hot-linked from Unsplash and randomuser.me in `src/data.js`.
To use your own, put files in `public/images/` and change the URLs to `/images/your-file.jpg`.

## Forms

Contact and booking forms validate in the browser and store submissions in `localStorage`
(`curava_messages`, `curava_appointments`). Hook `submit` in `src/pages/Contact.jsx` up to
your backend, Formspree, EmailJS, etc. to receive them.

## Deploying

Uses client-side routing, so the host must serve `index.html` for every path.
`vercel.json` (Vercel) and `public/_redirects` (Netlify) are already included.
