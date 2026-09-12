# Nexode AI

Lead-generation marketing site for Nexode AI — Next.js App Router, Tailwind, GSAP, Three.js atmosphere, Google Sheets leads, Resend confirmations, Calendly booking.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in Google Sheets, Resend, Calendly, analytics IDs
npm run dev
```

### Google Sheets

1. Create a Google Cloud service account and enable the Sheets API.
2. Download a JSON key; put `client_email` and `private_key` in `.env.local`.
3. Create a spreadsheet and share it as **Editor** with the service account email.
4. Set `GOOGLE_SHEET_ID` from the sheet URL.

### Calendly

Set `NEXT_PUBLIC_CALENDLY_URL` to your event type URL. Enable reminders in the Calendly dashboard.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
